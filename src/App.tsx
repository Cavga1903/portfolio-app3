import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppProvider } from './app/providers/AppProvider';
import { routes } from './app/router/routes';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Dil değiştiğinde sayfa başlığını güncelle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = t('pageTitle');
    }
  }, [i18n.language, t]);

  return (
    <AppProvider>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </AppProvider>
  );
};

export default App;
