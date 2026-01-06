import React, { useEffect, useRef, useState } from 'react';

interface IntelligenceOrbProps {
  size?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'blue' | 'gold' | 'slate' | 'purple' | 'teal';
  intensity?: 'subtle' | 'medium' | 'strong';
  motion?: 'float' | 'breathe' | 'pulse' | 'static' | 'parallax' | 'cursor-follow';
  position?: 'absolute' | 'relative';
  className?: string;
  glowRadius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const variantColors = {
  primary: {
    core: 'rgba(0, 255, 133, 0.6)',
    glow: 'rgba(0, 255, 133, 0.3)',
    outer: 'rgba(0, 255, 133, 0.1)'
  },
  secondary: {
    core: 'rgba(30, 144, 255, 0.6)',
    glow: 'rgba(30, 144, 255, 0.3)',
    outer: 'rgba(30, 144, 255, 0.1)'
  },
  accent: {
    core: 'rgba(0, 255, 198, 0.6)',
    glow: 'rgba(0, 255, 198, 0.3)',
    outer: 'rgba(0, 255, 198, 0.1)'
  },
  blue: {
    core: 'rgba(30, 144, 255, 0.7)',
    glow: 'rgba(30, 144, 255, 0.4)',
    outer: 'rgba(30, 144, 255, 0.15)'
  },
  gold: {
    core: 'rgba(255, 212, 0, 0.7)',
    glow: 'rgba(255, 212, 0, 0.4)',
    outer: 'rgba(255, 212, 0, 0.15)'
  },
  slate: {
    core: 'rgba(148, 163, 184, 0.6)',
    glow: 'rgba(148, 163, 184, 0.3)',
    outer: 'rgba(148, 163, 184, 0.1)'
  },
  purple: {
    core: 'rgba(139, 92, 246, 0.7)',
    glow: 'rgba(139, 92, 246, 0.4)',
    outer: 'rgba(139, 92, 246, 0.15)'
  },
  teal: {
    core: 'rgba(6, 214, 160, 0.7)',
    glow: 'rgba(6, 214, 160, 0.4)',
    outer: 'rgba(6, 214, 160, 0.15)'
  }
};

export const IntelligenceOrb: React.FC<IntelligenceOrbProps> = ({
  size = 200,
  variant = 'primary',
  intensity = 'medium',
  motion = 'float',
  position = 'relative',
  className = '',
  glowRadius = 1.5,
  children,
  style
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  const colors = variantColors[variant];
  const intensityMultiplier = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5
  }[intensity];

  // Cursor-follow effect
  useEffect(() => {
    if (motion !== 'cursor-follow') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      
      const rect = orbRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.02;
      const deltaY = (e.clientY - centerY) * 0.02;
      
      setMousePosition({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [motion]);

  // Parallax effect
  useEffect(() => {
    if (motion !== 'parallax') return;

    const handleScroll = () => {
      setScrollPosition(window.scrollY * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [motion]);

  const getMotionClass = () => {
    switch (motion) {
      case 'float':
        return 'bubo-orb-float';
      case 'breathe':
        return 'bubo-orb-breathe';
      case 'pulse':
        return 'bubo-orb-pulse';
      case 'static':
        return '';
      default:
        return '';
    }
  };

  const getTransform = () => {
    if (motion === 'cursor-follow') {
      return `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
    }
    if (motion === 'parallax') {
      return `translateY(${scrollPosition}px)`;
    }
    return 'none';
  };

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    ...(motion !== 'parallax' && motion !== 'cursor-follow' ? {} : {
      transform: getTransform(),
      transition: motion === 'cursor-follow' ? 'transform 0.3s ease-out' : 'none'
    }),
    ...style
  };

  return (
    <div
      ref={orbRef}
      className={`${position === 'absolute' ? 'absolute' : 'relative'} ${className} pointer-events-none`}
      style={containerStyle}
    >
      {/* Outer glow */}
      <div
        className={`absolute inset-0 rounded-full ${getMotionClass()}`}
        style={{
          background: `radial-gradient(circle, ${colors.outer} 0%, transparent 70%)`,
          filter: `blur(${size * 0.3 * glowRadius}px)`,
          opacity: intensityMultiplier,
          width: `${size * glowRadius}px`,
          height: `${size * glowRadius}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Middle glow */}
      <div
        className={`absolute inset-0 rounded-full ${getMotionClass()}`}
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
          filter: `blur(${size * 0.2}px)`,
          opacity: intensityMultiplier,
          animationDelay: '0.5s'
        }}
      />
      
      {/* Core orb */}
      <div
        className={`absolute inset-0 rounded-full ${getMotionClass()}`}
        style={{
          background: `radial-gradient(circle, ${colors.core} 0%, ${colors.glow} 50%, transparent 100%)`,
          filter: `blur(${size * 0.1}px)`,
          opacity: intensityMultiplier,
          animationDelay: '1s'
        }}
      />

      {/* Inner bright core */}
      <div
        className={`absolute rounded-full ${getMotionClass()}`}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: colors.core,
          filter: `blur(${size * 0.05}px)`,
          opacity: intensityMultiplier * 0.8,
          animationDelay: '1.5s'
        }}
      />

      {children}
    </div>
  );
};

interface OrbClusterProps {
  count?: number;
  variant?: IntelligenceOrbProps['variant'];
  size?: number;
  spread?: number;
  className?: string;
}

export const OrbCluster: React.FC<OrbClusterProps> = ({
  count = 3,
  variant = 'primary',
  size = 150,
  spread = 200,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: spread * 2, height: spread * 2 }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * spread;
        const y = Math.sin(angle) * spread;
        
        return (
          <IntelligenceOrb
            key={i}
            size={size}
            variant={variant}
            intensity="subtle"
            motion="breathe"
            position="absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.3}s`
            }}
          />
        );
      })}
    </div>
  );
};