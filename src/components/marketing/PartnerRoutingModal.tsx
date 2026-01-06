import React from 'react';
import { X, ExternalLink, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { OrbSystem } from './OrbSystem';
import {
  PartnerLeadReason,
  getPartnerRoutingMessage,
  redirectToPartnerConsult,
  createPartnerLead
} from '../../utils/partner-routing';

interface PartnerRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: PartnerLeadReason;
  orgId?: string;
  context?: {
    deviceCount?: number;
    ticketCount?: number;
    requestedFeature?: string;
  };
}

export const PartnerRoutingModal: React.FC<PartnerRoutingModalProps> = ({
  isOpen,
  onClose,
  reason,
  orgId,
  context
}) => {
  if (!isOpen) return null;

  const { title, message } = getPartnerRoutingMessage(reason);

  const handleTalkToKevin = async () => {
    // Create partner lead record
    if (orgId) {
      await createPartnerLead({
        org_id: orgId,
        reason,
        context
      });
    }

    // Redirect to consultation
    redirectToPartnerConsult(reason, orgId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-midnight/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        {/* Halo Growth Effect Orb - Never over text */}
        <div className="absolute -top-20 -right-20 pointer-events-none">
          <OrbSystem
            variantType="HaloRing"
            sizeToken="M"
            placement="InlineBadge"
            zLayer="Behind"
            tint="Base"
            motionProfile="Focus"
            glow={3}
            className="opacity-60"
            onHover={true}
          />
        </div>
        
        <div className="bubo-glass rounded-2xl border border-iq-neon-green/20 overflow-hidden relative z-10"
             style={{ boxShadow: 'var(--elevation-3), 0 0 40px rgba(0, 255, 133, 0.2)' }}>
          
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-iq-neon-green/10">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-surface-dark/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-mist-gray hover:text-pure-white" />
            </button>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-iq-neon-green/10 rounded-xl border border-iq-neon-green/30">
                <TrendingUp className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-['Space_Grotesk'] text-pure-white mb-2">
                  {title}
                </h2>
                <p className="text-cloud-white text-lg">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Context Info */}
            {context && (
              <div className="mb-6 p-4 bg-surface-dark/50 rounded-xl border border-slate-gray/30">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {context.deviceCount !== undefined && (
                    <div>
                      <div className="text-mist-gray mb-1">Devices</div>
                      <div className="text-pure-white font-jetbrains-mono">{context.deviceCount}</div>
                    </div>
                  )}
                  {context.ticketCount !== undefined && (
                    <div>
                      <div className="text-mist-gray mb-1">Tickets This Month</div>
                      <div className="text-pure-white font-jetbrains-mono">{context.ticketCount}</div>
                    </div>
                  )}
                  {context.requestedFeature && (
                    <div className="col-span-2">
                      <div className="text-mist-gray mb-1">Requested Feature</div>
                      <div className="text-pure-white">{context.requestedFeature}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-['Space_Grotesk'] text-cloud-white">
                What happens next:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-electric-blue/10 rounded-lg">
                    <Users className="w-4 h-4 text-electric-blue" />
                  </div>
                  <div>
                    <div className="text-pure-white font-medium">Talk with Kevin Haskins</div>
                    <div className="text-mist-gray text-sm">Get personalized guidance on scaling your IT support</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-iq-neon-green/10 rounded-lg">
                    <Shield className="w-4 h-4 text-iq-neon-green" />
                  </div>
                  <div>
                    <div className="text-pure-white font-medium">MSP Partnership Options</div>
                    <div className="text-mist-gray text-sm">Access enterprise features through verified MSP partners</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-cyan-accent/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-cyan-accent" />
                  </div>
                  <div>
                    <div className="text-pure-white font-medium">Custom Solutions</div>
                    <div className="text-mist-gray text-sm">Tailored support that grows with your organization</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleTalkToKevin}
                className="bubo-btn-neon-primary flex-1"
              >
                <span>Talk to Kevin Haskins</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={onClose}
                className="bubo-btn-ghost"
              >
                Maybe Later
              </Button>
            </div>

            {/* Footer Note */}
            <p className="mt-4 text-center text-xs text-mist-gray">
              No commitment required • Free consultation • Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};