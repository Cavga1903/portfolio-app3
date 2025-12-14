import React, { useState, useEffect, useMemo, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGithub, FaUser, FaHome, FaBlog, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAuthStore } from "../app/store/authStore";
import { useUIStore } from "../app/store/uiStore";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box } from '@mui/material';

interface NavbarProps {
  onLoginClick?: () => void;
  window?: () => Window;
}

// Helper to get global window object
const getWindow = () => (typeof window !== 'undefined' ? window : null);

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

// Dark mode icon component
const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className={className}>
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
  </svg>
);

// Light mode icon component
const SunIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className={className}>
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
  </svg>
);

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
  { id: "blog", labelKey: "nav.blog" },
];

// Elevation scroll component
function ElevationScroll(props: { children: React.ReactElement; window?: () => Window }) {
  const { children, window: windowProp } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: windowProp ? windowProp() : undefined,
  });

  return React.cloneElement(children, {
    elevation: (trigger ? 4 : 0) as number,
  } as React.HTMLAttributes<HTMLElement>);
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, window }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackClick, trackLanguageChange } = useAnalytics();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  
  // Refs for link positions
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const underlineX = useMotionValue(0);
  const underlineWidth = useMotionValue(0);
  
  // Smooth spring animations for underline
  const springConfig = { damping: 25, stiffness: 300 };
  const underlineXSpring = useSpring(underlineX, springConfig);
  const underlineWidthSpring = useSpring(underlineWidth, springConfig);

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

  // Initialize dark mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'light' ? false : true;
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update underline position based on active link
  const updateUnderline = React.useCallback((linkId: string) => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const linkElement = linkRefs.current[linkId];
      if (linkElement) {
        const { offsetLeft, offsetWidth } = linkElement;
        underlineX.set(offsetLeft);
        underlineWidth.set(offsetWidth);
      }
    });
  }, [underlineX, underlineWidth]);

  // Set active link and update underline
  const handleLinkClick = (linkId: string) => {
    setActiveLink(linkId);
    updateUnderline(linkId);
  };

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    // If blog link, navigate to /blog route
    if (elementId === 'blog') {
      navigate('/blog');
      setActiveLink('blog');
      return;
    }
    
    // Navbar height for offset calculation
    const navbarHeight = 64; // Approximate navbar height
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(elementId);
        const win = getWindow();
        if (element && win) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + win.pageYOffset - navbarHeight;
          
          win.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
        handleLinkClick(elementId);
      }, 300);
      return;
    }
    
    const element = document.getElementById(elementId);
    const win = getWindow();
    if (element && win) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + win.pageYOffset - navbarHeight;
      
      win.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      handleLinkClick(elementId);
    } else {
      // If element not found, just set active link
      handleLinkClick(elementId);
    }
  };

  // Set active link based on current route
  useEffect(() => {
    // If on blog page, set blog as active
    if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
      setActiveLink('blog');
      updateUnderline('blog');
      return;
    }
    
    // If on home page, detect active section on scroll
    if (location.pathname === '/') {
      const handleScroll = () => {
        const sections = navLinks.map(link => ({
          id: link.id,
          element: document.getElementById(link.id),
        }));

        const win = getWindow();
        const scrollPosition = (win ? win.scrollY : 0) + 100; // Offset for navbar height

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.element) {
            const { offsetTop, offsetHeight } = section.element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              if (activeLink !== section.id) {
                setActiveLink(section.id);
                updateUnderline(section.id);
              }
              break;
            }
          }
        }
      };

      const win = getWindow();
      if (win) {
        win.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => win.removeEventListener("scroll", handleScroll);
      }
    }
  }, [activeLink, updateUnderline, location.pathname]);

  // Update underline when active link changes
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateUnderline(activeLink);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeLink, updateUnderline]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  return (
    <>
      <ElevationScroll window={window}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)', // gray-900 with 95% opacity - always dark
            backdropFilter: 'blur(12px) saturate(180%)',
            borderBottom: '1px solid rgba(55, 65, 81, 0.6)', // gray-700 with 60% opacity - always dark
            color: 'rgb(243, 244, 246)', // gray-100 - always dark
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.MuiAppBar-root': {
              boxShadow: 'none',
            },
          }}
        >
          <Toolbar 
            sx={{ 
              px: { xs: 2, sm: 3, lg: 4 }, 
              py: 1.5,
              minHeight: '64px !important',
              color: 'inherit',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {/* Logo and Toggles - Left Side */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <a
                  href="/"
                  className="flex items-center gap-2 cursor-pointer transition-colors duration-300 group text-gray-300 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
                    if (location.pathname !== '/') {
                      navigate('/');
                    } else {
              smoothScrollTo("hero");
                    }
              trackClick("nav_hero", "navigation_link", "Tolga Çavga");
            }}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="text-xl font-mono">{"</>"}</span>
                  <span className="text-lg font-medium">cavga.dev</span>
                </a>

                {/* Dark Mode Toggle - Desktop */}
                <button
                  onClick={toggleDarkMode}
                  className="hidden lg:flex p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Language Selector - Desktop */}
                <button
                  onClick={cycleToNextLanguage}
                  className="hidden lg:flex p-2 rounded-lg transition-all duration-200 cursor-pointer outline-none focus:outline-none hover:scale-110 active:scale-95 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  aria-label={`Change language to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                  title={`Current: ${currentLanguage.name} - Click to switch to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                >
                  <FlagIcon code={currentLanguage.code} className="w-6 h-6" />
                </button>
              </Box>

              {/* Desktop Menu - Right Side */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2, position: 'relative' }}>
                {/* Navigation Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                      ref={(el) => {
                        linkRefs.current[link.id] = el;
                      }}
                href={`#${link.id}`}
                      className={`text-sm cursor-pointer transition-all duration-300 relative px-2 py-1 focus:outline-none ${
                        activeLink === link.id
                          ? "text-blue-400 font-medium"
                          : "text-gray-300 hover:text-white"
                      }`}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.id);
                  trackClick(
                    `nav_${link.id}`,
                    "navigation_link",
                    t(link.labelKey)
                  );
                }}
                      style={{ textDecoration: 'none' }}
              >
                {t(link.labelKey)}
              </a>
            ))}
                  
                  {/* Animated Underline */}
                  <motion.div
                    className="absolute bottom-0 h-0.5 bg-blue-400"
                    style={{
                      x: underlineXSpring,
                      width: underlineWidthSpring,
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                </Box>

                {/* GitHub Icon */}
                <a
                  href="https://github.com/Cavga1903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  aria-label="GitHub"
                  onClick={() => trackClick('github', 'social_link', 'GitHub')}
                  style={{ textDecoration: 'none' }}
                >
                  <FaGithub className="w-5 h-5" />
                </a>

                {/* Profile Icon / User Menu */}
                {isAuthenticated ? (
                  <div className="relative profile-dropdown-container">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Profile"
                    >
                      <FaUser className="w-4 h-4 text-white" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl transition-all duration-200 z-[60] ${
                      isProfileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    } bg-gray-800 border border-gray-700/50`}>
                      <div className="p-2">
                        {/* User Info */}
                        <div className="px-3 py-2 text-sm border-b text-gray-300 border-gray-700">
                          <div className="font-semibold">{user?.name}</div>
                          <div className="text-xs text-gray-400">{user?.email}</div>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="py-1">
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsProfileDropdownOpen(false);
                              if (location.pathname !== '/') {
                                navigate('/');
                              } else {
                                // Scroll to hero section if already on home page
                                const heroElement = document.getElementById('hero');
                                if (heroElement) {
                                  heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }
                              trackClick('nav_home_profile', 'navigation_link', 'Home');
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                            style={{ textDecoration: 'none' }}
                          >
                            <FaHome className="w-4 h-4" />
                            <span>{t('nav.home') || 'Home'}</span>
                          </a>
                          
                          <a
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsProfileDropdownOpen(false);
                              navigate('/blog');
                              trackClick('nav_blog_profile', 'navigation_link', 'Blog');
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                            style={{ textDecoration: 'none' }}
                          >
                            <FaBlog className="w-4 h-4" />
                            <span>{t('nav.blog') || 'Blog'}</span>
                          </a>
                          
                          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider border-t mt-1 pt-2 text-gray-400 border-gray-700">
                            {t('nav.admin') || 'Admin'}
                </div>
                          {user?.role === 'admin' && (
                            <a
                              href="/admin/dashboard"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsProfileDropdownOpen(false);
                                navigate('/admin/dashboard');
                                trackClick('nav_dashboard', 'navigation_link', 'Dashboard');
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                              style={{ textDecoration: 'none' }}
                            >
                              <FaChartLine className="w-4 h-4" />
                              <span>{t('nav.dashboard') || 'Dashboard'}</span>
                            </a>
                          )}
            </div>

                        {/* Logout */}
                        <div className="pt-1 border-t mt-1 border-gray-700">
                          <button
                            onClick={async () => {
                              setIsProfileDropdownOpen(false);
                              await logout();
                              navigate('/');
                              trackClick('nav_logout', 'action', 'Logout');
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded transition-colors text-red-400 hover:bg-gray-700"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>{t('auth.logout') || 'Logout'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Login"
                  >
                    <FaUser className="w-4 h-4 text-white" />
                  </button>
                )}
              </Box>

              {/* Mobile Controls */}
              <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
                {/* Dark Mode Toggle - Mobile */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Language Selector - Mobile */}
              <button
                  onClick={cycleToNextLanguage}
                  className="p-2 rounded-lg transition-all duration-200 cursor-pointer outline-none focus:outline-none hover:scale-110 active:scale-95 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  aria-label={`Change language to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                  title={`Current: ${currentLanguage.name} - Click to switch to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                >
                  <FlagIcon code={currentLanguage.code} className="w-5 h-5" />
              </button>

                {/* Hamburger Menu - Mobile */}
              <button
                onClick={toggleMenu}
                type="button"
                  className="p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
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
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      
      {/* Spacer for fixed AppBar */}
      <Toolbar />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-sm z-40 bg-black/60"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 right-0 backdrop-blur-md shadow-xl z-50 border-b bg-gray-900/98 border-gray-700/60">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                {/* Logo and Toggles */}
                <div className="flex items-center gap-3">
                  <a
                    href="/"
                    className="flex items-center gap-2 transition-colors duration-300 text-gray-300 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        navigate('/');
                      } else {
                        smoothScrollTo("hero");
                      }
                      trackClick("nav_hero", "navigation_link", "Tolga Çavga");
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="text-xl font-mono">{"</>"}</span>
                    <span className="text-lg font-medium">cavga.dev</span>
                  </a>

                  {/* Dark Mode Toggle - Mobile Menu */}
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? (
                      <SunIcon className="w-5 h-5" />
                    ) : (
                      <MoonIcon className="w-5 h-5" />
                    )}
                  </button>

                  {/* Language Selector - Mobile Menu */}
                  <button
                    onClick={cycleToNextLanguage}
                    className="p-2 rounded-lg transition-all duration-200 cursor-pointer outline-none focus:outline-none hover:scale-110 active:scale-95 text-gray-300 hover:text-white hover:bg-gray-700/50"
                    aria-label={`Change language to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                    title={`Current: ${currentLanguage.name} - Click to switch to ${languages[(currentLanguageIndex + 1) % languages.length].name}`}
                  >
                    <FlagIcon code={currentLanguage.code} className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
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
                  className="block px-3 py-2.5 rounded-lg transition-all duration-200 relative group text-gray-300 hover:text-white hover:bg-gray-700/50"
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
                  style={{ textDecoration: 'none' }}
                >
                  {t(link.labelKey)}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-blue-400"></span>
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
                  className="p-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  aria-label="GitHub"
                  onClick={() => {
                    setIsMenuOpen(false);
                    trackClick('github', 'social_link', 'GitHub');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <FaGithub className="w-5 h-5" />
                </a>

                {/* Profile Icon / User Menu */}
                {isAuthenticated ? (
                  <div className="relative profile-dropdown-container w-full">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                      aria-label="Profile"
                    >
                      <FaUser className="w-4 h-4" />
                      <span className="font-semibold">{user?.name}</span>
                    </button>
                    {/* Dropdown Menu - Mobile */}
                    <div className={`absolute left-0 mt-2 w-full rounded-lg shadow-xl transition-all duration-200 z-[60] ${
                      isProfileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    } bg-gray-800 border border-gray-700/50`}>
                      <div className="p-2">
                        {/* User Info */}
                        <div className="px-3 py-2 text-sm border-b text-gray-300 border-gray-700">
                          <div className="font-semibold">{user?.name}</div>
                          <div className="text-xs text-gray-400">{user?.email}</div>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="py-1">
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsProfileDropdownOpen(false);
                              setIsMenuOpen(false);
                              if (location.pathname !== '/') {
                                navigate('/');
                              } else {
                                smoothScrollTo("hero");
                              }
                              trackClick('nav_home_profile', 'navigation_link', 'Home');
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                            style={{ textDecoration: 'none' }}
                          >
                            <FaHome className="w-4 h-4" />
                            <span>{t('nav.home') || 'Home'}</span>
                          </a>
                          
                          <a
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsProfileDropdownOpen(false);
                              setIsMenuOpen(false);
                              navigate('/blog');
                              trackClick('nav_blog_profile', 'navigation_link', 'Blog');
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                            style={{ textDecoration: 'none' }}
                          >
                            <FaBlog className="w-4 h-4" />
                            <span>{t('nav.blog') || 'Blog'}</span>
                          </a>
                          
                          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider border-t mt-1 pt-2 text-gray-400 border-gray-700">
                            {t('nav.admin') || 'Admin'}
                          </div>
                          {user?.role === 'admin' && (
                            <a
                              href="/admin/dashboard"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsProfileDropdownOpen(false);
                                setIsMenuOpen(false);
                                navigate('/admin/dashboard');
                                trackClick('nav_dashboard', 'navigation_link', 'Dashboard');
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors text-gray-300 hover:bg-gray-700"
                              style={{ textDecoration: 'none' }}
                            >
                              <FaChartLine className="w-4 h-4" />
                              <span>{t('nav.dashboard') || 'Dashboard'}</span>
                            </a>
                          )}
                      </div>
                      
                        {/* Logout */}
                        <div className="pt-1 border-t border-gray-700 mt-1">
                      <button
                            onClick={async () => {
                              setIsProfileDropdownOpen(false);
                          setIsMenuOpen(false);
                              await logout();
                              navigate('/');
                              trackClick('nav_logout', 'action', 'Logout');
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>{t('auth.logout') || 'Logout'}</span>
                      </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      onLoginClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200"
                    aria-label="Login"
                  >
                    <FaUser className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
        )}
    </>
  );
};

export default Navbar;
