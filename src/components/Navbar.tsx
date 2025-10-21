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

        {/* Mobile Menu - Modern Design */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:hidden fixed inset-0 z-50 mobile-menu`}
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/tabLogo.svg"
                  alt="Developer Logo"
                  className="w-12 h-12 rounded-lg shadow-lg"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">Tolga Çavga</h2>
                  <p className="text-sm text-blue-200">Frontend Developer</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Close menu"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-8">
              <ul className="space-y-2">
                {navLinks.map((link, index) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="group flex items-center gap-4 px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-blue-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <span className="text-lg font-bold text-blue-300 group-hover:text-white">
                          {link.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-medium">{t(link.labelKey)}</div>
                        <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                          {link.id === 'hero' && 'Ana sayfa'}
                          {link.id === 'about' && 'Hakkımda bilgileri'}
                          {link.id === 'technologies' && 'Teknoloji yığınım'}
                          {link.id === 'services' && 'Hizmetlerim'}
                          {link.id === 'projects' && 'Projelerim'}
                          {link.id === 'contact' && 'İletişim bilgileri'}
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-blue-400 transition-all duration-300 group-hover:scale-150"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-4">Dil Seçimi</p>
                <div className="flex justify-center gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        i18n.language === lang.code
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </button>
                  ))}
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
