import React, { useEffect, useState } from 'react';
import { FaCode } from 'react-icons/fa';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <FaCode className="text-5xl text-white" />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-300%">
          Tolga Çavga
        </h1>

        {/* Loading Text */}
        <p className="text-gray-400 text-lg mb-8 animate-pulse">
          Loading Portfolio<span className="inline-block animate-[bounce_1s_infinite]">.</span>
          <span className="inline-block animate-[bounce_1s_infinite_200ms]">.</span>
          <span className="inline-block animate-[bounce_1s_infinite_400ms]">.</span>
        </p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="mt-2 text-sm text-gray-400 font-semibold">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

