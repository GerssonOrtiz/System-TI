import type {
  PaginatedResponse,
  TaskDTO,
  CreateTaskInput,
  TaskFiltersInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from '@sistema-ti/shared';

import { axiosClient } from './axiosClient';

type TasksResponse = { success: true; data: TaskDTO[]; meta: PaginatedResponse<TaskDTO>['meta'] };
type TaskResponse = { success: true; data: TaskDTO };

export const tasksApi = {
  list: (params?: Partial<TaskFiltersInput>) =>
    axiosClient.get<TasksResponse>('/tasks', { params }),

  getById: (id: string) =>
    axiosClient.get<TaskResponse>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    axiosClient.post<TaskResponse>('/tasks', data),

  update: (id: string, data: UpdateTaskInput) =>
    axiosClient.patch<TaskResponse>(`/tasks/${id}`, data),

  updateStatus: (id: string, data: UpdateTaskStatusInput) =>
    axiosClient.patch<TaskResponse>(`/tasks/${id}/status`, data),

  delete: (id: string) =>
    axiosClient.delete(`/tasks/${id}`),
};
