import React from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface PricingCardProps {
  variant: 'basic' | 'pro';
  onSelectPlan: (planId: string) => void;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  variant, 
  onSelectPlan,
  className = ''
}) => {
  const plans = {
    basic: {
      id: 'basic',
      name: 'Basic',
      price: 9,
      description: 'Perfect for small teams getting started',
      popular: false,
      features: [
        'Ticket intake via email',
        'Manual triage and assignment',
        'Basic status tracking',
        'Shared inbox (up to 3 agents)',
        '2 integrations included',
        'Community support'
      ]
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 49,
      description: 'The intelligence platform most teams choose',
      popular: true,
      features: [
        'Everything in Basic, plus:',
        'Automation rules',
        'AI-powered triage',
        'SLA dashboards & reports',
        'Unlimited integrations',
        'Role-based permissions',
        'Audit log',
        'Priority support'
      ]
    }
  };

  const plan = plans[variant];

  const handleSelectPlan = () => {
    // Track plan selection in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'select_plan', {
        plan_id: plan.id,
        source: 'pricing'
      });
    }
    
    onSelectPlan(plan.id);
  };

  return (
    <Card 
      className={`p-8 relative transition-all duration-300 ${
        plan.popular 
          ? 'bubo-glass-bright border-iq-neon-green/50 bubo-glow-green scale-105' 
          : 'bubo-glass border-border/30 hover:border-iq-neon-green/30'
      } ${className}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-iq-neon-green text-dark-midnight px-4 py-1 font-['Space_Grotesk'] font-bold">
            <Star className="w-3 h-3 mr-1" />
            Most Teams Choose Pro
          </Badge>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
          {plan.name}
        </h3>
        <p className="text-mist-gray text-sm mb-4">{plan.description}</p>
        
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-4xl font-bold text-pure-white font-['Space_Grotesk']">
            ${plan.price}
          </span>
          <span className="text-mist-gray">
            /mo
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
            <span className={`text-sm leading-relaxed ${
              index === 0 && variant === 'pro' 
                ? 'text-iq-neon-green font-medium' 
                : 'text-cloud-white'
            }`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button 
        onClick={handleSelectPlan}
        className={`w-full ${
          plan.popular 
            ? 'bubo-btn-neon-primary' 
            : 'bubo-btn-secondary'
        }`}
        size="lg"
      >
        {variant === 'basic' ? 'Start with Basic' : 'Choose Pro'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      
      <p className="text-center text-xs text-mist-gray mt-4">
        14-day free trial included
      </p>
    </Card>
  );
};