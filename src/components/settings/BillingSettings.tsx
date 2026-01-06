import React, { useState, useEffect } from 'react';
import { CreditCard, ExternalLink, Package, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';
import { PLAN_LIMITS, PLAN_PRICING, ADDON_PRICING, PRICE_IDS } from '../../utils/pricing';
import { ComingSoonModal } from '../marketing/ComingSoonModal';
import { isBillingEnabled } from '../../utils/feature-flags';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface BillingSettingsProps {
  className?: string;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({ className }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  // Safety check for user tier
  const userTier = user?.tier || 'starter';
  // Map user tier to plan key (Starter, Pro, Team) - case sensitive matching with utils/pricing
  const planKey = userTier === 'pro' ? 'Pro' : userTier === 'team' ? 'Team' : 'Starter';
  
  // Mock org data - in production, fetch from Supabase
  const org = {
    tier: userTier,
    included: PLAN_LIMITS[planKey]?.included || PLAN_LIMITS['Starter'].included,
    used: 87, // This would come from actual device count
    overage: PLAN_LIMITS[planKey]?.overage || PLAN_LIMITS['Starter'].overage,
    addons: {
      security_compliance: false,
      dr_backup: false,
      remote_zt: false
    }
  };

  const estimatedOverage = Math.max(0, org.used - org.included) * org.overage;
  const currentPlan = PLAN_PRICING[planKey] || PLAN_PRICING['Starter'];

  const handleCheckout = async (priceId: string, mode: 'core' | 'addon' = 'core') => {
    // Check if billing is enabled
    if (!isBillingEnabled()) {
      setShowComingSoon(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            priceId,
            mode,
            orgId: user?.org_id || 'demo-org'
          })
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Couldn\'t start checkout', {
        description: error instanceof Error ? error.message : 'Try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPortal = async () => {
    // Check if billing is enabled
    if (!isBillingEnabled()) {
      setShowComingSoon(true);
      return;
    }

    setPortalLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/stripe-portal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            orgId: user?.org_id || 'demo-org'
          })
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Couldn\'t open billing', {
        description: 'Contact support if this keeps happening'
      });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Current Plan */}
      <Card className="bubo-glass p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
              Current Plan
            </h2>
            <p className="text-mist-gray text-sm">
              Manage your subscription and billing details
            </p>
          </div>
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
            {org.tier.charAt(0).toUpperCase() + org.tier.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-midnight/50 rounded-xl p-4 border border-slate-gray/20">
            <div className="text-xs text-mist-gray mb-1">Monthly Price</div>
            <div className="text-2xl font-['Space_Grotesk'] font-bold text-pure-white">
              ${currentPlan.monthly}
            </div>
          </div>
          
          <div className="bg-dark-midnight/50 rounded-xl p-4 border border-slate-gray/20">
            <div className="text-xs text-mist-gray mb-1">Included computers</div>
            <div className="text-2xl font-['Space_Grotesk'] font-bold text-pure-white">
              {org.included}
            </div>
          </div>

          <div className="bg-dark-midnight/50 rounded-xl p-4 border border-slate-gray/20">
            <div className="text-xs text-mist-gray mb-1">Using now</div>
            <div className="text-2xl font-['Space_Grotesk'] font-bold text-pure-white">
              {org.used} <span className="text-sm text-mist-gray">computers</span>
            </div>
          </div>

          <div className="bg-dark-midnight/50 rounded-xl p-4 border border-slate-gray/20">
            <div className="text-xs text-mist-gray mb-1">Estimated Overage</div>
            <div className="text-2xl font-['Space_Grotesk'] font-bold text-pure-white">
              ${estimatedOverage.toFixed(2)}
            </div>
            <div className="text-xs text-mist-gray mt-1">
              Volume discounts may apply
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenPortal}
          disabled={portalLoading}
          className="w-full bubo-btn-secondary"
        >
          {portalLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Billing Portal
            </>
          )}
        </Button>
      </Card>

      {/* Add-Ons */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
          Add-Ons
        </h2>
        <div className="space-y-3">
          <AddonToggle
            active={org.addons.security_compliance}
            label="Security & Compliance"
            description="Compliance dashboards, policy templates, evidence packs"
            price={`+$${ADDON_PRICING.Security.monthly}/mo`}
            onBuy={() => handleCheckout(PRICE_IDS.addons.Security, 'addon')}
            loading={loading}
          />
          <AddonToggle
            active={org.addons.dr_backup}
            label="DR/Backup"
            description="Backup jobs, partner storage hooks, snapshots"
            price={`+$${ADDON_PRICING.DR.monthly}/mo`}
            onBuy={() => handleCheckout(PRICE_IDS.addons.DR, 'addon')}
            loading={loading}
          />
          <AddonToggle
            active={org.addons.remote_zt}
            label="Remote / Zero-Trust"
            description="Connect policies, MFA, posture, session recording"
            price={`+$${ADDON_PRICING.Remote.monthly}/mo`}
            onBuy={() => handleCheckout(PRICE_IDS.addons.Remote, 'addon')}
            loading={loading}
          />
        </div>
      </Card>

      {/* Pricing Info */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
          Pricing Details
        </h2>
        <div className="space-y-3 text-sm text-cloud-white/80">
          <p>
            • Overage rate: <span className="text-iq-neon-green font-medium">${org.overage.toFixed(2)}/device/month</span>
          </p>
          <p>
            • Automatic volume discounts apply at 100, 300+ devices
          </p>
          <p>
            • All plans include unlimited users and tickets
          </p>
          <p>
            • Cancel anytime, no long-term contracts
          </p>
        </div>
      </Card>

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
};

interface AddonToggleProps {
  active: boolean;
  label: string;
  description: string;
  price: string;
  onBuy: () => void;
  loading?: boolean;
}

const AddonToggle: React.FC<AddonToggleProps> = ({
  active,
  label,
  description,
  price,
  onBuy,
  loading
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-dark-midnight/50 rounded-xl border border-slate-gray/20 hover:border-iq-neon-green/30 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="pt-0.5">
          {active ? (
            <CheckCircle className="w-5 h-5 text-iq-neon-green" />
          ) : (
            <Circle className="w-5 h-5 text-mist-gray" />
          )}
        </div>
        <div>
          <div className="font-['Space_Grotesk'] font-semibold text-pure-white mb-1">
            {label}
          </div>
          <div className="text-xs text-mist-gray mb-2">
            {description}
          </div>
          <div className="text-sm text-cloud-white/80">
            {price}
          </div>
        </div>
      </div>

      {!active && (
        <Button
          onClick={onBuy}
          disabled={loading}
          size="sm"
          className="bubo-btn-neon-primary"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Add'
          )}
        </Button>
      )}
      {active && (
        <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
          Included
        </Badge>
      )}
    </div>
  );
};