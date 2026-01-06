// Add-On Management - BuboIQ
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Check,
  ShoppingCart,
  CreditCard,
  Package,
  Zap,
  Shield,
  Users,
  BarChart3,
  Smartphone,
  Monitor,
  Clock,
  Star,
  AlertTriangle,
  RefreshCw,
  Settings,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  billingCycle: 'monthly' | 'annual';
  category: 'monitoring' | 'security' | 'analytics' | 'integration';
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  popular?: boolean;
  enabled?: boolean;
  compatible: string[]; // Compatible with these tiers: 'starter', 'pro', 'team'
}

interface UserAddOn {
  addOnId: string;
  enabled: boolean;
  purchasedDate: string;
  nextBilling: string;
  status: 'active' | 'cancelled' | 'pending';
}

interface AddOnManagementProps {
  userTier: string;
  userAddOns: UserAddOn[];
  onPurchaseAddOn: (addOnId: string) => Promise<void>;
  onToggleAddOn: (addOnId: string, enabled: boolean) => Promise<void>;
  onCancelAddOn: (addOnId: string) => Promise<void>;
}

const availableAddOns: AddOn[] = [
  {
    id: 'advanced-monitoring',
    name: 'More tracking',
    description: 'Watch more things on computers with custom checks',
    price: '$9',
    billingCycle: 'monthly',
    category: 'monitoring',
    icon: Monitor,
    features: [
      'Track custom stuff',
      'Hardware health checks', 
      'See what apps people use',
      'Alerts 24/7'
    ],
    popular: true,
    compatible: ['pro', 'team']
  },
  {
    id: 'security-plus',
    name: 'Extra security',
    description: 'Better security watching and threat catching',
    price: '$15',
    billingCycle: 'monthly',
    category: 'security',
    icon: Shield,
    features: [
      'Catch threats faster',
      'Security reports for audits',
      'Find weak spots',
      'Enforce security rules'
    ],
    compatible: ['pro', 'team']
  },
  {
    id: 'mobile-connect',
    name: 'Mobile help',
    description: 'Help phones and tablets with our mobile app',
    price: '$5',
    billingCycle: 'monthly',
    category: 'integration',
    icon: Smartphone,
    features: [
      'iPhone and Android',
      'Watch mobile devices',
      'Manage personal devices',
      'Fix mobile app problems'
    ],
    compatible: ['starter', 'pro', 'team']
  },
  {
    id: 'analytics-pro',
    name: 'Better reports',
    description: 'More reports and custom charts',
    price: '$12',
    billingCycle: 'monthly',
    category: 'analytics',
    icon: BarChart3,
    features: [
      'Build your own dashboards',
      'More report types',
      'Export your data',
      'Spot trends'
    ],
    compatible: ['pro', 'team']
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    description: '24/7 priority support with dedicated account management',
    price: '$25',
    billingCycle: 'monthly',
    category: 'integration',
    icon: Users,
    features: [
      '24/7 priority support',
      'Dedicated account manager',
      'Phone and video support',
      '1-hour response time SLA'
    ],
    popular: true,
    compatible: ['team']
  },
  {
    id: 'automation-engine',
    name: 'Automation Engine',
    description: 'Automated issue resolution and workflow orchestration',
    price: '$18',
    billingCycle: 'monthly',
    category: 'integration',
    icon: Zap,
    features: [
      'Custom automation workflows',
      'Automated issue resolution',
      'Integration with 200+ tools',
      'Workflow analytics'
    ],
    compatible: ['pro', 'team']
  }
];

