import React, { useState } from 'react';
import { Lock, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { Button } from '../ui/button';

interface ProFeatureTooltipProps {
  children: React.ReactNode;
  feature: 'automation' | 'ai-triage' | 'analytics' | 'integrations';
  title: string;
  description: string;
  value?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onUpgrade: (feature: string) => void;
  userId?: string;
}

export const ProFeatureTooltip: React.FC<ProFeatureTooltipProps> = ({
  children,
  feature,
  title,
  description,
  value,
  position = 'top',
  onUpgrade,
  userId
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Track tooltip upgrade click
    if ((window as any).gtag) {
      (window as any).gtag('event', 'tooltip_upgrade_click', {
        feature,
        user_id: userId
      });
    }
    
    onUpgrade(feature);
    setIsVisible(false);
  };

  const handleTooltipView = () => {
    // Track tooltip view
    if ((window as any).gtag) {
      (window as any).gtag('event', 'tooltip_pro_feature_view', {
        feature,
        user_id: userId
      });
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-surface-dark';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-surface-dark';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-surface-dark';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-surface-dark';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-surface-dark';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => {
        setIsVisible(true);
        handleTooltipView();
      }}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute ${getPositionClasses()} z-50 w-80 pointer-events-none`}>
          <div className="bg-surface-dark border border-iq-neon-green/30 rounded-xl p-4 bubo-glass shadow-2xl pointer-events-auto">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-iq-neon-green" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-['Space_Grotesk'] font-bold text-pure-white text-sm">
                    {title}
                  </h4>
                  <div className="flex items-center space-x-1 bg-amber-warning/20 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-amber-warning" />
                    <span className="text-xs text-amber-warning font-medium">Pro</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-cloud-white text-sm mb-3 leading-relaxed">
              {description}
            </p>

            {/* Value Proposition */}
            {value && (
              <div className="bg-iq-neon-green/10 rounded-lg p-2 mb-3 border border-iq-neon-green/20">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-iq-neon-green" />
                  <span className="text-iq-neon-green text-sm font-medium">{value}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={handleUpgradeClick}
              className="w-full bubo-btn-neon-primary text-sm py-2"
              size="sm"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>

            {/* Pricing reminder */}
            <p className="text-center text-xs text-mist-gray mt-2">
              $49/mo • 14-day free trial
            </p>

            {/* Tooltip Arrow */}
            <div className={`absolute ${getArrowClasses()} w-0 h-0 border-4`} />
          </div>
        </div>
      )}
    </div>
  );
};