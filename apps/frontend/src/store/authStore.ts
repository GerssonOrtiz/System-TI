import { create } from 'zustand';

import type { PublicUser } from '@sistema-ti/shared';
import { authApi } from '@/api/auth.api';

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (user: PublicUser, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  initializeAuth: () => Promise<void>;
}

// Carga inicial síncrona si existe usuario persistido en localStorage
const storedUserJson = localStorage.getItem('user');
const initialUser: PublicUser | null = storedUserJson ? JSON.parse(storedUserJson) : null;
const storedRefreshToken = localStorage.getItem('refreshToken');

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  accessToken: null,
  isAuthenticated: !!(initialUser && storedRefreshToken),
  isInitializing: !!storedRefreshToken,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true, isInitializing: false });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  clearAuth: () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
  },

  getAccessToken: () => get().accessToken,

  initializeAuth: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      set({ isInitializing: false, isAuthenticated: false, user: null, accessToken: null });
      return;
    }

    try {
      const response = await authApi.refresh(refreshToken);
      const newAccessToken = response.data.data.accessToken;
      set({ accessToken: newAccessToken, isAuthenticated: true, isInitializing: false });
    } catch {
      // Si el refreshToken expiró o es inválido, limpiamos la sesión
      get().clearAuth();
    }
  },
}));
