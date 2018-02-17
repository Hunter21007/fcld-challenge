export const SERVICE = 'serviceConfig';
export interface IServiceConfig {
  servicePort: number;
}

export const LOGGING = 'logging';
export interface ILoggingConfig {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}

export const MONGODB = 'mongoDb';
export interface IMongoConfig {
  url: string;
  dbName: string;
}
