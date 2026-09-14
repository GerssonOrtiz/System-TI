import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { ApiError } from '../shared/utils/ApiError';

/** Middleware central de manejo de errores — ÚNICO lugar que formatea errores al cliente */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Error de validación Zod
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no son válidos',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Error de negocio tipado
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  // Error inesperado del servidor
  const message =
    process.env['NODE_ENV'] === 'production'
      ? 'Error interno del servidor'
      : err instanceof Error
        ? err.message
        : 'Error desconocido';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
}
