import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Technologies from './components/Technologies';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';



const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Dil değiştiğinde sayfa başlığını güncelle
  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.language, t]);

  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Technologies />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;