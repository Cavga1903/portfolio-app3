/**
 * SEO Head Component
 * Manages meta tags, Open Graph, and structured data for SEO
 */

import React, { useEffect } from 'react';
import { generateSEOTags, generateStructuredData } from '../features/blog/services/seoService';
import { BlogPost } from '../features/blog/types/blog.types';

interface SEOHeadProps {
  post?: BlogPost;
  title?: string;
  description?: string;
  image?: string;
  baseUrl?: string;
  // Legacy props for backward compatibility
  pageType?: string;
  url?: string;
  type?: string;
  imageWidth?: number;
  imageHeight?: number;
  twitterCreator?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  post,
  title: propTitle,
  description: propDescription,
  image: propImage,
  baseUrl = 'https://www.cavga.dev',
  // Legacy props
  pageType,
  url,
  type,
  imageWidth,
  imageHeight,
  twitterCreator,
}) => {
  useEffect(() => {
    // Use legacy props if provided, otherwise use new props
    const title = propTitle || (pageType ? `${pageType} - Cavga.dev` : undefined);
    const description = propDescription;
    const image = propImage;

    if (!post && !title) return;

    let seoData;
    if (post) {
      seoData = generateSEOTags(post, baseUrl);
    } else {
      seoData = {
        title: title || 'Cavga.dev - Portfolio & Blog',
        description: description || 'Modern web development portfolio and blog',
        keywords: [],
        ogImage: image,
        ogType: type || 'website',
        canonicalUrl: url || baseUrl,
      };
    }

    // Update document title
    document.title = seoData.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoData.description);
    if (seoData.keywords && seoData.keywords.length > 0) {
      updateMetaTag('keywords', seoData.keywords.join(', '));
    }

    // Open Graph tags
    updateMetaTag('og:title', seoData.title, 'property');
    updateMetaTag('og:description', seoData.description, 'property');
    updateMetaTag('og:type', seoData.ogType, 'property');
    if (seoData.ogImage) {
      updateMetaTag('og:image', seoData.ogImage, 'property');
    }
    if (seoData.canonicalUrl) {
      updateMetaTag('og:url', seoData.canonicalUrl, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    if (seoData.ogImage) {
      updateMetaTag('twitter:image', seoData.ogImage);
    }
    if (twitterCreator) {
      updateMetaTag('twitter:creator', twitterCreator);
    }
    if (imageWidth) {
      updateMetaTag('og:image:width', imageWidth.toString(), 'property');
    }
    if (imageHeight) {
      updateMetaTag('og:image:height', imageHeight.toString(), 'property');
    }

    // Article-specific tags
    if (seoData.ogType === 'article' && post) {
      if (seoData.articleAuthor) {
        updateMetaTag('article:author', seoData.articleAuthor, 'property');
      }
      if (seoData.articlePublishedTime) {
        updateMetaTag('article:published_time', seoData.articlePublishedTime, 'property');
      }
      if (seoData.articleModifiedTime) {
        updateMetaTag('article:modified_time', seoData.articleModifiedTime, 'property');
      }
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoData.canonicalUrl || baseUrl);

    // Structured data (JSON-LD)
    if (post) {
      const structuredData = generateStructuredData(post, baseUrl);
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [post, propTitle, propDescription, propImage, baseUrl, pageType, url, type, imageWidth, imageHeight, twitterCreator]);

  return null; // This component doesn't render anything
};
