import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import * as express from 'express';
import { wrap } from '../utils/express';
import CacheService from '../services/CacheService';
import { CacheEntry } from '../data';
import { random } from '../utils/random';

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
        if (data == null) {
          data = await this._cache.save({
            key: key,
            data: random()
          });
        }
        return res.json({ data: data });
      })
    );
  }
}
