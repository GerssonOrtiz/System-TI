# Arquitectura de Sistema de Gestión de TI (Mesa de Ayuda / Tareas / Base de Conocimiento)
### Guía técnica para implementación asistida por KIRA

---

## 1. Arquitectura y Stack Tecnológico

### 1.1 Stack definido

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | SPA rápida, tipado fuerte, ecosistema maduro |
| Gestión de estado servidor | TanStack Query (React Query) | Cache, invalidación y sincronización con la API REST |
| Gestión de estado UI local | Zustand | Ligero, sin boilerplate, evita prop-drilling |
| Estilos/UI | Tailwind CSS + shadcn/ui | Componentes accesibles, consistentes, personalizables |
| Formularios | React Hook Form + Zod | Validación tipada compartible con el backend |
| Backend | Node.js 20 LTS + Express (o Fastify) + TypeScript | Monolito modular, tipado end-to-end |
| ORM | Prisma | Migraciones declarativas, tipado automático, DX superior a TypeORM para este alcance |
| Base de datos | PostgreSQL 15+ | Relacional, transaccional, robusta |
| Autenticación | JWT (access + refresh token) con `jsonwebtoken` + `bcrypt` | Stateless, apto para separar API de Frontend |
| Validación backend | Zod (schemas compartidos con frontend vía paquete `shared`) | Única fuente de verdad de validación |
| Documentación API | OpenAPI/Swagger (`swagger-jsdoc` + `swagger-ui-express`) | Contrato claro para el frontend y futuras integraciones |
| Logs | Pino | Logging estructurado JSON, bajo overhead |
| Testing | Vitest + Supertest (backend), Vitest + Testing Library (frontend) | Cobertura unitaria e integración |
| Contenedores | Docker + Docker Compose | Entorno reproducible (app + db) |

### 1.2 Enfoque arquitectónico: Monolito Modular

El backend se organiza en **módulos de dominio** (`auth`, `tickets`, `tasks`, `knowledge-base`, `users`, `audit`), cada uno con su propia capa de **controller → service → repository**, pero desplegado como **un único proceso/servicio**. Esto permite:

- Simplicidad operativa (un solo deploy, una sola base de código).
- Separación de responsabilidades interna que facilita una futura migración a microservicios si el crecimiento lo justifica.
- API REST completamente desacoplada del frontend: el frontend consume únicamente `/api/v1/*` vía HTTP/JSON, sin acceso directo a la base de datos ni lógica compartida en tiempo de ejecución.

### 1.3 Diagrama textual de flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (SPA)                          │
│  React + TS · Vite · TanStack Query · Zustand · Tailwind        │
│                                                                   │
│  Componentes UI → Hooks (useTickets, useTasks, useKB)           │
│         │                                                        │
│         ▼                                                        │
│  Capa de servicios HTTP (axios/fetch wrapper con interceptores  │
│  de JWT, manejo de errores y refresh token)                     │
└───────────────────────────┬───────────────────────────────────-┘
                             │ HTTPS / JSON (REST)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (API REST)                       │
│                                                                   │
│  [Middleware] CORS → Helmet → Rate Limit → Auth (JWT) → Logger  │
│         │                                                        │
│         ▼                                                        │
│  [Router] /api/v1/tickets  /api/v1/tasks  /api/v1/kb  /api/v1/auth │
│         │                                                        │
│         ▼                                                        │
│  [Controller] Valida input (Zod) → invoca Service → formatea    │
│  respuesta HTTP (status codes, envelope estándar)                │
│         │                                                        │
│         ▼                                                        │
│  [Service] Lógica de negocio, reglas de dominio, orquestación,  │
│  transacciones, generación de AuditLog                          │
│         │                                                        │
│         ▼                                                        │
│  [Repository] Prisma Client (queries tipadas)                   │
└───────────────────────────┬────────────────────────────────────┘
                             │ SQL (vía Prisma)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL 15+ (Base de Datos)                │
│  Tablas: users, tickets, ticket_comments, tasks, kb_articles,   │
│  audit_logs                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Regla de oro:** el Frontend **nunca** conoce la estructura de la base de datos; solo interactúa con contratos definidos en OpenAPI/Zod schemas compartidos.

---

## 2. Modelo de Datos (PostgreSQL / Prisma)

### 2.1 Esquema Prisma completo

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SOLICITANTE
  ADMIN_TI
}

