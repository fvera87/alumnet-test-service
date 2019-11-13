import { stringCleaner } from '../stringCleaner';

describe('stringCleaner tests', () => {
  it('should throw an error for null or invalid inputs', () => {
    expect(() => stringCleaner(null)).toThrow('StringCleanerError: input must be a string');
    expect(() => stringCleaner(undefined)).toThrow('StringCleanerError: input must be a string');
    // @ts-ignore
    expect(() => stringCleaner(1)).toThrow('StringCleanerError: input must be a string');
  });
  it('should cleanup dangerous characters', () => {
    expect(stringCleaner('(";st|>ri)@<ng+,')).toEqual('string');
  });
});
