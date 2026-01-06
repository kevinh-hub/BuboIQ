import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/card';

interface KPIStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    value: string;
    isPositive?: boolean;
  };
  loading?: boolean;
  description?: string;
}

export const KPIStat: React.FC<KPIStatProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  loading = false,
  description 
}) => {
  if (loading) {
    return (
      <Card className="bubo-glass p-6">
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
          <div className="h-8 bg-white/10 rounded animate-pulse w-32" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-16" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bubo-glass p-6 hover:bg-white/[0.06] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm text-mist-gray mb-1">{label}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="font-['Space_Grotesk'] text-3xl">{value}</h3>
            </div>
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-iq-neon-green/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-iq-neon-green" />
            </div>
          )}
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.isPositive !== false 
              ? (trend.direction === 'up' ? 'text-iq-neon-green' : 'text-crimson-danger')
              : (trend.direction === 'up' ? 'text-crimson-danger' : 'text-iq-neon-green')
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-mist-gray mt-2">{description}</p>
        )}
      </Card>
    </motion.div>
  );
};
