import React, { useState } from 'react';
import { Check, Building2, Shield, Cloud, ExternalLink, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { PLAN_PRICING, ADDON_PRICING, PLAN_LIMITS } from '../../utils/pricing';
import { PartnerRoutingModal } from './PartnerRoutingModal';
import { OrbSystem } from './OrbSystem';

interface SmallBusinessPageProps {
  onNavigate: (page: any) => void;
}

export const SmallBusinessPage: React.FC<SmallBusinessPageProps> = ({ onNavigate }) => {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerReason, setPartnerReason] = useState<any>('msp_feature_requested');

  const handleComplianceClick = () => {
    setPartnerReason('compliance_requested');
    setShowPartnerModal(true);
  };

  const handleDRClick = () => {
    setPartnerReason('dr_backup_requested');
    setShowPartnerModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="border-b border-iq-neon-green/10 bg-surface-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="text-mist-gray">MSP-first.</span>
            <span className="text-iq-neon-green font-medium">SMBs welcome.</span>
            <a 
              href="https://kevinhaskins.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-blue hover:text-cyan-accent transition-colors inline-flex items-center ml-4"
            >
              Need MSP support? <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Friendly Metaball Orb - Organic, Approachable */}
        <OrbSystem
          variantType="Metaball"
          sizeToken="XS"
          placement="MidLeft"
          zLayer="Behind"
          tint="Base"
          motionProfile="Idle"
          glow={1}
          className="opacity-40"
        />
        
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Navigation */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('pricing')}
              className="inline-flex items-center text-mist-gray hover:text-iq-neon-green transition-all duration-300 group font-['Space_Grotesk'] font-medium px-4 py-2 rounded-lg hover:bg-iq-neon-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iq-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark-midnight"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to MSP Plans</span>
            </button>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-iq-neon-green mr-2" />
              <span className="text-iq-neon-green text-sm font-medium">For Small Businesses</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold mb-6">
              <span className="text-white">No IT Team?</span>
              <br />
              <span className="text-iq-neon-green">Start Simple. Grow When Ready.</span>
            </h1>

            <p className="text-xl text-cloud-white mb-8 max-w-3xl mx-auto">
              Watch your computers and fix problems remotely without the hassle. 
              When you need more help, we'll connect you with an MSP partner.
            </p>
          </div>

          {/* Pricing Card - Business Starter */}
          <div className="max-w-2xl mx-auto">
            <div className="bubo-glass rounded-2xl p-8 border border-iq-neon-green/20"
                 style={{ boxShadow: 'var(--elevation-2), 0 0 30px rgba(0, 255, 133, 0.15)' }}>
              
              {/* Plan Header */}
              <div className="text-center mb-8 pb-8 border-b border-slate-gray/30">
                <h2 className="text-3xl font-['Space_Grotesk'] text-pure-white mb-2">
                  Business Starter
                </h2>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-['Space_Grotesk'] text-iq-neon-green">
                    ${PLAN_PRICING.Starter.monthly}
                  </span>
                  <span className="text-mist-gray ml-2">/month</span>
                </div>
                <p className="text-cloud-white">
                  {PLAN_LIMITS.Starter.included} computers included • ${PLAN_LIMITS.Starter.overage}/computer over
                </p>
              </div>

              {/* Core Features */}
              <div className="mb-8">
                <h3 className="text-lg font-['Space_Grotesk'] text-cloud-white mb-4">
                  What's Included:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-pure-white">Watch your computers</div>
                      <div className="text-sm text-mist-gray">Always-on health checks for all computers</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-pure-white">Track issues</div>
                      <div className="text-sm text-mist-gray">System finds and tracks problems</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-pure-white">Signal Intelligence</div>
                      <div className="text-sm text-mist-gray">Predictive alerts before problems escalate</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-pure-white">Basic Remote Support</div>
                      <div className="text-sm text-mist-gray">{PLAN_LIMITS.Starter.connectSessions} sessions, {PLAN_LIMITS.Starter.connectMinutes} min each</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-pure-white">Email Support</div>
                      <div className="text-sm text-mist-gray">Next business day response</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-On: Remote/Zero-Trust */}
              <div className="mb-8 p-6 bg-electric-blue/5 border border-electric-blue/20 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Cloud className="w-6 h-6 text-electric-blue" />
                    <div>
                      <h4 className="text-lg font-['Space_Grotesk'] text-pure-white">
                        Remote / Zero-Trust Pack
                      </h4>
                      <p className="text-sm text-cloud-white">
                        Better remote access with security controls
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-['Space_Grotesk'] text-electric-blue">
                      +${ADDON_PRICING.Remote.monthly}
                    </div>
                    <div className="text-xs text-mist-gray">/month</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-electric-blue flex-shrink-0" />
                    <span className="text-cloud-white">Extended remote sessions (50 sessions, 60 min each)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-electric-blue flex-shrink-0" />
                    <span className="text-cloud-white">Zero-trust remote policies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-electric-blue flex-shrink-0" />
                    <span className="text-cloud-white">Session recording & audit logs</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => onNavigate('stripe-pricing')}
                className="w-full bubo-btn-neon-primary text-lg py-6"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* MSP-Only Add-Ons Banner */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-surface-dark/30 border border-amber-warning/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-amber-warning flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-['Space_Grotesk'] text-pure-white mb-2">
                    Need Compliance or Backup Solutions?
                  </h3>
                  <p className="text-cloud-white mb-4">
                    Security & Compliance Pack and DR/Backup Pack are available exclusively through 
                    Verified MSP partners. These enterprise-grade features require professional management 
                    and support.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleComplianceClick}
                      variant="outline"
                      className="border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Talk About Compliance
                    </Button>
                    <Button
                      onClick={handleDRClick}
                      variant="outline"
                      className="border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10"
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      Talk About DR/Backup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Path */}
          <div className="mt-16 text-center">
            <p className="text-cloud-white mb-4">
              When you reach <span className="text-iq-neon-green font-medium">25+ devices</span> or 
              <span className="text-iq-neon-green font-medium"> 10+ tickets/month</span>, 
              we'll help connect you with an MSP partner.
            </p>
            <a
              href="https://kevinhaskins.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-electric-blue hover:text-cyan-accent transition-colors"
            >
              Learn more about MSP partnerships
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Partner Routing Modal */}
      <PartnerRoutingModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        reason={partnerReason}
      />
    </div>
  );
};