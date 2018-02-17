export const SERVICE = 'serviceConfig';
export interface IServiceConfig {
  servicePort: number;
}

export const LOGGING = 'logging';
export interface ILoggingConfig {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}

export const MONGODB = 'mongoDb';
export interface IMongoConfig {
  url: string;
  dbName: string;
}

export const CACHE = 'cache';
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
