import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateKbArticleInput } from '@sistema-ti/shared';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const articleFormSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  category: z.string().min(2, 'La categoría es requerida'),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  tagsInput: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  initialData?: Partial<ArticleFormData>;
  onSubmit: (data: CreateKbArticleInput) => Promise<void>;
  isLoading?: boolean;
}

export function ArticleEditor({ initialData, onSubmit, isLoading }: ArticleEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'General',
      content: initialData?.content || '',
      tagsInput: initialData?.tagsInput || '',
      isPublished: initialData?.isPublished || false,
    },
  });

  const onFormSubmit = async (data: ArticleFormData) => {
    const tags = data.tagsInput
      ? data.tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    await onSubmit({
      title: data.title,
      category: data.category,
      content: data.content,
      tags,
      isPublished: data.isPublished,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input id="title" placeholder="Ej: Cómo configurar VPN corporativa..." {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Input id="category" placeholder="Ej: Redes, Hardware, Accesos" {...register('category')} />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagsInput">Etiquetas (separadas por coma)</Label>
          <Input id="tagsInput" placeholder="vpn, red, tutorial" {...register('tagsInput')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido (Markdown) *</Label>
        <Textarea
          id="content"
          placeholder="Escribe el artículo usando sintaxis Markdown..."
          rows={10}
          className="font-mono text-sm"
          {...register('content')}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isPublished"
          className="rounded border-gray-300"
          {...register('isPublished')}
        />
        <Label htmlFor="isPublished" className="cursor-pointer text-sm">
          Publicar artículo inmediatamente
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Artículo'}
        </Button>
      </div>
    </form>
  );
}
