import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-8 flex flex-col items-center justify-center border-t border-gray-300 dark:border-gray-700">
      {/* Sosyal Medya İkonları */}
      <div className="flex gap-6 mb-4">
        <a
          href="https://github.com/Cavga1903"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full group relative"
          aria-label="GitHub"
          title="GitHub - @Cavga1903"
        >
          <FaGithub className="group-hover:rotate-12 transition-transform duration-300" />
        </a>
        <a
          href="https://www.linkedin.com/in/tolgaacavgaa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-700 dark:text-gray-300 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 rounded-full group"
          aria-label="LinkedIn"
          title="LinkedIn - @tolgaacavgaa"
        >
          <FaLinkedin className="group-hover:rotate-12 transition-transform duration-300" />
        </a>
        <a
          href="https://www.instagram.com/codewithcavga"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-700 dark:text-gray-300 hover:text-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:bg-clip-text hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full group relative"
          aria-label="Instagram"
          title="Instagram - @codewithcavga"
        >
          <FaInstagram className="group-hover:rotate-12 transition-transform duration-300" />
        </a>
        <a
          href="mailto:cavgaa228@gmail.com"
          className="text-2xl text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full group"
          aria-label="Email"
          title="Email - cavgaa228@gmail.com"
        >
          <FaEnvelope className="group-hover:rotate-12 transition-transform duration-300" />
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