enum TicketStatus {
  ABIERTO
  EN_PROGRESO
  EN_ESPERA
  RESUELTO
  CERRADO
}

enum TicketPriority {
  BAJA
  MEDIA
  ALTA
  CRITICA
}

enum TicketCategory {
  HARDWARE
  SOFTWARE
  RED
  ACCESOS
  OTRO
}

enum TaskStatus {
  PENDIENTE
  EN_PROGRESO
  COMPLETADA
  CANCELADA
}

enum TaskPriority {
  BAJA
  MEDIA
  ALTA
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  STATUS_CHANGE
  LOGIN
  LOGIN_FAILED
}

enum AuditEntity {
  TICKET
  TASK
  KB_ARTICLE
  USER
}

model User {
  id           String   @id @default(uuid())
  fullName     String   @map("full_name")
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(SOLICITANTE)
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  ticketsCreated   Ticket[]         @relation("TicketCreator")
  ticketsAssigned  Ticket[]         @relation("TicketAssignee")
  ticketComments   TicketComment[]
  tasksCreated     Task[]           @relation("TaskCreator")
  kbArticles       KnowledgeArticle[]
  auditLogs        AuditLog[]

  @@map("users")
}

model Ticket {
  id          String         @id @default(uuid())
  title       String
  description String         @db.Text
  status      TicketStatus   @default(ABIERTO)
  priority    TicketPriority @default(MEDIA)
  category    TicketCategory @default(OTRO)

  creatorId   String   @map("creator_id")
  creator     User     @relation("TicketCreator", fields: [creatorId], references: [id])

  assigneeId  String?  @map("assignee_id")
  assignee    User?    @relation("TicketAssignee", fields: [assigneeId], references: [id])

  resolvedAt  DateTime? @map("resolved_at")
  closedAt    DateTime? @map("closed_at")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  comments    TicketComment[]

  @@index([status])
  @@index([creatorId])
  @@index([assigneeId])
  @@map("tickets")
}

model TicketComment {
  id         String   @id @default(uuid())
  ticketId   String   @map("ticket_id")
  ticket     Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  authorId   String   @map("author_id")
  author     User     @relation(fields: [authorId], references: [id])

  content    String   @db.Text
  isInternal Boolean  @default(false) @map("is_internal") // nota interna solo visible para Admin TI

  createdAt  DateTime @default(now()) @map("created_at")

  @@index([ticketId])
  @@map("ticket_comments")
}

model Task {
  id          String       @id @default(uuid())
  title       String
  description String?      @db.Text
  status      TaskStatus   @default(PENDIENTE)
  priority    TaskPriority @default(MEDIA)
  dueDate     DateTime?    @map("due_date")

  creatorId   String   @map("creator_id")
  creator     User     @relation("TaskCreator", fields: [creatorId], references: [id])

  linkedTicketId String? @map("linked_ticket_id") // opcional: tarea originada desde un ticket

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@map("tasks")
}

model KnowledgeArticle {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String   @db.Text // Markdown
  category    String
  tags        String[] @default([])
  isPublished Boolean  @default(false) @map("is_published")

  authorId    String   @map("author_id")
  author      User     @relation(fields: [authorId], references: [id])

  viewCount   Int      @default(0) @map("view_count")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([isPublished])
  @@index([slug])
  @@map("knowledge_articles")
}

