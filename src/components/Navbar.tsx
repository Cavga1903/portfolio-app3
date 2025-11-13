import React, { useState, useEffect, useMemo } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGithub, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "../hooks/useAnalytics";

// Dil listesi - component dışında tanımlı (public/png klasöründeki bayraklara göre)
const languages = [
  { code: "tr", name: "Türkçe", flagImage: "/png/005-turkey.png" },
  { code: "az", name: "Azərbaycan Türkcəsi", flagImage: "/png/007-azerbaijan.png" },
  { code: "en", name: "English", flagImage: "/png/001-united-kingdom.png" },
  { code: "de", name: "Deutsch", flagImage: "/png/002-germany.png" },
  { code: "fr", name: "Français", flagImage: "/png/003-france.png" },
  { code: "sv", name: "Svenska", flagImage: "/png/004-sweden.png" },
  { code: "no", name: "Norsk", flagImage: "/png/006-norway.png" },
  { code: "el", name: "Ελληνικά", flagImage: "/png/008-greece.png" },
  { code: "uk", name: "Українська", flagImage: "/png/009-ukraine.png" },
  { code: "it", name: "Italiano", flagImage: "/png/010-italy.png" },
  { code: "ja", name: "日本語", flagImage: "/png/011-japan.png" },
  { code: "pl", name: "Polski", flagImage: "/png/012-poland.png" },
  { code: "es", name: "Español", flagImage: "/png/013-spain.png" },
];

// Bayrak görseli komponenti
const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-6 h-6" }) => {
  const language = languages.find(lang => lang.code === code);
  if (!language) return <div className={className} />;
  
  return (
    <img 
      src={language.flagImage} 
      alt={language.name}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const { trackClick, trackLanguageChange } = useAnalytics();

  const normalizedLang = i18n.language.split("-")[0].toLowerCase();
  const currentLanguageIndex = useMemo(() => {
    const index = languages.findIndex((lang) => lang.code === normalizedLang);
    return index >= 0 ? index : languages.findIndex((lang) => lang.code === 'en');
  }, [normalizedLang]);

  const currentLanguage = languages[currentLanguageIndex];

  const cycleToNextLanguage = () => {
    const nextIndex = (currentLanguageIndex + 1) % languages.length;
    const nextLang = languages[nextIndex];
    const currentLang = i18n.language.split("-")[0];
    i18n.changeLanguage(nextLang.code);
    trackLanguageChange(currentLang, nextLang.code);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

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


  return (
    <nav className="bg-gray-800/90 backdrop-blur-sm fixed z-50 border-b border-gray-700/50 w-full top-0 left-0 right-0">
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
              onClick={cycleToNextLanguage}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer outline-none focus:outline-none hover:scale-110 active:scale-95"
              aria-label={`Change language to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
              title={`Current: ${currentLanguage.name} - Click to switch to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
            >
              <FlagIcon code={currentLanguage.code} className="w-6 h-6" />
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
              onClick={cycleToNextLanguage}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer outline-none focus:outline-none hover:scale-110 active:scale-95"
              aria-label={`Change language to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
              title={`Current: ${currentLanguage.name} - Click to switch to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
            >
              <FlagIcon code={currentLanguage.code} className="w-5 h-5" />
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

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } fixed inset-0 z-50`}
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 shadow-xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <a
                  href="#hero"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    smoothScrollTo("hero");
                    trackClick("nav_hero", "navigation_link", "Tolga Çavga");
                  }}
                >
                  <span className="text-xl font-mono">{"</>"}</span>
                  <span className="text-lg font-medium">cavga.dev</span>
                </a>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                  aria-label="Close menu"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 relative group"
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
                  {t(link.labelKey)}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-gray-700/50">
              <div className="flex items-center justify-center gap-3">
                {/* GitHub Icon */}
                <a
                  href="https://github.com/Cavga1903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                  aria-label="GitHub"
                  onClick={() => {
                    setIsMenuOpen(false);
                    trackClick('github', 'social_link', 'GitHub');
                  }}
                >
                  <FaGithub className="w-5 h-5" />
                </a>

                {/* Profile Icon */}
                <button
                  className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200"
                  aria-label="Profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
