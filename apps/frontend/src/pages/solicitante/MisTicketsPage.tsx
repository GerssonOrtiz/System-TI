import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

import type { TicketFiltersInput, TicketStatus } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/TicketCard';
import { useTickets } from '@/hooks/useTickets';

export function MisTicketsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');

  const filters: Partial<TicketFiltersInput> = {
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isError } = useTickets(filters);

  return (
    <div className="space-y-6">
      {/* Barra de acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar tickets por título"
          />
        </div>
        <Button asChild>
          <Link to="/tickets/nuevo">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Nuevo ticket
          </Link>
        </Button>
      </div>

      {/* Filtros rápidos por estado */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {([
          { value: '', label: 'Todos' },
          { value: 'ABIERTO', label: 'Abiertos' },
          { value: 'EN_PROGRESO', label: 'En progreso' },
          { value: 'RESUELTO', label: 'Resueltos' },
          { value: 'CERRADO', label: 'Cerrados' },
        ] as { value: TicketStatus | ''; label: string }[]).map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
            aria-pressed={statusFilter === f.value}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Lista de tickets */}
      {isLoading ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Cargando tickets..."
          aria-busy="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center">
          <p className="text-sm text-destructive">Error al cargar los tickets. Intenta de nuevo.</p>
        </div>
      ) : !data?.data?.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
          <h3 className="text-lg font-medium">No tienes tickets aún</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea tu primer ticket de soporte cuando lo necesites.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/tickets/nuevo">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Crear primer ticket
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data.meta?.total ?? data.data.length} ticket(s) encontrado(s)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Necesario para el estado vacío
function Ticket({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      aria-hidden="true"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
