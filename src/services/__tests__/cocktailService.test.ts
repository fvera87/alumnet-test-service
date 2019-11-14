import { fetchCocktailsForIngredient } from '../cocktailService';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../interfaces/Cocktail';
import { fetchCocktailsForIngredient as fetchCocktailsForIngredientAPI } from '../../helpers/cocktailAPIClient';

import { putCocktailsListForIngredient } from '../../database/cocktailsRepository';

const inDBingredient = 'inDB';
const mockedCocktail: Cocktail = { strDrink: 'drink name', strDrinkThum: 'drink thumb', idDrink: 'drink id' };
jest.mock('../../database/cocktailsRepository', () => ({
  getCocktailsListForIngredient: jest.fn(i => (i === inDBingredient ? [mockedCocktail] : [])),
  putCocktailsListForIngredient: jest.fn(),
}));
jest.mock('../../helpers/cocktailAPIClient', () => ({
  fetchCocktailsForIngredient: jest.fn(() => [mockedCocktail]),
}));
describe('cocktails service tests', () => {
  it('fetchCocktailsForIngredient should throw an error with missing or wrong parameter', async () => {
    await expect(fetchCocktailsForIngredient(null)).rejects.toThrow('ingredient missing');
    await expect(fetchCocktailsForIngredient(undefined)).rejects.toThrow('ingredient missing');
    // @ts-ignore
    await expect(fetchCocktailsForIngredient(1)).rejects.toThrow('ingredient missing');
  });

  it('fetchCocktailsForIngredient should not hit the API if the data is already in the DB', async () => {
    const cocktails: Cocktail[] = await fetchCocktailsForIngredient(inDBingredient);
    expect(cocktails).toEqual([mockedCocktail]);
    expect(fetchCocktailsForIngredientAPI).not.toHaveBeenCalled();
    expect(putCocktailsListForIngredient).not.toHaveBeenCalled();
  });
  it('fetchCocktailsForIngredient should ask the API if the data is not in the DB', async () => {
    const cocktails: Cocktail[] = await fetchCocktailsForIngredient('another');
    expect(cocktails).toEqual([mockedCocktail]);
    expect(fetchCocktailsForIngredientAPI).toHaveBeenCalledTimes(1);
    expect(fetchCocktailsForIngredientAPI).toHaveBeenCalledWith('another');
    expect(putCocktailsListForIngredient).toHaveBeenCalledTimes(1);
    expect(putCocktailsListForIngredient).toHaveBeenCalledWith('another', [mockedCocktail]);
  });
});
