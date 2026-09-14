import type { TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';

import { prisma } from '../../config/database';

const ticketWithRelations = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  category: true,
  creatorId: true,
  creator: { select: { id: true, fullName: true, email: true } },
  assigneeId: true,
  assignee: { select: { id: true, fullName: true, email: true } },
  resolvedAt: true,
  closedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assigneeId?: string;
  search?: string;
  creatorId?: string; // para filtrar tickets del solicitante actual
}

export const ticketsRepository = {
  async findAll(filters: TicketFilters, page: number, pageSize: number) {
    const where = {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.category && { category: filters.category }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.creatorId && { creatorId: filters.creatorId }),
      ...(filters.search && {
        title: { contains: filters.search, mode: 'insensitive' as const },
      }),
    };

    const [tickets, total] = await prisma.$transaction([
      prisma.ticket.findMany({
        where,
        select: ticketWithRelations,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.ticket.count({ where }),
    ]);

    return { tickets, total };
  },

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      select: ticketWithRelations,
    });
  },

  async create(data: {
    title: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    creatorId: string;
  }) {
    return prisma.ticket.create({
      data,
      select: ticketWithRelations,
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: TicketPriority;
      category?: TicketCategory;
    },
  ) {
    return prisma.ticket.update({
      where: { id },
      data,
      select: ticketWithRelations,
    });
  },

  async updateStatus(id: string, status: TicketStatus) {
    const now = new Date();
    return prisma.ticket.update({
      where: { id },
      data: {
        status,
        ...(status === 'RESUELTO' && { resolvedAt: now }),
        ...(status === 'CERRADO' && { closedAt: now }),
      },
      select: ticketWithRelations,
    });
  },

  async assign(id: string, assigneeId: string | null) {
    return prisma.ticket.update({
      where: { id },
      data: { assigneeId },
      select: ticketWithRelations,
    });
  },

  /** Conteo por estado para el dashboard */
  async countByStatus() {
    return prisma.ticket.groupBy({
      by: ['status'],
      _count: { id: true },
    });
  },

  /** Conteo por prioridad para el dashboard */
  async countByPriority() {
    return prisma.ticket.groupBy({
      by: ['priority'],
      _count: { id: true },
    });
  },
};
