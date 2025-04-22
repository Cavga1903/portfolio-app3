import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaCode } from 'react-icons/fa';

type NavLink = {
  id: string;
  label: string;
};

const navLinks: NavLink[] = [
  { id: "hero", label: "Anasayfa" },
  { id: "about", label: "Hakkımda" },
  { id: "technologies", label: "Teknolojiler" },
  { id: "projects", label: "Projeler" },
  { id: "contact", label: "İletişim" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center text-2xl font-bold dark:text-white">
          Tolga Çavga
          <FaCode className="text-3xl ml-2 align-middle dark:text-white" />
        </a>

        {/* Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menü Linkleri Burada */}
        <div className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-menu">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="block py-2 pl-3 pr-4 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;