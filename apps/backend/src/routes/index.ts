import { Router } from 'express';

import { Role } from '@sistema-ti/shared';

import { authenticate, authorize } from '../middlewares/auth.middleware';
import { authRouter } from '../modules/auth/auth.routes';
import { kbRouter } from '../modules/knowledge-base/kb.routes';
import { tasksRepository } from '../modules/tasks/tasks.repository';
import { tasksRouter } from '../modules/tasks/tasks.routes';
import { ticketsRepository } from '../modules/tickets/tickets.repository';
import { ticketsRouter } from '../modules/tickets/tickets.routes';
import { usersRouter } from '../modules/users/users.routes';
import { ApiResponse } from '../shared/utils/ApiResponse';
import { asyncHandler } from '../shared/utils/asyncHandler';

export const router = Router();

// ─── Info de la API ───────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      message: 'API Sistema de Gestión de TI v1.0',
      version: '1.0.0',
      docs: '/api/v1/docs',
    },
  });
});

// ─── Módulos ──────────────────────────────────────────────────────────────────
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/tickets', ticketsRouter);
router.use('/tasks', tasksRouter);
router.use('/kb', kbRouter);

// ─── Dashboard metrics (solo ADMIN_TI) ───────────────────────────────────────
router.get(
  '/dashboard/metrics',
  authenticate,
  authorize([Role.ADMIN_TI]),
  asyncHandler(async (_req, res) => {
    const [ticketsByStatusRaw, ticketsByPriorityRaw, tasksByStatusRaw] = await Promise.all([
      ticketsRepository.countByStatus(),
      ticketsRepository.countByPriority(),
      tasksRepository.countByStatus(),
    ]);

    const ticketsByStatus = Object.fromEntries(
      ticketsByStatusRaw.map((r) => [r.status, r._count.id]),
    );

    const ticketsByPriority = Object.fromEntries(
      ticketsByPriorityRaw.map((r) => [r.priority, r._count.id]),
    );

    const tasksByStatus = Object.fromEntries(
      tasksByStatusRaw.map((r) => [r.status, r._count.id]),
    );

    const metrics = {
      ticketsByStatus,
      ticketsByPriority,
      tasksByStatus,
      totalOpenTickets: (ticketsByStatus['ABIERTO'] ?? 0) + (ticketsByStatus['EN_PROGRESO'] ?? 0),
      totalPendingTasks: tasksByStatus['PENDIENTE'] ?? 0,
    };

    return ApiResponse.success(res, metrics);
  }),
);
