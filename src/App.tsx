import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLumosCursor } from './hooks/useLumosCursor';
import Home from './pages/Home';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Lumos cursor effect
  useLumosCursor();

  // Dil değiştiğinde sayfa başlığını güncelle
  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.language, t]);

      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
};

export default App;