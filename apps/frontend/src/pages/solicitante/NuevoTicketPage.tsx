import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketForm } from '@/components/tickets/TicketForm';
import { useCreateTicket } from '@/hooks/useTickets';

export function NuevoTicketPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTicket();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo ticket de soporte</CardTitle>
          <CardDescription>
            Describe tu problema con detalle para que el equipo de TI pueda ayudarte rápidamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketForm
            isLoading={isPending}
            onSubmit={async (data) => {
              const ticket = await mutateAsync(data);
              navigate(`/tickets/${ticket.id}`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
