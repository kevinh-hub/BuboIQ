import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Zap, ArrowRight, Crown, CreditCard } from 'lucide-react';

interface TrialCountdownProps {
  trialInfo: {
    isActive: boolean;
    daysRemaining: number;
    plan: string;
  };
  onNavigate: (page: string) => void;
  onShowUpgradeModal?: () => void;
  user?: any;
}

export default function TrialCountdown({ trialInfo, onNavigate, onShowUpgradeModal, user }: TrialCountdownProps) {

  if (!trialInfo.isActive || trialInfo.plan !== 'trial') {
    return null;
  }

  const daysLeft = trialInfo.daysRemaining;
  const isUrgent = daysLeft <= 3;
  const progressPercentage = ((14 - daysLeft) / 14) * 100;

  return (
    <div className={`rounded-lg border-2 p-4 transition-all duration-300 ${
      isUrgent 
        ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
        : 'bg-gradient-to-r from-blue-50 to-green-50 border-[#2ECC71]/20'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            isUrgent ? 'bg-red-100' : 'bg-[#2ECC71]/10'
          }`}>
            {isUrgent ? (
              <Clock className="h-5 w-5 text-red-600" />
            ) : (
              <Zap className="h-5 w-5 text-[#2ECC71]" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Free Trial</h3>
            <p className="text-sm text-gray-600">
              {isUrgent ? 'Trial ending soon!' : 'Full access included'}
            </p>
          </div>
        </div>

        <Badge 
          variant="secondary" 
          className={`px-3 py-1 text-sm font-medium ${
            isUrgent 
              ? 'bg-red-100 text-red-800 border-red-200' 
              : 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20'
          }`}
        >
          <Clock className="h-3 w-3 mr-1" />
          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Trial Progress</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isUrgent ? 'bg-gradient-to-r from-red-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-[#2ECC71]'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Trial benefits */}
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-700">
          <strong>Trial includes:</strong>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span>Unlimited tickets</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span>Full team access</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span>Advanced reporting</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span>Priority support</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => onNavigate('stripe-pricing')}
          className="bubo-btn-neon-primary flex-1 justify-center"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Upgrade Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        
        <Button
          onClick={() => onNavigate('pricing')}
          variant="outline"
          className="border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10 flex-1 justify-center"
        >
          <Crown className="h-4 w-4 mr-2" />
          Compare Plans
        </Button>
      </div>

      {isUrgent && (
        <div className="mt-3 p-3 bg-signal-yellow/10 rounded-xl border border-signal-yellow/30">
          <p className="text-xs text-signal-yellow text-center">
            ⚠️ <strong>Action needed:</strong> Choose a plan to continue using BuboIQ after your trial ends
          </p>
        </div>
      )}
    </div>
  );
}