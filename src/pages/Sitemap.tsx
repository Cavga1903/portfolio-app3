/**
 * Sitemap Page
 * Generates and serves sitemap.xml
 */

import React, { useEffect, useState } from 'react';
import { generateSitemap } from '../features/blog/services/sitemapService';

const Sitemap: React.FC = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        setLoading(true);
        const xml = await generateSitemap();
        setSitemapXml(xml);
      } catch (err) {
        console.error('Error generating sitemap:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  // Set content type to XML
  useEffect(() => {
    if (sitemapXml) {
      // This will be handled by the server, but we can set it here for client-side rendering
      const metaContentType = document.querySelector('meta[http-equiv="Content-Type"]');
      if (!metaContentType) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Type');
        meta.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(meta);
      }
    }
  }, [sitemapXml]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Generating sitemap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  // Return XML content
  return (
    <pre className="whitespace-pre-wrap text-xs font-mono p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {sitemapXml}
    </pre>
  );
};

export default Sitemap;

