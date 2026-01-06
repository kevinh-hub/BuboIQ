import React, { ReactNode } from 'react';
import { Lock, Zap, Crown, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface TierGuardProps {
  requiredTier: 'starter' | 'pro' | 'team';
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  feature?: string;
  onUpgrade?: () => void;
}

const TIER_CONFIG: Record<string, any> = {
  starter: {
    name: 'Starter',
    icon: Zap,
    color: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30',
    price: '$19/month',
    description: 'Good for small teams just getting started'
  },
  pro: {
    name: 'Pro',
    icon: Zap,
    color: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
    price: '$79/month',
    description: 'More features for growing teams'
  },
  team: {
    name: 'Team',
    icon: Crown,
    color: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30',
    price: '$149/month',
    description: 'Enterprise features for big companies'
  },
  trial: {
    name: 'Trial',
    icon: Clock,
    color: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
    price: 'Free',
    description: 'Full access for 14 days'
  },
  basic: {
    name: 'Starter',
    icon: Zap,
    color: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30',
    price: '$19/month',
    description: 'Good for small teams just getting started'
  }
};

const TIER_HIERARCHY: Record<string, number> = {
  starter: 1,
  basic: 1,
  pro: 2,
  team: 3,
  trial: 4,
  super_admin: 5
};

export const TierGuard: React.FC<TierGuardProps> = ({
  requiredTier,
  children,
  fallback,
  showUpgrade = true,
  feature,
  onUpgrade
}) => {
  const { user, checkTierAccess, checkFeatureAccess } = useAuth();

  // If no user, show login prompt instead of tier restriction
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="bubo-glass p-6 text-center max-w-md">
          <Lock className="w-12 h-12 text-mist-gray mx-auto mb-4" />
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-pure-white mb-2">
            Sign in required
          </h3>
          <p className="text-mist-gray text-sm">
            Log in to use this.
          </p>
        </Card>
      </div>
    );
  }

  // Check if user has required tier access AND feature access
  const tierAccess = checkTierAccess(requiredTier);
  const featureAccess = feature && checkFeatureAccess ? checkFeatureAccess(feature) : true;
  
  const hasAccess = tierAccess && featureAccess;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Track tier restriction analytics
  React.useEffect(() => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'tierguard_block', {
        required_tier: requiredTier,
        current_tier: user.tier,
        feature: feature || 'unknown',
        user_id: user.id,
        org_id: user.org_id
      });
    }
  }, [requiredTier, user.tier, user.id, user.org_id, feature]);

  // Safe config access
  const requiredTierConfig = TIER_CONFIG[requiredTier] || TIER_CONFIG.pro;
  const currentUserTierConfig = TIER_CONFIG[user.tier] || TIER_CONFIG.starter;
  
  // Default upgrade prompt
  if (!showUpgrade) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="bubo-glass p-6 text-center max-w-md">
          <Lock className="w-12 h-12 text-mist-gray mx-auto mb-4" />
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-pure-white mb-2">
            Feature Restricted
          </h3>
          <p className="text-mist-gray text-sm">
            This feature requires {requiredTierConfig.name} tier access.
          </p>
        </Card>
      </div>
    );
  }

  const RequiredIcon = requiredTierConfig.icon;

  const handleUpgradeClick = () => {
    // Track upgrade intent
    if ((window as any).gtag) {
      (window as any).gtag('event', 'upgrade_intent', {
        source: 'tierguard',
        target_tier: requiredTier,
        current_tier: user.tier,
        feature: feature || 'unknown'
      });
    }

    if (onUpgrade) {
      onUpgrade();
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="bubo-glass p-8 text-center max-w-lg space-y-6">
        {/* Tier Badge and Icon */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-slate-gray/20 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-mist-gray" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge className={`${requiredTierConfig.color} text-xs px-2 py-1`}>
                <RequiredIcon className="w-3 h-3 mr-1" />
                {requiredTierConfig.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
            Upgrade to {requiredTierConfig.name}
          </h3>
          {feature && (
            <p className="text-mist-gray text-sm">
              <span className="text-iq-neon-green font-medium">{feature}</span> requires {requiredTierConfig.name} tier access
            </p>
          )}
        </div>

        {/* Current vs Required Tier */}
        <div className="flex items-center justify-center space-x-4 py-4">
          <div className="text-center">
            <div className="text-xs text-mist-gray mb-1">Current</div>
            <Badge className="bg-slate-gray/20 text-mist-gray border-slate-gray/30">
              {currentUserTierConfig.name}
            </Badge>
          </div>
          <ArrowRight className="w-4 h-4 text-mist-gray" />
          <div className="text-center">
            <div className="text-xs text-mist-gray mb-1">Required</div>
            <Badge className={requiredTierConfig.color}>
              <RequiredIcon className="w-3 h-3 mr-1" />
              {requiredTierConfig.name}
            </Badge>
          </div>
        </div>

        {/* Tier Description */}
        <p className="text-sm text-cloud-white/80 max-w-md mx-auto">
          {requiredTierConfig.description}
        </p>

        {/* Pricing */}
        <div className="text-center py-2">
          <div className="text-2xl font-['Space_Grotesk'] font-bold text-pure-white">
            {requiredTierConfig.price}
          </div>
          <div className="text-xs text-mist-gray">
            Billed monthly • Cancel anytime
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleUpgradeClick}
            className="flex-1 bubo-btn-neon-primary"
          >
            <RequiredIcon className="w-4 h-4 mr-2" />
            Upgrade to {requiredTierConfig.name}
          </Button>
          {requiredTier !== 'team' && (
            <Button
              variant="ghost"
              className="text-cyan-accent hover:text-pure-white hover:bg-cyan-accent/10"
            >
              Compare Plans
            </Button>
          )}
        </div>

        {/* Features Preview */}
        <div className="pt-4 border-t border-slate-gray/30">
          <p className="text-xs text-mist-gray text-center">
            Unlock advanced intelligence features, expanded device limits, and priority support
          </p>
        </div>
      </Card>
    </div>
  );
};

// Higher-order component for wrapping components with tier protection
export const withTierGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requiredTier: 'starter' | 'pro' | 'team',
  options?: {
    feature?: string;
    showUpgrade?: boolean;
    fallback?: ReactNode;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <TierGuard 
      requiredTier={requiredTier}
      feature={options?.feature}
      showUpgrade={options?.showUpgrade}
      fallback={options?.fallback}
    >
      <Component {...props} />
    </TierGuard>
  );

  WrappedComponent.displayName = `withTierGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for checking tier access in components
export const useTierAccess = () => {
  const { user, checkTierAccess } = useAuth();
  
  // Safe access
  const currentTier = user?.tier || 'starter';
  const currentTierLevel = TIER_HIERARCHY[currentTier] || 1;

  return {
    user,
    checkTierAccess,
    canAccess: (tier: 'starter' | 'pro' | 'team') => checkTierAccess(tier),
    currentTier,
    currentTierLevel,
    isStarter: currentTier === 'starter',
    isPro: currentTier === 'pro',
    isTeam: currentTier === 'team',
    isTrial: currentTier === 'trial',
    isSuperAdmin: currentTier === 'super_admin'
  };
};
