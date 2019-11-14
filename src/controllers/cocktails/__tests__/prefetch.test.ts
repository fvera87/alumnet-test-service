// eslint-disable-next-line no-unused-vars
import { Context } from 'aws-lambda';
import { handler } from '../prefetch';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../../interfaces/Cocktail';
import { clearTable } from '../../../database/config';
import { getCocktailsListForIngredient, getAllIngredientsList } from '../../../database/cocktailsRepository';

const mockedCoktail: Cocktail = {
  idDrink: 'id',
  strDrink: 'mocked drink',
  strDrinkThum: 'thum',
};
const suggestion = 'suggestion';

jest.mock('../../../helpers/cocktailAPIClient.ts', () => ({
  fetchIngredientsList: jest.fn(() => [suggestion]),
  fetchCocktailsForIngredient: jest.fn((ingredient: string) => {
    return ingredient === suggestion ? [mockedCoktail] : [];
  }),
}));
describe('prefetch cocktails controller tests', () => {
  // @ts-ignore
  const context: Context = {};
  beforeAll(async () => {
    await clearTable();
  });
  it('should insert correctly in the DB the API data', async () => {
    const event = {};
    await handler(event, context);
    const ingredients = await getAllIngredientsList();
    expect(ingredients).toEqual([suggestion]);
    const cocktails = await getCocktailsListForIngredient(suggestion);
    expect(cocktails).toEqual([mockedCoktail]);
  });
});
