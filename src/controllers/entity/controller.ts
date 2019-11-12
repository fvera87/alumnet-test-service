import * as Logger from 'pino';
import * as status from 'http-status';
// eslint-disable-next-line no-unused-vars
import { Response } from '../../types/Response';
import { generateErrorResponse, generateResponse } from '../../helpers/responseHandler';

const logger = Logger();

export const handler = async (event, context): Promise<Response> => {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  try {
    if (event.source === 'serverless-plugin-warmup') {
      logger.info('WarmUP - Lambda is warm!');
      return generateResponse(status.OK, { message: 'Lambda is warm!' });
    }
    return generateResponse(status.OK, {
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    });
  } catch (e) {
    return generateErrorResponse(status.INTERNAL_SERVER_ERROR, e.message);
  }
};
