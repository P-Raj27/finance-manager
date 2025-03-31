import { putItem } from "../../utils/aws/services/DDBDocumentClient_Services";
import { RecordType } from "../../utils/constants/enums";
import { getConfig, transformData, validateInput } from "../../utils/helpers";
import { badRequest, okResponse } from "../../utils/response";
import { investmentRecordsSchema } from "./libs/zodSchemas";

export const create = async (event: any) => {

    try {

        const body = JSON.parse(event.body);
        validateInput(investmentRecordsSchema, body);
        const totalProfit = body.returnsAmount - body.investmentAmount;
        const isProfit = totalProfit > 0;


        const ddbData = transformData(body,RecordType.FINANCE_RECORD);

        const params = {
            TableName: getConfig("DYNAMODB_TABLE_NAME"),
            Item: {...ddbData,totalProfit,isProfit},
        };

        const response = await putItem(params);
        return okResponse(response);


    } catch (error) {
        console.log(error);
        return badRequest(error);
    }
};