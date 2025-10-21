import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "../hooks/useAnalytics";

type NavLink = {
  id: string;
  labelKey: string;
};

const navLinks: NavLink[] = [
  { id: "hero", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "technologies", labelKey: "nav.technologies" },
  { id: "services", labelKey: "nav.services" },
  { id: "projects", labelKey: "nav.projects" },
  { id: "contact", labelKey: "nav.contact" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { trackClick, trackLanguageChange } = useAnalytics();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLangMenu = () => setIsLangMenuOpen((prev) => !prev);

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

  return (
    <nav className="bg-white dark:bg-gray-900 relative z-50 shadow-md border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center text-2xl font-bold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group logo-text"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("hero");
              trackClick("nav_hero", "navigation_link", "Tolga Çavga");
            }}
          >
            <img
              src="/tabLogo.svg"
              alt="Developer Logo"
              className="w-20 h-20 ml-2 align-middle group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 hidden dark:block"
            />
            Tolga Çavga
            {/* <span className="text-blue-600 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400">
              Çavga
            </span> */}
          </a>

          {/* Desktop Menu - Center */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-lg text-gray-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all duration-300 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
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
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-700 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Side - Desktop Language + Mobile Controls */}
          <div className="flex items-center gap-3">
            {/* Desktop Language Selector */}
            <div className="hidden lg:block relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaGlobe className="text-lg" />
                <span className="text-sm font-medium">
                  {currentLanguage.code.toUpperCase()}
                </span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
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

            {/* Mobile - Language & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
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
                className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hamburger-button"
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
                        alt="Developer Logo"
                        className="w-6 h-6 filter brightness-0 invert"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Tolga Çavga</h2>
                    <p className="text-blue-200 text-xs">Frontend Developer</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:rotate-90"
                  aria-label="Close menu"
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
                    Resume
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
