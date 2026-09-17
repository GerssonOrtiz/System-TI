import type { TaskStatus, TaskPriority } from '@prisma/client';

import { prisma } from '../../config/database';

const taskWithRelations = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  creatorId: true,
  creator: { select: { id: true, fullName: true, username: true } },
  linkedTicketId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export const tasksRepository = {
  async findAll(filters: TaskFilters, page: number, pageSize: number) {
    const where = {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.search && {
        title: { contains: filters.search, mode: 'insensitive' as const },
      }),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        select: taskWithRelations,
        orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      select: taskWithRelations,
    });
  },

  async create(data: {
    title: string;
    description?: string | null;
    priority: TaskPriority;
    dueDate?: Date | null;
    linkedTicketId?: string | null;
    creatorId: string;
  }) {
    return prisma.task.create({
      data,
      select: taskWithRelations,
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      priority?: TaskPriority;
      dueDate?: Date | null;
      linkedTicketId?: string | null;
    },
  ) {
    return prisma.task.update({
      where: { id },
      data,
      select: taskWithRelations,
    });
  },

  async updateStatus(id: string, status: TaskStatus) {
    return prisma.task.update({
      where: { id },
      data: { status },
      select: taskWithRelations,
    });
  },

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },

  async countByStatus() {
    return prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
    });
  },
};