model AuditLog {
  id         String      @id @default(uuid())
  action     AuditAction
  entity     AuditEntity
  entityId   String?     @map("entity_id")

  userId     String?     @map("user_id")
  user       User?       @relation(fields: [userId], references: [id])

  metadata   Json?       // diff de cambios, IP, user-agent, etc.
  createdAt  DateTime    @default(now()) @map("created_at")

  @@index([entity, entityId])
  @@index([userId])
  @@map("audit_logs")
}
```

### 2.2 Reglas de negocio del modelo

1. Todo `Ticket` nace con `status = ABIERTO` y `creatorId` obligatorio (el Solicitante autenticado).
2. Solo `ADMIN_TI` puede modificar `assigneeId`, `status`, `priority` de un ticket.
3. `TicketComment.isInternal = true` nunca se serializa en las respuestas dirigidas a usuarios con rol `SOLICITANTE`.
4. Cada cambio de `status` en `Ticket` o `Task` genera automáticamente un registro en `AuditLog` (acción `STATUS_CHANGE`).
5. `KnowledgeArticle` solo es visible para `SOLICITANTE` cuando `isPublished = true`; el `ADMIN_TI` ve borradores y publicados.
6. Eliminación física (`DELETE`) está deshabilitada para `Ticket` y `KnowledgeArticle` publicados; se usa borrado lógico o cambio de estado (`CANCELADA`/despublicación) — excepción: `TicketComment` sí permite `onDelete: Cascade` al eliminar su ticket padre (no aplica en la práctica porque tickets no se eliminan).

---

## 3. Estructura de Directorios del Proyecto

### 3.1 Monorepo (recomendado)

```
sistema-gestion-ti/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── env.ts              # validación de variables de entorno (Zod)
│   │   │   │   └── database.ts         # instancia PrismaClient singleton
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts       # verifica JWT
│   │   │   │   ├── role.middleware.ts       # guard por rol (ADMIN_TI / SOLICITANTE)
│   │   │   │   ├── error.middleware.ts      # handler central de errores
│   │   │   │   ├── validate.middleware.ts   # valida body/query con Zod
│   │   │   │   └── rateLimit.middleware.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   └── auth.schema.ts       # Zod: LoginSchema, RegisterSchema
│   │   │   │   ├── users/
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── users.repository.ts
│   │   │   │   │   ├── users.routes.ts
│   │   │   │   │   └── users.schema.ts
│   │   │   │   ├── tickets/
│   │   │   │   │   ├── tickets.controller.ts
│   │   │   │   │   ├── tickets.service.ts
│   │   │   │   │   ├── tickets.repository.ts
│   │   │   │   │   ├── tickets.routes.ts
│   │   │   │   │   ├── tickets.schema.ts
│   │   │   │   │   └── comments/
│   │   │   │   │       ├── comments.controller.ts
│   │   │   │   │       ├── comments.service.ts
│   │   │   │   │       └── comments.routes.ts
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── tasks.controller.ts
│   │   │   │   │   ├── tasks.service.ts
│   │   │   │   │   ├── tasks.repository.ts
│   │   │   │   │   ├── tasks.routes.ts
│   │   │   │   │   └── tasks.schema.ts
│   │   │   │   ├── knowledge-base/
│   │   │   │   │   ├── kb.controller.ts
│   │   │   │   │   ├── kb.service.ts
│   │   │   │   │   ├── kb.repository.ts
│   │   │   │   │   ├── kb.routes.ts
│   │   │   │   │   └── kb.schema.ts
│   │   │   │   └── audit/
│   │   │   │       ├── audit.service.ts     # servicio reutilizable, invocado por otros módulos
│   │   │   │       └── audit.repository.ts
│   │   │   ├── shared/
│   │   │   │   ├── utils/
│   │   │   │   │   ├── ApiError.ts          # clase de error HTTP tipada
│   │   │   │   │   ├── ApiResponse.ts       # envelope estándar de respuesta
│   │   │   │   │   └── asyncHandler.ts      # wrapper try/catch para controllers
│   │   │   │   └── types/
│   │   │   │       └── express.d.ts         # extiende Request con req.user
│   │   │   ├── routes/
│   │   │   │   └── index.ts                 # agrega todos los routers bajo /api/v1
│   │   │   ├── app.ts                       # configuración de Express (middlewares globales)
│   │   │   └── server.ts                    # bootstrap (listen)
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   │   ├── axiosClient.ts           # instancia con interceptores JWT
│       │   │   ├── tickets.api.ts
│       │   │   ├── tasks.api.ts
│       │   │   ├── kb.api.ts
│       │   │   └── auth.api.ts
│       │   ├── components/
│       │   │   ├── ui/                      # componentes shadcn/ui (Button, Input, Dialog...)
│       │   │   ├── layout/
│       │   │   │   ├── AppShell.tsx
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   └── Header.tsx
│       │   │   ├── tickets/
│       │   │   │   ├── TicketCard.tsx
│       │   │   │   ├── TicketForm.tsx
│       │   │   │   ├── TicketList.tsx
│       │   │   │   ├── TicketDetail.tsx
│       │   │   │   └── TicketStatusBadge.tsx
│       │   │   ├── tasks/
│       │   │   │   ├── KanbanBoard.tsx
│       │   │   │   ├── TaskCard.tsx
│       │   │   │   └── TaskForm.tsx
│       │   │   └── knowledge-base/
│       │   │       ├── ArticleCard.tsx
│       │   │       ├── ArticleEditor.tsx    # editor Markdown
│       │   │       └── ArticleViewer.tsx
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useTickets.ts            # TanStack Query hooks
│       │   │   ├── useTasks.ts
│       │   │   └── useKnowledgeBase.ts
│       │   ├── pages/
│       │   │   ├── solicitante/
│       │   │   │   ├── MisTicketsPage.tsx
│       │   │   │   ├── NuevoTicketPage.tsx
│       │   │   │   ├── TicketDetallePage.tsx
│       │   │   │   └── BaseConocimientoPage.tsx
│       │   │   ├── admin/
│       │   │   │   ├── DashboardPage.tsx
│       │   │   │   ├── GestionTicketsPage.tsx
│       │   │   │   ├── TableroTareasPage.tsx
│       │   │   │   └── GestionArticulosPage.tsx
│       │   │   └── auth/
│       │   │       └── LoginPage.tsx
│       │   ├── router/
│       │   │   ├── AppRouter.tsx
│       │   │   ├── ProtectedRoute.tsx       # guard por autenticación
│       │   │   └── RoleRoute.tsx            # guard por rol
│       │   ├── store/
│       │   │   └── authStore.ts             # Zustand: usuario actual, token
│       │   ├── schemas/                     # Zod schemas compartidos con backend (vía paquete shared)
│       │   ├── lib/
│       │   │   └── utils.ts
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── vite.config.ts
│       └── Dockerfile
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── schemas/          # Zod schemas: TicketSchema, TaskSchema, KBArticleSchema
│       │   ├── types/            # tipos TS compartidos (enums, DTOs)
│       │   └── constants/        # roles, estados, códigos de error
│       └── package.json
│
├── docker-compose.yml
├── .env.example
├── package.json               # workspaces root
├── pnpm-workspace.yaml         # (o npm/yarn workspaces)
└── README.md
```

> **Nota:** el paquete `packages/shared` es la clave para evitar duplicación de validaciones: los `Zod schemas` de Ticket/Task/KB se definen una sola vez y se importan tanto en `apps/backend` (validación de entrada) como en `apps/frontend` (validación de formularios con React Hook Form).

---

## 4. Definición de Agentes, Skills y Reglas para KIRA

> Guarda este contenido como `agent.md` (o `.cursorrules` / archivo de contexto equivalente en KIRA) en la raíz del proyecto. KIRA debe leerlo antes de generar cualquier código.

### 4.1 KIRA Role & Agent Definition

```markdown
# ROL DEL AGENTE

