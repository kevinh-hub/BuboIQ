import React from 'react';
import { Monitor, Smartphone, Printer, Tv, Laptop, Router } from 'lucide-react';
import { OwlEyeOrb } from './OwlEyeOrb';

interface DeviceNetworkOrbProps {
  className?: string;
  size?: number;
  isHomePage?: boolean;
}

export const DeviceNetworkOrb: React.FC<DeviceNetworkOrbProps> = ({ className = '', size = 320, isHomePage = false }) => {
  const devices = [
    { icon: Laptop, position: 'top-left', delay: '0s', color: 'text-iq-neon-green' },
    { icon: Monitor, position: 'top-right', delay: '0.5s', color: 'text-electric-blue' },
    { icon: Printer, position: 'bottom-left', delay: '1s', color: 'text-cyan-accent' },
    { icon: Smartphone, position: 'bottom-right', delay: '1.5s', color: 'text-signal-yellow' },
    { icon: Tv, position: 'left', delay: '2s', color: 'text-prediction-purple' },
    { icon: Router, position: 'right', delay: '2.5s', color: 'text-amber-warning' },
  ];

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 -translate-x-4 -translate-y-4';
      case 'top-right':
        return 'top-0 right-0 translate-x-4 -translate-y-4';
      case 'bottom-left':
        return 'bottom-0 left-0 -translate-x-4 translate-y-4';
      case 'bottom-right':
        return 'bottom-0 right-0 translate-x-4 translate-y-4';
      case 'left':
        return 'top-1/2 left-0 -translate-x-8 -translate-y-1/2';
      case 'right':
        return 'top-1/2 right-0 translate-x-8 -translate-y-1/2';
      default:
        return '';
    }
  };

  // Use consistent sizing across all pages
  const actualSize = size;
  const orbSize = `${actualSize}px`;
  const centralOrbSize = Math.max(40, actualSize * 0.375); // Scale the central orb proportionally, minimum 40px
  const deviceSize = Math.max(32, actualSize * 0.2); // Scale device containers proportionally, minimum 32px
  const iconSize = Math.max(16, actualSize * 0.1); // Scale icons proportionally, minimum 16px

  return (
    <div className={`relative ${className}`} style={{ width: orbSize, height: orbSize }}>
      {/* Enhanced Background Glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-40 bubo-animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 133, 0.3) 0%, rgba(0, 255, 133, 0.1) 40%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.2)'
        }}
      />
      
      {/* Secondary Glow Layer */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(30, 144, 255, 0.2) 0%, transparent 60%)',
          filter: 'blur(15px)',
          transform: 'scale(1.1)',
          animationDelay: '1s',
          animationDuration: '3s'
        }}
      />

      {/* Central Orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative bubo-glow-green">
          {/* Enhanced Background Glow Effects */}
          <div 
            className="absolute inset-0 rounded-full opacity-40 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 133, 0.6) 0%, rgba(0, 255, 133, 0.3) 30%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(2.5)',
              animation: 'breathe 4s ease-in-out infinite'
            }}
          />
          
          {/* Outer Rotating Orbital Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-iq-neon-green/40 animate-spin"
            style={{ 
              animationDuration: '30s',
              animationDirection: 'reverse',
              transform: 'scale(1.8)'
            }}
          />
          
          {/* Middle Constellation Ring */}
          <div 
            className="absolute inset-0 rounded-full border border-cyan-accent/50"
            style={{ 
              transform: 'scale(1.4)',
              animation: 'ping 5s cubic-bezier(0, 0, 0.2, 1) infinite',
              animationDelay: '0.5s'
            }}
          />
          
          {/* Inner Neural Ring */}
          <div 
            className="absolute inset-0 rounded-full border border-electric-blue/40"
            style={{ 
              transform: 'scale(1.2)',
              animation: 'ping 3.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              animationDelay: '1.2s'
            }}
          />
          
          {/* Core Owl Eye Orb */}
          <OwlEyeOrb size={centralOrbSize} className="bubo-animate-float relative z-10" />
          
          {/* Enhanced Pulsing Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-iq-neon-green/30 animate-ping" />
          <div 
            className="absolute inset-0 rounded-full border border-iq-neon-green/20 bubo-animate-pulse-glow" 
            style={{ animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }}
          />
          <div 
            className="absolute inset-0 rounded-full border border-electric-blue/15" 
            style={{ animation: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '2s' }}
          />
          
          {/* Neural Network Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Particle Ring 1 */}
            <div 
              className="absolute w-2 h-2 bg-iq-neon-green rounded-full opacity-60"
              style={{
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'float 2s ease-in-out infinite',
                animationDelay: '0s'
              }}
            />
            <div 
              className="absolute w-1.5 h-1.5 bg-cyan-accent rounded-full opacity-50"
              style={{
                top: '50%',
                right: '10%',
                transform: 'translateY(-50%)',
                animation: 'float 2.5s ease-in-out infinite',
                animationDelay: '0.5s'
              }}
            />
            <div 
              className="absolute w-1 h-1 bg-electric-blue rounded-full opacity-40"
              style={{
                bottom: '15%',
                left: '20%',
                animation: 'float 3s ease-in-out infinite',
                animationDelay: '1s'
              }}
            />
            <div 
              className="absolute w-1.5 h-1.5 bg-iq-neon-green rounded-full opacity-45"
              style={{
                top: '25%',
                left: '15%',
                animation: 'float 2.2s ease-in-out infinite',
                animationDelay: '1.5s'
              }}
            />
          </div>
          
          {/* Scanning Wave Effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden opacity-30"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 133, 0.3), transparent)',
              animation: 'spin 8s linear infinite'
            }}
          />

        </div>
      </div>

      {/* Devices */}
      {devices.map((device, index) => {
        const IconComponent = device.icon;
        return (
          <div
            key={index}
            className={`absolute ${getPositionClasses(device.position)} animate-pulse`}
            style={{ animationDelay: device.delay, animationDuration: '2s' }}
          >
            <div className="relative">
              {/* Device Icon Container */}
              <div 
                className="bg-surface-dark/80 backdrop-blur-sm rounded-2xl border border-iq-neon-green/20 flex items-center justify-center hover:scale-110 transition-all duration-300 bubo-glass"
                style={{ 
                  width: `${deviceSize}px`, 
                  height: `${deviceSize}px`,
                  boxShadow: `0 0 15px rgba(0, 255, 133, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <IconComponent className={`${device.color}`} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
              </div>
              
              {/* Enhanced Connection Line to Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="absolute w-32 h-px bg-gradient-to-r from-transparent via-iq-neon-green/60 to-transparent"
                  style={{
                    transform: device.position.includes('left') 
                      ? 'rotate(0deg) translateX(50%)' 
                      : device.position.includes('right')
                      ? 'rotate(180deg) translateX(50%)'
                      : device.position.includes('top')
                      ? 'rotate(90deg) translateX(50%)'
                      : 'rotate(-90deg) translateX(50%)',
                    transformOrigin: 'center',
                    animation: `pulse 2s infinite`,
                    animationDelay: device.delay,
                    filter: 'drop-shadow(0 0 4px rgba(0, 255, 133, 0.5))',
                    boxShadow: '0 0 8px rgba(0, 255, 133, 0.3)'
                  }}
                />
                {/* Secondary glow line */}
                <div 
                  className="absolute w-32 h-px bg-gradient-to-r from-transparent via-cyan-accent/30 to-transparent"
                  style={{
                    transform: device.position.includes('left') 
                      ? 'rotate(0deg) translateX(50%)' 
                      : device.position.includes('right')
                      ? 'rotate(180deg) translateX(50%)'
                      : device.position.includes('top')
                      ? 'rotate(90deg) translateX(50%)'
                      : 'rotate(-90deg) translateX(50%)',
                    transformOrigin: 'center',
                    animation: `pulse 3s infinite`,
                    animationDelay: device.delay,
                    filter: 'blur(2px)'
                  }}
                />
              </div>
              
              {/* Light Stream Animation */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${device.color.replace('text-', 'rgba(')}30, 0.1) 0%, transparent 70%)`,
                  animation: `breathe 3s ease-in-out infinite`,
                  animationDelay: device.delay
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Enhanced Data Flow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-iq-neon-green/80 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `orbit${i + 1} 4s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              boxShadow: `
                0 0 8px rgba(0, 255, 133, 0.8),
                0 0 16px rgba(0, 255, 133, 0.4),
                0 0 24px rgba(0, 255, 133, 0.2)
              `,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
        {/* Additional particle layer for extra glow */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-1 h-1 bg-cyan-accent/60 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `orbit${i + 3} 6s linear infinite`,
              animationDelay: `${i * 0.8}s`,
              boxShadow: `0 0 6px rgba(0, 255, 198, 0.6)`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <style jsx={"true"}>{`
        @keyframes orbit1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: translate(-50%, -50%) rotate(60deg) translateX(100px) rotate(-60deg); }
          to { transform: translate(-50%, -50%) rotate(420deg) translateX(100px) rotate(-420deg); }
        }
        @keyframes orbit3 {
          from { transform: translate(-50%, -50%) rotate(120deg) translateX(90px) rotate(-120deg); }
          to { transform: translate(-50%, -50%) rotate(480deg) translateX(90px) rotate(-480deg); }
        }
        @keyframes orbit4 {
          from { transform: translate(-50%, -50%) rotate(180deg) translateX(110px) rotate(-180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg) translateX(110px) rotate(-540deg); }
        }
        @keyframes orbit5 {
          from { transform: translate(-50%, -50%) rotate(240deg) translateX(85px) rotate(-240deg); }
          to { transform: translate(-50%, -50%) rotate(600deg) translateX(85px) rotate(-600deg); }
        }
        @keyframes orbit6 {
          from { transform: translate(-50%, -50%) rotate(300deg) translateX(95px) rotate(-300deg); }
          to { transform: translate(-50%, -50%) rotate(660deg) translateX(95px) rotate(-660deg); }
        }
      `}</style>
    </div>
  );
};