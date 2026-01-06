import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CursorEffectProps {
  children: React.ReactNode;
  className?: string;
}

export const CursorGlow: React.FC<CursorEffectProps> = ({ children, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      return () => element.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(46, 204, 113, 0.1), transparent 40%)`
      }}
    >
      {children}
    </div>
  );
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  glowing?: boolean;
}

export const BuboTooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  glowing = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 px-3 py-2 text-xs font-medium text-cloud-white bg-card border border-slate-gray/50 rounded-lg shadow-lg backdrop-blur-sm whitespace-nowrap ${positionClasses[position]} ${
              glowing ? 'bubo-glow-green' : ''
            }`}
          >
            {content}
            <div 
              className={`absolute w-2 h-2 bg-card border-slate-gray/50 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-r' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-t border-l' :
                position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-r' :
                'right-full top-1/2 translate-x-1/2 -translate-y-1/2 border-b border-l'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ 
  children, 
  color = 'rgba(46, 204, 113, 0.4)', 
  className = "" 
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const elementRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
  };

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onClick={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
          }}
          initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
          animate={{ width: 300, height: 300, opacity: [0.5, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

interface ParticleFieldProps {
  particleCount?: number;
  color?: string;
  className?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ 
  particleCount = 50, 
  color = 'rgba(46, 204, 113, 0.3)',
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

interface HologramProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export const HologramEffect: React.FC<HologramProps> = ({ 
  children, 
  intensity = 1,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            45deg,
            transparent 30%,
            rgba(46, 204, 113, ${0.1 * intensity}) 50%,
            transparent 70%
          )`,
          backgroundSize: '20px 20px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(46, 204, 113, ${0.05 * intensity}) 2px,
            rgba(46, 204, 113, ${0.05 * intensity}) 4px
          )`
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Sound effect hooks (placeholder for future implementation)
export const useSoundEffects = () => {
  const playHoverSound = () => {
    // Future: Web Audio API implementation
    console.log('🔊 Hover sound');
  };

  const playClickSound = () => {
    // Future: Web Audio API implementation
    console.log('🔊 Click sound');
  };

  const playSuccessSound = () => {
    // Future: Web Audio API implementation  
    console.log('🔊 Success sound');
  };

  const playTransitionSound = () => {
    // Future: Web Audio API implementation
    console.log('🔊 Transition sound');
  };

  return {
    playHoverSound,
    playClickSound,
    playSuccessSound,
    playTransitionSound
  };
};

export default {
  CursorGlow,
  BuboTooltip,
  RippleEffect,
  ParticleField,
  HologramEffect,
  useSoundEffects
};