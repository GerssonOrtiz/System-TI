import type { Request, Response } from 'express';

import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

import type { LoginInput, RefreshTokenInput, RegisterInput } from './auth.schema';
import { authService } from './auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const ip = req.ip ?? req.socket.remoteAddress;
    const result = await authService.login(input, { ip });
    return ApiResponse.success(res, result, 200, 'Sesión iniciada correctamente');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, result);
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const result = await authService.register(input);
    return ApiResponse.created(res, result, 'Cuenta creada correctamente');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    // req.user ya fue validado por el middleware authenticate
    return ApiResponse.success(res, req.user);
  }),
};
