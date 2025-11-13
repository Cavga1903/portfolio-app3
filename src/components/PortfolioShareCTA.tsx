import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaShareAlt, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ShareButtons from './ShareButtons';

const PortfolioShareCTA: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div 
        className="relative z-0 max-w-4xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
      >
        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl shadow-purple-500/50"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <FaShareAlt className="text-3xl text-white" />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
          {t('portfolioShare.title')}
        </h2>

        {/* Description */}
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {t('portfolioShare.description')}
        </p>

        {/* Share Buttons */}
        <div className="flex justify-center mb-8">
          <ShareButtons 
            url="https://www.cavga.dev"
            title={t('portfolioShare.shareTitle')}
            description={t('portfolioShare.shareDescription')}
            hashtags={['FrontendDeveloper', 'React', 'WebDevelopment', 'Portfolio']}
            showLabel={false}
          />
        </div>

        {/* Thank You Message */}
        <motion.div
          className="inline-flex items-center gap-2 text-emerald-300 font-semibold drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <FaHeart className="text-xl text-emerald-400 animate-pulse" />
          <span>{t('portfolioShare.thankYou')}</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PortfolioShareCTA;

