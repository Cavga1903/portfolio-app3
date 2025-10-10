import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import ScrollProgress from '../components/ScrollProgress';
import SkeletonLoader from '../components/SkeletonLoader';

// Lazy load components
const Hero = lazy(() => import('../components/Hero'));
const About = lazy(() => import('../components/About'));
const Experience = lazy(() => import('../components/Experience'));
const Technologies = lazy(() => import('../components/Technologies'));
const Certificates = lazy(() => import('../components/Certificates'));
const Projects = lazy(() => import('../components/Projects'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));

const Home: React.FC = () => {
  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div 
      className="relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <ScrollProgress />
      <Navbar />
      
      <Suspense fallback={<SkeletonLoader type="hero" />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="about" />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="experience" />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="technologies" />}>
        <Technologies />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="certificates" />}>
        <Certificates />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="projects" />}>
        <Projects />
      </Suspense>
      
      <Suspense fallback={<SkeletonLoader type="contact" />}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={<div className="animate-pulse bg-gray-800/30 h-32" />}>
        <Footer />
      </Suspense>
      
      <ScrollToTop />
    </motion.div>
  );
};

export default Home;

