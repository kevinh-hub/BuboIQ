import React, { useState } from 'react';
import { Button } from './ui/button';
import { useApp } from '../App';
import { X, Sparkles, Clock, CreditCard } from 'lucide-react';

export default function FreeTrialBanner() {
  const { trialInfo, setCurrentPage } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!trialInfo.isActive || isDismissed || trialInfo.plan !== 'trial') {
    return null;
  }

  const handleUpgradeClick = () => {
    setCurrentPage('pricing');
  };

  return (
    <div className="relative bg-[#2ECC71] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="font-semibold text-sm md:text-base">
              🎉 14-day free trial — No credit card needed!
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm opacity-90">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{trialInfo.daysRemaining} days remaining</span>
            </div>
            <div className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span>Full access • No limits</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleUpgradeClick}
            variant="secondary"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 font-medium px-4 py-1.5 rounded-lg transition-all duration-200"
          >
            View Plans
          </Button>
          
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white/40 transition-all duration-300"
          style={{ 
            width: `${((14 - trialInfo.daysRemaining) / 14) * 100}%` 
          }}
        />
      </div>
    </div>
  );
}