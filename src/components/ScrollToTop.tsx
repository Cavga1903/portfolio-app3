import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ScrollToTop: React.FC = () => {
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

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
          aria-label={t('scrollToTop')}
          title={t('scrollToTop')}
        >
          <FaArrowUp className="text-xl group-hover:animate-bounce" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

