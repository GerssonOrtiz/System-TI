import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useCreateTask, useTasks } from '@/hooks/useTasks';

export function TableroTareasPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data: tasks, isLoading, isError } = useTasks();
  const { mutateAsync: createTask, isPending } = useCreateTask();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tablero Kanban de Tareas</h1>
          <p className="text-sm text-muted-foreground">
            Administra las tareas operativas internas del equipo de TI.
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Tarea Interna</DialogTitle>
            </DialogHeader>
            <TaskForm
              isLoading={isPending}
              onSubmit={async (data) => {
                await createTask(data);
                setOpenDialog(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          Error al cargar el tablero de tareas.
        </div>
      ) : (
        <KanbanBoard tasks={tasks ?? []} />
      )}
    </div>
  );
}
