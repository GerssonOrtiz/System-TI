import {
  AuditAction,
  AuditEntity,
  PAGINATION,
  TASK_STATUS_TRANSITIONS,
  TaskStatus,
} from '@sistema-ti/shared';
import type {
  CreateTaskInput,
  TaskFiltersInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { auditService } from '../audit/audit.service';

import type { TaskFilters } from './tasks.repository';
import { tasksRepository } from './tasks.repository';

export const tasksService = {
  async listTasks(filters: TaskFiltersInput) {
    const page = filters.page ?? PAGINATION.DEFAULT_PAGE;
    const pageSize = Math.min(filters.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);

    const repoFilters: TaskFilters = {
      status: filters.status as TaskFilters['status'],
      priority: filters.priority as TaskFilters['priority'],
      search: filters.search,
    };

    const { tasks, total } = await tasksRepository.findAll(repoFilters, page, pageSize);

    return {
      data: tasks,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async getTaskById(id: string) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw ApiError.notFound('TASK_NOT_FOUND', 'Tarea no encontrada');
    }
    return task;
  },

  async createTask(input: CreateTaskInput, creatorId: string) {
    const task = await tasksRepository.create({
      title: input.title,
      description: input.description,
      priority: input.priority as Parameters<typeof tasksRepository.create>[0]['priority'],
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      linkedTicketId: input.linkedTicketId,
      creatorId,
    });

    await auditService.logAction({
      action: AuditAction.CREATE,
      entity: AuditEntity.TASK,
      entityId: task.id,
      userId: creatorId,
      metadata: { title: task.title, priority: task.priority },
    });

    return task;
  },

  async updateTask(id: string, input: UpdateTaskInput, userId: string) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw ApiError.notFound('TASK_NOT_FOUND', 'Tarea no encontrada');
    }

    const updated = await tasksRepository.update(id, {
      title: input.title,
      description: input.description,
      priority: input.priority as Parameters<typeof tasksRepository.update>[1]['priority'],
      dueDate: input.dueDate ? new Date(input.dueDate) : input.dueDate === null ? null : undefined,
      linkedTicketId: input.linkedTicketId,
    });

    await auditService.logAction({
      action: AuditAction.UPDATE,
      entity: AuditEntity.TASK,
      entityId: id,
      userId,
      metadata: { changes: input },
    });

    return updated;
  },

  async updateStatus(id: string, input: UpdateTaskStatusInput, userId: string) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw ApiError.notFound('TASK_NOT_FOUND', 'Tarea no encontrada');
    }

    const allowedTransitions = TASK_STATUS_TRANSITIONS[task.status as TaskStatus];
    if (!allowedTransitions.includes(input.status as TaskStatus)) {
      throw ApiError.unprocessable(
        'INVALID_STATUS_TRANSITION',
        `No se puede cambiar el estado de ${task.status} a ${input.status}`,
        { allowedTransitions },
      );
    }

    const updated = await tasksRepository.updateStatus(id, input.status as Parameters<typeof tasksRepository.updateStatus>[1]);

    await auditService.logAction({
      action: AuditAction.STATUS_CHANGE,
      entity: AuditEntity.TASK,
      entityId: id,
      userId,
      metadata: { from: task.status, to: input.status },
    });

    return updated;
  },

  async deleteTask(id: string, userId: string) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw ApiError.notFound('TASK_NOT_FOUND', 'Tarea no encontrada');
    }

    await tasksRepository.delete(id);

    await auditService.logAction({
      action: AuditAction.DELETE,
      entity: AuditEntity.TASK,
      entityId: id,
      userId,
      metadata: { title: task.title },
    });
  },
};
