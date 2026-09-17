import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';

/**
 * Middleware de validación Zod.
 * Valida body, query y/o params según los schemas proporcionados.
 * Si falla, pasa el ZodError al errorMiddleware via next(err) → respuesta 422.
 */
export function validate(schemas: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body) as unknown;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
