import type { Role } from '@prisma/client';

import { prisma } from '../../config/database';

const publicUserSelect = {
  id: true,
  fullName: true,
  username: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const usersRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },

  async findAll(params: {
    role?: Role;
    isActive?: boolean;
    page: number;
    pageSize: number;
  }) {
    const where = {
      ...(params.role && { role: params.role }),
      ...(params.isActive !== undefined && { isActive: params.isActive }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },

  /** Listado simplificado para el selector de asignación de tickets */
  async findAdmins() {
    return prisma.user.findMany({
      where: { role: 'ADMIN_TI', isActive: true },
      select: { id: true, fullName: true, username: true },
      orderBy: { fullName: 'asc' },
    });
  },

  async update(id: string, data: { fullName?: string; isActive?: boolean }) {
    return prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  async create(data: { fullName: string; username: string; passwordHash: string; role: Role }) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: publicUserSelect,
    });
  },
};
