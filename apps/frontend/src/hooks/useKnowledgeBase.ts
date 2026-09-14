import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import type {
  CreateKbArticleInput,
  KbFiltersInput,
  UpdateKbArticleInput,
} from '@sistema-ti/shared';

import { kbApi } from '@/api/kb.api';

export const kbKeys = {
  all: ['kb'] as const,
  lists: () => [...kbKeys.all, 'list'] as const,
  list: (filters: Partial<KbFiltersInput>) => [...kbKeys.lists(), filters] as const,
  detail: (slug: string) => [...kbKeys.all, 'detail', slug] as const,
};

export function useKbArticles(filters?: Partial<KbFiltersInput>) {
  return useQuery({
    queryKey: kbKeys.list(filters ?? {}),
    queryFn: () => kbApi.list(filters).then((r) => r.data),
  });
}

export function useKbArticle(slug: string) {
  return useQuery({
    queryKey: kbKeys.detail(slug),
    queryFn: () => kbApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useCreateKbArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKbArticleInput) => kbApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: kbKeys.lists() });
      toast.success('Artículo creado correctamente');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al crear el artículo');
    },
  });
}

export function useUpdateKbArticle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateKbArticleInput) => kbApi.update(id, data).then((r) => r.data.data),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: kbKeys.lists() });
      void qc.invalidateQueries({ queryKey: kbKeys.detail(data.slug) });
      toast.success('Artículo actualizado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al actualizar el artículo');
    },
  });
}

export function useTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? kbApi.publish(id).then((r) => r.data.data) : kbApi.unpublish(id).then((r) => r.data.data),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: kbKeys.lists() });
      void qc.invalidateQueries({ queryKey: kbKeys.detail(data.slug) });
      toast.success(data.isPublished ? 'Artículo publicado' : 'Artículo despublicado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al cambiar estado de publicación');
    },
  });
}
