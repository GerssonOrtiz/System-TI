import type {
  PaginatedResponse,
  KnowledgeArticleDTO,
  CreateKbArticleInput,
  KbFiltersInput,
  UpdateKbArticleInput,
} from '@sistema-ti/shared';

import { axiosClient } from './axiosClient';

type ArticlesResponse = { success: true; data: KnowledgeArticleDTO[]; meta: PaginatedResponse<KnowledgeArticleDTO>['meta'] };
type ArticleResponse = { success: true; data: KnowledgeArticleDTO };

export const kbApi = {
  list: (params?: Partial<KbFiltersInput>) =>
    axiosClient.get<ArticlesResponse>('/kb', { params }),

  getBySlug: (slug: string) =>
    axiosClient.get<ArticleResponse>(`/kb/${slug}`),

  create: (data: CreateKbArticleInput) =>
    axiosClient.post<ArticleResponse>('/kb', data),

  update: (id: string, data: UpdateKbArticleInput) =>
    axiosClient.patch<ArticleResponse>(`/kb/${id}`, data),

  publish: (id: string) =>
    axiosClient.patch<ArticleResponse>(`/kb/${id}/publish`),

  unpublish: (id: string) =>
    axiosClient.patch<ArticleResponse>(`/kb/${id}/unpublish`),
};
