import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

import type { TicketFiltersInput, TicketStatus } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/TicketCard';
import { useTickets } from '@/hooks/useTickets';

export function GestionTicketsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');

  const filters: Partial<TicketFiltersInput> = {
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isError } = useTickets(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Tickets (Mesa de Ayuda)</h1>
        <p className="text-sm text-muted-foreground">
          Visualiza, asigna y cambia el estado de todos los tickets del sistema.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        {([
          { value: '', label: 'Todos' },
          { value: 'ABIERTO', label: 'Abiertos' },
          { value: 'EN_PROGRESO', label: 'En Progreso' },
          { value: 'EN_ESPERA', label: 'En Espera' },
          { value: 'RESUELTO', label: 'Resueltos' },
          { value: 'CERRADO', label: 'Cerrados' },
        ] as { value: TicketStatus | ''; label: string }[]).map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          Error al cargar los tickets.
        </div>
      ) : !data?.data?.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          No hay tickets que coincidan con el filtro.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((ticket) => (
            <div key={ticket.id} className="relative">
              <TicketCard ticket={ticket} />
              <div className="mt-2 text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link to={`/solicitante/tickets/${ticket.id}`}>Ver / Gestionar →</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
