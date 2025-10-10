import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-10 text-center fade-in-up inline-block group">
        {t('contact.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-teal-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <div className="relative z-10 card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300 p-8 w-full max-w-md flex flex-col items-center text-center">
        <p className="mb-4 text-lg text-gray-200">{t('contact.description')}</p>

        <div className="flex flex-col gap-4 w-full">
          {/* E-posta Butonu */}
          <a
            href="mailto:cavgaa228@gmail.com"
            className="btn btn-outline border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 hover:border-teal-400 w-full hover:scale-105 hover:shadow-lg hover:shadow-teal-500/50 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 group"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">📧</span> {t('contact.email')}
          </a>

          {/* LinkedIn Butonu */}
          <a
            href="https://www.linkedin.com/in/tolgaacavgaa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 hover:border-teal-400 w-full hover:scale-105 hover:shadow-lg hover:shadow-teal-500/50 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 group"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">🔗</span> {t('contact.linkedin')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;