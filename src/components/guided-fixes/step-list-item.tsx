import React from 'react';
import { Lock, Circle, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

export type StepState = 'locked' | 'ready' | 'running' | 'complete' | 'error';

interface StepListItemProps {
  index: number;
  title: string;
  state: StepState;
  parserSignal?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const stateConfig: Record<StepState, { icon: React.ReactNode; color: string }> = {
  locked: {
    icon: <Lock className="w-4 h-4" />,
    color: 'text-mist-gray'
  },
  ready: {
    icon: <Circle className="w-4 h-4" />,
    color: 'text-mist-gray'
  },
  running: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    color: 'text-electric-blue'
  },
  complete: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-success-green'
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-crimson-danger'
  }
};

export const StepListItem: React.FC<StepListItemProps> = ({
  index,
  title,
  state,
  parserSignal,
  onClick,
  isActive = false
}) => {
  const config = stateConfig[state];

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-iq-neon-green/10 border border-iq-neon-green/30' 
          : 'bg-surface-dark/30 border border-transparent hover:border-slate-gray/30'
        }
        ${state === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Index Badge */}
      <div className={`
        flex items-center justify-center w-6 h-6 rounded-full text-xs font-jetbrains
        ${isActive ? 'bg-iq-neon-green text-dark-midnight' : 'bg-surface-dark text-mist-gray'}
      `}>
        {index}
      </div>

      {/* State Icon */}
      <div className={config.color}>
        {config.icon}
      </div>

      {/* Title */}
      <div className="flex-1">
        <p className={`text-sm ${isActive ? 'text-pure-white' : 'text-cloud-white'}`}>
          {title}
        </p>
      </div>

      {/* Parser Signal */}
      {parserSignal && (
        <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs gap-1">
          <AlertCircle className="w-3 h-3" />
          {parserSignal}
        </Badge>
      )}
    </div>
  );
};
