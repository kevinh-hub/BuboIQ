import React, { useState } from 'react';
import { 
  ArrowRight, Brain, Shield, Zap, Wrench, Network, Ticket, Monitor, BookOpen, 
  CheckCircle, Clock, TrendingUp, Eye, Bell, Users, Activity, Lock, FileCheck, 
  Sparkles, AlertTriangle, DollarSign, Timer, Target, Award, Laptop, Server,
  Headphones, BarChart3, Search, FileText, Settings, MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { OrbSystem } from './OrbSystem';
import { useStaggerReveal } from '../../hooks/useScrollReveal';

interface EnhancedFeaturesPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
}

export const EnhancedFeaturesPage: React.FC<EnhancedFeaturesPageProps> = ({ onNavigate, onTryItNow }) => {
  const [activeStory, setActiveStory] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const bucketsRef = useStaggerReveal();

  // Helper to get color classes (Tailwind JIT requires complete class names)
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
      'iq-neon-green': {
        bg: 'bg-iq-neon-green/20',
        text: 'text-iq-neon-green',
        border: 'border-iq-neon-green/30',
        badge: 'bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30'
      },
      'signal-yellow': {
        bg: 'bg-signal-yellow/20',
        text: 'text-signal-yellow',
        border: 'border-signal-yellow/30',
        badge: 'bg-signal-yellow/10 text-signal-yellow border-signal-yellow/30'
      },
      'electric-blue': {
        bg: 'bg-electric-blue/20',
        text: 'text-electric-blue',
        border: 'border-electric-blue/30',
        badge: 'bg-electric-blue/10 text-electric-blue border-electric-blue/30'
      },
      'prediction-purple': {
        bg: 'bg-prediction-purple/20',
        text: 'text-prediction-purple',
        border: 'border-prediction-purple/30',
        badge: 'bg-prediction-purple/10 text-prediction-purple border-prediction-purple/30'
      },
      'cyan-accent': {
        bg: 'bg-cyan-accent/20',
        text: 'text-cyan-accent',
        border: 'border-cyan-accent/30',
        badge: 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30'
      },
      'amber-warning': {
        bg: 'bg-amber-warning/20',
        text: 'text-amber-warning',
        border: 'border-amber-warning/30',
        badge: 'bg-amber-warning/10 text-amber-warning border-amber-warning/30'
      }
    };
    return colorMap[color] || colorMap['iq-neon-green'];
  };

  // Pain Points & Solutions (Story-Driven)
  const customerStories = [
    {
      painPoint: "Drowning in alerts but missing critical issues",
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'crimson-danger',
      scenario: {
        before: "Your team gets 500+ alerts per day. 95% are false positives. Real issues hide in the noise.",
        after: "AI learns normal patterns, suppresses noise, and surfaces only the 2-3 signals that matter each day.",
        customer: "Regional MSP, 1,200 endpoints",
        metric: "Reduced alert fatigue by 94%"
      },
      features: ['Signal Detection', 'Pattern Learning', 'Predictive Alerts'],
      cta: 'See Intelligence in Action'
    },
    {
      painPoint: "Technicians waste hours on repetitive fixes",
      icon: <Timer className="w-8 h-8" />,
      color: 'signal-yellow',
      scenario: {
        before: "DNS issues, print spooler crashes, disk cleanup—same fixes, different clients, hours wasted daily.",
        after: "One-click Guided Fixes with safety grades. Every successful fix becomes a Knowledge Base article.",
        customer: "IT Services Provider, 8 techs",
        metric: "Saved 15 hours per week"
      },
      features: ['Guided Fixes', 'Auto-Draft KB', 'Cross-OS Actions'],
      cta: 'Try a Guided Fix'
    },
    {
      painPoint: "No way to prove compliance during audits",
      icon: <Shield className="w-8 h-8" />,
      color: 'prediction-purple',
      scenario: {
        before: "Scrambling for evidence. Emails, spreadsheets, screenshots. Auditors waiting. Stress mounting.",
        after: "One-click export: immutable audit trails, session recordings, device posture reports. HIPAA-ready.",
        customer: "Healthcare MSP, SOC 2 audit",
        metric: "Passed audit in 1 day vs. 2 weeks"
      },
      features: ['Audit Trails', 'Session Recording', 'Compliance Exports'],
      cta: 'See Compliance Tools'
    },
    {
      painPoint: "Clients constantly breaching SLAs",
      icon: <DollarSign className="w-8 h-8" />,
      color: 'iq-neon-green',
      scenario: {
        before: "Missed response times. Manual tracking. Credit penalties. Frustrated clients.",
        after: "Real-time SLA dashboard. Automated escalations. Proactive alerts before SLA breach.",
        customer: "MSP with 45 clients",
        metric: "SLA compliance: 73% → 97%"
      },
      features: ['SLA Tracking', 'Smart Routing', 'Escalation Rules'],
      cta: 'View SLA Features'
    }
  ];

  // Feature Categories
  const featureCategories = [
    {
      id: 'intelligence',
      name: 'AI Intelligence',
      icon: <Brain className="w-5 h-5" />,
      color: 'iq-neon-green',
      description: 'Stop reacting. Start predicting.',
      features: [
        {
          name: 'Signal Detection',
          description: 'AI-powered anomaly detection across your entire fleet',
          benefits: ['Reduce noise by 90%', 'Catch issues 3-5 days early', 'Learn from your patterns'],
          tier: 'All Plans',
          icon: <Eye className="w-5 h-5" />
        },
        {
          name: 'Cross-Client Intelligence',
          description: 'Portfolio-wide pattern detection finds threats before they spread',
          benefits: ['Protect all clients simultaneously', 'Identify emerging threats', 'Share fixes automatically'],
          tier: 'Team Only',
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          name: 'Predictive Alerts',
          description: 'Know disk will fill, memory will spike, or service will crash—before users notice',
          benefits: ['3-5 day warning window', 'Prevent 80% of incidents', 'Schedule fixes proactively'],
          tier: 'Pro & Team',
          icon: <Sparkles className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'automation',
      name: 'Automation',
      icon: <Zap className="w-5 h-5" />,
      color: 'signal-yellow',
      description: 'Fix faster. Document automatically.',
      features: [
        {
          name: 'Guided Fixes',
          description: 'Step-by-step actions for common fixes across Windows, macOS, and Linux',
          benefits: ['One-click execution', 'Safety grades on every action', 'Works on any OS'],
          tier: 'Pro & Team',
          icon: <Wrench className="w-5 h-5" />
        },
        {
          name: 'Auto-Draft Knowledge Base',
          description: 'Every successful fix becomes a searchable KB article—automatically',
          benefits: ['Zero manual documentation', 'Confidence scoring', 'Self-learning system'],
          tier: 'Pro & Team',
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          name: 'Smart Ticketing',
          description: 'AI generates tickets with full context, routing, and suggested fixes',
          benefits: ['No manual ticket creation', 'Full device context included', 'Auto-assigned to right tech'],
          tier: 'All Plans',
          icon: <Ticket className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'remote',
      name: 'Remote Access',
      icon: <Monitor className="w-5 h-5" />,
      color: 'electric-blue',
      description: 'Secure remote help with proof.',
      features: [
        {
          name: 'Zero-Trust Connect',
          description: 'MFA-required remote sessions with end-user consent',
          benefits: ['Industry-leading security', 'User approval required', 'Works anywhere'],
          tier: 'All Plans',
          icon: <Lock className="w-5 h-5" />
        },
        {
          name: 'Session Recording',
          description: 'Every remote session recorded and tamper-proof',
          benefits: ['Full video playback', 'Immutable audit logs', 'Compliance-ready'],
          tier: 'Pro & Team',
          icon: <Activity className="w-5 h-5" />
        },
        {
          name: 'Zero-Trust Policies',
          description: 'Conditional access rules based on device posture and user context',
          benefits: ['Block non-compliant devices', 'Time-based restrictions', 'Role-based access'],
          tier: 'Team Only',
          icon: <Shield className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'prediction-purple',
      description: 'Audit-ready. Always.',
      features: [
        {
          name: 'Immutable Audit Trails',
          description: 'Tamper-proof logs of every action, session, and change',
          benefits: ['Pass any audit', 'Append-only architecture', 'Searchable forever'],
          tier: 'Pro & Team',
          icon: <Lock className="w-5 h-5" />
        },
        {
          name: 'HIPAA/SOC 2 Exports',
          description: 'One-click compliance evidence packages',
          benefits: ['Auditor-ready PDFs', 'Pre-mapped controls', 'Healthcare-specific redaction'],
          tier: 'Team + Add-on',
          icon: <Shield className="w-5 h-5" />
        },
        {
          name: 'Device Posture Tracking',
          description: "Know which devices meet compliance standards, which don't, and why",
          benefits: ['Real-time posture scores', 'Automated remediation', 'Compliance dashboards'],
          tier: 'Team + Add-on',
          icon: <Target className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: <Settings className="w-5 h-5" />,
      color: 'cyan-accent',
      description: 'Manage more with less.',
      features: [
        {
          name: 'Multi-Tenant Dashboard',
          description: 'Manage all clients from one unified view',
          benefits: ['See everything at once', 'Switch clients instantly', 'Portfolio analytics'],
          tier: 'All Plans',
          icon: <BarChart3 className="w-5 h-5" />
        },
        {
          name: 'SLA Tracking',
          description: 'Real-time compliance monitoring with breach warnings',
          benefits: ['Never miss a deadline', 'Auto-escalate at-risk tickets', 'Client-specific SLAs'],
          tier: 'Pro & Team',
          icon: <Clock className="w-5 h-5" />
        },
        {
          name: 'Device Management',
          description: 'Complete asset inventory with health monitoring',
          benefits: ['Auto-discovery', 'Health scoring', 'Lifecycle tracking'],
          tier: 'All Plans',
          icon: <Server className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'amber-warning',
      description: 'Institutional memory. Finally.',
      features: [
        {
          name: 'Self-Learning KB',
          description: 'System learns as you fix issues. Articles auto-generated, auto-updated.',
          benefits: ['Zero manual docs', 'Confidence scores', 'Self-improving'],
          tier: 'All Plans',
          icon: <Brain className="w-5 h-5" />
        },
        {
          name: 'Reviewer Console',
          description: 'Approve, reject, or improve auto-drafted articles',
          benefits: ['Quality control', 'Full edit history', 'Publication workflow'],
          tier: 'Team Only',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          name: 'Smart Search',
          description: 'Find the right fix in seconds with AI-powered semantic search',
          benefits: ['Natural language queries', 'Context-aware results', 'Related articles'],
          tier: 'All Plans',
          icon: <Search className="w-5 h-5" />
        }
      ]
    }
  ];

  // Social Proof Stats
  const proofPoints = [
    { metric: '94%', label: 'Alert Reduction', icon: <TrendingUp className="w-6 h-6" /> },
    { metric: '15hrs', label: 'Saved Per Week', icon: <Timer className="w-6 h-6" /> },
    { metric: '97%', label: 'SLA Compliance', icon: <Target className="w-6 h-6" /> },
    { metric: '<1 Day', label: 'Audit Prep Time', icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - Problem-Focused */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-dark-midnight via-surface-dark to-dark-midnight">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        {/* Orbs */}
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
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 mb-8 text-sm px-6 py-2">
            Built for Modern MSPs
          </Badge>

          <h1 className="font-space-grotesk text-5xl md:text-7xl font-bold text-pure-white mb-6">
            Stop Fighting Fires.
            <br />
            <span className="text-iq-neon-green bubo-neon-text-green">Start Preventing Them.</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-12 max-w-3xl mx-auto leading-relaxed">
            The only proactive IT support platform built for MSPs. Predict issues before they happen, 
            fix them in one click, and prove compliance without stress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-neon-primary text-lg px-10 py-6 group">
              <span className="relative z-10 flex items-center">
                See Pricing & Plans
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button onClick={onTryItNow} className="bubo-btn-secondary text-lg px-10 py-6">
              Try Interactive Demo
            </Button>
          </div>

          {/* Quick Social Proof */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {proofPoints.map((point, idx) => (
              <div key={idx} className="bubo-glass p-6 rounded-xl border border-slate-gray/30">
                <div className="text-iq-neon-green mb-2">{point.icon}</div>
                <div className="text-3xl font-space-grotesk text-pure-white mb-1">{point.metric}</div>
                <div className="text-sm text-mist-gray">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Stories Section - Story-Driven */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Real Problems. Real Solutions.
            </h2>
            <p className="text-lg text-cloud-white max-w-3xl mx-auto">
              See how BuboIQ solves the challenges MSPs face every day
            </p>
          </div>

          {/* Story Tabs */}
          <Tabs value={`story-${activeStory}`} onValueChange={(v) => setActiveStory(parseInt(v.split('-')[1]))} className="space-y-8">
            <TabsList className="bubo-glass p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {customerStories.map((story, idx) => (
                <TabsTrigger
                  key={idx}
                  value={`story-${idx}`}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg data-[state=active]:bg-iq-neon-green/20 data-[state=active]:border-iq-neon-green/30 border border-transparent transition-all`}
                >
                  <div className={`text-${story.color}`}>{story.icon}</div>
                  <span className="text-xs text-center leading-tight">{story.painPoint}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {customerStories.map((story, idx) => (
              <TabsContent key={idx} value={`story-${idx}`} className="space-y-6">
                <Card className="bubo-glass p-8 border-2 border-slate-gray/30">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Before */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                          Before BuboIQ
                        </Badge>
                      </div>
                      <p className="text-cloud-white leading-relaxed mb-4">
                        {story.scenario.before}
                      </p>
                      <div className="flex items-center gap-2 text-mist-gray text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Common pain point for MSPs</span>
                      </div>
                    </div>

                    {/* After */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-success-green/20 text-success-green border-success-green/30">
                          With BuboIQ
                        </Badge>
                      </div>
                      <p className="text-cloud-white leading-relaxed mb-4">
                        {story.scenario.after}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-iq-neon-green text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{story.scenario.metric}</span>
                        </div>
                        <div className="text-mist-gray text-sm">
                          {story.scenario.customer}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Used */}
                  <div className="mt-6 pt-6 border-t border-slate-gray/30">
                    <p className="text-sm text-mist-gray mb-3">Features that solved this:</p>
                    <div className="flex flex-wrap gap-2">
                      {story.features.map((feature, fIdx) => (
                        <Badge key={fIdx} className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    <Button className="bubo-btn-neon-primary w-full md:w-auto">
                      {story.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Feature Deep Dive - Benefit-Focused */}
      <section ref={bucketsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="bubo-scroll-reveal-stagger font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Every Feature Solves a Real Problem
            </h2>
            <p className="bubo-scroll-reveal-stagger text-lg text-cloud-white max-w-3xl mx-auto">
              Choose a category to explore features in depth
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              onClick={() => setActiveCategory('all')}
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              className={activeCategory === 'all' ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'}
            >
              All Features
            </Button>
            {featureCategories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                className={activeCategory === cat.id ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'}
              >
                {cat.icon}
                <span className="ml-2">{cat.name}</span>
              </Button>
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCategories
              .filter(cat => activeCategory === 'all' || activeCategory === cat.id)
              .map((category) => (
                category.features.map((feature, fIdx) => (
                  <Card
                    key={`${category.id}-${fIdx}`}
                    className="bubo-scroll-reveal-stagger bubo-glass p-6 border-2 border-slate-gray/30 hover:border-iq-neon-green/30 hover:bubo-glow-green transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${getColorClasses(category.color).bg} border ${getColorClasses(category.color).border} flex items-center justify-center ${getColorClasses(category.color).text} group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <Badge className={`${getColorClasses(category.color).badge} text-xs`}>
                        {feature.tier}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="font-space-grotesk text-lg text-pure-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-cloud-white mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-mist-gray">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Everything Works Together
            </h2>
            <p className="text-lg text-cloud-white max-w-3xl mx-auto">
              Not just features—a complete platform designed for MSP workflows
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Agent */}
            <Card className="bubo-glass p-6 border-2 border-electric-blue/30">
              <Laptop className="w-10 h-10 text-electric-blue mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">BuboIQ Agent</h3>
              <p className="text-sm text-cloud-white mb-4">
                Lightweight agent collects signals, executes fixes, monitors health—across Windows, macOS, and Linux
              </p>
              <Button variant="outline" className="bubo-btn-secondary w-full">
                Learn About Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Connect */}
            <Card className="bubo-glass p-6 border-2 border-prediction-purple/30">
              <Monitor className="w-10 h-10 text-prediction-purple mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">BuboIQ Connect</h3>
              <p className="text-sm text-cloud-white mb-4">
                Zero-trust remote access with MFA, session recording, and immutable audit logs
              </p>
              <Button variant="outline" className="bubo-btn-secondary w-full">
                Learn About Connect
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Platform */}
            <Card className="bubo-glass p-6 border-2 border-iq-neon-green/30">
              <Server className="w-10 h-10 text-iq-neon-green mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">Cloud Platform</h3>
              <p className="text-sm text-cloud-white mb-4">
                AI intelligence engine, multi-tenant dashboard, compliance tools—all in one unified platform
              </p>
              <Button variant="outline" className="bubo-btn-secondary w-full">
                See Full Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-midnight to-iq-neon-green/5" />
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-6">
            Ready to Stop Fighting Fires?
          </h2>
          <p className="text-xl text-cloud-white mb-8 max-w-2xl mx-auto">
            Start with our interactive demo. No credit card. No setup. See how BuboIQ transforms MSP operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button onClick={onTryItNow} className="bubo-btn-neon-primary text-lg px-12 py-6 group">
              <span className="relative z-10 flex items-center">
                Try Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-secondary text-lg px-12 py-6">
              View Pricing Plans
            </Button>
          </div>

          {/* Help CTA */}
          <div className="mt-12 flex items-center justify-center gap-2 text-mist-gray">
            <Headphones className="w-5 h-5" />
            <span>Questions? Chat with us: help@buboiq.com</span>
          </div>
        </div>
      </section>
    </div>
  );
};
