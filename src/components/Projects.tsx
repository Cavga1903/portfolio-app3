import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';

type Project = {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
  imageGradient?: string;
};

// Enhanced iframe component with better loading and placeholder
const LazyIframe: React.FC<{ src: string; title: string; isVisible: boolean; projectName: string }> = ({ src, title, isVisible, projectName }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { trackIframeInteraction } = useAnalytics();

  useEffect(() => {
    if (isVisible && !shouldLoad) {
      // Immediate loading for visible items
      setShouldLoad(true);
    }
  }, [isVisible, shouldLoad]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    // Prevent iframe from affecting page scroll
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = 'none';
    }
    // Track iframe load
    trackIframeInteraction(projectName, 'load');
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    // Track iframe error
    trackIframeInteraction(projectName, 'error');
  };

  if (!shouldLoad) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center relative overflow-hidden">
        {/* Animated placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/70 rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-white/60 text-xs">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/80 to-gray-800/80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white/70 rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-white/70 text-xs">Yükleniyor...</div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-2">⚠️</div>
            <div className="text-white/70 text-xs">Demo yüklenemedi</div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full border-0"
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="eager"
        style={{ 
          transform: 'scale(0.25)',
          transformOrigin: 'top left',
          width: '400%',
          height: '400%'
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { trackProjectClick, trackCarouselInteraction } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<Set<number>>(new Set());
  const carouselRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

const projects: Project[] = [
    // 1. Kişisel Portfolio
    {
      title: t('projects.items.portfolio.title'),
      description: t('projects.items.portfolio.description'),
      technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
      github: "https://github.com/Cavga1903/portfolio-app3",
      link: "https://www.tolgacavga.com",
      imageGradient: "from-purple-500 to-indigo-600",
    },
    // 2. Workshop Tracker
    {
      title: t('projects.items.workshop.title'),
      description: t('projects.items.workshop.description'),
      technologies: ["React", "TypeScript", "Node.js", "Database"],
      github: "https://github.com/Cavga1903/workshop-tracker",
      link: "https://workshop-tracker-taupe.vercel.app",
      imageGradient: "from-green-500 to-teal-600",
    },
    // 3. IoT Cihaz Simülatörü
    {
      title: t('projects.items.iot.title'),
      description: t('projects.items.iot.description'),
      technologies: ["Node.js", "Express", "Docker", "Canvas", "QRCode"],
      github: "https://github.com/Cavga1903/iot-simulator",
      link: "https://iot-simulator-kqi7.onrender.com",
      imageGradient: "from-blue-500 to-cyan-600",
    },
    // 4. Furniro E-commerce
    {
      title: t('projects.items.furniro.title'),
      description: t('projects.items.furniro.description'),
      technologies: ["React", "JavaScript", "E-commerce", "Furniture"],
      github: "https://github.com/Cavga1903/eCommerce-WebsiteOdev4",
      link: "https://cavga1903.github.io/eCommerce-WebsiteOdev4/",
      imageGradient: "from-red-500 to-pink-600",
    },
    // 5. CV Hazırlama
    {
      title: t('projects.items.cvPreparation.title'),
      description: t('projects.items.cvPreparation.description'),
      technologies: ["React", "JavaScript", "CV Builder", "PDF Generation"],
      github: "https://github.com/Cavga1903/cvPreparationApp",
      link: "https://cavga1903.github.io/cvPreparationApp/",
      imageGradient: "from-teal-500 to-cyan-600",
    },
    // 6. Online Grocery
    {
      title: t('projects.items.grocery.title'),
      description: t('projects.items.grocery.description'),
      technologies: ["React", "JavaScript", "E-commerce", "Payment"],
      github: "https://github.com/Cavga1903/online-grocery-app",
      link: "https://cavga1903.github.io/online-grocery-app/",
      imageGradient: "from-yellow-500 to-orange-600",
    },
    // 7. Todo App
    {
      title: t('projects.items.todo.title'),
      description: t('projects.items.todo.description'),
      technologies: ["React", "JavaScript", "CSS3", "HTML5"],
      github: "https://github.com/Cavga1903/todo-app-ins",
      link: "https://cavga1903.github.io/todo-app-ins/",
      imageGradient: "from-pink-500 to-purple-600",
    },
    // 8. React Supabase Product Manager
    {
      title: t('projects.items.productManager.title'),
      description: t('projects.items.productManager.description'),
      technologies: ["React", "Supabase", "TypeScript", "TailwindCSS"],
      github: "https://github.com/Cavga1903/react-supabase-product-manager",
      link: "https://react-supabase-product-manager.vercel.app/login",
      imageGradient: "from-orange-500 to-red-600",
    },
    // 9. Ödeme Formu
    {
      title: t('projects.items.paymentForm.title'),
      description: t('projects.items.paymentForm.description'),
      technologies: ["React", "Form Validation", "Payment", "UI/UX"],
      github: "https://github.com/Cavga1903/odeme-formu",
      link: "https://cavga1903.github.io/odeme-formu/",
      imageGradient: "from-emerald-500 to-green-600",
    },
    // 10. Global Identity
    {
      title: t('projects.items.globalIdentity.title'),
      description: t('projects.items.globalIdentity.description'),
      technologies: ["React", "Authentication", "Security", "Multi-platform"],
      github: "https://github.com/Cavga1903/global-identity-9",
      link: "https://cavga1903.github.io/global-identity-9/",
      imageGradient: "from-violet-500 to-purple-600",
    },
    // 11. Exchange Screen
    {
      title: t('projects.items.exchangeScreen.title'),
      description: t('projects.items.exchangeScreen.description'),
      technologies: ["JavaScript", "HTML5", "CSS3", "Currency API"],
      github: "https://github.com/Cavga1903/exchangeScreenOdev3",
      link: "https://cavga1903.github.io/exchangeScreenOdev3/",
      imageGradient: "from-indigo-500 to-blue-600",
    },
    // 12. Dashboard
    {
      title: t('projects.items.dashboard.title'),
      description: t('projects.items.dashboard.description'),
      technologies: ["HTML5", "CSS3", "JavaScript", "Dashboard UI"],
      github: "https://github.com/Cavga1903/dashboardOdev2",
      link: "https://cavga1903.github.io/dashboardOdev2/",
      imageGradient: "from-slate-500 to-gray-600",
    }
  ];
  
  // Carousel logic - responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(3);
  
  // Update items per page based on screen size - more detailed breakpoints
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1); // Mobile S: 1 item
      } else if (width < 768) {
        setItemsPerPage(1); // Mobile M: 1 item
      } else if (width < 1024) {
        setItemsPerPage(2); // Tablet: 2 items
      } else if (width < 1280) {
        setItemsPerPage(3); // Desktop S: 3 items
      } else {
        setItemsPerPage(3); // Desktop L: 3 items
      }
    };
    
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);
  
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  
  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % totalPages;
    setCurrentIndex(newIndex);
    trackCarouselInteraction('next', newIndex + 1, totalPages);
  }, [currentIndex, totalPages, trackCarouselInteraction]);
  
  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + totalPages) % totalPages;
    setCurrentIndex(newIndex);
    trackCarouselInteraction('previous', newIndex + 1, totalPages);
  }, [currentIndex, totalPages, trackCarouselInteraction]);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    trackCarouselInteraction('dot_click', index + 1, totalPages);
  }, [totalPages, trackCarouselInteraction]);
  
  // Touch/Swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      trackCarouselInteraction('swipe_left', currentIndex + 1, totalPages);
      nextSlide();
    } else if (isRightSwipe) {
      trackCarouselInteraction('swipe_right', currentIndex + 1, totalPages);
      prevSlide();
    }
    
    // Restart auto-play after 3 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };
  
  // Enhanced Intersection Observer for faster loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-project-index') || '0');
            setVisibleProjects(prev => new Set([...prev, index]));
          }
        });
      },
      { 
        rootMargin: '200px', // Increased margin for earlier loading
        threshold: 0.01 // Lower threshold for faster triggering
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects.length]);

  // Preload all projects after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const allIndices = projects.map((_, index) => index);
      setVisibleProjects(new Set(allIndices));
    }, 1000); // Load all after 1 second

    return () => clearTimeout(timer);
  }, [projects.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 saniyede bir değişir
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, nextSlide]);
  
  return (
    <section id="projects" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-10 text-center fade-in-up inline-block group">
        {t('projects.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-indigo-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      {/* Carousel Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Previous projects"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Next projects"
        >
          <FaChevronRight className="text-xl" />
        </button>

        {/* Carousel Content */}
        <div 
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={carouselRef}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">
                <div className={`grid gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 ${
                  itemsPerPage === 1 ? 'grid-cols-1' : 
                  itemsPerPage === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {projects
                    .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                    .map((project, index) => {
                      const globalIndex = pageIndex * itemsPerPage + index;
                      return (
                        <div
                          key={globalIndex}
                          ref={(el) => { projectRefs.current[globalIndex] = el; }}
                          data-project-index={globalIndex}
                          className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group"
                          onMouseEnter={() => setIsAutoPlaying(false)}
                          onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                      {/* Project Image/Preview */}
                      <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden">
                        {project.link ? (
                          // Canlı demo preview - LazyIframe ile optimize edilmiş
                          <div className="relative w-full h-full">
                            <LazyIframe
                              src={project.link}
                              title={`${project.title} Preview`}
                              isVisible={visibleProjects.has(globalIndex)}
                              projectName={project.title}
                            />
                            {/* Demo link indicator */}
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                              LIVE
                            </div>
                          </div>
                        ) : (
                          // GitHub Preview benzeri placeholder
                          <div className={`w-full h-full bg-gradient-to-br ${project.imageGradient} flex items-center justify-center relative overflow-hidden`}>
                            {/* Decorative elements */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white rounded"></div>
                              <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
                              <div className="absolute bottom-8 left-8 w-20 h-2 bg-white rounded"></div>
                              <div className="absolute bottom-12 left-8 w-14 h-2 bg-white rounded"></div>
                              <div className="absolute bottom-16 left-8 w-16 h-2 bg-white rounded"></div>
                            </div>
                            {/* Center icon */}
                            <FaGithub className="text-white/20 text-6xl group-hover:scale-110 transition-transform duration-300" />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                          </div>
                        )}
                        {/* GitHub Icon Overlay - Top Right */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                            <FaGithub className="text-white text-lg" />
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-3 sm:p-4 md:p-6 flex flex-col justify-between flex-grow">
            <div>
                          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors duration-300">{project.title}</h3>
                          <p className="mb-3 sm:mb-4 text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">{project.description}</p>
            </div>
            <div>
                          <p className="font-semibold mb-2 text-xs sm:text-sm">{t('projects.tech')}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech, idx) => (
                              <span key={idx} className="badge badge-outline badge-xs sm:badge-sm group-hover:badge-primary transition-all duration-300">{tech}</span>
                ))}
              </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            {project.link ? (
                              <>
                                {/* Canlı Demo Button */}
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  onClick={() => {
                                    trackProjectClick(project.title, 'demo', project.link!);
                                  }}
                                >
                                  {t('projects.demo')}
                                </a>
                                {/* GitHub Button */}
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-blue-400 border border-blue-400 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  onClick={() => {
                                    if (project.github) {
                                      trackProjectClick(project.title, 'github', project.github);
                                    }
                                  }}
                                >
                                  GitHub
                                </a>
                              </>
                            ) : (
                              /* Sadece GitHub Button */
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gray-700 hover:bg-gray-600 text-blue-400 border border-blue-400 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => {
                                  if (project.github) {
                                    trackProjectClick(project.title, 'github', project.github);
                                  }
                                }}
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                        </div>
                      );
                    })}
            </div>
          </div>
        ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-indigo-500 scale-125'
                  : 'bg-gray-600 hover:bg-gray-500 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;