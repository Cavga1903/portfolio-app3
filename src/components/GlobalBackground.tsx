import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../app/store/uiStore';
import ParticleBackground from './ParticleBackground';
import SnowflakeBackground from './SnowflakeBackground';
import NetworkBackground from './NetworkBackground';

const GlobalBackground: React.FC = () => {
  const { particleTheme } = useUIStore();
  const location = useLocation();

  // Don't show on admin dashboard (it has its own background)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particleTheme === 'colorful' && (
        <ParticleBackground particleCount={10000} particleSize={35} speed={0.00005} />
      )}
      {particleTheme === 'snowflakes' && (
        <SnowflakeBackground particleCount={10000} speed={0.00005} />
      )}
      {particleTheme === 'network' && (
        <NetworkBackground particleCount={500} minDistance={150} maxConnections={20} />
      )}
    </div>
  );
};

export default GlobalBackground;

