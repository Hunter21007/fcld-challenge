import * as winston from 'winston';
import * as config from 'config';
import { ILoggingConfig } from '../config/index';
/**
 * This is a helper to create a winston logger instance
 * @param level the log level
 */
export function getLogger() {
  const logConfig = config.get('logging') as ILoggingConfig;

  return new winston.Logger({
    transports: [new winston.transports.Console({ level: logConfig.level })]
  });
}
