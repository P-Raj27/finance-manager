import { z } from "zod";
import { investmentRecordsSchema } from "../../handlers/crud_operations/libs/zodSchemas";

type FINANCE_RECORD= z.infer<typeof investmentRecordsSchema> & {
    totalProfit: number;
    isProfit: boolean;
};

type FINANCE_SUMMARY_RECORD = {
    isProfit: boolean;
    totalProfit: number;
    totalReturns: number;
    totalInvestment: number;
    investmentType: string;
    email: string;
    investmentName: string;
};

type FINANCE_ALL_SUMMARY_RECORD = {
    isProfit: boolean;
    totalProfit: number;
    totalReturns: number;
    totalInvestment: number;
    investmentType: string;
    email: string;
    investmentName: string;
}

export type FINANCE_RECORD_TYPE = FINANCE_RECORD | FINANCE_SUMMARY_RECORD | FINANCE_ALL_SUMMARY_RECORD;