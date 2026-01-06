import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { CheckCircle, ArrowRight, Shield, Cloud, Database, AlertCircle } from 'lucide-react';
import { PLAN_PRICING, ADDON_PRICING, PRICE_IDS } from '../../utils/pricing';
import { PartnerRoutingModal } from './PartnerRoutingModal';
import { ComingSoonModal } from './ComingSoonModal';
import { isBillingEnabled } from '../../utils/feature-flags';
import { projectId } from '../../utils/supabase/info';

interface StripePricingPageV2Props {
  onNavigate: (page: string) => void;
}

export const StripePricingPageV2: React.FC<StripePricingPageV2Props> = ({ onNavigate }) => {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Pro' | 'Team'>('Pro');
  const [selectedAddons, setSelectedAddons] = useState<{
    Security: boolean;
    DR: boolean;
    Remote: boolean;
  }>({
    Security: false,
    DR: false,
    Remote: false
  });
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [partnerReason, setPartnerReason] = useState<any>('msp_feature_requested');

  // Check if user is trying to select MSP-only add-ons
  const handleAddonToggle = (addon: 'Security' | 'DR' | 'Remote') => {
    const addonConfig = ADDON_PRICING[addon];
    
    // If it's an MSP-only add-on, show partner modal
    if (addonConfig.mspOnly && !selectedAddons[addon]) {
      setPartnerReason(addon === 'Security' ? 'compliance_requested' : 'dr_backup_requested');
      setShowPartnerModal(true);
      return;
    }

    setSelectedAddons(prev => ({
      ...prev,
      [addon]: !prev[addon]
    }));
  };

  const calculateTotal = () => {
    let total = PLAN_PRICING[selectedPlan].monthly;
    
    if (selectedAddons.Security) total += ADDON_PRICING.Security.monthly;
    if (selectedAddons.DR) total += ADDON_PRICING.DR.monthly;
    if (selectedAddons.Remote) total += ADDON_PRICING.Remote.monthly;
    
    return total;
  };

  const handleCheckout = async () => {
    // Check if billing is enabled
    if (!isBillingEnabled()) {
      setShowComingSoon(true);
      return;
    }

    if (!user) {
      onNavigate('login');
      return;
    }

    setLoading(selectedPlan);
    setError(null);

    try {
      const token = await getToken();
      const priceId = PRICE_IDS.core[selectedPlan];

      // Build addon price IDs
      const addonPriceIds = [];
      if (selectedAddons.Security) addonPriceIds.push(PRICE_IDS.addons.Security);
      if (selectedAddons.DR) addonPriceIds.push(PRICE_IDS.addons.DR);
      if (selectedAddons.Remote) addonPriceIds.push(PRICE_IDS.addons.Remote);

      // Check if placeholder
      if (!priceId || priceId.includes('placeholder')) {
        setError(`Stripe billing not configured in demo. This would checkout ${selectedPlan} at $${calculateTotal()}/month with selected add-ons.`);
        setLoading(null);
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId,
          addonPriceIds,
          tier: selectedPlan.toLowerCase(),
          userId: user.id,
          successUrl: `${window.location.origin}/?page=success`,
          cancelUrl: `${window.location.origin}/?page=stripe-pricing`
        })
      });

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.statusText}`);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold text-pure-white mb-4">
            Start Your <span className="text-iq-neon-green">14-Day Free Trial</span>
          </h1>
          <p className="text-xl text-cloud-white">
            No credit card required • Cancel anytime • Full feature access
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-warning/10 border border-amber-warning/30 rounded-xl text-amber-warning">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Plan Selection Cards */}
          {(['Starter', 'Pro', 'Team'] as const).map((plan) => (
            <Card
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan
                  ? 'bubo-glass border-iq-neon-green/40 shadow-[0_0_30px_rgba(0,255,133,0.2)]'
                  : 'bubo-glass border-slate-gray/30 hover:border-iq-neon-green/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-['Space_Grotesk'] text-pure-white">
                  {plan}
                </h3>
                {selectedPlan === plan && (
                  <div className="w-6 h-6 bg-iq-neon-green rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-dark-midnight" />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-['Space_Grotesk'] text-iq-neon-green mb-2">
                  ${PLAN_PRICING[plan].monthly}
                  <span className="text-lg text-mist-gray">/mo</span>
                </div>
              </div>

              {plan === 'Pro' && (
                <Badge className="bg-iq-neon-green text-dark-midnight mb-4">
                  Most Popular
                </Badge>
              )}
            </Card>
          ))}
        </div>

        {/* Add-Ons */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-['Space_Grotesk'] text-pure-white mb-6 text-center">
            Power-Up Your Plan
          </h2>

          <div className="space-y-4">
            {/* Security & Compliance Pack */}
            <div className="bubo-glass rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    selectedAddons.Security
                      ? 'bg-amber-warning/20 border border-amber-warning/30'
                      : 'bg-amber-warning/10'
                  }`}>
                    <Shield className="w-6 h-6 text-amber-warning" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-['Space_Grotesk'] text-pure-white">
                        Security & Compliance Pack
                      </h3>
                      <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30 text-xs">
                        MSP Only
                      </Badge>
                    </div>
                    <p className="text-sm text-cloud-white mb-2">
                      ${ADDON_PRICING.Security.monthly}/mo + ${ADDON_PRICING.Security.perDevice}/device
                    </p>
                    <p className="text-sm text-mist-gray">
                      HIPAA, SOC 2, PCI-DSS compliance reporting & audit trails
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddonToggle('Security')}
                  variant={selectedAddons.Security ? 'default' : 'outline'}
                  className={selectedAddons.Security ? 'bubo-btn-neon-primary' : 'bubo-btn-ghost'}
                  disabled={selectedAddons.Security}
                >
                  {selectedAddons.Security ? 'Selected' : 'Talk to MSP'}
                </Button>
              </div>
            </div>

            {/* DR/Backup Pack */}
            <div className="bubo-glass rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    selectedAddons.DR
                      ? 'bg-signal-blue/20 border border-signal-blue/30'
                      : 'bg-signal-blue/10'
                  }`}>
                    <Database className="w-6 h-6 text-signal-blue" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-['Space_Grotesk'] text-pure-white">
                        DR/Backup Pack
                      </h3>
                      <Badge className="bg-signal-blue/20 text-signal-blue border-signal-blue/30 text-xs">
                        MSP Only
                      </Badge>
                    </div>
                    <p className="text-sm text-cloud-white mb-2">
                      ${ADDON_PRICING.DR.monthly}/mo
                    </p>
                    <p className="text-sm text-mist-gray">
                      Disaster recovery planning & backup monitoring
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddonToggle('DR')}
                  variant={selectedAddons.DR ? 'default' : 'outline'}
                  className={selectedAddons.DR ? 'bubo-btn-neon-primary' : 'bubo-btn-ghost'}
                  disabled={selectedAddons.DR}
                >
                  {selectedAddons.DR ? 'Selected' : 'Talk to MSP'}
                </Button>
              </div>
            </div>

            {/* Remote/Zero-Trust Pack */}
            <div className="bubo-glass rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    selectedAddons.Remote
                      ? 'bg-electric-blue/20 border border-electric-blue/30'
                      : 'bg-electric-blue/10'
                  }`}>
                    <Cloud className="w-6 h-6 text-electric-blue" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-['Space_Grotesk'] text-pure-white">
                        Remote / Zero-Trust Pack
                      </h3>
                      <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                        All Plans
                      </Badge>
                    </div>
                    <p className="text-sm text-cloud-white mb-2">
                      ${ADDON_PRICING.Remote.monthly}/mo
                    </p>
                    <p className="text-sm text-mist-gray">
                      Extended sessions, zero-trust policies, powerful controls
                    </p>
                  </div>
                </div>

                <Checkbox
                  checked={selectedAddons.Remote}
                  onCheckedChange={() => handleAddonToggle('Remote')}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total & CTA */}
        <div className="max-w-2xl mx-auto">
          <div className="bubo-glass rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="text-sm text-mist-gray mb-2">Total</div>
              <div className="text-5xl font-['Space_Grotesk'] text-iq-neon-green">
                ${calculateTotal()}
                <span className="text-lg text-cloud-white">/month</span>
              </div>
              <div className="text-sm text-mist-gray mt-2">
                14-day free trial • No credit card required
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading !== null}
              className="w-full bubo-btn-neon-primary text-lg py-6"
            >
              {loading ? 'Processing...' : `Start Free Trial`}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-mist-gray mt-4">
              By starting your trial, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Partner Routing Modal */}
      <PartnerRoutingModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        reason={partnerReason}
        context={{
          requestedFeature: partnerReason === 'compliance_requested'
            ? 'Security & Compliance Pack'
            : 'DR/Backup Pack'
        }}
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
};