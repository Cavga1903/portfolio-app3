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

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { trackProjectClick, trackCarouselInteraction } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const projects: Project[] = [
    {
      title: t('projects.items.iot.title'),
      description: t('projects.items.iot.description'),
      technologies: ["Node.js", "Express", "Docker", "Canvas", "QRCode"],
      github: "https://github.com/Cavga1903/iot-simulator",
      imageGradient: "from-blue-500 to-cyan-600",
    },
    {
      title: t('projects.items.todo.title'),
      description: t('projects.items.todo.description'),
      technologies: ["React", "JavaScript", "CSS3", "HTML5"],
      github: "https://github.com/Cavga1903/todo-app-ins",
      imageGradient: "from-pink-500 to-purple-600",
    },
    {
      title: t('projects.items.workshop.title'),
      description: t('projects.items.workshop.description'),
      technologies: ["React", "TypeScript", "Node.js", "Database"],
      github: "https://github.com/Cavga1903/workshop-tracker",
      imageGradient: "from-green-500 to-teal-600",
    },
    {
      title: t('projects.items.productManager.title'),
      description: t('projects.items.productManager.description'),
      technologies: ["React", "Supabase", "TypeScript", "TailwindCSS"],
      github: "https://github.com/Cavga1903/react-supabase-product-manager",
      imageGradient: "from-orange-500 to-red-600",
    },
    {
      title: t('projects.items.grocery.title'),
      description: t('projects.items.grocery.description'),
      technologies: ["React", "JavaScript", "E-commerce", "Payment"],
      github: "https://github.com/Cavga1903/online-grocery-app",
      imageGradient: "from-yellow-500 to-orange-600",
    },
    {
      title: t('projects.items.productList.title'),
      description: t('projects.items.productList.description'),
      technologies: ["React", "JavaScript", "LocalStorage", "Filtering"],
      github: "https://github.com/Cavga1903/urun-listesi-gelistirilmis",
      imageGradient: "from-indigo-500 to-blue-600",
    },
    {
      title: t('projects.items.paymentForm.title'),
      description: t('projects.items.paymentForm.description'),
      technologies: ["React", "Form Validation", "Payment", "UI/UX"],
      github: "https://github.com/Cavga1903/odeme-formu",
      imageGradient: "from-emerald-500 to-green-600",
    },
    {
      title: t('projects.items.globalIdentity.title'),
      description: t('projects.items.globalIdentity.description'),
      technologies: ["React", "Authentication", "Security", "Multi-platform"],
      github: "https://github.com/Cavga1903/global-identity-9",
      imageGradient: "from-violet-500 to-purple-600",
    },
    {
      title: t('projects.items.noteTracker.title'),
      description: t('projects.items.noteTracker.description'),
      technologies: ["React", "JavaScript", "Notes", "LocalStorage"],
      github: "https://github.com/Cavga1903/basitNotTakipSistemi",
      imageGradient: "from-rose-500 to-pink-600",
    },
    {
      title: t('projects.items.loginUI.title'),
      description: t('projects.items.loginUI.description'),
      technologies: ["React", "TypeScript", "UI/UX", "Form Validation"],
      github: "https://github.com/Cavga1903/login-ui-tsx-app",
      imageGradient: "from-sky-500 to-blue-600",
    },
    {
      title: t('projects.items.nodeNotes.title'),
      description: t('projects.items.nodeNotes.description'),
      technologies: ["Node.js", "Express", "Database", "RESTful API"],
      github: "https://github.com/Cavga1903/node.js-Notlar-uygulamas-",
      imageGradient: "from-lime-500 to-green-600",
    },
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
                    .map((project, index) => (
                        <a
                          key={pageIndex * itemsPerPage + index}
                          href={project.github || '#'}
                          target={project.github ? "_blank" : "_self"}
                          rel={project.github ? "noopener noreferrer" : ""}
                          className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
                          onMouseEnter={() => setIsAutoPlaying(false)}
                          onMouseLeave={() => setIsAutoPlaying(true)}
                          onClick={() => {
                            if (project.github) {
                              trackProjectClick(project.title, 'github', project.github);
                            }
                          }}
                        >
                      {/* Project Image/Preview */}
                      <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
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
                        {/* Badge overlay */}
                        <div className="absolute top-3 right-3 badge badge-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {t('projects.details')}
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
                          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                            {project.technologies.map((tech, idx) => (
                              <span key={idx} className="badge badge-outline badge-xs sm:badge-sm group-hover:badge-primary transition-all duration-300">{tech}</span>
                            ))}
                          </div>
                          {/* GitHub Icon Overlay */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                              <FaGithub className="text-white text-lg" />
                            </div>
                          </div>
                        </div>
                      </div>
                        </a>
                      ))}
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