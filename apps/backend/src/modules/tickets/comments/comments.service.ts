import { AuditAction, AuditEntity, Role } from '@sistema-ti/shared';
import type { CreateCommentInput } from '@sistema-ti/shared';

import { ApiError } from '../../../shared/utils/ApiError';
import { auditService } from '../../audit/audit.service';
import { ticketsRepository } from '../tickets.repository';

import { commentsRepository } from './comments.repository';

export const commentsService = {
  async listComments(ticketId: string, requestingUser: { id: string; role: Role }) {
    // Verificar que el ticket existe
    const ticket = await ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    // Solicitante solo puede ver sus propios tickets
    if (requestingUser.role === Role.SOLICITANTE && ticket.creatorId !== requestingUser.id) {
      throw ApiError.forbidden('No tienes acceso a este ticket');
    }

    // Admin ve todos los comentarios (incluidos internos), Solicitante solo los públicos
    const includeInternal = requestingUser.role === Role.ADMIN_TI;
    return commentsRepository.findByTicketId(ticketId, includeInternal);
  },

  async addComment(
    ticketId: string,
    input: CreateCommentInput,
    requestingUser: { id: string; role: Role },
  ) {
    const ticket = await ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    // Solicitante solo puede comentar en sus propios tickets
    if (requestingUser.role === Role.SOLICITANTE && ticket.creatorId !== requestingUser.id) {
      throw ApiError.forbidden('No tienes acceso a este ticket');
    }

    // Solo Admin TI puede crear comentarios internos
    if (input.isInternal && requestingUser.role !== Role.ADMIN_TI) {
      throw ApiError.forbidden('Solo el equipo de TI puede crear notas internas');
    }

    const comment = await commentsRepository.create({
      ticketId,
      authorId: requestingUser.id,
      content: input.content,
      isInternal: input.isInternal ?? false,
    });

    await auditService.logAction({
      action: AuditAction.CREATE,
      entity: AuditEntity.TICKET,
      entityId: ticketId,
      userId: requestingUser.id,
      metadata: { type: 'comment', isInternal: comment.isInternal },
    });

    return comment;
  },
};
