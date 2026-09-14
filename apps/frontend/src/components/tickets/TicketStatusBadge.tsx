import { TicketStatus, TicketPriority } from '@sistema-ti/shared';
import type { BadgeProps } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<TicketStatus, { label: string; variant: BadgeProps['variant'] }> = {
  [TicketStatus.ABIERTO]: { label: 'Abierto', variant: 'info' },
  [TicketStatus.EN_PROGRESO]: { label: 'En progreso', variant: 'warning' },
  [TicketStatus.EN_ESPERA]: { label: 'En espera', variant: 'secondary' },
  [TicketStatus.RESUELTO]: { label: 'Resuelto', variant: 'success' },
  [TicketStatus.CERRADO]: { label: 'Cerrado', variant: 'outline' },
};

const priorityConfig: Record<TicketPriority, { label: string; variant: BadgeProps['variant'] }> = {
  [TicketPriority.BAJA]: { label: 'Baja', variant: 'outline' },
  [TicketPriority.MEDIA]: { label: 'Media', variant: 'secondary' },
  [TicketPriority.ALTA]: { label: 'Alta', variant: 'warning' },
  [TicketPriority.CRITICA]: { label: 'Crítica', variant: 'destructive' },
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
