import React from 'react';
import { Clock, Zap, Eye, Lock, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ConfidenceOrbProps {
  confidence: number;
  size?: 'sm' | 'md';
  animated?: boolean;
}

const ConfidenceOrb: React.FC<ConfidenceOrbProps> = ({ confidence, size = 'md', animated = true }) => {
  const getOrbColor = (conf: number) => {
    if (conf >= 80) return 'text-iq-neon-green';
    if (conf >= 60) return 'text-signal-yellow';
    return 'text-crimson-danger';
  };

  const getGlowColor = (conf: number) => {
    if (conf >= 80) return 'shadow-[0_0_15px_rgba(0,255,133,0.4)]';
    if (conf >= 60) return 'shadow-[0_0_15px_rgba(255,212,0,0.4)]';
    return 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div 
        className={`
          ${sizeClasses[size]} rounded-full ${getOrbColor(confidence)} ${getGlowColor(confidence)}
          ${animated ? 'bubo-animate-breathe' : ''}
          border-2 border-current/30 bg-current/20 backdrop-blur-sm
          flex items-center justify-center
        `}
      >
        <div className={`w-2 h-2 rounded-full bg-current ${animated ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
};

interface EnhancedFixCardProps {
  title: string;
  problem: string;
  confidence: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  userTier: 'starter' | 'pro' | 'team';
  onViewSteps: () => void;
  onRunChecks?: () => void;
  onOneClickFix?: () => void;
  onUpgrade: (requiredTier: string) => void;
  isInTicketView?: boolean;
}

export const EnhancedFixCard: React.FC<EnhancedFixCardProps> = ({
  title,
  problem,
  confidence,
  estimatedTime,
  difficulty,
  userTier,
  onViewSteps,
  onRunChecks,
  onOneClickFix,
  onUpgrade,
  isInTicketView = false
}) => {
  const canRunChecks = userTier === 'pro' || userTier === 'team';
  const canOneClickFix = userTier === 'team';

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-iq-neon-green border-iq-neon-green/30 bg-iq-neon-green/10';
      case 'Medium': return 'text-signal-yellow border-signal-yellow/30 bg-signal-yellow/10';
      case 'Expert': return 'text-prediction-purple border-prediction-purple/30 bg-prediction-purple/10';
      default: return 'text-mist-gray border-mist-gray/30 bg-mist-gray/10';
    }
  };

  const LockedButton: React.FC<{ 
    requiredTier: string; 
    children: React.ReactNode; 
    icon: React.ReactNode;
  }> = ({ requiredTier, children, icon }) => (
    <div className="relative group">
      <Button 
        onClick={() => onUpgrade(requiredTier)}
        className="w-full bubo-btn-ghost relative overflow-hidden opacity-50 cursor-pointer hover:opacity-75 transition-opacity"
        disabled={false}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/20 to-iq-neon-green/20 blur-sm" />
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="blur-sm flex items-center">
            {icon}
            <span className="ml-2">{children}</span>
          </div>
          <Lock className="absolute w-5 h-5 text-iq-neon-green animate-pulse" />
        </div>
      </Button>
      
      {/* Upgrade tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bubo-glass px-3 py-2 rounded-xl border border-iq-neon-green/30 text-center min-w-48">
          <p className="text-sm text-pure-white font-medium mb-1">
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} to unlock
          </p>
          <p className="text-xs text-mist-gray">
            Click to view upgrade options
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`
      bubo-glass transition-all duration-300 border-prediction-purple/20 hover:border-prediction-purple/40
      hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]
      ${isInTicketView ? 'p-4' : 'p-6'}
      relative overflow-hidden
    `}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-prediction-purple/5 to-iq-neon-green/5 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <ConfidenceOrb confidence={confidence} />
            <div className="flex-1">
              <h3 className="font-space-grotesk font-semibold text-pure-white mb-1">
                {title}
              </h3>
              {!isInTicketView && (
                <p className="text-sm text-mist-gray line-clamp-2">
                  {problem}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-cyan-accent">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{estimatedTime}</span>
            </div>
            <div className="flex items-center text-prediction-purple">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">{confidence}% reliable</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-3">
          {/* View Steps - Always available */}
          <Button onClick={onViewSteps} className="w-full bubo-btn-secondary">
            <Eye className="w-4 h-4 mr-2" />
            View Steps
          </Button>

          {/* Run Checks - Pro and Team */}
          {canRunChecks ? (
            <Button onClick={onRunChecks} className="w-full bubo-btn-ghost">
              <Zap className="w-4 h-4 mr-2" />
              Run Checks
              <Badge className="ml-2 bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                Pro
              </Badge>
            </Button>
          ) : (
            <LockedButton requiredTier="pro" icon={<Zap className="w-4 h-4" />}>
              Run Checks
            </LockedButton>
          )}

          {/* One-Click Fix - Team only */}
          {canOneClickFix ? (
            <Button onClick={onOneClickFix} className="w-full bubo-btn-neon-primary">
              <PlayCircle className="w-4 h-4 mr-2" />
              One-Click Fix
              <Badge className="ml-2 bg-dark-midnight/50 text-iq-neon-green border-iq-neon-green/30 text-xs">
                Team
              </Badge>
            </Button>
          ) : (
            <LockedButton requiredTier="team" icon={<PlayCircle className="w-4 h-4" />}>
              One-Click Fix
            </LockedButton>
          )}
        </div>

        {/* Compact layout for ticket view */}
        {isInTicketView && (
          <div className="mt-3 pt-3 border-t border-prediction-purple/20">
            <p className="text-xs text-mist-gray line-clamp-1">
              {problem}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};