import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, CheckCircle, Clock, AlertCircle, Settings, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Adapter {
  id: string;
  name: string;
  icon?: string;
  status: 'connected' | 'connecting' | 'error' | 'available';
  syncCount?: number;
  lastSync?: Date;
  version?: string;
  isNative?: boolean;
}

interface AdaptersRowProps {
  adapters: Adapter[];
  onConnect?: (adapterId: string) => void;
  onConfigure?: (adapterId: string) => void;
  onSync?: (adapterId: string) => void;
  className?: string;
}

const AdaptersRow: React.FC<AdaptersRowProps> = ({
  adapters,
  onConnect,
  onConfigure,
  onSync,
  className = ''
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          color: 'text-iq-green',
          bg: 'bg-iq-green/10 border-iq-green/30',
          label: 'Connected',
          icon: CheckCircle,
          pulse: false
        };
      case 'connecting':
        return {
          color: 'text-signal-yellow',
          bg: 'bg-signal-yellow/10 border-signal-yellow/30',
          label: 'Connecting',
          icon: Clock,
          pulse: true
        };
      case 'error':
        return {
          color: 'text-crimson-danger',
          bg: 'bg-crimson-danger/10 border-crimson-danger/30',
          label: 'Error',
          icon: AlertCircle,
          pulse: false
        };
      default:
        return {
          color: 'text-mist-gray',
          bg: 'bg-mist-gray/10 border-mist-gray/30',
          label: 'Available',
          icon: ExternalLink,
          pulse: false
        };
    }
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <h4 className="text-lg font-semibold text-pure-white">External Platform Adapters</h4>
        <Badge className="bg-signal-blue/20 text-signal-blue border-signal-blue/30">
          {adapters.filter(a => a.status === 'connected').length} Connected
        </Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-mist-gray/30">
        {adapters.map((adapter, index) => {
          const statusConfig = getStatusConfig(adapter.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={adapter.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <Card className={`w-64 p-6 backdrop-blur-xl transition-all duration-300 
                             hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,133,0.1)]
                             ${statusConfig.bg} border relative overflow-hidden`}>
                
                {/* Background Effect */}
                <motion.div
                  animate={statusConfig.pulse ? {
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: statusConfig.pulse ? Infinity : 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-current/5 to-transparent"
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Platform Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                   ${statusConfig.bg} border ${statusConfig.color}`}>
                        {adapter.isNative ? (
                          <Zap className="w-6 h-6" />
                        ) : (
                          <ExternalLink className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-pure-white">{adapter.name}</h5>
                        {adapter.version && (
                          <p className="text-xs text-mist-gray">v{adapter.version}</p>
                        )}
                      </div>
                    </div>

                    <motion.div
                      animate={statusConfig.pulse ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 2, repeat: statusConfig.pulse ? Infinity : 0, ease: 'linear' }}
                    >
                      <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    </motion.div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <Badge className={`${statusConfig.bg} ${statusConfig.color} border text-xs font-medium`}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Stats */}
                  {adapter.status === 'connected' && (
                    <div className="space-y-2 mb-4">
                      {adapter.syncCount !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-mist-gray">Synced Tickets:</span>
                          <span className="text-iq-green font-mono">{adapter.syncCount}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-mist-gray">Last Sync:</span>
                        <span className="text-cyan-accent font-mono">
                          {formatLastSync(adapter.lastSync)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {adapter.status === 'available' && onConnect && (
                      <Button
                        size="sm"
                        className="flex-1 bubo-btn-neon-primary"
                        onClick={() => onConnect(adapter.id)}
                      >
                        Connect
                      </Button>
                    )}
                    
                    {adapter.status === 'connected' && (
                      <>
                        {onSync && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-iq-green/30 text-iq-green hover:bg-iq-green/10"
                            onClick={() => onSync(adapter.id)}
                          >
                            Sync Now
                          </Button>
                        )}
                        
                        {onConfigure && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 text-mist-gray hover:text-pure-white"
                            onClick={() => onConfigure(adapter.id)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                    
                    {adapter.status === 'error' && onConnect && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-crimson-danger/30 text-crimson-danger hover:bg-crimson-danger/10"
                        onClick={() => onConnect(adapter.id)}
                      >
                        Reconnect
                      </Button>
                    )}
                    
                    {adapter.status === 'connecting' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-signal-yellow/30 text-signal-yellow cursor-not-allowed"
                        disabled
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                        </motion.div>
                        Connecting...
                      </Button>
                    )}
                  </div>
                </div>

                {/* Connection Indicator */}
                {adapter.status === 'connected' && (
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-2 right-2 w-3 h-3 bg-iq-green rounded-full"
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
        
        {/* Add New Adapter Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: adapters.length * 0.1 }}
          className="flex-shrink-0"
        >
          <Card className="w-64 p-6 bg-mist-gray/5 border-dashed border-mist-gray/30 
                         backdrop-blur-xl transition-all duration-300 hover:border-iq-neon-green/30 
                         hover:bg-iq-neon-green/5 cursor-pointer group">
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 border-2 border-dashed border-mist-gray/50 
                         rounded-xl flex items-center justify-center mb-4 
                         group-hover:border-iq-neon-green/50 transition-colors"
              >
                <ExternalLink className="w-8 h-8 text-mist-gray group-hover:text-iq-neon-green transition-colors" />
              </motion.div>
              
              <h5 className="font-medium text-mist-gray group-hover:text-iq-neon-green 
                           transition-colors mb-2">
                Add Integration
              </h5>
              
              <p className="text-xs text-mist-gray/70 group-hover:text-mist-gray transition-colors">
                Connect external ticketing platforms
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdaptersRow;