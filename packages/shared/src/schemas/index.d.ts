import { z } from 'zod';
import { Role, TicketCategory, TicketPriority, TicketStatus, TaskPriority, TaskStatus } from '../types';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof Role>>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    fullName: string;
    role: Role;
    password: string;
}, {
    email: string;
    fullName: string;
    password: string;
    role?: Role | undefined;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const CreateTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof TicketPriority>>>;
    category: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof TicketCategory>>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
}, {
    title: string;
    description: string;
    priority?: TicketPriority | undefined;
    category?: TicketCategory | undefined;
}>;
export declare const UpdateTicketSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof TicketPriority>>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof TicketCategory>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: TicketPriority | undefined;
    category?: TicketCategory | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    priority?: TicketPriority | undefined;
    category?: TicketCategory | undefined;
}>;
export declare const UpdateTicketStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof TicketStatus>;
}, "strip", z.ZodTypeAny, {
    status: TicketStatus;
}, {
    status: TicketStatus;
}>;
export declare const AssignTicketSchema: z.ZodObject<{
    assigneeId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assigneeId: string | null;
}, {
    assigneeId: string | null;
}>;
export declare const TicketFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof TicketStatus>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof TicketPriority>>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof TicketCategory>>;
    assigneeId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    status?: TicketStatus | undefined;
    priority?: TicketPriority | undefined;
    category?: TicketCategory | undefined;
    assigneeId?: string | undefined;
    search?: string | undefined;
}, {
    status?: TicketStatus | undefined;
    priority?: TicketPriority | undefined;
    category?: TicketCategory | undefined;
    assigneeId?: string | undefined;
    search?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const CreateCommentSchema: z.ZodObject<{
    content: z.ZodString;
    isInternal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    isInternal: boolean;
}, {
    content: string;
    isInternal?: boolean | undefined;
}>;
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof TaskPriority>>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    linkedTicketId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    priority: TaskPriority;
    description?: string | undefined;
    dueDate?: string | null | undefined;
    linkedTicketId?: string | null | undefined;
}, {
    title: string;
    description?: string | undefined;
    priority?: TaskPriority | undefined;
    dueDate?: string | null | undefined;
    linkedTicketId?: string | null | undefined;
}>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof TaskPriority>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    linkedTicketId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | null | undefined;
    priority?: TaskPriority | undefined;
    dueDate?: string | null | undefined;
    linkedTicketId?: string | null | undefined;
}, {
    title?: string | undefined;
    description?: string | null | undefined;
    priority?: TaskPriority | undefined;
    dueDate?: string | null | undefined;
    linkedTicketId?: string | null | undefined;
}>;
export declare const UpdateTaskStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof TaskStatus>;
}, "strip", z.ZodTypeAny, {
    status: TaskStatus;
}, {
    status: TaskStatus;
}>;
export declare const TaskFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof TaskStatus>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof TaskPriority>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    status?: TaskStatus | undefined;
    priority?: TaskPriority | undefined;
    search?: string | undefined;
}, {
    status?: TaskStatus | undefined;
    priority?: TaskPriority | undefined;
    search?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const CreateKbArticleSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: string;
    content: string;
    tags: string[];
    isPublished: boolean;
}, {
    title: string;
    category: string;
    content: string;
    tags?: string[] | undefined;
    isPublished?: boolean | undefined;
}>;
export declare const UpdateKbArticleSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    category?: string | undefined;
    content?: string | undefined;
    tags?: string[] | undefined;
}, {
    title?: string | undefined;
    category?: string | undefined;
    content?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const KbFiltersSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    category?: string | undefined;
    search?: string | undefined;
}, {
    category?: string | undefined;
    search?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
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
//# sourceMappingURL=index.d.ts.map