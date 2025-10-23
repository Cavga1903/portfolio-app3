import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface TimelineItem {
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skills?: string[];
  logo?: string;
  website?: string;
}

const Experience: React.FC = () => {
  const { t } = useTranslation();

  const experiences: TimelineItem[] = [
    {
      type: 'work',
      title: t('experience.turkcell.title'),
      company: t('experience.turkcell.company'),
      location: t('experience.turkcell.location'),
      period: t('experience.turkcell.period'),
      description: t('experience.turkcell.description'),
      skills: ['Customer Service', 'Problem Solving', 'Communication'],
      logo: '/logos/turkcell.webp',
      website: 'https://globalbilgi.com.tr'
    },
    {
      type: 'work',
      title: t('experience.upwork.title'),
      company: t('experience.upwork.company'),
      location: t('experience.upwork.location'),
      period: t('experience.upwork.period'),
      description: t('experience.upwork.description'),
      skills: ['React Native', 'REST API', 'Supabase', 'Tailwind CSS', 'Firebase', 'JWT'],
      logo: '/logos/upwork.svg',
      website: 'https://www.upwork.com'
    },
    {
      type: 'education',
      title: t('experience.siliconmade.title'),
      company: t('experience.siliconmade.company'),
      location: t('experience.siliconmade.location'),
      period: t('experience.siliconmade.period'),
      description: t('experience.siliconmade.description'),
      skills: ['React', 'React Native', 'REST API', 'Supabase', 'Tailwind CSS', 'Git'],
      logo: '/logos/siliconmade.webp',
      website: 'https://www.siliconmadeacademy.com'
    },
    {
      type: 'work',
      title: t('experience.concentrix.title'),
      company: t('experience.concentrix.company'),
      location: t('experience.concentrix.location'),
      period: t('experience.concentrix.period'),
      description: t('experience.concentrix.description'),
      skills: ['Salesforce CRM', 'Customer Satisfaction', 'Banking'],
      logo: '/logos/concentrix.webp',
      website: 'https://www.concentrix.com'
    },
    {
      type: 'work',
      title: t('experience.izmir.title'),
      company: t('experience.izmir.company'),
      location: t('experience.izmir.location'),
      period: t('experience.izmir.period'),
      description: t('experience.izmir.description'),
      skills: ['Hardware & Software', 'System Administration', 'Technical Support', 'Teamwork'],
      logo: '/logos/izmir.svg',
      website: 'https://www.izmir.bel.tr/tr/Anasayfa'
    },
    {
      type: 'education',
      title: t('experience.uopeople.title'),
      company: t('experience.uopeople.company'),
      location: t('experience.uopeople.location'),
      period: t('experience.uopeople.period'),
      description: t('experience.uopeople.description'),
      skills: ['Computer Science', 'Algorithms', 'Data Structures'],
      logo: '/logos/uopeople_logo.webp',
      website: 'https://www.uopeople.edu'
    },
    {
      type: 'education',
      title: t('experience.anadolu.title'),
      company: t('experience.anadolu.company'),
      location: t('experience.anadolu.location'),
      period: t('experience.anadolu.period'),
      description: t('experience.anadolu.description'),
      skills: ['Computer Programming', 'Software Development'],
      logo: '/logos/anadolu.svg',
      website: 'https://www.anadolu.edu.tr'
    }
  ];

  return (
    <section id="experience" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-12 text-center fade-in-up inline-block group">
        {t('experience.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-emerald-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 opacity-30 z-10"></div>

          {/* Timeline items */}
          {experiences.map((item, index) => (
            <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'} fade-in-up group`}>
              {/* Timeline dot - On timeline center */}
              <div className="hidden md:block absolute top-[-15px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-gray-900 shadow-lg shadow-emerald-500/50 z-30 group-hover:scale-125 transition-transform duration-300"></div>

              {/* Content card */}
              <div className={`card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 p-6 hover:scale-[1.02] ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} relative`}>
                {/* Company Logo & Info */}
                <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Company Logo or Icon */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.logo ? (
                      // Company Logo
                      <img 
                        src={item.logo} 
                        alt={`${item.company} logo`}
                        className={`w-full h-full object-contain p-2 backdrop-blur-sm border border-gray-600/50 ${
                          item.company.includes('İzmir') || item.company.includes('Izmir') 
                            ? 'bg-[#194265]' 
                            : item.company.includes('Turkcell')
                            ? 'bg-[#2855AC]'
                            : item.company.includes('Concentrix')
                            ? 'bg-[#003D5B]'
                            : 'bg-white'
                        }`}
                      />
                    ) : (
                      // Fallback Icon
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.type === 'work' ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-cyan-500'}`}>
                        {item.type === 'work' ? (
                          <FaBriefcase className="text-2xl text-white" />
                        ) : (
                          <FaGraduationCap className="text-2xl text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 break-words">
                      {item.title}
                    </h3>
                    {item.website ? (
                      <a 
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base md:text-lg text-emerald-400/80 font-semibold hover:text-emerald-300 hover:underline transition-all duration-300 inline-block"
                      >
                        {item.company}
                      </a>
                    ) : (
                      <p className="text-base md:text-lg text-emerald-400/80 font-semibold">{item.company}</p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mb-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-emerald-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills */}
                {item.skills && (
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

