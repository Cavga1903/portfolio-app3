import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export const useAdvancedClickTracking = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track button clicks with detailed context
    const trackButtonClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      
      // Check if it's a button or clickable element
      if (element.tagName === 'BUTTON' || 
          element.tagName === 'A' || 
          element.classList.contains('btn') ||
          element.classList.contains('cursor-pointer') ||
          element.getAttribute('role') === 'button') {
        
        const buttonInfo = {
          text_content: element.textContent?.trim().substring(0, 50) || '',
          class_name: element.className,
          id: element.id,
          href: element.getAttribute('href') || '',
          aria_label: element.getAttribute('aria-label') || '',
          button_type: element.getAttribute('type') || '',
          position: {
            x: e.clientX,
            y: e.clientY,
          },
          viewport_position: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          }
        };

        trackEvent('button_click', {
          button_info: buttonInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track form interactions
    const trackFormInteractions = (e: Event) => {
      const element = e.target as HTMLElement;
      
      if (element.tagName === 'INPUT' || 
          element.tagName === 'TEXTAREA' || 
          element.tagName === 'SELECT') {
        
        const formInfo = {
          field_type: element.tagName.toLowerCase(),
          input_type: element.getAttribute('type') || '',
          field_name: element.getAttribute('name') || '',
          field_id: element.id,
          field_class: element.className,
          placeholder: element.getAttribute('placeholder') || '',
          required: element.hasAttribute('required'),
          value_length: (element as HTMLInputElement).value?.length || 0,
        };

        trackEvent('form_field_interaction', {
          interaction_type: e.type,
          form_info: formInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track link clicks
    const trackLinkClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      const link = element.closest('a');
      
      if (link) {
        const linkInfo = {
          href: link.getAttribute('href') || '',
          text_content: link.textContent?.trim().substring(0, 100) || '',
          target: link.getAttribute('target') || '',
          rel: link.getAttribute('rel') || '',
          is_external: link.hostname !== window.location.hostname,
          is_download: link.hasAttribute('download'),
          position: {
            x: e.clientX,
            y: e.clientY,
          }
        };

        trackEvent('link_click', {
          link_info: linkInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track image clicks
    const trackImageClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      
      if (element.tagName === 'IMG') {
        const imgInfo = {
          src: element.getAttribute('src') || '',
          alt: element.getAttribute('alt') || '',
          width: element.getAttribute('width') || '',
          height: element.getAttribute('height') || '',
          class_name: element.className,
          position: {
            x: e.clientX,
            y: e.clientY,
          }
        };

        trackEvent('image_click', {
          image_info: imgInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track card/component clicks
    const trackComponentClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      
      // Check for common component classes
      const componentClasses = ['card', 'project-card', 'service-card', 'tech-card', 'certificate-card'];
      const isComponent = componentClasses.some(cls => element.classList.contains(cls));
      
      if (isComponent) {
        const componentInfo = {
          component_type: componentClasses.find(cls => element.classList.contains(cls)) || 'unknown',
          class_name: element.className,
          id: element.id,
          text_content: element.textContent?.trim().substring(0, 200) || '',
          position: {
            x: e.clientX,
            y: e.clientY,
          }
        };

        trackEvent('component_click', {
          component_info: componentInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track navigation clicks
    const trackNavigationClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      
      if (element.closest('nav') || 
          element.classList.contains('nav-link') ||
          element.getAttribute('href')?.startsWith('#')) {
        
        const navInfo = {
          nav_text: element.textContent?.trim() || '',
          nav_href: element.getAttribute('href') || '',
          nav_class: element.className,
          nav_id: element.id,
          is_anchor: element.getAttribute('href')?.startsWith('#'),
          position: {
            x: e.clientX,
            y: e.clientY,
          }
        };

        trackEvent('navigation_click', {
          nav_info: navInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Track social media clicks
    const trackSocialClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      const link = element.closest('a');
      
      if (link) {
        const href = link.getAttribute('href') || '';
        const socialPlatforms = ['github.com', 'linkedin.com', 'instagram.com', 'twitter.com', 'facebook.com'];
        const isSocial = socialPlatforms.some(platform => href.includes(platform));
        
        if (isSocial) {
          const socialInfo = {
            platform: socialPlatforms.find(platform => href.includes(platform)) || 'unknown',
            href: href,
            text_content: link.textContent?.trim() || '',
            position: {
              x: e.clientX,
              y: e.clientY,
            }
          };

          trackEvent('social_media_click', {
            social_info: socialInfo,
            page_location: window.location.href,
            timestamp: Date.now(),
          });
        }
      }
    };

    // Track download clicks
    const trackDownloadClicks = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      const link = element.closest('a');
      
      if (link && link.hasAttribute('download')) {
        const downloadInfo = {
          file_name: link.getAttribute('download') || '',
          file_href: link.getAttribute('href') || '',
          file_type: link.getAttribute('href')?.split('.').pop() || '',
          text_content: link.textContent?.trim() || '',
          position: {
            x: e.clientX,
            y: e.clientY,
          }
        };

        trackEvent('download_click', {
          download_info: downloadInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    // Add all event listeners
    document.addEventListener('click', trackButtonClicks);
    document.addEventListener('click', trackFormInteractions);
    document.addEventListener('click', trackLinkClicks);
    document.addEventListener('click', trackImageClicks);
    document.addEventListener('click', trackComponentClicks);
    document.addEventListener('click', trackNavigationClicks);
    document.addEventListener('click', trackSocialClicks);
    document.addEventListener('click', trackDownloadClicks);

    // Track form submissions
    const trackFormSubmissions = (e: Event) => {
      const form = e.target as HTMLFormElement;
      
      if (form.tagName === 'FORM') {
        const formInfo = {
          form_id: form.id,
          form_class: form.className,
          form_action: form.action,
          form_method: form.method,
          field_count: form.elements.length,
        };

        trackEvent('form_submission', {
          form_info: formInfo,
          page_location: window.location.href,
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener('submit', trackFormSubmissions);

    return () => {
      // Cleanup
      document.removeEventListener('click', trackButtonClicks);
      document.removeEventListener('click', trackFormInteractions);
      document.removeEventListener('click', trackLinkClicks);
      document.removeEventListener('click', trackImageClicks);
      document.removeEventListener('click', trackComponentClicks);
      document.removeEventListener('click', trackNavigationClicks);
      document.removeEventListener('click', trackSocialClicks);
      document.removeEventListener('click', trackDownloadClicks);
      document.removeEventListener('submit', trackFormSubmissions);
    };
  }, [trackEvent]);
};
