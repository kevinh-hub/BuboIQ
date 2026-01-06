import React from 'react';
import { Monitor, Apple, ServerIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export type OSType = 'windows' | 'macos' | 'linux';

interface OSBadgeProps {
  os: OSType;
  version?: string;
  className?: string;
}

const osConfig: Record<OSType, { icon: React.ReactNode; label: string; color: string }> = {
  windows: {
    icon: <Monitor className="w-3 h-3" />,
    label: 'Windows',
    color: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30'
  },
  macos: {
    icon: <Apple className="w-3 h-3" />,
    label: 'macOS',
    color: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30'
  },
  linux: {
    icon: <ServerIcon className="w-3 h-3" />,
    label: 'Linux',
    color: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30'
  }
};

export const OSBadge: React.FC<OSBadgeProps> = ({ os, version, className = '' }) => {
  const config = osConfig[os];
  
  const badgeContent = (
    <Badge className={`${config.color} text-xs gap-1 ${className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );

  if (version) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{config.label} {version}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
};
