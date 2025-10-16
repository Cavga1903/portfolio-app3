import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaGlobe, FaCog, FaDatabase, FaWrench } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiReact, SiExpo, SiNodedotjs, SiSupabase, SiFirebase, SiSalesforce, SiFigma, SiVercel } from 'react-icons/si';

interface Technology {
  iconKey: string;
  nameKey: string;
  level: number;
  color: string;
  icon: React.ReactNode;
  category: string;
  levelText: string;
}

const Technologies: React.FC = () => {
  const { t } = useTranslation();
  
  const technologies: Technology[] = [
    // Frontend
    {
      iconKey: 'react-native',
      nameKey: 'technologies.reactNative',
      level: 90,
      color: 'from-cyan-500 to-blue-500',
      icon: <SiReact className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'react',
      nameKey: 'technologies.react',
      level: 90,
      color: 'from-cyan-500 to-blue-500',
      icon: <FaReact className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'javascript',
      nameKey: 'technologies.javascript',
      level: 90,
      color: 'from-yellow-500 to-orange-500',
      icon: <FaJs className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'typescript',
      nameKey: 'technologies.typescript',
      level: 80,
      color: 'from-blue-600 to-blue-400',
      icon: <SiTypescript className="text-5xl" />,
      category: 'frontend',
      levelText: 'İleri'
    },
    {
      iconKey: 'expo',
      nameKey: 'technologies.expo',
      level: 80,
      color: 'from-gray-700 to-gray-900',
      icon: <SiExpo className="text-5xl" />,
      category: 'frontend',
      levelText: 'İleri'
    },
    {
      iconKey: 'tailwind',
      nameKey: 'technologies.tailwind',
      level: 90,
      color: 'from-teal-500 to-cyan-500',
      icon: <SiTailwindcss className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'html',
      nameKey: 'technologies.html',
      level: 90,
      color: 'from-orange-500 to-red-500',
      icon: <FaHtml5 className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'css',
      nameKey: 'technologies.css',
      level: 90,
      color: 'from-blue-500 to-cyan-500',
      icon: <FaCss3Alt className="text-5xl" />,
      category: 'frontend',
      levelText: 'Uzman'
    },
    // Backend
    {
      iconKey: 'restful',
      nameKey: 'technologies.restful',
      level: 90,
      color: 'from-green-500 to-emerald-500',
      icon: <FaCog className="text-5xl" />,
      category: 'backend',
      levelText: 'Uzman'
    },
    {
      iconKey: 'jwt',
      nameKey: 'technologies.jwt',
      level: 70,
      color: 'from-yellow-500 to-orange-500',
      icon: <FaCog className="text-5xl" />,
      category: 'backend',
      levelText: 'Orta'
    },
    {
      iconKey: 'nodejs',
      nameKey: 'technologies.nodejs',
      level: 70,
      color: 'from-green-600 to-green-400',
      icon: <SiNodedotjs className="text-5xl" />,
      category: 'backend',
      levelText: 'Orta'
    },
    // Database
    {
      iconKey: 'supabase',
      nameKey: 'technologies.supabase',
      level: 80,
      color: 'from-green-500 to-emerald-500',
      icon: <SiSupabase className="text-5xl" />,
      category: 'database',
      levelText: 'İleri'
    },
    {
      iconKey: 'firebase',
      nameKey: 'technologies.firebase',
      level: 70,
      color: 'from-yellow-500 to-orange-500',
      icon: <SiFirebase className="text-5xl" />,
      category: 'database',
      levelText: 'Orta'
    },
    // Tools
    {
      iconKey: 'git',
      nameKey: 'technologies.git',
      level: 80,
      color: 'from-orange-600 to-red-600',
      icon: <FaGitAlt className="text-5xl" />,
      category: 'tools',
      levelText: 'İleri'
    },
    {
      iconKey: 'salesforce',
      nameKey: 'technologies.salesforce',
      level: 70,
      color: 'from-blue-500 to-cyan-500',
      icon: <SiSalesforce className="text-5xl" />,
      category: 'tools',
      levelText: 'Orta'
    },
    {
      iconKey: 'agile',
      nameKey: 'technologies.agile',
      level: 80,
      color: 'from-purple-500 to-pink-500',
      icon: <FaWrench className="text-5xl" />,
      category: 'tools',
      levelText: 'İleri'
    },
    {
      iconKey: 'figma',
      nameKey: 'technologies.figma',
      level: 70,
      color: 'from-pink-500 to-purple-500',
      icon: <SiFigma className="text-5xl" />,
      category: 'tools',
      levelText: 'Orta'
    },
    {
      iconKey: 'vercel',
      nameKey: 'technologies.vercel',
      level: 80,
      color: 'from-gray-700 to-gray-900',
      icon: <SiVercel className="text-5xl" />,
      category: 'tools',
      levelText: 'İleri'
    },
    // Languages
    {
      iconKey: 'turkish',
      nameKey: 'technologies.turkish',
      level: 100,
      color: 'from-red-500 to-red-700',
      icon: <FaGlobe className="text-5xl" />,
      category: 'languages',
      levelText: 'Uzman'
    },
    {
      iconKey: 'english',
      nameKey: 'technologies.english',
      level: 80,
      color: 'from-blue-500 to-blue-700',
      icon: <FaGlobe className="text-5xl" />,
      category: 'languages',
      levelText: 'İleri'
    },
    {
      iconKey: 'german',
      nameKey: 'technologies.german',
      level: 30,
      color: 'from-gray-400 to-gray-600',
      icon: <FaGlobe className="text-5xl" />,
      category: 'languages',
      levelText: 'Başlangıç'
    },
  ];
  
  // Group technologies by category
  const groupedTechs = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  const categories = [
    { key: 'frontend', title: t('technologies.categories.frontend'), icon: <FaCog className="text-2xl" /> },
    { key: 'backend', title: t('technologies.categories.backend'), icon: <FaCog className="text-2xl" /> },
    { key: 'database', title: t('technologies.categories.database'), icon: <FaDatabase className="text-2xl" /> },
    { key: 'tools', title: t('technologies.categories.tools'), icon: <FaWrench className="text-2xl" /> },
    { key: 'languages', title: t('technologies.categories.languages'), icon: <FaGlobe className="text-2xl" /> },
  ];

  return (
    <section id="technologies" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-4 text-center fade-in-up inline-block group">
        {t('technologies.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-purple-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <p className="relative z-10 text-gray-400 text-center mb-12 max-w-2xl">
        {t('technologies.subtitle')}
      </p>

      <div className="relative z-10 w-full max-w-7xl">
        {categories.map((category, categoryIndex) => (
          <div key={category.key} className="mb-12">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {category.title}
              </h3>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTechs[category.key]?.map((tech, index) => (
                <div 
                  key={tech.iconKey}
                  className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 p-4 group hover:scale-[1.02]"
                  style={{ animationDelay: `${(categoryIndex * 100) + (index * 50)}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`p-3 bg-gradient-to-br ${tech.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                      <div className="text-white">
                        {tech.icon}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                          {t(tech.nameKey)}
                        </h4>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          tech.levelText === 'Uzman' ? 'bg-green-500/20 text-green-400' :
                          tech.levelText === 'İleri' ? 'bg-blue-500/20 text-blue-400' :
                          tech.levelText === 'Orta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tech.levelText}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${tech.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${tech.level}%`,
                            animation: 'progressAnimation 1.5s ease-out'
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Technologies;