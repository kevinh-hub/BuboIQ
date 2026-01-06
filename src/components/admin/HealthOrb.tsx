import React from 'react';
import { motion } from 'motion/react';
import { Tooltip } from '../ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type HealthStatus = 'active' | 'idle' | 'at-risk' | 'critical';

interface HealthOrbProps {
  status: HealthStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthOrb: React.FC<HealthOrbProps> = ({ status, label, size = 'md' }) => {
  const statusConfig = {
    active: {
      color: '#00FF85',
      bgColor: 'rgba(0, 255, 133, 0.2)',
      label: 'Active',
      description: 'Recently active, all systems normal'
    },
    idle: {
      color: '#FFB800',
      bgColor: 'rgba(255, 184, 0, 0.2)',
      label: 'Idle',
      description: 'No recent activity'
    },
    'at-risk': {
      color: '#FF6B00',
      bgColor: 'rgba(255, 107, 0, 0.2)',
      label: 'At Risk',
      description: 'Requires attention'
    },
    critical: {
      color: '#FF3366',
      bgColor: 'rgba(255, 51, 102, 0.2)',
      label: 'Critical',
      description: 'Immediate action needed'
    }
  };

  const sizeConfig = {
    sm: { orb: 'w-2 h-2', container: 'w-6 h-6' },
    md: { orb: 'w-3 h-3', container: 'w-8 h-8' },
    lg: { orb: 'w-4 h-4', container: 'w-10 h-10' }
  };

  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`${sizes.container} rounded-full flex items-center justify-center cursor-help`}
            style={{ backgroundColor: config.bgColor }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className={`${sizes.orb} rounded-full`}
              style={{ backgroundColor: config.color }}
              animate={{
                boxShadow: [
                  `0 0 0px ${config.color}`,
                  `0 0 10px ${config.color}`,
                  `0 0 0px ${config.color}`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{label || config.label}</p>
            <p className="text-xs text-mist-gray">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
