import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  CreateTicketSchema,
  TicketCategory,
  TicketPriority,
} from '@sistema-ti/shared';
import type { CreateTicketInput } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryOptions = [
  { value: TicketCategory.HARDWARE, label: 'Hardware' },
  { value: TicketCategory.SOFTWARE, label: 'Software' },
  { value: TicketCategory.RED, label: 'Red' },
  { value: TicketCategory.ACCESOS, label: 'Accesos' },
  { value: TicketCategory.OTRO, label: 'Otro' },
];

const priorityOptions = [
  { value: TicketPriority.BAJA, label: 'Baja' },
  { value: TicketPriority.MEDIA, label: 'Media' },
  { value: TicketPriority.ALTA, label: 'Alta' },
  { value: TicketPriority.CRITICA, label: 'Crítica' },
];

interface TicketFormProps {
  onSubmit: (data: CreateTicketInput) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CreateTicketInput>;
}

export function TicketForm({ onSubmit, isLoading, defaultValues }: TicketFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      priority: TicketPriority.MEDIA,
      category: TicketCategory.OTRO,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Describe brevemente el problema"
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={!!errors.title}
          aria-required="true"
          {...register('title')}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-destructive" role="alert">
            {errors.title.message as string}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          placeholder="Describe el problema con detalle: qué ocurrió, cuándo empezó, qué pasos intentaste..."
          rows={4}
          aria-describedby={errors.description ? 'description-error' : undefined}
          aria-invalid={!!errors.description}
          aria-required="true"
          {...register('description')}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive" role="alert">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {/* Categoría y Prioridad */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            defaultValue={defaultValues?.category ?? TicketCategory.OTRO}
            onValueChange={(val) => setValue('category', val as TicketCategory)}
          >
            <SelectTrigger id="category" aria-label="Seleccionar categoría">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select
            defaultValue={defaultValues?.priority ?? TicketPriority.MEDIA}
            onValueChange={(val) => setValue('priority', val as TicketPriority)}
          >
            <SelectTrigger id="priority" aria-label="Seleccionar prioridad">
              <SelectValue placeholder="Selecciona prioridad" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Creando ticket...
          </>
        ) : (
          'Crear ticket'
        )}
      </Button>
    </form>
  );
}
