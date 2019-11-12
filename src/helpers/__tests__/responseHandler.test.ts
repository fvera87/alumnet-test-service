import { generateErrorResponse, generateResponse } from '../responseHandler';

describe('generateErrorResponse helper', () => {
  it('should exist', () => {
    expect(generateErrorResponse).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof generateErrorResponse).toBe('function');
  });
  it('should match', () => {
    const res = {
      statusCode: 400,
      body: { errorMessage: 'Bad request' },
    };
    const error = generateErrorResponse(400, 'Bad request');
    expect(error).toEqual(res);
  });
});

describe('generateResponse helper', () => {
  it('should exist', () => {
    expect(generateResponse).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof generateResponse).toBe('function');
  });
  it('should match', () => {
    const res = {
      statusCode: 200,
      body: { user: { id: 'userId' } },
    };
    const error = generateResponse(200, { user: { id: 'userId' } });
    expect(error).toEqual(res);
  });
});
