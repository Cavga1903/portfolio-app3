import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useScrollTracking = () => {
  const { trackScrollDepth, trackSectionView } = useAnalytics();
  const scrollDepthRef = useRef<number[]>([]);
  const sectionViewsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // Track scroll depth milestones (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollDepthRef.current.includes(milestone)) {
          scrollDepthRef.current.push(milestone);
          trackScrollDepth(milestone);
        }
      });

      // Track section views
      const sections = [
        { id: 'hero', name: 'Hero Section' },
        { id: 'about', name: 'About Section' },
        { id: 'experience', name: 'Experience Section' },
        { id: 'certificates', name: 'Certificates Section' },
        { id: 'technologies', name: 'Technologies Section' },
        { id: 'services', name: 'Services Section' },
        { id: 'projects', name: 'Projects Section' },
        { id: 'contact', name: 'Contact Section' },
      ];

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && !sectionViewsRef.current.has(section.id)) {
            sectionViewsRef.current.add(section.id);
            trackSectionView(section.name, index + 1);
          }
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [trackScrollDepth, trackSectionView]);

  return {
    scrollDepthRef,
    sectionViewsRef,
  };
};
