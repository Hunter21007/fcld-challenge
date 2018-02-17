import * as mongo from 'mongodb';
import * as config from 'config';
import { MONGODB, IMongoConfig, ICacheConfig, CACHE } from '../config';
import { getDb } from '../utils/mongo';
import { CacheEntry } from '../data';
import { now, getTtl } from '../utils/date';
import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import { debug } from 'util';
import { InsertOneWriteOpResult } from 'mongodb';

export default class CacheService {
  _config: ICacheConfig;
  _log: winston.LoggerInstance;
  _dbName: string;

  constructor() {
    this._dbName = (config.get(MONGODB) as IMongoConfig).dbName;
    this._log = getLogger();
    this._config = config.get(CACHE) as ICacheConfig;
  }

  /**
   * used to ensure that the cache callection is present and usable
   * and that all indexes required are in place
   */
  async ensureCollection() {
    const db = await getDb(this._dbName);
    const col = db.collection<CacheEntry>(CacheEntry.name);
    await col.createIndex({ key: 1 }, { unique: true });
    await col.createIndex({ ttl: 1 });
    return col;
  }

  /**
   * This method will store cache entry by either creatig new one or owerwrite
   * existing one
   * @param entry the entry to be saved
   */
  async save(entry: CacheEntry): Promise<CacheEntry> {
    const col = await this.ensureCollection();
    const test = await this.findByKey(col, entry.key, 1);

    // Sanitize ttl for the entry
    entry.ttl = entry.ttl != null ? entry.ttl : getTtl();

    let saved: CacheEntry;
    if (test.length > 0 && test[0].key == entry.key) {
      const res = await col.updateOne(
        {
          key: entry.key
        },
        { $set: entry }
      );
      if (res.result.ok != 1) {
        throw new Error('Could not create cache entry');
      }
      saved = entry;
    } else {
      const res = await col.insert(entry);
      if (res.result.ok != 1) {
        throw new Error('Could not create cache entry');
      }
      saved = (res.ops as CacheEntry[])[0];
    }

    this._log.debug(' created new cache entry: %j', saved[0]);
    return saved;
  }

  /**
   * returns key entry identitfied by key or null if nothing present
   * @param key
   */
  async get(key: string): Promise<CacheEntry> {
    const col = await this.ensureCollection();
    const test = await this.findByKey(col, key, 1);
    if (test.length < 1) {
      return null;
    }
    return test[0];
  }

  /**
   * Wraps find operation for searching data
   * @param col the collection with cache entries
   * @param key
   * @param limit if given will use to limit cursor results
   */
  async findByKey(
    col: mongo.Collection<CacheEntry>,
    key: string,
    limit?: number
  ) {
    const cursor = await col.find({
      key: key
    });
    if (limit) {
      return await cursor.limit(1).toArray();
    }
    return await cursor.toArray();
  }

  /**
   * returns all entries from cache, limited by limit if given
   * @param limit
   */
  async getAll(limit?: number) {
    const col = await this.ensureCollection();
    const cursor = await col.find({});
    if (limit) {
      return await cursor.limit(1).toArray();
    }
    return await cursor.toArray();
  }

  /**
   * Wipes all cahed entries from cache store
   */
  async delAll() {
    const col = await this.ensureCollection();
    const res = await col.deleteMany({});
    if (res.result.ok != 1) {
      throw new Error('Could not wipe cache store');
    }
    return res.deletedCount;
  }

  /**
   * Removes the entry identitfied by key from datastore
   * @param key
   */
  async del(key: string) {
    const col = await this.ensureCollection();
    const res = await col.deleteOne({
      key: key
    });
    return res.deletedCount;
  }

  /**
   * Checks for cache.max and removes old objects if needed
   */
  async applyLimiter() {
    const count = await this.count();
    const diff = count - this._config.max;
    if (diff > 0) {
      await this.delOld(diff);
      return diff;
    }
    return 0;
  }

  /**
   * Returns count of cache entries
   */
  async count() {
    const col = await this.ensureCollection();
    const res = await col.count({});
    return res;
  }

  /**
   * Looks for oldest objects by ttl and deletes {count} of them
   * @param count specifies how many entries should be deleted
   */
  async delOld(count: number) {
    const col = await this.ensureCollection();
    const old = await col
      .find()
      .sort({ ttl: +1 })
      .limit(count)
      .toArray();

    await Promise.all(
      old.map(async o => {
        await col.deleteOne({ key: o.key });
      })
    );
  }
}
