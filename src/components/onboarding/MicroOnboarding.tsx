import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { 
  Lock, 
  Crown, 
  X, 
  ArrowRight, 
  Lightbulb, 
  Settings,
  Zap,
  Users,
  Shield,
  ChevronRight
} from 'lucide-react';

interface TierGuardProps {
  featureName: string;
  requiredTier: 'Pro' | 'Team';
  onUpgrade?: () => void;
  children: React.ReactNode;
}

interface DripTipProps {
  tip: {
    id: string;
    title: string;
    message: string;
    action?: string;
    actionLink?: string;
  };
  onDismiss: (tipId: string) => void;
  onAction?: () => void;
}

// TierGuard Component - Locks features behind upgrade
export const TierGuard: React.FC<TierGuardProps> = ({ 
  featureName, 
  requiredTier, 
  onUpgrade, 
  children 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      {/* Locked Feature Overlay */}
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-dark-midnight/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <TooltipProvider>
            <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
              <TooltipTrigger asChild>
                <motion.div
                  className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center cursor-pointer border-2 border-iq-neon-green/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTooltip(true)}
                >
                  <Lock className="w-8 h-8 text-iq-neon-green" />
                </motion.div>
              </TooltipTrigger>
              
              <TooltipContent side="top" className="bubo-glass-bright p-4 border border-iq-neon-green/30 max-w-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Crown className="w-5 h-5 text-iq-neon-green" />
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      {requiredTier}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-pure-white mb-3">
                    <strong>{featureName}</strong> is part of {requiredTier}. Upgrade when ready.
                  </p>
                  
                  {onUpgrade && (
                    <Button 
                      size="sm" 
                      onClick={onUpgrade}
                      className="bubo-btn-neon-primary w-full"
                    >
                      Upgrade to {requiredTier}
                    </Button>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

// Drip Tips Component - Shows contextual tips
export const DripTip: React.FC<DripTipProps> = ({ tip, onDismiss, onAction }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(tip.id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Card className="bubo-glass-bright p-6 border border-iq-neon-green/30">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-iq-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-iq-neon-green" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-2 text-sm">
                  {tip.title}
                </h4>
                <p className="text-xs text-mist-gray mb-4 leading-relaxed">
                  {tip.message}
                </p>
                
                <div className="flex items-center space-x-3">
                  {tip.action && (
                    <Button 
                      size="sm" 
                      onClick={onAction}
                      className="bubo-btn-neon-primary text-xs px-4 py-2"
                    >
                      {tip.action}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-mist-gray hover:text-pure-white text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="p-1 text-mist-gray hover:text-pure-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Drip Tips Manager - Manages the sequence of tips
interface DripTipsManagerProps {
  userRole: string;
  currentPage?: string;
  onUpgrade?: () => void;
}

const getTipsForContext = (userRole: string, currentPage?: string) => {
  const baseTips = [
    {
      id: 'playbooks-tip',
      title: 'Pro Tip: Auto-fix',
      message: 'Want to auto-fix password resets? Turn on Playbooks → User Management for instant wins.',
      action: 'Enable Playbooks',
      actionLink: '/settings/playbooks'
    },
    {
      id: 'integrations-tip',
      title: 'Connect More Tools',
      message: 'Connect your PSA or chat tools to see tickets flow in automatically. More connections = smarter intelligence.',
      action: 'Add Integration',
      actionLink: '/integrations'
    },
    {
      id: 'intelligence-tip',
      title: 'Intelligence Learning',
      message: 'BuboIQ learns from each resolved ticket. The more you use it, the smarter it gets at predicting solutions.',
      action: 'View Insights',
      actionLink: '/intelligence'
    }
  ];

  // Role-specific tips
  if (userRole === 'msp') {
    baseTips.push({
      id: 'client-dashboard-tip',
      title: 'MSP Pro Tip',
      message: 'Set up client-specific dashboards to track SLA performance and showcase value to your customers.',
      action: 'Setup Dashboards',
      actionLink: '/clients/dashboards'
    });
  }

  if (userRole === 'business-owner') {
    baseTips.push({
      id: 'business-health-tip',
      title: 'Business Health Monitor',
      message: 'Your IT Health Score shows how technology impacts productivity. Green means your team can focus on business.',
      action: 'View Health Score',
      actionLink: '/health'
    });
  }

  return baseTips;
};

export const DripTipsManager: React.FC<DripTipsManagerProps> = ({ 
  userRole, 
  currentPage, 
  onUpgrade 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [showTip, setShowTip] = useState(false);

  const tips = getTipsForContext(userRole, currentPage);
  const availableTips = tips.filter(tip => !dismissedTips.includes(tip.id));

  // Show first tip after delay
  useEffect(() => {
    if (availableTips.length > 0) {
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 5000); // Show first tip after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [availableTips.length]);

  // Cycle through tips every login
  useEffect(() => {
    const savedIndex = localStorage.getItem('bubo_last_tip_index');
    if (savedIndex && availableTips.length > 0) {
      const nextIndex = (parseInt(savedIndex) + 1) % availableTips.length;
      setCurrentTipIndex(nextIndex);
    }
  }, [availableTips.length]);

  const handleDismissTip = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId]);
    setShowTip(false);
    
    // Save dismissed tips to localStorage
    const newDismissed = [...dismissedTips, tipId];
    localStorage.setItem('bubo_dismissed_tips', JSON.stringify(newDismissed));
    
    // Update tip index
    localStorage.setItem('bubo_last_tip_index', currentTipIndex.toString());
  };

  const handleTipAction = () => {
    const currentTip = availableTips[currentTipIndex];
    if (currentTip?.actionLink) {
      // In a real app, you'd navigate to the actionLink
      console.log('Navigate to:', currentTip.actionLink);
    }
    handleDismissTip(currentTip.id);
  };

  if (!showTip || availableTips.length === 0 || currentTipIndex >= availableTips.length) {
    return null;
  }

  return (
    <DripTip
      tip={availableTips[currentTipIndex]}
      onDismiss={handleDismissTip}
      onAction={handleTipAction}
    />
  );
};

// Feature Lock Examples - Pre-built locked features
export const LockedFeatureExamples = {
  AdvancedAnalytics: ({ onUpgrade }: { onUpgrade?: () => void }) => (
    <TierGuard featureName="Powerful Analytics" requiredTier="Pro" onUpgrade={onUpgrade}>
      <Card className="bubo-glass p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-electric-blue" />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Powerful Analytics</h3>
            <p className="text-sm text-mist-gray">Predictive insights and trend analysis</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-mist-gray/20 rounded"></div>
          <div className="h-4 bg-mist-gray/20 rounded w-3/4"></div>
          <div className="h-4 bg-mist-gray/20 rounded w-1/2"></div>
        </div>
      </Card>
    </TierGuard>
  ),

  TeamCollaboration: ({ onUpgrade }: { onUpgrade?: () => void }) => (
    <TierGuard featureName="Team Collaboration" requiredTier="Team" onUpgrade={onUpgrade}>
      <Card className="bubo-glass p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-iq-neon-green" />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Team Collaboration</h3>
            <p className="text-sm text-mist-gray">Multi-user workspaces and shared workflows</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-8 h-8 bg-mist-gray/30 rounded-full border-2 border-dark-midnight"></div>
          ))}
        </div>
      </Card>
    </TierGuard>
  ),

  AdvancedSecurity: ({ onUpgrade }: { onUpgrade?: () => void }) => (
    <TierGuard featureName="Powerful Security" requiredTier="Pro" onUpgrade={onUpgrade}>
      <Card className="bubo-glass p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-signal-yellow/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-signal-yellow" />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Powerful Security</h3>
            <p className="text-sm text-mist-gray">Better encryption and audit logs</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-signal-yellow/10 rounded-lg border border-signal-yellow/30">
            <div className="text-xs text-pure-white">Audit Logs</div>
          </div>
          <div className="p-3 bg-signal-yellow/10 rounded-lg border border-signal-yellow/30">
            <div className="text-xs text-pure-white">2FA Required</div>
          </div>
        </div>
      </Card>
    </TierGuard>
  )
};