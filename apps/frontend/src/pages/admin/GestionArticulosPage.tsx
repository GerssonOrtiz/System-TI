import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleCard } from '@/components/knowledge-base/ArticleCard';
import { ArticleEditor } from '@/components/knowledge-base/ArticleEditor';
import { useCreateKBArticle, useKnowledgeBase } from '@/hooks/useKnowledgeBase';

export function GestionArticulosPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading, isError } = useKnowledgeBase();
  const { mutateAsync: createArticle, isPending } = useCreateKBArticle();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Base de Conocimiento</h1>
          <p className="text-sm text-muted-foreground">
            Crea y publica manuales, guías y soluciones para los usuarios.
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Artículo de Conocimiento</DialogTitle>
            </DialogHeader>
            <ArticleEditor
              isLoading={isPending}
              onSubmit={async (data) => {
                await createArticle(data);
                setOpenDialog(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          Error al cargar la base de conocimiento.
        </div>
      ) : !data?.data?.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          No hay artículos registrados aún.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
