/**
 * Early Access Badge Components
 * Brand-consistent badges for EA program states
 */

import React from 'react';
import { Badge } from '../ui/badge';

export type EABadgeType = 
  | 'ea-pro'
  | 'founders-rate'
  | 'observe-only'
  | 'trial'
  | 'expires-soon'
  | 'unused'
  | 'redeemed'
  | 'expired'
  | 'revoked';

interface EABadgeProps {
  type: EABadgeType;
  className?: string;
}

export function EABadge({ type, className = '' }: EABadgeProps) {
  const configs: Record<EABadgeType, { label: string; style: string }> = {
    'ea-pro': {
      label: 'EA-PRO',
      style: 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30 bubo-glow-green'
    },
    'founders-rate': {
      label: 'FOUNDERS RATE',
      style: 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20'
    },
    'observe-only': {
      label: 'OBSERVE-ONLY',
      style: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    },
    'trial': {
      label: 'TRIAL',
      style: 'bg-[#1E90FF]/20 text-[#1E90FF] border-[#1E90FF]/30'
    },
    'expires-soon': {
      label: 'EXPIRES SOON',
      style: 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse'
    },
    'unused': {
      label: 'Unused',
      style: 'bg-slate-700/50 text-slate-300 border-slate-600/30'
    },
    'redeemed': {
      label: 'Redeemed',
      style: 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20'
    },
    'expired': {
      label: 'Expired',
      style: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    'revoked': {
      label: 'Revoked',
      style: 'bg-red-600/20 text-red-300 border-red-600/30'
    }
  };

  const config = configs[type];

  return (
    <Badge 
      className={`font-['Space_Grotesk'] uppercase tracking-wide ${config.style} ${className}`}
    >
      {config.label}
    </Badge>
  );
}

/**
 * Status Pill - Larger, more prominent status indicator
 */
interface StatusPillProps {
  status: 'valid' | 'expiring' | 'expired' | 'revoked' | 'used' | 'cohort-closed';
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const configs = {
    'valid': {
      label: 'Valid',
      icon: '✓',
      style: 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/40'
    },
    'expiring': {
      label: 'Expiring Soon',
      icon: '⚠',
      style: 'bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse'
    },
    'expired': {
      label: 'Expired',
      icon: '✗',
      style: 'bg-red-500/20 text-red-400 border-red-500/40'
    },
    'revoked': {
      label: 'Revoked',
      icon: '⊘',
      style: 'bg-red-600/20 text-red-300 border-red-600/40'
    },
    'used': {
      label: 'Already Used',
      icon: '✓',
      style: 'bg-slate-600/20 text-slate-400 border-slate-600/40'
    },
    'cohort-closed': {
      label: 'Cohort Closed',
      icon: '🔒',
      style: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/40'
    }
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.style} ${className}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-['Space_Grotesk'] font-medium">{config.label}</span>
    </div>
  );
}

/**
 * Plan Card Badge - Shows plan details prominently
 */
interface PlanCardBadgeProps {
  planName?: string;
  devicesIncluded?: number;
  overageRate?: number;
  foundersRate?: number;
  className?: string;
}

export function PlanCardBadge({ 
  planName = 'EA-Pro',
  devicesIncluded = 100,
  overageRate = 0.90,
  foundersRate = 99,
  className = '' 
}: PlanCardBadgeProps) {
  return (
    <div className={`bubo-glass rounded-xl p-6 border border-[#00FF85]/30 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <EABadge type="ea-pro" />
        <EABadge type="founders-rate" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-['Space_Grotesk'] font-bold text-[#00FF85]">
            ${foundersRate}
          </span>
          <span className="text-mist-gray">/month</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-cloud-white">
            <span>Devices Included:</span>
            <span className="font-bold">{devicesIncluded}</span>
          </div>
          <div className="flex justify-between text-cloud-white">
            <span>Overage Rate:</span>
            <span className="font-bold">${overageRate.toFixed(2)}/device</span>
          </div>
          <div className="pt-2 border-t border-white/10 text-mist-gray text-xs">
            Founders rate locked for 12 months
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Countdown Badge - Shows time remaining
 */
interface CountdownBadgeProps {
  expiresAt: string;
  className?: string;
}

export function CountdownBadge({ expiresAt, className = '' }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeLeft(`${minutes}m remaining`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpiringSoon = new Date(expiresAt).getTime() - new Date().getTime() < 2 * 24 * 60 * 60 * 1000; // 2 days

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${
      isExpiringSoon 
        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
        : 'bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30'
    } ${className}`}>
      <span className="font-jetbrains-mono text-xs">{timeLeft}</span>
    </div>
  );
}
