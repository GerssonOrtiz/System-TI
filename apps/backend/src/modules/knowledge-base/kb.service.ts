import { AuditAction, AuditEntity, PAGINATION, Role } from '@sistema-ti/shared';
import type { CreateKbArticleInput, KbFiltersInput, UpdateKbArticleInput } from '@sistema-ti/shared';

import { ApiError } from '../../shared/utils/ApiError';
import { auditService } from '../audit/audit.service';

import { kbRepository } from './kb.repository';

/** Genera un slug URL-friendly a partir de un título */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const kbService = {
  async listArticles(requestingUserRole: Role, filters: KbFiltersInput) {
    const page = filters.page ?? PAGINATION.DEFAULT_PAGE;
    const pageSize = Math.min(filters.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);

    // Solicitante solo ve artículos publicados; Admin ve todos
    const isPublished = requestingUserRole === Role.SOLICITANTE ? true : undefined;

    const { articles, total } = await kbRepository.findAll(
      { category: filters.category, search: filters.search, isPublished },
      page,
      pageSize,
    );

    return {
      data: articles,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async getBySlug(slug: string, requestingUserRole: Role) {
    const article = await kbRepository.findBySlug(slug);

    if (!article) {
      throw ApiError.notFound('KB_ARTICLE_NOT_FOUND', 'Artículo no encontrado');
    }

    // Solicitante solo puede ver artículos publicados
    if (requestingUserRole === Role.SOLICITANTE && !article.isPublished) {
      throw ApiError.notFound('KB_ARTICLE_NOT_FOUND', 'Artículo no encontrado');
    }

    // Incrementar contador de vistas en segundo plano (no bloqueante)
    void kbRepository.incrementViewCount(article.id);

    return article;
  },

  async createArticle(input: CreateKbArticleInput, authorId: string) {
    let slug = generateSlug(input.title);

    // Asegurar unicidad del slug
    const existing = await kbRepository.existsBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const article = await kbRepository.create({
      title: input.title,
      slug,
      content: input.content,
      category: input.category,
      tags: input.tags ?? [],
      isPublished: input.isPublished ?? false,
      authorId,
    });

    await auditService.logAction({
      action: AuditAction.CREATE,
      entity: AuditEntity.KB_ARTICLE,
      entityId: article.id,
      userId: authorId,
      metadata: { title: article.title, isPublished: article.isPublished },
    });

    return article;
  },

  async updateArticle(id: string, input: UpdateKbArticleInput, userId: string) {
    const article = await kbRepository.findById(id);
    if (!article) {
      throw ApiError.notFound('KB_ARTICLE_NOT_FOUND', 'Artículo no encontrado');
    }

    const updated = await kbRepository.update(id, {
      title: input.title,
      content: input.content,
      category: input.category,
      tags: input.tags,
    });

    await auditService.logAction({
      action: AuditAction.UPDATE,
      entity: AuditEntity.KB_ARTICLE,
      entityId: id,
      userId,
      metadata: { changes: input },
    });

    return updated;
  },

  async togglePublish(id: string, publish: boolean, userId: string) {
    const article = await kbRepository.findById(id);
    if (!article) {
      throw ApiError.notFound('KB_ARTICLE_NOT_FOUND', 'Artículo no encontrado');
    }

    const updated = await kbRepository.togglePublish(id, publish);

    await auditService.logAction({
      action: AuditAction.UPDATE,
      entity: AuditEntity.KB_ARTICLE,
      entityId: id,
      userId,
      metadata: { action: publish ? 'publicado' : 'despublicado' },
    });

    return updated;
  },
};
