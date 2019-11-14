// eslint-disable-next-line import/no-extraneous-dependencies
import {
  // eslint-disable-next-line no-unused-vars
  PutItemInput,
  // eslint-disable-next-line no-unused-vars
  PutItemInputAttributeMap,
  // eslint-disable-next-line no-unused-vars
  AttributeValue,
  // eslint-disable-next-line no-unused-vars
  GetItemInput,
  // eslint-disable-next-line no-unused-vars
  UpdateItemInput,
} from 'aws-sdk/clients/dynamodb';

import { ALL_INGREDIENTS_LIST_KEY } from '../config/constants';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../interfaces/Cocktail';
import { getDynamoClient } from './config';

export async function putAllIngredientsList(ingredients: string[]): Promise<void> {
  if (!ingredients) throw new Error('ingredients missing');
  const dynamoDB = getDynamoClient();
  const input: PutItemInputAttributeMap = {
    ingredientName: <AttributeValue>ALL_INGREDIENTS_LIST_KEY,
    ingredients: <AttributeValue>ingredients,
    updatedAt: <AttributeValue>new Date(Date.now()).toISOString(),
  };
  const params: PutItemInput = {
    TableName: process.env.DB_COCKTAILS_TABLE,
    Item: input,
  };
  await dynamoDB.put(params).promise();
}
export async function updateAllIngredientsList(ingredients: string[]): Promise<void> {
  if (!ingredients) throw new Error('ingredients missing');
  const dynamoDB = getDynamoClient();
  try {
    const params: UpdateItemInput = {
      TableName: process.env.DB_COCKTAILS_TABLE,
      Key: {
        ingredientName: <AttributeValue>ALL_INGREDIENTS_LIST_KEY,
      },
      UpdateExpression: 'set ingredients = :ingredients, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':ingredients': <AttributeValue>ingredients,
        ':updatedAt': <AttributeValue>new Date(Date.now()).toISOString(),
      },
      ConditionExpression: 'attribute_exists(ingredientName)', // this way we check that the first time this will be checked throws a known error
    };
    await dynamoDB.update(params).promise();
  } catch (e) {
    if (e.message === 'The conditional request failed') {
      // this means that it is the first time we try to update, so we actually need to put
      return putAllIngredientsList(ingredients);
    }
    throw e;
  }
}
export async function getAllIngredientsList(): Promise<string[]> {
  const dynamoDB = getDynamoClient();
  const params: GetItemInput = {
    TableName: process.env.DB_COCKTAILS_TABLE,
    Key: {
      ingredientName: <AttributeValue>ALL_INGREDIENTS_LIST_KEY,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item ? <string[]>Item.ingredients : [];
}

export async function putCocktailsListForIngredient(ingredient: string, cocktails: Cocktail[]): Promise<void> {
  if (!ingredient) throw new Error('ingredient missing');
  if (!cocktails) throw new Error('cocktails missing');
  const dynamoDB = getDynamoClient();
  const input: PutItemInputAttributeMap = {
    ingredientName: <AttributeValue>ingredient,
    cocktails: <AttributeValue>cocktails,
    updatedAt: <AttributeValue>new Date(Date.now()).toISOString(),
  };
  const params: PutItemInput = {
    TableName: process.env.DB_COCKTAILS_TABLE,
    Item: input,
  };
  await dynamoDB.put(params).promise();
}
export async function getCocktailsListForIngredient(ingredient: string): Promise<Cocktail[]> {
  if (!ingredient) throw new Error('ingredient missing');
  const dynamoDB = getDynamoClient();
  const params: GetItemInput = {
    TableName: process.env.DB_COCKTAILS_TABLE,
    Key: {
      ingredientName: <AttributeValue>ingredient,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item ? <Cocktail[]>Item.cocktails : [];
}

export async function updateCocktailsListForIngredient(ingredient: string, cocktails: Cocktail[]): Promise<void> {
  if (!ingredient) throw new Error('ingredient missing');
  if (!cocktails) throw new Error('cocktails missing');
  const dynamoDB = getDynamoClient();
  try {
    const params: UpdateItemInput = {
      TableName: process.env.DB_COCKTAILS_TABLE,
      Key: {
        ingredientName: <AttributeValue>ingredient,
      },
      UpdateExpression: 'set cocktails = :cocktails, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':cocktails': <AttributeValue>cocktails,
        ':updatedAt': <AttributeValue>new Date(Date.now()).toISOString(),
      },
      ConditionExpression: 'attribute_exists(ingredientName)',
    };
    await dynamoDB.update(params).promise();
  } catch (e) {
    if (e.message === 'The conditional request failed') {
      // this means that it is the first time we try to update, so we actually need to put
      return putCocktailsListForIngredient(ingredient, cocktails);
    }
    throw e;
  }
}
