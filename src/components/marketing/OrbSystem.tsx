import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// ==========================================
// MORPHIC INTELLIGENCE SYSTEM
// Modular Orb Component for BuboIQ
// ==========================================

type VariantType = 
  | 'Sphere' 
  | 'HaloRing' 
  | 'Constellation' 
  | 'RibbonWave' 
  | 'ParticleSwarm' 
  | 'Metaball' 
  | 'LensRefractor' 
  | 'FieldLines' 
  | 'HoloGrid' 
  | 'None';

type SizeToken = 'XS' | 'S' | 'M' | 'L' | 'XL';

type Placement = 
  | 'TopLeft' 
  | 'TopRight' 
  | 'MidLeft' 
  | 'MidRight' 
  | 'BottomLeft' 
  | 'BottomRight' 
  | 'EdgeBleed' 
  | 'InlineBadge';

type ZLayer = 'Behind' | 'MidGlass' | 'Fore';

type Tint = 
  | 'Base' 
  | 'Healthcare' 
  | 'Finance' 
  | 'Manufacturing' 
  | 'Legal' 
  | 'SLED';

type MotionProfile = 
  | 'Idle' 
  | 'Focus' 
  | 'Scroll' 
  | 'Reactive' 
  | 'Inert';

interface OrbSystemProps {
  variantType: VariantType;
  sizeToken?: SizeToken;
  placement?: Placement;
  zLayer?: ZLayer;
  tint?: Tint;
  motionProfile?: MotionProfile;
  density?: 1 | 2 | 3 | 4 | 5;
  glow?: 0 | 1 | 2 | 3;
  className?: string;
  onHover?: boolean;
}

// Size mapping (vw-based for responsive scaling)
// Desktop sizes with mobile constraints
const SIZE_MAP = {
  XS: { min: 8, max: 12, mobile: 10 },
  S: { min: 12, max: 18, mobile: 15 },
  M: { min: 18, max: 26, mobile: 22 },
  L: { min: 26, max: 34, mobile: 28 },
  XL: { min: 34, max: 44, mobile: 32 }
};

// Tint color mapping
const TINT_MAP = {
  Base: '#00FF85',
  Healthcare: '#1E90FF',
  Finance: '#FFD700',
  Manufacturing: '#708090',
  Legal: '#8B5CF6',
  SLED: '#06D6A0'
};

// Z-index layers
const Z_LAYER_MAP = {
  Behind: 0,
  MidGlass: 10,
  Fore: 20
};

// Placement positioning
const PLACEMENT_MAP = {
  TopLeft: 'top-[5%] left-[5%]',
  TopRight: 'top-[5%] right-[5%]',
  MidLeft: 'top-1/2 -translate-y-1/2 left-[5%]',
  MidRight: 'top-1/2 -translate-y-1/2 right-[5%]',
  BottomLeft: 'bottom-[5%] left-[5%]',
  BottomRight: 'bottom-[5%] right-[5%]',
  EdgeBleed: 'top-1/2 -translate-y-1/2 -right-[10%]',
  InlineBadge: 'relative inline-block'
};

