import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authRateLimiter } from '../../middlewares/rateLimit.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { authController } from './auth.controller';
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from './auth.schema';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', authRateLimiter, validate({ body: LoginSchema }), authController.login);

// POST /api/v1/auth/refresh
authRouter.post('/refresh', validate({ body: RefreshTokenSchema }), authController.refresh);

// POST /api/v1/auth/register — solo disponible en desarrollo o para crear admin inicial
authRouter.post('/register', validate({ body: RegisterSchema }), authController.register);

// GET /api/v1/auth/me — devuelve el usuario autenticado actual
authRouter.get('/me', authenticate, authController.me);
