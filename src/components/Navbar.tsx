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

        {/* Mobile Menu - Modern Glassmorphism Design */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:hidden fixed inset-0 z-50 mobile-menu`}
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-blue-900/60 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel - Slide from right */}
          <div className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl transform transition-all duration-500 ease-out">
            {/* Header with gradient */}
            <div className="relative p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <img
                        src="/tabLogo.svg"
                        alt="Developer Logo"
                        className="w-10 h-10 filter brightness-0 invert"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Tolga Çavga</h2>
                    <p className="text-blue-200 text-sm">Frontend Developer</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300">Available for work</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:rotate-90"
                  aria-label="Close menu"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Links with modern cards */}
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="space-y-3">
                {navLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="group relative"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <a
                      href={`#${link.id}`}
                      className="block relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm"
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
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 group-hover:from-blue-500/50 group-hover:to-purple-500/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <span className="text-xl font-bold text-white group-hover:text-blue-100">
                            {link.id.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">
                            {t(link.labelKey)}
                          </div>
                          <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                            {link.id === 'hero' && 'Ana sayfa ve tanıtım'}
                            {link.id === 'about' && 'Kişisel bilgilerim ve deneyim'}
                            {link.id === 'technologies' && 'Kullandığım teknolojiler'}
                            {link.id === 'services' && 'Sunduğum hizmetler'}
                            {link.id === 'projects' && 'Geliştirdiğim projeler'}
                            {link.id === 'contact' && 'İletişim ve sosyal medya'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-blue-400 transition-all duration-300 group-hover:scale-150"></div>
                          <div className="text-white/40 group-hover:text-white/60 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                    </a>
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer with language selector and social links */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10">
              <div className="space-y-6">
                {/* Language Selector */}
                <div>
                  <p className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Dil Seçimi
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          i18n.language === lang.code
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-105"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium">
                    CV İndir
                  </button>
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium">
                    İletişim
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
