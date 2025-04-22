import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaCode } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center">
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">Tolga Çavga</span>
          <FaCode className="text-3xl ml-2 align-middle dark:text-white" />
        </a>

        {/* Hamburger Menu Button */}
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-controls="navbar-menu"
          aria-expanded={isMenuOpen ? "true" : "false"}
        >
          {isMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
          </button>
        </div>
        {/* Menü Linkleri */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-menu"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 text-white border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="#hero" className="btn btn-ghost text-lg">
                Anasayfa
              </a>
            </li>
            <li>
              <a href="#about" className="btn btn-ghost text-lg">
                Hakkımda
              </a>
            </li>
            <li>
              <a href="#technologies" className="btn btn-ghost text-lg">
                Teknolojiler
              </a>
            </li>
            <li>
              <a href="#projects" className="btn btn-ghost text-lg">
                Projeler
              </a>
            </li>
            <li>
              <a href="#contact" className="btn btn-ghost text-lg">
                İletişim
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;