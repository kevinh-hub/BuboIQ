import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PolicyBadgeProps {
  message?: string;
  className?: string;
}

export const PolicyBadge: React.FC<PolicyBadgeProps> = ({ 
  message = 'Approval required',
  className = '' 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 gap-1 ${className}`}>
            <ShieldAlert className="w-3 h-3" />
            {message}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Team policy: destructive actions require approval before execution</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
