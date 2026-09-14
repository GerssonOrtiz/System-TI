import {
  AuditAction,
  AuditEntity,
  PAGINATION,
  Role,
  TICKET_STATUS_TRANSITIONS,
  TicketStatus,
} from '@sistema-ti/shared';
import type {
  AssignTicketInput,
  CreateTicketInput,
  TicketFiltersInput,
  UpdateTicketInput,
  UpdateTicketStatusInput,
} from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { auditService } from '../audit/audit.service';

import type { TicketFilters } from './tickets.repository';
import { ticketsRepository } from './tickets.repository';

export const ticketsService = {
  async listTickets(
    requestingUser: { id: string; role: Role },
    filters: TicketFiltersInput,
  ) {
    const page = filters.page ?? PAGINATION.DEFAULT_PAGE;
    const pageSize = Math.min(filters.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);

    const repoFilters: TicketFilters = {
      status: filters.status as TicketFilters['status'],
      priority: filters.priority as TicketFilters['priority'],
      category: filters.category as TicketFilters['category'],
      assigneeId: filters.assigneeId,
      search: filters.search,
    };

    // Solicitante solo ve sus propios tickets
    if (requestingUser.role === Role.SOLICITANTE) {
      repoFilters.creatorId = requestingUser.id;
    }

    const { tickets, total } = await ticketsRepository.findAll(repoFilters, page, pageSize);

    return {
      data: tickets,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async getTicketById(id: string, requestingUser: { id: string; role: Role }) {
    const ticket = await ticketsRepository.findById(id);

    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    // Solicitante solo puede ver sus propios tickets
    if (requestingUser.role === Role.SOLICITANTE && ticket.creatorId !== requestingUser.id) {
      throw ApiError.forbidden('No tienes acceso a este ticket');
    }

    return ticket;
  },

  async createTicket(input: CreateTicketInput, creatorId: string) {
    const ticket = await ticketsRepository.create({
      title: input.title,
      description: input.description,
      priority: input.priority as Parameters<typeof ticketsRepository.create>[0]['priority'],
      category: input.category as Parameters<typeof ticketsRepository.create>[0]['category'],
      creatorId,
    });

    await auditService.logAction({
      action: AuditAction.CREATE,
      entity: AuditEntity.TICKET,
      entityId: ticket.id,
      userId: creatorId,
      metadata: { title: ticket.title, priority: ticket.priority, category: ticket.category },
    });

    return ticket;
  },

  async updateTicket(
    id: string,
    input: UpdateTicketInput,
    requestingUser: { id: string; role: Role },
  ) {
    const ticket = await ticketsRepository.findById(id);
    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    // Solo el creador o un Admin TI puede editar
    if (requestingUser.role === Role.SOLICITANTE && ticket.creatorId !== requestingUser.id) {
      throw ApiError.forbidden('No puedes editar este ticket');
    }

    // Solicitante no puede cambiar priority ni category directamente
    if (requestingUser.role === Role.SOLICITANTE && (input.priority ?? input.category)) {
      throw ApiError.forbidden('No puedes cambiar la prioridad o categoría del ticket');
    }

    const updated = await ticketsRepository.update(id, {
      title: input.title,
      description: input.description,
      priority: input.priority as Parameters<typeof ticketsRepository.update>[1]['priority'],
      category: input.category as Parameters<typeof ticketsRepository.update>[1]['category'],
    });

    await auditService.logAction({
      action: AuditAction.UPDATE,
      entity: AuditEntity.TICKET,
      entityId: id,
      userId: requestingUser.id,
      metadata: { changes: input },
    });

    return updated;
  },

  async updateStatus(
    id: string,
    input: UpdateTicketStatusInput,
    requestingUser: { id: string; role: Role },
  ) {
    const ticket = await ticketsRepository.findById(id);
    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    // Solo Admin TI puede cambiar el estado
    if (requestingUser.role === Role.SOLICITANTE) {
      throw ApiError.forbidden('Solo el equipo de TI puede cambiar el estado del ticket');
    }

    const allowedTransitions = TICKET_STATUS_TRANSITIONS[ticket.status as TicketStatus];
    if (!allowedTransitions.includes(input.status as TicketStatus)) {
      throw ApiError.unprocessable(
        'INVALID_STATUS_TRANSITION',
        `No se puede cambiar el estado de ${ticket.status} a ${input.status}`,
        { allowedTransitions },
      );
    }

    const updated = await ticketsRepository.updateStatus(id, input.status as Parameters<typeof ticketsRepository.updateStatus>[1]);

    await auditService.logAction({
      action: AuditAction.STATUS_CHANGE,
      entity: AuditEntity.TICKET,
      entityId: id,
      userId: requestingUser.id,
      metadata: { from: ticket.status, to: input.status },
    });

    return updated;
  },

  async assignTicket(
    id: string,
    input: AssignTicketInput,
    requestingUser: { id: string; role: Role },
  ) {
    // Solo Admin TI puede asignar tickets
    if (requestingUser.role === Role.SOLICITANTE) {
      throw ApiError.forbidden('Solo el equipo de TI puede asignar tickets');
    }

    const ticket = await ticketsRepository.findById(id);
    if (!ticket) {
      throw ApiError.notFound('TICKET_NOT_FOUND', 'Ticket no encontrado');
    }

    const updated = await ticketsRepository.assign(id, input.assigneeId);

    await auditService.logAction({
      action: AuditAction.UPDATE,
      entity: AuditEntity.TICKET,
      entityId: id,
      userId: requestingUser.id,
      metadata: {
        field: 'assigneeId',
        from: ticket.assigneeId,
        to: input.assigneeId,
      },
    });

    return updated;
  },
};
