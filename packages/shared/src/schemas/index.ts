import { z } from 'zod';
import { Role, TicketCategory, TicketPriority, TicketStatus, TaskPriority, TaskStatus } from '../types';

// ─── Schemas de Autenticación ─────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'El correo es requerido' })
    .email('Correo electrónico inválido')
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegisterSchema = z.object({
  fullName: z
    .string({ required_error: 'El nombre completo es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  email: z
    .string({ required_error: 'El correo es requerido' })
    .email('Correo electrónico inválido')
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres'),
  role: z.nativeEnum(Role).optional().default(Role.SOLICITANTE),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: 'El refresh token es requerido' }),
});

// ─── Schemas de Tickets ───────────────────────────────────────────────────────
export const CreateTicketSchema = z.object({
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .trim(),
  priority: z.nativeEnum(TicketPriority).optional().default(TicketPriority.MEDIA),
  category: z.nativeEnum(TicketCategory).optional().default(TicketCategory.OTRO),
});

export const UpdateTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim()
    .optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').trim().optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.nativeEnum(TicketCategory).optional(),
});

export const UpdateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus, { required_error: 'El estado es requerido' }),
});

export const AssignTicketSchema = z.object({
  assigneeId: z.string().uuid('ID de asignado inválido').nullable(),
});

export const TicketFiltersSchema = z.object({
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.nativeEnum(TicketCategory).optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});

// ─── Schemas de Comentarios ───────────────────────────────────────────────────
export const CreateCommentSchema = z.object({
  content: z
    .string({ required_error: 'El contenido del comentario es requerido' })
    .min(1, 'El comentario no puede estar vacío')
    .max(5000, 'El comentario no puede exceder 5000 caracteres')
    .trim(),
  isInternal: z.boolean().optional().default(false),
});

// ─── Schemas de Tareas ────────────────────────────────────────────────────────
export const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  description: z.string().max(5000).trim().optional(),
  priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIA),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  linkedTicketId: z.string().uuid().optional().nullable(),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim()
    .optional(),
  description: z.string().max(5000).trim().optional().nullable(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  linkedTicketId: z.string().uuid().optional().nullable(),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus, { required_error: 'El estado es requerido' }),
});

export const TaskFiltersSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});

// ─── Schemas de Base de Conocimiento ─────────────────────────────────────────
export const CreateKbArticleSchema = z.object({
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  content: z
    .string({ required_error: 'El contenido es requerido' })
    .min(10, 'El contenido debe tener al menos 10 caracteres'),
  category: z
    .string({ required_error: 'La categoría es requerida' })
    .min(2)
    .max(50)
    .trim(),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

export const UpdateKbArticleSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim()
    .optional(),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres').optional(),
  category: z.string().min(2).max(50).trim().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const KbFiltersSchema = z.object({
  category: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});

// ─── Tipos inferidos de los schemas ───────────────────────────────────────────
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>;
export type AssignTicketInput = z.infer<typeof AssignTicketSchema>;
export type TicketFiltersInput = z.infer<typeof TicketFiltersSchema>;

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;
export type TaskFiltersInput = z.infer<typeof TaskFiltersSchema>;

export type CreateKbArticleInput = z.infer<typeof CreateKbArticleSchema>;
export type UpdateKbArticleInput = z.infer<typeof UpdateKbArticleSchema>;
export type KbFiltersInput = z.infer<typeof KbFiltersSchema>;
