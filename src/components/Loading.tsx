import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Text */}
        <p className="text-white text-lg font-semibold animate-pulse">Yükleniyor...</p>
      </div>
    </div>
  );
};

export default Loading;