Actúas como un Ingeniero de Software Senior especializado en TypeScript full-stack,
responsable de implementar el "Sistema de Gestión de TI" siguiendo EXACTAMENTE la
arquitectura de monolito modular descrita en este documento.

## PRINCIPIOS OBLIGATORIOS

1. NUNCA inventes entidades, campos o endpoints que no estén definidos en el
   esquema Prisma o en el plan de ejecución. Si falta información, pregunta antes
   de asumir.
2. RESPETA la separación de capas: Controller (HTTP) → Service (lógica de negocio)
   → Repository (acceso a datos vía Prisma). Un Controller JAMÁS debe llamar a
   Prisma directamente.
3. TODO endpoint debe:
   - Validar el input con un schema Zod ANTES de tocar lógica de negocio.
   - Verificar autenticación (JWT) y autorización por rol (SOLICITANTE / ADMIN_TI).
   - Responder usando el envelope estándar: `{ success: boolean, data?, error?, message? }`.
   - Usar códigos HTTP correctos (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).
4. TODO cambio de estado en Ticket o Task debe generar un AuditLog automáticamente
   a través del servicio `audit.service.ts`. No omitas esta llamada.
5. NO uses `any` en TypeScript. Tipa explícitamente inputs, outputs y errores.
6. NO expongas `passwordHash` ni comentarios internos (`isInternal: true`) en
   respuestas dirigidas a usuarios con rol SOLICITANTE.
7. Escribe código idiomático, comentado solo donde la lógica no sea obvia
   (evita comentarios redundantes tipo "// esto crea un ticket").
8. Cada módulo nuevo que crees debe incluir: controller, service, repository,
   routes, schema (Zod) y, si aplica, tests unitarios básicos del service.
9. Antes de generar código de un módulo, confirma que las migraciones de Prisma
   correspondientes ya existen o inclúyelas en el mismo paso.
