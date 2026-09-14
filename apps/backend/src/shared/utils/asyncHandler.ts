import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrapper que convierte un controller async en un RequestHandler que propaga
 * errores al middleware central de errores (error.middleware.ts) sin
 * necesidad de bloques try/catch en cada controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
