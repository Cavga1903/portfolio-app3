import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCode, FaRocket, FaHeart, FaGithub, FaLinkedin, FaInstagram, FaBuilding, FaBolt, FaUsers } from 'react-icons/fa';
import { useAnalytics } from '../hooks/useAnalytics';
import { SEOHead } from './SEOHead';
import { useDarkMode } from '../hooks/useDarkMode';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { trackEvent, trackSectionView, trackSoftSkillInteraction } = useAnalytics();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Instagram-style profile photo carousel state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Profile photos for Instagram-style carousel
  const profilePhotos: Array<{
    id: string;
    type: 'emoji' | 'image';
    emoji?: string;
    image?: string;
    alt: string;
    description: string;
    fallback?: string;
  }> = [
    {
      id: 'github',
      type: 'image',
      image: 'https://avatars.githubusercontent.com/u/46963474?v=4',
      alt: t('about.githubPhotoAlt'),
      description: 'GitHub Profil Fotoğrafı',
      fallback: '/profilePhoto.jpg'
    },
    {
      id: 'logo',
      type: 'image',
      image: '/tabLogo.svg',
      alt: t('about.logoAlt'),
      description: t('about.logoAlt')
    }
  ];

  // Photo carousel functions
  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => {
      const nextIndex = (prev + 1) % profilePhotos.length;
      trackEvent('about_photo_navigation', {
        action: 'next',
        photo_index: nextIndex,
        total_photos: profilePhotos.length
      });
      return nextIndex;
    });
  }, [profilePhotos.length, trackEvent]);

  // Auto-play functionality for photos
  useEffect(() => {
    const interval = setInterval(() => {
      nextPhoto();
    }, 4000); // 4 saniyede bir değişir
    
    return () => clearInterval(interval);
  }, [nextPhoto]);

  // Track section view when component mounts
  React.useEffect(() => {
    if (isInView) {
      trackSectionView('about', 0);
      trackEvent('about_section_view', {
        section_name: 'about',
        has_soft_skills: true,
        social_links_count: 3,
        photo_carousel: true
      });
    }
  }, [isInView, trackSectionView, trackEvent]);
  
  return (
    <>
      <SEOHead 
        pageType="about"
        url="https://www.tolgacavga.com#about"
        type="profile"
        imageWidth={1200}
        imageHeight={630}
        twitterCreator="@tolgacavga"
      />
      <section ref={ref} id="about" className={`relative flex flex-col items-center justify-center min-h-screen py-20 md:py-24 lg:py-28 px-6 md:px-8 lg:px-12 overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white'
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900'
      }`}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.h2 
        className="relative z-10 text-3xl md:text-4xl font-bold mb-10 text-center inline-block group"
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        {t('about.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-blue-400 group-hover:w-full transition-all duration-500"></span>
      </motion.h2>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Main Content Card */}
        <motion.div 
          className={`card backdrop-blur-sm shadow-2xl p-8 mb-8 group ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-white/90 border-gray-200'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ 
            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
            scale: 1.02,
          }}
        >
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Instagram-style Photo Carousel */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl cursor-pointer" onClick={nextPhoto}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhotoIndex}
                    className="w-full h-full flex items-center justify-center"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {profilePhotos[currentPhotoIndex].type === 'emoji' ? (
                      <span className="text-6xl">{profilePhotos[currentPhotoIndex].emoji}</span>
                    ) : (
                      <img
                        src={profilePhotos[currentPhotoIndex].image}
                        alt={profilePhotos[currentPhotoIndex].alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (profilePhotos[currentPhotoIndex].fallback && target.src !== profilePhotos[currentPhotoIndex].fallback) {
                            target.src = profilePhotos[currentPhotoIndex].fallback!;
                          }
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('about.name')}
              </h3>
              <p className="text-cyan-400 text-lg mb-4">{t('about.role')}</p>
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {t('about.description')}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className={`flex justify-center gap-4 pt-6 border-t ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <motion.a
              href="https://github.com/Cavga1903"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-lg group cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-700/50 hover:bg-gray-600/50'
                  : 'bg-gray-100/70 hover:bg-gray-200'
              }`}
              title="GitHub - @Cavga1903"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(17, 24, 39, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub className={`text-2xl transition-colors group-hover:rotate-12 ${
                isDarkMode
                  ? 'text-gray-300 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/tolgaacavgaa"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-lg group cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-700/50 hover:bg-gray-600/50'
                  : 'bg-gray-100/70 hover:bg-gray-200'
              }`}
              title="LinkedIn - @tolgaacavgaa"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(10, 102, 194, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin className={`text-2xl transition-colors group-hover:rotate-12 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`} />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/codewithcavga"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-lg group relative overflow-hidden cursor-pointer ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
              }`}
              title="Instagram - @codewithcavga"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram className={`text-2xl transition-colors group-hover:rotate-12 relative z-10 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`} />
            </motion.a>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <motion.div 
            className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)" 
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                <FaCode className="text-3xl text-blue-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('about.stats.focus.label')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{t('about.stats.focus.value')}</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 60px rgba(6, 182, 212, 0.3)" 
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-300">
                <FaRocket className="text-3xl text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('about.stats.passion.label')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{t('about.stats.passion.value')}</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 60px rgba(168, 85, 247, 0.3)" 
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                <FaHeart className="text-3xl text-purple-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('about.stats.love.label')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{t('about.stats.love.value')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Soft Skills Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {t('about.softSkills.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kurumsal Deneyim */}
            <motion.div 
              className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 60px rgba(34, 197, 94, 0.3)" 
              }}
              onMouseEnter={() => {
                trackSoftSkillInteraction('corporate_experience', 'hover');
              }}
              onClick={() => {
                trackSoftSkillInteraction('corporate_experience', 'click');
              }}
            >
              <div className="text-center">
                <div className="p-4 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300 mx-auto w-fit mb-4">
                  <FaBuilding className="text-3xl text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {t('about.softSkills.corporate.title')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('about.softSkills.corporate.description')}
                </p>
              </div>
            </motion.div>

            {/* Hızlı Öğrenme */}
            <motion.div 
              className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 60px rgba(251, 191, 36, 0.3)" 
              }}
              onMouseEnter={() => {
                trackSoftSkillInteraction('fast_learning', 'hover');
              }}
              onClick={() => {
                trackSoftSkillInteraction('fast_learning', 'click');
              }}
            >
              <div className="text-center">
                <div className="p-4 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors duration-300 mx-auto w-fit mb-4">
                  <FaBolt className="text-3xl text-yellow-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                  {t('about.softSkills.learning.title')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('about.softSkills.learning.description')}
                </p>
              </div>
            </motion.div>

            {/* Takım Çalışması */}
            <motion.div 
              className="card bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-xl p-6 group hover:bg-gray-50 dark:hover:bg-gray-700/50"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)" 
              }}
              onMouseEnter={() => {
                trackSoftSkillInteraction('teamwork', 'hover');
              }}
              onClick={() => {
                trackSoftSkillInteraction('teamwork', 'click');
              }}
            >
              <div className="text-center">
                <div className="p-4 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300 mx-auto w-fit mb-4">
                  <FaUsers className="text-3xl text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {t('about.softSkills.teamwork.title')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('about.softSkills.teamwork.description')}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default About;