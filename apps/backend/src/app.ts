import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';
import { router } from './routes';

export function createApp(): Express {
  const app = express();

  // ─── Seguridad básica ──────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ─────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    (env.FRONTEND_URL as string)?.replace(/\/$/, ''), // Normaliza eliminando la barra final si existe
    'https://frontend-zq3g.vercel.app',  // Dominio explícito en Vercel
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        // En desarrollo o cuando se consulte sin header Origin (Postman, cURL, etc.)
        if (!origin || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origen ${origin} no permitido por CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ─── Logger HTTP estructurado ─────────────────────────────────────────────
  app.use(
    pinoHttp({
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
      customLogLevel(_req, res) {
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  // ─── Parser JSON ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Rate limiting global ─────────────────────────────────────────────────
  app.use('/api', apiRateLimiter);

  // ─── Health check (sin autenticación) ────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    });
  });

  // ─── Rutas de la API ──────────────────────────────────────────────────────
  app.use('/api/v1', router);

  // ─── Documentación Swagger (disponible en todos los entornos) ────────────
  app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'API Sistema de Gestión de TI',
      swaggerOptions: { persistAuthorization: true },
    }),
  );

  // ─── Ruta no encontrada ───────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'La ruta solicitada no existe',
      },
    });
  });

  // ─── Manejador central de errores (SIEMPRE al final) ─────────────────────
  app.use(errorMiddleware);

  return app;
}