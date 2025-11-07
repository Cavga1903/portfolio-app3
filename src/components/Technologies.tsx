import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaGlobe, FaCog, FaDatabase, FaWrench, FaChevronDown } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiReact, SiExpo, SiNodedotjs, SiSupabase, SiFirebase, SiSalesforce, SiFigma, SiVercel, SiDocker, SiRailway, SiBootstrap, SiExpress, SiRender, SiGoogleanalytics, SiMongodb, SiPostgresql, SiMysql, SiRedis, SiRedux } from 'react-icons/si';
import { useAnalytics } from '../hooks/useAnalytics';

interface Technology {
  iconKey: string;
  nameKey: string;
  level: number;
  color: string;
  icon: React.ReactNode;
  category: string;
  levelText: string;
}

const Technologies: React.FC = () => {
  const { t } = useTranslation();
  const { trackEvent, trackSectionView, trackAccordionToggle, trackSkillInteraction, trackAccordionContentVisibility } = useAnalytics();
  
  // Accordion state
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['frontend'])); // Frontend açık başlasın
  const [rotatingIcons, setRotatingIcons] = useState<Set<string>>(new Set());
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Kategori bilgileri
  const categories = [
    {
      key: 'frontend',
      icon: <FaReact className="text-base" />,
      titleKey: 'technologies.categories.frontend',
      descriptionKey: 'technologies.descriptions.frontend',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'backend',
      icon: <FaCog className="text-base" />,
      titleKey: 'technologies.categories.backend',
      descriptionKey: 'technologies.descriptions.backend',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'database',
      icon: <FaDatabase className="text-base" />,
      titleKey: 'technologies.categories.database',
      descriptionKey: 'technologies.descriptions.database',
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'tools',
      icon: <FaWrench className="text-base" />,
      titleKey: 'technologies.categories.tools',
      descriptionKey: 'technologies.descriptions.tools',
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'languages',
      icon: <FaGlobe className="text-base" />,
      titleKey: 'technologies.categories.languages',
      descriptionKey: 'technologies.descriptions.languages',
      color: 'from-indigo-500 to-purple-500'
    }
  ];
  
  // Accordion toggle function with smooth scroll
  const toggleCategory = (categoryKey: string) => {
    const isCurrentlyOpen = openCategories.has(categoryKey);
    
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
        // Smooth scroll to opened accordion after a short delay
        setTimeout(() => {
          const accordionElement = accordionRefs.current[categoryKey];
          if (accordionElement) {
            accordionElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        }, 100);
      }
      return newSet;
    });
    
    // Icon rotation animation
    setRotatingIcons(prev => new Set([...prev, categoryKey]));
    setTimeout(() => {
      setRotatingIcons(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryKey);
        return newSet;
      });
    }, 300);
    
    // Enhanced analytics tracking
    trackAccordionToggle(categoryKey, isCurrentlyOpen ? 'close' : 'open');
    
    // Track content visibility when opening
    if (!isCurrentlyOpen) {
      const categoryTechs = groupedTechs[categoryKey] || [];
      trackAccordionContentVisibility(categoryKey, categoryTechs.length, categoryTechs.length);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, categoryKey: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCategory(categoryKey);
    }
  };
  
  const technologies: Technology[] = [
    // Frontend
    {
      iconKey: 'react',
      nameKey: 'technologies.react',
      level: 90,
      color: 'from-cyan-500 to-blue-500',
      icon: <SiReact className="text-5xl" />,
      category: 'frontend',
      levelText: 'expert'
    },
    {
      iconKey: 'javascript',
      nameKey: 'technologies.javascript',
      level: 90,
      color: 'from-yellow-500 to-orange-500',
      icon: <FaJs className="text-5xl" />,
      category: 'frontend',
      levelText: 'expert'
    },
    {
      iconKey: 'typescript',
      nameKey: 'technologies.typescript',
      level: 80,
      color: 'from-blue-600 to-blue-400',
      icon: <SiTypescript className="text-5xl" />,
      category: 'frontend',
      levelText: 'advanced'
    },
    {
      iconKey: 'expo',
      nameKey: 'technologies.expo',
      level: 80,
      color: 'from-gray-700 to-gray-900',
      icon: <SiExpo className="text-5xl" />,
      category: 'frontend',
      levelText: 'advanced'
    },
    {
      iconKey: 'redux',
      nameKey: 'technologies.redux',
      level: 75,
      color: 'from-purple-500 to-pink-500',
      icon: <SiRedux className="text-5xl" />,
      category: 'frontend',
      levelText: 'intermediate'
    },
    {
      iconKey: 'tailwind',
      nameKey: 'technologies.tailwind',
      level: 90,
      color: 'from-teal-500 to-cyan-500',
      icon: <SiTailwindcss className="text-5xl" />,
      category: 'frontend',
      levelText: 'expert'
    },
    {
      iconKey: 'html',
      nameKey: 'technologies.html',
      level: 90,
      color: 'from-orange-500 to-red-500',
      icon: <FaHtml5 className="text-5xl" />,
      category: 'frontend',
      levelText: 'expert'
    },
    {
      iconKey: 'css',
      nameKey: 'technologies.css',
      level: 90,
      color: 'from-blue-500 to-cyan-500',
      icon: <FaCss3Alt className="text-5xl" />,
      category: 'frontend',
      levelText: 'expert'
    },
    {
      iconKey: 'bootstrap',
      nameKey: 'technologies.bootstrap',
      level: 85,
      color: 'from-purple-500 to-pink-500',
      icon: <SiBootstrap className="text-5xl" />,
      category: 'frontend',
      levelText: 'advanced'
    },
    // Backend
    {
      iconKey: 'restful',
      nameKey: 'technologies.restful',
      level: 90,
      color: 'from-green-500 to-emerald-500',
      icon: <FaCog className="text-5xl" />,
      category: 'backend',
      levelText: 'expert'
    },
    {
      iconKey: 'jwt',
      nameKey: 'technologies.jwt',
      level: 70,
      color: 'from-yellow-500 to-orange-500',
      icon: <FaCog className="text-5xl" />,
      category: 'backend',
      levelText: 'intermediate'
    },
    {
      iconKey: 'nodejs',
      nameKey: 'technologies.nodejs',
      level: 70,
      color: 'from-green-600 to-green-400',
      icon: <SiNodedotjs className="text-5xl" />,
      category: 'backend',
      levelText: 'intermediate'
    },
    {
      iconKey: 'express',
      nameKey: 'technologies.express',
      level: 75,
      color: 'from-gray-600 to-gray-800',
      icon: <SiExpress className="text-5xl" />,
      category: 'backend',
      levelText: 'intermediate'
    },
    // Database
    {
      iconKey: 'supabase',
      nameKey: 'technologies.supabase',
      level: 80,
      color: 'from-green-500 to-emerald-500',
      icon: <SiSupabase className="text-5xl" />,
      category: 'database',
      levelText: 'advanced'
    },
    {
      iconKey: 'firebase',
      nameKey: 'technologies.firebase',
      level: 70,
      color: 'from-yellow-500 to-orange-500',
      icon: <SiFirebase className="text-5xl" />,
      category: 'database',
      levelText: 'intermediate'
    },
    {
      iconKey: 'mongodb',
      nameKey: 'technologies.mongodb',
      level: 75,
      color: 'from-green-600 to-green-400',
      icon: <SiMongodb className="text-5xl" />,
      category: 'database',
      levelText: 'intermediate'
    },
    {
      iconKey: 'postgresql',
      nameKey: 'technologies.postgresql',
      level: 70,
      color: 'from-blue-600 to-blue-400',
      icon: <SiPostgresql className="text-5xl" />,
      category: 'database',
      levelText: 'intermediate'
    },
    {
      iconKey: 'mysql',
      nameKey: 'technologies.mysql',
      level: 65,
      color: 'from-orange-500 to-orange-700',
      icon: <SiMysql className="text-5xl" />,
      category: 'database',
      levelText: 'intermediate'
    },
    {
      iconKey: 'redis',
      nameKey: 'technologies.redis',
      level: 60,
      color: 'from-red-500 to-red-700',
      icon: <SiRedis className="text-5xl" />,
      category: 'database',
      levelText: 'intermediate'
    },
    // Tools
    {
      iconKey: 'git',
      nameKey: 'technologies.git',
      level: 80,
      color: 'from-orange-600 to-red-600',
      icon: <FaGitAlt className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    {
      iconKey: 'salesforce',
      nameKey: 'technologies.salesforce',
      level: 70,
      color: 'from-blue-500 to-cyan-500',
      icon: <SiSalesforce className="text-5xl" />,
      category: 'tools',
      levelText: 'intermediate'
    },
    {
      iconKey: 'agile',
      nameKey: 'technologies.agile',
      level: 80,
      color: 'from-purple-500 to-pink-500',
      icon: <FaWrench className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    {
      iconKey: 'figma',
      nameKey: 'technologies.figma',
      level: 70,
      color: 'from-pink-500 to-purple-500',
      icon: <SiFigma className="text-5xl" />,
      category: 'tools',
      levelText: 'intermediate'
    },
    {
      iconKey: 'vercel',
      nameKey: 'technologies.vercel',
      level: 80,
      color: 'from-gray-700 to-gray-900',
      icon: <SiVercel className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    {
      iconKey: 'docker',
      nameKey: 'technologies.docker',
      level: 70,
      color: 'from-blue-500 to-cyan-500',
      icon: <SiDocker className="text-5xl" />,
      category: 'tools',
      levelText: 'intermediate'
    },
    {
      iconKey: 'render',
      nameKey: 'technologies.render',
      level: 80,
      color: 'from-green-500 to-emerald-500',
      icon: <SiRender className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    {
      iconKey: 'railway',
      nameKey: 'technologies.railway',
      level: 70,
      color: 'from-gray-600 to-gray-800',
      icon: <SiRailway className="text-5xl" />,
      category: 'tools',
      levelText: 'intermediate'
    },
    {
      iconKey: 'opengraph',
      nameKey: 'technologies.opengraph',
      level: 80,
      color: 'from-purple-500 to-pink-500',
      icon: <FaGlobe className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    {
      iconKey: 'googleAnalytics',
      nameKey: 'technologies.googleAnalytics',
      level: 85,
      color: 'from-orange-500 to-red-500',
      icon: <SiGoogleanalytics className="text-5xl" />,
      category: 'tools',
      levelText: 'advanced'
    },
    // Languages
    {
      iconKey: 'turkish',
      nameKey: 'technologies.turkish',
      level: 100,
      color: 'transparent',
      icon: <span className="text-5xl">🇹🇷</span>,
      category: 'languages',
      levelText: 'native'
    },
    {
      iconKey: 'english',
      nameKey: 'technologies.english',
      level: 80,
      color: 'transparent',
      icon: <span className="text-5xl">🇺🇸</span>,
      category: 'languages',
      levelText: 'advanced'
    },
    {
      iconKey: 'german',
      nameKey: 'technologies.german',
      level: 30,
      color: 'transparent',
      icon: <span className="text-5xl">🇩🇪</span>,
      category: 'languages',
      levelText: 'beginner'
    },
  ];
  
  // Group technologies by category (memoized for performance)
  const groupedTechs = useMemo(() => {
    return technologies.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {} as Record<string, Technology[]>);
  }, [technologies]);

  // Track section view when component mounts
  useEffect(() => {
    trackSectionView('technologies', 0);
    trackEvent('technologies_section_view', {
      section_name: 'technologies',
      total_skills: technologies.length,
      categories: categories.length
    });
  }, [trackSectionView, trackEvent, technologies.length, categories.length]);

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

      <div className="relative z-10 w-full max-w-6xl">
        <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 md:pb-16">
          {categories.map((category, categoryIndex) => {
            const isOpen = openCategories.has(category.key);
            const isRotating = rotatingIcons.has(category.key);
            const categoryTechs = groupedTechs[category.key] || [];
            
            return (
              <motion.div
                key={category.key}
                ref={(el) => {
                  accordionRefs.current[category.key] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: categoryIndex * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoothness
                }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600/50 hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* Accordion Header */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCategory(category.key);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, category.key)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-expanded={isOpen}
                  aria-controls={`accordion-content-${category.key}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Category Icon with Rotation */}
                    <motion.div 
                      className={`w-12 h-12 p-1 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                      animate={{ 
                        rotate: isRotating ? 180 : 0,
                        scale: isOpen ? 1.05 : 1
                      }}
                      transition={{ 
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {category.icon}
                    </motion.div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {t(category.titleKey)}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t(category.descriptionKey)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <motion.div 
                    className="text-gray-400"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <FaChevronDown className="text-lg" />
                  </motion.div>
                </motion.button>
                
                {/* Accordion Content with AnimatePresence */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`accordion-content-${category.key}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          },
                          opacity: {
                            duration: 0.3,
                            delay: 0.1
                          }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          },
                          opacity: {
                            duration: 0.2
                          }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 pt-4 sm:pt-6 ${
                        category.key === 'frontend' || category.key === 'tools' 
                          ? 'mb-16 sm:mb-20 md:mb-24' 
                          : 'mb-8 sm:mb-12 md:mb-16'
                      }`}>
                        <motion.div 
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {categoryTechs.map((tech, techIndex) => (
                            <motion.div
                              key={tech.iconKey}
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.2 + (techIndex * 0.03),
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }}
                              whileHover={{ 
                                scale: 1.05, 
                                y: -4,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 sm:p-4 hover:border-purple-500/50 hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => {
                                trackSkillInteraction(tech.iconKey, tech.category, 'hover', tech.levelText);
                              }}
                              onClick={() => {
                                trackSkillInteraction(tech.iconKey, tech.category, 'click', tech.levelText);
                              }}
                            >
                              {/* Skill Icon */}
                              <motion.div 
                                className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center text-white ${
                                  tech.category === 'languages' 
                                    ? 'bg-transparent' 
                                    : `bg-gradient-to-br ${tech.color}`
                                }`}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                {tech.icon}
                              </motion.div>
                              
                              {/* Skill Name */}
                              <h4 className="text-sm font-semibold text-center mb-2 group-hover:text-purple-500 transition-colors duration-300">
                                {t(tech.nameKey)}
                              </h4>
                              
                              {/* Skill Level */}
                              <div className="text-xs text-gray-400 text-center mb-2">
                                {t(`technologies.levels.${tech.levelText}`)}
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                  className={`h-1.5 rounded-full ${
                                    tech.category === 'languages' 
                                      ? 'bg-gradient-to-r from-gray-400 to-gray-600' 
                                      : `bg-gradient-to-r ${tech.color}`
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${tech.level}%` }}
                                  transition={{ 
                                    duration: 1,
                                    delay: 0.3 + (techIndex * 0.03),
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                  }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Technologies;