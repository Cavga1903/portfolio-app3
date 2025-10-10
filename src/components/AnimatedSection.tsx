import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  id, 
  className = '',
  delay = 0,
  direction = 'up'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, // Animasyon sadece bir kez oynar
    amount: 0.1, // Section'ın %10'u görününce tetikle
    margin: "0px 0px -100px 0px" // Biraz erken tetikle
  });

  // Yön bazlı animasyon varyantları
  const variants = {
    up: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    down: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
      }}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;

