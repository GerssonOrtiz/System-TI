import { prisma } from '../../config/database';

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  category: true,
  tags: true,
  isPublished: true,
  authorId: true,
  author: { select: { id: true, fullName: true } },
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} as const;

const articleListSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  category: true,
  tags: true,
  isPublished: true,
  authorId: true,
  author: { select: { id: true, fullName: true } },
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface KbFilters {
  category?: string;
  search?: string;
  isPublished?: boolean; // undefined = todos (admin), true = solo publicados (solicitante)
}

export const kbRepository = {
  async findAll(filters: KbFilters, page: number, pageSize: number) {
    const where = {
      ...(filters.isPublished !== undefined && { isPublished: filters.isPublished }),
      ...(filters.category && { category: filters.category }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' as const } },
          { category: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [articles, total] = await prisma.$transaction([
      prisma.knowledgeArticle.findMany({
        where,
        select: articleListSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.knowledgeArticle.count({ where }),
    ]);

    return { articles, total };
  },

  async findBySlug(slug: string) {
    return prisma.knowledgeArticle.findUnique({
      where: { slug },
      select: articleSelect,
    });
  },

  async findById(id: string) {
    return prisma.knowledgeArticle.findUnique({
      where: { id },
      select: articleSelect,
    });
  },

  async create(data: {
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    isPublished: boolean;
    authorId: string;
  }) {
    return prisma.knowledgeArticle.create({
      data,
      select: articleSelect,
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      category?: string;
      tags?: string[];
    },
  ) {
    return prisma.knowledgeArticle.update({
      where: { id },
      data,
      select: articleSelect,
    });
  },

  async togglePublish(id: string, isPublished: boolean) {
    return prisma.knowledgeArticle.update({
      where: { id },
      data: { isPublished },
      select: articleSelect,
    });
  },

  async incrementViewCount(id: string) {
    return prisma.knowledgeArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true },
    });
  },

  async existsBySlug(slug: string) {
    return prisma.knowledgeArticle.findUnique({
      where: { slug },
      select: { id: true },
    });
  },
};
