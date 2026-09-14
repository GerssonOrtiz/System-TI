export declare enum Role {
    SOLICITANTE = "SOLICITANTE",
    ADMIN_TI = "ADMIN_TI"
}
export declare enum TicketStatus {
    ABIERTO = "ABIERTO",
    EN_PROGRESO = "EN_PROGRESO",
    EN_ESPERA = "EN_ESPERA",
    RESUELTO = "RESUELTO",
    CERRADO = "CERRADO"
}
export declare enum TicketPriority {
    BAJA = "BAJA",
    MEDIA = "MEDIA",
    ALTA = "ALTA",
    CRITICA = "CRITICA"
}
export declare enum TicketCategory {
    HARDWARE = "HARDWARE",
    SOFTWARE = "SOFTWARE",
    RED = "RED",
    ACCESOS = "ACCESOS",
    OTRO = "OTRO"
}
export declare enum TaskStatus {
    PENDIENTE = "PENDIENTE",
    EN_PROGRESO = "EN_PROGRESO",
    COMPLETADA = "COMPLETADA",
    CANCELADA = "CANCELADA"
}
export declare enum TaskPriority {
    BAJA = "BAJA",
    MEDIA = "MEDIA",
    ALTA = "ALTA"
}
export declare enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    STATUS_CHANGE = "STATUS_CHANGE",
    LOGIN = "LOGIN",
    LOGIN_FAILED = "LOGIN_FAILED"
}
export declare enum AuditEntity {
    TICKET = "TICKET",
    TASK = "TASK",
    KB_ARTICLE = "KB_ARTICLE",
    USER = "USER"
}
export interface PublicUser {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResponse {
    user: PublicUser;
    tokens: AuthTokens;
}
export interface TicketDTO {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    creatorId: string;
    creator?: Pick<PublicUser, 'id' | 'fullName' | 'email'>;
    assigneeId: string | null;
    assignee?: Pick<PublicUser, 'id' | 'fullName' | 'email'> | null;
    resolvedAt: string | null;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface TicketCommentDTO {
    id: string;
    ticketId: string;
    authorId: string;
    author?: Pick<PublicUser, 'id' | 'fullName' | 'email'>;
    content: string;
    isInternal: boolean;
    createdAt: string;
}
export interface TaskDTO {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    creatorId: string;
    creator?: Pick<PublicUser, 'id' | 'fullName' | 'email'>;
    linkedTicketId: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface KnowledgeArticleDTO {
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    isPublished: boolean;
    authorId: string;
    author?: Pick<PublicUser, 'id' | 'fullName'>;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}
export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface DashboardMetrics {
    ticketsByStatus: Record<TicketStatus, number>;
    ticketsByPriority: Record<TicketPriority, number>;
    tasksByStatus: Record<TaskStatus, number>;
    totalOpenTickets: number;
    totalPendingTasks: number;
}
//# sourceMappingURL=index.d.ts.map