export const AddOnManagement: React.FC<AddOnManagementProps> = ({
  userTier,
  userAddOns = [],
  onPurchaseAddOn,
  onToggleAddOn,
  onCancelAddOn
}) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Add-Ons', count: availableAddOns.length },
    { id: 'monitoring', name: 'Monitoring', count: availableAddOns.filter(a => a.category === 'monitoring').length },
    { id: 'security', name: 'Security', count: availableAddOns.filter(a => a.category === 'security').length },
    { id: 'analytics', name: 'Analytics', count: availableAddOns.filter(a => a.category === 'analytics').length },
    { id: 'integration', name: 'Integration', count: availableAddOns.filter(a => a.category === 'integration').length }
  ];

  const filteredAddOns = activeCategory === 'all' 
    ? availableAddOns 
    : availableAddOns.filter(addon => addon.category === activeCategory);

  const getUserAddOn = (addOnId: string): UserAddOn | undefined => {
    return userAddOns.find(ua => ua.addOnId === addOnId);
  };

  const isAddOnOwned = (addOnId: string): boolean => {
    const userAddOn = getUserAddOn(addOnId);
    return userAddOn?.status === 'active';
  };

  const isAddOnCompatible = (addOn: AddOn): boolean => {
    return addOn.compatible.includes(userTier);
  };

  const handlePurchase = async (addOnId: string) => {
    if (loading[addOnId]) return;
    
    try {
      setLoading(prev => ({ ...prev, [addOnId]: true }));
      await onPurchaseAddOn(addOnId);
      
      const addOn = availableAddOns.find(a => a.id === addOnId);
      toast.success('Add-On Purchased!', {
        description: `${addOn?.name} has been added to your account.`
      });
    } catch (error: any) {
      toast.error('Purchase Failed', {
        description: error.message || 'Failed to purchase add-on. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, [addOnId]: false }));
    }
  };

  const handleToggle = async (addOnId: string, enabled: boolean) => {
    if (loading[addOnId]) return;
    
    try {
      setLoading(prev => ({ ...prev, [addOnId]: true }));
      await onToggleAddOn(addOnId, enabled);
      
      const addOn = availableAddOns.find(a => a.id === addOnId);
      toast.success(`Add-On ${enabled ? 'Enabled' : 'Disabled'}`, {
        description: `${addOn?.name} has been ${enabled ? 'enabled' : 'disabled'}.`
      });
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error.message || 'Failed to update add-on status.'
      });
    } finally {
      setLoading(prev => ({ ...prev, [addOnId]: false }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monitoring': return Monitor;
      case 'security': return Shield;
      case 'analytics': return BarChart3;
      case 'integration': return Settings;
      default: return Package;
    }
  };

  const renderAddOnCard = (addOn: AddOn) => {
    const userAddOn = getUserAddOn(addOn.id);
    const isOwned = isAddOnOwned(addOn.id);
    const isCompatible = isAddOnCompatible(addOn);
    const IconComponent = addOn.icon;

    return (
      <Card key={addOn.id} className={`bubo-glass transition-all duration-300 ${
        !isCompatible ? 'opacity-60' : 'hover:border-iq-neon-green/40'
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isOwned ? 'bg-iq-neon-green/20 text-iq-neon-green' : 'bg-electric-blue/20 text-electric-blue'
              }`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white text-lg">{addOn.name}</CardTitle>
                  {addOn.popular && (
                    <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-mist-gray text-sm">
                  {addOn.description}
                </CardDescription>
              </div>
            </div>
            
            {isOwned && (
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                <Check className="w-3 h-3 mr-1" />
                Owned
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features */}
          <div className="space-y-2">
            {addOn.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-3 h-3 text-iq-neon-green flex-shrink-0" />
                <span className="text-cloud-white">{feature}</span>
              </div>
            ))}
          </div>

          <Separator className="border-slate-gray/30" />

          {/* Pricing and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-iq-neon-green">{addOn.price}</span>
              <span className="text-sm text-mist-gray">/month</span>
            </div>

            <div className="flex items-center gap-2">
              {!isCompatible ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-warning" />
                  <span className="text-xs text-amber-warning">Requires {addOn.compatible.join(' or ')} tier</span>
                </div>
              ) : isOwned ? (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={userAddOn?.enabled || false}
                    onCheckedChange={(enabled) => handleToggle(addOn.id, enabled)}
                    disabled={loading[addOn.id]}
                  />
                  <span className="text-xs text-mist-gray">
                    {userAddOn?.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => handlePurchase(addOn.id)}
                  disabled={loading[addOn.id]}
                  className="bubo-btn-neon-primary text-sm px-4 py-2"
                >
                  {loading[addOn.id] ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-2" />
                  )}
                  Purchase
                </Button>
              )}
            </div>
          </div>

          {/* Owned Add-On Management */}
          {isOwned && userAddOn && (
            <div className="mt-4 p-3 bg-iq-neon-green/5 rounded-lg border border-iq-neon-green/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-mist-gray">Next billing: {userAddOn.nextBilling}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-crimson-danger hover:bg-crimson-danger/10 text-xs h-6"
                  onClick={() => onCancelAddOn(addOn.id)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
            Add-On Management
          </h3>
          <p className="text-mist-gray">
            Extend your <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> capabilities with add-ons
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-mist-gray">Current Plan</div>
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 capitalize">
            {userTier}
          </Badge>
        </div>
      </div>

      {/* My Add-Ons Summary */}
      {userAddOns.length > 0 && (
        <Card className="bubo-glass-bright">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-iq-neon-green" />
              My Add-Ons ({userAddOns.filter(ua => ua.status === 'active').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAddOns.filter(ua => ua.status === 'active').map((userAddOn) => {
                const addOn = availableAddOns.find(a => a.id === userAddOn.addOnId);
                if (!addOn) return null;
                
                const IconComponent = addOn.icon;
                
                return (
                  <div key={userAddOn.addOnId} className="flex items-center gap-3 p-3 bg-surface-dark/50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-iq-neon-green/20 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-iq-neon-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">{addOn.name}</div>
                      <div className="text-xs text-mist-gray">
                        {userAddOn.enabled ? 'Active' : 'Disabled'} • Next billing: {userAddOn.nextBilling}
                      </div>
                    </div>
                    <Switch
                      checked={userAddOn.enabled}
                      onCheckedChange={(enabled) => handleToggle(addOn.id, enabled)}
                      disabled={loading[addOn.id]}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.id);
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' 
                  : 'text-mist-gray hover:text-white'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <IconComponent className="w-4 h-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Add-Ons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAddOns.map(renderAddOnCard)}
      </div>

      {/* Help Section */}
      <Card className="bubo-glass border-electric-blue/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-electric-blue" />
            Need Help Choosing?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mist-gray">
            Not sure which add-ons are right for your organization? Our team can help you select the perfect combination for your needs.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bubo-btn-secondary">
              <Users className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="ghost" className="text-electric-blue hover:bg-electric-blue/10">
              <Download className="w-4 h-4 mr-2" />
              Download Comparison Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};