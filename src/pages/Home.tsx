import React, { Suspense, lazy } from 'react';
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
  return (
    <div className="relative">
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
    </div>
  );
};

export default Home;

