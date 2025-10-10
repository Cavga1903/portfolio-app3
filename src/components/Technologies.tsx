import React from 'react';
import { useTranslation } from 'react-i18next';

const Technologies: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="technologies" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-10 text-center fade-in-up inline-block group">
        {t('technologies.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-purple-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Teknoloji 1 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🌐</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.html')}</p>
        </div>

        {/* Teknoloji 2 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🎨</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.css')}</p>
        </div>

        {/* Teknoloji 3 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">⚡</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.javascript')}</p>
        </div>

        {/* Teknoloji 4 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">⚛️</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.react')}</p>
        </div>

        {/* Teknoloji 5 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🛠️</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.git')}</p>
        </div>

        {/* Teknoloji 6 */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-default group">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">📘</span>
          <p className="mt-2 font-semibold group-hover:text-purple-400 transition-colors duration-300">{t('technologies.typescript')}</p>
        </div>
      </div>
    </section>
  );
};

export default Technologies;