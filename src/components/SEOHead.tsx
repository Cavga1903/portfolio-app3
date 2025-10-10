import React, { useEffect } from 'react';
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
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Tolga Çavga - Frontend Developer | React.js Specialist',
  description = 'Frontend Developer & React.js Specialist. Modern, kullanıcı dostu web uygulamaları geliştiriyorum. HTML, CSS, JavaScript, React, TypeScript.',
  image = 'https://www.tolgacavga.com/og-image.jpg',
  url = 'https://www.tolgacavga.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = ['Frontend Developer', 'React', 'JavaScript', 'TypeScript', 'Web Development']
}) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update document title
    document.title = title;

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
    updateMetaTag('description', description, true);
    updateMetaTag('keywords', tags.join(', '), true);
    updateMetaTag('author', 'Tolga Çavga', true);
    updateMetaTag('robots', 'index, follow', true);

    // Open Graph Meta Tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', 'Tolga Çavga Portfolio');
    updateMetaTag('og:locale', i18n.language === 'tr' ? 'tr_TR' : i18n.language === 'de' ? 'de_DE' : 'en_US');

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:creator', '@tolgacavga', true);
    updateMetaTag('twitter:site', '@tolgacavga', true);
    updateMetaTag('twitter:url', url, true);

    // Article Meta Tags (if type is article)
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime);
    }
    if (type === 'article' && modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime);
    }
    if (type === 'article') {
      tags.forEach(tag => {
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

  }, [title, description, image, url, type, publishedTime, modifiedTime, tags, i18n.language]);

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
      "description": description,
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
      "image": image,
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

  }, [description, image]);

  return null; // This component doesn't render anything
};

export default SEOHead;

