import React, { useState } from 'react';
import { X, Zap, Brain, BarChart3, Link2, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'automation' | 'ai-triage' | 'analytics' | 'integrations';
  userId?: string;
  onUpgradeComplete?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  feature,
  userId,
  onUpgradeComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const featureConfig = {
    automation: {
      icon: Zap,
      title: 'Auto-routing',
      subtitle: 'Stop sorting issues by hand.',
      value: 'Save 3+ hours per day',
      benefits: [
        'Send issues to the right person based on type and who has time',
        'Auto-escalate before deadlines hit',
        'Speed up common fixes',
        'Different workflows for different issue types',
        'Auto follow-ups and updates'
      ],
      testimonial: '"Auto-routing freed up our team to fix things instead of just sorting issues."',
      customer: 'Sarah Chen, IT Director at TechCorp'
    },
    'ai-triage': {
      icon: Brain,
      title: 'Smart sorting',
      subtitle: 'Let the system sort noise from real problems.',
      value: '94% accurate',
      benefits: [
        'Instant labeling of new issues',
        'Auto-prioritize urgent stuff',
        'Focus on fixes, not sorting',
        'Send to the right person',
        'Learns from your team\'s choices'
      ],
      testimonial: '"Smart sorting helped us catch critical issues early and hit our deadlines."',
      customer: 'Marcus Rodriguez, Operations Lead'
    },
    analytics: {
      icon: BarChart3,
      title: 'Reports',
      subtitle: 'See how things are going.',
      value: 'Track deadlines live',
      benefits: [
        'Live deadline tracking',
        'See who\'s busy and who has time',
        'Spot trends before they become problems',
        'Custom reports for your boss',
        'Predict when you\'ll need more help'
      ],
      testimonial: '"Reports helped us find bottlenecks and fix 35% more issues on the first try."',
      customer: 'Lisa Park, Customer Success Manager'
    },
    integrations: {
      icon: Link2,
      title: 'Connect everything',
      subtitle: 'Link all your tools together.',
      value: '200+ tools work',
      benefits: [
        'Connect to 200+ other apps',
        'Custom workflows across apps',
        'Stop jumping between tabs',
        'Two-way sync with tools you already use',
        'API for custom connections'
      ],
      testimonial: '"Connecting everything in one place changed how our team works."',
      customer: 'David Kim, DevOps Engineer'
    }
  };

  const config = featureConfig[feature];
  const IconComponent = config.icon;

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    // Track the upgrade intent in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'begin_upgrade_flow', {
        plan_id: 'pro',
        source: 'upgrade_modal',
        feature_blocked: feature,
        user_id: userId
      });
    }

    // Simulate upgrade process
    setTimeout(() => {
      setIsLoading(false);
      
      // Track successful upgrade
      if ((window as any).gtag) {
        (window as any).gtag('event', 'upgrade_success', {
          plan_id: 'pro',
          source: 'upgrade_modal',
          feature_triggered: feature,
          user_id: userId
        });
      }
      
      onUpgradeComplete?.();
      onClose();
    }, 2000);
  };

  const handleViewPricing = () => {
    // Track pricing view
    if ((window as any).gtag) {
      (window as any).gtag('event', 'view_pricing_from_modal', {
        feature_blocked: feature,
        user_id: userId
      });
    }
    
    onClose();
    // In a real app, this would navigate to pricing page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neural-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface-dark border border-iq-neon-green/20 rounded-3xl max-w-lg w-full mx-4 bubo-glass overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-mist-gray hover:text-pure-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-iq-neon-green/10 to-electric-blue/10 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-iq-neon-green/20 rounded-3xl mb-4 relative">
            <IconComponent className="w-10 h-10 text-iq-neon-green" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-electric-blue animate-pulse" />
            </div>
          </div>
          
          <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30 mb-4">
            Pro Feature Locked
          </Badge>
          
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
            {config.title}
          </h2>
          
          <p className="text-lg text-iq-neon-green font-medium mb-2">
            {config.subtitle}
          </p>
          
          <div className="inline-flex items-center space-x-2 bg-iq-neon-green/10 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 text-iq-neon-green" />
            <span className="text-sm text-iq-neon-green font-medium">{config.value}</span>
          </div>
        </div>

        <div className="p-8">
          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white text-sm mb-3">
              What you'll unlock:
            </h3>
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-iq-neon-green/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-iq-neon-green" />
                </div>
                <span className="text-cloud-white text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Customer Quote */}
          <div className="bg-nocturne-indigo/30 rounded-xl p-4 mb-6 border border-iq-neon-green/10">
            <p className="text-cloud-white text-sm italic mb-2">
              {config.testimonial}
            </p>
            <p className="text-xs text-mist-gray">
              — {config.customer}
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-iq-neon-green/5 to-electric-blue/5 rounded-xl p-4 mb-6 border border-iq-neon-green/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist-gray text-sm">Upgrade to Pro</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-pure-white">$49</span>
                  <span className="text-mist-gray text-sm">/mo</span>
                </div>
                <p className="text-xs text-iq-neon-green">14-day free trial included</p>
              </div>
              <div className="text-right">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-1">
                  Most Teams Choose Pro
                </Badge>
                <p className="text-xs text-mist-gray">vs $9/mo Basic</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bubo-btn-neon-primary"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-dark-midnight border-t-transparent rounded-full animate-spin" />
                  <span>Processing upgrade...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Start Free Trial — Unlock {config.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            
            <Button
              onClick={handleViewPricing}
              className="w-full bubo-btn-ghost"
              size="sm"
            >
              View All Pro Features
            </Button>
          </div>
          
          <p className="text-center text-xs text-mist-gray mt-4">
            No commitment • Cancel anytime • Keep all your data
          </p>
        </div>
      </div>
    </div>
  );
};