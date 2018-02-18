import Environment from '../environment/Environment';
import * as express from 'express';
import { getLogger } from '../utils/logger';
import * as winston from 'winston';
import * as config from 'config';
import { wrap } from '../utils/express';

/**
 * This controller provides endpoints to check the app for health
 * Optionally this class can be extended with metrics insights
 *
 * @swagger
 * definitions:
 *   AppInfo:
 *      description: contains app info data
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        version:
 *          description: the actual version number of the app
 *          type: string
 *        date:
 *          description: date when the app was built
 *          type: string
 *
 *   HealthInfo:
 *      type: object
 *      properties:
 *        appInfo:
 *          $ref: '#/definitions/AppInfo'
 *        env:
 *          description: the value of the NODE_ENV variable
 *          type: string
 *        date:
 *          description: the current date as iso string of the app
 *          type: string
 *
 * @export
 * @class HealthController
 */
export default class HealthController {
  appInfo: any;
  _log: winston.LoggerInstance;

  constructor() {
    this._log = getLogger();
    this.appInfo = config.get('appInfo');
  }

  /**
   * Adds controller endpoints to the express pipeline
   *
   * @param {express.Express} app instance of express
   * @memberof HealthController
   */
  map(app: express.Express) {
    // This is used to get basic service info and also
    // tho perform health checks on the service
    this._log.info('Mapping health endpoint');

    /**
     * @swagger
     * /health:
     *   get:
     *     description: Returns health info
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: HealthInfo
     *         schema:
     *           $ref: '#/definitions/HealthInfo'
     *
     */
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
