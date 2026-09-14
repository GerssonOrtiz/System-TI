"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KbFiltersSchema = exports.UpdateKbArticleSchema = exports.CreateKbArticleSchema = exports.TaskFiltersSchema = exports.UpdateTaskStatusSchema = exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.CreateCommentSchema = exports.TicketFiltersSchema = exports.AssignTicketSchema = exports.UpdateTicketStatusSchema = exports.UpdateTicketSchema = exports.CreateTicketSchema = exports.RefreshTokenSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// ─── Schemas de Autenticación ─────────────────────────────────────────────────
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'El correo es requerido' })
        .email('Correo electrónico inválido')
        .toLowerCase(),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
exports.RegisterSchema = zod_1.z.object({
    fullName: zod_1.z
        .string({ required_error: 'El nombre completo es requerido' })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),
    email: zod_1.z
        .string({ required_error: 'El correo es requerido' })
        .email('Correo electrónico inválido')
        .toLowerCase(),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(72, 'La contraseña no puede exceder 72 caracteres'),
    role: zod_1.z.nativeEnum(types_1.Role).optional().default(types_1.Role.SOLICITANTE),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({ required_error: 'El refresh token es requerido' }),
});
// ─── Schemas de Tickets ───────────────────────────────────────────────────────
exports.CreateTicketSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: 'El título es requerido' })
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim(),
    description: zod_1.z
        .string({ required_error: 'La descripción es requerida' })
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .trim(),
    priority: zod_1.z.nativeEnum(types_1.TicketPriority).optional().default(types_1.TicketPriority.MEDIA),
    category: zod_1.z.nativeEnum(types_1.TicketCategory).optional().default(types_1.TicketCategory.OTRO),
});
exports.UpdateTicketSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim()
        .optional(),
    description: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres').trim().optional(),
    priority: zod_1.z.nativeEnum(types_1.TicketPriority).optional(),
    category: zod_1.z.nativeEnum(types_1.TicketCategory).optional(),
});
exports.UpdateTicketStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(types_1.TicketStatus, { required_error: 'El estado es requerido' }),
});
exports.AssignTicketSchema = zod_1.z.object({
    assigneeId: zod_1.z.string().uuid('ID de asignado inválido').nullable(),
});
exports.TicketFiltersSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(types_1.TicketStatus).optional(),
    priority: zod_1.z.nativeEnum(types_1.TicketPriority).optional(),
    category: zod_1.z.nativeEnum(types_1.TicketCategory).optional(),
    assigneeId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().max(100).optional(),
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional().default(20),
});
// ─── Schemas de Comentarios ───────────────────────────────────────────────────
exports.CreateCommentSchema = zod_1.z.object({
    content: zod_1.z
        .string({ required_error: 'El contenido del comentario es requerido' })
        .min(1, 'El comentario no puede estar vacío')
        .max(5000, 'El comentario no puede exceder 5000 caracteres')
        .trim(),
    isInternal: zod_1.z.boolean().optional().default(false),
});
// ─── Schemas de Tareas ────────────────────────────────────────────────────────
exports.CreateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: 'El título es requerido' })
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim(),
    description: zod_1.z.string().max(5000).trim().optional(),
    priority: zod_1.z.nativeEnum(types_1.TaskPriority).optional().default(types_1.TaskPriority.MEDIA),
    dueDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    linkedTicketId: zod_1.z.string().uuid().optional().nullable(),
});
exports.UpdateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim()
        .optional(),
    description: zod_1.z.string().max(5000).trim().optional().nullable(),
    priority: zod_1.z.nativeEnum(types_1.TaskPriority).optional(),
    dueDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    linkedTicketId: zod_1.z.string().uuid().optional().nullable(),
});
exports.UpdateTaskStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(types_1.TaskStatus, { required_error: 'El estado es requerido' }),
});
exports.TaskFiltersSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(types_1.TaskStatus).optional(),
    priority: zod_1.z.nativeEnum(types_1.TaskPriority).optional(),
    search: zod_1.z.string().max(100).optional(),
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional().default(20),
});
// ─── Schemas de Base de Conocimiento ─────────────────────────────────────────
exports.CreateKbArticleSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: 'El título es requerido' })
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim(),
    content: zod_1.z
        .string({ required_error: 'El contenido es requerido' })
        .min(10, 'El contenido debe tener al menos 10 caracteres'),
    category: zod_1.z
        .string({ required_error: 'La categoría es requerida' })
        .min(2)
        .max(50)
        .trim(),
    tags: zod_1.z.array(zod_1.z.string().max(30)).max(10).optional().default([]),
    isPublished: zod_1.z.boolean().optional().default(false),
});
exports.UpdateKbArticleSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres')
        .trim()
        .optional(),
    content: zod_1.z.string().min(10, 'El contenido debe tener al menos 10 caracteres').optional(),
    category: zod_1.z.string().min(2).max(50).trim().optional(),
    tags: zod_1.z.array(zod_1.z.string().max(30)).max(10).optional(),
});
exports.KbFiltersSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    search: zod_1.z.string().max(100).optional(),
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional().default(20),
});
//# sourceMappingURL=index.js.map