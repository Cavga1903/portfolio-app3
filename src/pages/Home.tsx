import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import ScrollProgress from '../components/ScrollProgress';
import SkeletonLoader from '../components/SkeletonLoader';
import SEOHead from '../components/SEOHead';
import SocialProof from '../components/SocialProof';
import PortfolioShareCTA from '../components/PortfolioShareCTA';
import { LoginModal, SignupModal } from '../features/auth';
import { useAnalytics } from '../hooks/useAnalytics';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { usePerformanceTracking } from '../hooks/usePerformanceTracking';
import { useUserBehaviorTracking } from '../hooks/useUserBehaviorTracking';
import { useAdvancedClickTracking } from '../hooks/useAdvancedClickTracking';
import { useConversionTracking } from '../hooks/useConversionTracking';

// Lazy load components
const FirebaseDebug = lazy(() => import('../components/FirebaseDebug'));
const Hero = lazy(() => import('../components/Hero'));
const About = lazy(() => import('../components/About'));
const Experience = lazy(() => import('../components/Experience'));
const Technologies = lazy(() => import('../components/Technologies'));
const Services = lazy(() => import('../components/Services'));
const Certificates = lazy(() => import('../components/Certificates'));
const Projects = lazy(() => import('../components/Projects'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));

const Home: React.FC = () => {
  const { trackPageView } = useAnalytics();
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
  // Initialize all tracking hooks
  useScrollTracking();
  useTimeTracking('Home Page');
  usePerformanceTracking();
  useUserBehaviorTracking();
  useAdvancedClickTracking();
  useConversionTracking();

  // Track page view on mount
  useEffect(() => {
    trackPageView('/', 'Tolga Çavga - Portfolio');
  }, [trackPageView]);

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead 
        pageType="home"
        url="https://www.tolgacavga.com"
        type="website"
        imageWidth={1200}
        imageHeight={630}
        twitterCreator="@tolgacavga"
      />

      <motion.div 
        className="relative safe-area-container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <ScrollProgress />
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        
        <Suspense fallback={<SkeletonLoader type="hero" />}>
          <Hero />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="about" />}>
          <About />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="experience" />}>
          <Experience />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="certificates" />}>
          <Certificates />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="technologies" />}>
          <Technologies />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="about" />}>
          <Services />
        </Suspense>
        
        <Suspense fallback={<SkeletonLoader type="projects" />}>
          <Projects />
        </Suspense>
        
        {/* Social Proof Section */}
        <SocialProof />
        
        {/* Portfolio Share CTA - Only in development */}
        {process.env.NODE_ENV === 'development' && <PortfolioShareCTA />}
        
        <Suspense fallback={<SkeletonLoader type="contact" />}>
          <Contact />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse bg-gray-800/30 h-32" />}>
          <Footer />
        </Suspense>
        
        <ScrollToTop 
          onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
          showDebugPanel={showDebugPanel}
        />
        
        {/* Auth Modals - Rendered at page level, not navbar */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
        
        {/* LocalStorage Debug Panel - Only in development */}
        {process.env.NODE_ENV === 'development' && showDebugPanel && (
          <Suspense fallback={null}>
            <FirebaseDebug 
              isVisible={showDebugPanel} 
              onClose={() => setShowDebugPanel(false)} 
            />
          </Suspense>
        )}
      </motion.div>
    </>
  );
};

export default Home;

