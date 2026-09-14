import type {
  PaginatedResponse,
  TicketDTO,
  TicketCommentDTO,
  AssignTicketInput,
  CreateTicketInput,
  CreateCommentInput,
  TicketFiltersInput,
  UpdateTicketInput,
  UpdateTicketStatusInput,
} from '@sistema-ti/shared';

import { axiosClient } from './axiosClient';

type TicketsResponse = { success: true; data: TicketDTO[]; meta: PaginatedResponse<TicketDTO>['meta'] };
type TicketResponse = { success: true; data: TicketDTO };
type CommentsResponse = { success: true; data: TicketCommentDTO[] };
type CommentResponse = { success: true; data: TicketCommentDTO };

export const ticketsApi = {
  list: (params?: Partial<TicketFiltersInput>) =>
    axiosClient.get<TicketsResponse>('/tickets', { params }),

  getById: (id: string) =>
    axiosClient.get<TicketResponse>(`/tickets/${id}`),

  create: (data: CreateTicketInput) =>
    axiosClient.post<TicketResponse>('/tickets', data),

  update: (id: string, data: UpdateTicketInput) =>
    axiosClient.patch<TicketResponse>(`/tickets/${id}`, data),

  updateStatus: (id: string, data: UpdateTicketStatusInput) =>
    axiosClient.patch<TicketResponse>(`/tickets/${id}/status`, data),

  assign: (id: string, data: AssignTicketInput) =>
    axiosClient.patch<TicketResponse>(`/tickets/${id}/assign`, data),

  listComments: (ticketId: string) =>
    axiosClient.get<CommentsResponse>(`/tickets/${ticketId}/comments`),

  addComment: (ticketId: string, data: CreateCommentInput) =>
    axiosClient.post<CommentResponse>(`/tickets/${ticketId}/comments`, data),
};
