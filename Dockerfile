# Stage 1: Build
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

RUN npm install -g pnpm@9 && pnpm install --no-frozen-lockfile
RUN pnpm --filter @sistema-ti/shared build
RUN pnpm --filter backend prisma:generate
RUN pnpm --filter backend build

# Stage 2: Production
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/backend ./apps/backend

EXPOSE 4000

# Usar el binario local de prisma mediante pnpm para evitar que npx descargue Prisma v7
CMD ["sh", "-c", "pnpm --filter backend exec prisma migrate deploy --schema=prisma/schema.prisma && node apps/backend/dist/server.js"]