import { findBestMatch } from 'string-similarity';
import { fetchIngredientsList } from '../helpers/cocktailAPIClient';
import { getAllIngredientsList, putAllIngredientsList } from '../database/cocktailsRepository';

export async function fetchIngredientSuggestion(ingredient: string): Promise<string> {
  if (!ingredient) throw new Error('ingredient missing');
  let ingredientsList: string[] = await getAllIngredientsList();
  if (!ingredientsList || ingredientsList.length === 0) {
    ingredientsList = await fetchIngredientsList();
    if (!ingredientsList || ingredientsList.length === 0) throw new Error('Error fetching possible ingredients');
    await putAllIngredientsList(ingredientsList);
  }
  const {
    bestMatch: { target },
  } = findBestMatch(ingredient, ingredientsList);
  return target;
}
