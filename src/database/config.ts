// eslint-disable-next-line import/no-extraneous-dependencies
import { DynamoDB } from 'aws-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  // eslint-disable-next-line no-unused-vars
  DocumentClient,
} from 'aws-sdk/clients/dynamodb';

let dynamoClient: DocumentClient = null;

export function getDynamoClient(): DocumentClient {
  if (dynamoClient) return dynamoClient;
  const isOffline =
    (process.env.IS_OFFLINE && process.env.IS_OFFLINE === 'true') ||
    (process.env.NODE_ENV && process.env.NODE_ENV === 'test');

  // If running locally or testing
  if (isOffline) {
    dynamoClient = new DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
    return dynamoClient;
  }

  dynamoClient = new DynamoDB.DocumentClient();
  return dynamoClient;
}

export async function clearTable(
  tableName: string = process.env.DB_COCKTAILS_TABLE,
  key: string = 'ingredientName',
): Promise<void> {
  const dynamoDB = getDynamoClient();
  const params = { TableName: tableName, Key: {} };
  const data = await dynamoDB.scan(params).promise();
  if (!data) return;
  const promises = data.Items.map(i => {
    params.Key[key] = i[key];
    return dynamoDB.delete(params).promise();
  });
  await Promise.all(promises);
}
