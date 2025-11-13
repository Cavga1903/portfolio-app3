/**
 * Sitemap Service
 * Generates sitemap.xml for blog posts
 */

import { blogService } from './blogService';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate sitemap.xml content
 * @param baseUrl - Base URL of the website (default: https://www.cavga.dev)
 * @returns Sitemap XML string
 */
export const generateSitemap = async (baseUrl: string = 'https://www.cavga.dev'): Promise<string> => {
  try {
    // Get all published posts
    const posts = await blogService.getPosts('en'); // Use default language
    
    // Generate URLs for blog posts
    const postUrls: SitemapUrl[] = posts
      .filter(post => post.isPublished)
      .map(post => ({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updatedAt || post.publishedAt,
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));

    // Static pages
    const staticUrls: SitemapUrl[] = [
      {
        loc: baseUrl,
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/blog`,
        changefreq: 'daily',
        priority: 0.9,
      },
    ];

    // Combine all URLs
    const allUrls = [...staticUrls, ...postUrls];

    // Generate XML
    const urlsXml = allUrls
      .map(url => {
        let xml = `    <url>\n      <loc>${escapeXml(url.loc)}</loc>`;
        
        if (url.lastmod) {
          xml += `\n      <lastmod>${formatDate(url.lastmod)}</lastmod>`;
        }
        
        if (url.changefreq) {
          xml += `\n      <changefreq>${url.changefreq}</changefreq>`;
        }
        
        if (url.priority !== undefined) {
          xml += `\n      <priority>${url.priority}</priority>`;
        }
        
        xml += '\n    </url>';
        return xml;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

/**
 * Escape XML special characters
 */
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Format date for sitemap (ISO 8601 format)
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

