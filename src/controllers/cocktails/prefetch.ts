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
    /*
    throwing an error makes the lambda to be call again. This is some rudimentary error handling in case something happens (e.g. cocktails API is down)
    There could be better error handling (configure some cloudwatch alarm to throw a message to sns topic, for example, and then deal with it) 
    but it probably excesses the scope of this test. 
     */
    throw e;
  }
}
