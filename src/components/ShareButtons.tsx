import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebook, FaWhatsapp, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  showLabel?: boolean;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  url, 
  title, 
  hashtags = [],
  showLabel = true
}) => {
  const { t } = useTranslation();
  const { isVisible, message, type, showToast, hideToast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    showToast(t('share.linkCopied'), 'success');
  };

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}${hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
  };

  const buttons = [
    { 
      name: 'LinkedIn', 
      icon: FaLinkedin, 
      color: '#0A66C2', 
      hoverColor: 'hover:bg-[#0A66C2]',
      link: shareLinks.linkedin 
    },
    { 
      name: 'X (Twitter)', 
      icon: FaXTwitter, 
      color: '#000000', 
      hoverColor: 'hover:bg-black',
      link: shareLinks.twitter 
    },
    { 
      name: 'Facebook', 
      icon: FaFacebook, 
      color: '#1877F2', 
      hoverColor: 'hover:bg-[#1877F2]',
      link: shareLinks.facebook 
    },
    { 
      name: 'WhatsApp', 
      icon: FaWhatsapp, 
      color: '#25D366', 
      hoverColor: 'hover:bg-[#25D366]',
      link: shareLinks.whatsapp 
    },
  ];

  return (
    <>
      {/* Toast Notification */}
      <Toast 
        message={message}
        isVisible={isVisible}
        onClose={hideToast}
        type={type}
        duration={3000}
      />

      <div className="flex flex-col gap-3">
        {showLabel && (
          <p className="text-sm text-gray-400 font-medium">{t('share.title')}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
        {buttons.map((button, index) => (
          <motion.a
            key={button.name}
            href={button.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-lg ${button.hoverColor} hover:text-white hover:border-transparent transition-all duration-300 group cursor-pointer`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title={`${t('share.shareOn')} ${button.name}`}
          >
            <button.icon className="text-xl text-gray-300 group-hover:text-white transition-colors" />
          </motion.a>
        ))}
        
        {/* Copy Link Button */}
        <motion.button
          onClick={copyToClipboard}
          className="p-3 bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-lg hover:bg-purple-500 hover:text-white hover:border-transparent transition-all duration-300 group cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title={t('share.copyLink')}
        >
          <FaLink className="text-xl text-gray-300 group-hover:text-white transition-colors" />
        </motion.button>
      </div>
    </div>
    </>
  );
};

export default ShareButtons;

