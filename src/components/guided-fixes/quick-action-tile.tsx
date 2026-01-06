import React from 'react';
import { LucideIcon, Zap } from 'lucide-react';
import { OSBadge, OSType } from './os-badge';
import { SafetyChip, SafetyLevel } from './safety-chip';

interface QuickActionTileProps {
  id: string;
  icon?: LucideIcon;
  title: string;
  os: OSType;
  safety: SafetyLevel;
  onClick?: (id: string) => void;
  disabled?: boolean;
  className?: string;
}

export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  id,
  icon: Icon = Zap,
  title,
  os,
  safety,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={() => !disabled && onClick?.(id)}
      disabled={disabled}
      className={`
        bubo-glass p-4 rounded-lg transition-all duration-300 text-left
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:border-iq-neon-green/30 hover:bubo-glow-green cursor-pointer active:scale-95'
        }
        ${className}
      `}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-iq-neon-green/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-iq-neon-green" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-space-grotesk text-pure-white mb-1">{title}</h4>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <OSBadge os={os} />
        <SafetyChip level={safety} />
      </div>
    </button>
  );
};
