import mockAxios from 'jest-mock-axios';
import { fetchIngredientsList, fetchCocktailsForIngredient } from '../cocktailAPIClient';

import {
  COCKTAIL_API_LIST_INGREDIENTS_URL,
  COCKTAIL_HEADERS_KEY_API_KEY,
  COCKTAIL_HEADERS_KEY_HOST,
  COCKTAIL_HEADERS_VALUE_API_KEY,
  COCKTAIL_HEADERS_VALUE_HOST,
  COCKTAIL_API_INGREDIENT_PARAM_NAME,
  COCKTAIL_API_FETCH_BY_INGREDIENT_URL,
} from '../../config/constants';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../interfaces/Cocktail';

const mockedIngredient = { strIngredient1: 'mocked ingredient' };
const mockedCocktail: Cocktail = { strDrink: 'drink name', strDrinkThum: 'drink thumb', idDrink: 'drink id' };
describe('cocktailAPI client tests', () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
  it('fetchIngredientsList should call api with the correct properties', async () => {
    const p = fetchIngredientsList();
    const responseObj = {
      status: 200,
      data: {
        drinks: [mockedIngredient],
      },
    };
    mockAxios.mockResponse(responseObj);
    await p;
    const headers = {};
    headers[COCKTAIL_HEADERS_KEY_HOST] = COCKTAIL_HEADERS_VALUE_HOST;
    headers[COCKTAIL_HEADERS_KEY_API_KEY] = COCKTAIL_HEADERS_VALUE_API_KEY;
    expect(mockAxios.get).toHaveBeenCalledWith(COCKTAIL_API_LIST_INGREDIENTS_URL, { headers });
  });

  it('fetchIngredientsList should map the API result properly', async () => {
    const ingredientsPromise = fetchIngredientsList();
    const responseObj = {
      status: 200,
      data: {
        drinks: [mockedIngredient],
      },
    };
    mockAxios.mockResponse(responseObj);
    const ingredients = await ingredientsPromise;
    expect(ingredients).toEqual(['mocked ingredient']);
  });
  it('fetchIngredientsList should throw error if status is not 200', async () => {
    const ingredientsPromise = fetchIngredientsList();
    const responseObj = {
      status: 403,
      data: { error: 'problem in server' },
    };
    mockAxios.mockResponse(responseObj);
    return expect(ingredientsPromise).rejects.toThrow(
      `Something went wrong fetching list of ingredients: statusCode: 403 - data: {"error":"problem in server"}`,
    );
  });
  it('fetchCocktailsForIngredient should throw an error for null or invalid inputs', async () => {
    await expect(fetchCocktailsForIngredient(null)).rejects.toThrow('ingredient missing');
    await expect(fetchCocktailsForIngredient(undefined)).rejects.toThrow('ingredient missing');
    // @ts-ignore
    await expect(fetchCocktailsForIngredient(1)).rejects.toThrow('ingredient missing');
  });

  it('fetchCocktailsForIngredient should call api with the correct properties', async () => {
    const ingredient = 'ingredient';
    const p = fetchCocktailsForIngredient(ingredient);
    const responseObj = {
      status: 200,
      data: {
        drinks: [mockedCocktail],
      },
    };
    mockAxios.mockResponse(responseObj);
    await p;
    const headers = {};
    headers[COCKTAIL_HEADERS_KEY_HOST] = COCKTAIL_HEADERS_VALUE_HOST;
    headers[COCKTAIL_HEADERS_KEY_API_KEY] = COCKTAIL_HEADERS_VALUE_API_KEY;
    const params = {};
    params[COCKTAIL_API_INGREDIENT_PARAM_NAME] = ingredient;
    expect(mockAxios.get).toHaveBeenCalledWith(COCKTAIL_API_FETCH_BY_INGREDIENT_URL, { params, headers });
  });

  it('fetchCocktailsForIngredient should return API result properly', async () => {
    const ingredient = 'ingredient';
    const cocktailsPromise = fetchCocktailsForIngredient(ingredient);
    const responseObj = {
      status: 200,
      data: {
        drinks: [mockedCocktail],
      },
    };
    mockAxios.mockResponse(responseObj);
    const cocktails = await cocktailsPromise;
    expect(cocktails).toEqual([mockedCocktail]);
  });
  it('fetchCocktailsForIngredient should throw error if status is not 200', async () => {
    const ingredient = 'ingredient';
    const cocktailsPromise = fetchCocktailsForIngredient(ingredient);
    const responseObj = {
      status: 403,
      data: { error: 'problem in server' },
    };
    mockAxios.mockResponse(responseObj);
    return expect(cocktailsPromise).rejects.toThrow(
      `Something went wrong fetching cocktails: statusCode: 403 - data: {"error":"problem in server"}`,
    );
  });
});
