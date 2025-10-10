import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-8 flex flex-col items-center justify-center border-t border-gray-300 dark:border-gray-700">
      {/* Sosyal Medya İkonları */}
      <div className="flex gap-6 mb-4">
        <a
          href="https://github.com/tolgacavgaa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/tolgaacavgaa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="mailto:cavgaa228@gmail.com"
          className="text-2xl hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label="Email"
        >
          <FaEnvelope />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Tolga Çavga. {t('footer.rights')}
      </p>
      
      {/* Alt Başlık */}
      <p className="text-center text-xs mt-1 flex items-center justify-center gap-1">
        {t('footer.madeWith')} <FaHeart className="text-red-500 animate-pulse" /> {t('footer.by')}
      </p>
    </footer>
  );
};

export default Footer;