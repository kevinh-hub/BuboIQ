import React from 'react';
import { Check, Lock, Star, Shield, Building2, Monitor, Zap, Crown } from 'lucide-react';
import { Badge } from '../ui/badge';

export const ComparePlansSection: React.FC = () => {
  const comparisonPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 19,
      icon: Zap,
      color: 'signal-blue',
      description: 'Perfect for small teams',
      features: [
        { name: 'Computers Included', value: '10 computers', included: true },
        { name: 'Issue Tracking', value: 'Basic auto-ticketing + monitoring', included: true },
        { name: 'Smart AI Help', value: 'Manual operations only', included: false, locked: true },
        { name: 'Remote Access', value: 'Not included', included: false, locked: true },
        { name: 'Compliance & Security', value: 'Basic system monitoring', included: false, locked: true },
        { name: 'Support Level', value: 'Community forum + email', included: true },
        { name: 'Dedicated Manager', value: 'Not included', included: false, locked: true }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      icon: Zap,
      color: 'iq-neon-green',
      description: 'Growing IT operations',
      badge: 'Most Popular',
      features: [
        { name: 'Computers Included', value: '50 computers', included: true },
        { name: 'Issue Tracking', value: 'Smart auto-categorization + routing', included: true },
        { name: 'Smart AI Help', value: 'AI knowledge search + fix suggestions', included: true },
        { name: 'Remote Access', value: 'BuboIQ Connect sessions included', included: true },
        { name: 'Compliance & Security', value: 'Full audit logs only in Team', included: false, teamOnly: true },
        { name: 'Support Level', value: 'Priority email + phone', included: true },
        { name: 'Dedicated Manager', value: 'Only available in Team plan', included: false, teamOnly: true }
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: 149,
      icon: Crown,
      color: 'prediction-purple',
      description: 'Enterprise Ready',
      badge: 'Enterprise',
      features: [
        { name: 'Computers Included', value: '150 computers', included: true },
        { name: 'Issue Tracking', value: 'Smart AI + custom workflows', included: true },
        { name: 'Smart AI Help', value: 'Enterprise AI + compliance automation', included: true },
        { name: 'Remote Access', value: 'BuboIQ Connect Pro + session recording', included: true },
        { name: 'Compliance & Security', value: 'Full audit trails + compliance reports', included: true },
        { name: 'Support Level', value: 'Enterprise SLA + priority', included: true },
        { name: 'Dedicated Manager', value: 'Personal success manager assigned', included: true }
      ]
    }
  ];

  const renderFeature = (feature: any) => {
    if (feature.included) {
      return (
        <div className="flex items-start space-x-3">
          <Check className="w-5 h-5 text-iq-neon-green mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-inter text-cloud-white/90 text-lg">
              {feature.value}
            </div>
          </div>
        </div>
      );
    }
    
    if (feature.locked) {
      return (
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-mist-gray mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-inter text-mist-gray text-lg">
              {feature.value}
            </div>
          </div>
        </div>
      );
    }
    
    if (feature.teamOnly) {
      return (
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-prediction-purple/20 rounded border border-prediction-purple/40 flex items-center justify-center mt-1">
            <Lock className="w-3 h-3 text-prediction-purple" />
          </div>
          <div className="flex-1">
            <div className="font-inter text-mist-gray text-lg">
              {feature.value}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-20 border-t border-slate-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
            What's the difference between <span className="text-iq-neon-green">plans</span>?
          </h2>
          <p className="font-inter text-xl text-mist-gray leading-relaxed">
            Simple comparison for business owners. Choose what fits your team's needs.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comparisonPlans.map((plan) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.id}
                className={`relative p-10 rounded-3xl border backdrop-blur-sm hover:scale-105 transition-all duration-500 ${
                  plan.badge === 'Most Popular'
                    ? 'bubo-glass-bright border-iq-neon-green/40 shadow-2xl' 
                    : 'bubo-glass border-slate-gray/30 hover:border-iq-neon-green/30'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-iq-neon-green text-dark-midnight px-4 py-2 font-semibold">
                      <Star className="w-4 h-4 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="text-center space-y-6 mb-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`w-16 h-16 bg-${plan.color}/20 rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${plan.color}`} />
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="font-inter text-lg text-mist-gray max-w-xs mx-auto leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-['Space_Grotesk'] font-bold text-pure-white">
                        ${plan.price}
                      </span>
                      <div className="text-left">
                        <div className="text-mist-gray text-lg">/month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6 mb-10">
                  {plan.features.map((feature, index) => (
                    <div key={index}>
                      <div className="font-['Space_Grotesk'] font-medium text-pure-white text-sm mb-3 text-left">
                        {feature.name}
                      </div>
                      {renderFeature(feature)}
                    </div>
                  ))}
                </div>

                {/* Team Plan Special Icons */}
                {plan.id === 'team' && (
                  <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-gray/20">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-prediction-purple" />
                      <span className="text-sm text-mist-gray">Enterprise Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-prediction-purple" />
                      <span className="text-sm text-mist-gray">Multi-Site Ready</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};