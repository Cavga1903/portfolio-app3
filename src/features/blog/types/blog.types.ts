export interface BlogPostTranslation {
  title: string;
  content: string;
  excerpt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  // Translations for different languages (e.g., { en: {...}, tr: {...}, de: {...} })
  translations?: Record<string, BlogPostTranslation>;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category?: string;
  image?: string;
  views?: number;
  likes?: number;
  isPublished: boolean;
  isBookmarked?: boolean;
  isFavorited?: boolean;
  isArchived?: boolean;
  // SEO fields
  metaDescription?: string;
  seoTitle?: string;
  seoKeywords?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

