import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaGitAlt, 
  FaReact, 
  FaNode,
  FaDatabase
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiExpo, 
  SiFigma, 
  SiVercel, 
  SiDocker, 
  SiGoogleanalytics, 
  SiRedis, 
  SiNextdotjs, 
  SiExpress 
} from 'react-icons/si';
import { useAnalytics } from '../hooks/useAnalytics';

interface Technology {
  iconKey: string;
  nameKey: string;
  descriptionKey: string;
  color: string;
  icon: React.ReactNode;
  iconHover: React.ReactNode; // Hover'da renkli versiyon
  category: 'frontend' | 'backend' | 'tools';
}

const Technologies: React.FC = () => {
  const { t } = useTranslation();
  const { trackEvent, trackSectionView, trackSkillInteraction } = useAnalytics();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const technologies: Technology[] = [
    // Frontend
    {
      iconKey: 'react',
      nameKey: 'technologies.react',
      descriptionKey: 'technologies.descriptions.react',
      color: 'from-cyan-500 to-blue-500',
      icon: <FaReact className="text-4xl text-gray-400" />,
      iconHover: <FaReact className="text-4xl text-cyan-400" />,
      category: 'frontend'
    },
    {
      iconKey: 'typescript',
      nameKey: 'technologies.typescript',
      descriptionKey: 'technologies.descriptions.typescript',
      color: 'from-blue-600 to-blue-400',
      icon: <SiTypescript className="text-4xl text-gray-400" />,
      iconHover: <SiTypescript className="text-4xl text-blue-500" />,
      category: 'frontend'
    },
    {
      iconKey: 'expo',
      nameKey: 'technologies.expo',
      descriptionKey: 'technologies.descriptions.expo',
      color: 'from-gray-700 to-gray-900',
      icon: <SiExpo className="text-4xl text-gray-400" />,
      iconHover: <SiExpo className="text-4xl text-gray-300" />,
      category: 'frontend'
    },
    {
      iconKey: 'tailwind',
      nameKey: 'technologies.tailwind',
      descriptionKey: 'technologies.descriptions.tailwind',
      color: 'from-teal-500 to-cyan-500',
      icon: <SiTailwindcss className="text-4xl text-gray-400" />,
      iconHover: <SiTailwindcss className="text-4xl text-cyan-400" />,
      category: 'frontend'
    },
    {
      iconKey: 'html',
      nameKey: 'technologies.html',
      descriptionKey: 'technologies.descriptions.html',
      color: 'from-orange-500 to-red-500',
      icon: <FaHtml5 className="text-4xl text-gray-400" />,
      iconHover: <FaHtml5 className="text-4xl text-orange-500" />,
      category: 'frontend'
    },
    {
      iconKey: 'css',
      nameKey: 'technologies.css',
      descriptionKey: 'technologies.descriptions.css',
      color: 'from-blue-500 to-cyan-500',
      icon: <FaCss3Alt className="text-4xl text-gray-400" />,
      iconHover: <FaCss3Alt className="text-4xl text-blue-500" />,
      category: 'frontend'
    },
    // Backend
    {
      iconKey: 'nextjs',
      nameKey: 'technologies.nextjs',
      descriptionKey: 'technologies.descriptions.nextjs',
      color: 'from-gray-700 to-gray-900',
      icon: <SiNextdotjs className="text-4xl text-gray-400" />,
      iconHover: <SiNextdotjs className="text-4xl text-gray-200" />,
      category: 'backend'
    },
    {
      iconKey: 'nodejs',
      nameKey: 'technologies.nodejs',
      descriptionKey: 'technologies.descriptions.nodejs',
      color: 'from-green-600 to-green-400',
      icon: <FaNode className="text-4xl text-gray-400" />,
      iconHover: <FaNode className="text-4xl text-green-500" />,
      category: 'backend'
    },
    {
      iconKey: 'express',
      nameKey: 'technologies.express',
      descriptionKey: 'technologies.descriptions.express',
      color: 'from-gray-600 to-gray-800',
      icon: <SiExpress className="text-4xl text-gray-400" />,
      iconHover: <SiExpress className="text-4xl text-gray-300" />,
      category: 'backend'
    },
    {
      iconKey: 'postgresql',
      nameKey: 'technologies.postgresql',
      descriptionKey: 'technologies.descriptions.postgresql',
      color: 'from-blue-600 to-blue-400',
      icon: <FaDatabase className="text-4xl text-gray-400" />,
      iconHover: <FaDatabase className="text-4xl text-blue-500" />,
      category: 'backend'
    },
    // Tools
    {
      iconKey: 'git',
      nameKey: 'technologies.git',
      descriptionKey: 'technologies.descriptions.git',
      color: 'from-orange-600 to-red-600',
      icon: <FaGitAlt className="text-4xl text-gray-400" />,
      iconHover: <FaGitAlt className="text-4xl text-orange-500" />,
      category: 'tools'
    },
    {
      iconKey: 'redis',
      nameKey: 'technologies.redis',
      descriptionKey: 'technologies.descriptions.redis',
      color: 'from-red-500 to-red-700',
      icon: <SiRedis className="text-4xl text-gray-400" />,
      iconHover: <SiRedis className="text-4xl text-red-500" />,
      category: 'tools'
    },
    {
      iconKey: 'figma',
      nameKey: 'technologies.figma',
      descriptionKey: 'technologies.descriptions.figma',
      color: 'from-pink-500 to-purple-500',
      icon: <SiFigma className="text-4xl text-gray-400" />,
      iconHover: <SiFigma className="text-4xl text-pink-500" />,
      category: 'tools'
    },
    {
      iconKey: 'vercel',
      nameKey: 'technologies.vercel',
      descriptionKey: 'technologies.descriptions.vercel',
      color: 'from-gray-700 to-gray-900',
      icon: <SiVercel className="text-4xl text-gray-400" />,
      iconHover: <SiVercel className="text-4xl text-gray-200" />,
      category: 'tools'
    },
    {
      iconKey: 'docker',
      nameKey: 'technologies.docker',
      descriptionKey: 'technologies.descriptions.docker',
      color: 'from-blue-500 to-cyan-500',
      icon: <SiDocker className="text-4xl text-gray-400" />,
      iconHover: <SiDocker className="text-4xl text-blue-500" />,
      category: 'tools'
    },
    {
      iconKey: 'googleAnalytics',
      nameKey: 'technologies.googleAnalytics',
      descriptionKey: 'technologies.descriptions.googleAnalytics',
      color: 'from-orange-500 to-red-500',
      icon: <SiGoogleanalytics className="text-4xl text-gray-400" />,
      iconHover: <SiGoogleanalytics className="text-4xl text-orange-500" />,
      category: 'tools'
    }
  ];

  // Group technologies by category
  const technologiesByCategory = {
    frontend: technologies.filter(tech => tech.category === 'frontend'),
    backend: technologies.filter(tech => tech.category === 'backend'),
    tools: technologies.filter(tech => tech.category === 'tools')
  };

  // Track section view when component mounts
  useEffect(() => {
    trackSectionView('technologies', 0);
    trackEvent('technologies_section_view', {
      section_name: 'technologies',
      total_skills: technologies.length
    });
  }, [trackSectionView, trackEvent, technologies.length]);

  return (
    <section id="technologies" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-4 text-center fade-in-up inline-block group mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        {t('technologies.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-purple-500 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <p className="relative z-10 text-gray-400 text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl">
        {t('technologies.subtitle')}
      </p>

      <div className="relative z-10 w-full max-w-6xl space-y-12 sm:space-y-16">
        {/* Frontend Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg sm:text-xl font-semibold text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/30">
              {t('technologies.categories.frontend')}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {technologiesByCategory.frontend.map((tech, index) => (
              <motion.div
                key={tech.iconKey}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group relative h-24 sm:h-28"
                onMouseEnter={() => {
                  setHoveredCard(tech.iconKey);
                  trackSkillInteraction(tech.iconKey, 'frontend', 'hover', '');
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                }}
                onClick={() => {
                  trackSkillInteraction(tech.iconKey, 'frontend', 'click', '');
                }}
              >
                {/* Card Container with 3D Flip */}
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      rotateY: hoveredCard === tech.iconKey ? 180 : 0
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Front of Card - Icon */}
                    <div 
                      className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sm:p-5 hover:border-purple-500/50 hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <motion.div 
                        className="flex items-center justify-center"
                        animate={{
                          scale: hoveredCard === tech.iconKey ? 1.15 : 1,
                          rotate: hoveredCard === tech.iconKey ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {hoveredCard === tech.iconKey ? tech.iconHover : tech.icon}
                      </motion.div>
                    </div>

                    {/* Back of Card - Text */}
                    <div 
                      className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm border border-purple-500/50 rounded-lg p-3 sm:p-4 shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center text-center"
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="font-semibold text-sm sm:text-base mb-1 text-white">
                        {t(tech.nameKey)}
                      </div>
                      <div className="text-xs text-gray-300 leading-tight">
                        {t(tech.descriptionKey)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Backend Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg sm:text-xl font-semibold text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
              {t('technologies.categories.backend')}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
          </div>
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {technologiesByCategory.backend.map((tech, index) => (
              <motion.div
                key={tech.iconKey}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group relative h-24 sm:h-28"
                onMouseEnter={() => {
                  setHoveredCard(tech.iconKey);
                  trackSkillInteraction(tech.iconKey, 'backend', 'hover', '');
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                }}
                onClick={() => {
                  trackSkillInteraction(tech.iconKey, 'backend', 'click', '');
                }}
              >
                {/* Card Container with 3D Flip */}
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      rotateY: hoveredCard === tech.iconKey ? 180 : 0
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Front of Card - Icon */}
                    <div 
                      className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sm:p-5 hover:border-green-500/50 hover:shadow-green-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <motion.div 
                        className="flex items-center justify-center"
                        animate={{
                          scale: hoveredCard === tech.iconKey ? 1.15 : 1,
                          rotate: hoveredCard === tech.iconKey ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {hoveredCard === tech.iconKey ? tech.iconHover : tech.icon}
                      </motion.div>
                    </div>

                    {/* Back of Card - Text */}
                    <div 
                      className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm border border-green-500/50 rounded-lg p-3 sm:p-4 shadow-lg shadow-green-500/20 flex flex-col items-center justify-center text-center"
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="font-semibold text-sm sm:text-base mb-1 text-white">
                        {t(tech.nameKey)}
                      </div>
                      <div className="text-xs text-gray-300 leading-tight">
                        {t(tech.descriptionKey)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tools Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg sm:text-xl font-semibold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
              {t('technologies.categories.tools')}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {technologiesByCategory.tools.map((tech, index) => (
              <motion.div
                key={tech.iconKey}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group relative h-24 sm:h-28"
                onMouseEnter={() => {
                  setHoveredCard(tech.iconKey);
                  trackSkillInteraction(tech.iconKey, 'tools', 'hover', '');
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                }}
                onClick={() => {
                  trackSkillInteraction(tech.iconKey, 'tools', 'click', '');
                }}
              >
                {/* Card Container with 3D Flip */}
                <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      rotateY: hoveredCard === tech.iconKey ? 180 : 0
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Front of Card - Icon */}
                    <div 
                      className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sm:p-5 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <motion.div 
                        className="flex items-center justify-center"
                        animate={{
                          scale: hoveredCard === tech.iconKey ? 1.15 : 1,
                          rotate: hoveredCard === tech.iconKey ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {hoveredCard === tech.iconKey ? tech.iconHover : tech.icon}
                      </motion.div>
                    </div>

                    {/* Back of Card - Text */}
                    <div 
                      className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm border border-blue-500/50 rounded-lg p-3 sm:p-4 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center text-center"
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="font-semibold text-sm sm:text-base mb-1 text-white">
                        {t(tech.nameKey)}
                      </div>
                      <div className="text-xs text-gray-300 leading-tight">
                        {t(tech.descriptionKey)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technologies;
