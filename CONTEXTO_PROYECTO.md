# CONTEXTO_PROYECTO.md — Estado de Avance y Guía de Despliegue 100% Gratuito

> **Proyecto:** Sistema de Gestión de TI (Mesa de Ayuda / Tareas Internas / Base de Conocimiento)  
> **Arquitectura:** Monolito Modular desacoplado con Monorepo (Express API + Prisma + React/Vite + Zod + TanStack Query + Tailwind CSS)  
> **Documento de Referencia Base:** `arquitectura-sistema-gestion-ti.md`  
> **Fecha de Actualización:** 13 de Septiembre, 2026

---

## 1. Objetivo del Sistema de TI

El **Sistema de Gestión de TI** es una plataforma integral diseñada para optimizar y centralizar las operaciones de tecnología de la información en la organización. Sus objetivos principales son:

- **Mesa de Ayuda (Help Desk):** Permitir a los usuarios (*Solicitantes*) registrar, dar seguimiento y recibir soporte sobre incidentes o requerimientos de hardware, software, red y accesos.
- **Gestión Operativa de TI:** Brindar al equipo de tecnología (*Admin TI*) un tablero Kanban interactivo para organizar, priorizar y resolver tareas internas ligadas o independientes de los tickets.
- **Base de Conocimiento (Knowledge Base):** Publicar manuales, guías y soluciones frecuentes para fomentar el autoservicio de los usuarios y reducir la carga de soporte.
- **Trazabilidad y Auditoría:** Garantizar que todo cambio de estado en tickets y tareas registre automáticamente un historial de auditoría (`AuditLog`).

---

## 2. Arquitectura y Stack Tecnológico Acordado

### 2.1 Enfoque Arquitectónico
- **Monolito Modular desacoplado:** Un único proceso de backend estructurado internamente por módulos de dominio (`auth`, `users`, `tickets`, `tasks`, `knowledge-base`, `audit`), exponiendo una API REST desacoplada (`/api/v1/*`).
- **Monorepo con Workspaces:** Organizado mediante `pnpm` en `apps/backend`, `apps/frontend` y `packages/shared`.

### 2.2 Stack Tecnológico
| Capa | Tecnología | Función |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | SPA de alto rendimiento |
| **Gestión de Estado Servidor** | TanStack Query (React Query) | Cache, invalidación y sync HTTP |
| **Gestión de Estado Local** | Zustand (`authStore.ts`) | Sesión y token JWT en memoria |
| **Estilos & UI** | Tailwind CSS + shadcn/ui | Sistema de diseño accesible y consistente |
| **Formularios & Validación** | React Hook Form + Zod | Validación tipada compartida frontend/backend |
| **Backend** | Node.js 20 LTS + Express + TypeScript | API REST tipada end-to-end |
| **ORM & BD** | Prisma ORM + PostgreSQL 15+ | Modelado, migraciones y queries tipadas |
| **Autenticación** | JWT (Access + Refresh token) + bcryptjs | Seguridad stateless por roles (`SOLICITANTE`, `ADMIN_TI`) |
| **Paquete Compartido** | `@sistema-ti/shared` | DTOs, Zod Schemas y Constantes comunes |
| **Documentación API** | Swagger UI (`/api/v1/docs`) | Contrato OpenAPI interactivo |
| **Contenedores** | Docker + Docker Compose | Entorno reproducible (Postgres, Backend, Frontend) |

---

## 3. Lo que ya se ha avanzado o diseñado hasta este momento

