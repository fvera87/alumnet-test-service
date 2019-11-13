import * as Logger from 'pino';
// eslint-disable-next-line no-unused-vars
import { Context } from 'aws-lambda';
import { fetchIngredientsList, fetchCocktailsForIngredient } from '../../helpers/cocktailAPIClient';
import { updateAllIngredientsList, updateCocktailsListForIngredient } from '../../database/cocktailsRepository';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../interfaces/Cocktail';

const logger = Logger();

export async function handler(_: any, context: Context): Promise<void> {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  try {
    const ingredients: string[] = await fetchIngredientsList();
    const promises: Promise<void>[] = ingredients.map(async i => {
      const cocktailsForCurrentIngredient: Cocktail[] = await fetchCocktailsForIngredient(i);
      return updateCocktailsListForIngredient(i, cocktailsForCurrentIngredient);
    });
    promises.push(updateAllIngredientsList(ingredients));
    await Promise.all(promises);
  } catch (e) {
    logger.error(e);
    throw e; // throw error so the lambda call is repeated
  }
}
