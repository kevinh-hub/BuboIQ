import React from 'react';
import { motion } from 'motion/react';

interface IQMeterProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const IQMeter: React.FC<IQMeterProps> = ({ 
  value = 0,  // Add default value
  size = 'md', 
  showLabel = true, 
  animated = true 
}) => {
  // Ensure value is a valid number between 0-100
  const safeValue = typeof value === 'number' && !isNaN(value) 
    ? Math.min(Math.max(value, 0), 100) 
    : 0;
  
  const sizeConfig = {
    sm: { width: 'w-12 h-12', text: 'text-xs', strokeWidth: 2 },
    md: { width: 'w-16 h-16', text: 'text-sm', strokeWidth: 3 },
    lg: { width: 'w-24 h-24', text: 'text-lg', strokeWidth: 4 }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(safeValue / 100) * circumference} ${circumference}`;

  const getConfidenceColor = (val: number) => {
    if (val >= 80) return '#00FF85'; // iq-neon-green
    if (val >= 60) return '#FFD400'; // signal-yellow
    if (val >= 40) return '#F59E0B'; // amber-warning
    return '#EF4444'; // crimson-danger
  };

  const getConfidenceLabel = (val: number) => {
    if (val >= 90) return 'Excellent';
    if (val >= 80) return 'High';
    if (val >= 70) return 'Good';
    if (val >= 60) return 'Medium';
    if (val >= 40) return 'Low';
    return 'Critical';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${config.width}`}>
        {/* Glow Effect */}
        <motion.div
          animate={animated ? {
            boxShadow: [
              `0 0 10px ${getConfidenceColor(safeValue)}40`,
              `0 0 20px ${getConfidenceColor(safeValue)}80`,
              `0 0 10px ${getConfidenceColor(safeValue)}40`
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 rounded-full ${config.width}`}
        />
        
        {/* SVG Circle */}
        <svg className={`${config.width} transform -rotate-90`} viewBox="0 0 36 36">
          {/* Background Circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(156, 163, 175, 0.2)"
            strokeWidth={config.strokeWidth}
          />
          
          {/* Progress Circle */}
          <motion.path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getConfidenceColor(safeValue)}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            initial={animated ? { strokeDasharray: "0 100" } : { strokeDasharray }}
            animate={animated ? { strokeDasharray: `${safeValue} 100` } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${getConfidenceColor(safeValue)}60)`
            }}
          />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.text} font-bold`} style={{ color: getConfidenceColor(safeValue) }}>
            {safeValue}%
          </span>
        </div>
        
        {/* Pulse Ring */}
        {animated && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute inset-0 border-2 rounded-full ${config.width}`}
            style={{ borderColor: getConfidenceColor(safeValue) + '60' }}
          />
        )}
      </div>
      
      {showLabel && (
        <motion.div
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-xs text-mist-gray">IQ Confidence</div>
          <div 
            className="text-sm font-semibold" 
            style={{ color: getConfidenceColor(safeValue) }}
          >
            {getConfidenceLabel(safeValue)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IQMeter;