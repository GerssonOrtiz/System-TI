import { Router } from 'express';

import { Role } from '@sistema-ti/shared';

import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { kbController } from './kb.controller';
import { CreateKbArticleSchema, UpdateKbArticleSchema } from './kb.schema';

export const kbRouter: Router = Router();

// Todos los endpoints de KB requieren autenticación
kbRouter.use(authenticate);

// GET /api/v1/kb — lista artículos (Admin ve todos; Solicitante solo publicados)
kbRouter.get('/', kbController.list);

// GET /api/v1/kb/:slug — detalle de artículo
kbRouter.get('/:slug', kbController.getBySlug);

// POST /api/v1/kb — crear artículo (solo ADMIN_TI)
kbRouter.post('/', authorize([Role.ADMIN_TI]), validate({ body: CreateKbArticleSchema }), kbController.create);

// PATCH /api/v1/kb/:id — actualizar artículo (solo ADMIN_TI)
kbRouter.patch('/:id', authorize([Role.ADMIN_TI]), validate({ body: UpdateKbArticleSchema }), kbController.update);

// PATCH /api/v1/kb/:id/publish — publicar (solo ADMIN_TI)
kbRouter.patch('/:id/publish', authorize([Role.ADMIN_TI]), kbController.publish);

// PATCH /api/v1/kb/:id/unpublish — despublicar (solo ADMIN_TI)
kbRouter.patch('/:id/unpublish', authorize([Role.ADMIN_TI]), kbController.unpublish);
