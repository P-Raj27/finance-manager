
import { FINANCE_RECORD } from "../../utils/constants/types";
import { getConfig } from "../../utils/helpers";
import { fetchAllRecords, fetchInvestmentRecords, putInvestmentWiseSummaryRecord, putSummarizedRecord } from "./libs/helpers";
import { badRequest, okResponse } from "../../utils/response";

export const handler = async (event: any) => {
    try {
        // fetch all the records from the table for a user
        let totalInvestment = 0;
        let totalReturns = 0;
        let email = ""
        if(event.body){
            const body = JSON.parse(event.body)
            email = body.email
        }else {
        email = event.email
        };
        const records: FINANCE_RECORD[] = await fetchAllRecords(email);
        console.log(`all records fetched for email: ${email}`,records);
        for (const record of records) {
            
            totalInvestment += record.investmentAmount;
            totalReturns += record.returnsAmount;
        };
        const totalProfit = totalReturns - totalInvestment;
        const isProfit = totalProfit > 0;

        const response = await putSummarizedRecord(event.email,"allInvestments",{
            pk: `financeSummary#${email}`,
            sk: "allInvestments",
            totalInvestment,
            totalReturns,
            totalProfit,
            isProfit,
        });
        console.log(
            "Response for all investment",response
        )

        //put investment wise summary.
        await putInvestmentWiseSummaryRecord(email);

        return okResponse("All Summary Records Created");
        
    } catch (error) {
        console.log(error);
        return badRequest(error);
    }

};