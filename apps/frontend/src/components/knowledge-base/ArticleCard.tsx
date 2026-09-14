import { BookOpen, Eye, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { KBArticleResponse } from '@sistema-ti/shared';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticleCardProps {
  article: KBArticleResponse;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            {article.category}
          </Badge>
          {!article.isPublished && (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Borrador
            </Badge>
          )}
        </div>
        <CardTitle className="text-base leading-tight hover:text-primary">
          <Link to={`/solicitante/base-conocimiento/${article.slug}`}>{article.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-3">
          {article.content.replace(/[#*`_~]/g, '').slice(0, 140)}...
        </p>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                <Tag className="h-2.5 w-2.5 mr-0.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 mt-2">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{article.author?.fullName ?? 'Autor'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{article.viewCount} vistas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
