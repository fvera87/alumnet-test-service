// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../interfaces/Cocktail';

import { fetchCocktailsForIngredient as fetchCocktailsForIngredientAPI } from '../helpers/httpClient';

export async function fetchCocktailsForIngredient(ingredient: string): Promise<Cocktail[]> {
  const cocktails: Cocktail[] = await fetchCocktailsForIngredientAPI(ingredient);
  return cocktails;
}
