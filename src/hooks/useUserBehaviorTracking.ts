import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useUserBehaviorTracking = () => {
  const { trackEvent } = useAnalytics();
  const mousePositionRef = useRef<{ x: number; y: number; timestamp: number }[]>([]);
  const keystrokesRef = useRef<number>(0);
  const clicksRef = useRef<number>(0);
  const scrollEventsRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    // Track mouse movement patterns
    const trackMouseMovement = (e: MouseEvent) => {
      mousePositionRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep only last 50 positions to avoid memory issues
      if (mousePositionRef.current.length > 50) {
        mousePositionRef.current = mousePositionRef.current.slice(-50);
      }

      // Track mouse movement every 5 seconds
      if (mousePositionRef.current.length % 10 === 0) {
        const recentPositions = mousePositionRef.current.slice(-10);
        const totalDistance = recentPositions.reduce((total, pos, index) => {
          if (index === 0) return 0;
          const prev = recentPositions[index - 1];
          const distance = Math.sqrt(
            Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2)
          );
          return total + distance;
        }, 0);

        trackEvent('mouse_movement', {
          total_distance: Math.round(totalDistance),
          movement_speed: Math.round(totalDistance / 5), // pixels per second
          page_location: window.location.href,
        });
      }
    };

    // Track click patterns
    const trackClickPattern = (e: MouseEvent) => {
      clicksRef.current += 1;
      
      const element = e.target as HTMLElement;
      const elementInfo = {
        tag_name: element.tagName,
        class_name: element.className,
        id: element.id,
        text_content: element.textContent?.substring(0, 100) || '',
        x: e.clientX,
        y: e.clientY,
      };

      trackEvent('click_pattern', {
        click_count: clicksRef.current,
        element_info: elementInfo,
        page_location: window.location.href,
      });
    };

    // Track keyboard activity
    const trackKeyboardActivity = (e: KeyboardEvent) => {
      keystrokesRef.current += 1;
      
      // Track every 10 keystrokes
      if (keystrokesRef.current % 10 === 0) {
        trackEvent('keyboard_activity', {
          keystroke_count: keystrokesRef.current,
          key_pressed: e.key,
          page_location: window.location.href,
        });
      }
    };

    // Track scroll behavior
    const trackScrollBehavior = () => {
      scrollEventsRef.current += 1;
      
      const scrollInfo = {
        scroll_y: window.scrollY,
        scroll_x: window.scrollX,
        document_height: document.documentElement.scrollHeight,
        viewport_height: window.innerHeight,
        scroll_percentage: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
      };

      trackEvent('scroll_behavior', {
        scroll_event_count: scrollEventsRef.current,
        scroll_info: scrollInfo,
        page_location: window.location.href,
      });
    };

    // Track focus and blur events
    const trackFocusEvents = () => {
      trackEvent('page_focus', {
        page_location: window.location.href,
      });
    };

    const trackBlurEvents = () => {
      const timeOnPage = Date.now() - sessionStartRef.current;
      trackEvent('page_blur', {
        time_on_page: Math.round(timeOnPage / 1000), // seconds
        page_location: window.location.href,
      });
    };

    // Track idle time
    let idleTimer: NodeJS.Timeout;
    const trackIdleTime = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        trackEvent('user_idle', {
          idle_duration: 30, // 30 seconds
          page_location: window.location.href,
        });
      }, 30000); // 30 seconds idle
    };

    // Track session duration
    const trackSessionDuration = () => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      trackEvent('session_duration', {
        duration_seconds: Math.round(sessionDuration / 1000),
        page_location: window.location.href,
      });
    };

    // Track user engagement score
    const trackEngagementScore = () => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      const engagementScore = Math.min(100, Math.round(
        (clicksRef.current * 5) + 
        (keystrokesRef.current * 2) + 
        (scrollEventsRef.current * 3) + 
        (sessionDuration / 1000 / 10) // 1 point per 10 seconds
      ));

      trackEvent('engagement_score', {
        score: engagementScore,
        clicks: clicksRef.current,
        keystrokes: keystrokesRef.current,
        scroll_events: scrollEventsRef.current,
        session_duration: Math.round(sessionDuration / 1000),
        page_location: window.location.href,
      });
    };

    // Track page visibility changes
    const trackVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('page_hidden', {
          page_location: window.location.href,
        });
      } else {
        trackEvent('page_visible', {
          page_location: window.location.href,
        });
      }
    };

    // Track resize events
    const trackResize = () => {
      trackEvent('window_resize', {
        new_width: window.innerWidth,
        new_height: window.innerHeight,
        page_location: window.location.href,
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', trackMouseMovement, { passive: true });
    document.addEventListener('click', trackClickPattern);
    document.addEventListener('keydown', trackKeyboardActivity);
    window.addEventListener('scroll', trackScrollBehavior, { passive: true });
    window.addEventListener('focus', trackFocusEvents);
    window.addEventListener('blur', trackBlurEvents);
    document.addEventListener('mousemove', trackIdleTime);
    document.addEventListener('keydown', trackIdleTime);
    document.addEventListener('click', trackIdleTime);
    document.addEventListener('visibilitychange', trackVisibilityChange);
    window.addEventListener('resize', trackResize);

    // Track engagement every 30 seconds
    const engagementInterval = setInterval(trackEngagementScore, 30000);

    // Track session duration on page unload
    const handleBeforeUnload = () => {
      trackSessionDuration();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      document.removeEventListener('mousemove', trackMouseMovement);
      document.removeEventListener('click', trackClickPattern);
      document.removeEventListener('keydown', trackKeyboardActivity);
      window.removeEventListener('scroll', trackScrollBehavior);
      window.removeEventListener('focus', trackFocusEvents);
      window.removeEventListener('blur', trackBlurEvents);
      document.removeEventListener('mousemove', trackIdleTime);
      document.removeEventListener('keydown', trackIdleTime);
      document.removeEventListener('click', trackIdleTime);
      document.removeEventListener('visibilitychange', trackVisibilityChange);
      window.removeEventListener('resize', trackResize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(engagementInterval);
      clearTimeout(idleTimer);
    };
  }, [trackEvent]);
};