10. Sigue el árbol de carpetas definido en la Sección 3 sin desviarte ni crear
    estructuras alternativas.
11. Cuando tengas dudas de negocio (ej. "¿puede un Solicitante cancelar su propio
    ticket?"), NO asumas: pregunta explícitamente o deja un TODO visible con
    comentario `// DECISION REQUERIDA:`.
12. Todo texto visible para el usuario final (mensajes de error, labels, UI) debe
    estar en español neutro.
```

### 4.2 Skill 1 — Database & Models

```markdown
# SKILL: DATABASE & MODELS

## Alcance
Generación de schema.prisma, migraciones, seeds y validaciones de datos.

## Reglas

1. El archivo `prisma/schema.prisma` es la ÚNICA fuente de verdad del modelo de
   datos. No dupliques definiciones de entidades en otros archivos.
2. Toda migración se genera con:
   `npx prisma migrate dev --name <nombre_descriptivo_snake_case>`
   Nunca edites archivos de migración ya aplicados manualmente; genera una nueva
   migración para corregir errores.
3. Todo campo sensible (`passwordHash`) NUNCA se selecciona por defecto en queries
   que retornen datos al cliente. Usa `select` explícito en Prisma para excluirlo,
   o un mapper `toPublicUser()` que lo elimine antes de responder.
4. Los enums de Prisma (`Role`, `TicketStatus`, `TicketPriority`, `TaskStatus`, etc.)
   deben reflejarse como enums de TypeScript idénticos en `packages/shared/src/types`,
   y ambos deben mantenerse sincronizados manualmente si el schema cambia.
5. Toda entidad con timestamps usa `createdAt` (default `now()`) y `updatedAt`
   (`@updatedAt`), en snake_case en la base de datos vía `@map`.
6. El seed (`prisma/seed.ts`) debe crear como mínimo:
   - 1 usuario con rol ADMIN_TI (credenciales desde variables de entorno, nunca
     hardcodeadas en texto plano en el repo).
   - 2-3 usuarios SOLICITANTE de ejemplo.
   - Datos de ejemplo de Tickets, Tasks y KnowledgeArticle para pruebas manuales.
7. Toda validación de input a nivel de aplicación (no de base de datos) se define
   con Zod en el archivo `*.schema.ts` correspondiente al módulo, y se reutiliza
   desde `packages/shared` cuando el mismo shape aplica también al frontend.
8. Las relaciones opcionales (ej. `Ticket.assigneeId`) deben ser nullable tanto en
   el schema Prisma (`String?`) como en el tipo TypeScript resultante.
9. Usa `@@index` en toda columna usada frecuentemente en filtros (`status`,
   `creatorId`, `assigneeId`, `slug`, `isPublished`) tal como está definido en la
   Sección 2. No agregues índices no solicitados sin justificar el porqué.
10. Antes de eliminar o renombrar una columna existente, genera una migración de
    "expand-contract" (agregar nueva columna, migrar datos, luego eliminar la
    vieja) si ya existen datos en producción/staging.
```

### 4.3 Skill 2 — API & Controllers

```markdown
# SKILL: API & CONTROLLERS

## Alcance
Lógica de negocio, endpoints REST, manejo de errores, respuestas HTTP.

## Reglas

1. Estructura obligatoria por módulo:
   `<modulo>.routes.ts` → define rutas y aplica middlewares (auth, role, validate)
   `<modulo>.controller.ts` → extrae req.body/params/query, llama al service,
   retorna respuesta. NO contiene lógica de negocio ni queries.
   `<modulo>.service.ts` → contiene TODA la lógica de negocio, reglas de
   autorización fina (ej. "un ticket solo lo edita su creador o un admin"),
   y orquesta llamadas a repository y audit.service.
   `<modulo>.repository.ts` → única capa que importa PrismaClient y ejecuta queries.

2. Manejo de errores centralizado:
   - Usa la clase `ApiError` (`shared/utils/ApiError.ts`) con `statusCode` y
     `message` para todo error de negocio esperado (404 Not Found, 403 Forbidden,
     409 Conflict, 422 Unprocessable Entity).
   - Todo controller se envuelve con `asyncHandler` para propagar errores
     asíncronos al middleware `error.middleware.ts` sin try/catch repetido.
   - El `error.middleware.ts` es el ÚNICO lugar que formatea la respuesta de
     error final: `{ success: false, error: { code, message } }`.

3. Envelope de respuesta estándar (usar SIEMPRE):
   ```typescript
   // Éxito
   res.status(200).json({ success: true, data: result });
   // Error (manejado automáticamente por error.middleware.ts)
   { success: false, error: { code: "TICKET_NOT_FOUND", message: "..." } }
   ```

4. Autorización:
   - `auth.middleware.ts` decodifica el JWT y adjunta `req.user = { id, role }`.
   - `role.middleware.ts` recibe un array de roles permitidos:
     `router.get('/admin/tickets', authenticate, authorize(['ADMIN_TI']), controller)`.
   - Reglas de autorización a nivel de RECURSO (ej. "un Solicitante solo ve sus
     propios tickets") se implementan en el SERVICE, no en el middleware, porque
     dependen del dato consultado (ownership check).

5. Paginación obligatoria en todo endpoint de listado (`GET /tickets`, `GET /tasks`,
   `GET /kb`): query params `page` (default 1) y `pageSize` (default 20, max 100).
   Respuesta incluye `{ data: [...], meta: { total, page, pageSize, totalPages } }`.

6. Filtros de listado de Tickets deben soportar: `status`, `priority`, `category`,
   `assigneeId`, y búsqueda de texto simple en `title` (usando `contains`
   case-insensitive de Prisma).

7. Todo endpoint que modifique estado (`PATCH /tickets/:id/status`,
   `PATCH /tasks/:id/status`) debe:
   a) Validar que la transición de estado sea válida (ej. no se puede pasar de
      CERRADO a ABIERTO sin pasar por reapertura explícita — define esta regla
      en un mapa de transiciones permitidas dentro del service).
   b) Registrar el AuditLog con `metadata: { from, to }`.

