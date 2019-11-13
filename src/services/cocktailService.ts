// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../interfaces/Cocktail';

import { fetchCocktailsForIngredient as fetchCocktailsForIngredientAPI } from '../helpers/cocktailAPIClient';
import { getCocktailsListForIngredient, putCocktailsListForIngredient } from '../database/cocktailsRepository';

export async function fetchCocktailsForIngredient(ingredient: string): Promise<Cocktail[]> {
  if (!ingredient) throw new Error('ingredient missing');
  let cocktails: Cocktail[] = await getCocktailsListForIngredient(ingredient);
  if (!cocktails) {
    cocktails = await fetchCocktailsForIngredientAPI(ingredient);
    await putCocktailsListForIngredient(ingredient, cocktails);
  }
  return cocktails;
}
