import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Merhaba, ben Tolga! 👋</h1>
      <p className="text-lg md:text-2xl mb-8">
        Frontend Developer olarak yaratıcı ve modern web projeleri geliştiriyorum.
      </p>
      <a href="#about" className="btn btn-primary text-white text-lg">
        Hakkımda Daha Fazla
      </a>
    </section>
  );
};

export default Hero;