import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaNpm } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss } from 'react-icons/si';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Technology {
  iconKey: string;
  nameKey: string;
  level: number;
  color: string;
  icon: React.ReactNode;
}

const Technologies: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'radar'>('cards');
  
  const technologies: Technology[] = [
    {
      iconKey: 'html',
      nameKey: 'technologies.html',
      level: 90,
      color: 'from-orange-500 to-red-500',
      icon: <FaHtml5 className="text-5xl" />
    },
    {
      iconKey: 'css',
      nameKey: 'technologies.css',
      level: 85,
      color: 'from-blue-500 to-cyan-500',
      icon: <FaCss3Alt className="text-5xl" />
    },
    {
      iconKey: 'javascript',
      nameKey: 'technologies.javascript',
      level: 88,
      color: 'from-yellow-500 to-orange-500',
      icon: <FaJs className="text-5xl" />
    },
    {
      iconKey: 'typescript',
      nameKey: 'technologies.typescript',
      level: 80,
      color: 'from-blue-600 to-blue-400',
      icon: <SiTypescript className="text-5xl" />
    },
    {
      iconKey: 'react',
      nameKey: 'technologies.react',
      level: 85,
      color: 'from-cyan-500 to-blue-500',
      icon: <FaReact className="text-5xl" />
    },
    {
      iconKey: 'tailwind',
      nameKey: 'technologies.tailwind',
      level: 90,
      color: 'from-teal-500 to-cyan-500',
      icon: <SiTailwindcss className="text-5xl" />
    },
    {
      iconKey: 'git',
      nameKey: 'technologies.git',
      level: 75,
      color: 'from-orange-600 to-red-600',
      icon: <FaGitAlt className="text-5xl" />
    },
    {
      iconKey: 'npm',
      nameKey: 'technologies.npm',
      level: 80,
      color: 'from-red-600 to-red-400',
      icon: <FaNpm className="text-5xl" />
    },
  ];

  // Prepare data for radar chart
  const radarData = technologies.map(tech => ({
    skill: t(tech.nameKey),
    level: tech.level,
    fullMark: 100,
  }));
  
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

      <p className="relative z-10 text-gray-400 text-center mb-8 max-w-2xl">
        {t('technologies.subtitle')}
      </p>

      {/* View Switcher */}
      <div className="relative z-10 flex gap-4 mb-12">
        <button
          onClick={() => setViewMode('cards')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            viewMode === 'cards'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          📊 Card View
        </button>
        <button
          onClick={() => setViewMode('radar')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            viewMode === 'radar'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          🎯 Radar Chart
        </button>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-up">
        {technologies.map((tech, index) => (
          <div 
            key={tech.iconKey}
            className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 p-6 group hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-6">
              {/* Icon */}
              <div className={`p-4 bg-gradient-to-br ${tech.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                <div className="text-white">
                  {tech.icon}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {t(tech.nameKey)}
                  </h3>
                  <span className="text-sm font-semibold text-purple-400">
                    {tech.level}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
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
      )}

      {/* Radar Chart View */}
      {viewMode === 'radar' && (
        <div className="relative z-10 w-full max-w-5xl fade-in-up">
          <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl p-8">
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData}>
                <PolarGrid 
                  stroke="#6b7280" 
                  strokeWidth={1}
                />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: '#e5e7eb', fontSize: 14, fontWeight: 600 }}
                  stroke="#6b7280"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Radar
                  name="Skill Level"
                  dataKey="level"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  dot={{
                    fill: '#ec4899',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                    r: 5,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#a855f7' }}
                  formatter={(value: number) => [`${value}%`, 'Level']}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: '#e5e7eb',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(technologies.reduce((acc, tech) => acc + tech.level, 0) / technologies.length)}%
                </p>
                <p className="text-sm text-gray-400 mt-1">Ortalama</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-2xl font-bold text-pink-400">
                  {Math.max(...technologies.map(t => t.level))}%
                </p>
                <p className="text-sm text-gray-400 mt-1">En Yüksek</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-2xl font-bold text-cyan-400">
                  {Math.min(...technologies.map(t => t.level))}%
                </p>
                <p className="text-sm text-gray-400 mt-1">En Düşük</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-2xl font-bold text-emerald-400">
                  {technologies.length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Teknoloji</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Technologies;