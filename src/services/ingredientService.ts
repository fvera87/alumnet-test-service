import axios from 'axios';
import { findBestMatch } from 'string-similarity';
import {
  COCKTAIL_API_LIST_INGREDIENTS_URL,
  COCKTAIL_HEADERS_KEY_API_KEY,
  COCKTAIL_HEADERS_KEY_HOST,
  COCKTAIL_HEADERS_VALUE_API_KEY,
  COCKTAIL_HEADERS_VALUE_HOST,
} from '../config/constants';

export async function fetchIngredientSuggestion(ingredient: string): Promise<string> {
  const headers = {};
  headers[COCKTAIL_HEADERS_KEY_HOST] = COCKTAIL_HEADERS_VALUE_HOST;
  headers[COCKTAIL_HEADERS_KEY_API_KEY] = COCKTAIL_HEADERS_VALUE_API_KEY;
  const { data, status } = await axios.get(COCKTAIL_API_LIST_INGREDIENTS_URL, {
    headers,
  });
  if (status !== 200)
    throw new Error(`Something went wrong fetching list of ingredients: statusCode: ${status} - data: ${data}`);
  const ingredientsList = data.drinks.map(({ strIngredient1 }) => strIngredient1);
  const {
    bestMatch: { target },
  } = findBestMatch(ingredient, ingredientsList);
  return target;
}
