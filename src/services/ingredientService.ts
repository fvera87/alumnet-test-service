import { findBestMatch } from 'string-similarity';
import { fetchIngredientsList } from '../helpers/httpClient';

export async function fetchIngredientSuggestion(ingredient: string): Promise<string> {
  const ingredientsList: string[] = await fetchIngredientsList();
  const {
    bestMatch: { target },
  } = findBestMatch(ingredient, ingredientsList);
  return target;
}
