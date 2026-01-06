import React from 'react';
import { X, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { COMING_SOON_CONFIG } from '../../utils/feature-flags';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
  const handleCTA = () => {
    const { ctaAction } = COMING_SOON_CONFIG;
    
    // Handle mailto or URL
    if (ctaAction.startsWith('mailto:')) {
      window.location.href = ctaAction;
    } else {
      window.open(ctaAction, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bubo-glass border-iq-neon-green/20 max-w-lg p-0 overflow-hidden">
        {/* Accessible title and description for screen readers */}
        <DialogTitle className="sr-only">
          {COMING_SOON_CONFIG.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {COMING_SOON_CONFIG.message}
        </DialogDescription>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-mist-gray hover:text-pure-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-iq-neon-green/10 via-transparent to-amber-warning/5 p-8 pb-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent" />
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-iq-neon-green/20 to-amber-warning/20 flex items-center justify-center border border-iq-neon-green/30">
                <Sparkles className="w-10 h-10 text-iq-neon-green" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-warning/20 border border-amber-warning/40 flex items-center justify-center">
                <span className="text-xs" role="img" aria-label="rocket">🚀</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-['Space_Grotesk'] text-pure-white text-center mb-2" aria-hidden="true">
            {COMING_SOON_CONFIG.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-4">
          <p className="text-lg text-cloud-white text-center mb-6 leading-relaxed" aria-hidden="true">
            {COMING_SOON_CONFIG.message}
          </p>

          {/* Benefits list */}
          <div className="space-y-3 mb-6">
            {[
              'Be first to get early access',
              'Special launch pricing',
              'Priority onboarding support'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                </div>
                <span className="text-cloud-white">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCTA}
              className="bubo-btn-neon-primary flex-1 group"
              size="lg"
            >
              <Mail className="w-4 h-4 mr-2" />
              {COMING_SOON_CONFIG.ctaText}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-slate-gray/30 text-cloud-white hover:bg-slate-gray/10 hover:border-iq-neon-green/30 hover:text-pure-white"
              size="lg"
            >
              Maybe Later
            </Button>
          </div>

          {/* Debug info (only shown if enabled) */}
          {COMING_SOON_CONFIG.showDebugInfo && (
            <div className="mt-4 p-3 bg-amber-warning/10 border border-amber-warning/20 rounded-lg">
              <p className="text-xs text-amber-warning text-center">
                Debug: Billing is currently disabled. Set FEATURE_FLAGS.BILLING_ENABLED = true to enable.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
