import { useEffect, useRef } from 'react';

export const useLumosCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'lumos-cursor';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.display = 'block';
        cursorRef.current.style.left = `${e.clientX - 10}px`;
        cursorRef.current.style.top = `${e.clientY - 10}px`;
      }

      // Create trail effect
      if (Math.random() > 0.7) { // 30% chance to create trail
        const trail = document.createElement('div');
        trail.className = 'lumos-trail';
        trail.style.left = `${e.clientX - 3}px`;
        trail.style.top = `${e.clientY - 3}px`;
        document.body.appendChild(trail);
        trailRefs.current.push(trail);

        // Remove trail after animation
        setTimeout(() => {
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
          trailRefs.current = trailRefs.current.filter(t => t !== trail);
        }, 500);
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.display = 'none';
      }
    };

    // Mouse enter handler
    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.display = 'block';
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      if (cursorRef.current && cursorRef.current.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
      }
      
      // Clean up trails
      trailRefs.current.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
      trailRefs.current = [];
    };
  }, []);

  return cursorRef;
};
