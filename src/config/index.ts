export const SERVICE = 'serviceConfig';
/**
 * Describes the configuration schema for the service config
 */
export interface IServiceConfig {
  servicePort: number;
}

export const LOGGING = 'logging';
/**
 * Describes the configuration schema for the logging config
 */
export interface ILoggingConfig {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}

export const MONGODB = 'mongoDb';
/**
 * Describes the configuration schema for the mongodb config
 */
export interface IMongoConfig {
  url: string;
  dbName: string;
}

export const CACHE = 'cache';
/**
 * Describes the configuration schema for the cache config
 */
export interface ICacheConfig {
  /**
   * the ttl of a cache entry in seconds
   *
   * @type {number}
   * @memberof ICacheConfig
   */
  ttl: number;
  /**
   * maximum amount of cache entries
   *
   * @type {number}
   * @memberof ICacheConfig
   */
  max: number;
}
