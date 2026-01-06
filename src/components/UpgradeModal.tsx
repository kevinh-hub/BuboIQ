import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { useApp } from '../App';
import { 
  X, 
  Crown, 
  Users, 
  Zap, 
  ExternalLink, 
  Star, 
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, trialInfo } = useApp();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 9, yearly: 7 },
      icon: Zap,
      color: 'blue',
      features: ['1 user', 'Unlimited tickets', 'Basic reporting'],
      popular: false
    },
    {
      name: 'Team',
      price: { monthly: 29, yearly: 23 },
      icon: Users,
      color: 'green',
      features: ['Up to 5 users', 'Advanced reporting', 'Priority support'],
      popular: true
    },
    {
      name: 'Growth',
      price: { monthly: 79, yearly: 63 },
      icon: Crown,
      color: 'purple',
      features: ['Unlimited users', 'SLA reports', 'Custom branding'],
      popular: false
    }
  ];

  const handleUpgrade = (plan: string) => {
    // Simulate Stripe checkout
    window.open(`https://stripe.com/checkout?plan=${plan.toLowerCase()}&yearly=${isYearly}`, '_blank');
  };

  const handleLearnMore = () => {
    setShowUpgradeModal(false);
    // Would navigate to pricing page in a real app
  };

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="p-2 bg-[#2ECC71]/10 rounded-lg">
              <Crown className="h-6 w-6 text-[#2ECC71]" />
            </div>
            <DialogTitle className="text-2xl font-bold">Choose Your Plan</DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600 max-w-lg mx-auto">
            {trialInfo.isActive 
              ? `Your free trial ends in ${trialInfo.daysRemaining} days. Upgrade now to continue enjoying TicketEase.`
              : 'Unlock the full power of TicketEase with advanced features and priority support.'
            }
          </DialogDescription>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-[#2ECC71]"
            />
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  <Sparkles className="h-2 w-2 mr-1" />
                  Save 20%
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const originalPrice = isYearly ? plan.price.monthly : undefined;

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                  plan.popular 
                    ? 'border-[#2ECC71] shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#2ECC71] text-white px-3 py-1 text-xs shadow-sm">
                      <Star className="h-2 w-2 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    plan.color === 'green' ? 'bg-[#2ECC71]/10 text-[#2ECC71]' :
                    plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-2xl font-bold text-gray-900">${price}</span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                    {isYearly && originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        ${originalPrice}/mo monthly
                      </p>
                    )}
                  </div>
                </div>

                {/* Compact Features List */}
                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-2 w-2 text-[#2ECC71]" />
                      </div>
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full text-sm py-2 ${
                    plan.popular 
                      ? 'btn-cta-primary' 
                      : 'btn-cta-secondary'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Upgrade via Stripe</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <span>Questions? </span>
            <button 
              onClick={handleLearnMore}
              className="text-[#2ECC71] hover:text-[#27AE60] font-medium hover:underline"
            >
              Learn more about plans
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowUpgradeModal(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleLearnMore}
              className="btn-cta-secondary"
            >
              Compare Plans
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="border-t pt-4 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 Secure checkout via Stripe</span>
            <span>💳 Cancel anytime</span>
            <span>📞 24/7 support included</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}