import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-25 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-300% hover:scale-105 transition-transform duration-300">
          {t('hero.greeting')}
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto hover:text-white transition-colors duration-300">
          {t('hero.description')}
        </p>
        
        {/* CTA Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a 
            href="#about" 
            className="btn btn-primary text-white text-lg hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('hero.ctaAbout')}
          </a>
          <a 
            href="#projects" 
            className="btn btn-outline text-white border-white hover:bg-white hover:text-gray-900 text-lg hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            {t('hero.ctaProjects')}
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute top-100 bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowDown className="text-2xl text-blue-400 opacity-70 hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </section>
  );
};

export default Hero;