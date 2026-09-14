import { Router } from 'express';

import { Role } from '@sistema-ti/shared';

import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { tasksController } from './tasks.controller';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  UpdateTaskStatusSchema,
} from './tasks.schema';

export const tasksRouter: Router = Router();

// Todos los endpoints de tareas requieren autenticación y rol ADMIN_TI
tasksRouter.use(authenticate, authorize([Role.ADMIN_TI]));

tasksRouter.get('/', tasksController.list);
tasksRouter.post('/', validate({ body: CreateTaskSchema }), tasksController.create);
tasksRouter.get('/:id', tasksController.getById);
tasksRouter.patch('/:id', validate({ body: UpdateTaskSchema }), tasksController.update);
tasksRouter.patch('/:id/status', validate({ body: UpdateTaskStatusSchema }), tasksController.updateStatus);
tasksRouter.delete('/:id', tasksController.delete);
