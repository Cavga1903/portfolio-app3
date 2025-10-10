import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  speed?: number; // Parallax hızı (0.1 = yavaş, 1 = normal, 2 = hızlı)
  className?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children, 
  speed = 0.5,
  className = ''
}) => {
  const { scrollY } = useScroll();
  
  // Scroll pozisyonuna göre Y ekseninde hareket
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxBackground;

