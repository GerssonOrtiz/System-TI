# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar configuración de monorepo y paquetes
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Instalar dependencias y construir shared + backend
RUN npm install -g pnpm && pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @sistema-ti/shared build
RUN pnpm --filter backend prisma:generate
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/dist ./packages/shared/dist
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/dist ./apps/backend/dist
COPY apps/backend/prisma ./apps/backend/prisma

# Copiar cliente de Prisma generado en el builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 4000

CMD ["node", "apps/backend/dist/server.js"]
