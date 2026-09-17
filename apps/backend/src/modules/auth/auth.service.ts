import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { AuthResponse, PublicUser } from '@sistema-ti/shared';
import { AuditAction, AuditEntity } from '@sistema-ti/shared';

import { env } from '../../config/env';
import { ApiError } from '../../shared/utils/ApiError';
import { auditService } from '../audit/audit.service';

import type { LoginInput, RegisterInput } from './auth.schema';
import { authRepository } from './auth.repository';

interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  type: 'access' | 'refresh';
}

function signAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

function signRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'refresh' }, env.JWT_REFRESH_SECRET as string, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

function toPublicUser(user: {
  id: string;
  fullName: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    role: user.role as PublicUser['role'],
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

export const authService = {
  async login(input: LoginInput, meta?: { ip?: string }): Promise<AuthResponse> {
    const user = await authRepository.findByUsername(input.username);

    if (!user || !user.isActive) {
      // Registrar intento fallido si el usuario existe pero está inactivo
      if (user) {
        await auditService.logAction({
          action: AuditAction.LOGIN_FAILED,
          entity: AuditEntity.USER,
          entityId: user.id,
          userId: user.id,
          metadata: { reason: 'cuenta_inactiva', ip: meta?.ip },
        });
      }
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      await auditService.logAction({
        action: AuditAction.LOGIN_FAILED,
        entity: AuditEntity.USER,
        entityId: user.id,
        userId: user.id,
        metadata: { reason: 'contraseña_incorrecta', ip: meta?.ip },
      });
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const tokenPayload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await auditService.logAction({
      action: AuditAction.LOGIN,
      entity: AuditEntity.USER,
      entityId: user.id,
      userId: user.id,
      metadata: { ip: meta?.ip },
    });

    return {
      user: toPublicUser(user),
      tokens: { accessToken, refreshToken },
    };
  },

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET as string) as TokenPayload;
    } catch {
      throw ApiError.unauthorized('Refresh token inválido o expirado');
    }

    if (payload.type !== 'refresh') {
      throw ApiError.unauthorized('Tipo de token inválido');
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Usuario no encontrado o inactivo');
    }

    const accessToken = signAccessToken({ sub: user.id, username: user.username, role: user.role });
    return { accessToken };
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await authRepository.findByUsername(input.username);
    if (existing) {
      throw ApiError.conflict('USERNAME_ALREADY_EXISTS', 'Ya existe una cuenta con ese nombre de usuario');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await authRepository.create({
      fullName: input.fullName,
      username: input.username,
      passwordHash,
      role: input.role,
    });

    await auditService.logAction({
      action: AuditAction.CREATE,
      entity: AuditEntity.USER,
      entityId: user.id,
      userId: user.id,
      metadata: { username: user.username, role: user.role },
    });

    const tokenPayload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      user: toPublicUser(user),
      tokens: { accessToken, refreshToken },
    };
  },
};
