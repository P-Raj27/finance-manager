
import * as helpers from "../src/utils/helpers";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../src/handlers/crud_operations/create";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("create", () => {
    it("should return okResponse", async() => {
        const apiEvent = {
            body: JSON.stringify({
              isRecurring: true,
              recurringAmount: 5000,
              investmentType: "Mutual_Fund",
              investmentName: "SBI Bluechip Fund",
              investmentAmount: 980000,
              returnsAmount: 630000,
              appName: "Groww",
              email: "investor@example.com",
              maturityDate: "2026-12-31"
            })
          };
          

        jest.spyOn(helpers, "getConfig").mockReturnValue("test");
        ddbMock.on(PutCommand).resolves({});
        const response = await handler(apiEvent);
        expect(response.statusCode).toBe(200);

    });
    it("should return badRequest", async () => {
        const event = {
            "isRecurring": true,
            "recurringAmount": 5000,
            "investmentType": "Mutual_Fund",
            "investmentName": "SBI Bluechip Fund",
            "investmentAmount": 980000,
            "returnsAmount": 630000,
            "appName": "Groww",
            "email": "investor@example.com",
            "maturityDate": "2026-12-31"
          };

        jest.spyOn(helpers, "getConfig").mockReturnValue("test");
        ddbMock.on(PutCommand).rejects(new Error("Error"));
        const response = await handler(event);
        expect(response.statusCode).toBe(400);

    });
});