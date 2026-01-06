import React from 'react';
import { Shield, Lock, FileCheck, Building, ArrowRight, CheckCircle, Users, Activity, Database } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { OrbSystem } from '../OrbSystem';
import { useStaggerReveal } from '../../../hooks/useScrollReveal';

interface SLEDPageProps {
  onNavigate: (page: string) => void;
}

export const SLEDPage: React.FC<SLEDPageProps> = ({ onNavigate }) => {
  const featuresRef = useStaggerReveal();
  const capabilitiesRef = useStaggerReveal();

  const keyFeatures = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'CJIS compliance',
      description: 'Criminal Justice Information Services security compliance',
      color: 'iq-neon-green'
    },
    {
      icon: <Building className="w-7 h-7" />,
      title: 'FedRAMP ready',
      description: 'Federal risk authorization framework proof and controls',
      color: 'electric-blue'
    },
    {
      icon: <Lock className="w-7 h-7" />,
      title: 'Public records',
      description: 'Handle FOIA requests and protect citizen data',
      color: 'signal-yellow'
    }
  ];

  const complianceCapabilities = [
    {
      title: 'CJIS Requirements',
      icon: <Shield className="w-6 h-6" />,
      items: [
        'Strong login (CJIS 5.6)',
        'Control who can access what',
        'Track who did what',
        'Physical security controls'
      ],
      gradient: 'from-iq-neon-green/20 to-cyan-accent/10',
      borderColor: 'border-iq-neon-green/30'
    },
    {
      title: 'FedRAMP Controls',
      icon: <FileCheck className="w-6 h-6" />,
      items: [
        'Always-on monitoring (ConMon)',
        'NIST 800-53 controls',
        'Auto-collect proof',
        'Track and fix POA&Ms'
      ],
      gradient: 'from-electric-blue/20 to-prediction-purple/10',
      borderColor: 'border-electric-blue/30'
    },
    {
      title: 'Citizen Data Protection',
      icon: <Users className="w-6 h-6" />,
      items: [
        'Flag personal info (PII)',
        'Auto-handle FOIA requests',
        'Control how long to keep records',
        'Redact and control what gets shared'
      ],
      gradient: 'from-signal-yellow/20 to-amber-warning/10',
      borderColor: 'border-signal-yellow/30'
    },
    {
      title: 'Government Security',
      icon: <Lock className="w-6 h-6" />,
      items: [
        '2-factor login (MFA)',
        'Encrypt data stored and sent',
        'Incident response and reporting',
        'Disaster recovery planning'
      ],
      gradient: 'from-prediction-purple/20 to-electric-blue/10',
      borderColor: 'border-prediction-purple/30'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* SLED Intelligence Orbs - Teal Authority Tint */}
        <OrbSystem
          variantType="HoloGrid"
          sizeToken="L"
          placement="MidLeft"
          zLayer="MidGlass"
          tint="SLED"
          motionProfile="Idle"
          density={5}
          glow={2}
          className="opacity-60"
        />
        <OrbSystem
          variantType="Constellation"
          sizeToken="M"
          placement="BottomRight"
          zLayer="MidGlass"
          tint="SLED"
          motionProfile="Scroll"
          density={4}
          glow={2}
          className="opacity-65"
        />
        
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-8 text-sm px-6 py-2">
            State · Local · Education · Federal
          </Badge>

          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
            MSPs Use <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> for
            <br />
            <span className="text-electric-blue bubo-neon-text-blue">Government IT</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-8 max-w-3xl mx-auto leading-relaxed">
            CJIS, FedRAMP, and public sector compliance—engineered for MSPs managing state/local governments, law enforcement, schools, and federal contractors.
          </p>

          <p className="text-sm text-mist-gray mb-12">
            Managing government agencies? <a href="https://kevinhaskins.com" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:text-cyan-accent transition-colors underline decoration-electric-blue/30">Get MSP-grade public sector support →</a>
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
              Government-Grade Security
            </h2>
            <p className="bubo-scroll-reveal-stagger text-lg text-cloud-white max-w-3xl mx-auto">
              Built for managing public sector agencies with strict compliance requirements
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
            <Badge className="bubo-scroll-reveal-stagger bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-6 text-sm px-6 py-2">
              CJIS · FedRAMP · NIST 800-53 Ready
            </Badge>
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              Complete Public Sector Toolkit
            </h2>
            <p className="bubo-scroll-reveal-stagger text-xl text-cloud-white max-w-3xl mx-auto">
              Everything MSPs need to manage government and education clients
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
            Ready for Public Sector IT Operations?
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
              Need government IT expertise? Consult with expert
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