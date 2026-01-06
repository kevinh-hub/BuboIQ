import React from 'react';

interface ConnectFeatureBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConnectFeatureBadge: React.FC<ConnectFeatureBadgeProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`
      inline-flex items-center ${sizeClasses[size]} rounded-full 
      bg-dark-midnight/80 backdrop-blur-sm border border-iq-neon-green/30
      font-inter font-medium tracking-wide
      bubo-glow-green transition-all duration-300
      ${className}
    `}>
      <span className="text-pure-white">Bubo</span>
      <span className="text-iq-neon-green">IQ</span>
      <span className="text-mist-gray mx-1">Connect</span>
      <span className="text-iq-neon-green text-xs font-semibold uppercase tracking-wider">• Pro</span>
    </div>
  );
};