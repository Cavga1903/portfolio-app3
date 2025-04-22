import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">İletişim</h2>

      <div className="card bg-base-100 shadow-md hover:shadow-xl transition p-8 w-full max-w-md flex flex-col items-center text-center">
        <p className="mb-4 text-lg">Bana ulaşmak için aşağıdaki kanalları kullanabilirsiniz:</p>

        <div className="flex flex-col gap-4 w-full">
          {/* E-posta Butonu */}
          <a
            href="mailto:cavgaa228@gmail.com"
            className="btn btn-outline w-full"
          >
            📧 E-posta Gönder
          </a>

          {/* LinkedIn Butonu */}
          <a
            href="https://www.linkedin.com/in/tolgaacavgaa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full"
          >
            🔗 LinkedIn Profilim
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;