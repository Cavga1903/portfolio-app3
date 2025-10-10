import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHome, FaSearch, FaRocket, FaGhost } from 'react-icons/fa';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);

  // Floating animation için
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const emojis = ['🤷‍♂️', '🔍', '🗺️', '🧭', '🚀', '👻', '🤖', '🛸'];
  const [currentEmoji, setCurrentEmoji] = useState(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated Ghost/Emoji */}
        <div className="mb-8 relative">
          <div 
            className="text-9xl animate-bounce"
            style={{ 
              animation: 'bounce 1s infinite, float 3s ease-in-out infinite',
            }}
          >
            {currentEmoji}
          </div>
        </div>

        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-6">
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          {/* Glitch Effect */}
          <h1 className="absolute top-0 left-1/2 transform -translate-x-1/2 text-9xl md:text-[12rem] font-black text-blue-500 opacity-20 blur-sm">
            404
          </h1>
        </div>

        {/* Funny Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {t('notFound.title')}
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
          {t('notFound.message')}
        </p>

        {/* Fun Facts */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 mb-8 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-gray-400 italic flex items-center justify-center gap-2">
            <FaGhost className="text-purple-400 animate-pulse" />
            <span>{t('notFound.funFact')}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/"
            className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-none text-white text-lg px-8 py-3 hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2 group"
          >
            <FaHome className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            {t('notFound.goHome')}
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline border-purple-400 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-purple-500 text-lg px-8 py-3 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2 group"
          >
            <FaRocket className="text-xl group-hover:-rotate-45 transition-transform duration-300" />
            {t('notFound.goBack')}
          </button>
        </div>

        {/* Easter Egg */}
        <p className="text-xs text-gray-500 mt-12 opacity-50 hover:opacity-100 transition-opacity duration-300">
          {t('notFound.tip')} 🎮
        </p>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce delay-300">
        🌟
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-bounce delay-700">
        ✨
      </div>
      <div className="absolute top-1/2 left-20 text-6xl opacity-20 animate-bounce delay-500">
        💫
      </div>
    </section>
  );
};

export default NotFound;

