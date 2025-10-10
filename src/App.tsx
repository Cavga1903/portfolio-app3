import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Technologies from './components/Technologies';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';



const App: React.FC = () => {
  return (
    <div className="relative">
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