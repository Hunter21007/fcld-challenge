/**
 * Data map Class used to opepare the cache service
 * @swagger
 * definitions:
 *   CacheEntry:
 *     type: object
 *     description: CacheEntry Object used to retrieve and store cache data
 *     properties:
 *       key:
 *         description: unique key of the CacheEntry
 *         type: string
 *       data:
 *         description: cache data payload
 *         type: string
 *       ttl:
 *         description: time-to-live of the entry. if less than now() the entry will be dropped
 *         type: number
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
