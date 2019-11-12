// eslint-disable-next-line no-unused-vars
import { Response } from '../types/Response';

export function generateErrorResponse(statusCode: number, errorMessage: string): Response {
  return {
    statusCode,
    body: {
      errorMessage,
    },
  };
}

export function generateResponse(statusCode: number, res: object): Response {
  return {
    statusCode,
    body: res,
  };
};
