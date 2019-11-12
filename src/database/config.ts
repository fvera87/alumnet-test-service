/* eslint-disable import/no-extraneous-dependencies */

// eslint-disable-next-line no-unused-vars
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDB } from 'aws-sdk';

export const initDynamoClient = (): DocumentClient => {
  const isOffline =
    (process.env.IS_OFFLINE && process.env.IS_OFFLINE === 'true') ||
    (process.env.NODE_ENV && process.env.NODE_ENV === 'test');

  // If running locally or testing
  if (isOffline) {
    return new DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new DynamoDB.DocumentClient();
};

export const clearTable = async (tableName: string, key: string = 'id') => {
  const dynamoDB = initDynamoClient();
  const params = { TableName: tableName, Key: {} };
  const data = await dynamoDB.scan(params).promise();
  if (!data) return;
  const promises = data.Items.map(i => {
    params.Key[key] = i[key];
    return dynamoDB.delete(params).promise();
  });
  await Promise.all(promises);
};
