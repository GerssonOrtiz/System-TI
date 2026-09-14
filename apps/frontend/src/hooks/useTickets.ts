import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import type {
  AssignTicketInput,
  CreateCommentInput,
  CreateTicketInput,
  TicketFiltersInput,
  UpdateTicketInput,
  UpdateTicketStatusInput,
} from '@sistema-ti/shared';

import { ticketsApi } from '@/api/tickets.api';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: Partial<TicketFiltersInput>) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  comments: (id: string) => [...ticketKeys.detail(id), 'comments'] as const,
};

export function useTickets(filters?: Partial<TicketFiltersInput>) {
  return useQuery({
    queryKey: ticketKeys.list(filters ?? {}),
    queryFn: () => ticketsApi.list(filters).then((r) => r.data),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.comments(ticketId),
    queryFn: () => ticketsApi.listComments(ticketId).then((r) => r.data),
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketInput) => ticketsApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket creado correctamente');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al crear el ticket');
    },
  });
}

export function useUpdateTicket(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTicketInput) => ticketsApi.update(id, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket actualizado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al actualizar el ticket');
    },
  });
}

export function useUpdateTicketStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTicketStatusInput) =>
      ticketsApi.updateStatus(id, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Estado actualizado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Transición de estado no permitida');
    },
  });
}

export function useAssignTicket(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignTicketInput) =>
      ticketsApi.assign(id, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket asignado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al asignar el ticket');
    },
  });
}

export function useAddComment(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentInput) =>
      ticketsApi.addComment(ticketId, data).then((r) => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ticketKeys.comments(ticketId) });
      toast.success('Comentario agregado');
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } })?.error?.message
        : undefined;
      toast.error(message ?? 'Error al agregar comentario');
    },
  });
}
