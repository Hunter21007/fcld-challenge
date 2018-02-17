import Environment from '../environment/Environment';
import * as express from 'express';
import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import * as config from 'config';
import { wrap } from '../utils/express';

export default class HealthController {
  appInfo: any;
  _log: winston.LoggerInstance;

  constructor() {
    this._log = getLogger();
    this.appInfo = config.get('appInfo');
  }

  map(app: express.Express) {
    // This is used to get basic service info and also
    // tho perform health checks on the service
    this._log.info('Mapping health endpoint');
    app.get(
      '/health',
      wrap(async (req, res, next) => {
        this._log.debug('Executing health info');
        res.json({
          appInfo: this.appInfo,
          env: Environment.getName(),
          date: new Date(Date.now()).toISOString()
        });
      })
    );
  }
}
