import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGlobe, FaGithub, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "../hooks/useAnalytics";

type NavLink = {
  id: string;
  labelKey: string;
};

const navLinks: NavLink[] = [
  { id: "hero", labelKey: "nav.home" },
  { id: "projects", labelKey: "nav.projects" },
  { id: "contact", labelKey: "nav.contact" },
  { id: "blog", labelKey: "nav.blog" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const { trackClick, trackLanguageChange } = useAnalytics();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLangMenu = () => setIsLangMenuOpen((prev) => !prev);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const changeLanguage = (lng: string) => {
    const currentLang = i18n.language.split("-")[0];
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    trackLanguageChange(currentLang, lng);
  };

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "az", name: "Azərbaycan Türkcəsi", flag: "🇦🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  // i18n.language'i normalize et (en-US -> en)
  const normalizedLang = i18n.language.split("-")[0].toLowerCase();
  const currentLanguage =
    languages.find((lang) => lang.code === normalizedLang) || languages[1]; // Fallback: English

  // Get language flag emoji
  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'tr': '🇹🇷',
      'de': '🇩🇪',
      'az': '🇦🇿'
    };
    return flags[code] || '🌐';
  };

  return (
    <nav className="bg-gray-800/90 backdrop-blur-sm relative z-50 border-b border-gray-700/50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 group"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("hero");
              trackClick("nav_hero", "navigation_link", "Tolga Çavga");
            }}
          >
            <span className="text-xl font-mono">{"</>"}</span>
            <span className="text-lg font-medium">cavga.dev</span>
          </a>

          {/* Desktop Menu - Right Side */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            {/* Language Selector */}
            <button
              onClick={toggleLangMenu}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              aria-label="Change language"
            >
              <span className="text-lg">{getLanguageFlag(currentLanguage.code)}</span>
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                        i18n.language === lang.code
                          ? "bg-gray-700"
                          : ""
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span className="text-lg">{getLanguageFlag(lang.code)}</span>
                      <span className="text-sm font-medium text-gray-300">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </button>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-sm text-gray-300 hover:text-white cursor-pointer transition-all duration-300 relative group px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.id);
                  trackClick(
                    `nav_${link.id}`,
                    "navigation_link",
                    t(link.labelKey)
                  );
                }}
              >
                {t(link.labelKey)}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            {/* GitHub Icon */}
            <a
              href="https://github.com/Cavga1903"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="GitHub"
              onClick={() => trackClick('github', 'social_link', 'GitHub')}
            >
              <FaGithub className="w-5 h-5" />
            </a>

            {/* Profile Icon */}
            <button
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Profile"
            >
              <FaUser className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            {/* Language Selector - Mobile */}
            <button
              onClick={toggleLangMenu}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              aria-label="Change language"
            >
              <span className="text-lg">{getLanguageFlag(currentLanguage.code)}</span>
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                        i18n.language === lang.code
                          ? "bg-gray-700"
                          : ""
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span className="text-lg">{getLanguageFlag(lang.code)}</span>
                      <span className="text-sm font-medium text-gray-300">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </button>

            {/* Hamburger Menu - Mobile */}
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Mobile Menu - Compact Horizontal Design */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } fixed inset-0 z-50 mobile-menu`}
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-b from-black/80 via-purple-900/60 to-transparent backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel - Compact Horizontal */}
          <div className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl transform transition-all duration-500 ease-out">
            {/* Header - Compact */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <img
                        src="/tabLogo.svg"
                        alt={t('common.developerLogo')}
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{t('common.name')}</h2>
                    <p className="text-blue-200 text-xs">{t('common.role')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:rotate-90"
                  aria-label={t('common.closeMenu')}
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Links - Compact Vertical */}
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="group relative"
                    style={{
                      animationDelay: `${index * 80}ms`
                    }}
                  >
                    <a
                      href={`#${link.id}`}
                      className="block relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        smoothScrollTo(link.id);
                        trackClick(
                          `nav_${link.id}`,
                          "navigation_link",
                          t(link.labelKey)
                        );
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 group-hover:from-blue-500/50 group-hover:to-purple-500/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <span className="text-sm font-bold text-white group-hover:text-blue-100">
                            {link.id.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-white group-hover:text-blue-100 transition-colors">
                            {t(link.labelKey)}
                          </div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-blue-400 transition-all duration-300 group-hover:scale-150"></div>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer - Compact Language and Actions */}
            <div className="px-4 py-2 border-t border-white/10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10">
              <div className="flex items-center justify-between gap-3">
                {/* Language Selector - Compact */}
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <div className="flex gap-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                          i18n.language === lang.code
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        {lang.flag} {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions - Compact */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      // CV indirme fonksiyonu
                      const link = document.createElement('a');
                      link.href = '/Tolga_Cavga_CV.pdf';
                      link.download = 'Tolga_Cavga_Resume.pdf';
                      link.click();
                      trackClick('resume_download', 'file_download', 'Resume Download');
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300 text-xs font-medium hover:scale-105"
                  >
                    {t('common.resume')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Language Menu */}
        {isLangMenuOpen && (
          <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 lg:hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  i18n.language === lang.code
                    ? "bg-blue-50 dark:bg-gray-700"
                    : ""
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                <span className="font-medium text-gray-800 dark:text-white">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
