import React, { useState, useEffect } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const totalScrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = (scrollTop / totalScrollableHeight) * 100;
      
      setScrollProgress(scrollPercentage);
    };

    // Initial calculation
    calculateScrollProgress();

    // Add scroll event listener
    window.addEventListener('scroll', calculateScrollProgress);

    // Cleanup
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-out shadow-lg shadow-blue-500/50"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Glow effect */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default ScrollProgress;

