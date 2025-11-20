import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDarkMode } from '../hooks/useDarkMode';
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
const ProjectPlaceholder: React.FC<{ project: Project; t: (key: string) => string; isDarkMode: boolean }> = memo(({ project, t, isDarkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if project has a screenshot
  const screenshotPath = `/project-screenshots/${project.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
  
  // GitHub-style placeholder with code-like appearance
  const renderGitHubPlaceholder = () => (
    <div className={`w-full h-full flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* GitHub-style header */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-200 border-gray-300'
      }`}>
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className={`text-xs font-mono ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>index.js</div>
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
      <div className={`px-3 py-1.5 border-t text-xs ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 text-gray-400'
          : 'bg-gray-200 border-gray-300 text-gray-600'
      }`}>
        <div className="flex items-center justify-center">
          <span>{t('projects.clickToViewDetails')}</span>
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
            <div className={`text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="text-2xl mb-2">👁️</div>
              <div className="text-sm font-semibold">{t('projects.livePreview')}</div>
            </div>
        </div>
      )}
    </div>
  );
});

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { trackClick } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      longDescription: t('projects.items.portfolio.longDescription'),
      features: t('projects.items.portfolio.features', { returnObjects: true }) as string[],
      challenges: t('projects.items.portfolio.challenges', { returnObjects: true }) as string[],
      solutions: t('projects.items.portfolio.solutions', { returnObjects: true }) as string[],
      duration: t('projects.items.portfolio.duration'),
      role: t('projects.items.portfolio.role')
    },
    // 2. Workshop Tracker
    {
      title: t('projects.items.workshop.title'),
      description: t('projects.items.workshop.description'),
      technologies: ["React", "TypeScript", "Node.js", "Database"],
      github: "https://github.com/Cavga1903/workshop-tracker",
      link: "https://workshop-tracker-taupe.vercel.app",
      imageGradient: "from-green-500 to-teal-600",
      longDescription: t('projects.items.workshop.longDescription'),
      features: t('projects.items.workshop.features', { returnObjects: true }) as string[],
      duration: t('projects.items.workshop.duration'),
      role: t('projects.items.workshop.role')
    }
  ];

  // Responsive project count
  const getProjectCount = () => {
    if (typeof window === 'undefined') return 3; // SSR fallback
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [projectCount, setProjectCount] = useState(() => {
    // Safari uyumluluğu için client-side'da hesapla
    if (typeof window === 'undefined') return 3;
    return getProjectCount();
  });

  useEffect(() => {
    // Safari uyumluluğu için window kontrolü
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setProjectCount(getProjectCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality disabled - users can manually navigate

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
  // Removed: Desktop mouse drag disabled per request

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    trackClick('projects_next', 'carousel_navigation', 'Next slide');
  }, [projects.length, trackClick]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    trackClick('projects_prev', 'carousel_navigation', 'Previous slide');
  }, [projects.length, trackClick]);

  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const gridVariants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? 24 : -24,
      opacity: 0.95
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? -12 : 12,
      opacity: 0.98
    })
  };

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
    const maxVisible = Math.min(projectCount, projects.length);
    for (let i = 0; i < maxVisible; i++) {
      const index = currentIndex + i;
      if (index < projects.length) {
        visible.push({ ...projects[index], index });
      }
    }
    return visible;
  };

  return (
    <section id="projects" className={`py-20 md:py-24 lg:py-28 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('projects.title')}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-16">
          {/* Navigation Arrows - Inside container for better visibility */}
          {projects.length > projectCount && (
            <>
              <button
                onClick={() => { setSlideDirection(-1); prevSlide(); }}
                className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-2xl items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/50 hover:to-purple-500/50 transition-all duration-300 group"
                aria-label="Previous projects"
              >
                <FaChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>

              <button
                onClick={() => { setSlideDirection(1); nextSlide(); }}
                className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-2xl items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/50 hover:to-purple-500/50 transition-all duration-300 group"
                aria-label="Next projects"
              >
                <FaChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <motion.div
            ref={carouselRef}
            className={"grid gap-8 items-stretch transition-all duration-500 ease-in-out select-none"}
            style={{
              gridTemplateColumns: `repeat(${Math.min(projectCount, projects.length)}, 1fr)`
            }}
            custom={slideDirection}
            variants={gridVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { setSlideDirection(1); handleTouchEnd(); }}
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
                  className={"group cursor-pointer"}
                  onClick={() => {
                    handleProjectClick(project);
                  }}
                >
                      <div className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105 h-full flex flex-col border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}>
                    {/* Project Preview */}
                    <ProjectPlaceholder project={project} t={t} isDarkMode={isDarkMode} />
                    
                    {/* Project Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
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
                            className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded-full hover:bg-blue-200 hover:text-blue-800 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                            +{project.technologies.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 mt-auto">
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
                            <span>{t('projects.github')}</span>
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
                            <span>{t('projects.demo')}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>

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
          {projects.length > projectCount && (
            <div className="flex lg:hidden justify-center mt-6 space-x-4">
              <button
                onClick={() => { setSlideDirection(-1); prevSlide(); }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-lg items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 group flex"
                aria-label="Previous projects"
              >
                <FaChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>

              <button
                onClick={() => { setSlideDirection(1); nextSlide(); }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/30 rounded-full shadow-lg items-center justify-center text-white hover:text-blue-300 hover:scale-110 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 group flex"
                aria-label="Next projects"
              >
                <FaChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>

        {/* Auto-play disabled - users can manually navigate */}
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