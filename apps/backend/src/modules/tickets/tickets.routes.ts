import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { commentsRouter } from './comments/comments.routes';
import { ticketsController } from './tickets.controller';
import {
  AssignTicketSchema,
  CreateTicketSchema,
  UpdateTicketSchema,
  UpdateTicketStatusSchema,
} from './tickets.schema';

export const ticketsRouter = Router();

// Todos los endpoints de tickets requieren autenticación
ticketsRouter.use(authenticate);

// Rutas de tickets
ticketsRouter.get('/', ticketsController.list);
ticketsRouter.post('/', validate({ body: CreateTicketSchema }), ticketsController.create);
ticketsRouter.get('/:id', ticketsController.getById);
ticketsRouter.patch('/:id', validate({ body: UpdateTicketSchema }), ticketsController.update);
ticketsRouter.patch('/:id/status', validate({ body: UpdateTicketStatusSchema }), ticketsController.updateStatus);
ticketsRouter.patch('/:id/assign', validate({ body: AssignTicketSchema }), ticketsController.assign);

// Sub-rutas de comentarios
ticketsRouter.use('/:id/comments', commentsRouter);
