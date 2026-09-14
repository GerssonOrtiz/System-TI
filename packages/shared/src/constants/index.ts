import { TicketStatus, TaskStatus } from '../types';

// ─── Transiciones de estado válidas para Tickets ──────────────────────────────
// Define desde qué estado se puede llegar a cada estado
export const TICKET_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.ABIERTO]: [TicketStatus.EN_PROGRESO, TicketStatus.CERRADO],
  [TicketStatus.EN_PROGRESO]: [TicketStatus.EN_ESPERA, TicketStatus.RESUELTO, TicketStatus.ABIERTO],
  [TicketStatus.EN_ESPERA]: [TicketStatus.EN_PROGRESO, TicketStatus.CERRADO],
  [TicketStatus.RESUELTO]: [TicketStatus.CERRADO, TicketStatus.EN_PROGRESO],
  [TicketStatus.CERRADO]: [], // estado terminal — no se puede reabrir directamente
};

// ─── Transiciones de estado válidas para Tareas ───────────────────────────────
export const TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.PENDIENTE]: [TaskStatus.EN_PROGRESO, TaskStatus.CANCELADA],
  [TaskStatus.EN_PROGRESO]: [TaskStatus.COMPLETADA, TaskStatus.PENDIENTE, TaskStatus.CANCELADA],
  [TaskStatus.COMPLETADA]: [TaskStatus.EN_PROGRESO], // permite reabrir si fue error
  [TaskStatus.CANCELADA]: [TaskStatus.PENDIENTE], // permite reactivar
};

// ─── Configuración de paginación ──────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ─── Códigos de error estándar de la API ──────────────────────────────────────
export const ERROR_CODES = {
  // Autenticación y autorización
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',

  // Recursos no encontrados
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  TICKET_NOT_FOUND: 'TICKET_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  KB_ARTICLE_NOT_FOUND: 'KB_ARTICLE_NOT_FOUND',

  // Conflictos
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',

  // Errores de negocio
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  TICKET_ALREADY_CLOSED: 'TICKET_ALREADY_CLOSED',
  INTERNAL_COMMENT_FORBIDDEN: 'INTERNAL_COMMENT_FORBIDDEN',

  // Errores de validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Errores del servidor
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
