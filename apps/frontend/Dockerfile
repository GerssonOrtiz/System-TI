# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

RUN npm install -g pnpm && pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @sistema-ti/shared build
RUN pnpm --filter frontend build

# Stage 2: Nginx server
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Configuración básica de SPA routing para Nginx
RUN echo $'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
