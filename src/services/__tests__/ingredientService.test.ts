import { fetchIngredientSuggestion } from '../ingredientService';
import { fetchIngredientsList } from '../../helpers/cocktailAPIClient';
import { putAllIngredientsList } from '../../database/cocktailsRepository';

const ingredient = 'ingredient';
let shouldHitDB = true;
jest.mock('../../database/cocktailsRepository', () => ({
  getAllIngredientsList: jest.fn(() => (shouldHitDB ? [ingredient] : [])),
  putAllIngredientsList: jest.fn(),
}));
jest.mock('../../helpers/cocktailAPIClient', () => ({
  fetchIngredientsList: jest.fn(() => [ingredient]),
}));
describe('ingredients service tests', () => {
  it('fetchIngredientSuggestion should throw an error with missing or wrong parameter', async () => {
    await expect(fetchIngredientSuggestion(null)).rejects.toThrow('ingredient missing');
    await expect(fetchIngredientSuggestion(undefined)).rejects.toThrow('ingredient missing');
    // @ts-ignore
    await expect(fetchIngredientSuggestion(1)).rejects.toThrow('ingredient missing');
  });

  it('fetchIngredientSuggestion should not hit the API if the ingredients list data is already in the DB', async () => {
    shouldHitDB = true;
    const suggestion: string = await fetchIngredientSuggestion('suggestion');
    expect(suggestion).toEqual(ingredient);
    expect(fetchIngredientsList).not.toHaveBeenCalled();
    expect(putAllIngredientsList).not.toHaveBeenCalled();
  });
  it('fetchCocktailsForIngredient should ask the API if the data is not in the DB', async () => {
    shouldHitDB = false;
    const suggestion: string = await fetchIngredientSuggestion('suggestion');
    expect(suggestion).toEqual(ingredient);
    expect(fetchIngredientsList).toHaveBeenCalledTimes(1);
  });
});
