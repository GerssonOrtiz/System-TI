import type { Request, Response } from 'express';

import type { Role } from '@sistema-ti/shared';
import { TicketFiltersSchema } from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

import type {
  AssignTicketInput,
  CreateTicketInput,
  UpdateTicketInput,
  UpdateTicketStatusInput,
} from './tickets.schema';
import { ticketsService } from './tickets.service';

export const ticketsController = {
  /** GET /api/v1/tickets */
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const filters = TicketFiltersSchema.parse(req.query);
    const result = await ticketsService.listTickets(
      { id: req.user.id, role: req.user.role as Role },
      filters,
    );
    return ApiResponse.paginated(res, result.data, result.meta);
  }),

  /** GET /api/v1/tickets/:id */
  getById: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const ticket = await ticketsService.getTicketById(req.params['id'] ?? '', {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.success(res, ticket);
  }),

  /** POST /api/v1/tickets */
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as CreateTicketInput;
    const ticket = await ticketsService.createTicket(input, req.user.id);
    return ApiResponse.created(res, ticket, 'Ticket creado correctamente');
  }),

  /** PATCH /api/v1/tickets/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as UpdateTicketInput;
    const ticket = await ticketsService.updateTicket(req.params['id'] ?? '', input, {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.success(res, ticket, 'Ticket actualizado correctamente');
  }),

  /** PATCH /api/v1/tickets/:id/status */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as UpdateTicketStatusInput;
    const ticket = await ticketsService.updateStatus(req.params['id'] ?? '', input, {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.success(res, ticket, 'Estado actualizado correctamente');
  }),

  /** PATCH /api/v1/tickets/:id/assign */
  assign: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as AssignTicketInput;
    const ticket = await ticketsService.assignTicket(req.params['id'] ?? '', input, {
      id: req.user.id,
      role: req.user.role as Role,
    });
    return ApiResponse.success(res, ticket, 'Ticket asignado correctamente');
  }),
};
