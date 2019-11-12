import { isValidContentType } from '../isValidContentType';
import { CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE } from '../../config/constants';

describe('isValidContentType helper', () => {
  it('should be defined', () => {
    expect(isValidContentType).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof isValidContentType).toBe('function');
  });
  it('should return true if valid content type', () => {
    const headers = {
      [CONTENT_TYPE_KEY]: CONTENT_TYPE_VALUE,
    };
    expect(isValidContentType(headers)).toEqual(true);
  });
  it('should return true if valid content type lowercase', () => {
    const headers = {
      [CONTENT_TYPE_KEY]: CONTENT_TYPE_VALUE.toLowerCase(),
    };
    expect(isValidContentType(headers)).toEqual(true);
  });
  it('should return false if there is no content type', () => {
    const headers = {};
    expect(isValidContentType(headers)).toEqual(false);
  });
  it('should return false if wrong content type', () => {
    const headers = {
      [CONTENT_TYPE_KEY]: 'wrong',
    };
    expect(isValidContentType(headers)).toEqual(false);
  });
});
