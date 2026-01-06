import React from 'react';
import { RefreshCw, AlertTriangle, Inbox, Database, Wifi, WifiOff, Brain, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

// Loading skeleton components
export const TicketListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Card key={i} className="p-6 bg-card border-border">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const DeviceListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const SignalStreamSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="p-4 bg-card border-border">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-2 h-12 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </Card>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6 bg-card border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-12 h-6 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// Error state components
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'network' | 'server' | 'permission' | 'generic';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  type = 'generic'
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          defaultTitle: 'Can\'t connect',
          defaultMessage: 'Can\'t reach BuboIQ. Check your internet connection.',
          iconColor: 'text-amber-warning'
        };
      case 'server':
        return {
          icon: Database,
          defaultTitle: 'Server problem',
          defaultMessage: 'Our servers have a problem. We\'re fixing it.',
          iconColor: 'text-crimson-danger'
        };
      case 'permission':
        return {
          icon: AlertTriangle,
          defaultTitle: 'Can\'t access this',
          defaultMessage: 'You don\'t have permission to see this.',
          iconColor: 'text-signal-yellow'
        };
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: 'Something broke',
          defaultMessage: 'Something went wrong. Try again.',
          iconColor: 'text-mist-gray'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="bubo-glass p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-slate-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        
        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-pure-white mb-3">
          {title || config.defaultTitle}
        </h3>
        
        <p className="text-mist-gray text-sm mb-6 leading-relaxed">
          {message || config.defaultMessage}
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bubo-btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </Card>
    </div>
  );
};

// Empty state components
interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'tickets' | 'devices' | 'signals' | 'sessions' | 'generic';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  type = 'generic'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'tickets':
        return {
          icon: Inbox,
          defaultTitle: 'No issues',
          defaultMessage: 'All clear right now. Nice job!',
          iconColor: 'text-iq-neon-green',
          suggestion: 'Issues will show up here when something breaks.'
        };
      case 'devices':
        return {
          icon: Wifi,
          defaultTitle: 'No devices registered',
          defaultMessage: 'Connect your first device to start monitoring your IT infrastructure.',
          iconColor: 'text-electric-blue',
          suggestion: 'Add devices to enable remote access and monitoring.'
        };
      case 'signals':
        return {
          icon: Brain,
          defaultTitle: 'No signals detected',
          defaultMessage: 'Your systems are running smoothly - no alerts or warnings detected.',
          iconColor: 'text-iq-neon-green',
          suggestion: 'Signals will appear here when issues are detected across your infrastructure.'
        };
      case 'sessions':
        return {
          icon: Zap,
          defaultTitle: 'No remote sessions',
          defaultMessage: 'No active or recent remote access sessions found.',
          iconColor: 'text-cyan-accent',
          suggestion: 'Remote sessions will be logged here for audit and compliance purposes.'
        };
      default:
        return {
          icon: Inbox,
          defaultTitle: 'No data available',
          defaultMessage: 'There\'s nothing to display right now.',
          iconColor: 'text-mist-gray',
          suggestion: null
        };
    }
  };

  const config = getEmptyConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="bubo-glass p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-slate-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        
        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-pure-white mb-3">
          {title || config.defaultTitle}
        </h3>
        
        <p className="text-mist-gray text-sm mb-4 leading-relaxed">
          {message || config.defaultMessage}
        </p>
        
        {config.suggestion && (
          <p className="text-cyan-accent text-xs mb-6">
            {config.suggestion}
          </p>
        )}
        
        {action && (
          <Button
            onClick={action.onClick}
            className="bubo-btn-neon-primary"
          >
            {action.label}
          </Button>
        )}
      </Card>
    </div>
  );
};

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`${sizeClasses[size]} border-2 border-slate-gray border-t-iq-neon-green rounded-full animate-spin`} />
      {message && (
        <p className="text-mist-gray text-sm mt-3 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// System status component for observability
interface SystemStatusProps {
  uptime?: number;
  errorRate?: number;
  queueDepth?: number;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  uptime = 99.9,
  errorRate = 0.1,
  queueDepth = 0
}) => {
  const getStatusColor = (value: number, type: 'uptime' | 'error' | 'queue') => {
    switch (type) {
      case 'uptime':
        if (value >= 99.5) return 'text-iq-neon-green';
        if (value >= 95) return 'text-signal-yellow';
        return 'text-crimson-danger';
      case 'error':
        if (value <= 1) return 'text-iq-neon-green';
        if (value <= 5) return 'text-signal-yellow';
        return 'text-crimson-danger';
      case 'queue':
        if (value <= 10) return 'text-iq-neon-green';
        if (value <= 50) return 'text-signal-yellow';
        return 'text-crimson-danger';
      default:
        return 'text-mist-gray';
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h4 className="font-['Space_Grotesk'] text-sm font-medium text-pure-white mb-3">
        System Status
      </h4>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist-gray">Uptime</span>
          <span className={getStatusColor(uptime, 'uptime')}>
            {uptime.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist-gray">Error Rate</span>
          <span className={getStatusColor(errorRate, 'error')}>
            {errorRate.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist-gray">Queue Depth</span>
          <span className={getStatusColor(queueDepth, 'queue')}>
            {queueDepth}
          </span>
        </div>
      </div>
    </Card>
  );
};