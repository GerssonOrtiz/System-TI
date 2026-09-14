import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateTaskInput, TaskPriority } from '@sistema-ti/shared';
import { TaskPriority as TaskPriorityEnum } from '@sistema-ti/shared';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const taskFormSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriorityEnum),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriorityEnum.MEDIA,
    },
  });

  const priority = watch('priority');

  const onFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input id="title" placeholder="Título de la tarea..." {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Detalles opcionales de la tarea..."
          rows={3}
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prioridad</Label>
          <Select value={priority} onValueChange={(val) => setValue('priority', val as TaskPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskPriorityEnum.BAJA}>Baja</SelectItem>
              <SelectItem value={TaskPriorityEnum.MEDIA}>Media</SelectItem>
              <SelectItem value={TaskPriorityEnum.ALTA}>Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha de vencimiento</Label>
          <Input id="dueDate" type="date" {...register('dueDate')} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
}
