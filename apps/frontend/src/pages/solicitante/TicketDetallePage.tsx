import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquare, User } from 'lucide-react';

import { CreateCommentSchema, TicketCategory, TicketPriority, TicketStatus } from '@sistema-ti/shared';
import type { CreateCommentInput } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TicketPriorityBadge, TicketStatusBadge } from '@/components/tickets/TicketStatusBadge';
import { useTicket, useTicketComments, useAddComment } from '@/hooks/useTickets';
import { formatDateTime } from '@/lib/utils';

const categoryLabels: Record<TicketCategory, string> = {
  [TicketCategory.HARDWARE]: 'Hardware',
  [TicketCategory.SOFTWARE]: 'Software',
  [TicketCategory.RED]: 'Red',
  [TicketCategory.ACCESOS]: 'Accesos',
  [TicketCategory.OTRO]: 'Otro',
};

export function TicketDetallePage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: ticketData, isLoading: loadingTicket } = useTicket(id);
  const { data: commentsData, isLoading: loadingComments } = useTicketComments(id);
  const { mutateAsync: addComment, isPending: sendingComment } = useAddComment(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { isInternal: false },
  });

  const onComment = async (data: CreateCommentInput) => {
    await addComment(data);
    reset();
  };

  if (loadingTicket) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Cargando ticket...">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const ticket = ticketData?.data;
  if (!ticket) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Encabezado del ticket */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-xl font-semibold">{ticket.title}</h2>
            <TicketStatusBadge status={ticket.status as TicketStatus} />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <TicketPriorityBadge priority={ticket.priority as TicketPriority} />
            <span className="text-sm text-muted-foreground">
              {categoryLabels[ticket.category as TicketCategory]}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{ticket.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Creado</dt>
              <dd>
                <time dateTime={ticket.createdAt}>{formatDateTime(ticket.createdAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Asignado a</dt>
              <dd>{ticket.assignee?.fullName ?? 'Sin asignar'}</dd>
            </div>
            {ticket.resolvedAt && (
              <div>
                <dt className="text-muted-foreground">Resuelto</dt>
                <dd>
                  <time dateTime={ticket.resolvedAt}>{formatDateTime(ticket.resolvedAt)}</time>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Hilo de comentarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            Comentarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingComments ? (
            <div aria-busy="true" aria-label="Cargando comentarios...">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !commentsData?.data?.length ? (
            <p className="text-center text-sm text-muted-foreground">
              No hay comentarios aún. ¡Sé el primero!
            </p>
          ) : (
            <ul className="space-y-4" aria-label="Lista de comentarios">
              {commentsData.data.map((comment) => (
                <li key={comment.id} className="flex gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
                    aria-hidden="true"
                  >
                    {comment.author?.fullName.charAt(0).toUpperCase() ?? <User className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author?.fullName}</span>
                      <time
                        dateTime={comment.createdAt}
                        className="text-xs text-muted-foreground"
                      >
                        {formatDateTime(comment.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Formulario de comentario */}
          {ticket.status !== TicketStatus.CERRADO && (
            <form onSubmit={handleSubmit(onComment)} noValidate className="space-y-3 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="comment-content">Agregar comentario</Label>
                <Textarea
                  id="comment-content"
                  placeholder="Escribe tu comentario o actualización..."
                  rows={3}
                  aria-describedby={errors.content ? 'comment-error' : undefined}
                  aria-invalid={!!errors.content}
                  {...register('content')}
                />
                {errors.content && (
                  <p id="comment-error" className="text-sm text-destructive" role="alert">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <Button type="submit" size="sm" disabled={sendingComment}>
                {sendingComment ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
                    Enviando...
                  </>
                ) : (
                  'Enviar comentario'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
