import { useEffect } from 'react';

// Google Analytics 4 Event Types
export interface GA4Event {
  event_name: string;
  parameters?: {
    [key: string]: any;
  };
}

// Custom hook for Google Analytics tracking
export const useAnalytics = () => {
  // Initialize GA4 via GTM
  useEffect(() => {
    // GTM already loaded in index.html, just initialize gtag
    if (typeof window !== 'undefined' && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'GTM-PCSFVTLP');
    }
  }, []);

  // Track custom events
  const trackEvent = (eventName: string, parameters?: { [key: string]: any }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        event_category: 'Portfolio',
        event_label: window.location.pathname,
      });
    }
  };

  // Track page views
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  // Track section views (scroll depth)
  const trackSectionView = (sectionName: string, sectionPosition: number) => {
    trackEvent('section_view', {
      section_name: sectionName,
      section_position: sectionPosition,
      page_location: window.location.href,
    });
  };

  // Track clicks
  const trackClick = (elementName: string, elementType: string, elementValue?: string) => {
    trackEvent('click', {
      element_name: elementName,
      element_type: elementType,
      element_value: elementValue,
      page_location: window.location.href,
    });
  };

  // Track form interactions
  const trackFormInteraction = (formName: string, action: string, fieldName?: string) => {
    trackEvent('form_interaction', {
      form_name: formName,
      form_action: action,
      field_name: fieldName,
      page_location: window.location.href,
    });
  };

  // Track CV download
  const trackCVDownload = (downloadType: string) => {
    trackEvent('file_download', {
      file_name: 'Tolga_Cavga_CV.pdf',
      file_type: 'pdf',
      download_type: downloadType,
      page_location: window.location.href,
    });
  };

  // Track project clicks
  const trackProjectClick = (projectName: string, projectType: 'github' | 'demo', projectUrl: string) => {
    trackEvent('project_click', {
      project_name: projectName,
      project_type: projectType,
      project_url: projectUrl,
      page_location: window.location.href,
    });
  };

  // Track language changes
  const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
    trackEvent('language_change', {
      from_language: fromLanguage,
      to_language: toLanguage,
      page_location: window.location.href,
    });
  };

  // Track carousel interactions
  const trackCarouselInteraction = (action: string, currentSlide: number, totalSlides: number) => {
    trackEvent('carousel_interaction', {
      carousel_action: action,
      current_slide: currentSlide,
      total_slides: totalSlides,
      page_location: window.location.href,
    });
  };

  // Track scroll depth
  const trackScrollDepth = (depth: number) => {
    trackEvent('scroll_depth', {
      scroll_depth: depth,
      page_location: window.location.href,
    });
  };

  // Track time on page
  const trackTimeOnPage = (timeSpent: number, pageName: string) => {
    trackEvent('time_on_page', {
      time_spent: timeSpent,
      page_name: pageName,
      page_location: window.location.href,
    });
  };

  // Track social media clicks
  const trackSocialClick = (platform: string, action: string) => {
    trackEvent('social_click', {
      social_platform: platform,
      social_action: action,
      page_location: window.location.href,
    });
  };

  // Track contact form submission
  const trackContactSubmission = (formData: { name: string; email: string; message: string }) => {
    trackEvent('contact_form_submit', {
      form_name: 'contact_form',
      user_name: formData.name,
      user_email: formData.email,
      message_length: formData.message.length,
      page_location: window.location.href,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackSectionView,
    trackClick,
    trackFormInteraction,
    trackCVDownload,
    trackProjectClick,
    trackLanguageChange,
    trackCarouselInteraction,
    trackScrollDepth,
    trackTimeOnPage,
    trackSocialClick,
    trackContactSubmission,
  };
};

// Global types for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
