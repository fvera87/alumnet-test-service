import axios from 'axios';
import {
  COCKTAIL_API_LIST_INGREDIENTS_URL,
  COCKTAIL_HEADERS_KEY_API_KEY,
  COCKTAIL_HEADERS_KEY_HOST,
  COCKTAIL_HEADERS_VALUE_API_KEY,
  COCKTAIL_HEADERS_VALUE_HOST,
  COCKTAIL_API_INGREDIENT_PARAM_NAME,
  COCKTAIL_API_FETCH_BY_INGREDIENT_URL,
} from '../config/constants';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../interfaces/Cocktail';

export async function fetchIngredientsList(): Promise<string[]> {
  const headers = {};
  headers[COCKTAIL_HEADERS_KEY_HOST] = COCKTAIL_HEADERS_VALUE_HOST;
  headers[COCKTAIL_HEADERS_KEY_API_KEY] = COCKTAIL_HEADERS_VALUE_API_KEY;
  const { data, status } = await axios.get(COCKTAIL_API_LIST_INGREDIENTS_URL, {
    headers,
  });
  if (status !== 200)
    throw new Error(`Something went wrong fetching list of ingredients: statusCode: ${status} - data: ${data}`);
  return data.drinks.map(({ strIngredient1 }) => strIngredient1);
}

export async function fetchCocktailsForIngredient(ingredient: string): Promise<Cocktail[]> {
  const headers = {};
  headers[COCKTAIL_HEADERS_KEY_HOST] = COCKTAIL_HEADERS_VALUE_HOST;
  headers[COCKTAIL_HEADERS_KEY_API_KEY] = COCKTAIL_HEADERS_VALUE_API_KEY;
  const params = {};
  params[COCKTAIL_API_INGREDIENT_PARAM_NAME] = ingredient;
  const { data, status } = await axios.get(COCKTAIL_API_FETCH_BY_INGREDIENT_URL, {
    params,
    headers,
  });
  if (status !== 200) throw new Error(`Something went wrong fetching cocktails: statusCode: ${status} - data: ${data}`);
  return <Cocktail[]>data.drinks || [];
}
