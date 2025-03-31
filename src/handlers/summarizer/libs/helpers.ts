import { getItem, putItem, queryItem } from "../../../utils/aws/services/DDBDocumentClient_Services";
import { InvestmentType } from "../../../utils/constants/enums";
import { FINANCE_RECORD, SUMMARIZED_RECORD_TYPE } from "../../../utils/constants/types";
import { getConfig } from "../../../utils/helpers";

export const fetchAllRecords = async (email: string) => {
    try {
        const params = {
            TableName: getConfig("DYNAMODB_TABLE_NAME"),
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": `finance#${email}`,
            },
        };
        const response = await queryItem(params);
        return response.Items;
        
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const putSummarizedRecord = async (email: string,sk: string,items: SUMMARIZED_RECORD_TYPE) => {
    try {
        const params = {
            TableName: getConfig("DYNAMODB_TABLE_NAME"),
            Item: items,
        };
        const response = await putItem(params);
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const fetchInvestmentRecords = async (email: string, skPrefix: string) => {
    try {
      const params = {
        TableName: getConfig("DYNAMODB_TABLE_NAME"),
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": `finance#${email}`,
          ":skPrefix": skPrefix,
        },
      };
  
      const response = await queryItem(params);
      return response.Items as FINANCE_RECORD[];
    } catch (error) {
      console.error("DynamoDB Query Error:", error);
      return error;
    }
  };


export const putInvestmentWiseSummaryRecord = async (event: {email: string}) => {
    const types = Object.values(InvestmentType);
        console.log("types",types)
        const promises: Promise<any>[] = [];
        for (const type of types) {
            console.log("type",type)
            promises.push(fetchInvestmentRecords(event.email,type));
        };

        const recordsList = await Promise.all(promises)
        console.log("recordsList",recordsList)
        const putPromises: Promise<any>[] = [];
        for (const record of recordsList) {
            let totalReturns = 0;
            let totalInvestment = 0;
            let typeOfInvestment;
            if (record.length > 0) {
                for (const object of record) {
                    console.log("Object",object)
                    totalReturns += object.returnsAmount
                    totalInvestment += object.investmentAmount
                    typeOfInvestment = object.sk.split("#")[0]
                };
                const totalProfit = totalReturns - totalInvestment
                const isProfit = totalProfit>0;
                const putParams = {
                    TableName: getConfig("DYNAMODB_TABLE_NAME"),
                    Item: {
                    pk : `Summary#${event.email}`,
                    sk : typeOfInvestment,
                    totalProfit,
                    totalReturns,
                    totalInvestment,
                    isProfit
                    }
                };
                putPromises.push(putItem(putParams))
                console.log("In the type=",typeOfInvestment,putParams)
            }
        };

        await Promise.all(putPromises)
};