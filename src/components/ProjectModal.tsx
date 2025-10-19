import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode, FaRocket, FaCalendar, FaTag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

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

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 200,
              mass: 0.8
            }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className={`relative p-8 bg-gradient-to-r ${project.imageGradient || 'from-blue-500 to-purple-600'} text-white`}
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
                  <p className="text-lg opacity-90 mb-4">{project.description}</p>
                  
                  {/* Project Meta */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {project.duration && (
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                    {project.role && (
                      <div className="flex items-center gap-2">
                        <FaCode className="w-4 h-4" />
                        <span>{project.role}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 ml-6">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-800 hover:bg-white hover:scale-105 rounded-lg transition-all duration-200 shadow-lg"
                    >
                      <FaGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-800 hover:bg-white hover:scale-105 rounded-lg transition-all duration-200 shadow-lg"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh] bg-white/80 dark:bg-gray-800/80">
              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaTag className="w-5 h-5 text-blue-500" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long Description */}
              {project.longDescription && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Project Overview</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaRocket className="w-5 h-5 text-green-500" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid md:grid-cols-2 gap-8">
                  {project.challenges && project.challenges.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-orange-600">Challenges</h3>
                      <ul className="space-y-2">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions && project.solutions.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-600">Solutions</h3>
                      <ul className="space-y-2">
                        {project.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('modal.clickOutsideToClose')}
                </div>
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <FaGithub className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span>Visit Site</span>
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
