import React from 'react';
import { Play, Eye, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { OSBadge, OSType } from './os-badge';
import { SafetyChip, SafetyLevel } from './safety-chip';
import { PolicyBadge } from './policy-badge';
import { TierGuard } from '../TierGuard';

export type TierState = 'starterLocked' | 'pro' | 'team';
export type Density = 'comfortable' | 'compact';

interface GuidedFixCardProps {
  id: string;
  title: string;
  description: string;
  os: OSType[];
  safety: SafetyLevel;
  estMins: string;
  tierState: TierState;
  density?: Density;
  requiresApproval?: boolean;
  onRun?: (id: string) => void;
  onPreview?: (id: string) => void;
  className?: string;
}

export const GuidedFixCard: React.FC<GuidedFixCardProps> = ({
  id,
  title,
  description,
  os,
  safety,
  estMins,
  tierState,
  density = 'comfortable',
  requiresApproval = false,
  onRun,
  onPreview,
  className = ''
}) => {
  const isLocked = tierState === 'starterLocked';
  const isCompact = density === 'compact';

  const tierGuardMessages = {
    starterLocked: 'Starter ($33/mo) has safe fixes. Advanced fixes need Pro ($127/mo).',
    pro: 'Pro active. Remote runs use your session limit.',
    team: 'Team policy: need approval for risky steps.'
  };

  return (
    <Card className={`
      bubo-glass p-${isCompact ? '4' : '6'} transition-all duration-300 
      ${isLocked ? 'opacity-75' : 'hover:border-iq-neon-green/30 hover:bubo-glow-green'}
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-space-grotesk text-lg text-pure-white mb-1">{title}</h3>
          <p className="text-sm text-mist-gray">{description}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {os.map((osType) => (
          <OSBadge key={osType} os={osType} />
        ))}
        <SafetyChip level={safety} />
        <div className="flex items-center gap-1 text-xs text-mist-gray">
          <Clock className="w-3 h-3" />
          Est. {estMins}
        </div>
        {requiresApproval && tierState === 'team' && (
          <PolicyBadge />
        )}
      </div>

      {/* TierGuard Banner */}
      {tierState !== 'pro' && (
        <div className="mb-4">
          <TierGuard
            requiredTier={isLocked ? 'pro' : 'team'}
            currentTier="starter"
            featureName="Guided Fix"
            customMessage={tierGuardMessages[tierState]}
          >
            <div />
          </TierGuard>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onRun?.(id)}
          disabled={isLocked}
          className={`
            flex-1 bubo-btn-neon-primary
            ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        
        <Button
          onClick={() => onPreview?.(id)}
          variant="outline"
          className="bubo-btn-secondary"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>
    </Card>
  );
};
