import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface TierLockingMatrixProps {
  userPlan: 'basic' | 'pro';
  onUpgrade?: (feature?: string) => void;
}

export const TierLockingMatrix: React.FC<TierLockingMatrixProps> = ({ 
  userPlan, 
  onUpgrade 
}) => {
  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Email ticket intake', basic: true, pro: true },
        { name: 'Manual triage & assignment', basic: true, pro: true },
        { name: 'Basic status tracking', basic: true, pro: true },
        { name: 'Shared team inbox', basic: '3 agents', pro: 'Unlimited' },
        { name: 'Email notifications', basic: true, pro: true },
        { name: 'Basic reporting', basic: true, pro: true }
      ]
    },
    {
      category: 'Intelligence',
      items: [
        { name: 'AI-powered triage', basic: false, pro: true, feature: 'ai-triage' },
        { name: 'Automation rules', basic: false, pro: true, feature: 'automation' },
        { name: 'SLA dashboards', basic: false, pro: true, feature: 'analytics' },
        { name: 'Deep analytics', basic: false, pro: true, feature: 'analytics' },
        { name: 'Predictive insights', basic: false, pro: true, feature: 'analytics' },
        { name: 'Custom workflows', basic: false, pro: true, feature: 'automation' }
      ]
    },
    {
      category: 'Integrations',
      items: [
        { name: 'Basic integrations', basic: '2 included', pro: true },
        { name: 'Unlimited integrations', basic: false, pro: true, feature: 'integrations' },
        { name: 'Custom webhooks', basic: false, pro: true, feature: 'integrations' },
        { name: 'API access', basic: false, pro: true, feature: 'integrations' },
        { name: 'Bidirectional sync', basic: false, pro: true, feature: 'integrations' }
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'Community support', basic: true, pro: true },
        { name: 'Priority support', basic: false, pro: true },
        { name: 'Audit log', basic: false, pro: true },
        { name: 'Role-based permissions', basic: false, pro: true },
        { name: 'SSO integration', basic: false, pro: true },
        { name: 'Extra security', basic: false, pro: true }
      ]
    }
  ];

  const FeatureStatus: React.FC<{ 
    feature: any; 
    plan: 'basic' | 'pro';
    isUserPlan: boolean;
  }> = ({ feature, plan, isUserPlan }) => {
    const value = plan === 'basic' ? feature.basic : feature.pro;
    const isLocked = isUserPlan && !value && userPlan === 'basic';

    if (value === true) {
      return (
        <div className="flex items-center justify-center">
          <Check className={`w-5 h-5 ${isUserPlan ? 'text-iq-neon-green' : 'text-mist-gray'}`} />
        </div>
      );
    }

    if (value === false || !value) {
      return (
        <div className="flex items-center justify-center">
          {isLocked ? (
            <div className="group relative">
              <Lock 
                className="w-4 h-4 text-mist-gray cursor-pointer hover:text-iq-neon-green transition-colors"
                onClick={() => feature.feature && onUpgrade?.(feature.feature)}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-surface-dark border border-iq-neon-green/20 rounded-lg px-3 py-2 text-xs text-pure-white whitespace-nowrap">
                  <div className="text-iq-neon-green font-medium">Available in Pro</div>
                  <div className="text-mist-gray">Click to upgrade</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-surface-dark"></div>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-mist-gray text-sm">—</span>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div className="text-center">
          <span className={`text-xs ${isUserPlan ? 'text-cloud-white' : 'text-mist-gray'}`}>
            {value}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="bubo-glass overflow-hidden">
      <div className="p-6 border-b border-iq-neon-green/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
              Feature Comparison
            </h3>
            <p className="text-mist-gray text-sm">
              See what's included in each plan
            </p>
          </div>
          {userPlan === 'basic' && (
            <Button
              onClick={() => onUpgrade?.()}
              className="bubo-btn-neon-primary"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-iq-neon-green/10">
              <th className="text-left p-4 font-['Space_Grotesk'] font-bold text-pure-white">
                Features
              </th>
              <th className="text-center p-4 min-w-32">
                <div className="space-y-1">
                  <div className="font-['Space_Grotesk'] font-bold text-pure-white">Basic</div>
                  <div className="text-sm text-mist-gray">$9/mo</div>
                  {userPlan === 'basic' && (
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                      Current Plan
                    </Badge>
                  )}
                </div>
              </th>
              <th className="text-center p-4 min-w-32">
                <div className="space-y-1">
                  <div className="font-['Space_Grotesk'] font-bold text-pure-white">Pro</div>
                  <div className="text-sm text-mist-gray">$49/mo</div>
                  {userPlan === 'pro' ? (
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                      Current Plan
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30 text-xs">
                      Most Popular
                    </Badge>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((category) => (
              <React.Fragment key={category.category}>
                <tr>
                  <td colSpan={3} className="p-4">
                    <div className="font-['Space_Grotesk'] font-bold text-iq-neon-green text-sm">
                      {category.category}
                    </div>
                  </td>
                </tr>
                {category.items.map((feature, index) => (
                  <tr 
                    key={index}
                    className="border-b border-slate-gray/10 hover:bg-nocturne-indigo/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-cloud-white text-sm">{feature.name}</span>
                        {feature.feature && userPlan === 'basic' && (
                          <Lock className="w-3 h-3 text-mist-gray" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <FeatureStatus 
                        feature={feature} 
                        plan="basic" 
                        isUserPlan={userPlan === 'basic'}
                      />
                    </td>
                    <td className="p-4">
                      <FeatureStatus 
                        feature={feature} 
                        plan="pro" 
                        isUserPlan={userPlan === 'pro'}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {userPlan === 'basic' && (
        <div className="p-6 bg-nocturne-indigo/20 border-t border-iq-neon-green/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-1">
                Ready to unlock the full platform?
              </h4>
              <p className="text-sm text-mist-gray">
                Upgrade to Pro and get AI-powered intelligence, automation, and unlimited integrations.
              </p>
            </div>
            <Button
              onClick={() => onUpgrade?.()}
              className="bubo-btn-neon-primary ml-4"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};