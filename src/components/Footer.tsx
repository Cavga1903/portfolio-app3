import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 flex flex-col items-center justify-center">
      <p className="text-center text-sm">&copy; {new Date().getFullYear()} Tolga Çavga. Tüm Hakları Saklıdır.</p>
      <p className="text-center text-xs mt-1">Frontend Developer | React & TypeScript</p>
    </footer>
  );
};

export default Footer;