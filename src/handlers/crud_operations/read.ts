import { getItem } from "../../utils/aws/services/DDBDocumentClient_Services";
import { getConfig, replaceSpacesWithUnderscores, validateInput } from "../../utils/helpers";
import { badRequest, okResponse } from "../../utils/response";
import { investmentRecordsFetchSchema } from "./libs/zodSchemas";

export const handler = async (event: any) => {

    try {
    const body = JSON.parse(event.body);
    validateInput(investmentRecordsFetchSchema, body);

    const params = {
        TableName: getConfig("DYNAMODB_TABLE_NAME"),
        Key: {
            pk: `finance#${body.email}`,
            sk: `${body.investmentType}#${replaceSpacesWithUnderscores(body.investmentName)}`,
        },
    };
    const response = await getItem(params);
    return okResponse(response.Item);
}catch (error) {
    console.log(error);
    return badRequest(error);
}
};