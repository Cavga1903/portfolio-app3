import React from 'react';
import { FaGithub, FaLinkedin, FaHeart, FaInstagram, FaCoffee, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { trackSocialClick, trackCVDownload, trackClick } = useAnalytics();
  
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
          onClick={() => trackSocialClick('github', 'profile_click')}
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
          onClick={() => trackSocialClick('linkedin', 'profile_click')}
        >
          <FaLinkedin className="group-hover:rotate-12 transition-transform duration-300" />
        </a>
        <a
          href="https://www.instagram.com/codewithcavga"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full group relative"
          aria-label="Instagram"
          title="Instagram - @codewithcavga"
          onClick={() => trackSocialClick('instagram', 'profile_click')}
        >
          <FaInstagram className="group-hover:rotate-12 transition-all duration-300 text-white group-hover:text-pink-500" />
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6">
        {/* Download CV Button */}
        <a
          href="/Tolga_Cavga_CV.pdf"
          download="Tolga_Cavga_CV.pdf"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          onClick={() => trackCVDownload('footer_static')}
        >
          <FaDownload className="text-xl group-hover:translate-y-1 transition-transform duration-300" />
          <span>{t('footer.downloadCV')}</span>
        </a>

        {/* Buy Me a Coffee Button */}
        <a
          href="https://buymeacoffee.com/cavga228"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          onClick={() => trackClick('buy_me_coffee', 'external_link', 'https://buymeacoffee.com/cavga228')}
        >
          <FaCoffee className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          <span>{t('footer.buyMeACoffee')}</span>
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