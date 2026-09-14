import { TicketStatus, TaskStatus } from '../types';
export declare const TICKET_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]>;
export declare const TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]>;
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const ERROR_CODES: {
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly TOKEN_INVALID: "TOKEN_INVALID";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly TICKET_NOT_FOUND: "TICKET_NOT_FOUND";
    readonly TASK_NOT_FOUND: "TASK_NOT_FOUND";
    readonly KB_ARTICLE_NOT_FOUND: "KB_ARTICLE_NOT_FOUND";
    readonly EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS";
    readonly SLUG_ALREADY_EXISTS: "SLUG_ALREADY_EXISTS";
    readonly INVALID_STATUS_TRANSITION: "INVALID_STATUS_TRANSITION";
    readonly TICKET_ALREADY_CLOSED: "TICKET_ALREADY_CLOSED";
    readonly INTERNAL_COMMENT_FORBIDDEN: "INTERNAL_COMMENT_FORBIDDEN";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
//# sourceMappingURL=index.d.ts.map