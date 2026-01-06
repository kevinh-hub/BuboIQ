import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Clock, ExternalLink, RefreshCw, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TicketPreviewCardProps {
  ticketId: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: {
    name: string;
    avatar?: string;
    role: string;
  };
  sla: {
    remaining: string;
    percentage: number;
  };
  syncStatus: 'synced' | 'syncing' | 'pending' | 'error';
  platform?: 'buboiq' | 'zendesk' | 'jira' | 'servicenow';
  onView?: () => void;
  onSync?: () => void;
  className?: string;
}

const TicketPreviewCard: React.FC<TicketPreviewCardProps> = ({
  ticketId,
  title,
  priority,
  assignee,
  sla,
  syncStatus,
  platform = 'buboiq',
  onView,
  onSync,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityConfig = (p: string) => {
    switch (p) {
      case 'critical':
        return {
          color: 'text-crimson-danger',
          bg: 'bg-crimson-danger/10 border-crimson-danger/30',
          label: 'CRITICAL',
          icon: AlertTriangle
        };
      case 'high':
        return {
          color: 'text-amber-warning',
          bg: 'bg-amber-warning/10 border-amber-warning/30',
          label: 'HIGH',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          color: 'text-signal-yellow',
          bg: 'bg-signal-yellow/10 border-signal-yellow/30',
          label: 'MEDIUM',
          icon: Clock
        };
      default:
        return {
          color: 'text-iq-green',
          bg: 'bg-iq-green/10 border-iq-green/30',
          label: 'LOW',
          icon: CheckCircle
        };
    }
  };

  const getSyncConfig = (status: string) => {
    switch (status) {
      case 'synced':
        return {
          color: 'text-iq-green',
          bg: 'bg-iq-green/10',
          label: '✓ Synced',
          spinning: false
        };
      case 'syncing':
        return {
          color: 'text-signal-yellow',
          bg: 'bg-signal-yellow/10',
          label: '⟳ Syncing',
          spinning: true
        };
      case 'pending':
        return {
          color: 'text-mist-gray',
          bg: 'bg-mist-gray/10',
          label: '○ Pending',
          spinning: false
        };
      case 'error':
        return {
          color: 'text-crimson-danger',
          bg: 'bg-crimson-danger/10',
          label: '✗ Error',
          spinning: false
        };
      default:
        return {
          color: 'text-mist-gray',
          bg: 'bg-mist-gray/10',
          label: '○ Unknown',
          spinning: false
        };
    }
  };

  const getSLAColor = (percentage: number) => {
    if (percentage >= 70) return '#00FF85'; // iq-neon-green
    if (percentage >= 40) return '#FFD400'; // signal-yellow
    if (percentage >= 20) return '#F59E0B'; // amber-warning
    return '#EF4444'; // crimson-danger
  };

  const getPlatformLabel = (p: string) => {
    switch (p) {
      case 'zendesk': return 'Zendesk';
      case 'jira': return 'Jira';
      case 'servicenow': return 'ServiceNow';
      default: return 'BuboIQ';
    }
  };

  const priorityConfig = getPriorityConfig(priority);
  const syncConfig = getSyncConfig(syncStatus);
  const PriorityIcon = priorityConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className="bg-dark-midnight/80 border-iq-neon-green/20 backdrop-blur-xl 
                     hover:border-iq-neon-green/40 transition-all duration-300 
                     hover:shadow-[0_0_25px_rgba(0,255,133,0.1)] relative overflow-hidden">
        
        {/* Scanning Line Effect on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 300 }}
              exit={{ x: 300 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r 
                       from-transparent via-iq-neon-green/20 to-transparent 
                       pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        <div className="p-6 relative z-20">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <PriorityIcon className={`w-5 h-5 ${priorityConfig.color}`} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-pure-white font-mono">{ticketId}</h4>
                  <Badge className={`${priorityConfig.bg} ${priorityConfig.color} border text-xs font-bold`}>
                    {priorityConfig.label}
                  </Badge>
                </div>
                <p className="text-xs text-mist-gray">Platform: {getPlatformLabel(platform)}</p>
              </div>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${syncConfig.bg} ${syncConfig.color}`}>
              <motion.span
                animate={syncConfig.spinning ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: syncConfig.spinning ? Infinity : 0, ease: 'linear' }}
                className="inline-block mr-1"
              >
                {syncConfig.spinning ? '⟳' : syncConfig.label.charAt(0)}
              </motion.span>
              {syncConfig.label.substring(2)}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h5 className="text-pure-white font-medium leading-relaxed line-clamp-2">
              {title}
            </h5>
          </div>

          {/* Assignee */}
          {assignee && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-8 h-8 border border-iq-neon-green/30">
                <AvatarFallback className="bg-iq-neon-green/20 text-iq-neon-green text-xs font-semibold">
                  {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-pure-white truncate">{assignee.name}</p>
                <p className="text-xs text-mist-gray">{assignee.role}</p>
              </div>
              <User className="w-4 h-4 text-mist-gray" />
            </div>
          )}

          {/* SLA Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-signal-yellow" />
                <span className="text-xs text-mist-gray">SLA Remaining</span>
              </div>
              <span 
                className="text-xs font-bold font-mono" 
                style={{ color: getSLAColor(sla.percentage) }}
              >
                {sla.remaining}
              </span>
            </div>
            
            {/* SLA Bar */}
            <div className="w-full h-2 bg-mist-gray/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sla.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: getSLAColor(sla.percentage) }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={{
                    x: [-20, 100],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'easeInOut'
                  }}
                  className="w-4 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-mist-gray/30 text-mist-gray hover:text-pure-white 
                       hover:border-iq-neon-green/30 transition-all"
              onClick={onView}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
            
            {syncStatus !== 'synced' && onSync && (
              <Button
                size="sm"
                className="bubo-btn-neon-primary"
                onClick={onSync}
                disabled={syncStatus === 'syncing'}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            )}
            
            {syncStatus === 'synced' && (
              <Button
                size="sm"
                className="bg-iq-green/20 text-iq-green border border-iq-green/30 
                         hover:bg-iq-green/30 transition-all"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Updated
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Glow Line */}
        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                   from-transparent via-iq-neon-green/50 to-transparent"
        />
      </Card>
    </motion.div>
  );
};

export default TicketPreviewCard;