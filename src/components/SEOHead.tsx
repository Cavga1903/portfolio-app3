import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  // Yeni props - sayfa tipine göre otomatik meta etiketleri
  pageType?: 'home' | 'about' | 'projects' | 'technologies' | 'contact' | 'cv';
  // OG görsel boyutları
  imageWidth?: number;
  imageHeight?: number;
  // Twitter creator
  twitterCreator?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url = 'https://www.tolgacavga.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  pageType,
  imageWidth = 1200,
  imageHeight = 630,
  twitterCreator = '@tolgacavga'
}) => {
  const { t, i18n } = useTranslation();

  // Sayfa tipine göre otomatik meta etiketleri
  const getPageMeta = () => {
    if (!pageType) return { title, description, tags };
    
    const metaKey = `meta.${pageType}`;
    return {
      title: title || t(`${metaKey}.title`),
      description: description || t(`${metaKey}.description`),
      tags: tags || t(`${metaKey}.keywords`).split(', ')
    };
  };

  const pageMeta = getPageMeta();
  const finalTitle = pageMeta.title || 'Tolga Çavga - Frontend Developer';
  const finalDescription = pageMeta.description || 'Frontend Developer & React.js Specialist';
  const finalTags = useMemo(() => 
    pageMeta.tags || ['Frontend Developer', 'React', 'JavaScript', 'TypeScript'], 
    [pageMeta.tags]
  );
  const finalImage = image || `https://www.tolgacavga.com/og-images/og_image.png`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic Meta Tags
    updateMetaTag('description', finalDescription, true);
    updateMetaTag('keywords', finalTags.join(', '), true);
    updateMetaTag('author', 'Tolga Çavga', true);
    updateMetaTag('robots', 'index, follow', true);

    // Open Graph Meta Tags
    updateMetaTag('og:title', finalTitle);
    updateMetaTag('og:description', finalDescription);
    updateMetaTag('og:image', finalImage);
    updateMetaTag('og:image:width', imageWidth.toString());
    updateMetaTag('og:image:height', imageHeight.toString());
    updateMetaTag('og:image:alt', `${finalTitle} - Tolga Çavga Portfolio`);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', 'Tolga Çavga Portfolio');
    updateMetaTag('og:locale', 
      i18n.language === 'tr' ? 'tr_TR' : 
      i18n.language === 'de' ? 'de_DE' : 
      i18n.language === 'az' ? 'az_AZ' : 
      'en_US'
    );

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', finalTitle, true);
    updateMetaTag('twitter:description', finalDescription, true);
    updateMetaTag('twitter:image', finalImage, true);
    updateMetaTag('twitter:image:alt', `${finalTitle} - Tolga Çavga Portfolio`, true);
    updateMetaTag('twitter:creator', twitterCreator, true);
    updateMetaTag('twitter:site', twitterCreator, true);
    updateMetaTag('twitter:url', url, true);

    // Article Meta Tags (if type is article)
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime);
    }
    if (type === 'article' && modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime);
    }
    if (type === 'article' && finalTags) {
      finalTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      });
    }

    // Canonical URL
    updateLinkTag('canonical', url);

    // Alternate Language Links
    updateLinkTag('alternate', `${url}?lang=tr`);
    const altLinkEn = document.createElement('link');
    altLinkEn.rel = 'alternate';
    altLinkEn.hreflang = 'en';
    altLinkEn.href = `${url}?lang=en`;
    document.head.appendChild(altLinkEn);

    const altLinkDe = document.createElement('link');
    altLinkDe.rel = 'alternate';
    altLinkDe.hreflang = 'de';
    altLinkDe.href = `${url}?lang=de`;
    document.head.appendChild(altLinkDe);

  }, [finalTitle, finalDescription, finalImage, finalTags, url, type, publishedTime, modifiedTime, i18n.language, imageWidth, imageHeight, twitterCreator]);

  // JSON-LD Structured Data
  useEffect(() => {
    const removeExistingScript = (id: string) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };

    // Person Schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Tolga Çavga",
      "url": "https://www.tolgacavga.com",
      "image": "https://www.tolgacavga.com/profile.jpg",
      "jobTitle": "Frontend Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "sameAs": [
        "https://github.com/Cavga1903",
        "https://www.linkedin.com/in/tolgaacavgaa",
        "https://www.instagram.com/codewithcavga"
      ],
      "knowsAbout": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Frontend Development"],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Berufskolleg Volksgartenstraße"
      }
    };

    // Website Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tolga Çavga Portfolio",
      "url": "https://www.tolgacavga.com",
      "description": finalDescription,
      "author": {
        "@type": "Person",
        "name": "Tolga Çavga"
      },
      "inLanguage": ["tr", "en", "de"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.tolgacavga.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Professional Service Schema
    const professionalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Tolga Çavga - Frontend Development Services",
      "url": "https://www.tolgacavga.com",
      "logo": "https://www.tolgacavga.com/logo.png",
      "image": finalImage,
      "description": "Professional frontend development services specializing in React.js, TypeScript, and modern web applications.",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "addressCountry": "DE"
      },
      "sameAs": [
        "https://github.com/Cavga1903",
        "https://www.linkedin.com/in/tolgaacavgaa"
      ]
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.tolgacavga.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Portfolio",
          "item": "https://www.tolgacavga.com#projects"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "About",
          "item": "https://www.tolgacavga.com#about"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact",
          "item": "https://www.tolgacavga.com#contact"
        }
      ]
    };

    // Insert schemas
    removeExistingScript('person-schema');
    const personScript = document.createElement('script');
    personScript.id = 'person-schema';
    personScript.type = 'application/ld+json';
    personScript.textContent = JSON.stringify(personSchema);
    document.head.appendChild(personScript);

    removeExistingScript('website-schema');
    const websiteScript = document.createElement('script');
    websiteScript.id = 'website-schema';
    websiteScript.type = 'application/ld+json';
    websiteScript.textContent = JSON.stringify(websiteSchema);
    document.head.appendChild(websiteScript);

    removeExistingScript('professional-schema');
    const professionalScript = document.createElement('script');
    professionalScript.id = 'professional-schema';
    professionalScript.type = 'application/ld+json';
    professionalScript.textContent = JSON.stringify(professionalServiceSchema);
    document.head.appendChild(professionalScript);

    removeExistingScript('breadcrumb-schema');
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'breadcrumb-schema';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

  }, [finalDescription, finalImage]);

  return null; // This component doesn't render anything
};

export default SEOHead;

