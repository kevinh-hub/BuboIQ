import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckCircle, ArrowRight, Sparkles, Shield, Zap, Brain } from 'lucide-react';
import { MarketingNavigation } from './MarketingNavigation';

interface StripeSuccessPageProps {
  onNavigate: (page: string) => void;
}

export const StripeSuccessPage: React.FC<StripeSuccessPageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('session_id');
    setSessionId(sid);

    // Refresh user data to get updated tier
    if (refreshUser) {
      setTimeout(() => {
        refreshUser();
      }, 2000); // Give webhook time to process
    }
  }, [refreshUser]);

  const tierFeatures = {
    Starter: [
      'Monitor up to 10 computers',
      'Core incident detection',
      'Basic dashboard and alerts',
      'Community support access'
    ],
    Pro: [
      'AI-powered incident triage',
      'Knowledge Base access',
      'BuboIQ Connect remote sessions',
      'Deep analytics & insights',
      'Priority support channel'
    ],
    Team: [
      'Powerful AI predictions',
      'Compliance reporting tools',
      'White-label customization',
      'Dedicated customer manager',
      'Enterprise security controls'
    ]
  };

  const currentTier = user?.tier || 'Pro';
  const features = tierFeatures[currentTier as keyof typeof tierFeatures] || tierFeatures.Pro;

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg">
      {/* Background effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-15 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      
      <MarketingNavigation currentPage="success" onNavigate={onNavigate} onTryItNow={() => {}} />
      
      <main className="relative z-10 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Success Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-iq-neon-green/20 border-2 border-iq-neon-green mb-8 bubo-animate-pulse-glow">
              <CheckCircle className="w-10 h-10 text-iq-neon-green" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk mb-6">
              Welcome to <span className="bubo-neon-text-green">BuboIQ</span>
            </h1>
            <p className="text-xl text-mist-gray max-w-2xl mx-auto mb-8">
              Your subscription is active! You now have access to powerful AI-powered IT support intelligence.
            </p>
            
            {sessionId && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iq-neon-green/10 border border-iq-neon-green/20 text-sm">
                <Shield className="w-4 h-4 text-iq-neon-green" />
                <span className="text-iq-neon-green">Payment confirmed</span>
                <span className="text-mist-gray">#{sessionId.slice(-8)}</span>
              </div>
            )}
          </div>

          {/* Plan Features */}
          <Card className="bg-surface-dark/50 border border-iq-neon-green/30 bubo-glass backdrop-blur-xl mb-12">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-iq-neon-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-space-grotesk text-white">
                    {currentTier} Plan Activated
                  </h2>
                  <p className="text-mist-gray">Here's what you can do now:</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-cloud-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-surface-dark/30 border border-electric-blue/30 bubo-glass backdrop-blur-xl hover:border-electric-blue/50 transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-electric-blue/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-electric-blue" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Access Dashboard</h3>
                <p className="text-sm text-mist-gray mb-4">
                  Start monitoring your IT infrastructure with real-time insights.
                </p>
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  size="sm"
                  className="bubo-btn-secondary w-full"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            <Card className="bg-surface-dark/30 border border-cyan-accent/30 bubo-glass backdrop-blur-xl hover:border-cyan-accent/50 transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-cyan-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Explore AI Features</h3>
                <p className="text-sm text-mist-gray mb-4">
                  Discover intelligent triage, predictions, and automated insights.
                </p>
                <Button 
                  onClick={() => onNavigate('features')}
                  size="sm"
                  variant="outline"
                  className="border-cyan-accent/30 text-cyan-accent hover:bg-cyan-accent/10 w-full"
                >
                  Learn More
                </Button>
              </div>
            </Card>

            <Card className="bg-surface-dark/30 border border-signal-yellow/30 bubo-glass backdrop-blur-xl hover:border-signal-yellow/50 transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-signal-yellow/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-signal-yellow" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Manage Billing</h3>
                <p className="text-sm text-mist-gray mb-4">
                  Update your payment method, view invoices, or change plans.
                </p>
                <Button 
                  onClick={() => onNavigate('settings')}
                  size="sm"
                  variant="outline"
                  className="border-signal-yellow/30 text-signal-yellow hover:bg-signal-yellow/10 w-full"
                >
                  Billing Settings
                </Button>
              </div>
            </Card>
          </div>

          {/* Welcome Message */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-surface-dark/50 border border-surface-dark backdrop-blur-xl">
              <p className="text-mist-gray">
                Need help getting started? Our team is here to assist you.
              </p>
              <Button
                onClick={() => onNavigate('about')}
                variant="outline"
                size="sm"
                className="border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10"
              >
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};