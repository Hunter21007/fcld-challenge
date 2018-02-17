import { RequestHandler } from 'express';

/**
 * this is used wrap async routes for express
 * since express actually can not use async handler
 * @param fn
 */
export function wrap(fn: RequestHandler) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      next(err);
    });
  };
}
