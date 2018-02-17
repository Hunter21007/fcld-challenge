import * as winston from 'winston';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as expressWinston from 'express-winston';
import * as cors from 'cors';
import * as fs from 'fs';
import { format } from 'util';
import * as config from 'config';

// IoC and Configuration must be imported before other modules
import Environment from './environment/Environment';
import { IServiceConfig } from './config/index';

/**
 * We declare an async function here to make our entrypoint capable to use await
 * @returns Promise<express> containing the express app object
 */
async function runApp() {
  let app: express.Express;

  const _log = new winston.Logger({
    transports: [new winston.transports.Console({ level: 'info' })]
  });

  try {
    _log.info('Creating Server');
    app = express();

    // Helmet helps you secure your Express apps
    // by setting various HTTP headers
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(
      helmet.hsts({
        maxAge: 31536000,
        includeSubdomains: true
      })
    );
    // We also are using cors
    // cors opetions must be done according to the environment
    app.use(cors());

    // Adding an error logger to the express pipeline
    app.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console({ level: 'warning' })]
      })
    );

    app.use(bodyParser.json());

    // Add Middleware to logout errors
    app.use((err, req, res, next) => {
      _log.error(err.message);
      _log.error(err.stack);

      if (!Environment.isProduction()) {
        res.status(200).send(
          format('%j', {
            error: {
              message: err.message,
              stack: err.stack
            }
          })
        );
      } else {
        // do not send error details back to the caller on procustion
        res.status(200).send(
          format('%j', {
            error: {
              message: 'An unexpected error occured'
            }
          })
        );
      }
    });

    _log.info('Mapping Routes to the server pipeline');
    // Add service routes here
    //
  } catch (err) {
    _log && _log.error('Error during Startup');
    process.emit('uncaughtException', err);
  }

  _log.info('Starting Service');
  _log.info('Environment: %s', Environment.getName());
  // This will allow us to override the port by environment config
  const startUpConfig = config.get('serviceConfig') as IServiceConfig;
  // We do not start listener if the server is started from unit test
  if (!module.parent) {
    const server = app.listen(startUpConfig.servicePort);
    server.on('listening', () =>
      _log.info('Server listening on %d', startUpConfig.servicePort)
    );
  }
  return app;
}

export const app = runApp();