8. Nomenclatura de rutas REST (todas bajo prefijo `/api/v1`):
   ```
   POST   /api/v1/auth/login
   POST   /api/v1/auth/refresh
   GET    /api/v1/users/me

   GET    /api/v1/tickets
   POST   /api/v1/tickets
   GET    /api/v1/tickets/:id
   PATCH  /api/v1/tickets/:id
   PATCH  /api/v1/tickets/:id/status
   PATCH  /api/v1/tickets/:id/assign

   GET    /api/v1/tickets/:id/comments
   POST   /api/v1/tickets/:id/comments

   GET    /api/v1/tasks
   POST   /api/v1/tasks
   PATCH  /api/v1/tasks/:id
   PATCH  /api/v1/tasks/:id/status
   DELETE /api/v1/tasks/:id

   GET    /api/v1/kb
   GET    /api/v1/kb/:slug
   POST   /api/v1/kb
   PATCH  /api/v1/kb/:id
   PATCH  /api/v1/kb/:id/publish
   ```

9. Todo controller/service nuevo requiere al menos un test de integración
   (Supertest) que cubra: caso exitoso, caso de input inválido (422) y caso de
   autorización denegada (403) cuando aplique.

10. NUNCA hagas queries N+1: usa `include`/`select` de Prisma para traer
    relaciones necesarias en una sola query (ej. `Ticket` con su `creator` y
    `assignee` en el listado).
```

### 4.4 Skill 3 — UI & Components

```markdown
# SKILL: UI & COMPONENTS

## Alcance
Componentes de React, manejo de estado en frontend, accesibilidad.

## Reglas

1. Estructura de componentes:
   - `components/ui/` → primitivos de shadcn/ui, no modificar su lógica interna,
     solo estilizar vía props/className.
   - `components/<dominio>/` → componentes de negocio (TicketCard, KanbanBoard, etc.),
     SIN lógica de fetching de datos embebida directamente; consumen hooks.
   - `pages/<rol>/` → componentes de página, orquestan hooks + componentes de
     dominio, manejan layout de la ruta.

2. Estado:
   - Estado de SERVIDOR (datos de la API) → SIEMPRE vía TanStack Query
     (`useQuery`/`useMutation`), nunca en `useState` + `useEffect` manual.
   - Estado de UI local (modal abierto, tab activo, filtros de UI) → `useState`
     local o Zustand si se comparte entre componentes hermanos no anidados.
   - Estado de sesión (usuario autenticado, token) → Zustand store
     (`authStore.ts`), persistido en memoria + refresco vía httpOnly cookie o
     localStorage según decisión de seguridad (documentar cuál se usó).

