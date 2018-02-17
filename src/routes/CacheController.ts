import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import * as express from 'express';
import { wrap } from '../utils/express';
import CacheService from '../services/CacheService';
import { CacheEntry } from '../data';
import { random } from '../utils/random';
import { clean } from '../utils/transform';
import { now } from '../utils/date';
import { ICacheConfig, CACHE } from '../config/index';
import * as config from 'config';

export default class CacheController {
  _cache: CacheService;
  _log: winston.LoggerInstance;
  constructor() {
    this._log = getLogger();
    this._cache = new CacheService();
  }

  map(app: express.Express) {
    this._log.info('Mapping cache endpoint');

    app.get(
      '/cache',
      wrap(async (req, res, next) => {
        const data: CacheEntry[] = await this._cache.getAll();
        this._log.info('Returning %d entries from cache', data.length);
        return res.json({ data: data });
      })
    );

    app.get(
      '/cache/keys',
      wrap(async (req, res, next) => {
        const data: CacheEntry[] = await this._cache.getAll();
        return res.json({ data: data.map(d => d.key) });
      })
    );

    app.get(
      '/cache/:key',
      wrap(async (req, res, next) => {
        const key = req.params.key;
        let data: CacheEntry = await this._cache.get(key);
        if (data == null || data.ttl < now()) {
          // I have no idea how to unit test this line
          this._log.warn('Cache miss for key: %s', key);
          data = await this._cache.save({
            key: key,
            data: random()
          });
        } else {
          this._log.info('Cache hit for key: %s', key);
          data.ttl = null;
          data = await this._cache.save(data);
        }
        return res.json({ data: data });
      })
    );

    app.post(
      '/cache',
      wrap(async (req, res, next) => {
        this._cache.applyLimiter();
        let data = clean<CacheEntry>(CacheEntry, req.body);
        data = await this._cache.save(data);
        return res.json({ data: data });
      })
    );

    app.put(
      '/cache/:key',
      wrap(async (req, res, next) => {
        const key = req.params.key;
        let data: CacheEntry = await this._cache.get(key);
        if (data == null) {
          throw new Error(`Entry with key ${key} was not found in datastore`);
        }

        const inData = clean<CacheEntry>(CacheEntry, req.body);
        data.data = inData.data;
        data = await this._cache.save(data);
        return res.json({ data: data });
      })
    );

    app.delete(
      '/cache',
      wrap(async (req, res, next) => {
        const data: number = await this._cache.delAll();
        return res.json({ data: data });
      })
    );

    app.delete(
      '/cache/:key',

      wrap(async (req, res, next) => {
        const key = req.params.key;

        const data: number = await this._cache.del(key);
        return res.json({ data: data });
      })
    );
  }
}
