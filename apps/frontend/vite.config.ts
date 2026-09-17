import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sistema-ti/shared': path.resolve(__dirname, '../../packages/shared/dist/index.mjs'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // El proxy intercepta rutas /api/* y las reenvía al backend.
      // El target es SOLO el origen (protocolo + host + puerto), sin path.
      // VITE_API_URL puede ser "http://localhost:3000/api/v1" → extraemos el origen.
      '/api': {
        target: (() => {
          const raw = process.env['VITE_API_URL'] ?? 'http://localhost:3000';
          try {
            return new URL(raw).origin;
          } catch {
            return 'http://localhost:3000';
          }
        })(),
        changeOrigin: true,
      },
    },
  },
});
