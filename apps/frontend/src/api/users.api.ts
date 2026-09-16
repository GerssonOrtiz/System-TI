import type { DashboardMetrics, PaginatedResponse, PublicUser } from '@sistema-ti/shared';

import { axiosClient } from './axiosClient';

type UsersResponse = { success: true; data: PublicUser[]; meta: PaginatedResponse<PublicUser>['meta'] };
type AdminsResponse = { success: true; data: Pick<PublicUser, 'id' | 'fullName' | 'username'>[] };

export const usersApi = {
  list: (params?: { page?: number; pageSize?: number; role?: string }) =>
    axiosClient.get<UsersResponse>('/users', { params }),

  listAdmins: () =>
    axiosClient.get<AdminsResponse>('/users/admins'),

  getMetrics: () =>
    axiosClient.get<{ success: true; data: DashboardMetrics }>('/dashboard/metrics'),

  create: (data: any) => axiosClient.post<{ success: true; data: PublicUser }>('/users', data),
  updatePassword: (id: string, data: any) => axiosClient.put<{ success: true }>(`/users/${id}/password`, data),
  toggleStatus: (id: string, isActive: boolean) => axiosClient.put<{ success: true }>(`/users/${id}/status`, { isActive }),

};
