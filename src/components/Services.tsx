import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaLaptopCode, 
  FaShoppingCart, 
  FaMobileAlt, 
  FaChartLine, 
  FaPaintBrush, 
  FaRocket,
  FaStore,
  FaBriefcase,
  FaUser,
  FaUtensils
} from 'react-icons/fa';

interface Service {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  category: 'b2b' | 'b2c';
  color: string;
  gradient: string;
}

const Services: React.FC = () => {
  const { t } = useTranslation();

  const services: Service[] = [
    // B2B Services
    {
      icon: <FaLaptopCode className="text-4xl" />,
      titleKey: 'services.corporate.title',
      descriptionKey: 'services.corporate.description',
      category: 'b2b',
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaRocket className="text-4xl" />,
      titleKey: 'services.landing.title',
      descriptionKey: 'services.landing.description',
      category: 'b2b',
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaShoppingCart className="text-4xl" />,
      titleKey: 'services.ecommerce.title',
      descriptionKey: 'services.ecommerce.description',
      category: 'b2b',
      color: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      titleKey: 'services.dashboard.title',
      descriptionKey: 'services.dashboard.description',
      category: 'b2b',
      color: 'text-orange-400',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <FaPaintBrush className="text-4xl" />,
      titleKey: 'services.redesign.title',
      descriptionKey: 'services.redesign.description',
      category: 'b2b',
      color: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <FaMobileAlt className="text-4xl" />,
      titleKey: 'services.responsive.title',
      descriptionKey: 'services.responsive.description',
      category: 'b2b',
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-500',
    },
    // B2C Services
    {
      icon: <FaBriefcase className="text-4xl" />,
      titleKey: 'services.portfolio.title',
      descriptionKey: 'services.portfolio.description',
      category: 'b2c',
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <FaStore className="text-4xl" />,
      titleKey: 'services.smallBusiness.title',
      descriptionKey: 'services.smallBusiness.description',
      category: 'b2c',
      color: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: <FaUtensils className="text-4xl" />,
      titleKey: 'services.restaurant.title',
      descriptionKey: 'services.restaurant.description',
      category: 'b2c',
      color: 'text-red-400',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: <FaUser className="text-4xl" />,
      titleKey: 'services.personal.title',
      descriptionKey: 'services.personal.description',
      category: 'b2c',
      color: 'text-violet-400',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const b2bServices = services.filter(s => s.category === 'b2b');
  const b2cServices = services.filter(s => s.category === 'b2c');

  return (
    <section 
      id="services" 
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 py-20 overflow-hidden mt-2"
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-4 text-center fade-in-up inline-block group">
        {t('services.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <p className="relative z-10 text-gray-400 text-center mb-16 max-w-2xl">
        {t('services.subtitle')}
      </p>

      <div className="relative z-10 w-full max-w-7xl space-y-16">
        {/* B2B Services */}
        <div>
          <div className="flex items-center gap-3 mb-8 fade-in-up">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <FaLaptopCode className="text-xl" />
              <h3 className="text-xl font-bold">{t('services.b2b')}</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {b2bServices.map((service, index) => (
              <div
                key={service.titleKey}
                className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 group cursor-pointer hover:scale-[1.05]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>

                <h4 className={`text-xl font-bold mb-2 ${service.color} group-hover:text-white transition-colors duration-300`}>
                  {t(service.titleKey)}
                </h4>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(service.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* B2C Services */}
        <div>
          <div className="flex items-center gap-3 mb-8 fade-in-up">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <FaUser className="text-xl" />
              <h3 className="text-xl font-bold">{t('services.b2c')}</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {b2cServices.map((service, index) => (
              <div
                key={service.titleKey}
                className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 group cursor-pointer hover:scale-[1.05]"
                style={{ animationDelay: `${(index + b2bServices.length) * 100}ms` }}
              >
                <div className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>

                <h4 className={`text-xl font-bold mb-2 ${service.color} group-hover:text-white transition-colors duration-300`}>
                  {t(service.titleKey)}
                </h4>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(service.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-16 text-center fade-in-up">
        <p className="text-gray-300 mb-6 text-lg">
          {t('services.cta')}
        </p>
        <a
          href="#contact"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {t('services.contactButton')}
        </a>
      </div>
    </section>
  );
};

export default Services;

