import * as winston from 'winston';
import * as config from 'config';
import { ILoggingConfig, LOGGING } from '../config/index';
/**
 * This is a helper to create a winston logger instance
 * @param level the log level
 */
export function getLogger() {
  const logConfig = config.get(LOGGING) as ILoggingConfig;

  return new winston.Logger({
    transports: [
      new winston.transports.Console({ colorize: true, level: logConfig.level })
    ]
  });
}
