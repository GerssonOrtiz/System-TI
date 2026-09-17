import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { Role } from '@sistema-ti/shared';

import { env } from '../config/env';
import { ApiError } from '../shared/utils/ApiError';

interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
  type: 'access' | 'refresh';
}

/** Verifica el JWT de acceso y adjunta req.user con { id, role, username } */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Se requiere token de autenticación');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw ApiError.unauthorized('Token no proporcionado');
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;

    if (payload.type !== 'access') {
      throw ApiError.unauthorized('Tipo de token inválido');
    }

    req.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('El token ha expirado');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Token inválido');
    }
    throw err;
  }
}

/** Guard por rol. Recibe array de roles permitidos */
export function authorize(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('No tienes permisos para realizar esta acción');
    }
    next();
  };
}
