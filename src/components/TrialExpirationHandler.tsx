import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isTrialExpired, calculateTrialDaysRemaining } from '../utils/trial';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CreditCard, Clock, AlertTriangle, Sparkles } from 'lucide-react';

interface TrialExpirationHandlerProps {
  onNavigate: (page: string) => void;
}

export const TrialExpirationHandler: React.FC<TrialExpirationHandlerProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [showExpirationModal, setShowExpirationModal] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    // Check if user is on trial
    const isUserOnTrial = user.tier === 'trial' || !user.tier || user.tier === 'starter';
    
    if (isUserOnTrial && user.trialEndDate) {
      const endDate = new Date(user.trialEndDate);
      const daysRemaining = calculateTrialDaysRemaining(endDate);
      setTrialDaysRemaining(daysRemaining);
      
      // Show expiration modal if trial has expired
      if (daysRemaining <= 0) {
        setShowExpirationModal(true);
      }
    }
  }, [user]);

  const handleUpgradeNow = () => {
    setShowExpirationModal(false);
    onNavigate('stripe-pricing');
  };

  const handleContinueTrial = () => {
    setShowExpirationModal(false);
    // Allow continued access but with limited features
  };

  if (!showExpirationModal) return null;

  return (
    <Dialog open={showExpirationModal} onOpenChange={setShowExpirationModal}>
      <DialogContent className="max-w-2xl bg-dark-midnight border border-surface-dark">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-signal-yellow/20 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-signal-yellow" />
          </div>
          
          <DialogTitle className="text-3xl font-bold font-space-grotesk text-white">
            Your Free Trial Has Ended
          </DialogTitle>
          
          <DialogDescription className="text-lg text-mist-gray">
            Ready to continue your IT intelligence journey? Choose a plan to keep all your progress and unlock advanced features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* What You've Accomplished */}
          <Card className="bg-surface-dark/50 border border-iq-neon-green/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-iq-neon-green" />
              <h3 className="text-lg font-semibold text-white">What You've Accomplished</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-iq-neon-green">14</div>
                <div className="text-sm text-mist-gray">Days of Intelligence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-electric-blue">127</div>
                <div className="text-sm text-mist-gray">Signals Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-accent">23</div>
                <div className="text-sm text-mist-gray">Issues Resolved</div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="bg-surface-dark/50 border border-electric-blue/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-electric-blue" />
              <h3 className="text-lg font-semibold text-white">Don't Lose Your Progress</h3>
            </div>
            <p className="text-mist-gray mb-4">
              Your trial data and configurations will be preserved when you upgrade. 
              Continue monitoring your infrastructure without interruption.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-iq-neon-green" />
                <span className="text-cloud-white">Keep all your device monitoring</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-iq-neon-green" />
                <span className="text-cloud-white">Retain signal history and patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-iq-neon-green" />
                <span className="text-cloud-white">Access advanced AI features</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleUpgradeNow}
              className="flex-1 bubo-btn-neon-primary py-4 text-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Upgrade Now - Keep Full Access
            </Button>
            
            <Button
              onClick={handleContinueTrial}
              variant="outline"
              className="border-mist-gray/30 text-mist-gray hover:bg-mist-gray/10"
            >
              Continue with Limitations
            </Button>
          </div>

          <div className="text-center text-xs text-mist-gray">
            <p>Secure payments powered by Stripe • Cancel anytime • 30-day money-back guarantee</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};