import type { Role } from '@sistema-ti/shared';
import { PAGINATION } from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';

import { usersRepository } from './users.repository';

export const usersService = {
  async getMe(userId: string) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('USER_NOT_FOUND', 'Usuario no encontrado');
    }
    return user;
  },

  async listUsers(params: {
    role?: Role;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page ?? PAGINATION.DEFAULT_PAGE;
    const pageSize = Math.min(params.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);

    const { users, total } = await usersRepository.findAll({
      role: params.role as Parameters<typeof usersRepository.findAll>[0]['role'],
      isActive: params.isActive,
      page,
      pageSize,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async listAdmins() {
    return usersRepository.findAdmins();
  },

  async updateUser(currentUserId: string, targetId: string, data: { fullName?: string; isActive?: boolean }) {
    const user = await usersRepository.findById(targetId);
    if (!user) {
      throw ApiError.notFound('USER_NOT_FOUND', 'Usuario no encontrado');
    }

    // Un usuario solo puede editarse a sí mismo (a menos que sea admin, que puede desactivar cuentas)
    if (currentUserId !== targetId) {
      throw ApiError.forbidden('No puedes editar la información de otro usuario');
    }

    return usersRepository.update(targetId, data);
  },
};
