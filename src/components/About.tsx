import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 card w-full max-w-3xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 p-8 group fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center group-hover:text-blue-400 transition-colors duration-300 relative inline-block">
          {t('about.title')}
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-400 group-hover:w-full transition-all duration-500"></span>
        </h2>
        <p className="text-lg leading-relaxed text-center text-gray-200">
          {t('about.description')}
        </p>
      </div>
    </section>
  );
};

export default About;