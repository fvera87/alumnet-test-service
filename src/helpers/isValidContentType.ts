import { CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE } from '../config/constants';

export const isValidContentType = (headers: object) => {
  const contentType = headers[CONTENT_TYPE_KEY] || headers[CONTENT_TYPE_KEY.toLocaleLowerCase()];
  if (!contentType || contentType.toLocaleLowerCase() !== CONTENT_TYPE_VALUE.toLocaleLowerCase()) {
    return false;
  }
  return true;
};
