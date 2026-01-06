import React, { useRef, useState } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, X, Zap, Brain, Shield, Clock, TrendingUp, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';
import { useStaggerReveal } from '../../hooks/useScrollReveal';

interface WhyPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
}

export const WhyPage: React.FC<WhyPageProps> = ({ onNavigate, onTryItNow }) => {
  const comparisonRef = useStaggerReveal();
  const benefitsRef = useStaggerReveal();
  const [isHoveringComparison, setIsHoveringComparison] = useState(false);

  const traditionalProblems = [
    {
      icon: <Clock className="w-5 h-5" />,
      problem: 'Always reacting',
      description: 'You find out about problems when users complain'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      problem: 'Charges per tech',
      description: 'Costs go up when you hire, not when you grow clients'
    },
    {
      icon: <X className="w-5 h-5" />,
      problem: 'Not built for MSPs',
      description: 'Made for one company, not for managing many clients'
    },
    {
      icon: <X className="w-5 h-5" />,
      problem: 'Manual compliance',
      description: 'Audit proof is scattered everywhere'
    }
  ];

  const buboiqSolutions = [
    {
      icon: <Brain className="w-5 h-5" />,
      solution: 'Catches problems early',
      description: 'Spots issues before users notice',
      color: 'iq-neon-green'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      solution: 'Charges per computer',
      description: 'Costs grow with clients, not with your team size',
      color: 'electric-blue'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      solution: 'Built for MSPs',
      description: 'Made to handle hundreds of clients',
      color: 'cyan-accent'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      solution: 'Auto compliance',
      description: 'Export audit proof with one click',
      color: 'signal-yellow'
    }
  ];

  const keyBenefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Grow without hiring',
      description: 'The system handles basic sorting and routing, so your team can focus on real fixes instead of reacting to alerts',
      gradient: 'from-iq-neon-green/20 to-cyan-accent/10'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Learn from all clients',
      description: 'When you fix something for one client, the system protects all your other clients from the same problem',
      gradient: 'from-electric-blue/20 to-prediction-purple/10'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Win bigger contracts',
      description: 'Get auto-generated proof for HIPAA, SOC 2, and PCI audits. Pursue regulated clients without hiring consultants',
      gradient: 'from-signal-yellow/20 to-amber-warning/10'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        {/* HERO ORB - DeviceNetworkOrb Centerpiece - AT THE TOP */}
        <div className="relative z-[25] pointer-events-none mb-8 md:mb-12 flex justify-center">
          <DeviceNetworkOrb 
            size={400} 
            className="bubo-animate-float" 
            isHomePage={true}
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-8 text-sm px-6 py-2">
            The Rational Case for BuboIQ
          </Badge>

          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
            Scale Your MSP <span className="text-iq-neon-green bubo-neon-text-green relative">
              Without Adding Headcount
            </span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Traditional IT tools were built for single companies. <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> was engineered from day one for MSPs managing hundreds of clients simultaneously.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-neon-primary text-lg px-10 py-5 group">
              <span className="relative z-10 flex items-center">
                See MSP Plans
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button onClick={onTryItNow} className="bubo-btn-secondary text-lg px-10 py-5">
              Try Interactive Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Platform Philosophy - Why We Built This */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-6 text-sm px-6 py-2">
              Engineering Philosophy
            </Badge>
            <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              Why We Built <span className="text-white">BUBO</span><span className="text-[#00FF85]\">IQ</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* The Problem */}
            <div className="bubo-glass p-8 rounded-2xl border border-crimson-danger/20">
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-crimson-danger mb-6">
                The MSP Tax
              </h3>
              <div className="space-y-4 text-cloud-white">
                <p>
                  Traditional IT platforms charge <strong className="text-pure-white">per technician</strong>. This creates a fundamental conflict: your costs increase when you hire, but your revenue only grows when you <em>land more clients</em>.
                </p>
                <p>
                  Worse, these tools were designed for single companies managing their own infrastructure—not MSPs juggling hundreds of isolated client environments.
                </p>
                <p className="text-mist-gray italic">
                  The result? MSPs either overpay for bloated enterprise licenses or cobble together 6+ single-tenant tools.
                </p>
              </div>
            </div>

            {/* The Solution */}
            <div className="bubo-glass p-8 rounded-2xl border border-iq-neon-green/30">
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-iq-neon-green mb-6">
                Per-Device Economics
              </h3>
              <div className="space-y-4 text-cloud-white">
                <p>
                  <span className="text-white">BUBO</span><span className="text-[#00FF85]\">IQ</span> flips the model. You pay <strong className="text-pure-white">per monitored endpoint</strong>, not per seat.
                </p>
                <p>
                  That means your platform costs scale <em>with revenue growth</em>, not headcount. Win 50 new clients? Your monitoring costs increase proportionally—but your technician salaries don't.
                </p>
                <p className="text-iq-neon-green font-medium">
                  Multi-tenant by design. Cross-client intelligence built-in. One platform, unlimited scalability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Industry Context */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-nocturne-indigo/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              The MSP Scalability Crisis
            </h2>
            <p className="text-xl text-cloud-white max-w-3xl mx-auto">
              Most MSPs hit a ceiling around 8-12 technicians. Here's why—and how BuboIQ changes the equation.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bubo-glass p-8 border-2 border-electric-blue/20">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 flex-shrink-0 bg-electric-blue/20 rounded-xl flex items-center justify-center text-electric-blue">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-3">
                    Reactive Support Doesn't Scale
                  </h3>
                  <p className="text-cloud-white leading-relaxed">
                    Traditional RMM tools tell you when something <em>breaks</em>. By then, your client is already calling. L1 techs spend 60%+ of their time on ticket triage instead of strategic work. BuboIQ's predictive engine catches issues <strong className="text-pure-white">before users notice</strong>, reducing inbound volume by design.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bubo-glass p-8 border-2 border-iq-neon-green/20">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 flex-shrink-0 bg-iq-neon-green/20 rounded-xl flex items-center justify-center text-iq-neon-green">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-3">
                    Learning Compounds Across Clients
                  </h3>
                  <p className="text-cloud-white leading-relaxed">
                    Every issue solved for Client A creates protection for Clients B through Z. Traditional tools treat each customer as an island. BuboIQ's cross-tenant intelligence means your <strong className="text-pure-white">entire portfolio gets smarter</strong> with each incident—without violating data isolation.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bubo-glass p-8 border-2 border-signal-yellow/20">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 flex-shrink-0 bg-signal-yellow/20 rounded-xl flex items-center justify-center text-signal-yellow">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-3">
                    Compliance Is a Revenue Unlock
                  </h3>
                  <p className="text-cloud-white leading-relaxed">
                    Healthcare, finance, and legal verticals require HIPAA, SOC 2, or PCI-DSS evidence. Most MSPs turn away these contracts because audit prep is manual torture. BuboIQ auto-generates <strong className="text-pure-white">compliance evidence per client</strong>, turning regulatory burden into competitive advantage.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Side-by-Side Comparison */}
      <section ref={comparisonRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Dual Tension Orbs - Traditional (Left) vs BuboIQ (Right) */}
        <OrbSystem
          variantType="Constellation"
          sizeToken="M"
          placement="MidLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Idle"
          density={4}
          glow={1}
          className="opacity-50 hidden lg:block"
        />
        <OrbSystem
          variantType="HaloRing"
          sizeToken="M"
          placement="MidRight"
          zLayer="MidGlass"
          tint="Base"
          motionProfile={isHoveringComparison ? "Focus" : "Idle"}
          glow={3}
          className="opacity-70 hidden lg:block"
          onHover={isHoveringComparison}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-4">
              Traditional IT Tools vs. <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>
            </h2>
            <p className="bubo-scroll-reveal-stagger text-lg text-cloud-white max-w-3xl mx-auto">
              See why MSPs are switching from reactive tools to proactive intelligence
            </p>
          </div>

          {/* Comparison Grid */}
          <div 
            className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            onMouseEnter={() => setIsHoveringComparison(true)}
            onMouseLeave={() => setIsHoveringComparison(false)}
          >
            {/* Traditional Approach */}
            <Card className="bubo-scroll-reveal-stagger bubo-glass p-8 border-2 border-crimson-danger/30 relative overflow-hidden bubo-orb-lit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-danger/5 rounded-full blur-2xl" />
              
              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-crimson-danger/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-crimson-danger" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-crimson-danger mb-2">
                  Traditional Approach
                </h3>
                <p className="text-mist-gray">Reactive, per-tech licensing</p>
              </div>

              <div className="space-y-4 relative z-10">
                {traditionalProblems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-crimson-danger/5 border border-crimson-danger/10">
                    <div className="w-8 h-8 flex items-center justify-center text-crimson-danger mt-0.5 flex-shrink-0 bg-crimson-danger/10 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-['Space_Grotesk'] font-semibold text-pure-white mb-1">{item.problem}</p>
                      <p className="text-sm text-mist-gray">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* BuboIQ Solution */}
            <Card className="bubo-scroll-reveal-stagger bubo-glass p-8 border-2 border-iq-neon-green/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-iq-neon-green/10 rounded-full blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-iq-neon-green/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-iq-neon-green/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-iq-neon-green" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-iq-neon-green mb-2">
                  <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>
                </h3>
                <p className="text-cloud-white">Proactive, per-device pricing</p>
              </div>

              <div className="space-y-4 relative z-10">
                {buboiqSolutions.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-iq-neon-green/5 border border-iq-neon-green/20 hover:border-iq-neon-green/40 transition-all duration-300 group">
                    <div className={`w-8 h-8 flex items-center justify-center text-${item.color} mt-0.5 flex-shrink-0 bg-${item.color}/10 rounded-lg group-hover:bg-${item.color}/20 transition-colors`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-['Space_Grotesk'] font-semibold text-pure-white mb-1">{item.solution}</p>
                      <p className="text-sm text-cloud-white">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Glow Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent" />
            </Card>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Honest Proof Points */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-6 text-sm px-6 py-2">
              Business Benefits
            </Badge>
            <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              Real Advantages, Zero Hype
            </h2>
            <p className="text-xl text-cloud-white max-w-3xl mx-auto">
              We don't sell dreams. Here's what you actually get.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bubo-glass p-6 border border-electric-blue/20">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-electric-blue/20 text-electric-blue mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
                  Predictable Unit Economics
                </h3>
              </div>
              <p className="text-cloud-white text-center leading-relaxed">
                Per-device pricing means platform costs scale with revenue, not payroll. Add clients without adding licenses.
              </p>
            </Card>

            <Card className="bubo-glass p-6 border border-iq-neon-green/20">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-iq-neon-green/20 text-iq-neon-green mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
                  Portfolio-Wide Learning
                </h3>
              </div>
              <p className="text-cloud-white text-center leading-relaxed">
                Multi-tenant architecture eliminates per-client instance overhead. One deployment, hundreds of isolated environments.
              </p>
            </Card>

            <Card className="bubo-glass p-6 border border-signal-yellow/20">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-signal-yellow/20 text-signal-yellow mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
                  Compliance-Ready Out of Box
                </h3>
              </div>
              <p className="text-cloud-white text-center leading-relaxed">
                HIPAA, SOC 2, PCI-DSS audit logs auto-generated. Win regulated contracts without hiring consultants.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section ref={benefitsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-nocturne-indigo/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bubo-scroll-reveal-stagger bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-6 text-sm px-6 py-2">
              Competitive Advantages
            </Badge>
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-6">
              Why MSPs Choose BuboIQ
            </h2>
            <p className="bubo-scroll-reveal-stagger text-xl text-cloud-white max-w-3xl mx-auto">
              Real advantages that translate to revenue growth and operational efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <Card 
                key={index}
                className="bubo-scroll-reveal-stagger bubo-glass p-8 hover:scale-105 transition-all duration-500 border-2 border-electric-blue/20 hover:border-electric-blue/40 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 bg-dark-midnight/80 rounded-2xl flex items-center justify-center text-iq-neon-green border border-iq-neon-green/20 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-4 text-center">
                    {benefit.title}
                  </h3>
                  
                  <p className="font-inter text-cloud-white text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Directional CTA Rail */}
      <section className="bubo-cta-rail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Convinced? See How It Works
          </h2>
          <p className="font-inter text-lg text-cloud-white mb-12 max-w-2xl mx-auto">
            Explore our complete 6-step MSP workflow from deployment to compliance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => onNavigate('how-it-works')}
              className="bubo-btn-neon-primary text-xl px-12 py-6 group"
            >
              <span className="relative z-10 flex items-center">
                Next: How It Works
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              onClick={() => onNavigate('pricing')}
              className="bubo-btn-ghost text-xl px-12 py-6"
            >
              Skip to Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Final Section Divider */}
      <div className="bubo-section-divider" />
    </div>
  );
};