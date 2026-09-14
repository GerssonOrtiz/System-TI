import type { Request, Response } from 'express';

import type { Role } from '@sistema-ti/shared';

import { ApiError } from '../../../shared/utils/ApiError';
import { ApiResponse } from '../../../shared/utils/ApiResponse';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

import type { CreateCommentInput } from './comments.schema';
import { commentsService } from './comments.service';

export const commentsController = {
  /** GET /api/v1/tickets/:id/comments */
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const comments = await commentsService.listComments(req.params['id'] ?? '', {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.success(res, comments);
  }),

  /** POST /api/v1/tickets/:id/comments */
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as CreateCommentInput;
    const comment = await commentsService.addComment(req.params['id'] ?? '', input, {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.created(res, comment, 'Comentario agregado correctamente');
  }),
};
