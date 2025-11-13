import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCertificate, FaTrophy, FaStar, FaAward, FaMedal, FaCheckCircle } from 'react-icons/fa';

interface Certificate {
  icon: React.ReactNode;
  titleKey: string;
  issuerKey: string;
  dateKey: string;
  descriptionKey: string;
  color: string;
  skills: string[];
}

const Certificates: React.FC = () => {
  const { t } = useTranslation();

  const certificates: Certificate[] = [
    {
      icon: <FaTrophy className="text-4xl" />,
      titleKey: 'certificates.siliconmade.title',
      issuerKey: 'certificates.siliconmade.issuer',
      dateKey: 'certificates.siliconmade.date',
      descriptionKey: 'certificates.siliconmade.description',
      color: 'from-yellow-500 to-orange-500',
      skills: t('certificates.skills.siliconmade', { returnObjects: true }) as string[]
    },
    {
      icon: <FaCertificate className="text-4xl" />,
      titleKey: 'certificates.frontend.title',
      issuerKey: 'certificates.frontend.issuer',
      dateKey: 'certificates.frontend.date',
      descriptionKey: 'certificates.frontend.description',
      color: 'from-blue-500 to-cyan-500',
      skills: t('certificates.skills.frontend', { returnObjects: true }) as string[]
    },
    {
      icon: <FaAward className="text-4xl" />,
      titleKey: 'certificates.react.title',
      issuerKey: 'certificates.react.issuer',
      dateKey: 'certificates.react.date',
      descriptionKey: 'certificates.react.description',
      color: 'from-cyan-500 to-blue-500',
      skills: t('certificates.skills.react', { returnObjects: true }) as string[]
    },
    {
      icon: <FaMedal className="text-4xl" />,
      titleKey: 'certificates.responsive.title',
      issuerKey: 'certificates.responsive.issuer',
      dateKey: 'certificates.responsive.date',
      descriptionKey: 'certificates.responsive.description',
      color: 'from-green-500 to-emerald-500',
      skills: t('certificates.skills.responsive', { returnObjects: true }) as string[]
    },
    {
      icon: <FaStar className="text-4xl" />,
      titleKey: 'certificates.javascript.title',
      issuerKey: 'certificates.javascript.issuer',
      dateKey: 'certificates.javascript.date',
      descriptionKey: 'certificates.javascript.description',
      color: 'from-yellow-500 to-amber-500',
      skills: t('certificates.skills.javascript', { returnObjects: true }) as string[]
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      titleKey: 'certificates.git.title',
      issuerKey: 'certificates.git.issuer',
      dateKey: 'certificates.git.date',
      descriptionKey: 'certificates.git.description',
      color: 'from-orange-500 to-red-500',
      skills: t('certificates.skills.git', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section id="certificates" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-20 md:py-24 lg:py-28 px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-4 text-center fade-in-up inline-block group">
        {t('certificates.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-yellow-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <p className="relative z-10 text-gray-400 text-center mb-12 max-w-2xl">
        {t('certificates.subtitle')}
      </p>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <div 
            key={index}
            className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 p-6 group hover:scale-[1.03] fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${cert.color} rounded-2xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <div className="text-white">
                {cert.icon}
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                {t(cert.titleKey)}
              </h3>
              <p className="text-sm text-gray-400 mb-1">{t(cert.issuerKey)}</p>
              <p className="text-xs text-gray-500 mb-3">{t(cert.dateKey)}</p>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {t(cert.descriptionKey)}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {cert.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="badge badge-outline badge-sm text-yellow-300 border-yellow-300 group-hover:badge-warning transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Stats */}
      <div className="relative z-10 w-full max-w-4xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-yellow-400 mb-2">6+</div>
          <div className="text-gray-400 text-sm">{t('certificates.stats.certificates')}</div>
        </div>
        <div className="card bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-cyan-400 mb-2">184</div>
          <div className="text-gray-400 text-sm">{t('certificates.stats.hours')}</div>
        </div>
        <div className="card bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-green-400 mb-2">10+</div>
          <div className="text-gray-400 text-sm">{t('certificates.stats.projects')}</div>
        </div>
        <div className="card bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl font-bold text-purple-400 mb-2">2+</div>
          <div className="text-gray-400 text-sm">{t('certificates.stats.experience')}</div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;

