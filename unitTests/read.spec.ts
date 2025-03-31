import { handler } from "../src/handlers/crud_operations/read";
import * as helpers from "../src/utils/helpers";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("read", () => {
    it("should return okResponse", async() => {
        const apiEvent = {
            body: JSON.stringify({
              email: "investor@example.com",
              investmentType: "Mutual_Fund",
              investmentName: "SBI Bluechip Fund",
            })
          };
          

        jest.spyOn(helpers, "getConfig").mockReturnValue("test");
        ddbMock.on(GetCommand).resolves({
            Item: {
              pk: "finance#investor@example.com",
              sk: "Mutual_Fund#SBI Bluechip Fund",
              totalProfit: 0,
              isProfit: false,
              totalReturns: 0,
              totalInvestment: 0,
            },
          });
        const response = await handler(apiEvent);
        expect(response.statusCode).toBe(200);

    });
    it("should return badRequest", async () => {
        const event = {
            "email": "investor@example.com",
            "investmentType": "Mutual_Fund",
            "investmentName": "SBI Bluechip Fund",
          };

        jest.spyOn(helpers, "getConfig").mockReturnValue("test");
        ddbMock.on(GetCommand).rejects(new Error("Error"));
        const response = await handler(event);
        expect(response.statusCode).toBe(400);

    });
 });