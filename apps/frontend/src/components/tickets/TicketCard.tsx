import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

import type { TicketDTO } from '@sistema-ti/shared';
import { TicketCategory, TicketPriority, TicketStatus } from '@sistema-ti/shared';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

import { TicketPriorityBadge, TicketStatusBadge } from './TicketStatusBadge';

const categoryLabels: Record<TicketCategory, string> = {
  [TicketCategory.HARDWARE]: 'Hardware',
  [TicketCategory.SOFTWARE]: 'Software',
  [TicketCategory.RED]: 'Red',
  [TicketCategory.ACCESOS]: 'Accesos',
  [TicketCategory.OTRO]: 'Otro',
};

interface TicketCardProps {
  ticket: TicketDTO;
  detailPath?: string;
}

export function TicketCard({ ticket, detailPath }: TicketCardProps) {
  const href = detailPath ?? `/tickets/${ticket.id}`;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={href}
            className="text-sm font-semibold leading-tight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ticket.title}
          </Link>
          <TicketStatusBadge status={ticket.status as TicketStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">{ticket.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <TicketPriorityBadge priority={ticket.priority as TicketPriority} />
          <span className="text-xs text-muted-foreground">
            {categoryLabels[ticket.category as TicketCategory]}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
          </div>
          {ticket.assignee && (
            <span>Asignado a: {ticket.assignee.fullName}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
