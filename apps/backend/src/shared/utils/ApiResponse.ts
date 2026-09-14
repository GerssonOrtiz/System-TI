import type { Response } from 'express';

import type { PaginationMeta } from '@sistema-ti/shared';

/** Helpers para formatear respuestas HTTP con el envelope estándar */
export const ApiResponse = {
  success<T>(res: Response, data: T, statusCodeOrMessage: number | string = 200, message?: string) {
    const statusCode = typeof statusCodeOrMessage === 'number' ? statusCodeOrMessage : 200;
    const msg = typeof statusCodeOrMessage === 'string' ? statusCodeOrMessage : message;
    return res.status(statusCode).json({
      success: true,
      data,
      ...(msg && { message: msg }),
    });
  },

  created<T>(res: Response, data: T, message?: string) {
    return ApiResponse.success(res, data, 201, message);
  },

  noContent(res: Response) {
    return res.status(204).send();
  },

  paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      data,
      meta,
    });
  },
};
