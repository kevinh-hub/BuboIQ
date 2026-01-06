import React, { useState, useEffect } from 'react';

interface OwlEyeOrbProps {
  size?: number;
  className?: string;
}

export const OwlEyeOrb: React.FC<OwlEyeOrbProps> = ({ 
  size = 40,
  className = ''
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const scheduleNextBlink = () => {
      // Random interval between 3-6 seconds (3000-6000ms)
      const randomInterval = Math.random() * 3000 + 3000;
      
      setTimeout(() => {
        setIsBlinking(true);
        
        // Realistic blink duration: 300ms (much faster and more natural)
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink(); // Schedule the next blink
        }, 300);
      }, randomInterval);
    };

    scheduleNextBlink();

    // Cleanup function
    return () => {
      // Note: setTimeout IDs would need to be stored to properly clean up
      // For this use case, the component lifecycle will handle cleanup
    };
  }, []);
  
  return (
    <div 
      className={`relative ${className} bubo-animate-float`}
      style={{ width: size, height: size }}
    >
      {/* Parallax Background Glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 133, 0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
          transform: 'scale(1.5)'
        }}
      />
      
      {/* Outer animated ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-iq-neon-green/40 animate-spin"
        style={{ 
          borderStyle: 'dashed',
          animationDuration: '20s',
          animationDirection: 'reverse'
        }}
      />
      
      {/* Middle pulsing ring */}
      <div 
        className="absolute inset-1 rounded-full border border-cyan-accent/60 bubo-animate-pulse-glow"
      />
      
      {/* Inner core with enhanced glow */}
      <div 
        className="absolute inset-2 rounded-full bg-gradient-to-br from-iq-neon-green via-cyan-accent to-electric-blue"
        style={{
          boxShadow: `
            0 0 30px rgba(0, 255, 133, 0.6),
            0 0 60px rgba(0, 255, 133, 0.3),
            inset 0 0 15px rgba(0, 255, 198, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.2)
          `
        }}
      />
      
      {/* Neural network pattern overlay */}
      <div 
        className="absolute inset-3 rounded-full opacity-20"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px, 12px 12px'
        }}
      />
      

      {/* Enhanced orb with neural network effects and scanning animation */}
      
      {/* Enhanced Eyelids with glow */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
      >
        {/* Upper eyelid */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-dark-midnight to-surface-dark transition-all duration-300 ease-out"
          style={{
            height: isBlinking ? '50%' : '0%',
            borderBottomLeftRadius: isBlinking ? '100%' : '0%',
            borderBottomRightRadius: isBlinking ? '100%' : '0%',
            boxShadow: isBlinking ? '0 2px 8px rgba(0, 255, 133, 0.3)' : 'none'
          }}
        />
        
        {/* Lower eyelid */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-dark-midnight to-surface-dark transition-all duration-300 ease-out"
          style={{
            height: isBlinking ? '50%' : '0%',
            borderTopLeftRadius: isBlinking ? '100%' : '0%',
            borderTopRightRadius: isBlinking ? '100%' : '0%',
            boxShadow: isBlinking ? '0 -2px 8px rgba(0, 255, 133, 0.3)' : 'none'
          }}
        />
      </div>
      

      
      {/* Central Pupil - The Eye's Focus Point */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: `${size * 0.3}px`,
          height: `${size * 0.3}px`,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(0, 0, 0, 0.9) 30%, #000000 100%)',
          boxShadow: `
            0 0 10px rgba(0, 0, 0, 0.8),
            inset 0 0 8px rgba(0, 255, 133, 0.4),
            inset -2px -2px 4px rgba(0, 0, 0, 0.6)
          `,
          border: '1px solid rgba(0, 255, 133, 0.3)'
        }}
      >
        {/* Pupil Highlight */}
        <div 
          className="absolute top-1 left-1 rounded-full bg-white opacity-60"
          style={{
            width: `${size * 0.08}px`,
            height: `${size * 0.08}px`,
            filter: 'blur(0.5px)'
          }}
        />
        
        {/* Neural Activity Indicator */}
        <div 
          className="absolute inset-0 rounded-full opacity-40 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 133, 0.6) 0%, transparent 60%)',
            animationDuration: '2s'
          }}
        />
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden bubo-scanning-line opacity-30" />
    </div>
  );
};