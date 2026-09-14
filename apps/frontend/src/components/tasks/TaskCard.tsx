import { Calendar, Clock, Trash2 } from 'lucide-react';

import type { TaskDTO, TaskStatus } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks';

interface TaskCardProps {
  task: TaskDTO;
}

export function TaskCard({ task }: TaskCardProps) {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateStatus({ id: task.id, data: { status: newStatus } });
  };

  const priorityColors: Record<string, string> = {
    BAJA: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    MEDIA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    ALTA: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  };

  return (
    <Card className="flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
          <span
            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority] ?? ''}`}
          >
            {task.priority}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
            </div>
          )}
          {task.linkedTicketId && (
            <div className="flex items-center gap-1 text-primary">
              <Clock className="h-3.5 w-3.5" />
              <span>Ticket vinculado</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <Select
            value={task.status}
            onValueChange={(val) => handleStatusChange(val as TaskStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-7 text-xs w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
              <SelectItem value="COMPLETADA">Completada</SelectItem>
              <SelectItem value="CANCELADA">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => deleteTask(task.id)}
            disabled={isDeleting}
            title="Eliminar tarea"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
