import React from 'react';
import { Button } from './ui/button';
import { OwlEye, SignalWave, NeuralNetwork } from './BuboIconPack';
import { Eye, Activity, Brain, Zap, AlertTriangle, Clock } from 'lucide-react';

// Collection of playful empty states for BuboIQ

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const BaseEmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon = OwlEye,
  action,
  variant = 'default'
}) => {
  const variantConfig = {
    default: {
      bgGradient: 'from-iq-green/5 to-signal-blue/5',
      iconBg: 'bg-iq-green/10',
      iconColor: 'text-iq-green',
      borderColor: 'border-iq-green/20'
    },
    success: {
      bgGradient: 'from-iq-green/5 to-glow-cyan/5',
      iconBg: 'bg-iq-green/10',
      iconColor: 'text-iq-green',
      borderColor: 'border-iq-green/20'
    },
    warning: {
      bgGradient: 'from-amber-warning/5 to-crimson-danger/5',
      iconBg: 'bg-amber-warning/10',
      iconColor: 'text-amber-warning',
      borderColor: 'border-amber-warning/20'
    },
    info: {
      bgGradient: 'from-signal-blue/5 to-prediction-purple/5',
      iconBg: 'bg-signal-blue/10',
      iconColor: 'text-signal-blue',
      borderColor: 'border-signal-blue/20'
    }
  };

  const config = variantConfig[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl p-12 mb-8 border ${config.borderColor} backdrop-blur-sm`}>
        <div className={`w-20 h-20 ${config.iconBg} rounded-2xl mx-auto flex items-center justify-center border ${config.borderColor} mb-6`}>
          <Icon size={32} className={`${config.iconColor} bubo-animate-float`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-cloud-white mb-3">{title}</h3>
      <p className="text-mist-gray max-w-md leading-relaxed text-lg mb-8">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bubo-btn-primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Specific empty states with personality

export const ObservatoryEmpty: React.FC<{ onCreateAction?: () => void }> = ({ onCreateAction }) => (
  <BaseEmptyState
    title="Nothing risky right now."
    description="Your computers are running well. When something looks wrong, you'll see it here first."
    icon={Eye}
    action={onCreateAction ? { label: "Set up monitoring", onClick: onCreateAction } : undefined}
    variant="success"
  />
);

export const SignalsEmpty: React.FC<{ onCreateSignal?: () => void }> = ({ onCreateSignal }) => (
  <BaseEmptyState
    title="No early warnings right now."
    description="We're watching your computers. Problems will show up here when we spot them."
    icon={SignalWave}
    action={onCreateSignal ? { label: "Add custom warning", onClick: onCreateSignal } : undefined}
    variant="info"
  />
);

export const IncidentsEmpty: React.FC<{ onCreateIncident?: () => void }> = ({ onCreateIncident }) => (
  <BaseEmptyState
    title="No open issues. Good place to be."
    description="When big problems happen, we'll group related issues together here."
    icon={AlertTriangle}
    action={onCreateIncident ? { label: "Open issue", onClick: onCreateIncident } : undefined}
    variant="success"
  />
);

export const AssistEmpty: React.FC<{ onStartChat?: () => void }> = ({ onStartChat }) => (
  <BaseEmptyState
    title="Ask me anything."
    description="I can help you understand what's happening with your computers and suggest fixes."
    icon={Brain}
    action={onStartChat ? { label: "Start asking", onClick: onStartChat } : undefined}
    variant="info"
  />
);

export const AutomationsEmpty: React.FC<{ onCreateAutomation?: () => void }> = ({ onCreateAutomation }) => (
  <BaseEmptyState
    title="No automations yet."
    description="Turn tasks you do over and over into automatic fixes. BuboIQ can learn what you do and suggest automations."
    icon={Zap}
    action={onCreateAutomation ? { label: "Create automation", onClick: onCreateAutomation } : undefined}
    variant="warning"
  />
);

export const PlaybooksEmpty: React.FC<{ onCreatePlaybook?: () => void }> = ({ onCreatePlaybook }) => (
  <BaseEmptyState
    title="No articles yet. Publish your first fix from an issue."
    description="Save your team's best fixes as step-by-step guides. Then anyone can use them."
    icon={NeuralNetwork}
    action={onCreatePlaybook ? { label: "Create article", onClick: onCreatePlaybook } : undefined}
    variant="info"
  />
);

export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="relative mb-8">
      <div className="w-16 h-16 bg-iq-green/10 rounded-2xl flex items-center justify-center border border-iq-green/20">
        <OwlEye size={32} className="text-iq-green" />
      </div>
      <div className="absolute inset-0 w-16 h-16 border-2 border-iq-green/30 rounded-2xl animate-ping" />
    </div>
    <h3 className="text-xl font-bold text-cloud-white mb-2">Loading</h3>
    <p className="text-mist-gray">{message}</p>
    <div className="mt-6 flex items-center space-x-1">
      <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

export const ErrorState: React.FC<{ 
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ 
  title = "We couldn't load this page. Try again.",
  message = "Something went wrong. Try refreshing or come back in a minute.",
  onRetry 
}) => (
  <BaseEmptyState
    title={title}
    description={message}
    icon={AlertTriangle}
    action={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
    variant="warning"
  />
);

export const MaintenanceState: React.FC = () => (
  <BaseEmptyState
    title="We're doing maintenance"
    description="BuboIQ will be back in a few minutes."
    icon={Clock}
    variant="info"
  />
);

export const BuboEmptyStates = {
  ObservatoryEmpty,
  SignalsEmpty,
  IncidentsEmpty,
  AssistEmpty,
  AutomationsEmpty,
  PlaybooksEmpty,
  LoadingState,
  ErrorState,
  MaintenanceState
};

export default BuboEmptyStates;