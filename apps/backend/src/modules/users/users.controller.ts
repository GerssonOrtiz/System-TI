import type { Request, Response } from 'express';

import { ApiError } from '../../shared/utils/ApiError';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

import { usersService } from './users.service';

export const usersController = {
  /** GET /api/v1/users/me */
  getMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await usersService.getMe(req.user.id);
    return ApiResponse.success(res, user);
  }),

  /** GET /api/v1/users — solo ADMIN_TI */
  listUsers: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize, role, isActive } = req.query as {
      page?: string;
      pageSize?: string;
      role?: string;
      isActive?: string;
    };

    const result = await usersService.listUsers({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      role: role as Parameters<typeof usersService.listUsers>[0]['role'],
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });

    return ApiResponse.paginated(res, result.data, result.meta);
  }),

  /** GET /api/v1/users/admins — lista simplificada para asignar tickets */
  listAdmins: asyncHandler(async (_req: Request, res: Response) => {
    const admins = await usersService.listAdmins();
    return ApiResponse.success(res, admins);
  }),
};
