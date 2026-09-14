import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useKbArticles, useKbArticle } from '@/hooks/useKnowledgeBase';
import { formatDate } from '@/lib/utils';

/** Vista de listado de artículos */
function ArticleList() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useKbArticles(search ? { search } : undefined);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder="Buscar en la base de conocimiento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label="Buscar artículos"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Cargando artículos...">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
          <h3 className="text-lg font-medium">
            {search ? 'No se encontraron artículos' : 'Base de conocimiento vacía'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? 'Intenta con otros términos de búsqueda'
              : 'El equipo de TI publicará artículos de ayuda pronto.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.data.map((article) => (
            <Card key={article.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  <Link
                    to={`/conocimiento/${article.slug}`}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{article.category}</Badge>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actualizado: <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/** Vista de detalle de un artículo */
function ArticleDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, isLoading } = useKbArticle(slug);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Cargando artículo...">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const article = data?.data;
  if (!article) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Artículo no encontrado</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/conocimiento">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver a la base de conocimiento
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link to="/conocimiento">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">{article.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{article.category}</Badge>
          <span>·</span>
          <time dateTime={article.updatedAt}>
            Actualizado: {formatDate(article.updatedAt)}
          </time>
          <span>·</span>
          <span>{article.viewCount} vista(s)</span>
        </div>
        {article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="prose prose-sm max-w-none pt-6">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </CardContent>
      </Card>
    </article>
  );
}

/** Página de Base de Conocimiento — muestra listado o detalle según la ruta */
export function BaseConocimientoPage() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ArticleDetail /> : <ArticleList />;
}
