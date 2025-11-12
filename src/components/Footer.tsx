import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaHeart, FaInstagram, FaCoffee, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { trackSocialClick, trackCVDownload, trackClick, trackLanguageChange } = useAnalytics();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "az", name: "Azərbaycan Türkcəsi", flag: "🇦🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const normalizedLang = i18n.language.split("-")[0].toLowerCase();
  const currentLanguage =
    languages.find((lang) => lang.code === normalizedLang) || languages[2]; // Fallback: English

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'tr': '🇹🇷',
      'de': '🇩🇪',
      'az': '🇦🇿'
    };
    return flags[code] || '🌐';
  };

  const changeLanguage = (lng: string) => {
    const currentLang = i18n.language.split("-")[0];
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    trackLanguageChange(currentLang, lng);
  };
  
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
          className="text-2xl text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-500 hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full group relative"
          aria-label="Instagram"  
          onClick={() => trackSocialClick('instagram', 'profile_click')}
        >
          <FaInstagram className="group-hover:rotate-12 transition-transform duration-300" />
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

      {/* Language Selector */}
      <div className="mt-4 relative">
        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Change language"
        >
          <span className="text-lg">{getLanguageFlag(currentLanguage.code)}</span>
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </button>

        {isLangMenuOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  i18n.language === lang.code || normalizedLang === lang.code
                    ? "bg-blue-50 dark:bg-gray-700"
                    : ""
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                <span className="text-lg">{getLanguageFlag(lang.code)}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;