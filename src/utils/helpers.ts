import { any, ZodSchema } from "zod";
import { RecordType } from "./constants/enums";
import { FINANCE_RECORD_TYPE } from "./constants/types";
export const validateInput = <T>(
    schema: ZodSchema<T>,
    input: any
  ): { success: true; data: T } | { success: false; error: string } => {
    const result = schema.safeParse(input);
  
    if (result.success) {
      console.log("Validated Schema",result.data);
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        error: result.error.format
          ? JSON.stringify(result.error.format(), null, 2)
          : result.error.message,
      };
    }
};

export const replaceSpacesWithUnderscores = (str: string): string => {
    console.log(str);
    str.toLowerCase();
    return str.replace(/ /g, "_");
  };

export const transformData = (data: FINANCE_RECORD_TYPE,type:RecordType) => {
    let pk;
    let sk;
    switch (type) {
        case RecordType.FINANCE_RECORD:
            pk = `finance#${data.email}`;
            sk = `${data.investmentType}#${replaceSpacesWithUnderscores(data.investmentName)}`;
            break;
        case RecordType.FINANCE_SUMMARY_RECORD:
            pk = `financeSummary#${data.email}`;
            sk = `${data.investmentType}`;
            break;
        case RecordType.FINANCE_ALL_SUMMARY_RECORD:
            pk = `financeSummary#${data.email}`;
            sk = "allInvestments";
            break;
        default:
            throw new Error("Invalid Record Type");
            break;
    };
    return {
        pk,
        sk,
        ...data,
    };
    };


export const getConfig = (key: string, defaultValue?: string): string | undefined => {
    if (process.env[key] === undefined) {
        if (!defaultValue) {
        throw new Error(`Missing config value "${key}" in environment ${process.env.ENVIRONMENT}`);
        }
        return defaultValue;
    }
    
    return process.env[key]!;
    };