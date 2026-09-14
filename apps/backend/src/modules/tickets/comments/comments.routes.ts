import { Router } from 'express';

import { validate } from '../../../middlewares/validate.middleware';

import { commentsController } from './comments.controller';
import { CreateCommentSchema } from './comments.schema';

// Router con mergeParams para acceder a :id del router padre (tickets)
export const commentsRouter: Router = Router({ mergeParams: true });

commentsRouter.get('/', commentsController.list);
commentsRouter.post('/', validate({ body: CreateCommentSchema }), commentsController.create);
