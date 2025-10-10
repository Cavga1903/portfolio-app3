import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SocialProof: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/Cavga1903',
      color: 'from-gray-700 to-gray-900',
      hoverColor: 'hover:shadow-gray-500/50',
      stats: t('socialProof.github.stats'),
      description: t('socialProof.github.description')
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/tolgaacavgaa',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'hover:shadow-blue-500/50',
      stats: t('socialProof.linkedin.stats'),
      description: t('socialProof.linkedin.description')
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/codewithcavga',
      color: 'from-purple-600 via-pink-600 to-orange-500',
      hoverColor: 'hover:shadow-pink-500/50',
      stats: '@codewithcavga',
      description: t('socialProof.instagram.description')
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('socialProof.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('socialProof.subtitle')}
          </p>
        </motion.div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`card bg-gradient-to-br ${social.color} p-1 rounded-xl shadow-xl hover:shadow-2xl ${social.hoverColor} transition-all duration-300 cursor-pointer group`}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-gray-900 rounded-lg p-6 h-full">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <social.icon className="text-4xl text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs text-gray-400 px-3 py-1 bg-gray-800/50 rounded-full">
                    {t('socialProof.followMe')}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {social.name}
                </h3>

                {/* Stats */}
                <p className="text-2xl font-bold text-white mb-3">
                  {social.stats}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {social.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-300 text-lg mb-6">
            {t('socialProof.cta')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://github.com/Cavga1903"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub className="text-xl" />
              {t('socialProof.followGitHub')}
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/tolgaacavgaa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin className="text-xl" />
              {t('socialProof.connectLinkedIn')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;