export const OrbSystem: React.FC<OrbSystemProps> = ({
  variantType,
  sizeToken = 'M',
  placement = 'MidRight',
  zLayer = 'Behind',
  tint = 'Base',
  motionProfile = 'Idle',
  density = 3,
  glow = 1,
  className = '',
  onHover = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cursor parallax for Reactive motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), springConfig);

  // Check for reduced motion preference and mobile viewport
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Handle mobile viewport detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle cursor parallax
  useEffect(() => {
    if (motionProfile !== 'Reactive' || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) / (rect.width / 2));
      mouseY.set((e.clientY - centerY) / (rect.height / 2));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [motionProfile, mouseX, mouseY, prefersReducedMotion]);

  if (variantType === 'None') return null;

  const sizeValue = SIZE_MAP[sizeToken];
  const tintColor = TINT_MAP[tint];
  const zIndex = Z_LAYER_MAP[zLayer];
  const positionClass = placement !== 'InlineBadge' ? 'absolute' : '';
  const placementClass = PLACEMENT_MAP[placement];

  // Glow intensity
  const glowIntensity = glow * 0.3;

  // Motion animation variants
  const getMotionVariant = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0.6 },
        animate: { opacity: 0.8 },
        transition: { duration: 0.3 }
      };
    }

    switch (motionProfile) {
      case 'Idle':
        return {
          animate: {
            y: [0, -10, 0],
            scale: [1, 1.02, 1],
            opacity: [0.6, 0.8, 0.6]
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      case 'Focus':
        return {
          animate: isHovered || onHover ? {
            scale: [1, 1.15, 1.1],
            opacity: [0.8, 1, 0.9]
          } : {
            scale: 1,
            opacity: 0.7
          },
          transition: {
            duration: 0.6,
            ease: 'easeOut'
          }
        };
      case 'Scroll':
        return {
          animate: {
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5]
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      case 'Reactive':
        return {
          style: { x, y },
          transition: { type: 'spring', damping: 25, stiffness: 150 }
        };
      case 'Inert':
      default:
        return {
          animate: { opacity: 0.6 }
        };
    }
  };

  const motionProps = getMotionVariant();

  // Render different variant types
  const renderVariant = () => {
    // Use mobile size on small screens, desktop size on larger screens
    const baseSize = isMobile ? `${sizeValue.mobile}vw` : `${sizeValue.min}vw`;
    const maxSize = isMobile ? `${sizeValue.mobile}vw` : `${sizeValue.max}vw`;

    switch (variantType) {
      case 'Sphere':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '500px',
              maxHeight: '500px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${tintColor}40, transparent 70%)`,
                boxShadow: glow > 0 ? `0 0 ${60 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 100)}` : 'none',
                filter: `blur(${20 + glow * 10}px)`
              }}
            />
          </motion.div>
        );

      case 'HaloRing':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '600px',
              maxHeight: '600px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: `${tintColor}60`,
                  boxShadow: glow > 0 ? `0 0 ${40 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 80)}, inset 0 0 ${30 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 60)}` : 'none'
                }}
              />
              <div 
                className="absolute inset-[15%] rounded-full border"
                style={{
                  borderColor: `${tintColor}40`,
                  boxShadow: glow > 0 ? `0 0 ${30 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 60)}` : 'none'
                }}
              />
            </div>
          </motion.div>
        );

      case 'Constellation':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '400px',
              maxHeight: '400px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Nodes */}
              {Array.from({ length: density }).map((_, i) => {
                const angle = (i / density) * Math.PI * 2;
                const radius = 60 + Math.random() * 30;
                const cx = 100 + Math.cos(angle) * radius;
                const cy = 100 + Math.sin(angle) * radius;
                return (
                  <circle
                    key={`node-${i}`}
                    cx={cx}
                    cy={cy}
                    r={2 + Math.random() * 2}
                    fill={tintColor}
                    opacity={0.8}
                    style={{
                      filter: glow > 0 ? `drop-shadow(0 0 ${4 * glow}px ${tintColor})` : 'none'
                    }}
                  />
                );
              })}
              {/* Links */}
              {Array.from({ length: density }).map((_, i) => {
                const angle1 = (i / density) * Math.PI * 2;
                const angle2 = ((i + 1) / density) * Math.PI * 2;
                const radius = 70;
                return (
                  <line
                    key={`link-${i}`}
                    x1={100 + Math.cos(angle1) * radius}
                    y1={100 + Math.sin(angle1) * radius}
                    x2={100 + Math.cos(angle2) * radius}
                    y2={100 + Math.sin(angle2) * radius}
                    stroke={tintColor}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}
            </svg>
          </motion.div>
        );

      case 'RibbonWave':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: maxSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '700px',
              maxHeight: '300px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
              <motion.path
                d="M0,75 Q75,20 150,75 T300,75"
                fill="none"
                stroke={tintColor}
                strokeWidth={2}
                opacity={0.6}
                style={{
                  filter: glow > 0 ? `drop-shadow(0 0 ${10 * glow}px ${tintColor})` : 'none'
                }}
                animate={prefersReducedMotion ? {} : {
                  d: [
                    "M0,75 Q75,20 150,75 T300,75",
                    "M0,75 Q75,130 150,75 T300,75",
                    "M0,75 Q75,20 150,75 T300,75"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </svg>
          </motion.div>
        );

      case 'ParticleSwarm':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '400px',
              maxHeight: '400px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {Array.from({ length: density * 8 }).map((_, i) => {
                const cx = 50 + Math.random() * 100;
                const cy = 50 + Math.random() * 100;
                const r = 0.5 + Math.random() * 1.5;
                return (
                  <motion.circle
                    key={`particle-${i}`}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={tintColor}
                    opacity={0.6}
                    animate={prefersReducedMotion ? {} : {
                      cx: [cx, cx + (Math.random() - 0.5) * 20],
                      cy: [cy, cy + (Math.random() - 0.5) * 20],
                      opacity: [0.6, 0.3, 0.6]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2
                    }}
                  />
                );
              })}
            </svg>
          </motion.div>
        );

      case 'Metaball':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '400px',
              maxHeight: '400px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-full">
              <motion.div 
                className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${tintColor}60, transparent)`,
                  filter: `blur(${25 + glow * 10}px)`,
                  boxShadow: glow > 0 ? `0 0 ${50 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 80)}` : 'none'
                }}
                animate={prefersReducedMotion ? {} : {
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 w-2/3 h-2/3 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${tintColor}40, transparent)`,
                  filter: `blur(${30 + glow * 10}px)`,
                }}
                animate={prefersReducedMotion ? {} : {
                  x: [0, -15, 0],
                  y: [0, 10, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
              />
            </div>
          </motion.div>
        );

      case 'LensRefractor':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '500px',
              maxHeight: '500px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className="w-full h-full rounded-full backdrop-blur-md"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${tintColor}20, transparent 70%)`,
                border: `1px solid ${tintColor}30`,
                boxShadow: glow > 0 ? `0 0 ${40 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 60)}, inset 0 0 ${60 * glowIntensity}px ${tintColor}${Math.floor(glowIntensity * 40)}` : 'none'
              }}
            />
          </motion.div>
        );

      case 'FieldLines':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: maxSize, 
              zIndex,
              maxWidth: '300px',
              maxHeight: '600px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg className="w-full h-full" viewBox="0 0 150 300" preserveAspectRatio="none">
              {Array.from({ length: density }).map((_, i) => {
                const offset = (i / density) * 150;
                return (
                  <motion.path
                    key={`field-${i}`}
                    d={`M${offset},0 Q${offset + 30},150 ${offset},300`}
                    fill="none"
                    stroke={tintColor}
                    strokeWidth={0.5}
                    opacity={0.4}
                    style={{
                      filter: glow > 0 ? `drop-shadow(0 0 ${6 * glow}px ${tintColor})` : 'none'
                    }}
                    animate={prefersReducedMotion ? {} : {
                      d: [
                        `M${offset},0 Q${offset + 30},150 ${offset},300`,
                        `M${offset},0 Q${offset - 30},150 ${offset},300`,
                        `M${offset},0 Q${offset + 30},150 ${offset},300`
                      ]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3
                    }}
                  />
                );
              })}
            </svg>
          </motion.div>
        );

      case 'HoloGrid':
        return (
          <motion.div
            ref={containerRef}
            {...motionProps}
            className={`${positionClass} ${placementClass} pointer-events-none`}
            style={{ 
              width: baseSize, 
              height: baseSize, 
              zIndex,
              maxWidth: '400px',
              maxHeight: '400px'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Horizontal lines */}
              {Array.from({ length: density * 2 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={(i / (density * 2)) * 200}
                  x2={200}
                  y2={(i / (density * 2)) * 200}
                  stroke={tintColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                  strokeDasharray="4 4"
                />
              ))}
              {/* Vertical lines */}
              {Array.from({ length: density * 2 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i / (density * 2)) * 200}
                  y1={0}
                  x2={(i / (density * 2)) * 200}
                  y2={200}
                  stroke={tintColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                  strokeDasharray="4 4"
                />
              ))}
            </svg>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return renderVariant();
};

export default OrbSystem;