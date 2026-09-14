"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.PAGINATION = exports.TASK_STATUS_TRANSITIONS = exports.TICKET_STATUS_TRANSITIONS = void 0;
const types_1 = require("../types");
// ─── Transiciones de estado válidas para Tickets ──────────────────────────────
// Define desde qué estado se puede llegar a cada estado
exports.TICKET_STATUS_TRANSITIONS = {
    [types_1.TicketStatus.ABIERTO]: [types_1.TicketStatus.EN_PROGRESO, types_1.TicketStatus.CERRADO],
    [types_1.TicketStatus.EN_PROGRESO]: [types_1.TicketStatus.EN_ESPERA, types_1.TicketStatus.RESUELTO, types_1.TicketStatus.ABIERTO],
    [types_1.TicketStatus.EN_ESPERA]: [types_1.TicketStatus.EN_PROGRESO, types_1.TicketStatus.CERRADO],
    [types_1.TicketStatus.RESUELTO]: [types_1.TicketStatus.CERRADO, types_1.TicketStatus.EN_PROGRESO],
    [types_1.TicketStatus.CERRADO]: [], // estado terminal — no se puede reabrir directamente
};
// ─── Transiciones de estado válidas para Tareas ───────────────────────────────
exports.TASK_STATUS_TRANSITIONS = {
    [types_1.TaskStatus.PENDIENTE]: [types_1.TaskStatus.EN_PROGRESO, types_1.TaskStatus.CANCELADA],
    [types_1.TaskStatus.EN_PROGRESO]: [types_1.TaskStatus.COMPLETADA, types_1.TaskStatus.PENDIENTE, types_1.TaskStatus.CANCELADA],
    [types_1.TaskStatus.COMPLETADA]: [types_1.TaskStatus.EN_PROGRESO], // permite reabrir si fue error
    [types_1.TaskStatus.CANCELADA]: [types_1.TaskStatus.PENDIENTE], // permite reactivar
};
// ─── Configuración de paginación ──────────────────────────────────────────────
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};
// ─── Códigos de error estándar de la API ──────────────────────────────────────
exports.ERROR_CODES = {
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
};
//# sourceMappingURL=index.js.map