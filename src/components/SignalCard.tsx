import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Activity, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SignalCardProps {
  id: string;
  source: string;
  message: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  correlations: string[];
  metadata?: Record<string, any>;
  onPromote?: (signalId: string) => void;
  expandable?: boolean;
  className?: string;
}

const SignalCard: React.FC<SignalCardProps> = ({
  id,
  source,
  message,
  confidence = 0,  // Add default value
  severity,
  timestamp,
  correlations,
  metadata,
  onPromote,
  expandable = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ensure confidence is a valid number between 0-100
  const safeConfidence = typeof confidence === 'number' && !isNaN(confidence) 
    ? Math.min(Math.max(confidence, 0), 100) 
    : 0;

  const getSeverityConfig = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          color: 'text-crimson-danger',
          bg: 'bg-crimson-danger/10 border-crimson-danger/30',
          glow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
          icon: AlertTriangle,
          label: 'CRITICAL'
        };
      case 'high':
        return {
          color: 'text-amber-warning',
          bg: 'bg-amber-warning/10 border-amber-warning/30',
          glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
          icon: AlertTriangle,
          label: 'HIGH'
        };
      case 'medium':
        return {
          color: 'text-signal-yellow',
          bg: 'bg-signal-yellow/10 border-signal-yellow/30',
          glow: 'hover:shadow-[0_0_25px_rgba(255,212,0,0.2)]',
          icon: Info,
          label: 'MEDIUM'
        };
      default:
        return {
          color: 'text-iq-green',
          bg: 'bg-iq-green/10 border-iq-green/30',
          glow: 'hover:shadow-[0_0_25px_rgba(46,204,113,0.2)]',
          icon: CheckCircle,
          label: 'LOW'
        };
    }
  };

  const severityConfig = getSeverityConfig(severity);
  const SeverityIcon = severityConfig.icon;

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return '#00FF85';
    if (conf >= 70) return '#FFD400';
    if (conf >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        ${severityConfig.bg} border rounded-xl backdrop-blur-sm 
        ${severityConfig.glow} transition-all duration-500 
        cursor-pointer relative overflow-hidden ${className}
      `}
      onClick={() => expandable && setIsExpanded(!isExpanded)}
    >
      {/* Scanning Line Effect */}
      <motion.div
        animate={{
          x: [-100, 300],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut'
        }}
        className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r 
                 from-transparent via-iq-neon-green/20 to-transparent 
                 pointer-events-none"
      />

      <div className="p-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <SeverityIcon className={`w-4 h-4 ${severityConfig.color}`} />
            <span className="font-medium text-mist-gray text-sm">{source}</span>
            {expandable && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-mist-gray" />
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${severityConfig.bg} ${severityConfig.color} border text-xs font-bold`}>
              {severityConfig.label}
            </Badge>
            <span className="text-xs text-mist-gray font-mono">
              {formatTime(timestamp)}
            </span>
          </div>
        </div>

        {/* Signal Message */}
        <div className="mb-4">
          <p className="text-pure-white font-medium text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Confidence Ring */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-mist-gray">Confidence:</span>
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.2)"
                  strokeWidth="2"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getConfidenceColor(safeConfidence)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${safeConfidence} 100` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: getConfidenceColor(safeConfidence) }}>
                  {safeConfidence}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-mist-gray">
            ID: <span className="font-mono text-iq-neon-green">{id}</span>
          </div>
        </div>

        {/* Correlations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {correlations.map((correlation, index) => (
            <motion.span
              key={correlation}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="px-2 py-1 bg-signal-blue/20 text-signal-blue text-xs 
                       rounded-full border border-signal-blue/30 backdrop-blur-sm"
            >
              {correlation}
            </motion.span>
          ))}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-mist-gray/20 pt-4 space-y-4"
            >
              {/* Metadata */}
              {metadata && (
                <div>
                  <h4 className="text-sm font-semibold text-pure-white mb-2">Metadata</h4>
                  <div className="bg-neural-black/50 rounded-lg p-3 font-mono text-xs">
                    <pre className="text-mist-gray whitespace-pre-wrap">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-mist-gray/30 text-mist-gray hover:text-pure-white"
                >
                  View Details
                </Button>
                {onPromote && (
                  <Button
                    size="sm"
                    className="bubo-btn-neon-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromote(id);
                    }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Promote
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow Line at Bottom */}
      <motion.div
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute bottom-0 left-0 right-0 h-px ${severityConfig.color.replace('text-', 'bg-')}/50`}
      />
    </motion.div>
  );
};

export default SignalCard;