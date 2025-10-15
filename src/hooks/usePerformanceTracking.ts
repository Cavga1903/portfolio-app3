import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export const usePerformanceTracking = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
          const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
          
          trackEvent('page_performance', {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(domContentLoaded),
            first_paint: Math.round(firstPaint),
            first_contentful_paint: Math.round(firstContentfulPaint),
            page_location: window.location.href,
          });
        }
      }
    };

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          trackEvent('core_web_vitals', {
            metric_name: 'LCP',
            metric_value: Math.round(lastEntry.startTime),
            page_location: window.location.href,
          });
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            trackEvent('core_web_vitals', {
              metric_name: 'FID',
              metric_value: Math.round(entry.processingStart - entry.startTime),
              page_location: window.location.href,
            });
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // FID not supported
        }

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          trackEvent('core_web_vitals', {
            metric_name: 'CLS',
            metric_value: Math.round(clsValue * 1000) / 1000,
            page_location: window.location.href,
          });
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // CLS not supported
        }
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.initiatorType === 'script' || entry.initiatorType === 'link') {
              trackEvent('resource_performance', {
                resource_type: entry.initiatorType,
                resource_name: entry.name,
                load_time: Math.round(entry.duration),
                transfer_size: entry.transferSize || 0,
                page_location: window.location.href,
              });
            }
          });
        });
        
        try {
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
          // Resource observer not supported
        }
      }
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        trackEvent('memory_usage', {
          used_js_heap_size: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          total_js_heap_size: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
          js_heap_size_limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
          page_location: window.location.href,
        });
      }
    };

    // Track network information
    const trackNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        trackEvent('network_info', {
          effective_type: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          save_data: connection.saveData || false,
          page_location: window.location.href,
        });
      }
    };

    // Track device information
    const trackDeviceInfo = () => {
      trackEvent('device_info', {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen_width: screen.width,
        screen_height: screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        device_pixel_ratio: window.devicePixelRatio || 1,
        page_location: window.location.href,
      });
    };

    // Initialize all tracking
    const initTracking = () => {
      trackPageLoad();
      trackCoreWebVitals();
      trackResourcePerformance();
      trackMemoryUsage();
      trackNetworkInfo();
      trackDeviceInfo();
    };

    // Run immediately and after page load
    initTracking();
    window.addEventListener('load', initTracking);

    return () => {
      window.removeEventListener('load', initTracking);
    };
  }, [trackEvent]);
};
