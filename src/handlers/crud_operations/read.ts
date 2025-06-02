import { getItem, queryItem } from "../../utils/aws/services/DDBDocumentClient_Services";
import { getConfig, replaceSpacesWithUnderscores, validateInput } from "../../utils/helpers";
import { badRequest, okResponse } from "../../utils/response";
import { investmentRecordsFetchSchema } from "./libs/zodSchemas";

export const handler = async (event: any) => {

    try {
    const body = JSON.parse(event.body);
    
    
    validateInput(investmentRecordsFetchSchema, body);

    console.log("Body",body)
    let key;
    if (body.type === "get_all_investment_summary") {
        key = {
            pk : `financeSummary#${body.email}`,
            sk : "allInvestments"
        }
    } else if (body.type === "get_investment_summary") {
        key = {
            pk : `financeSummary#${body.email}`,
            sk : `${body.investmentType}`
        }  
    }else {
        key = {
            pk : `finance#${body.email}`,
            sk : `${body.investmentType}#${replaceSpacesWithUnderscores(body.investmentName || "")}`
        } 
    }
    const params = {
        TableName: getConfig("DYNAMODB_TABLE_NAME"),
        Key: key
    };

    if (body.type === "get_user_investments") {
        const par = {
            TableName: getConfig("DYNAMODB_TABLE_NAME"),
            KeyConditionExpression: 'pk = :pk', // Only filter by the partition key
            ExpressionAttributeValues: {
                ':pk': `finance#${body.email}` // The actual value of the partition key
            }
        }
        const res = await queryItem(par)
        return okResponse(res.Items)
    }
    const response = await getItem(params);
    return okResponse(response.Item);
}catch (error) {
    console.log(error);
    return badRequest(error);
}
};