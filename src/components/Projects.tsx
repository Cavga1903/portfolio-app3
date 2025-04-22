import React from 'react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Projelerim</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Proje 1 */}
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Todo List Uygulaması</h3>
            <p className="mb-4">Görev ekleme, tamamlama ve silme özellikli basit bir görev yönetim uygulaması.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Teknolojiler:</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">HTML</span>
              <span className="badge badge-outline">CSS</span>
              <span className="badge badge-outline">JavaScript</span>
              <span className="badge badge-outline">React</span>
            </div>
          </div>
        </div>

        {/* Proje 2 */}
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Portfolyo Websitesi</h3>
            <p className="mb-4">Kişisel portfolyo sitem. Responsive tasarım ve modern UI içeriyor.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Teknolojiler:</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">React</span>
              <span className="badge badge-outline">TypeScript</span>
              <span className="badge badge-outline">TailwindCSS</span>
            </div>
          </div>
        </div>

        {/* Proje 3 */}
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Blog Sitesi</h3>
            <p className="mb-4">Basit bir blog platformu. Yazı ekleme, düzenleme ve silme fonksiyonları ile.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Teknolojiler:</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">React</span>
              <span className="badge badge-outline">Node.js</span>
              <span className="badge badge-outline">MongoDB</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;