import type { Request, Response } from 'express';

import { TaskFiltersSchema } from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

import type {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from './tasks.schema';
import { tasksService } from './tasks.service';

export const tasksController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const filters = TaskFiltersSchema.parse(req.query);
    const result = await tasksService.listTasks(filters);
    return ApiResponse.paginated(res, result.data, result.meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const task = await tasksService.getTaskById(req.params['id'] ?? '');
    return ApiResponse.success(res, task);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as CreateTaskInput;
    const task = await tasksService.createTask(input, req.user.id);
    return ApiResponse.created(res, task, 'Tarea creada correctamente');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as UpdateTaskInput;
    const task = await tasksService.updateTask(req.params['id'] ?? '', input, req.user.id);
    return ApiResponse.success(res, task, 'Tarea actualizada correctamente');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const input = req.body as UpdateTaskStatusInput;
    const task = await tasksService.updateStatus(req.params['id'] ?? '', input, req.user.id);
    return ApiResponse.success(res, task, 'Estado de tarea actualizado correctamente');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await tasksService.deleteTask(req.params['id'] ?? '', req.user.id);
    return ApiResponse.noContent(res);
  }),
};
