import React from 'react';

type Project = {
  title: string;
  description: string;
  technologies: string[];
};

const projects: Project[] = [
  {
    title: "Todo List Uygulaması",
    description: "Görev ekleme, tamamlama ve silme özellikli basit bir görev yönetim uygulaması.",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Portfolyo Websitesi",
    description: "Kişisel portfolyo sitem. Responsive tasarım ve modern UI içeriyor.",
    technologies: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    title: "Blog Sitesi",
    description: "Basit bir blog platformu. Yazı ekleme, düzenleme ve silme fonksiyonları ile.",
    technologies: ["React", "Node.js", "MongoDB"],
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Projelerim</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="card bg-base-100 shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="mb-4">{project.description}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Teknolojiler:</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="badge badge-outline">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;