
import { FINANCE_RECORD } from "../../utils/constants/types";
import { getConfig } from "../../utils/helpers";
import { fetchAllRecords, fetchInvestmentRecords, putInvestmentWiseSummaryRecord, putSummarizedRecord } from "./libs/helpers";
import { badRequest, okResponse } from "../../utils/response";

export const handler = async (event: {email: string}) => {
    try {
        // fetch all the records from the table for a user
        let totalInvestment = 0;
        let totalReturns = 0;
        const records: FINANCE_RECORD[] = await fetchAllRecords(event.email);
        console.log(records);
        for (const record of records) {
            
            totalInvestment += record.investmentAmount;
            totalReturns += record.returnsAmount;
        };
        const totalProfit = totalReturns - totalInvestment;
        const isProfit = totalProfit > 0;

        const response = await putSummarizedRecord(event.email,"allInvestments",{
            pk: `financeSummary#${event.email}`,
            sk: "allInvestments",
            totalInvestment,
            totalReturns,
            totalProfit,
            isProfit,
        });

        //put investment wise summary.
        await putInvestmentWiseSummaryRecord(event);

        return okResponse("All Summary Records Created");
    } catch (error) {
        console.log(error);
        return badRequest(error);
    }

};