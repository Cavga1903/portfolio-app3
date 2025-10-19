import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPlay, FaPause } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import ProjectModal from './ProjectModal';

type Project = {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
  imageGradient?: string;
  longDescription?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  duration?: string;
  role?: string;
};

// Project placeholder component
const ProjectPlaceholder: React.FC<{ project: Project }> = memo(({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if project has a screenshot
  const screenshotPath = `/project-screenshots/${project.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
  
  // GitHub-style placeholder with code-like appearance
  const renderGitHubPlaceholder = () => (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      {/* GitHub-style header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono">index.js</div>
      </div>
      
      {/* Code-like content - more compact */}
      <div className="flex-1 p-2 font-mono text-xs">
        <div className="space-y-1">
          <div className="text-blue-400">
            <span className="text-gray-500">1</span> <span className="text-purple-400">const</span> <span className="text-yellow-300">{project.title.replace(/\s+/g, '')}</span> <span className="text-gray-300">= () =&gt;</span> <span className="text-gray-300">{'{'}</span>
          </div>
          <div className="text-green-400 ml-3">
            <span className="text-gray-500">2</span> <span className="text-gray-300">return</span> <span className="text-blue-300">(</span>
          </div>
          <div className="text-gray-300 ml-6">
            <span className="text-gray-500">3</span> <span className="text-yellow-300">&lt;div&gt;</span>
          </div>
          <div className="text-gray-300 ml-9">
            <span className="text-gray-500">4</span> <span className="text-green-300">// {project.title}</span>
          </div>
        </div>
      </div>
      
      {/* GitHub-style footer - more compact */}
      <div className="px-3 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>Click to view details</span>
          <div className="flex items-center space-x-3">
            <span>⭐ {Math.floor(Math.random() * 100) + 10}</span>
            <span>🍴 {Math.floor(Math.random() * 50) + 5}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="w-full h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden relative">
      {/* Try to load screenshot first */}
      {!imageError && (
        <img
          src={screenshotPath}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      )}
      
      {/* Show GitHub-style placeholder if no screenshot or error */}
      {(!imageLoaded || imageError) && renderGitHubPlaceholder()}
      
      {/* Overlay for screenshot */}
      {imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-2xl mb-2">👁️</div>
            <div className="text-sm font-semibold">Live Preview</div>
          </div>
        </div>
      )}
    </div>
  );
});

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { trackClick } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
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
      longDescription: "Modern ve responsive bir portfolyo web sitesi. React, TypeScript ve TailwindCSS kullanılarak geliştirildi. Framer Motion ile smooth animasyonlar ve çoklu dil desteği.",
      features: [
        "Responsive tasarım",
        "Çoklu dil desteği (TR, EN, DE, AZ)",
        "Smooth animasyonlar",
        "SEO optimizasyonu",
        "Dark/Light tema"
      ],
      challenges: [
        "Performans optimizasyonu",
        "Çoklu dil yönetimi",
        "Responsive tasarım"
      ],
      solutions: [
        "Lazy loading ve code splitting",
        "i18next kütüphanesi",
        "Mobile-first yaklaşım"
      ],
      duration: "2 ay",
      role: "Full Stack Developer"
    },
    // 2. Workshop Tracker
    {
      title: t('projects.items.workshop.title'),
      description: t('projects.items.workshop.description'),
      technologies: ["React", "TypeScript", "Node.js", "Database"],
      github: "https://github.com/Cavga1903/workshop-tracker",
      link: "https://workshop-tracker-taupe.vercel.app",
      imageGradient: "from-green-500 to-teal-600",
      longDescription: "Workshop ve etkinlik takip sistemi. Katılımcıların kayıt olabileceği, etkinlik detaylarını görüntüleyebileceği modern bir platform.",
      features: [
        "Kullanıcı kayıt sistemi",
        "Etkinlik yönetimi",
        "Real-time güncellemeler",
        "Admin paneli"
      ],
      duration: "1.5 ay",
      role: "Full Stack Developer"
    },
    // 3. IoT Cihaz Simülatörü
    {
      title: t('projects.items.iot.title'),
      description: t('projects.items.iot.description'),
      technologies: ["Node.js", "Express", "Docker", "Canvas", "QRCode"],
      github: "https://github.com/Cavga1903/iot-simulator",
      link: "https://iot-simulator-kqi7.onrender.com",
      imageGradient: "from-blue-500 to-cyan-600",
      longDescription: "IoT cihazlarını simüle eden web uygulaması. Gerçek zamanlı veri görselleştirme ve QR kod entegrasyonu.",
      features: [
        "Real-time data visualization",
        "QR kod entegrasyonu",
        "Docker containerization",
        "WebSocket bağlantısı"
      ],
      duration: "1 ay",
      role: "Backend Developer"
    },
    // 4. Furniro E-commerce
    {
      title: t('projects.items.furniro.title'),
      description: t('projects.items.furniro.description'),
      technologies: ["React", "JavaScript", "E-commerce", "Furniture"],
      github: "https://github.com/Cavga1903/eCommerce-WebsiteOdev4",
      link: "https://cavga1903.github.io/eCommerce-WebsiteOdev4/",
      imageGradient: "from-red-500 to-pink-600",
      longDescription: "Mobilya e-ticaret sitesi. Modern tasarım ve kullanıcı dostu arayüz ile mobilya ürünlerinin satışı.",
      features: [
        "Ürün kataloğu",
        "Sepet yönetimi",
        "Ödeme sistemi",
        "Responsive tasarım"
      ],
      duration: "3 hafta",
      role: "Frontend Developer"
    },
    // 5. CV Hazırlama
    {
      title: t('projects.items.cvPreparation.title'),
      description: t('projects.items.cvPreparation.description'),
      technologies: ["React", "JavaScript", "CV Builder", "PDF Generation"],
      github: "https://github.com/Cavga1903/cvPreparationApp",
      link: "https://cavga1903.github.io/cvPreparationApp/",
      imageGradient: "from-teal-500 to-cyan-600",
      longDescription: "Dinamik CV oluşturma ve PDF indirme özellikli web uygulaması. Kullanıcı dostu arayüz ve şablon sistemi.",
      features: [
        "Dinamik CV oluşturma",
        "PDF export",
        "Şablon sistemi",
        "Real-time preview"
      ],
      duration: "2 hafta",
      role: "Frontend Developer"
    },
    // 6. Online Grocery
    {
      title: t('projects.items.grocery.title'),
      description: t('projects.items.grocery.description'),
      technologies: ["React", "JavaScript", "E-commerce", "Grocery"],
      github: "https://github.com/Cavga1903/online-grocery-app",
      link: "https://cavga1903.github.io/online-grocery-app/",
      imageGradient: "from-orange-500 to-yellow-600",
      longDescription: "Online market uygulaması. Gıda ürünlerinin satışı ve teslimat takibi.",
      features: [
        "Ürün kategorileri",
        "Arama ve filtreleme",
        "Teslimat takibi",
        "Kullanıcı hesapları"
      ],
      duration: "2.5 hafta",
      role: "Full Stack Developer"
    },
    // 7. Todo App
    {
      title: t('projects.items.todo.title'),
      description: t('projects.items.todo.description'),
      technologies: ["React", "JavaScript", "Local Storage", "CRUD"],
      github: "https://github.com/Cavga1903/todo-app-ins",
      link: "https://cavga1903.github.io/todo-app-ins/",
      imageGradient: "from-indigo-500 to-purple-600",
      longDescription: "Görev yönetim uygulaması. CRUD operasyonları ve local storage entegrasyonu.",
      features: [
        "Görev ekleme/silme",
        "Durum güncelleme",
        "Local storage",
        "Responsive tasarım"
      ],
      duration: "1 hafta",
      role: "Frontend Developer"
    },
    // 8. Product Manager
    {
      title: t('projects.items.productManager.title'),
      description: t('projects.items.productManager.description'),
      technologies: ["React", "Supabase", "Database", "CRUD"],
      github: "https://github.com/Cavga1903/react-supabase-product-manager",
      link: "https://react-supabase-product-manager.vercel.app/login",
      imageGradient: "from-emerald-500 to-green-600",
      longDescription: "Ürün yönetim sistemi. Supabase backend ile CRUD operasyonları ve kullanıcı kimlik doğrulama.",
      features: [
        "Ürün CRUD operasyonları",
        "Kullanıcı kimlik doğrulama",
        "Supabase entegrasyonu",
        "Real-time güncellemeler"
      ],
      duration: "3 hafta",
      role: "Full Stack Developer"
    },
    // 9. Payment Form
    {
      title: t('projects.items.payment.title'),
      description: t('projects.items.payment.description'),
      technologies: ["React", "JavaScript", "Payment", "Form Validation"],
      github: "https://github.com/Cavga1903/odeme-formu",
      link: "https://cavga1903.github.io/odeme-formu/",
      imageGradient: "from-rose-500 to-pink-600",
      longDescription: "Ödeme formu uygulaması. Form validasyonu ve güvenli ödeme işlemleri.",
      features: [
        "Form validasyonu",
        "Güvenli ödeme",
        "Responsive tasarım",
        "Error handling"
      ],
      duration: "1 hafta",
      role: "Frontend Developer"
    },
    // 10. Global Identity
    {
      title: t('projects.items.globalIdentity.title'),
      description: t('projects.items.globalIdentity.description'),
      technologies: ["React", "JavaScript", "Identity", "Management"],
      github: "https://github.com/Cavga1903/global-identity-9",
      link: "https://cavga1903.github.io/global-identity-9/",
      imageGradient: "from-violet-500 to-purple-600",
      longDescription: "Küresel kimlik yönetim sistemi. Kullanıcı profilleri ve kimlik doğrulama.",
      features: [
        "Kullanıcı profilleri",
        "Kimlik doğrulama",
        "Güvenlik önlemleri",
        "Multi-language support"
      ],
      duration: "2 hafta",
      role: "Full Stack Developer"
    },
    // 11. Exchange Screen
    {
      title: t('projects.items.exchange.title'),
      description: t('projects.items.exchange.description'),
      technologies: ["React", "JavaScript", "Exchange", "Trading"],
      github: "https://github.com/Cavga1903/exchangeScreenOdev3",
      link: "https://cavga1903.github.io/exchangeScreenOdev3/",
      imageGradient: "from-amber-500 to-orange-600",
      longDescription: "Döviz kuru takip ve alım-satım ekranı. Real-time veri ve grafik görselleştirme.",
      features: [
        "Real-time döviz kurları",
        "Grafik görselleştirme",
        "Alım-satım simülasyonu",
        "Responsive tasarım"
      ],
      duration: "1.5 hafta",
      role: "Frontend Developer"
    },
    // 12. Dashboard
    {
      title: t('projects.items.dashboard.title'),
      description: t('projects.items.dashboard.description'),
      technologies: ["React", "JavaScript", "Dashboard", "Analytics"],
      github: "https://github.com/Cavga1903/dashboardOdev2",
      link: "https://cavga1903.github.io/dashboardOdev2/",
      imageGradient: "from-slate-500 to-gray-600",
      longDescription: "Analitik dashboard uygulaması. Veri görselleştirme ve raporlama sistemi.",
      features: [
        "Veri görselleştirme",
        "Analitik raporlar",
        "Interactive charts",
        "Export functionality"
      ],
      duration: "2 hafta",
      role: "Frontend Developer"
    }
  ];

  // Responsive project count
  const getProjectCount = () => {
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [projectCount, setProjectCount] = useState(getProjectCount());

  useEffect(() => {
    const handleResize = () => {
      setProjectCount(getProjectCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, projects.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
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
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    
    const currentX = e.clientX;
    const diff = currentX - dragStart;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStart === null) return;
    
    const threshold = 100;
    
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      setDragOffset(0);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    trackClick('projects_next', 'carousel_navigation', 'Next slide');
  }, [projects.length, trackClick]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    trackClick('projects_prev', 'carousel_navigation', 'Previous slide');
  }, [projects.length, trackClick]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    trackClick('project_modal_open', 'project_interaction', project.title);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Get visible projects
  const getVisibleProjects = () => {
    const visible = [];
    for (let i = 0; i < projectCount; i++) {
      const index = (currentIndex + i) % projects.length;
      visible.push({ ...projects[index], index });
    }
    return visible;
  };

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Modern web teknolojileri kullanarak geliştirdiğim projeler
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Liquid style, outside container */}
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full shadow-2xl items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
            aria-label="Previous projects"
          >
            <FaChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full shadow-2xl items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
            aria-label="Next projects"
          >
            <FaChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Projects Grid */}
          <div
            ref={carouselRef}
            className={`grid gap-8 transition-all duration-500 ease-in-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
            style={{
              gridTemplateColumns: `repeat(${projectCount}, 1fr)`,
              transform: isDragging ? `translateX(${dragOffset}px)` : undefined
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {getVisibleProjects().map((project, index) => (
              <motion.div
                key={`${project.title}-${project.index}`}
                ref={(el) => {
                  if (el) projectRefs.current[project.index] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                onClick={() => {
                  if (!isDragging && Math.abs(dragOffset) < 10) {
                    handleProjectClick(project);
                  }
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                  {/* Project Preview */}
                  <ProjectPlaceholder project={project} />
                  
                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 2).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackClick('project_github', 'external_link', project.title);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                        >
                          <FaGithub className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackClick('project_demo', 'external_link', project.title);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(projects.length / projectCount) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * projectCount)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / projectCount) === index
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex lg:hidden justify-center mt-6 space-x-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-lg items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 group flex"
              aria-label="Previous projects"
            >
              <FaChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-lg items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 group flex"
              aria-label="Next projects"
            >
              <FaChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isAutoPlaying
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
          >
            {isAutoPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default Projects;