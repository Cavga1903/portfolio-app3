import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaBug } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ScrollToTopProps {
  onToggleDebugPanel?: () => void;
  showDebugPanel?: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ onToggleDebugPanel, showDebugPanel = false }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Yukarı scroll fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Firebase debug panelini aç/kapat
  const toggleDebugPanel = () => {
    if (onToggleDebugPanel) {
      onToggleDebugPanel();
    }
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          {/* LocalStorage Debug Panel Butonu - Sadece development modunda */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={toggleDebugPanel}
              className={`p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 group ${
                showDebugPanel 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
              }`}
              aria-label="LocalStorage Debug Panel"
              title="LocalStorage Debug Panel"
            >
              <FaBug className="text-xl group-hover:animate-pulse" />
            </button>
          )}
          
          {/* Yukarı Çık Butonu */}
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
            aria-label={t('scrollToTop')}
            title={t('scrollToTop')}
          >
            <FaArrowUp className="text-xl group-hover:animate-bounce" />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;

