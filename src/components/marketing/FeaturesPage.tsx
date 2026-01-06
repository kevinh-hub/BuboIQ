import React, { useState } from 'react';
import { ArrowRight, Brain, Shield, Zap, Wrench, Network, Ticket, Monitor, BookOpen, CheckCircle, Clock, TrendingUp, Eye, Bell, Users, Activity, Lock, FileCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';
import { useStaggerReveal } from '../../hooks/useScrollReveal';
import { StreamlinedFeaturesPage } from './StreamlinedFeaturesPage';
import { EnhancedFeaturesPage } from './EnhancedFeaturesPage';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
  version?: 'streamlined' | 'enhanced' | 'original'; // Version selector
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, onTryItNow, version = 'streamlined' }) => {
  // Use streamlined version by default (no vanity metrics)
  if (version === 'streamlined') {
    return <StreamlinedFeaturesPage onNavigate={onNavigate} onTryItNow={onTryItNow} />;
  }
  
  // Enhanced version (has vanity metrics - deprecated)
  if (version === 'enhanced') {
    return <EnhancedFeaturesPage onNavigate={onNavigate} onTryItNow={onTryItNow} />;
  }
  
  // Original version below (kept as fallback)
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const bucketsRef = useStaggerReveal();

  const featureBuckets = [
    {
      id: 'intelligence',
      title: 'Intelligence',
      subtitle: 'AI-Powered Prediction',
      icon: <Brain className="w-10 h-10" />,
      description: 'Proactive monitoring with cross-client pattern detection and predictive analytics',
      gradient: 'from-iq-neon-green/20 to-cyan-accent/10',
      iconColor: 'text-iq-neon-green',
      borderColor: 'border-iq-neon-green/30',
      features: [
        {
          icon: <Eye className="w-5 h-5" />,
          name: 'Signal Detection',
          description: 'Real-time anomaly detection across all devices',
          tier: 'All Plans'
        },
        {
          icon: <Brain className="w-5 h-5" />,
          name: 'Pattern Learning',
          description: 'AI learns from your entire portfolio',
          tier: 'Pro & Team'
        },
        {
          icon: <Sparkles className="w-5 h-5" />,
          name: 'Predictive Alerts',
          description: 'Catch issues before they impact users',
          tier: 'Pro & Team'
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          name: 'Cross-Client Intelligence',
          description: 'Portfolio-wide pattern detection',
          tier: 'Team Only'
        },
        {
          icon: <Activity className="w-5 h-5" />,
          name: 'Baseline Detection',
          description: 'Per-environment normal behavior learning',
          tier: 'All Plans'
        },
        {
          icon: <Zap className="w-5 h-5" />,
          name: 'Auto-Remediation',
          description: 'Fix common issues automatically',
          tier: 'Pro & Team'
        }
      ]
    },
    {
      id: 'guided-fixes',
      title: 'Guided Fixes',
      subtitle: 'Resolve issues faster—with safety built in',
      icon: <Wrench className="w-10 h-10" />,
      description: 'One-click actions across Windows, macOS, and Linux with safety grades and auto-generated Knowledge Base articles',
      gradient: 'from-signal-yellow/20 to-iq-neon-green/10',
      iconColor: 'text-signal-yellow',
      borderColor: 'border-signal-yellow/30',
      features: [
        {
          icon: <Zap className="w-5 h-5" />,
          name: 'Cross-OS Actions',
          description: 'One-click fixes via Agent or Connect',
          tier: 'Pro & Team'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          name: 'Safety Grades',
          description: 'Every step labeled: Read-Only, Low, Risky, Destructive',
          tier: 'All Plans'
        },
        {
          icon: <CheckCircle className="w-5 h-5" />,
          name: 'Typed Confirms',
          description: 'Destructive actions require manual confirmation',
          tier: 'All Plans'
        },
        {
          icon: <BookOpen className="w-5 h-5" />,
          name: 'Auto-Draft KB',
          description: 'Successful fixes become Knowledge Base articles',
          tier: 'Pro & Team'
        },
        {
          icon: <Lock className="w-5 h-5" />,
          name: 'Team Controls',
          description: 'Approvals and policies for high-risk operations',
          tier: 'Team Only'
        },
        {
          icon: <Activity className="w-5 h-5" />,
          name: 'Live Console',
          description: 'Stream output with redaction and export',
          tier: 'Pro & Team'
        }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      subtitle: 'Tickets · Devices · SLA',
      icon: <Ticket className="w-10 h-10" />,
      description: 'Complete ticketing, device management, and SLA tracking for MSP workflows',
      gradient: 'from-electric-blue/20 to-prediction-purple/10',
      iconColor: 'text-electric-blue',
      borderColor: 'border-electric-blue/30',
      features: [
        {
          icon: <Ticket className="w-5 h-5" />,
          name: 'Smart Ticketing',
          description: 'Auto-generated tickets with full context',
          tier: 'All Plans'
        },
        {
          icon: <Network className="w-5 h-5" />,
          name: 'Device Management',
          description: 'Complete asset inventory & monitoring',
          tier: 'All Plans'
        },
        {
          icon: <Clock className="w-5 h-5" />,
          name: 'SLA Tracking',
          description: 'Real-time compliance monitoring',
          tier: 'Pro & Team'
        },
        {
          icon: <Users className="w-5 h-5" />,
          name: 'Smart Routing',
          description: 'Skill-based ticket assignment',
          tier: 'Pro & Team'
        },
        {
          icon: <Bell className="w-5 h-5" />,
          name: 'Escalation Rules',
          description: 'Automatic escalation workflows',
          tier: 'Team Only'
        },
        {
          icon: <CheckCircle className="w-5 h-5" />,
          name: 'Multi-Tenant Dashboard',
          description: 'Manage all clients from one view',
          tier: 'All Plans'
        }
      ]
    },
    {
      id: 'remote',
      title: 'Remote Help',
      subtitle: 'BuboIQ Connect',
      icon: <Wrench className="w-10 h-10" />,
      description: 'Zero-trust remote access with MFA, session recording, and compliance logging',
      gradient: 'from-prediction-purple/20 to-electric-blue/10',
      iconColor: 'text-prediction-purple',
      borderColor: 'border-prediction-purple/30',
      features: [
        {
          icon: <Monitor className="w-5 h-5" />,
          name: 'Remote Desktop',
          description: 'Secure screen sharing & control',
          tier: 'All Plans'
        },
        {
          icon: <Lock className="w-5 h-5" />,
          name: 'MFA Required',
          description: 'Multi-factor auth for every session',
          tier: 'All Plans'
        },
        {
          icon: <Users className="w-5 h-5" />,
          name: 'User Consent',
          description: 'End-user approval capture',
          tier: 'All Plans'
        },
        {
          icon: <Activity className="w-5 h-5" />,
          name: 'Session Recording',
          description: 'Full video playback & audit',
          tier: 'Pro & Team'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          name: 'Zero-Trust Policies',
          description: 'Conditional access rules',
          tier: 'Team Only'
        },
        {
          icon: <FileCheck className="w-5 h-5" />,
          name: 'Immutable Logs',
          description: 'Tamper-proof audit trails',
          tier: 'Pro & Team'
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance',
      subtitle: 'HIPAA · SOC 2 · PCI-DSS',
      icon: <Shield className="w-10 h-10" />,
      description: 'Automated compliance evidence and audit-ready documentation',
      gradient: 'from-amber-warning/20 to-signal-yellow/10',
      iconColor: 'text-amber-warning',
      borderColor: 'border-amber-warning/30',
      features: [
        {
          icon: <FileCheck className="w-5 h-5" />,
          name: 'Audit Trails',
          description: 'Append-only, immutable logs',
          tier: 'Pro & Team'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          name: 'HIPAA Evidence',
          description: 'Healthcare compliance exports',
          tier: 'Team + Add-on'
        },
        {
          icon: <Lock className="w-5 h-5" />,
          name: 'SOC 2 Reports',
          description: 'Automated control evidence',
          tier: 'Team + Add-on'
        },
        {
          icon: <Activity className="w-5 h-5" />,
          name: 'PCI-DSS Logs',
          description: 'Payment card compliance tracking',
          tier: 'Team + Add-on'
        },
        {
          icon: <Bell className="w-5 h-5" />,
          name: 'Breach Workflows',
          description: 'Automated notification systems',
          tier: 'Team + Add-on'
        },
        {
          icon: <BookOpen className="w-5 h-5" />,
          name: 'Policy Templates',
          description: 'Pre-built compliance frameworks',
          tier: 'Team + Add-on'
        }
      ]
    }
  ];

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
        
        {/* Asymmetric Intelligence Orbs - Features Identity */}
        <OrbSystem
          variantType="RibbonWave"
          sizeToken="M"
          placement="TopRight"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Scroll"
          glow={2}
          className="opacity-60"
        />
        <OrbSystem
          variantType="ParticleSwarm"
          sizeToken="S"
          placement="BottomLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Idle"
          density={3}
          glow={1}
          className="opacity-50"
        />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-8 text-sm px-6 py-2">
            Complete Feature Set
          </Badge>

          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
            <span className="text-pure-white">See More. </span>
            <span className="text-iq-neon-green bubo-neon-text-green">Solve Faster.</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-12 max-w-3xl mx-auto leading-relaxed">
            From AI-powered intelligence to compliance evidence—everything MSPs need to manage more clients with fewer technicians.
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

      {/* Feature Buckets - 4 Categories */}
      <section ref={bucketsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="bubo-scroll-reveal-stagger font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-pure-white mb-4">
              Organized Into 4 Capability Buckets
            </h2>
            <p className="bubo-scroll-reveal-stagger text-lg text-cloud-white max-w-3xl mx-auto">
              Hover over each category to explore features in depth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featureBuckets.map((bucket, index) => (
              <Card 
                key={index}
                className={`bubo-scroll-reveal-stagger bubo-glass p-8 border-2 ${bucket.borderColor} hover:scale-105 transition-all duration-500 group relative overflow-hidden`}
                onMouseEnter={() => setActiveBucket(index)}
                onMouseLeave={() => setActiveBucket(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${bucket.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Hover Particle Swarm Orb */}
                {activeBucket === index && (
                  <div className="absolute -right-12 -top-12">
                    <OrbSystem
                      variantType="ParticleSwarm"
                      sizeToken="S"
                      placement="InlineBadge"
                      zLayer="MidGlass"
                      tint="Base"
                      motionProfile="Focus"
                      density={2}
                      glow={1}
                      className="opacity-60"
                    />
                  </div>
                )}
                
                <div className="relative z-10">
                  {/* Bucket Header */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-dark-midnight/80 flex items-center justify-center ${bucket.iconColor} border-2 ${bucket.borderColor} group-hover:scale-110 transition-transform`}>
                        {bucket.icon}
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
                          {bucket.title}
                        </h3>
                        <p className="text-sm text-mist-gray">{bucket.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cloud-white mb-6 leading-relaxed">
                    {bucket.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3">
                    {bucket.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-start space-x-3 p-3 rounded-xl bg-dark-midnight/40 border border-slate-gray/20 hover:border-iq-neon-green/30 transition-all group/feature"
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${bucket.iconColor} bg-dark-midnight/60 border ${bucket.borderColor} flex-shrink-0 group-hover/feature:scale-110 transition-transform`}>
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-['Space_Grotesk'] font-semibold text-pure-white text-sm">
                              {feature.name}
                            </p>
                            <Badge className={`text-xs ${bucket.iconColor} border-${bucket.iconColor.replace('text-', '')}/30 bg-${bucket.iconColor.replace('text-', '')}/10 ml-2 flex-shrink-0`}>
                              {feature.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-mist-gray leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${bucket.iconColor.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Directional CTA Rail */}
      <section className="bubo-cta-rail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Ready to See Pricing?
          </h2>
          <p className="font-inter text-lg text-cloud-white mb-12 max-w-2xl mx-auto">
            Explore MSP-first plans with per-device pricing and flexible add-ons
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => onNavigate('pricing')}
              className="bubo-btn-neon-primary text-xl px-12 py-6 group"
            >
              <span className="relative z-10 flex items-center">
                Next: View Pricing
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              onClick={onTryItNow}
              className="bubo-btn-ghost text-xl px-12 py-6"
            >
              Try Interactive Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Final Section Divider */}
      <div className="bubo-section-divider" />
    </div>
  );
};