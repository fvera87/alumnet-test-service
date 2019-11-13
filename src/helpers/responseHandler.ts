// eslint-disable-next-line no-unused-vars
import { Response } from '../interfaces/Response';

export function generateErrorResponse(statusCode: number, errorMessage: string): Response {
  return {
    statusCode,
    body: JSON.stringify({
      errorMessage,
    }),
  };
}

export function generateResponse(statusCode: number, res: object): Response {
  return {
    statusCode,
    body: JSON.stringify(res),
  };
}
