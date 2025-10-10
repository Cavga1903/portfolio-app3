import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Technologies from './components/Technologies';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';



const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Dil değiştiğinde sayfa başlığını güncelle
  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.language, t]);

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Technologies />
      <Certificates />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;