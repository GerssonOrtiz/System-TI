import { Router } from 'express';

import { Role } from '@sistema-ti/shared';

import { authenticate, authorize } from '../../middlewares/auth.middleware';

import { usersController } from './users.controller';

export const usersRouter: Router = Router();

// Todos los endpoints de usuarios requieren autenticación
usersRouter.use(authenticate);

// GET /api/v1/users/me
usersRouter.get('/me', usersController.getMe);

// GET /api/v1/users/admins — para selector en asignación de tickets
usersRouter.get('/admins', authorize([Role.ADMIN_TI]), usersController.listAdmins);

// GET /api/v1/users — listado completo, solo ADMIN_TI
usersRouter.get('/', authorize([Role.ADMIN_TI]), usersController.listUsers);

// Gestión de usuarios (Solo ADMIN_TI)
usersRouter.post('/', authorize([Role.ADMIN_TI]), usersController.createUser);
usersRouter.put('/:id/password', authorize([Role.ADMIN_TI]), usersController.resetPassword);
usersRouter.put('/:id/status', authorize([Role.ADMIN_TI]), usersController.toggleStatus);
