import type { Role } from '@prisma/client';

import { prisma } from '../../config/database';

// Proyección de usuario sin passwordHash para respuestas al cliente
const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export const authRepository = {
  /** Busca un usuario por email, incluyendo passwordHash (solo para autenticación) */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...publicUserSelect,
        passwordHash: true,
      },
    });
  },

  /** Busca un usuario por ID, sin exponer passwordHash */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },

  /** Crea un nuevo usuario */
  async create(data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },
};