### 3.1 Backend & Base de Datos (Completado ~95%)
- **Esquema de Datos (Prisma):** Tablas `users`, `tickets`, `ticket_comments`, `tasks`, `knowledge_articles` y `audit_logs` con índices y relaciones.
- **Seed de Datos (`prisma/seed.ts`):** Creación de usuario Administrador y Solicitantes iniciales con hash de contraseñas bcrypt.
- **Módulos de la API REST:**
  - `auth`: `/auth/login`, `/auth/refresh` con rotación JWT.
  - `users`: `/users/me`, `/users` (listado para asignaciones).
  - `tickets`: CRUD de tickets, asignación de técnicos, cambio de estados y comentarios públicos/internos (`isInternal`).
  - `tasks`: CRUD de tareas internas y actualización de estados.
  - `knowledge-base`: Gestión de artículos con visibilidad por rol y conteo de lecturas.
  - `dashboard`: Endpoint de agregación `/dashboard/metrics`.
  - `audit`: Servicio centralizado `audit.service.ts` invocado en cada cambio de estado.

### 3.2 Frontend SPA (Completado ~100%)
- **Enrutamiento y Seguridad:** Creados `AppRouter.tsx`, `ProtectedRoute` y `RoleRoute` separando vistas de Solicitante y Administrador.
- **Vistas del Solicitante:** `MisTicketsPage.tsx`, `NuevoTicketPage.tsx`, `TicketDetallePage.tsx` y `BaseConocimientoPage.tsx`.
- **Vistas del Administrador TI:**
  - `DashboardPage.tsx`: Métricas de tickets abiertos, tareas pendientes y tarjetas por prioridad.
  - `GestionTicketsPage.tsx`: Administración de tickets con filtros.
  - `TableroTareasPage.tsx`: Kanban operativo organizado por columnas de estado.
  - `GestionArticulosPage.tsx`: Editor y publicación de guías en Markdown.
- **Componentes de Dominio:** `TaskCard`, `TaskForm`, `KanbanBoard`, `ArticleCard`, `ArticleEditor`, `ArticleViewer`, `TicketCard`, `TicketForm`, `TicketStatusBadge`.

### 3.3 Infraestructura & Despliegue
- Creados los `Dockerfile` multi-stage para backend (Node Alpine) y frontend (Nginx Alpine SPA).
- Creado `apps/frontend/vercel.json` para soporte de rutas SPA en Vercel.
- Definido `docker-compose.yml` para levantar PostgreSQL, API REST y Frontend localmente.

---

## 4. Estrategia de Despliegue 100% GRATUITO ($0 / mes)

Para un uso simple con volumen bajo/medio sin ningún tipo de cobro, la combinación óptima es:

### Paso 1: Base de Datos PostgreSQL Gratuita en Neon.tech
1. Regístrate gratis en **[Neon.tech](https://neon.tech)** (PostgreSQL serverless gratuito permanente sin tarjeta de crédito).
2. Crea un nuevo proyecto llamado `sistema-ti`.
3. Copia la cadena de conexión de PostgreSQL proporcionada (ejemplo: `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).

### Paso 2: Backend API REST Gratuito en Render.com o Koyeb
1. Regístrate gratis en **[Render.com](https://render.com)**.
2. Crea un **New Web Service** conectando tu repositorio de GitHub.
3. Configuración para despliegue con **Docker** (Recomendado):
   - **Environment:** `Docker`
   - **Root Directory:** *(Dejar en blanco o `.` para usar la raíz del Monorepo)*
   - **Dockerfile Path:** `apps/backend/Dockerfile`
   - **Environment Variables:**
     - `DATABASE_URL`: *(La URL copiada de Neon.tech)*
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: *(Tu clave secreta JWT)*
     - `JWT_REFRESH_SECRET`: *(Tu clave secreta Refresh JWT)*
     - `FRONTEND_URL`: `https://tu-app-frontend.vercel.app`
4. Render te asignará una URL pública gratuita (ej: `https://sistema-ti-backend.onrender.com`).

### Paso 3: Frontend SPA Gratuito en Vercel
1. Regístrate gratis en **[Vercel.com](https://vercel.com)**.
2. Haz clic en **Add New Project** y selecciona tu repositorio.
3. Configuración:
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL`: `https://sistema-ti-backend.onrender.com/api/v1`
4. Despliega. Vercel te dará tu URL pública con HTTPS (ej: `https://sistema-ti.vercel.app`).
