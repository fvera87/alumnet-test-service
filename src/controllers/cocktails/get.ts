import * as Logger from 'pino';
import * as status from 'http-status';
// eslint-disable-next-line no-unused-vars
import { Context } from 'aws-lambda';
import { generateErrorResponse, generateResponse } from '../../helpers/responseHandler';
import { fetchCocktailsForIngredient } from '../../services/cocktailService';
import { stringCleaner } from '../../helpers/stringCleaner';
import { fetchIngredientSuggestion } from '../../services/ingredientService';
// eslint-disable-next-line no-unused-vars
import { Response } from '../../interfaces/Response';
// eslint-disable-next-line no-unused-vars
import { Cocktail } from '../../interfaces/Cocktail';

const logger = Logger();

export async function handler(event: any, context: Context): Promise<Response> {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  if (event.source === 'serverless-plugin-warmup') {
    logger.info('WarmUP - Lambda is warm!');
    return generateResponse(status.OK, { message: 'Lambda is warm!' });
  }
  try {
    if (!event.queryStringParameters || !event.queryStringParameters.ingredient)
      return generateErrorResponse(status.BAD_REQUEST, 'missing required parameter: Ingredient');
    const { ingredient } = event.queryStringParameters;
    const cleanIngredient = stringCleaner(ingredient);
    const cocktails: Cocktail[] = await fetchCocktailsForIngredient(cleanIngredient);
    if (cocktails.length > 0) return generateResponse(status.OK, { cocktails });
    const suggestion: string = await fetchIngredientSuggestion(ingredient);
    return generateResponse(status.OK, { cocktails, suggestion });
  } catch (e) {
    logger.error(e);
    return generateErrorResponse(status.INTERNAL_SERVER_ERROR, e.message);
  }
}
