import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowDown, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  // Typing animation sequences based on language
  const getTypingSequence = () => {
    return [
      t('hero.typing.frontendDeveloper'),
      2000,
      t('hero.typing.reactSpecialist'),
      2000,
      t('hero.typing.uiuxEnthusiast'),
      2000,
      t('hero.typing.creativeCoder'),
      2000,
    ];
  };
  
  // Stagger animation for child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="hero" className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-25 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"
        />
      </div>

      {/* Content with Fade on Scroll */}
      <motion.div 
        className="relative z-10"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-300%"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {t('hero.greeting')}
        </motion.h1>
        
        {/* Typing Animation */}
        <motion.div 
          variants={itemVariants}
          className="text-2xl md:text-4xl font-semibold mb-8 text-cyan-400 h-16 flex items-center justify-center"
        >
          <TypeAnimation
            key={i18n.language} // Re-render when language changes
            sequence={getTypingSequence()}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
            className="inline-block"
          />
        </motion.div>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
          whileHover={{ color: '#ffffff' }}
          transition={{ duration: 0.3 }}
        >
          {t('hero.description')}
        </motion.p>
        
        {/* CTA Butonları - Primary/Secondary Design */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          {/* Primary Button - Hakkımda Daha Fazla */}
          <motion.a 
            href="#about" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl border border-blue-500/50 hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
              background: "linear-gradient(to right, #2563eb, #4f46e5)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('about');
            }}
          >
            <span className="relative z-10">{t('hero.ctaAbout')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
          
          {/* Secondary Link - Projelerimi İncele */}
          <motion.a 
            href="#projects" 
            className="group inline-flex items-center gap-2 text-lg font-medium text-blue-400 hover:text-blue-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 rounded-lg px-2 py-1"
            whileHover={{ 
              scale: 1.05,
              color: "#60a5fa"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('projects');
            }}
          >
            <span>{t('hero.ctaProjects')}</span>
            <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute top-100 bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ opacity: 1 }}
        >
          <FaArrowDown className="text-2xl text-blue-400 opacity-70 transition-opacity duration-300" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;