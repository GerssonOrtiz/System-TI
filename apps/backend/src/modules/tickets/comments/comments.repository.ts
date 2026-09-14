import { prisma } from '../../../config/database';

export const commentsRepository = {
  async findByTicketId(ticketId: string, includeInternal: boolean) {
    return prisma.ticketComment.findMany({
      where: {
        ticketId,
        ...(!includeInternal && { isInternal: false }),
      },
      select: {
        id: true,
        ticketId: true,
        authorId: true,
        author: { select: { id: true, fullName: true, email: true } },
        content: true,
        isInternal: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(data: {
    ticketId: string;
    authorId: string;
    content: string;
    isInternal: boolean;
  }) {
    return prisma.ticketComment.create({
      data,
      select: {
        id: true,
        ticketId: true,
        authorId: true,
        author: { select: { id: true, fullName: true, email: true } },
        content: true,
        isInternal: true,
        createdAt: true,
      },
    });
  },
};
