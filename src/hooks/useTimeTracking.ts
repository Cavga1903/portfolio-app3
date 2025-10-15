import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTimeTracking = (pageName: string) => {
  const { trackTimeOnPage } = useAnalytics();
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Track time every 30 seconds
    intervalRef.current = setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnPage(timeSpent, pageName);
    }, 30000); // 30 seconds

    // Track time on page unload
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnPage(timeSpent, pageName);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Final time tracking
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnPage(timeSpent, pageName);
    };
  }, [pageName, trackTimeOnPage]);

  return {
    startTime: startTimeRef.current,
  };
};
