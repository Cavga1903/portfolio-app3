import { useEffect, useRef } from 'react';

export const useMouseGlow = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create glow element
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    glow.style.display = 'none';
    document.body.appendChild(glow);
    glowRef.current = glow;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.display = 'block';
        glowRef.current.style.left = `${e.clientX - 20}px`;
        glowRef.current.style.top = `${e.clientY - 20}px`;
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.display = 'none';
      }
    };

    // Mouse enter handler
    const handleMouseEnter = () => {
      if (glowRef.current) {
        glowRef.current.style.display = 'block';
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
      
      if (glowRef.current && glowRef.current.parentNode) {
        glowRef.current.parentNode.removeChild(glowRef.current);
      }
    };
  }, []);

  return glowRef;
};
