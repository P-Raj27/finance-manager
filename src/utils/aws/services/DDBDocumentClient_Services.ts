import {
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../clients/dynamoDb";

const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const getItem = async (params: GetCommandInput): Promise<GetCommandOutput> => {
  const getCommandParams = new GetCommand(params);
  return ddbDocClient.send(getCommandParams);
};

export const deleteItem = async (params: DeleteCommandInput): Promise<DeleteCommandOutput> => {
  const deleteCommand = new DeleteCommand(params);
  return ddbDocClient.send(deleteCommand);
};

export const updateItem = async (
  params: UpdateCommandInput
): Promise<UpdateCommandOutput> => {
  const updateCommandParams = new UpdateCommand(params);
  return ddbDocClient.send(updateCommandParams);
};

export const putItem = async (params: PutCommandInput): Promise<PutCommandOutput> => {
  const getCommandParams = new PutCommand(params);
  return ddbDocClient.send(getCommandParams);
};

export const queryItem = async (params: QueryCommandInput): Promise<QueryCommandOutput> => {
  const command = new QueryCommand(params);
  return ddbDocClient.send(command);
};


