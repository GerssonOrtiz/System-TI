import { AlertCircle, CheckSquare, Clock, FileText, LifeBuoy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '@/hooks/useDashboard';

export function DashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard de TI</h1>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="rounded-lg border border-destructive/50 p-6 text-center">
        <p className="text-sm text-destructive">Error al cargar las métricas del sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de TI</h1>
          <p className="text-sm text-muted-foreground">
            Resumen en tiempo real del estado de tickets, tareas y soporte.
          </p>
        </div>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Tickets Abiertos
            </CardTitle>
            <LifeBuoy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOpenTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención activa</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Tareas Pendientes
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">En el tablero Kanban</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Alta / Crítica
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.ticketsByPriority['ALTA'] ?? 0) + (metrics.ticketsByPriority['CRITICA'] ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Prioridad elevada</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Tickets Resueltos
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.ticketsByStatus['RESUELTO'] ?? 0) + (metrics.ticketsByStatus['CERRADO'] ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completados con éxito</p>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos y desglose */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de Tickets</CardTitle>
            <CardDescription>Distribución por fase de atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Abiertos', count: metrics.ticketsByStatus['ABIERTO'] ?? 0, color: 'bg-amber-500' },
              { label: 'En Progreso', count: metrics.ticketsByStatus['EN_PROGRESO'] ?? 0, color: 'bg-blue-500' },
              { label: 'En Espera', count: metrics.ticketsByStatus['EN_ESPERA'] ?? 0, color: 'bg-purple-500' },
              { label: 'Resueltos', count: metrics.ticketsByStatus['RESUELTO'] ?? 0, color: 'bg-green-500' },
              { label: 'Cerrados', count: metrics.ticketsByStatus['CERRADO'] ?? 0, color: 'bg-slate-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold font-mono">{item.count}</span>
              </div>
            ))}
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/tickets">Ir a gestión de tickets</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accesos Directos de Administración</CardTitle>
            <CardDescription>Gestión rápida de recursos de TI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="secondary" className="w-full justify-start gap-2">
              <Link to="/admin/tickets">
                <LifeBuoy className="h-4 w-4 text-primary" />
                Mesa de Ayuda - Todos los tickets
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-start gap-2">
              <Link to="/admin/tareas">
                <CheckSquare className="h-4 w-4 text-primary" />
                Tablero Kanban de Tareas
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-start gap-2">
              <Link to="/admin/articulos">
                <FileText className="h-4 w-4 text-primary" />
                Gestión de Base de Conocimiento
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-start gap-2">
              <Link to="/admin/usuarios">
                <Users className="h-4 w-4 text-primary" />
                Usuarios y Accesos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
