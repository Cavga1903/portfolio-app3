import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCode, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type NavLink = {
  id: string;
  labelKey: string;
};

const navLinks: NavLink[] = [
  { id: "hero", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "technologies", labelKey: "nav.technologies" },
  { id: "projects", labelKey: "nav.projects" },
  { id: "contact", labelKey: "nav.contact" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLangMenu = () => setIsLangMenuOpen((prev) => !prev);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
  ];

  // i18n.language'i normalize et (en-US -> en)
  const normalizedLang = i18n.language.split('-')[0].toLowerCase();
  const currentLanguage = languages.find(lang => lang.code === normalizedLang) || languages[1]; // Fallback: English

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center text-2xl font-bold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
          >
            Tolga Çavga
            <FaCode className="text-3xl ml-2 align-middle group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
          </a>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-lg text-gray-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all duration-300 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                {t(link.labelKey)}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-700 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Side - Desktop Language + Mobile Controls */}
          <div className="flex items-center gap-3">
            {/* Desktop Language Selector */}
            <div className="hidden md:block relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaGlobe className="text-lg" />
                <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        i18n.language === lang.code ? 'bg-blue-50 dark:bg-gray-700' : ''
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span className="font-medium text-gray-800 dark:text-white">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile - Language & Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleLangMenu}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Change language"
              >
                <FaGlobe className="inline mr-1" />
                {currentLanguage.code.toUpperCase()}
              </button>
              
              <button
                onClick={toggleMenu}
                type="button"
                className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden mt-4 border-t border-gray-200 dark:border-gray-700 pt-4`}
          id="mobile-menu"
        >
          <ul className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="block px-4 py-3 text-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Language Menu */}
        {isLangMenuOpen && (
          <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 md:hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  i18n.language === lang.code ? 'bg-blue-50 dark:bg-gray-700' : ''
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                <span className="font-medium text-gray-800 dark:text-white">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
