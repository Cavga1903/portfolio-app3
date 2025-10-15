import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

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

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
            {/* Project Image/Preview */}
            <div className="relative w-full h-40 overflow-hidden">
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
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors duration-300">{project.title}</h3>
                <p className="mb-4 text-gray-300">{project.description}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">{t('projects.tech')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="badge badge-outline group-hover:badge-primary transition-all duration-300">{tech}</span>
                  ))}
                </div>
                {/* CTA Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex-1 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub /> {t('projects.github')}
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaExternalLinkAlt /> {t('projects.demo')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;