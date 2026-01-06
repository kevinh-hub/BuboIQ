import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Shield, Database, Cloud, Check, AlertTriangle, Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ADDON_PRICING } from '../../utils/pricing';

interface AddOnPack {
  id: 'security_compliance' | 'dr_backup' | 'remote_zt';
  name: string;
  description: string;
  monthlyPrice: number;
  perDeviceFee?: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  mspOnly: boolean;
  requiredTier?: 'pro' | 'team';
}

interface AddOnPacksManagementProps {
  userTier: 'starter' | 'pro' | 'team';
  deviceCount: number;
  activeAddOns: string[];
  onPurchaseAddOn: (addOnId: string) => Promise<void>;
  onCancelAddOn: (addOnId: string) => Promise<void>;
}

const ADD_ON_PACKS: AddOnPack[] = [
  {
    id: 'security_compliance',
    name: 'Security & Compliance Pack',
    description: 'Powerful security monitoring, HIPAA/SOC 2 compliance reporting, and audit trail management',
    monthlyPrice: ADDON_PRICING.Security.monthly,
    perDeviceFee: ADDON_PRICING.Security.perDevice,
    icon: Shield,
    mspOnly: true,
    features: [
      'Powerful security monitoring',
      'HIPAA compliance reporting',
      'SOC 2 compliance reporting',
      'Audit trail management',
      'Automated compliance alerts',
      'Regulatory documentation'
    ]
  },
  {
    id: 'dr_backup',
    name: 'DR/Backup Pack',
    description: 'Disaster recovery planning, automated backup monitoring, and business continuity tracking',
    monthlyPrice: ADDON_PRICING.DR.monthly,
    icon: Database,
    mspOnly: true,
    features: [
      'Disaster recovery planning',
      'Automated backup monitoring',
      'Business continuity tracking',
      'Recovery time tracking',
      'Backup health scoring',
      'DR runbook templates'
    ]
  },
  {
    id: 'remote_zt',
    name: 'Remote / Zero-Trust Pack',
    description: 'Extended remote sessions, zero-trust remote policies, and powerful session controls',
    monthlyPrice: ADDON_PRICING.Remote.monthly,
    icon: Cloud,
    mspOnly: false,
    features: [
      'Extended remote session length',
      'Zero-trust remote policies',
      'Powerful session controls',
      'Session access policies',
      'Device verification',
      'Conditional access rules'
    ]
  }
];

export const AddOnPacksManagement: React.FC<AddOnPacksManagementProps> = ({
  userTier,
  deviceCount,
  activeAddOns,
  onPurchaseAddOn,
  onCancelAddOn
}) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const calculatePackCost = (pack: AddOnPack): number => {
    let cost = pack.monthlyPrice;
    if (pack.perDeviceFee) {
      cost += pack.perDeviceFee * deviceCount;
    }
    return cost;
  };

  const isPackActive = (packId: string): boolean => {
    return activeAddOns.includes(packId);
  };

  const handlePurchase = async (packId: string) => {
    if (loading[packId]) return;

    try {
      setLoading(prev => ({ ...prev, [packId]: true }));
      await onPurchaseAddOn(packId);
      
      const pack = ADD_ON_PACKS.find(p => p.id === packId);
      toast.success('Add-On Pack Purchased!', {
        description: `${pack?.name} has been added to your account.`
      });
    } catch (error: any) {
      toast.error('Purchase Failed', {
        description: error.message || 'Failed to purchase add-on pack. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, [packId]: false }));
    }
  };

  const handleCancel = async (packId: string) => {
    if (loading[packId]) return;

    try {
      setLoading(prev => ({ ...prev, [packId]: true }));
      await onCancelAddOn(packId);
      
      const pack = ADD_ON_PACKS.find(p => p.id === packId);
      toast.success('Add-On Pack Cancelled', {
        description: `${pack?.name} will be removed at the end of your billing period.`
      });
    } catch (error: any) {
      toast.error('Cancellation Failed', {
        description: error.message || 'Failed to cancel add-on pack.'
      });
    } finally {
      setLoading(prev => ({ ...prev, [packId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-['Space_Grotesk'] text-xl text-pure-white mb-2">
          Add-On Packs
        </h3>
        <p className="text-mist-gray">
          Power-up your platform with specialized capabilities
        </p>
      </div>

      {/* Current Plan Info */}
      <div className="bubo-glass-bright rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-gray">Current Plan</p>
            <p className="text-lg font-['Space_Grotesk'] text-pure-white capitalize">{userTier}</p>
          </div>
          <div>
            <p className="text-sm text-mist-gray">Devices</p>
            <p className="text-lg font-['Space_Grotesk'] text-iq-neon-green">{deviceCount}</p>
          </div>
          <div>
            <p className="text-sm text-mist-gray">Active Packs</p>
            <p className="text-lg font-['Space_Grotesk'] text-iq-neon-green">{activeAddOns.length}</p>
          </div>
        </div>
      </div>

      {/* Add-On Packs Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {ADD_ON_PACKS.map((pack) => {
          const IconComponent = pack.icon;
          const isActive = isPackActive(pack.id);
          const totalCost = calculatePackCost(pack);
          const isLoading = loading[pack.id];

          return (
            <Card 
              key={pack.id} 
              className={`
                bubo-glass transition-all duration-300
                ${isActive ? 'border-iq-neon-green/40 bg-iq-neon-green/5' : 'hover:border-electric-blue/40'}
              `}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isActive ? 'bg-iq-neon-green/20 text-iq-neon-green' : 'bg-electric-blue/20 text-electric-blue'}
                  `}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  {isActive && (
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                  
                  {pack.mspOnly && !isActive && (
                    <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
                      MSP Only
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-pure-white text-lg">
                  {pack.name}
                </CardTitle>
                <CardDescription className="text-mist-gray text-sm">
                  {pack.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="bubo-glass rounded-lg p-3">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-['Space_Grotesk'] text-iq-neon-green">
                      ${totalCost}
                    </span>
                    <span className="text-sm text-mist-gray">/month</span>
                  </div>
                  {pack.perDeviceFee && (
                    <p className="text-xs text-mist-gray">
                      ${pack.monthlyPrice} base + ${pack.perDeviceFee} × {deviceCount} devices
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {pack.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-cloud-white">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-slate-gray/30">
                  {isActive ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-mist-gray">
                        <span>Next billing cycle</span>
                        <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                      <Button
                        onClick={() => handleCancel(pack.id)}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full text-crimson-danger border-crimson-danger/30 hover:bg-crimson-danger/10"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Pack'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(pack.id)}
                      disabled={isLoading}
                      className="w-full bubo-btn-neon-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Purchase Pack
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Card */}
      <Card className="bubo-glass border-electric-blue/30">
        <CardHeader>
          <CardTitle className="text-pure-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-electric-blue" />
            Add-On Pack Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-cloud-white space-y-2">
            <p>
              <strong className="text-pure-white">Security & Compliance Pack:</strong> MSP-only add-on with per-device pricing. 
              Includes powerful monitoring and regulatory compliance features.
            </p>
            <p>
              <strong className="text-pure-white">DR/Backup Pack:</strong> MSP-only add-on for disaster recovery and 
              business continuity management.
            </p>
            <p>
              <strong className="text-pure-white">Remote / Zero-Trust Pack:</strong> Available to all tiers. Extends 
              remote session capabilities with zero-trust security policies.
            </p>
          </div>
          <Button
            variant="outline"
            className="bubo-btn-ghost"
            onClick={() => window.open('https://kevinhaskins.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Questions? Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
