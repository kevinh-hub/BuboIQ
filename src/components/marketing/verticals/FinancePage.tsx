import React from 'react';
import { Shield, Lock, FileCheck, CreditCard, ArrowRight, CheckCircle, AlertTriangle, Activity, Database } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { OrbSystem } from '../OrbSystem';
import { useStaggerReveal } from '../../../hooks/useScrollReveal';

interface FinancePageProps {
  onNavigate: (page: string) => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({ onNavigate }) => {
  const featuresRef = useStaggerReveal();
  const capabilitiesRef = useStaggerReveal();

  const keyFeatures = [
    {
      icon: <CreditCard className="w-7 h-7" />,
      title: 'PCI-DSS ready',
      description: 'Protect card data with network separation and access controls',
      color: 'iq-neon-green'
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'SOC 2 proof',
      description: 'Auto-collect control evidence for Type II audits',
      color: 'electric-blue'
    },
    {
      icon: <Lock className="w-7 h-7" />,
      title: 'Data encryption',
      description: 'Encrypt financial data when stored and when sent',
      color: 'signal-yellow'
    }
  ];

  const complianceCapabilities = [
    {
      title: 'PCI-DSS Requirements',
      icon: <CreditCard className="w-6 h-6" />,
      items: [
        'Keep card networks separate',
        'Control who accesses what',
        'Watch card data zones',
        'Quarterly reports'
      ],
      gradient: 'from-iq-neon-green/20 to-cyan-accent/10',
      borderColor: 'border-iq-neon-green/30'
    },
    {
      title: 'SOC 2 Controls',
      icon: <Shield className="w-6 h-6" />,
      items: [
        'Auto security controls',
        'Always-on compliance checks',
        'Collect and keep evidence',
        'Audit-ready docs'
      ],
      gradient: 'from-electric-blue/20 to-prediction-purple/10',
      borderColor: 'border-electric-blue/30'
    },
    {
      title: 'Financial Data Security',
      icon: <Database className="w-6 h-6" />,
      items: [
        'Encrypted storage (AES-256)',
        'Secure sending (TLS 1.3)',
        'Log all access',
        'Control how long to keep data'
      ],
      gradient: 'from-signal-yellow/20 to-amber-warning/10',
      borderColor: 'border-signal-yellow/30'
    },
    {
      title: 'Incident Response',
      icon: <AlertTriangle className="w-6 h-6" />,
      items: [
        'Auto-find breaches',
        'Step-by-step response',
        'Forensic evidence preservation',
        'Regulatory notification automation'
      ],
      gradient: 'from-prediction-purple/20 to-electric-blue/10',
      borderColor: 'border-prediction-purple/30'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Finance Intelligence Orbs - Gold Precision Tint */}
        <OrbSystem
          variantType="FieldLines"
          sizeToken="L"
          placement="EdgeBleed"
          zLayer="MidGlass"
          tint="Finance"
          motionProfile="Scroll"
          density={5}
          glow={3}
          className="opacity-60"
        />
        <OrbSystem
          variantType="HoloGrid"
          sizeToken="M"
          placement="TopLeft"
          zLayer="MidGlass"
          tint="Finance"
          motionProfile="Idle"
          density={4}
          glow={2}
          className="opacity-50"
        />
        
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 mb-8 text-sm px-6 py-2">
            Financial Services & Banking
          </Badge>

          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
            MSPs Trust <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> for
            <br />
            <span className="text-electric-blue bubo-neon-text-blue">Financial Compliance</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-8 max-w-3xl mx-auto leading-relaxed">
            PCI-DSS, SOC 2, and financial data protection—engineered for MSPs managing banks, credit unions, payment processors, and fintech companies.
          </p>

          <p className="text-sm text-mist-gray mb-12">
            Managing regulated financial clients? <a href="https://kevinhaskins.com" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:text-cyan-accent transition-colors underline decoration-electric-blue/30">Get MSP-grade compliance support →</a>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-neon-primary text-lg px-10 py-5 group">
              <span className="relative z-10 flex items-center">
                See MSP Plans
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <a
              href="https://kevinhaskins.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-electric-blue hover:text-cyan-accent transition-colors font-medium"
            >
              Talk to an MSP Expert
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Key Features */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-4">
              Financial-Grade Security
            </h2>
            <p className="bubo-scroll-reveal-stagger text-lg text-cloud-white max-w-3xl mx-auto">
              Built-in safeguards for managing banks, payment processors, and financial institutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card 
                key={index}
                className={`bubo-scroll-reveal-stagger bubo-glass p-8 hover:scale-105 transition-all duration-500 border-2 border-${feature.color}/20 hover:border-${feature.color}/40 group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-dark-midnight/80 rounded-2xl flex items-center justify-center text-${feature.color} border border-${feature.color}/20 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  
                  <p className="text-cloud-white text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Capabilities */}
      <section ref={capabilitiesRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-nocturne-indigo/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bubo-scroll-reveal-stagger bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-6 text-sm px-6 py-2">
              PCI-DSS · SOC 2 · GLBA Ready
            </Badge>
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              Complete Compliance Framework
            </h2>
            <p className="bubo-scroll-reveal-stagger text-xl text-cloud-white max-w-3xl mx-auto">
              Everything MSPs need to manage regulated financial clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {complianceCapabilities.map((capability, index) => (
              <Card 
                key={index}
                className={`bubo-scroll-reveal-stagger bubo-glass p-8 border-2 ${capability.borderColor} hover:scale-105 transition-all duration-500 group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-dark-midnight/80 flex items-center justify-center text-iq-neon-green border border-iq-neon-green/20 group-hover:scale-110 transition-transform">
                      {capability.icon}
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
                      {capability.title}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {capability.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                        <span className="text-cloud-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Directional CTA Rail */}
      <section className="bubo-cta-rail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Ready for Financial-Grade IT Security?
          </h2>
          <p className="font-inter text-lg text-cloud-white mb-12 max-w-2xl mx-auto">
            See MSP plans with Security & Compliance Pack
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => onNavigate('pricing')}
              className="bubo-btn-neon-primary text-xl px-12 py-6 group"
            >
              <span className="relative z-10 flex items-center">
                View MSP Plans
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <a
              href="https://kevinhaskins.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-electric-blue hover:text-cyan-accent transition-colors font-medium"
            >
              Need compliance help? Consult with expert
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Final Section Divider */}
      <div className="bubo-section-divider" />
    </div>
  );
};