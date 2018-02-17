import * as uuidv4 from 'uuid/v4';
import * as sha512 from 'js-sha512';

/**
 * returns random string
 */
export function random(): string {
  const uuid = uuidv4();
  const res = sha512(uuid);
  return res;
}