3. Formularios:
   - Usa React Hook Form + `zodResolver` con los schemas de `packages/shared`.
   - Todo formulario muestra estados: `idle`, `submitting` (botón disabled +
     spinner), `error` (mensaje inline por campo + mensaje general si aplica),
     `success` (feedback visual, ej. toast).
   - Nunca dupliques reglas de validación entre frontend y backend: ambos
     importan el MISMO schema Zod desde `packages/shared`.

4. Accesibilidad (obligatorio, no opcional):
   - Todo elemento interactivo (`button`, `a`, `input`) debe ser navegable por
     teclado y tener foco visible (no remover `outline` sin reemplazo).
   - Todo ícono usado como único contenido de un botón debe llevar `aria-label`.
   - Formularios: `<label>` asociado a cada `<input>` vía `htmlFor`/`id`, mensajes
     de error asociados vía `aria-describedby`.
   - Modales (Dialog) deben atrapar el foco y cerrar con tecla `Escape`
     (shadcn/ui `Dialog` ya lo provee: no lo deshabilites).
   - Contraste de color mínimo AA (4.5:1 para texto normal) en toda combinación
     texto/fondo definida en Tailwind config.
   - Tablas de datos (listados de tickets/tareas) deben usar elementos `<table>`
     semánticos o `role="table"` si se usa un grid custom.

5. Manejo de errores en UI:
   - Todo `useMutation` implementa `onError` mostrando un toast/alerta con el
     mensaje `error.message` recibido del envelope del backend.
   - Errores 401 (token expirado) disparan automáticamente el flujo de refresh
     token desde el interceptor de `axiosClient.ts`; si el refresh falla,
     redirige a `/login` y limpia el `authStore`.

6. Rutas y guards:
   - `ProtectedRoute` redirige a `/login` si no hay sesión activa.
   - `RoleRoute` redirige a una página "No autorizado" (403) si el rol del
     usuario no coincide con el requerido por la ruta (ej. un SOLICITANTE
     intentando acceder a `/admin/*`).

7. Diseño visual:
   - Consulta y aplica las convenciones de diseño de frontend definidas para
     este proyecto (tipografía, espaciado, paleta) antes de crear componentes
     nuevos; evita el look genérico "shadcn por defecto" sin personalización.
   - Estados vacíos (ej. "No tienes tickets aún") y estados de carga (skeletons,
     no solo spinners genéricos) son obligatorios en toda vista de listado.

8. Responsividad: mobile-first con breakpoints de Tailwind (`sm`, `md`, `lg`).
   El tablero Kanban de tareas debe colapsar a vista de lista apilada en mobile.
```

---

## 5. Plan de Ejecución Paso a Paso

Instrucciones a entregar a KIRA en secuencia. Cada fase debe completarse y
validarse (build sin errores, tests pasando) antes de avanzar a la siguiente.

### FASE 0 — Bootstrap del repositorio
1. Inicializar monorepo con workspaces (pnpm/npm/yarn) según estructura de la
   Sección 3.
2. Crear `packages/shared` con `tsconfig.json` base y exportar un placeholder.
3. Configurar ESLint + Prettier compartidos en la raíz (reglas TypeScript
   estrictas: `strict: true`, `noImplicitAny: true`).
4. Crear `docker-compose.yml` con servicio `postgres` (imagen `postgres:15`,
   variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, volumen
   persistente) y healthcheck.

### FASE 1 — Setup y Base de Datos
1. En `apps/backend`: inicializar proyecto Node + TypeScript + Express, instalar
   Prisma, `zod`, `jsonwebtoken`, `bcrypt`, `pino`, `helmet`, `cors`,
   `express-rate-limit`.
2. Configurar `prisma/schema.prisma` con el modelo completo de la Sección 2.1.
3. Ejecutar `npx prisma migrate dev --name init` y verificar que las tablas se
   crean correctamente en PostgreSQL (vía Docker Compose).
4. Implementar `prisma/seed.ts` con los datos mínimos descritos en Skill 1,
   regla 6.
5. Configurar `config/env.ts` con validación Zod de variables de entorno
   (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`).
6. Implementar `app.ts` con middlewares globales (helmet, cors configurado con
   origin del frontend, rate limit, logger pino, parser JSON).
7. **Checkpoint:** `npm run dev` levanta el servidor, `GET /health` responde 200.

