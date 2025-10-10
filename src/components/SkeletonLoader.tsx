import React from 'react';

interface SkeletonLoaderProps {
  type: 'hero' | 'about' | 'experience' | 'technologies' | 'certificates' | 'projects' | 'contact';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  const baseClasses = "animate-pulse bg-gray-700/30";

  if (type === 'hero') {
    return (
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-96 h-16 ${baseClasses} rounded-lg mb-6 mx-auto`}></div>
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-8 mx-auto`}></div>
        <div className={`w-80 h-6 ${baseClasses} rounded-lg mb-4 mx-auto`}></div>
        <div className="flex gap-4 mt-8">
          <div className={`w-40 h-12 ${baseClasses} rounded-lg`}></div>
          <div className={`w-40 h-12 ${baseClasses} rounded-lg`}></div>
        </div>
      </section>
    );
  }

  if (type === 'about') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-5xl">
          <div className={`w-full h-64 ${baseClasses} rounded-2xl mb-8`}></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-32 ${baseClasses} rounded-xl`}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === 'experience') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-4xl space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-48 ${baseClasses} rounded-2xl`}></div>
          ))}
        </div>
      </section>
    );
  }

  if (type === 'technologies') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`h-32 ${baseClasses} rounded-xl`}></div>
          ))}
        </div>
      </section>
    );
  }

  if (type === 'certificates') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`h-64 ${baseClasses} rounded-2xl`}></div>
          ))}
        </div>
      </section>
    );
  }

  if (type === 'projects') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-96 ${baseClasses} rounded-2xl`}></div>
          ))}
        </div>
      </section>
    );
  }

  if (type === 'contact') {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-800 via-gray-900 to-black text-white p-6">
        <div className={`w-64 h-12 ${baseClasses} rounded-lg mb-10 mx-auto`}></div>
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          <div className={`h-96 ${baseClasses} rounded-2xl`}></div>
          <div className={`h-96 ${baseClasses} rounded-2xl`}></div>
        </div>
      </section>
    );
  }

  return null;
};

export default SkeletonLoader;

