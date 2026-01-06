import React from 'react';
import { Badge } from '../ui/badge';
import { Star, Sparkles, Crown, Clock } from 'lucide-react';

interface PlanBadgeProps {
  variant: string;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ variant, className = '' }) => {
  const badgeConfig: Record<string, any> = {
    basic: {
      text: 'Basic',
      className: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
      icon: null
    },
    starter: {
      text: 'Starter',
      className: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
      icon: null
    },
    pro: {
      text: 'Pro',
      className: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
      icon: null
    },
    team: {
      text: 'Team',
      className: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
      icon: null
    },
    enterprise: {
      text: 'Enterprise',
      className: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30',
      icon: Crown
    },
    trial: {
      text: 'Trial',
      className: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
      icon: Clock
    },
    new: {
      text: 'New',
      className: 'bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30',
      icon: Sparkles
    },
    popular: {
      text: 'Most Popular',
      className: 'bg-iq-neon-green text-dark-midnight border-iq-neon-green font-bold',
      icon: Star
    }
  };

  const config = badgeConfig[variant] || badgeConfig.starter;
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.className} ${className}`}>
      {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
      {config.text}
    </Badge>
  );
};