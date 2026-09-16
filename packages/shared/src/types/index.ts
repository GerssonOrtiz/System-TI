// Tipos TypeScript compartidos: enums, DTOs y utilidades de respuesta

// ─── Enums de Roles ────────────────────────────────────────────────────────────
export enum Role {
  SOLICITANTE = 'SOLICITANTE',
  ADMIN_TI = 'ADMIN_TI',
}

// ─── Enums de Tickets ──────────────────────────────────────────────────────────
export enum TicketStatus {
  ABIERTO = 'ABIERTO',
  EN_PROGRESO = 'EN_PROGRESO',
  EN_ESPERA = 'EN_ESPERA',
  RESUELTO = 'RESUELTO',
  CERRADO = 'CERRADO',
}

export enum TicketPriority {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

export enum TicketCategory {
  HARDWARE = 'HARDWARE',
  SOFTWARE = 'SOFTWARE',
  RED = 'RED',
  ACCESOS = 'ACCESOS',
  OTRO = 'OTRO',
}

// ─── Enums de Tareas ───────────────────────────────────────────────────────────
export enum TaskStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export enum TaskPriority {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

// ─── Enums de Auditoría ────────────────────────────────────────────────────────
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  LOGIN = 'LOGIN',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

export enum AuditEntity {
  TICKET = 'TICKET',
  TASK = 'TASK',
  KB_ARTICLE = 'KB_ARTICLE',
  USER = 'USER',
}

// ─── DTOs de Usuario ───────────────────────────────────────────────────────────
export interface PublicUser {
  id: string;
  fullName: string;
  username: string;
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

// ─── DTOs de Tickets ───────────────────────────────────────────────────────────
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

// ─── DTOs de Tareas ────────────────────────────────────────────────────────────
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

// ─── DTOs de Base de Conocimiento ─────────────────────────────────────────────
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

// ─── Envelope de respuesta estándar ───────────────────────────────────────────
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

// ─── Meta de paginación ───────────────────────────────────────────────────────
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

// ─── Métricas de Dashboard ────────────────────────────────────────────────────
export interface DashboardMetrics {
  ticketsByStatus: Record<TicketStatus, number>;
  ticketsByPriority: Record<TicketPriority, number>;
  tasksByStatus: Record<TaskStatus, number>;
  totalOpenTickets: number;
  totalPendingTasks: number;
}
