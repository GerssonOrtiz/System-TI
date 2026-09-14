"use strict";
// Tipos TypeScript compartidos: enums, DTOs y utilidades de respuesta
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditEntity = exports.AuditAction = exports.TaskPriority = exports.TaskStatus = exports.TicketCategory = exports.TicketPriority = exports.TicketStatus = exports.Role = void 0;
// ─── Enums de Roles ────────────────────────────────────────────────────────────
var Role;
(function (Role) {
    Role["SOLICITANTE"] = "SOLICITANTE";
    Role["ADMIN_TI"] = "ADMIN_TI";
})(Role || (exports.Role = Role = {}));
// ─── Enums de Tickets ──────────────────────────────────────────────────────────
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["ABIERTO"] = "ABIERTO";
    TicketStatus["EN_PROGRESO"] = "EN_PROGRESO";
    TicketStatus["EN_ESPERA"] = "EN_ESPERA";
    TicketStatus["RESUELTO"] = "RESUELTO";
    TicketStatus["CERRADO"] = "CERRADO";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["BAJA"] = "BAJA";
    TicketPriority["MEDIA"] = "MEDIA";
    TicketPriority["ALTA"] = "ALTA";
    TicketPriority["CRITICA"] = "CRITICA";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["HARDWARE"] = "HARDWARE";
    TicketCategory["SOFTWARE"] = "SOFTWARE";
    TicketCategory["RED"] = "RED";
    TicketCategory["ACCESOS"] = "ACCESOS";
    TicketCategory["OTRO"] = "OTRO";
})(TicketCategory || (exports.TicketCategory = TicketCategory = {}));
// ─── Enums de Tareas ───────────────────────────────────────────────────────────
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDIENTE"] = "PENDIENTE";
    TaskStatus["EN_PROGRESO"] = "EN_PROGRESO";
    TaskStatus["COMPLETADA"] = "COMPLETADA";
    TaskStatus["CANCELADA"] = "CANCELADA";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["BAJA"] = "BAJA";
    TaskPriority["MEDIA"] = "MEDIA";
    TaskPriority["ALTA"] = "ALTA";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
// ─── Enums de Auditoría ────────────────────────────────────────────────────────
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["STATUS_CHANGE"] = "STATUS_CHANGE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGIN_FAILED"] = "LOGIN_FAILED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var AuditEntity;
(function (AuditEntity) {
    AuditEntity["TICKET"] = "TICKET";
    AuditEntity["TASK"] = "TASK";
    AuditEntity["KB_ARTICLE"] = "KB_ARTICLE";
    AuditEntity["USER"] = "USER";
})(AuditEntity || (exports.AuditEntity = AuditEntity = {}));
//# sourceMappingURL=index.js.map