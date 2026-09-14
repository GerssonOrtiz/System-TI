import type { TaskDTO, TaskStatus } from '@sistema-ti/shared';
import { TaskStatus as TaskStatusEnum } from '@sistema-ti/shared';

import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: TaskDTO[];
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: TaskStatusEnum.PENDIENTE, title: 'Pendiente', color: 'border-slate-300 dark:border-slate-700' },
  { id: TaskStatusEnum.EN_PROGRESO, title: 'En Progreso', color: 'border-blue-400 dark:border-blue-700' },
  { id: TaskStatusEnum.COMPLETADA, title: 'Completada', color: 'border-green-400 dark:border-green-700' },
  { id: TaskStatusEnum.CANCELADA, title: 'Cancelada', color: 'border-red-300 dark:border-red-800' },
];

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-lg border-t-4 ${col.color} bg-muted/30 p-3 min-h-[400px]`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-semibold text-sm">{col.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-mono font-medium">
                {colTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-8 border border-dashed rounded-md">
                  Sin tareas
                </div>
              ) : (
                colTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
