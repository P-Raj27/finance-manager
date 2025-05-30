import { handler } from "../src/handlers/crud_operations/delete";
import * as helpers from "../src/utils/helpers";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";


const ddbMock = mockClient(DynamoDBDocumentClient);

describe("delete", () => {
    it("should return okResponse", async() => {
        const apiEvent = {
            body: JSON.stringify({
              email: "investor@example.com",
              investmentType: "Mutual_Fund",
              investmentName: "SBI Bluechip Fund",
            })
          };
          

        jest.spyOn(helpers, "getConfig").mockReturnValue("test");
        ddbMock.on(PutCommand).resolves({});
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
        ddbMock.on(PutCommand).rejects(new Error("Error"));
        const response = await handler(event);
        expect(response.statusCode).toBe(400);

    });
 });