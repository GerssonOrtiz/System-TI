import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// DECISION: token almacenado en memoria (authStore) + refreshToken en localStorage
// Justificación: accessToken en memoria (más seguro contra XSS), refreshToken en
// localStorage para persistir sesión entre recargas. Trade-off documentado.

// En desarrollo, usamos la URL relativa para que pase por el proxy de Vite y evitar CORS.
// En producción (donde no hay proxy), usamos VITE_API_URL directamente.
const BASE_URL =
  (import.meta as any).env?.['PROD'] === true
    ? ((import.meta as any).env?.['VITE_API_URL'] as string) ?? '/api/v1'
    : '/api/v1';


export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Interceptor de request: adjunta el accessToken del store
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Import dinámico para evitar dependencia circular
  const token = getAccessTokenFromStore();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeToRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshSuccess(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Interceptor de response: maneja 401 con refresh automático
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Sin refresh token: limpiar sesión y redirigir a login
        clearSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Esperar a que el refresh en curso termine
        return new Promise((resolve) => {
          subscribeToRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{ success: boolean; data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = data.data.accessToken;
        setAccessTokenInStore(newAccessToken);
        onRefreshSuccess(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);
      } catch {
        clearSession();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Funciones de acceso al store (evitan importación circular) ────────────────
// Se inicializan tardíamente para no romper el módulo al importarse antes del store
let _getToken: (() => string | null) | null = null;
let _setToken: ((token: string) => void) | null = null;
let _clearSession: (() => void) | null = null;

export function initAxiosInterceptors(
  getToken: () => string | null,
  setToken: (token: string) => void,
  onLogout: () => void,
) {
  _getToken = getToken;
  _setToken = setToken;
  _clearSession = onLogout;
}

function getAccessTokenFromStore(): string | null {
  return _getToken?.() ?? null;
}

function setAccessTokenInStore(token: string): void {
  _setToken?.(token);
}

function clearSession(): void {
  _clearSession?.();
  window.location.href = '/login';
}
