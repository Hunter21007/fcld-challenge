import { ICacheConfig, CACHE } from '../config';
import * as config from 'config';

/**
 * returns a date TimeStamp
 */
export function now() {
  return Date.now();
}
/**
 * returns Date object reprecenting actual timestamp
 */
export function dateNow() {
  return new Date(now());
}
/**
 * returns ISO Date String in utc time
 */
export function isoNow() {
  return dateNow().toISOString();
}

/**
 * returns a ttl based on date now and configured max ttl
 */
export function getTtl() {
  const cacheConfig = config.get(CACHE) as ICacheConfig;
  // now returns timestamp in milliseconds
  // so we multiply ttl by 1000 to make seconds millisecodns
  // and then add them to the now => the ttl of the enty in the future
  return now() + cacheConfig.ttl * 1000;
}
