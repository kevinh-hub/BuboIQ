import React from 'react';
import { motion } from 'motion/react';
import { Eye, Brain, Activity, Zap } from 'lucide-react';

interface OrbAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'eye' | 'brain' | 'activity' | 'zap';
  intensity?: 'low' | 'medium' | 'high';
  showOrbitals?: boolean;
  className?: string;
}

const OrbAnimation: React.FC<OrbAnimationProps> = ({
  size = 'md',
  variant = 'eye',
  intensity = 'medium',
  showOrbitals = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { orb: 'w-16 h-16', icon: 'w-6 h-6', orbital1: 'inset-0', orbital2: 'inset-[-10px]' },
    md: { orb: 'w-24 h-24', icon: 'w-10 h-10', orbital1: 'inset-0', orbital2: 'inset-[-15px]' },
    lg: { orb: 'w-32 h-32', icon: 'w-16 h-16', orbital1: 'inset-0', orbital2: 'inset-[-20px]' },
    xl: { orb: 'w-48 h-48', icon: 'w-24 h-24', orbital1: 'inset-0', orbital2: 'inset-[-30px]' }
  };

  const intensityConfig = {
    low: {
      pulseScale: [1, 1.05, 1],
      pulseDuration: 4,
      glowOpacity: [0.3, 0.5, 0.3],
      orbitalSpeed: 12,
      particleCount: 3
    },
    medium: {
      pulseScale: [1, 1.1, 1],
      pulseDuration: 3,
      glowOpacity: [0.3, 0.7, 0.3],
      orbitalSpeed: 8,
      particleCount: 5
    },
    high: {
      pulseScale: [1, 1.15, 1],
      pulseDuration: 2,
      glowOpacity: [0.4, 0.9, 0.4],
      orbitalSpeed: 6,
      particleCount: 8
    }
  };

  const variantConfig = {
    eye: { icon: Eye, primary: '#00FF85', secondary: '#00FFC6' },
    brain: { icon: Brain, primary: '#8B5CF6', secondary: '#A78BFA' },
    activity: { icon: Activity, primary: '#3B82F6', secondary: '#60A5FA' },
    zap: { icon: Zap, primary: '#FFD400', secondary: '#FDE047' }
  };

  const config = sizeConfig[size];
  const iConfig = intensityConfig[intensity];
  const vConfig = variantConfig[variant];
  const IconComponent = vConfig.icon;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Orb */}
      <motion.div
        animate={{
          scale: iConfig.pulseScale,
          boxShadow: [
            `0 0 20px ${vConfig.primary}50`,
            `0 0 40px ${vConfig.primary}80`,
            `0 0 20px ${vConfig.primary}50`
          ]
        }}
        transition={{
          duration: iConfig.pulseDuration,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`${config.orb} bg-gradient-to-br from-transparent via-transparent to-transparent
                   rounded-full flex items-center justify-center relative overflow-hidden
                   border-2 backdrop-blur-sm`}
        style={{
          borderColor: `${vConfig.primary}50`,
          background: `radial-gradient(circle at 30% 30%, ${vConfig.primary}20, ${vConfig.secondary}10, transparent)`
        }}
      >
        {/* Inner Glow */}
        <motion.div
          animate={{
            opacity: iConfig.glowOpacity
          }}
          transition={{
            duration: iConfig.pulseDuration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`absolute inset-2 rounded-full opacity-30`}
          style={{
            background: `radial-gradient(circle, ${vConfig.primary}30, transparent 70%)`
          }}
        />

        {/* Icon */}
        <IconComponent 
          className={`${config.icon} relative z-10`}
          style={{ color: vConfig.primary }}
        />

        {/* Floating Particles */}
        {Array.from({ length: iConfig.particleCount }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(i * 2 * Math.PI / iConfig.particleCount) * 20],
              y: [0, Math.sin(i * 2 * Math.PI / iConfig.particleCount) * 20],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut'
            }}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: vConfig.secondary,
              left: '50%',
              top: '50%'
            }}
          />
        ))}
      </motion.div>

      {/* Orbital Rings */}
      {showOrbitals && (
        <>
          {/* Inner Orbital */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: iConfig.orbitalSpeed, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className={`absolute ${config.orbital1} border border-dashed rounded-full pointer-events-none`}
            style={{ borderColor: `${vConfig.secondary}40` }}
          />

          {/* Outer Orbital */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ 
              duration: iConfig.orbitalSpeed * 1.5, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className={`absolute ${config.orbital2} border border-dashed rounded-full pointer-events-none`}
            style={{ borderColor: `${vConfig.primary}30` }}
          />

          {/* Orbital Dots */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: iConfig.orbitalSpeed, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className={`absolute ${config.orbital1} pointer-events-none`}
          >
            <div 
              className="absolute w-2 h-2 rounded-full -top-1 left-1/2 transform -translate-x-1/2"
              style={{ backgroundColor: vConfig.secondary }}
            />
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ 
              duration: iConfig.orbitalSpeed * 1.5, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className={`absolute ${config.orbital2} pointer-events-none`}
          >
            <div 
              className="absolute w-1.5 h-1.5 rounded-full -top-0.5 left-1/4 transform -translate-x-1/2"
              style={{ backgroundColor: vConfig.primary }}
            />
            <div 
              className="absolute w-1.5 h-1.5 rounded-full -bottom-0.5 right-1/4 transform translate-x-1/2"
              style={{ backgroundColor: vConfig.primary }}
            />
          </motion.div>
        </>
      )}

      {/* Pulse Rings */}
      <motion.div
        animate={{
          scale: [1, 2.5],
          opacity: [0.6, 0]
        }}
        transition={{
          duration: iConfig.pulseDuration,
          repeat: Infinity,
          ease: 'easeOut'
        }}
        className={`absolute ${config.orbital1} border-2 rounded-full pointer-events-none`}
        style={{ borderColor: `${vConfig.primary}60` }}
      />
      
      <motion.div
        animate={{
          scale: [1, 2],
          opacity: [0.4, 0]
        }}
        transition={{
          duration: iConfig.pulseDuration,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.5
        }}
        className={`absolute ${config.orbital1} border-2 rounded-full pointer-events-none`}
        style={{ borderColor: `${vConfig.secondary}40` }}
      />
    </div>
  );
};

export default OrbAnimation;