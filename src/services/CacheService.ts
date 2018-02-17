import * as mongo from 'mongodb';
import * as config from 'config';
import { MONGODB, IMongoConfig } from '../config';
import { getDb } from '../utils/mongo';
import { CacheEntry } from '../data';
import { now, getTtl } from '../utils/date';
import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import { debug } from 'util';
import { InsertOneWriteOpResult } from 'mongodb';

export default class CacheService {
  _log: winston.LoggerInstance;
  _dbName: string;

  constructor() {
    this._dbName = (config.get(MONGODB) as IMongoConfig).dbName;
    this._log = getLogger();
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

    let ops: CacheEntry;
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
      ops = entry;
    } else {
      const res = await col.insert(entry);
      if (res.result.ok != 1) {
        throw new Error('Could not create cache entry');
      }
      if (res.ops.length != 1) {
        throw new Error('Data count mismatch during create entry');
      }
      ops = (res.ops as CacheEntry[])[0];
    }

    this._log.debug(' created new cache entry: %j', ops[0]);
    return ops;
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
  }
}
