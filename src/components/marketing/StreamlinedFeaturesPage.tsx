import React, { useState } from 'react';
import { ArrowRight, Brain, Shield, Zap, Wrench, Network, Ticket, Monitor, BookOpen, CheckCircle, Lock, Settings, Search, Laptop, Server, Headphones, AlertTriangle, Eye, TrendingUp, Users, Activity, FileCheck, Bell, Clock, Target, BarChart3, Download, Code, Play, Database, Cpu, HardDrive } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';

interface StreamlinedFeaturesPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
}

export const StreamlinedFeaturesPage: React.FC<StreamlinedFeaturesPageProps> = ({ onNavigate, onTryItNow }) => {
  const [activeStory, setActiveStory] = useState<string>('alerts');
  const [activeFeature, setActiveFeature] = useState<string>('intelligence');
  const [platformDialog, setPlatformDialog] = useState<'agent' | 'connect' | 'cloud' | null>(null);

  // Customer Stories - Before/After (ONE AT A TIME)
  const stories = [
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      before: "Teams get hundreds of alerts every day. Most are false alarms. Real problems hide in the noise until users complain.",
      after: "The system learns what's normal for each computer. It hides routine events and shows only warnings that need attention.",
      features: ['Signal Detection', 'Pattern Learning', 'Baseline Detection'],
      anchor: '#signal-detection'
    },
    {
      id: 'fixes',
      label: 'Repetitive Fixes',
      icon: <Wrench className="w-4 h-4" />,
      before: "Technicians fix the same problems over and over: DNS issues, print crashes, disk cleanup.",
      after: "Guided Fixes give you step-by-step instructions with safety notes. When a fix works, it auto-saves as an article.",
      features: ['Guided Fixes', 'Auto-Draft KB', 'Safety Grades'],
      anchor: '#guided-fixes'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: <Shield className="w-4 h-4" />,
      before: "Audit prep means searching emails, screenshots, and spreadsheets. Evidence is scattered. Auditors wait.",
      after: "One-click export creates audit packages with unchangeable logs, session recordings, and computer security reports.",
      features: ['Audit Trails', 'Session Recording', 'Evidence Export'],
      anchor: '#audit-trails'
    },
    {
      id: 'sla',
      label: 'SLAs',
      icon: <Clock className="w-4 h-4" />,
      before: "Response times tracked by hand. Missed deadlines happen before anyone notices. Clients get credits. Trust erodes.",
      after: "We track response deadlines live. Escalation rules fire automatically before you miss them.",
      features: ['SLA Tracking', 'Smart Routing', 'Escalation Rules'],
      anchor: '#sla-tracking'
    }
  ];

  // Feature Buckets (TABS)
  const featureBuckets = [
    {
      id: 'intelligence',
      name: 'Smart patterns',
      tagline: 'Stop reacting. Start predicting.',
      icon: <Brain className="w-5 h-5" />,
      color: 'iq-neon-green',
      features: [
        {
          id: 'signal-detection',
          name: 'Early warning detection',
          description: 'Finds unusual behavior across your computers by learning what\'s normal for each setup.',
          tier: 'All Plans',
          icon: <Eye className="w-5 h-5" />
        },
        {
          id: 'cross-client-intelligence',
          name: 'Cross-client patterns',
          description: 'Spots patterns across all your clients to catch threats before they spread.',
          tier: 'Team Only',
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          id: 'predictive-alerts',
          name: 'Early warnings',
          description: 'Warns you when disk space, memory, or services show signs of coming failures.',
          tier: 'Pro & Team',
          icon: <Zap className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'automation',
      name: 'Automation',
      tagline: 'Fix faster. Document automatically.',
      icon: <Zap className="w-5 h-5" />,
      color: 'signal-yellow',
      features: [
        {
          id: 'guided-fixes',
          name: 'Guided Fixes',
          description: 'Step-by-step actions for common fixes across Windows, macOS, and Linux with one-click execution.',
          tier: 'Pro & Team',
          icon: <Wrench className="w-5 h-5" />
        },
        {
          id: 'auto-draft-kb',
          name: 'Auto-Draft KB',
          description: 'Successful fixes become searchable Knowledge Base articles without manual documentation.',
          tier: 'Pro & Team',
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          id: 'smart-ticketing',
          name: 'Smart Ticketing',
          description: 'Generates tickets with device context, routing suggestions, and related fix recommendations.',
          tier: 'All Plans',
          icon: <Ticket className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'remote',
      name: 'Remote Access',
      tagline: 'Secure remote help with proof.',
      icon: <Monitor className="w-5 h-5" />,
      color: 'electric-blue',
      features: [
        {
          id: 'zero-trust-connect',
          name: 'Zero-Trust Connect',
          description: 'Multi-factor authentication required for every remote session. End-user consent captured.',
          tier: 'All Plans',
          icon: <Lock className="w-5 h-5" />
        },
        {
          id: 'session-recording',
          name: 'Session Recording',
          description: 'Every remote session recorded with tamper-proof logs for compliance and training.',
          tier: 'Pro & Team',
          icon: <Activity className="w-5 h-5" />
        },
        {
          id: 'zero-trust-policies',
          name: 'Zero-Trust Policies',
          description: 'Conditional access rules based on device posture, time windows, and user roles.',
          tier: 'Team Only',
          icon: <Shield className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      tagline: 'Audit-ready evidence.',
      icon: <FileCheck className="w-5 h-5" />,
      color: 'prediction-purple',
      features: [
        {
          id: 'audit-trails',
          name: 'Immutable Audit Trails',
          description: 'Append-only logs of every action, session, and change. Searchable and exportable.',
          tier: 'Pro & Team',
          icon: <Lock className="w-5 h-5" />
        },
        {
          id: 'compliance-exports',
          name: 'Compliance Exports',
          description: 'One-click evidence packages for HIPAA, SOC 2, and PCI-DSS audits.',
          tier: 'Team + Add-on',
          icon: <Shield className="w-5 h-5" />
        },
        {
          id: 'device-posture',
          name: 'Device Posture Tracking',
          description: "Monitors which devices meet compliance standards and flags those that don't.",
          tier: 'Team + Add-on',
          icon: <Target className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      tagline: 'Manage more with less.',
      icon: <Settings className="w-5 h-5" />,
      color: 'cyan-accent',
      features: [
        {
          id: 'multi-tenant',
          name: 'Multi-Tenant Dashboard',
          description: 'Manage all clients from one unified view. Switch contexts instantly.',
          tier: 'All Plans',
          icon: <BarChart3 className="w-5 h-5" />
        },
        {
          id: 'sla-tracking',
          name: 'SLA Tracking',
          description: 'Real-time compliance monitoring with breach warnings and automated escalations.',
          tier: 'Pro & Team',
          icon: <Clock className="w-5 h-5" />
        },
        {
          id: 'device-management',
          name: 'Device Management',
          description: 'Complete asset inventory with auto-discovery, health scoring, and lifecycle tracking.',
          tier: 'All Plans',
          icon: <Network className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      tagline: 'Institutional memory.',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'amber-warning',
      features: [
        {
          id: 'self-learning-kb',
          name: 'Self-Learning KB',
          description: 'Articles auto-generated from successful fixes. System learns and improves as you work.',
          tier: 'All Plans',
          icon: <Brain className="w-5 h-5" />
        },
        {
          id: 'reviewer-console',
          name: 'Reviewer Console',
          description: 'Approve, reject, or improve auto-drafted articles before publication.',
          tier: 'Team Only',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          id: 'smart-search',
          name: 'Smart Search',
          description: 'AI-powered semantic search finds relevant fixes using natural language queries.',
          tier: 'All Plans',
          icon: <Search className="w-5 h-5" />
        }
      ]
    }
  ];

  const tierBadgeClass = (tier: string) => {
    if (tier === 'All Plans') return 'bg-success-green/10 text-success-green border-success-green/30';
    if (tier.includes('Team')) return 'bg-prediction-purple/10 text-prediction-purple border-prediction-purple/30';
    return 'bg-electric-blue/10 text-electric-blue border-electric-blue/30';
  };

  const categoryColorClass = (color: string) => {
    const colors: Record<string, string> = {
      'iq-neon-green': 'text-iq-neon-green',
      'signal-yellow': 'text-signal-yellow',
      'electric-blue': 'text-electric-blue',
      'prediction-purple': 'text-prediction-purple',
      'cyan-accent': 'text-cyan-accent',
      'amber-warning': 'text-amber-warning'
    };
    return colors[color] || 'text-iq-neon-green';
  };

  return (
    <div className="min-h-screen pt-16">
      {/* HERO - Streamlined */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-dark-midnight via-surface-dark to-dark-midnight">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
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
            Built for MSPs
          </Badge>

          <h1 className="font-space-grotesk text-5xl md:text-7xl font-bold text-pure-white mb-6">
            Stop Fighting Fires.
            <br />
            <span className="text-iq-neon-green bubo-neon-text-green">Start Preventing Them.</span>
          </h1>
          
          <p className="text-xl text-cloud-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Predict issues, fix in one click, and prove compliance—without the noise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button onClick={onTryItNow} className="bubo-btn-neon-primary text-lg px-10 py-6 group">
              <span className="relative z-10 flex items-center">
                Try Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-secondary text-lg px-10 py-6">
              See Pricing & Plans
            </Button>
          </div>

          {/* Social Proof Strip - Tags Only (NO METRICS) */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-mist-gray">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-iq-neon-green" />
              <span>Case-Backed Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-electric-blue" />
              <span>Live SLA Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-prediction-purple" />
              <span>Audit-Ready Exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES - One Card at a Time (Tabbed) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Real Problems. Clear Solutions.
            </h2>
            <p className="text-lg text-cloud-white">
              See how BuboIQ addresses common MSP challenges
            </p>
          </div>

          <Tabs value={activeStory} onValueChange={setActiveStory} className="space-y-8">
            <TabsList className="bubo-glass p-2 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              {stories.map((story) => (
                <TabsTrigger
                  key={story.id}
                  value={story.id}
                  className="flex items-center gap-2 p-3 rounded-lg data-[state=active]:bg-iq-neon-green/20 data-[state=active]:border-iq-neon-green/30 border border-transparent transition-all"
                >
                  {story.icon}
                  <span className="text-sm">{story.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {stories.map((story) => (
              <TabsContent key={story.id} value={story.id}>
                <Card className="bubo-glass p-8 border-2 border-slate-gray/30">
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Before */}
                    <div>
                      <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30 mb-4">
                        Before BuboIQ
                      </Badge>
                      <p className="text-cloud-white leading-relaxed">
                        {story.before}
                      </p>
                    </div>

                    {/* After */}
                    <div>
                      <Badge className="bg-success-green/20 text-success-green border-success-green/30 mb-4">
                        With BuboIQ
                      </Badge>
                      <p className="text-cloud-white leading-relaxed">
                        {story.after}
                      </p>
                    </div>
                  </div>

                  {/* Features Used */}
                  <div className="pt-6 border-t border-slate-gray/30">
                    <p className="text-sm text-mist-gray mb-3">Features that address this:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.features.map((feature, idx) => (
                        <Badge key={idx} className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="bubo-btn-secondary"
                      onClick={() => {
                        setActiveFeature(story.anchor.split('#')[1].split('-')[0] === 'signal' ? 'intelligence' : 
                                        story.anchor.includes('guided') ? 'automation' :
                                        story.anchor.includes('audit') ? 'compliance' : 'operations');
                        document.querySelector(story.anchor)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      See how this works
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* INTEGRATIONS - Key Differentiator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 mb-6 text-sm px-6 py-2">
              Competitive Advantage
            </Badge>
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Works With Your Existing Tools
            </h2>
            <p className="text-xl text-cloud-white max-w-3xl mx-auto leading-relaxed">
              Connect to the systems you already use. No need to replace your entire stack.
            </p>
          </div>

          <Card className="bubo-glass p-8 md:p-12 border-2 border-electric-blue/30">
            {/* Popular Integrations Grid */}
            <div className="mb-10">
              <h3 className="font-space-grotesk text-2xl text-pure-white mb-6 text-center">
                Popular Integrations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'Slack', icon: '💬', category: 'Chat' },
                  { name: 'Microsoft Teams', icon: '👥', category: 'Chat' },
                  { name: 'ConnectWise', icon: '🔧', category: 'PSA' },
                  { name: 'Autotask', icon: '📋', category: 'PSA' },
                  { name: 'PagerDuty', icon: '📟', category: 'On-Call' },
                  { name: 'Datto RMM', icon: '🖥️', category: 'RMM' },
                  { name: 'NinjaOne', icon: '🥷', category: 'RMM' },
                  { name: 'Datadog', icon: '📊', category: 'Monitoring' }
                ].map((integration, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center p-4 rounded-xl bg-dark-midnight/40 border border-slate-gray/20 hover:border-electric-blue/30 transition-all group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {integration.icon}
                    </div>
                    <p className="text-sm font-space-grotesk text-pure-white mb-1 text-center">
                      {integration.name}
                    </p>
                    <Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/30 text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-gray/30 mb-10" />

            {/* Integration Categories */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-xl bg-dark-midnight/40 border border-slate-gray/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-iq-neon-green/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-iq-neon-green" />
                  </div>
                  <h4 className="font-space-grotesk text-lg text-pure-white">
                    API Access
                  </h4>
                </div>
                <p className="text-sm text-cloud-white leading-relaxed">
                  Full REST API with webhooks for custom integrations. Build your own connections when needed.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-dark-midnight/40 border border-slate-gray/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-electric-blue" />
                  </div>
                  <h4 className="font-space-grotesk text-lg text-pure-white">
                    Real-Time Events
                  </h4>
                </div>
                <p className="text-sm text-cloud-white leading-relaxed">
                  Webhook notifications for incidents, SLA breaches, and pattern discoveries. Stay informed.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-dark-midnight/40 border border-slate-gray/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-prediction-purple/20 flex items-center justify-center">
                    <Database className="w-5 h-5 text-prediction-purple" />
                  </div>
                  <h4 className="font-space-grotesk text-lg text-pure-white">
                    Data Export
                  </h4>
                </div>
                <p className="text-sm text-cloud-white leading-relaxed">
                  Export tickets, signals, and audit logs to your data warehouse. Own your data.
                </p>
              </div>
            </div>

            {/* What Sets Us Apart */}
            <div className="p-6 rounded-xl bg-electric-blue/5 border border-electric-blue/20">
              <h4 className="font-space-grotesk text-xl text-pure-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                What sets BuboIQ apart
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-cloud-white">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-pure-white">Pre-built connections</strong> to popular MSP tools—no custom development needed
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-pure-white">Two-way sync</strong> keeps tickets, devices, and users in sync across platforms
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-pure-white">Alert forwarding</strong> sends notifications to Slack, Teams, or PagerDuty instantly
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-pure-white">Team plan</strong> includes custom integrations and dedicated support
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FEATURE BUCKETS - Tabs (NOT GRID) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Complete Feature Set
            </h2>
            <p className="text-lg text-cloud-white">
              Organized by capability: Detect → Fix → Prove → Operate
            </p>
          </div>

          <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-8">
            <TabsList className="bubo-glass p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
              {featureBuckets.map((bucket) => (
                <TabsTrigger
                  key={bucket.id}
                  value={bucket.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg data-[state=active]:bg-iq-neon-green/20 data-[state=active]:border-iq-neon-green/30 border border-transparent transition-all"
                >
                  <div className={categoryColorClass(bucket.color)}>{bucket.icon}</div>
                  <span className="text-xs text-center">{bucket.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {featureBuckets.map((bucket) => (
              <TabsContent key={bucket.id} value={bucket.id}>
                <Card className="bubo-glass p-8 border-2 border-slate-gray/30">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${categoryColorClass(bucket.color)}`}>{bucket.icon}</div>
                      <h3 className="font-space-grotesk text-2xl text-pure-white">{bucket.name}</h3>
                    </div>
                    <p className="text-mist-gray">{bucket.tagline}</p>
                  </div>

                  {/* 3 Features Max per Tab */}
                  <div className="space-y-6">
                    {bucket.features.map((feature) => (
                      <div
                        key={feature.id}
                        id={feature.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-dark-midnight/40 border border-slate-gray/20 hover:border-iq-neon-green/30 transition-all"
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${categoryColorClass(bucket.color)} bg-dark-midnight/60 border border-slate-gray/30 flex-shrink-0`}>
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-space-grotesk text-lg text-pure-white">
                              {feature.name}
                            </h4>
                            <Badge className={`${tierBadgeClass(feature.tier)} text-xs flex-shrink-0 ml-2`}>
                              {feature.tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-cloud-white leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* PLATFORM TRIO - Minimal (3 Cards Only) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-4">
              Three Components. One Platform.
            </h2>
            <p className="text-lg text-cloud-white">
              Agent, Connect, and Cloud work together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bubo-glass p-6 border-2 border-electric-blue/30">
              <Laptop className="w-10 h-10 text-electric-blue mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">BuboIQ Agent</h3>
              <p className="text-sm text-cloud-white mb-4 leading-relaxed">
                Lightweight agent for Windows, macOS, and Linux. Collects signals and executes fixes.
              </p>
              <Button 
                variant="outline" 
                className="bubo-btn-secondary w-full text-sm"
                onClick={() => setPlatformDialog('agent')}
              >
                Agent Details
              </Button>
            </Card>

            <Card className="bubo-glass p-6 border-2 border-prediction-purple/30">
              <Monitor className="w-10 h-10 text-prediction-purple mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">BuboIQ Connect</h3>
              <p className="text-sm text-cloud-white mb-4 leading-relaxed">
                Zero-trust remote access with MFA and session recording.
              </p>
              <Button 
                variant="outline" 
                className="bubo-btn-secondary w-full text-sm"
                onClick={() => setPlatformDialog('connect')}
              >
                Connect Details
              </Button>
            </Card>

            <Card className="bubo-glass p-6 border-2 border-iq-neon-green/30">
              <Server className="w-10 h-10 text-iq-neon-green mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">Cloud Platform</h3>
              <p className="text-sm text-cloud-white mb-4 leading-relaxed">
                AI intelligence engine and multi-tenant dashboard.
              </p>
              <Button 
                variant="outline" 
                className="bubo-btn-secondary w-full text-sm"
                onClick={() => setPlatformDialog('cloud')}
              >
                Platform Details
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* PLATFORM DIALOGS */}
      {/* Agent Dialog */}
      <Dialog open={platformDialog === 'agent'} onOpenChange={(open) => !open && setPlatformDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bubo-glass border-2 border-electric-blue/30">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Laptop className="w-8 h-8 text-electric-blue" />
              <DialogTitle className="font-space-grotesk text-3xl text-pure-white">BuboIQ Agent</DialogTitle>
            </div>
            <DialogDescription className="text-cloud-white text-base">
              Lightweight endpoint monitoring and automation agent for Windows, macOS, and Linux
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* What It Does */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-electric-blue" />
                What It Does
              </h3>
              <p className="text-cloud-white leading-relaxed mb-3">
                The BuboIQ Agent runs on each managed device to collect system signals, execute automated fixes, and enable remote access. It operates in the background with minimal resource usage.
              </p>
              <ul className="space-y-2 text-cloud-white">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Collects hardware metrics, application logs, and system events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Executes Guided Fixes with safety validation before running commands</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Enables secure remote access via BuboIQ Connect</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Reports device posture status for compliance monitoring</span>
                </li>
              </ul>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* How It Works */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-electric-blue" />
                How It Works
              </h3>
              <div className="space-y-3 text-cloud-white">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Initial Setup</p>
                    <p className="text-sm">Agent registers with Cloud Platform using secure token. Connection established via HTTPS with certificate pinning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Data Collection</p>
                    <p className="text-sm">Runs collectors every 5 minutes for system metrics. Event-driven monitoring for critical signals like service failures or disk space warnings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Fix Execution</p>
                    <p className="text-sm">Receives fix instructions from Cloud Platform. Validates safety grade and required permissions before executing commands. Streams output back in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Remote Access</p>
                    <p className="text-sm">Opens secure tunnel when Connect session initiated. End-user consent required. All actions logged for audit trail.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Supported Platforms */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-electric-blue" />
                Supported Platforms
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Windows</p>
                  <ul className="text-sm text-cloud-white space-y-1">
                    <li>• Windows 10 (1809+)</li>
                    <li>• Windows 11</li>
                    <li>• Server 2016+</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">macOS</p>
                  <ul className="text-sm text-cloud-white space-y-1">
                    <li>• macOS 12 Monterey</li>
                    <li>• macOS 13 Ventura</li>
                    <li>• macOS 14 Sonoma+</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Linux</p>
                  <ul className="text-sm text-cloud-white space-y-1">
                    <li>• Ubuntu 20.04+</li>
                    <li>• Debian 11+</li>
                    <li>• RHEL/CentOS 8+</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* System Requirements */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-electric-blue" />
                System Requirements
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-cloud-white text-sm">
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-electric-blue" />
                    <span><strong>CPU:</strong> Any modern processor</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-electric-blue" />
                    <span><strong>RAM:</strong> 128 MB idle, 256 MB during fix execution</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-electric-blue" />
                    <span><strong>Disk:</strong> 50 MB installation, 200 MB logs</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-electric-blue" />
                    <span><strong>Network:</strong> HTTPS 443 outbound to *.buboiq.com</span>
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Installation */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-electric-blue" />
                Installation
              </h3>
              <p className="text-cloud-white mb-4">
                Agent installers are available from the dashboard after account setup. Each installer includes a unique enrollment token tied to your organization.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <Button variant="outline" className="bubo-btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Windows MSI
                </Button>
                <Button variant="outline" className="bubo-btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  macOS PKG
                </Button>
                <Button variant="outline" className="bubo-btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Linux DEB/RPM
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Dialog */}
      <Dialog open={platformDialog === 'connect'} onOpenChange={(open) => !open && setPlatformDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bubo-glass border-2 border-prediction-purple/30">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-8 h-8 text-prediction-purple" />
              <DialogTitle className="font-space-grotesk text-3xl text-pure-white">BuboIQ Connect</DialogTitle>
            </div>
            <DialogDescription className="text-cloud-white text-base">
              Zero-trust remote access with multi-factor authentication and session recording
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* What It Does */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-prediction-purple" />
                What It Does
              </h3>
              <p className="text-cloud-white leading-relaxed mb-3">
                BuboIQ Connect provides secure remote access to managed devices without VPNs or port forwarding. Every session requires multi-factor authentication and end-user consent.
              </p>
              <ul className="space-y-2 text-cloud-white">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Screen sharing and remote control via secure encrypted tunnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Session recording with immutable audit logs for compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>End-user consent capture before every session begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>File transfer with virus scanning and audit trail</span>
                </li>
              </ul>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Zero-Trust Architecture */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-prediction-purple" />
                Zero-Trust Architecture
              </h3>
              <div className="space-y-3 text-cloud-white">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-prediction-purple/20 text-prediction-purple flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Technician Authentication</p>
                    <p className="text-sm">Technician logs in with username and password. MFA challenge sent via authenticator app or SMS. Session token issued with 8-hour expiration.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-prediction-purple/20 text-prediction-purple flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Device Verification</p>
                    <p className="text-sm">Target device posture checked against policy. Must meet requirements: agent running, OS patched, antivirus active. Session blocked if device fails checks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-prediction-purple/20 text-prediction-purple flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">End-User Consent</p>
                    <p className="text-sm">On-screen prompt shown to end user. Must click "Allow Access" within 60 seconds. Consent timestamp and user identity captured for audit log.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-prediction-purple/20 text-prediction-purple flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Session Establishment</p>
                    <p className="text-sm">Encrypted tunnel created between technician and device. All traffic routed through BuboIQ cloud for logging. Recording starts automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Session Recording */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-prediction-purple" />
                Session Recording & Audit
              </h3>
              <p className="text-cloud-white leading-relaxed mb-4">
                Every remote session is recorded for compliance and training. Recordings include screen activity, keystrokes, file transfers, and session metadata.
              </p>
              <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                <p className="font-space-grotesk text-pure-white mb-3">What's Captured:</p>
                <ul className="space-y-2 text-sm text-cloud-white">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span>Full video recording of screen sharing at 15 FPS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span>Command history with timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span>File transfer log with checksums</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span>Session metadata: technician, device, duration, consent timestamp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                    <span>Stored in append-only logs for tamper-proof audit trail</span>
                  </li>
                </ul>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Policy Controls */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-prediction-purple" />
                Policy Controls
              </h3>
              <p className="text-cloud-white leading-relaxed mb-4">
                Administrators can configure conditional access rules to enforce security standards.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 mb-2">
                    Team Only
                  </Badge>
                  <p className="font-space-grotesk text-pure-white mb-2 text-sm">Time-Based Access</p>
                  <p className="text-xs text-cloud-white">Restrict sessions to business hours or specific time windows</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 mb-2">
                    Team Only
                  </Badge>
                  <p className="font-space-grotesk text-pure-white mb-2 text-sm">Device Posture</p>
                  <p className="text-xs text-cloud-white">Require OS patches, antivirus, and disk encryption before access</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 mb-2">
                    Team Only
                  </Badge>
                  <p className="font-space-grotesk text-pure-white mb-2 text-sm">Role-Based Access</p>
                  <p className="text-xs text-cloud-white">Limit which technicians can access which client devices</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 mb-2">
                    Team Only
                  </Badge>
                  <p className="font-space-grotesk text-pure-white mb-2 text-sm">Session Limits</p>
                  <p className="text-xs text-cloud-white">Auto-terminate sessions after maximum duration or inactivity</p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Compliance */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-prediction-purple" />
                Compliance Ready
              </h3>
              <p className="text-cloud-white leading-relaxed mb-3">
                BuboIQ Connect includes features designed for HIPAA, SOC 2, and PCI-DSS compliance requirements.
              </p>
              <ul className="space-y-2 text-cloud-white text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>End-to-end encryption with TLS 1.3</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Immutable audit logs stored for configurable retention period</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Session recordings exportable for auditor review</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>User consent capture meets legal requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cloud Platform Dialog */}
      <Dialog open={platformDialog === 'cloud'} onOpenChange={(open) => !open && setPlatformDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bubo-glass border-2 border-iq-neon-green/30">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-8 h-8 text-iq-neon-green" />
              <DialogTitle className="font-space-grotesk text-3xl text-pure-white">Cloud Platform</DialogTitle>
            </div>
            <DialogDescription className="text-cloud-white text-base">
              AI intelligence engine and multi-tenant management dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* What It Does */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-iq-neon-green" />
                What It Does
              </h3>
              <p className="text-cloud-white leading-relaxed mb-3">
                The Cloud Platform is the central hub where all signals are analyzed, fixes are coordinated, and compliance data is aggregated. It provides a unified view across all your managed clients and devices.
              </p>
              <ul className="space-y-2 text-cloud-white">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>AI engine that learns normal patterns and identifies anomalies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Multi-tenant dashboard for managing multiple client organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Guided Fixes library with platform-specific automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span>Self-learning Knowledge Base that documents successful fixes</span>
                </li>
              </ul>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* AI Intelligence Engine */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-iq-neon-green" />
                AI Intelligence Engine
              </h3>
              <div className="space-y-3 text-cloud-white">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-iq-neon-green/20 text-iq-neon-green flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Learning Phase</p>
                    <p className="text-sm">System observes each environment for 14 days to establish baseline behavior. Tracks CPU usage patterns, disk space trends, service health, and user activity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-iq-neon-green/20 text-iq-neon-green flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Anomaly Detection</p>
                    <p className="text-sm">Identifies deviations from learned patterns. Suppresses routine events like scheduled reboots. Surfaces signals that indicate potential problems.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-iq-neon-green/20 text-iq-neon-green flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Cross-Client Intelligence</p>
                    <p className="text-sm">Team tier analyzes patterns across your entire portfolio. Detects threats spreading between clients. Proactively warns other clients before they're affected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-iq-neon-green/20 text-iq-neon-green flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-space-grotesk text-pure-white mb-1">Predictive Alerts</p>
                    <p className="text-sm">Tracks resource trends to predict failures. Warns when disk space will fill in 7 days. Alerts on memory leaks before system becomes unresponsive.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Multi-Tenant Architecture */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-iq-neon-green" />
                Multi-Tenant Architecture
              </h3>
              <p className="text-cloud-white leading-relaxed mb-4">
                Built for MSPs managing multiple clients. Switch between client contexts instantly while maintaining strict data isolation.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Data Isolation</p>
                  <p className="text-sm text-cloud-white">Each client's data stored in separate tenant partition. No cross-contamination. Complete logical separation.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Unified View</p>
                  <p className="text-sm text-cloud-white">Dashboard aggregates health across all clients. Spot issues portfolio-wide. Drill down to specific client or device.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Context Switching</p>
                  <p className="text-sm text-cloud-white">Toggle between clients without re-login. Persistent session state. Breadcrumbs show current location.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <p className="font-space-grotesk text-pure-white mb-2">Permission Model</p>
                  <p className="text-sm text-cloud-white">Assign technicians to specific clients. Role-based access control. Audit log tracks who accessed what.</p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Dashboard Features */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-iq-neon-green" />
                Dashboard Features
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-signal-yellow" />
                    <p className="font-space-grotesk text-pure-white">Signal Stream</p>
                  </div>
                  <p className="text-sm text-cloud-white">Real-time feed of detected anomalies. Filter by severity, client, or device. One-click triage to create ticket or run fix.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-5 h-5 text-electric-blue" />
                    <p className="font-space-grotesk text-pure-white">Device Inventory</p>
                  </div>
                  <p className="text-sm text-cloud-white">Complete asset list with health scores. Auto-discovery as agents check in. Lifecycle tracking from deployment to retirement.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-prediction-purple" />
                    <p className="font-space-grotesk text-pure-white">SLA Tracking</p>
                  </div>
                  <p className="text-sm text-cloud-white">Real-time compliance monitoring. Breach warnings before deadlines. Automated escalations when SLA at risk.</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-midnight/40 border border-slate-gray/20">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-amber-warning" />
                    <p className="font-space-grotesk text-pure-white">Knowledge Base</p>
                  </div>
                  <p className="text-sm text-cloud-white">Searchable library of fixes. Auto-generated from successful resolutions. Semantic search finds relevant articles.</p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-gray/30" />

            {/* Infrastructure */}
            <div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-iq-neon-green" />
                Infrastructure
              </h3>
              <p className="text-cloud-white leading-relaxed mb-3">
                Hosted on enterprise cloud infrastructure with high availability and data redundancy.
              </p>
              <ul className="space-y-2 text-cloud-white text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span><strong>Uptime:</strong> 99.9% SLA with automated failover</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span><strong>Data Retention:</strong> 90 days signals, 1 year audit logs (configurable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span><strong>Backups:</strong> Automated daily with point-in-time recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span><strong>Security:</strong> SOC 2 Type II compliant infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green flex-shrink-0 mt-0.5" />
                  <span><strong>Encryption:</strong> TLS 1.3 in transit, AES-256 at rest</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-midnight to-iq-neon-green/5" />
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-space-grotesk text-4xl md:text-5xl text-pure-white mb-6">
            Ready to see it in action?
          </h2>
          <p className="text-xl text-cloud-white mb-8 max-w-2xl mx-auto">
            Try the interactive demo. No setup required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
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

          <div className="flex items-center justify-center gap-2 text-mist-gray">
            <Headphones className="w-5 h-5" />
            <span>Questions? help@buboiq.com</span>
          </div>
        </div>
      </section>
    </div>
  );
};
