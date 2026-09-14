# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar configuración de monorepo y paquetes
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Instalar dependencias y construir shared + backend
RUN npm install -g pnpm@9 && pnpm install --no-frozen-lockfile
RUN pnpm --filter @sistema-ti/shared build
RUN pnpm --filter backend prisma:generate
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/backend ./apps/backend

EXPOSE 4000

# MODIFICACIÓN AQUÍ: Aplica migraciones antes de iniciar la app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma && node apps/backend/dist/server.js"]