import pino from 'pino';

import type { AuditAction, AuditEntity } from '@sistema-ti/shared';

import type { CreateAuditLogInput } from './audit.repository';
import { auditRepository } from './audit.repository';

const logger = pino({ name: 'audit.service' });

/**
 * Servicio de auditoría reutilizable por todos los módulos.
 * No lanza excepciones: los errores de auditoría se loguean pero no
 * interrumpen el flujo principal de la operación.
 */
export const auditService = {
  async logAction(data: {
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      const input: CreateAuditLogInput = {
        action: data.action as CreateAuditLogInput['action'],
        entity: data.entity as CreateAuditLogInput['entity'],
        entityId: data.entityId,
        userId: data.userId,
        metadata: data.metadata,
      };
      await auditRepository.create(input);
    } catch (err) {
      // Auditoría no debe interrumpir la operación principal
      logger.error({ err, data }, 'Error al registrar audit log');
    }
  },
};
