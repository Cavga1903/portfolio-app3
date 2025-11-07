import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000,
  type = 'success' 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const colors = {
    success: {
      gradient: 'from-emerald-500 to-teal-500',
      icon: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50'
    },
    error: {
      gradient: 'from-red-500 to-pink-500',
      icon: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50'
    },
    info: {
      gradient: 'from-blue-500 to-purple-500',
      icon: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50'
    }
  };

  const colorScheme = colors[type];

  // Portal ile body'ye render et - her zaman en üstte görünsün
  const toastContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.3 
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[999999] max-w-sm sm:max-w-md w-full px-4 sm:top-20 pointer-events-auto"
          style={{ isolation: 'isolate' }}
        >
          <div className={`relative bg-gray-900/95 backdrop-blur-xl border ${colorScheme.border} rounded-xl shadow-2xl overflow-hidden`}>
            {/* Gradient Border Top */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.gradient}`} />
            
            {/* Content */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              {/* Icon */}
              <div className={`flex-shrink-0 p-2 ${colorScheme.bg} rounded-full`}>
                <FaCheckCircle className={`text-xl sm:text-2xl ${colorScheme.icon}`} />
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-white font-medium text-base sm:text-lg">
                  {message}
                </p>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-gray-400 group-hover:text-white transition-colors text-sm sm:text-base" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <motion.div
              className={`h-1 bg-gradient-to-r ${colorScheme.gradient}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal ile body'ye render et
  if (typeof window !== 'undefined') {
    return createPortal(toastContent, document.body);
  }

  return null;
};

export default Toast;

