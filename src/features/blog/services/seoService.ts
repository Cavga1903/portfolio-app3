/**
 * SEO Service
 * Handles SEO-related operations for blog posts
 */

import { BlogPost } from '../types/blog.types';

/**
 * Generate meta description from content
 * @param content - Blog post content (HTML)
 * @param maxLength - Maximum length for meta description (default: 160)
 * @returns Generated meta description
 */
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (!content) return '';

  // Remove HTML tags
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[#*_`[\]()]/g, '') // Remove markdown syntax
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (textContent.length <= maxLength) {
    return textContent;
  }

  // Truncate at word boundary
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

/**
 * Generate SEO tags for a blog post
 */
export interface SEOTags {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType: string;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  canonicalUrl?: string;
}

export const generateSEOTags = (post: BlogPost, baseUrl: string = 'https://www.cavga.dev'): SEOTags => {
  const metaDescription = post.metaDescription || generateMetaDescription(post.content || post.excerpt);
  const keywords = post.tags || [];
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description: metaDescription,
    keywords,
    ogImage: post.image,
    ogType: 'article',
    articleAuthor: post.author.name,
    articlePublishedTime: post.publishedAt,
    articleModifiedTime: post.updatedAt,
    canonicalUrl,
  };
};

/**
 * Extract keywords from content (simple implementation)
 * For production, consider using a more sophisticated keyword extraction service
 */
export const extractKeywords = (content: string, maxKeywords: number = 10): string[] => {
  if (!content) return [];

  // Remove HTML tags
  const textContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, ' ')
    .toLowerCase();

  // Common stop words (Turkish and English)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'bu', 'şu', 'o', 've', 'ile', 'için', 'gibi', 'kadar', 'daha', 'en', 'bir', 'de', 'da',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  ]);

  // Extract words
  const words = textContent
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Generate structured data (JSON-LD) for a blog post
 */
export const generateStructuredData = (post: BlogPost, baseUrl: string = 'https://www.cavga.dev') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || generateMetaDescription(post.content),
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.avatar && { image: post.author.avatar }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cavga.dev',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };
};

