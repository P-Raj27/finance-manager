import { z } from "zod";
import { InvestmentType } from "../../../utils/constants/enums";

export const investmentRecordsSchema = z.object({
    isRecurring: z.boolean(),
    recurringAmount: z.number(),
    investmentType: z.nativeEnum(InvestmentType),
    investmentName: z.string(),
    investmentAmount: z.number(),
    returnsAmount: z.number(),
    appName: z.string(),
    email: z.string(),
    maturityDate: z.string(),
});

export const investmentRecordsFetchSchema = z.object({
    email: z.string(),
    investmentType: z.nativeEnum(InvestmentType),
    investmentName: z.string(),
});