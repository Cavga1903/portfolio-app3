import { useState, useCallback } from 'react';

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'success') => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    message,
    type,
    showToast,
    hideToast
  };
};

