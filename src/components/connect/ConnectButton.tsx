import React from 'react';
import { Monitor, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ConnectButtonProps {
  userTier: 'basic' | 'pro';
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  userTier,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const isProUser = userTier === 'pro';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const getButtonContent = () => {
    if (isProUser) {
      return (
        <>
          <Monitor className="w-4 h-4 mr-2" />
          Start remote help
        </>
      );
    } else {
      return (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Remote help
        </>
      );
    }
  };

  const getButtonClasses = () => {
    if (isProUser) {
      return variant === 'primary' 
        ? 'bubo-btn-neon-primary'
        : 'bubo-btn-secondary text-iq-neon-green border-iq-neon-green/30 hover:bg-iq-neon-green/10';
    } else {
      return 'bg-mist-gray/20 text-mist-gray border border-mist-gray/30 cursor-not-allowed hover:bg-mist-gray/20 hover:text-mist-gray';
    }
  };

  const button = (
    <Button
      onClick={isProUser ? onClick : undefined}
      disabled={disabled || !isProUser}
      className={`
        ${getButtonClasses()}
        ${sizeClasses[size]}
        transition-all duration-300
        ${className}
      `}
    >
      {getButtonContent()}
    </Button>
  );

  // Wrap non-Pro users' button with tooltip
  if (!isProUser) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={onClick} className="inline-block">
              {button}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="bubo-glass border border-iq-neon-green/20 text-pure-white"
          >
            <div className="text-center">
              <p className="font-medium">Upgrade to Pro</p>
              <p className="text-xs text-mist-gray mt-1">
                Connect to any computer instantly
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};