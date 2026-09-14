import type { AuthResponse, PublicUser } from '@sistema-ti/shared';
import type { LoginInput, RegisterInput } from '@sistema-ti/shared';

import { axiosClient } from './axiosClient';

export const authApi = {
  login: (data: LoginInput) =>
    axiosClient.post<{ success: true; data: AuthResponse }>('/auth/login', data),

  register: (data: RegisterInput) =>
    axiosClient.post<{ success: true; data: AuthResponse }>('/auth/register', data),

  refresh: (refreshToken: string) =>
    axiosClient.post<{ success: true; data: { accessToken: string } }>('/auth/refresh', {
      refreshToken,
    }),

  me: () => axiosClient.get<{ success: true; data: PublicUser }>('/auth/me'),
};
