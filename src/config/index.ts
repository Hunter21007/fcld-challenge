export interface IServiceConfig {
  servicePort: number;
}

export interface ILoggingConfig {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}
