import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export const useConversionTracking = () => {
  const { trackEvent } = useAnalytics();

  // Track CV downloads
  const trackCVDownload = (downloadType: 'footer_static' | 'dynamic_generated' | 'print') => {
    trackEvent('conversion', {
      conversion_type: 'cv_download',
      conversion_value: 1,
      download_type: downloadType,
      page_location: window.location.href,
      timestamp: Date.now(),
    });

    // Track as purchase event for better conversion tracking
    trackEvent('purchase', {
      transaction_id: `cv_download_${Date.now()}`,
      value: 1,
      currency: 'USD',
      items: [{
        item_id: 'cv_download',
        item_name: 'Tolga Cavga CV',
        category: 'Document',
        quantity: 1,
        price: 1,
      }],
      page_location: window.location.href,
    });
  };

  // Track contact form submissions
  const trackContactSubmission = (formData: { name: string; email: string; message: string }) => {
    trackEvent('conversion', {
      conversion_type: 'contact_form_submission',
      conversion_value: 5, // Higher value for contact
      form_data: {
        name_length: formData.name.length,
        email_domain: formData.email.split('@')[1] || 'unknown',
        message_length: formData.message.length,
        has_name: formData.name.length > 0,
        has_email: formData.email.length > 0,
        has_message: formData.message.length > 0,
      },
      page_location: window.location.href,
      timestamp: Date.now(),
    });

    // Track as lead generation
    trackEvent('generate_lead', {
      currency: 'USD',
      value: 5,
      page_location: window.location.href,
    });
  };

  // Track project interactions (high engagement)
  const trackProjectInteraction = (projectName: string, interactionType: 'github_click' | 'demo_click' | 'view') => {
    const conversionValue = interactionType === 'github_click' ? 3 : 
                           interactionType === 'demo_click' ? 4 : 1;

    trackEvent('conversion', {
      conversion_type: 'project_interaction',
      conversion_value: conversionValue,
      project_name: projectName,
      interaction_type: interactionType,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track social media clicks
  const trackSocialClick = (platform: string, action: string) => {
    trackEvent('conversion', {
      conversion_type: 'social_media_click',
      conversion_value: 2,
      social_platform: platform,
      social_action: action,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track Buy Me a Coffee clicks
  const trackBuyMeCoffeeClick = () => {
    trackEvent('conversion', {
      conversion_type: 'buy_me_coffee_click',
      conversion_value: 10, // Highest value
      page_location: window.location.href,
      timestamp: Date.now(),
    });

    // Track as purchase intent
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: 5, // Average coffee price
      page_location: window.location.href,
    });
  };

  // Track section engagement (time spent)
  const trackSectionEngagement = (sectionName: string, timeSpent: number) => {
    const conversionValue = Math.min(10, Math.round(timeSpent / 10)); // 1 point per 10 seconds, max 10

    trackEvent('conversion', {
      conversion_type: 'section_engagement',
      conversion_value: conversionValue,
      section_name: sectionName,
      time_spent: timeSpent,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track language changes (international interest)
  const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
    trackEvent('conversion', {
      conversion_type: 'language_change',
      conversion_value: 1,
      from_language: fromLanguage,
      to_language: toLanguage,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track scroll depth milestones
  const trackScrollMilestone = (depth: number) => {
    const conversionValue = Math.min(5, Math.round(depth / 20)); // 1 point per 20% scroll

    trackEvent('conversion', {
      conversion_type: 'scroll_milestone',
      conversion_value: conversionValue,
      scroll_depth: depth,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track carousel interactions
  const trackCarouselEngagement = (action: string, currentSlide: number, totalSlides: number) => {
    const conversionValue = action === 'swipe' ? 2 : 1;

    trackEvent('conversion', {
      conversion_type: 'carousel_engagement',
      conversion_value: conversionValue,
      carousel_action: action,
      current_slide: currentSlide,
      total_slides: totalSlides,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track form field completions
  const trackFormFieldCompletion = (fieldName: string, fieldType: string) => {
    trackEvent('conversion', {
      conversion_type: 'form_field_completion',
      conversion_value: 1,
      field_name: fieldName,
      field_type: fieldType,
      page_location: window.location.href,
      timestamp: Date.now(),
    });
  };

  // Track page time milestones
  const trackTimeMilestone = (timeSpent: number) => {
    const milestones = [30, 60, 120, 300, 600]; // 30s, 1m, 2m, 5m, 10m
    const milestone = milestones.find(m => timeSpent >= m && timeSpent < m * 2);
    
    if (milestone) {
      trackEvent('conversion', {
        conversion_type: 'time_milestone',
        conversion_value: Math.round(milestone / 30), // 1 point per 30 seconds
        time_spent: timeSpent,
        milestone: milestone,
        page_location: window.location.href,
        timestamp: Date.now(),
      });
    }
  };

  return {
    trackCVDownload,
    trackContactSubmission,
    trackProjectInteraction,
    trackSocialClick,
    trackBuyMeCoffeeClick,
    trackSectionEngagement,
    trackLanguageChange,
    trackScrollMilestone,
    trackCarouselEngagement,
    trackFormFieldCompletion,
    trackTimeMilestone,
  };
};
