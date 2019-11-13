import * as status from 'http-status';
// eslint-disable-next-line no-unused-vars
import { Context } from 'aws-lambda';
import { handler } from '../get';
// eslint-disable-next-line no-unused-vars
import { Response } from '../../../interfaces/Response';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../../interfaces/Cocktail';
import {
  COCKTAIL_API_FETCH_BY_INGREDIENT_URL,
  COCKTAIL_API_LIST_INGREDIENTS_URL,
  COCKTAIL_API_INGREDIENT_PARAM_NAME,
} from '../../../config/constants';

jest.mock('axios', () => ({
  axios: {
    get: jest.fn(
      async (url: string, options: { params }): Promise<any> => {
        if (url === COCKTAIL_API_FETCH_BY_INGREDIENT_URL) {
          if (options.params[COCKTAIL_API_INGREDIENT_PARAM_NAME] === 'existing') {
            const mockedCoktail: Cocktail = {
              idDrink: 'id',
              strDrink: 'mocked drink',
              strDrinkThum: 'thum',
            };
            return { status: 200, data: { drinks: [mockedCoktail] } };
          }
          return { status: 200, data: [] };
        }
        if (url === COCKTAIL_API_LIST_INGREDIENTS_URL) {
          return { status: 200, data: { drinks: [{ strIngredient1: 'suggestion' }] } };
        }
        return { data: { mocked: true } };
      },
    ),
  },
}));
describe('fetch cocktails controller tests', () => {
  // @ts-ignore
  const context: Context = {};
  const mockedCoktail: Cocktail = {
    idDrink: 'id',
    strDrink: 'mocked drink',
    strDrinkThum: 'thum',
  };
  const cocktails = [mockedCoktail];
  const suggestion = 'suggestion';
  it('should return 400 error if the input does not have there are no query string params or ingredients is missing', async () => {
    const event = {};
    const expected: Response = {
      statusCode: status.BAD_REQUEST,
      body: JSON.stringify({ errorMessage: 'missing required parameter: Ingredient' }),
    };
    await expect(handler(event, context)).resolves.toEqual(expected);
    const event2 = { body: {} };
    const expected2: Response = {
      statusCode: status.BAD_REQUEST,
      body: JSON.stringify({ errorMessage: 'missing required parameter: Ingredient' }),
    };
    const res = await handler(event2, context);
    await expect(res).toEqual(expected2);
  });
  it('should return 200 and the list of cocktails if provided ingredient has some', async () => {
    const ingredient = 'existing';
    const event = { queryStringParameters: { ingredient } };
    const expected: Response = {
      statusCode: status.OK,
      body: JSON.stringify({ cocktails }),
    };
    await expect(handler(event, context)).resolves.toEqual(expected);
  });
  it('should return 200 an empty list of cocktails if provided ingredient does not have any, with a suggested ingredient', async () => {
    const ingredient = 'notexisting';
    const event = { queryStringParameters: { ingredient } };
    const expected: Response = {
      statusCode: status.OK,
      body: JSON.stringify({ cocktails: [], suggestion }),
    };
    const result = await handler(event, context);
    await expect(result).toEqual(expected);
  });
});
