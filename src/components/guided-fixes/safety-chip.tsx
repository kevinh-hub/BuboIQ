import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldOff, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';

export type SafetyLevel = 'readOnly' | 'low' | 'risky' | 'destructive';

interface SafetyChipProps {
  level: SafetyLevel;
  className?: string;
}

const safetyConfig: Record<SafetyLevel, { icon: React.ReactNode; label: string; color: string }> = {
  readOnly: {
    icon: <ShieldCheck className="w-3 h-3" />,
    label: 'Safe to run',
    color: 'bg-success-green/20 text-success-green border-success-green/30'
  },
  low: {
    icon: <Shield className="w-3 h-3" />,
    label: 'Safe',
    color: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30'
  },
  risky: {
    icon: <AlertTriangle className="w-3 h-3" />,
    label: 'Check first',
    color: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30'
  },
  destructive: {
    icon: <ShieldOff className="w-3 h-3" />,
    label: 'Needs review',
    color: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
  }
};

export const SafetyChip: React.FC<SafetyChipProps> = ({ level, className = '' }) => {
  const config = safetyConfig[level];
  
  return (
    <Badge className={`${config.color} text-xs gap-1 ${className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};
