/**
 * Data map Class used to opepare the cache service
 */
export class CacheEntry {
  /**
   * Creates new CacheEntry Object from a plain data input
   * @param data
   */
  constructor(data: CacheEntry) {
    this.key = data.key;
    this.data = data.data;
    this.ttl = data.ttl;
  }
  /**
   * The cache key used to identitfy the entry: unique
   */
  key: string;
  /**
   * cache data payload
   */
  data?: string;
  /**
   * Time-to-Live used to implement expiration on the cache data
   */
  ttl?: number;
}
