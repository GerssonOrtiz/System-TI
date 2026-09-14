import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Gestión de TI',
      version: '1.0.0',
      description:
        'API REST para el sistema de Mesa de Ayuda, Gestión de Tareas y Base de Conocimiento',
      contact: {
        name: 'Soporte TI',
        email: 'soporte.ti@empresa.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en POST /auth/login',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'TICKET_NOT_FOUND' },
                message: { type: 'string', example: 'Ticket no encontrado' },
                details: { type: 'object' },
              },
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['SOLICITANTE', 'ADMIN_TI'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['ABIERTO', 'EN_PROGRESO', 'EN_ESPERA', 'RESUELTO', 'CERRADO'],
            },
            priority: { type: 'string', enum: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'] },
            category: {
              type: 'string',
              enum: ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO'],
            },
            creatorId: { type: 'string', format: 'uuid' },
            assigneeId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'],
            },
            priority: { type: 'string', enum: ['BAJA', 'MEDIA', 'ALTA'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            creatorId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        KbArticle: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string', description: 'Contenido en Markdown' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isPublished: { type: 'boolean' },
            viewCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Autenticación y gestión de sesión' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Tickets', description: 'Mesa de ayuda — tickets de soporte' },
      { name: 'Comments', description: 'Comentarios de tickets' },
      { name: 'Tasks', description: 'Gestión de tareas (solo ADMIN_TI)' },
      { name: 'Knowledge Base', description: 'Base de conocimiento' },
      { name: 'Dashboard', description: 'Métricas del dashboard' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
