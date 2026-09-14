import type { Request, Response } from 'express';

import { KbFiltersSchema, Role } from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

import type { CreateKbArticleInput, UpdateKbArticleInput } from './kb.schema';
import { kbService } from './kb.service';

export const kbController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const filters = KbFiltersSchema.parse(req.query);
    const result = await kbService.listArticles(req.user.role as Role, filters);
    return ApiResponse.paginated(res, result.data, result.meta);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const article = await kbService.getBySlug(req.params['slug'] ?? '', req.user.role as Role);
    return ApiResponse.success(res, article);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as CreateKbArticleInput;
    const article = await kbService.createArticle(input, req.user.id);
    return ApiResponse.created(res, article, 'Artículo creado correctamente');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as UpdateKbArticleInput;
    const article = await kbService.updateArticle(req.params['id'] ?? '', input, req.user.id);
    return ApiResponse.success(res, article, 'Artículo actualizado correctamente');
  }),

  publish: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const article = await kbService.togglePublish(req.params['id'] ?? '', true, req.user.id);
    return ApiResponse.success(res, article, 'Artículo publicado correctamente');
  }),

  unpublish: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const article = await kbService.togglePublish(req.params['id'] ?? '', false, req.user.id);
    return ApiResponse.success(res, article, 'Artículo despublicado correctamente');
  }),
};
