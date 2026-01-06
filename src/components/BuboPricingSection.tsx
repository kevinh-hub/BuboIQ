import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Shield, Eye, Cpu, Users, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BuboPricingSectionProps {
  onGetStarted?: () => void;
}

const BuboPricingSection: React.FC<BuboPricingSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00FF85] 
                       bg-clip-text text-transparent"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            Simple, Intelligent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that scales with your team
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: 'Observer',
              price: '$49',
              period: '/month per agent',
              description: 'Perfect for small teams getting started',
              features: [
                'AI-powered ticket routing',
                'Basic analytics dashboard',
                'Email & chat support',
                'Up to 5 agents',
                '1,000 tickets/month'
              ],
              cta: 'Start Free Trial',
              popular: false
            },
            {
              name: 'Analyst',
              price: '$99',
              period: '/month per agent',
              description: 'Powerful intelligence for growing teams',
              features: [
                'Everything in Observer',
                'Predictive analytics',
                'Custom automation rules',
                'Advanced reporting',
                'Up to 25 agents',
                '5,000 tickets/month',
                'Priority support'
              ],
              cta: 'Start Free Trial',
              popular: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '/enterprise pricing',
              description: 'Full-scale intelligence for large organizations',
              features: [
                'Everything in Analyst',
                'Unlimited agents',
                'Unlimited tickets',
                'Custom integrations',
                'Dedicated success manager',
                'SLA guarantees',
                'On-premise deployment'
              ],
              cta: 'Contact Sales',
              popular: false
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
                plan.popular 
                  ? 'border-[#00FF85] bg-gradient-to-br from-[#00FF85]/10 to-[#00FFC6]/10 bubo-glow-green' 
                  : 'border-gray-600 bg-[#111827] hover:border-[#00FF85]/50'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#00FF85] text-[#0E1726] font-bold px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#00FF85]">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-gray-400 mb-8">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00FF85] flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStarted}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#00FF85] to-[#00FFC6] text-[#0E1726] hover:shadow-[0_0_40px_rgba(0,255,133,0.4)]'
                    : 'bg-transparent border border-[#00FF85]/30 text-[#00FF85] hover:bg-[#00FF85]/10 hover:border-[#00FF85]'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 pt-12 border-t border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <Shield className="w-6 h-6 text-[#00FF85]" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Eye className="w-6 h-6 text-[#00FF85]" />
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Cpu className="w-6 h-6 text-[#00FF85]" />
            <span>99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Users className="w-6 h-6 text-[#00FF85]" />
            <span>Slack Integration</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <BarChart3 className="w-6 h-6 text-[#00FF85]" />
            <span>Jira Compatible</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BuboPricingSection;