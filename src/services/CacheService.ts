import * as mongo from 'mongodb';
import * as config from 'config';
import { MONGODB, IMongoConfig } from '../config';
import { getDb } from '../utils/mongo';
import { CacheEntry } from '../data';
import { now, getTtl } from '../utils/date';
import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import { debug } from 'util';

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

  async create(entry: CacheEntry): Promise<CacheEntry> {
    const col = await this.ensureCollection();
    const test = await col
      .find({
        key: entry.key
      })
      .limit(1)
      .toArray();
    if (test.length > 0 && test[0].key == entry.key) {
      if (test[0].ttl > now()) {
        throw new Error('Can not create entry, key already exist');
      } else {
        const rmRes = await col.deleteOne({ key: entry.key });
      }
    }

    // Sanitize ttl for the entry
    entry.ttl = entry.ttl != null ? entry.ttl : getTtl();
    const res = await col.insert(entry);

    if (res.insertedCount != 1) {
      throw new Error('Could not create cache entry');
    }

    const ops = res.ops as CacheEntry[];
    if (ops.length != 1) {
      throw new Error('Data count mismatch during create entry');
    }
    this._log.debug(' created new cache entry: %j', ops[0]);
    return ops[0];
  }
}
