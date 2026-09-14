import type { AuditAction, AuditEntity } from '@prisma/client';
import type { Prisma } from '@prisma/client';

import { prisma } from '../../config/database';

export interface CreateAuditLogInput {
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export const auditRepository = {
  async create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });
  },
};
