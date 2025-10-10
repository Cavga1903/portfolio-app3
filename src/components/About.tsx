import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCode, FaRocket, FaHeart, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const About: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-10 text-center fade-in-up inline-block group">
        {t('about.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-blue-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Main Content Card */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 p-8 mb-8 group fade-in-up">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-6xl">👨‍💻</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tolga Çavga
              </h3>
              <p className="text-cyan-400 text-lg mb-4">Frontend Developer</p>
              <p className="text-lg leading-relaxed text-gray-200">
                {t('about.description')}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 pt-6 border-t border-gray-700/50">
            <a
              href="https://github.com/Cavga1903"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-700/50 hover:bg-gray-900/50 rounded-lg transition-all duration-300 hover:scale-110 group"
              title="GitHub - @Cavga1903"
            >
              <FaGithub className="text-2xl text-gray-300 group-hover:text-white transition-colors group-hover:rotate-12" />
            </a>
            <a
              href="https://www.linkedin.com/in/tolgaacavgaa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-700/50 hover:bg-[#0A66C2]/20 rounded-lg transition-all duration-300 hover:scale-110 group"
              title="LinkedIn - @tolgaacavgaa"
            >
              <FaLinkedin className="text-2xl text-gray-300 group-hover:text-[#0A66C2] transition-colors group-hover:rotate-12" />
            </a>
            <a
              href="https://www.instagram.com/codewithcavga"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-700/50 hover:bg-gradient-to-br hover:from-purple-600/20 hover:via-pink-600/20 hover:to-orange-500/20 rounded-lg transition-all duration-300 hover:scale-110 group relative overflow-hidden"
              title="Instagram - @codewithcavga"
            >
              <FaInstagram className="text-2xl text-gray-300 group-hover:text-pink-500 transition-colors group-hover:rotate-12 relative z-10" />
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up">
          {/* Card 1 */}
          <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-blue-500/20 p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                <FaCode className="text-3xl text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Focus</p>
                <p className="text-xl font-bold text-white">Frontend Dev</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-cyan-500/20 p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-300">
                <FaRocket className="text-3xl text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Passion</p>
                <p className="text-xl font-bold text-white">Innovation</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-purple-500/20 p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                <FaHeart className="text-3xl text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Love</p>
                <p className="text-xl font-bold text-white">Clean Code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;