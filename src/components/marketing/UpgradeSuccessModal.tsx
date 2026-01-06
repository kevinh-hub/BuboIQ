import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Zap, Brain, BarChart3, Link2, ArrowRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface UpgradeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedFeature?: 'automation' | 'ai-triage' | 'analytics' | 'integrations';
  userId?: string;
}

export const UpgradeSuccessModal: React.FC<UpgradeSuccessModalProps> = ({
  isOpen,
  onClose,
  unlockedFeature,
  userId
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Track successful upgrade
      if ((window as any).gtag) {
        (window as any).gtag('event', 'upgrade_completed', {
          plan_id: 'pro',
          feature_unlocked: unlockedFeature,
          user_id: userId
        });
      }

      // Auto-close confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, unlockedFeature, userId]);

  if (!isOpen) return null;

  const featureIcons = {
    automation: Zap,
    'ai-triage': Brain,
    analytics: BarChart3,
    integrations: Link2
  };

  const unlockedFeatures = [
    {
      icon: Zap,
      name: 'Automation Rules',
      description: 'Auto-assign and escalate tickets'
    },
    {
      icon: Brain,
      name: 'AI Triage',
      description: 'Intelligent ticket prioritization'
    },
    {
      icon: BarChart3,
      name: 'SLA Analytics',
      description: 'Real-time performance tracking'
    },
    {
      icon: Link2,
      name: 'Unlimited Integrations',
      description: 'Connect 200+ tools'
    }
  ];

  const handleExploreFeatures = () => {
    // Track feature exploration
    if ((window as any).gtag) {
      (window as any).gtag('event', 'explore_pro_features', {
        source: 'success_modal',
        user_id: userId
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neural-black/90 backdrop-blur-sm" />
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                Math.random() > 0.5 ? 'bg-iq-neon-green' : 'bg-electric-blue'
              }`} />
            </div>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <div className="relative bg-surface-dark border border-iq-neon-green/30 rounded-3xl max-w-2xl w-full mx-4 bubo-glass overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-mist-gray hover:text-pure-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-iq-neon-green/20 to-electric-blue/20 p-8 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bubo-holographic opacity-30" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-iq-neon-green/20 rounded-full mb-6 relative">
              <CheckCircle className="w-12 h-12 text-iq-neon-green" />
              <div className="absolute inset-0 rounded-full border-2 border-iq-neon-green animate-ping" />
            </div>
            
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-4">
              Welcome to <span className="text-iq-neon-green">Pro</span>!
            </h1>
            
            <p className="text-xl text-cloud-white mb-2">
              You've unlocked foresight, speed, and confidence.
            </p>
            
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              All Pro features are now active
            </Badge>
          </div>
        </div>

        <div className="p-8">
          {/* Account Status Update */}
          <div className="bg-gradient-to-r from-iq-neon-green/10 to-electric-blue/10 rounded-xl p-4 mb-6 border border-iq-neon-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
                <span className="font-['Space_Grotesk'] font-bold text-pure-white">
                  Account Status: Pro Active
                </span>
              </div>
              <Badge className="bg-iq-neon-green text-dark-midnight">
                Trial: 14 days remaining
              </Badge>
            </div>
          </div>

          {/* Unlocked Features Grid */}
          <div className="space-y-4 mb-8">
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white text-lg text-center">
              Features Now Unlocked
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {unlockedFeatures.map((feature) => {
                const IconComponent = feature.icon;
                const isHighlighted = unlockedFeature && featureIcons[unlockedFeature] === feature.icon;
                
                return (
                  <Card 
                    key={feature.name}
                    className={`p-4 transition-all duration-500 ${
                      isHighlighted 
                        ? 'bubo-glass-bright border-iq-neon-green/50 bubo-glow-green' 
                        : 'bubo-glass border-iq-neon-green/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isHighlighted 
                          ? 'bg-iq-neon-green/30' 
                          : 'bg-iq-neon-green/20'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isHighlighted ? 'text-iq-neon-green animate-pulse' : 'text-iq-neon-green'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-['Space_Grotesk'] font-bold text-pure-white text-sm">
                          {feature.name}
                        </h4>
                        <p className="text-xs text-mist-gray">{feature.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0" />
                    </div>
                    
                    {isHighlighted && (
                      <div className="mt-3 pt-3 border-t border-iq-neon-green/20">
                        <div className="flex items-center space-x-2 text-iq-neon-green text-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Just unlocked!</span>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Getting Started Tips */}
          <div className="bg-nocturne-indigo/30 rounded-xl p-6 mb-6 border border-electric-blue/20">
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-3 flex items-center">
              <Sparkles className="w-5 h-5 text-electric-blue mr-2" />
              Quick Start Tips
            </h4>
            <div className="space-y-2 text-sm text-cloud-white">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                <span>Set up your first automation rule to auto-assign tickets</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                <span>Configure SLA thresholds in Analytics for proactive monitoring</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-electric-blue rounded-full mt-2 flex-shrink-0" />
                <span>Connect your most-used tools in the Integrations hub</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleExploreFeatures}
              className="w-full bubo-btn-neon-primary"
              size="lg"
            >
              <span>Explore Pro Features</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={onClose}
              className="w-full bubo-btn-ghost"
              size="sm"
            >
              Continue to Dashboard
            </Button>
          </div>
          
          <p className="text-center text-xs text-mist-gray mt-4">
            Need help getting started? Check out our <span className="text-iq-neon-green">Pro Setup Guide</span>
          </p>
        </div>
      </div>
    </div>
  );
};