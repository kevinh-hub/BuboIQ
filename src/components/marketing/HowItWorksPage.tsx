import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Network, Ticket, Shield, Brain, Wrench, BookOpen, CheckCircle, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onTryItNow }) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mspWorkflow = [
    {
      number: '01',
      title: 'Set up tracking',
      subtitle: 'Watch all clients',
      icon: <Network className="w-8 h-8" />,
      description: 'Install small programs on client computers. Each client\'s data stays private while you get insights across all of them.',
      details: [
        { label: 'Easy install', value: 'One click per client' },
        { label: 'Auto-find computers', value: 'Maps everything' },
        { label: 'Keep data separate', value: '100% private' },
        { label: 'Your brand', value: 'White-label ready' }
      ],
      gradient: 'from-iq-neon-green/20 to-cyan-accent/10',
      iconColor: 'text-iq-neon-green',
      borderColor: 'border-iq-neon-green/30'
    },
    {
      number: '02',
      title: 'Watch for problems',
      subtitle: 'Spot issues early',
      icon: <Brain className="w-8 h-8" />,
      description: 'The system watches all computers constantly, finding patterns and catching problems before users notice. What you fix for one client helps protect all your other clients.',
      details: [
        { label: 'Find patterns', value: 'Checks constantly' },
        { label: 'Early warnings', value: 'Before things break' },
        { label: 'Learn from all clients', value: 'Protect everyone' },
        { label: 'Know what\'s normal', value: 'Per client' }
      ],
      gradient: 'from-electric-blue/20 to-prediction-purple/10',
      iconColor: 'text-electric-blue',
      borderColor: 'border-electric-blue/30'
    },
    {
      number: '03',
      title: 'Create issues',
      subtitle: 'All info included',
      icon: <Ticket className="w-8 h-8" />,
      description: 'Serious problems become issues automatically with all the computer info, how bad it is, and who it affects already filled in.',
      details: [
        { label: 'Auto-create', value: 'For big problems' },
        { label: 'Computer history', value: 'Everything included' },
        { label: 'How urgent', value: 'System decides' },
        { label: 'Who it affects', value: 'Per client' }
      ],
      gradient: 'from-cyan-accent/20 to-iq-neon-green/10',
      iconColor: 'text-cyan-accent',
      borderColor: 'border-cyan-accent/30'
    },
    {
      number: '04',
      title: 'Send to the right person',
      subtitle: 'Match skills',
      icon: <Shield className="w-8 h-8" />,
      description: 'Issues go to techs who know how to fix them and have time. Nobody gets overwhelmed.',
      details: [
        { label: 'Match skills', value: 'Best tech gets it' },
        { label: 'Share the work', value: 'Fair for everyone' },
        { label: 'Pass it up', value: 'Auto-escalate' },
        { label: 'Client wants', value: 'Always respected' }
      ],
      gradient: 'from-signal-yellow/20 to-amber-warning/10',
      iconColor: 'text-signal-yellow',
      borderColor: 'border-signal-yellow/30'
    },
    {
      number: '05',
      title: 'Fix remotely',
      subtitle: 'Secure access',
      icon: <Wrench className="w-8 h-8" />,
      description: 'Connect to client computers with two-factor login, user permission, session recording, and permanent audit logs. Compliance built-in.',
      details: [
        { label: 'Two-factor login', value: 'Every time' },
        { label: 'User says yes', value: 'Saved & logged' },
        { label: 'Record sessions', value: 'Full playback' },
        { label: 'Audit trails', value: 'Can\'t be deleted' }
      ],
      gradient: 'from-prediction-purple/20 to-electric-blue/10',
      iconColor: 'text-prediction-purple',
      borderColor: 'border-prediction-purple/30'
    },
    {
      number: '06',
      title: 'Save what works',
      subtitle: 'Share knowledge',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Every fix you do gets saved and shared across your whole MSP. The system suggests fixes based on what worked for other clients.',
      details: [
        { label: 'Fix library', value: 'All your clients' },
        { label: 'Smart suggestions', value: 'Knows the context' },
        { label: 'Auto-save steps', value: 'Writes itself' },
        { label: 'Train faster', value: 'New techs ramp up quick' }
      ],
      gradient: 'from-amber-warning/20 to-signal-yellow/10',
      iconColor: 'text-amber-warning',
      borderColor: 'border-amber-warning/30'
    }
  ];

  // Scroll-based step activation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveStep(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        \n        {/* HERO ORB - DeviceNetworkOrb Centerpiece - AT THE TOP */}
        <div className="relative z-[25] pointer-events-none mb-8 md:mb-12 flex justify-center">
          <DeviceNetworkOrb 
            size={400} 
            className="bubo-animate-float" 
            isHomePage={true}
          />
        </div>
        
        {/* Vertical FieldLines Guide Orb - Workflow Identity */}
        <OrbSystem
          variantType="FieldLines"
          sizeToken="S"
          placement="MidLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Scroll"
          density={5}
          glow={2}
          className="opacity-60 hidden lg:block"
        />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-8 text-sm px-6 py-2">
            Complete MSP Workflow
          </Badge>

          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
            6 Steps from <span className="text-iq-neon-green bubo-neon-text-green">Alert to Resolution</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Scroll through the complete operational story: how <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> transforms MSP operations from reactive firefighting to proactive intelligence.
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

      {/* Sticky Timeline Navigation */}
      <div className="sticky top-16 z-30 bg-dark-midnight/95 backdrop-blur-xl border-b border-iq-neon-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {mspWorkflow.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`flex flex-col items-center min-w-[100px] px-4 py-2 transition-all duration-300 ${
                  activeStep === index
                    ? 'text-iq-neon-green'
                    : 'text-mist-gray hover:text-cloud-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                  activeStep === index
                    ? `bg-iq-neon-green/20 ${step.borderColor} border-2`
                    : 'bg-surface-dark/50 border border-slate-gray/30'
                }`}>
                  <span className={`text-sm font-bold ${activeStep === index ? step.iconColor : 'text-mist-gray'}`}>
                    {step.number}
                  </span>
                </div>
                <span className="text-xs font-['Space_Grotesk'] font-medium text-center hidden md:block">
                  {step.title}
                </span>
              </button>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 h-1 bg-slate-gray/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-iq-neon-green via-electric-blue to-cyan-accent transition-all duration-500"
              style={{ width: `${((activeStep + 1) / mspWorkflow.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-32">
          {mspWorkflow.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className="relative"
            >
              <Card className={`bubo-glass p-8 md:p-12 border-2 ${step.borderColor} hover:scale-[1.02] transition-all duration-500 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Step Header with Inline Badge Orb */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl bg-dark-midnight/80 flex items-center justify-center ${step.iconColor} border-2 ${step.borderColor}`}>
                          {step.icon}
                        </div>
                        {/* XS Inline Badge Orb - Lights up when active */}
                        {activeStep === index && (
                          <div className="absolute -top-2 -right-2">
                            <OrbSystem
                              variantType="Sphere"
                              sizeToken="XS"
                              placement="InlineBadge"
                              zLayer="Fore"
                              tint="Base"
                              motionProfile="Focus"
                              glow={2}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`text-sm font-['JetBrains_Mono'] ${step.iconColor} font-bold`}>
                            STEP {step.number}
                          </span>
                          <div className="h-4 w-px bg-slate-gray/30" />
                          <span className="text-sm text-mist-gray">{step.subtitle}</span>
                        </div>
                        <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white">
                          {step.title}
                        </h2>
                      </div>
                    </div>
                    
                    {activeStep === index && (
                      <Badge className={`${step.iconColor} border-${step.iconColor.replace('text-', '')}/30 bg-${step.iconColor.replace('text-', '')}/10`}>
                        Active
                      </Badge>
                    )}
                  </div>

                  {/* Step Description */}
                  <p className="text-lg text-cloud-white mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-3 p-4 rounded-xl bg-dark-midnight/40 border border-slate-gray/20 hover:border-iq-neon-green/30 transition-colors">
                        <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-['Space_Grotesk'] font-semibold text-pure-white text-sm mb-1">
                            {detail.label}
                          </p>
                          <p className="text-sm text-mist-gray">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${step.iconColor.replace('text-', '')} to-transparent opacity-50`} />
              </Card>

              {/* Connector Line (except for last step) */}
              {index < mspWorkflow.length - 1 && (
                <div className="flex justify-center my-12">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-px h-16 bg-gradient-to-b from-iq-neon-green/50 to-transparent" />
                    <Bell className="w-5 h-5 text-iq-neon-green animate-pulse" />
                    <div className="w-px h-16 bg-gradient-to-b from-transparent to-iq-neon-green/50" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Summary */}


      {/* Directional CTA Rail */}
      <section className="bubo-cta-rail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Ready for the Deep Dive?
          </h2>
          <p className="font-inter text-lg text-cloud-white mb-12 max-w-2xl mx-auto">
            Explore every capability in detail—from intelligence to compliance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => onNavigate('features')}
              className="bubo-btn-neon-primary text-xl px-12 py-6 group"
            >
              <span className="relative z-10 flex items-center">
                Next: Features Deep Dive
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