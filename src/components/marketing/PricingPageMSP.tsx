import React, { useState } from 'react';
import { Check, Building2, Users, ExternalLink, ArrowRight, Shield, Cloud, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PLAN_PRICING, ADDON_PRICING, PLAN_LIMITS } from '../../utils/pricing';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';

interface PricingPageMSPProps {
  onNavigate: (page: string) => void;
}

export const PricingPageMSP: React.FC<PricingPageMSPProps> = ({ onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState('msp');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual'); // Default to annual to show savings

  return (
    <div className="min-h-screen">
      {/* Global Banner */}
      <div className="border-b border-iq-neon-green/10 bg-surface-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="text-mist-gray">MSP-first.</span>
            <span className="text-iq-neon-green font-medium">SMBs welcome.</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16">
        {/* HERO ORB - DeviceNetworkOrb Centerpiece - AT THE TOP */}
        <div className="relative z-[25] pointer-events-none mb-8 md:mb-12 flex justify-center">
          <DeviceNetworkOrb 
            size={400} 
            className="bubo-animate-float" 
            isHomePage={true}
          />
        </div>
        
        {/* Tab Indicator Orbs - Dynamic Response to Selection (HaloRing S, HoloGrid XS) */}
        <OrbSystem
          variantType="HaloRing"
          sizeToken="S"
          placement="TopLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile={selectedTab === 'msp' ? "Focus" : "Inert"}
          glow={selectedTab === 'msp' ? 3 : 0}
          className={selectedTab === 'msp' ? 'opacity-80' : 'opacity-25'}
        />
        <OrbSystem
          variantType="HoloGrid"
          sizeToken="XS"
          placement="BottomRight"
          zLayer="MidGlass"
          tint="Base"
          motionProfile={selectedTab === 'smb' ? "Focus" : "Inert"}
          density={4}
          glow={selectedTab === 'smb' ? 2 : 0}
          className={selectedTab === 'smb' ? 'opacity-70' : 'opacity-20'}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold mb-6">
              <span className="text-white">See More. </span>
              <span className="text-iq-neon-green">Solve Faster.</span>
            </h1>
            <p className="text-xl text-cloud-white mb-4">
              See problems early, fix them remotely, prove compliance—built for MSPs.
            </p>
            <p className="text-lg text-mist-gray">
              You pay per computer, not per tech.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-xl transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-iq-neon-green/20 text-iq-neon-green border-2 border-iq-neon-green'
                    : 'bg-surface-dark text-mist-gray border-2 border-slate-gray/30 hover:border-slate-gray/50'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-xl transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-iq-neon-green/20 text-iq-neon-green border-2 border-iq-neon-green'
                    : 'bg-surface-dark text-mist-gray border-2 border-slate-gray/30 hover:border-slate-gray/50'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-iq-neon-green text-dark-midnight px-2 py-0.5 rounded-full font-medium">
                  Save 15%
                </span>
              </button>
            </div>
          </div>

          {/* Tabs: MSP vs Small Business */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bubo-glass border border-iq-neon-green/20">
              <TabsTrigger 
                value="msp"
                className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
              >
                <Users className="w-4 h-4 mr-2" />
                MSP Plans
              </TabsTrigger>
              <TabsTrigger 
                value="smb"
                className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Small Business
              </TabsTrigger>
            </TabsList>

            {/* MSP Plans */}
            <TabsContent value="msp" className="space-y-12">
              {/* Core Plans */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Starter */}
                <div className="bubo-glass rounded-2xl p-8 border border-slate-gray/30">
                  <div className="mb-6">
                    <h3 className="text-2xl font-['Space_Grotesk'] text-pure-white mb-2">
                      Starter
                    </h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-['Space_Grotesk'] text-iq-neon-green">
                        ${billingCycle === 'monthly' ? PLAN_PRICING.Starter.monthly : PLAN_PRICING.Starter.annual}
                      </span>
                      <span className="text-mist-gray ml-2">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-iq-neon-green mb-3">
                        ${PLAN_PRICING.Starter.annual * 12}/year • Save ${(PLAN_PRICING.Starter.monthly - PLAN_PRICING.Starter.annual) * 12}/year
                      </p>
                    )}
                    <p className="text-sm text-cloud-white">
                      {PLAN_LIMITS.Starter.included} computers • ${PLAN_LIMITS.Starter.overage}/computer
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Agent deployment & monitoring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Auto-ticketing & signals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">{PLAN_LIMITS.Starter.aiCap} AI requests/month</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">{PLAN_LIMITS.Starter.connectSessions} Connect sessions ({PLAN_LIMITS.Starter.connectMinutes} min)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Email support</span>
                    </li>
                  </ul>

                  <Button
                    onClick={() => onNavigate('stripe-pricing')}
                    className="w-full bubo-btn-secondary"
                  >
                    Start Free Trial
                  </Button>
                </div>

                {/* Pro */}
                <div className="bubo-glass rounded-2xl p-8 border border-iq-neon-green/30 relative"
                     style={{ boxShadow: 'var(--elevation-2), 0 0 30px rgba(0, 255, 133, 0.2)' }}>
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-iq-neon-green text-dark-midnight">
                    ⭐ Most Popular
                  </Badge>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-['Space_Grotesk'] text-pure-white mb-2">
                      Pro
                    </h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-['Space_Grotesk'] text-iq-neon-green">
                        ${billingCycle === 'monthly' ? PLAN_PRICING.Pro.monthly : PLAN_PRICING.Pro.annual}
                      </span>
                      <span className="text-mist-gray ml-2">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-iq-neon-green mb-3">
                        ${PLAN_PRICING.Pro.annual * 12}/year • Save ${(PLAN_PRICING.Pro.monthly - PLAN_PRICING.Pro.annual) * 12}/year
                      </p>
                    )}
                    <p className="text-sm text-cloud-white">
                      {PLAN_LIMITS.Pro.included} devices • ${PLAN_LIMITS.Pro.overage}/device
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Everything in Starter, plus:</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Unlimited AI requests</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">{PLAN_LIMITS.Pro.connectSessions} Connect sessions ({PLAN_LIMITS.Pro.connectMinutes} min)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">AI-powered signal correlation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Incident Room collaboration</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Priority support</span>
                    </li>
                  </ul>

                  <Button
                    onClick={() => onNavigate('stripe-pricing')}
                    className="w-full bubo-btn-neon-primary"
                  >
                    Start Free Trial
                  </Button>
                </div>

                {/* Team */}
                <div className="bubo-glass rounded-2xl p-8 border border-prediction-purple/30">
                  <Badge className="mb-4 bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30">
                    🏢 Full Compliance Suite
                  </Badge>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-['Space_Grotesk'] text-pure-white mb-2">
                      Team
                    </h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-['Space_Grotesk'] text-prediction-purple">
                        ${billingCycle === 'monthly' ? PLAN_PRICING.Team.monthly : PLAN_PRICING.Team.annual}
                      </span>
                      <span className="text-mist-gray ml-2">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-iq-neon-green mb-3">
                        ${PLAN_PRICING.Team.annual * 12}/year • Save ${(PLAN_PRICING.Team.monthly - PLAN_PRICING.Team.annual) * 12}/year
                      </p>
                    )}
                    <p className="text-sm text-cloud-white">
                      {PLAN_LIMITS.Team.included} devices • ${PLAN_LIMITS.Team.overage}/device
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Everything in Pro, plus:</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">{PLAN_LIMITS.Team.connectSessions} Connect sessions ({PLAN_LIMITS.Team.connectMinutes} min)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Session recording & playback</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Compliance exports</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">White-label branding</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-prediction-purple mt-0.5 flex-shrink-0" />
                      <span className="text-cloud-white text-sm">Dedicated success manager</span>
                    </li>
                  </ul>

                  <Button
                    onClick={() => onNavigate('stripe-pricing')}
                    className="w-full bubo-btn-secondary"
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>

              {/* Add-Ons */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-['Space_Grotesk'] text-pure-white mb-4">
                    Power-Up Your Platform
                  </h2>
                  <p className="text-cloud-white">
                    Add specialized capabilities to any plan
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Security & Compliance Pack */}
                  <div className="bubo-glass rounded-xl p-6 border border-amber-warning/20">
                    <div className="flex items-start justify-between mb-4">
                      <Shield className="w-8 h-8 text-amber-warning" />
                      <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
                        MSP Only
                      </Badge>
                    </div>
                    <h3 className="text-xl font-['Space_Grotesk'] text-pure-white mb-2">
                      Security & Compliance Pack
                    </h3>
                    <div className="text-2xl font-['Space_Grotesk'] text-amber-warning mb-4">
                      ${ADDON_PRICING.Security.monthly}/mo
                      <span className="text-sm text-mist-gray ml-2">+ ${ADDON_PRICING.Security.perDevice}/device</span>
                    </div>
                    <ul className="space-y-2 text-sm text-cloud-white">
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-amber-warning mt-0.5 flex-shrink-0" />
                        <span>Powerful security monitoring</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-amber-warning mt-0.5 flex-shrink-0" />
                        <span>Compliance reporting (HIPAA, SOC 2)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-amber-warning mt-0.5 flex-shrink-0" />
                        <span>Audit trail management</span>
                      </li>
                    </ul>
                  </div>

                  {/* DR/Backup Pack */}
                  <div className="bubo-glass rounded-xl p-6 border border-signal-blue/20">
                    <div className="flex items-start justify-between mb-4">
                      <Database className="w-8 h-8 text-signal-blue" />
                      <Badge className="bg-signal-blue/20 text-signal-blue border-signal-blue/30">
                        MSP Only
                      </Badge>
                    </div>
                    <h3 className="text-xl font-['Space_Grotesk'] text-pure-white mb-2">
                      DR/Backup Pack
                    </h3>
                    <div className="text-2xl font-['Space_Grotesk'] text-signal-blue mb-4">
                      ${ADDON_PRICING.DR.monthly}/mo
                    </div>
                    <ul className="space-y-2 text-sm text-cloud-white">
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-signal-blue mt-0.5 flex-shrink-0" />
                        <span>Disaster recovery planning</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-signal-blue mt-0.5 flex-shrink-0" />
                        <span>Automated backup monitoring</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-signal-blue mt-0.5 flex-shrink-0" />
                        <span>Business continuity tracking</span>
                      </li>
                    </ul>
                  </div>

                  {/* Remote/Zero-Trust Pack */}
                  <div className="bubo-glass rounded-xl p-6 border border-electric-blue/20">
                    <div className="flex items-start justify-between mb-4">
                      <Cloud className="w-8 h-8 text-electric-blue" />
                      <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                        All Plans
                      </Badge>
                    </div>
                    <h3 className="text-xl font-['Space_Grotesk'] text-pure-white mb-2">
                      Remote / Zero-Trust Pack
                    </h3>
                    <div className="text-2xl font-['Space_Grotesk'] text-electric-blue mb-4">
                      ${ADDON_PRICING.Remote.monthly}/mo
                    </div>
                    <ul className="space-y-2 text-sm text-cloud-white">
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                        <span>Extended remote sessions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                        <span>Zero-trust remote policies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                        <span>Powerful session controls</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Annual Discount Note */}
              <div className="text-center py-6">
                <p className="text-cloud-white">
                  💡 <span className="text-iq-neon-green font-medium">Save 15%</span> with annual billing
                </p>
              </div>
            </TabsContent>

            {/* Small Business Tab */}
            <TabsContent value="smb">
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
                    <Building2 className="w-4 h-4 text-electric-blue mr-2" />
                    <span className="text-electric-blue text-sm font-medium">For Small Businesses</span>
                  </div>

                  <h2 className="text-4xl font-['Space_Grotesk'] text-pure-white mb-4">
                    Simple, Self-Serve IT Support
                  </h2>
                  <p className="text-xl text-cloud-white mb-8">
                    Start with Business Starter at just $39/month. When you outgrow self-serve, 
                    we'll connect you with the right MSP partner.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => onNavigate('small-business')}
                    className="w-full bubo-btn-neon-primary text-lg py-6"
                  >
                    View Small Business Plans <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <a
                    href="https://kevinhaskins.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-electric-blue hover:text-cyan-accent transition-colors"
                  >
                    Need compliance or DR/Backup? Talk to Kevin Haskins <ExternalLink className="w-4 h-4 inline ml-1" />
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};