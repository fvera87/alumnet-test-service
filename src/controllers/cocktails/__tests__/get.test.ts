import * as status from 'http-status';
// eslint-disable-next-line no-unused-vars
import { Context } from 'aws-lambda';
import { handler } from '../get';
// eslint-disable-next-line no-unused-vars
import { Response } from '../../../interfaces/Response';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../../interfaces/Cocktail';
import { clearTable } from '../../../database/config';
import { fetchCocktailsForIngredient } from '../../../helpers/cocktailAPIClient';

const mockedCoktail: Cocktail = {
  idDrink: 'id',
  strDrink: 'mocked drink',
  strDrinkThum: 'thum',
};
const suggestion = 'suggestion';

jest.mock('../../../helpers/cocktailAPIClient.ts', () => ({
  fetchIngredientsList: jest.fn(() => ['suggestion']),
  fetchCocktailsForIngredient: jest.fn((ingredient: string) => {
    return ingredient === 'existing' ? [mockedCoktail] : [];
  }),
}));
describe('fetch cocktails controller tests', () => {
  // @ts-ignore
  const context: Context = {};
  const cocktails = [mockedCoktail];
  beforeEach(async () => {
    clearTable(process.env.DB_COCKTAILS_TABLE);
  });
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
    const expected = {
      statusCode: status.OK,
      body: { cocktails },
    };
    const result = await handler(event, context);
    expect(Object.keys(result)).toEqual(['statusCode', 'body']);
    expect(result.statusCode).toEqual(expected.statusCode);
    expect(JSON.parse(result.body)).toEqual(expected.body);
  });
  it('should return 200 an empty list of cocktails if provided ingredient does not have any, with a suggested ingredient', async () => {
    const ingredient = 'notexisting';
    const event = { queryStringParameters: { ingredient } };
    const expected = {
      statusCode: status.OK,
      body: { cocktails: [], suggestion },
    };
    const result = await handler(event, context);
    expect(Object.keys(result)).toEqual(['statusCode', 'body']);
    expect(result.statusCode).toEqual(expected.statusCode);
    expect(JSON.parse(result.body)).toEqual(expected.body);
  });
  it('should always hit the DB after the first call', async () => {
    const ingredient = 'existing';
    const event = { queryStringParameters: { ingredient } };
    await handler(event, context);
    expect(fetchCocktailsForIngredient).toHaveBeenCalledWith(ingredient);
    expect(fetchCocktailsForIngredient).toHaveBeenCalledTimes(1);
    await handler(event, context);
    expect(fetchCocktailsForIngredient).toHaveBeenCalledTimes(1);
    await handler(event, context);
    expect(fetchCocktailsForIngredient).toHaveBeenCalledTimes(1);
  });
});
