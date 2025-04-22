import React from 'react';

const Technologies: React.FC = () => {
  return (
    <section id="technologies" className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Bildiklerim</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Teknoloji 1 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">🌐</span>
          <p className="mt-2 font-semibold">HTML</p>
        </div>

        {/* Teknoloji 2 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">🎨</span>
          <p className="mt-2 font-semibold">CSS</p>
        </div>

        {/* Teknoloji 3 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">⚡</span>
          <p className="mt-2 font-semibold">JavaScript</p>
        </div>

        {/* Teknoloji 4 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">⚛️</span>
          <p className="mt-2 font-semibold">React</p>
        </div>

        {/* Teknoloji 5 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">🛠️</span>
          <p className="mt-2 font-semibold">Git & GitHub</p>
        </div>

        {/* Teknoloji 6 */}
        <div className="card bg-base-100 shadow-md p-6 flex flex-col items-center justify-center hover:scale-105 transition">
          <span className="text-4xl">📘</span>
          <p className="mt-2 font-semibold">TypeScript</p>
        </div>
      </div>
    </section>
  );
};

export default Technologies;