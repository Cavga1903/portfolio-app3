import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import NotFound from './components/NotFound';
import DynamicCV from './components/DynamicCV';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Dil değiştiğinde sayfa başlığını güncelle
  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.language, t]);

      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<DynamicCV />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
};

export default App;