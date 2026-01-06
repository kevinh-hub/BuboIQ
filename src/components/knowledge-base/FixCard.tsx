import React, { useState } from 'react';
import { Clock, Zap, Eye, Play, Lock, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TierGuard } from '../TierGuard';

interface FixCardProps {
  title: string;
  medianTimeToFix: number;
  confidence: 'high' | 'medium' | 'low';
  tier: 'starter' | 'pro' | 'team';
  user: any;
  compact?: boolean;
  onClick?: () => void;
}

export const FixCard: React.FC<FixCardProps> = ({
  title,
  medianTimeToFix,
  confidence,
  tier,
  user,
  compact = false,
  onClick
}) => {
  const [confidenceOrbActive, setConfidenceOrbActive] = useState(false);

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high': return 'text-iq-neon-green';
      case 'medium': return 'text-signal-yellow';
      case 'low': return 'text-crimson-danger';
      default: return 'text-mist-gray';
    }
  };

  const getConfidenceIcon = (conf: string) => {
    switch (conf) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const canAccessFeature = (requiredTier: string) => {
    const tierLevels = { starter: 1, pro: 2, team: 3 };
    const userLevel = tierLevels[user?.tier || 'starter'];
    const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels];
    return userLevel >= requiredLevel;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (compact) {
    return (
      <div className="bubo-glass rounded-xl p-4 hover:bubo-glow-green transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                confidence === 'high' ? 'border-iq-neon-green bg-iq-neon-green/20' :
                confidence === 'medium' ? 'border-signal-yellow bg-signal-yellow/20' :
                'border-crimson-danger bg-crimson-danger/20'
              } ${confidenceOrbActive ? 'animate-pulse' : ''}`}
              onMouseEnter={() => setConfidenceOrbActive(true)}
              onMouseLeave={() => setConfidenceOrbActive(false)}
            >
              <div className={`${getConfidenceColor(confidence)}`}>
                {getConfidenceIcon(confidence)}
              </div>
            </div>
            <div className="text-sm">
              <p className="text-pure-white font-medium">Quick Fix Available</p>
              <p className="text-mist-gray">Est. {formatTime(medianTimeToFix)}</p>
            </div>
          </div>
          
          <Badge className={`${
            confidence === 'high' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' :
            confidence === 'medium' ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' :
            'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
          } text-xs`}>
            {confidence} confidence
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onClick}
            className="bubo-btn-secondary flex-1 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Steps
          </Button>
          
          <TierGuard tier="pro" user={user} feature="Pre-fix System Checks">
            <Button
              size="sm"
              disabled={!canAccessFeature('pro')}
              className="bubo-btn-ghost text-xs px-3"
            >
              <Shield className="w-3 h-3" />
            </Button>
          </TierGuard>
          
          <TierGuard tier="team" user={user} feature="Automated Fix Execution">
            <Button
              size="sm"
              disabled={!canAccessFeature('team')}
              className="bubo-btn-neon-primary text-xs px-3"
            >
              <Zap className="w-3 h-3" />
            </Button>
          </TierGuard>
        </div>
      </div>
    );
  }

  return (
    <Card className="bubo-glass hover:bubo-glow-green transition-all duration-300 p-6 relative overflow-hidden">
      {/* Background Orb Effect */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-iq-neon-green/10 to-electric-blue/10 blur-xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pure-white mb-2">{title}</h3>
            <div className="flex items-center gap-4 text-sm text-mist-gray">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Median fix time: {formatTime(medianTimeToFix)}</span>
              </div>
            </div>
          </div>
          
          {/* Confidence Orb */}
          <div 
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              confidence === 'high' ? 'border-iq-neon-green bg-iq-neon-green/20' :
              confidence === 'medium' ? 'border-signal-yellow bg-signal-yellow/20' :
              'border-crimson-danger bg-crimson-danger/20'
            } ${confidenceOrbActive ? 'bubo-animate-pulse-glow' : ''}`}
            onMouseEnter={() => setConfidenceOrbActive(true)}
            onMouseLeave={() => setConfidenceOrbActive(false)}
          >
            <div className={`${getConfidenceColor(confidence)}`}>
              {getConfidenceIcon(confidence)}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Badge className={`${
            confidence === 'high' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' :
            confidence === 'medium' ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' :
            'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
          }`}>
            {getConfidenceIcon(confidence)}
            <span className="ml-2">{confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence</span>
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onClick}
            className="bubo-btn-secondary flex items-center gap-2 flex-1"
          >
            <Eye className="w-4 h-4" />
            View Fix Steps
          </Button>
          
          <TierGuard 
            tier="pro" 
            user={user}
            feature="Pre-fix System Checks"
          >
            <Button
              disabled={!canAccessFeature('pro')}
              className={`bubo-btn-ghost flex items-center gap-2 ${
                !canAccessFeature('pro') ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!canAccessFeature('pro') && <Lock className="w-4 h-4" />}
              <Shield className="w-4 h-4" />
              Run Prechecks
            </Button>
          </TierGuard>
          
          <TierGuard 
            tier="team" 
            user={user}
            feature="Automated Fix Execution"
          >
            <Button
              disabled={!canAccessFeature('team')}
              className={`bubo-btn-neon-primary flex items-center gap-2 ${
                !canAccessFeature('team') ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!canAccessFeature('team') && <Lock className="w-4 h-4" />}
              <Zap className="w-4 h-4" />
              Auto-Run Fix
            </Button>
          </TierGuard>
        </div>

        {/* Tier Restrictions Visual Feedback */}
        {(!canAccessFeature('pro') || !canAccessFeature('team')) && (
          <div className="mt-3 p-3 bg-slate-gray/20 rounded-lg border border-slate-gray/30">
            <p className="text-xs text-mist-gray flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Powerful features require Pro or Team tier subscription
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};