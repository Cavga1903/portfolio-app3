import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode, FaRocket, FaCalendar, FaTag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ProjectLikeButton from './ProjectLikeButton';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  imageGradient?: string;
  longDescription?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  duration?: string;
  role?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const { t } = useTranslation();

  // Prevent background page scroll while modal is open; restore on close
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.28 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/30 transform-gpu"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              willChange: 'transform, opacity'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className={`relative p-6 bg-gradient-to-r ${project.imageGradient || 'from-blue-500 to-purple-600'} text-white`}
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {/* Close Button and Like/Unlike Buttons - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                
                {/* Like/Unlike Buttons - Below Close Button */}
                <div className="flex flex-col gap-1">
                  <ProjectLikeButton 
                    projectId={project.title.toLowerCase().replace(/\s+/g, '-')}
                    projectTitle={project.title}
                    className="scale-75"
                  />
                </div>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-24">
                  <h2 className="text-2xl font-bold mb-1">{project.title}</h2>
                  <p className="text-base opacity-90 mb-3">{project.description}</p>
                  
                  {/* Project Meta */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {project.duration && (
                      <div className="flex items-center gap-1.5">
                        <FaCalendar className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                    {project.role && (
                      <div className="flex items-center gap-1.5">
                        <FaCode className="w-3 h-3" />
                        <span>{project.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[55vh] bg-white/80 dark:bg-gray-800/80 overscroll-contain">
                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FaTag className="w-4 h-4 text-blue-500" />
                      {t('modal.technologiesUsed')}
                    </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

                  {/* Long Description */}
                  {project.longDescription && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">{t('modal.projectOverview')}</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {project.longDescription}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaRocket className="w-4 h-4 text-green-500" />
                        {t('modal.keyFeatures')}
                      </h3>
                  <ul className="space-y-1.5">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid md:grid-cols-2 gap-6">
                      {project.challenges && project.challenges.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-orange-600">{t('modal.challenges')}</h3>
                      <ul className="space-y-1.5">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                      {project.solutions && project.solutions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-green-600">{t('modal.solutions')}</h3>
                      <ul className="space-y-1.5">
                        {project.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('modal.clickOutsideToClose')}
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                    >
                      <FaExternalLinkAlt className="w-3 h-3" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
