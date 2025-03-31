import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { updateItem } from "../../utils/aws/services/DDBDocumentClient_Services";
import { getConfig, replaceSpacesWithUnderscores } from "../../utils/helpers";
import { badRequest, okResponse } from "../../utils/response";

export const handler = async (event: any) => {

    try {

        const body = JSON.parse(event.body);
        const tableName = getConfig("DYNAMODB_TABLE_NAME");
        
        const key = {
                    pk: `finance#${body.email}`,
                    sk: `${body.investmentType}#${replaceSpacesWithUnderscores(body.investmentName)}`,
        };
        const totalProfit = body.returnsAmount - body.investmentAmount;
        const isProfit = totalProfit > 0;
        const updates = {
            ...body,
            totalProfit,
            isProfit,
        };
        const params = createUpdateParams(tableName, key, updates);
        console.log(params);
        const response = await updateItem(params);
        return okResponse(response);

    } catch (error) {
        console.log(error);
        return badRequest(error);
    }

};

const createUpdateParams = (
    tableName: string | undefined,
    key: Record<string, any>,
    updates: Record<string, any>
  ) => {
    const keys = Object.keys(updates);
  
    const UpdateExpression = `SET ${keys
      .map((k, i) => `#k${i} = :v${i}`)
      .join(", ")}`;
  
    const ExpressionAttributeNames = keys.reduce((acc, k, i) => {
      acc[`#k${i}`] = k;
      return acc;
    }, {} as Record<string, string>);
  
    const ExpressionAttributeValues = keys.reduce((acc, k, i) => {
      acc[`:v${i}`] = updates[k];
      return acc;
    }, {} as Record<string, any>);
  
    return {
      TableName: tableName,
      Key: key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW" as ReturnValue,
    };
  };
  