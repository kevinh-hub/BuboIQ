import React from 'react';
import { X, Monitor, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ConnectFeatureBadge } from '../marketing/ConnectFeatureBadge';

interface UpgradeGuardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

export const UpgradeGuardOverlay: React.FC<UpgradeGuardOverlayProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName = "Remote Access"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blurred content */}
      <div className="absolute inset-0 bg-neural-black/90 backdrop-blur-lg" />
      
      {/* Blurred background content hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="bubo-glass rounded-3xl p-8 blur-sm">
          <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-iq-neon-green" />
          </div>
          <div className="h-4 bg-mist-gray/30 rounded mb-2" />
          <div className="h-3 bg-mist-gray/20 rounded w-3/4 mx-auto" />
        </div>
      </div>

      {/* Main overlay content */}
      <div className="relative w-full max-w-lg mx-4">
        <div className="bubo-glass-bright rounded-3xl border border-iq-neon-green/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-iq-neon-green/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-iq-neon-green" />
              </div>
              <div>
                <h2 className="font-space-grotesk font-bold text-pure-white">
                  {featureName} Locked
                </h2>
                <ConnectFeatureBadge size="sm" />
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-mist-gray hover:text-pure-white p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-10 h-10 text-iq-neon-green" />
            </div>

            <h3 className="font-space-grotesk text-2xl font-bold text-pure-white mb-4">
              Upgrade to Bubo<span className="text-iq-neon-green">IQ</span> Pro
            </h3>
            
            <p className="text-mist-gray text-lg mb-8 leading-relaxed">
              Unlock secure remote access to instantly fix issues without leaving your dashboard.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-iq-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-iq-neon-green" />
                </div>
                <span className="text-pure-white">Instant remote sessions from any ticket</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-iq-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-iq-neon-green" />
                </div>
                <span className="text-pure-white">End-to-end encrypted connections</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-iq-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-iq-neon-green" />
                </div>
                <span className="text-pure-white">Multi-provider integration support</span>
              </div>
            </div>

            {/* Pricing highlight */}
            <div className="bg-surface-dark/50 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-3xl font-bold text-iq-neon-green">$49</span>
                  <span className="text-mist-gray ml-2">/month</span>
                </div>
                <p className="text-mist-gray text-sm">
                  Pro plan includes Connect + all powerful features
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={onUpgrade}
                className="bubo-btn-neon-primary w-full text-lg py-4"
              >
                See Pro Options
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              
              <Button 
                onClick={onClose}
                variant="ghost"
                className="w-full text-mist-gray hover:text-pure-white"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};