import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import type {
  CreateTaskInput,
  TaskFiltersInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from '@sistema-ti/shared';

import { tasksApi } from '@/api/tasks.api';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: Partial<TaskFiltersInput>) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export function useTasks(filters?: Partial<TaskFiltersInput>) {
  return useQuery({
    queryKey: taskKeys.list(filters ?? {}),
    queryFn: () => tasksApi.list(filters).then((r) => r.data),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Tarea creada correctamente');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al crear la tarea');
    },
  });
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskInput) => tasksApi.update(id, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Tarea actualizada');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al actualizar la tarea');
    },
  });
}

export function useUpdateTaskStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskStatusInput) =>
      tasksApi.updateStatus(id, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      void qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      toast.success('Estado de tarea actualizado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Transición de estado no permitida');
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Tarea eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar la tarea');
    },
  });
}
