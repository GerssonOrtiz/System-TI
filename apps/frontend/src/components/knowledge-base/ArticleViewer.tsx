import ReactMarkdown from 'react-markdown';
import { Calendar, Eye, Tag, User } from 'lucide-react';

import type { KnowledgeArticleDTO } from '@sistema-ti/shared';

import { Badge } from '@/components/ui/badge';

interface ArticleViewerProps {
  article: KnowledgeArticleDTO;
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  return (
    <article className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{article.category}</Badge>
          {!article.isPublished && (
            <Badge variant="outline" className="text-amber-600 border-amber-500">
              Borrador
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{article.author?.fullName ?? 'Autor'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(article.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{article.viewCount} vistas</span>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-[11px] font-normal">
                <Tag className="h-2.5 w-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