### FASE 2 — Backend API (por módulo, en este orden)
1. **Módulo Auth:** login (email + password → access + refresh token), endpoint
   de refresh, middleware `auth.middleware.ts`, middleware `role.middleware.ts`.
   Hashing de contraseñas con `bcrypt` (cost factor 10-12).
2. **Módulo Users:** `GET /users/me`, listado de usuarios (solo ADMIN_TI, para
   asignar tickets).
3. **Módulo Audit:** `audit.service.ts` con función `logAction()` reutilizable
   por los demás módulos.
4. **Módulo Tickets:** CRUD completo + cambio de estado + asignación, aplicando
   reglas de ownership (Solicitante ve solo los suyos; Admin ve todos).
5. **Submódulo Comments (dentro de Tickets):** crear/listar comentarios,
   respetando visibilidad de `isInternal`.
6. **Módulo Tasks:** CRUD completo + cambio de estado, visible únicamente para
   ADMIN_TI.
7. **Módulo Knowledge Base:** CRUD de artículos, endpoint público de listado
   filtrado por `isPublished` según rol, endpoint de publicar/despublicar.
8. Generar documentación OpenAPI/Swagger accesible en `/api/v1/docs`.
9. **Checkpoint:** ejecutar suite completa de tests de integración (Supertest);
   todos los endpoints responden según los códigos HTTP definidos en Skill 2.

### FASE 3 — Frontend: Experiencia del Solicitante
1. Inicializar `apps/frontend` con Vite + React + TS, instalar Tailwind,
   shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, axios.
2. Configurar `axiosClient.ts` con interceptores de JWT y manejo de refresh
   automático en 401.
3. Implementar `authStore.ts`, `LoginPage.tsx`, `ProtectedRoute`, `RoleRoute`.
4. Implementar layout base (`AppShell`, `Sidebar`, `Header`) adaptado por rol.
5. Vista **"Mis Tickets"**: listado con filtros básicos, estados vacíos,
   skeletons de carga.
6. Vista **"Nuevo Ticket"**: formulario validado (título, descripción, categoría,
   prioridad).
7. Vista **"Detalle de Ticket"**: información completa + hilo de comentarios
   (sin ver comentarios internos) + posibilidad de agregar comentario.
8. Vista **"Base de Conocimiento"**: listado de artículos publicados con
   búsqueda simple, vista de detalle con renderizado de Markdown.
9. **Checkpoint:** flujo completo de un Solicitante (login → crear ticket → ver
   detalle → comentar → consultar KB) funciona end-to-end contra el backend real.

### FASE 4 — Frontend: Experiencia del Administrador de TI
1. Vista **"Dashboard"**: métricas simples (tickets abiertos, por prioridad,
   tareas pendientes) usando datos agregados del backend (agregar endpoint de
   métricas si no existe aún).
2. Vista **"Gestión de Tickets"**: listado completo con todos los filtros,
   asignación, cambio de estado, comentarios internos y públicos.
3. Vista **"Tablero de Tareas"**: Kanban con columnas por `TaskStatus`,
   drag-and-drop opcional (o botones de cambio de estado si se prioriza
   simplicidad), colapso a lista en mobile.
4. Vista **"Gestión de Artículos"**: editor Markdown (crear/editar artículos),
   toggle de publicar/despublicar, listado con borradores incluidos.
5. **Checkpoint:** flujo completo de un Admin TI (login → gestionar ticket →
   mover tarea en el tablero → publicar artículo) funciona end-to-end.

### FASE 5 — Endurecimiento y despliegue
1. Escribir `Dockerfile` para backend y frontend (build multi-stage,
   imagen final mínima tipo `node:20-alpine` / `nginx:alpine`).
2. Completar `docker-compose.yml` con los tres servicios (`postgres`, `backend`,
   `frontend`) y variables de entorno vía `.env`.
3. Revisar cobertura de tests (backend: services y controllers críticos;
   frontend: componentes de formularios y hooks principales).
4. Auditoría de seguridad básica: verificar que no hay secretos hardcodeados,
   `helmet` configurado, rate limiting activo en `/auth/login`, CORS restringido
   al dominio del frontend en producción.
5. Documentar en `README.md` los pasos de instalación local, variables de
   entorno requeridas y comandos de migración/seed.

---

*Fin del documento. Este archivo debe entregarse a KIRA como contexto persistente
del proyecto antes de iniciar la Fase 0.*
