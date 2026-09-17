import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { AppRouter } from './router/AppRouter';
import { initAxiosInterceptors } from './api/axiosClient';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente interno que accede al store (debe estar dentro del árbol de React)
function AppWithInterceptors() {
  const { getAccessToken, setAccessToken, clearAuth, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Conecta el authStore con el cliente Axios para que el interceptor
    // de refresh pueda leer/escribir el accessToken en memoria.
    initAxiosInterceptors(getAccessToken, setAccessToken, clearAuth);
    // Restaura la sesión en recarga de página usando el refreshToken
    void initializeAuth();
  }, [getAccessToken, setAccessToken, clearAuth, initializeAuth]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppWithInterceptors />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

