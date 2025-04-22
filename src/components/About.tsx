import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <div className="card w-full max-w-3xl bg-base-100 shadow-md hover:shadow-xl transition p-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Hakkımda</h2>
        <p className="text-lg leading-relaxed text-center">
          Merhaba! Ben Tolga. Yazılım geliştirme dünyasına büyük bir tutku ile adım attım.
          Frontend Developer olarak yaratıcı ve kullanıcı dostu web uygulamaları geliştirmekten büyük keyif alıyorum.
          Boş zamanlarımda yeni teknolojiler öğrenmek, kitap okumak ve spor yapmakla ilgileniyorum.
        </p>
      </div>
    </section>
  );
};

export default About;