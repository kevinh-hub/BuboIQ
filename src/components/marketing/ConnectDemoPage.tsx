import React, { useState } from 'react';
import { ArrowLeft, Monitor, Zap, Shield, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ConnectFeatureBadge } from './ConnectFeatureBadge';
import { ConnectFAQ } from '../connect/ConnectFAQ';
import { TicketConnectPanel } from '../connect/TicketConnectPanel';

interface ConnectDemoPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: (planId?: string) => void;
}

export const ConnectDemoPage: React.FC<ConnectDemoPageProps> = ({ 
  onNavigate, 
  onTryItNow 
}) => {
  const [selectedUserTier, setSelectedUserTier] = useState<'basic' | 'pro'>('pro');

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fix instantly',
      description: 'Fix problems right from issues without switching apps or setting up screen sharing.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enterprise security',
      description: 'Fully encrypted sessions with complete audit logs and compliance support.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team collaboration',
      description: 'Share sessions with your team and keep recordings for training.'
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Works everywhere',
      description: 'Connect to any computer type through multiple providers and protocols.'
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Get issue',
      description: 'User reports a problem the usual way',
      highlight: false
    },
    {
      step: 2,
      title: 'Click Connect',
      description: 'One click to connect right from the issue',
      highlight: true
    },
    {
      step: 3,
      title: 'Fix & close',
      description: 'Fix the problem and auto-update issue status',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              onClick={() => onNavigate('features')}
              variant="ghost"
              className="text-mist-gray hover:text-pure-white mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Features
            </Button>
            <ConnectFeatureBadge size="lg" />
          </div>

          <div className="text-center mb-16">
            <h1 className="font-space-grotesk text-5xl md:text-7xl font-bold text-pure-white mb-8 leading-tight">
              Fix problems instantly with<br />
              <span className="text-iq-neon-green bubo-neon-text-green">built-in remote access</span>
            </h1>
            
            <p className="text-xl text-mist-gray mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop switching between tools. Connect to any computer right from your issues 
              and fix problems fast with enterprise security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={() => onTryItNow('pro')}
                className="bubo-btn-neon-primary text-xl px-10 py-6"
                size="lg"
              >
                Start Pro Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                onClick={() => onNavigate('pricing')}
                className="bubo-btn-secondary text-xl px-10 py-6"
                size="lg"
              >
                See Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-dark/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl font-bold text-pure-white mb-4">
              See Connect in Action
            </h2>
            <p className="text-lg text-mist-gray mb-8">
              Experience how remote access integrates smoothly into your ticket workflow
            </p>
            
            {/* User Tier Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-surface-dark rounded-2xl p-2 flex space-x-2">
                <button
                  onClick={() => setSelectedUserTier('basic')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedUserTier === 'basic'
                      ? 'bg-mist-gray/20 text-pure-white'
                      : 'text-mist-gray hover:text-pure-white'
                  }`}
                >
                  Basic User View
                </button>
                <button
                  onClick={() => setSelectedUserTier('pro')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedUserTier === 'pro'
                      ? 'bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30'
                      : 'text-mist-gray hover:text-pure-white'
                  }`}
                >
                  Pro User View
                </button>
              </div>
            </div>
          </div>

          {/* Demo Panel */}
          <div className="max-w-2xl mx-auto">
            <TicketConnectPanel
              ticketId="DEMO-001"
              userTier={selectedUserTier}
              onUpgrade={() => onNavigate('pricing')}
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl font-bold text-pure-white mb-4">
              Streamlined Workflow
            </h2>
            <p className="text-lg text-mist-gray">
              From problem to resolution in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <div
                key={step.step}
                className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                  step.highlight 
                    ? 'bubo-glass-bright border-iq-neon-green/30 bubo-glow-green' 
                    : 'bubo-glass border-iq-neon-green/10'
                }`}
              >
                <div className={`
                  w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold
                  ${step.highlight 
                    ? 'bg-iq-neon-green/20 text-iq-neon-green border-2 border-iq-neon-green/50' 
                    : 'bg-surface-dark text-mist-gray border-2 border-mist-gray/30'
                  }
                `}>
                  {step.step}
                </div>
                <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-3">
                  {step.title}
                </h3>
                <p className="text-mist-gray leading-relaxed">
                  {step.description}
                </p>
                {step.highlight && (
                  <div className="mt-4">
                    <ConnectFeatureBadge size="sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-iq-neon-green/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-4xl font-bold text-pure-white mb-4">
              Why Teams Love Connect
            </h2>
            <p className="text-lg text-mist-gray">
              Built for IT professionals who need speed, security, and simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bubo-glass p-8 rounded-2xl border border-iq-neon-green/20 hover:border-iq-neon-green/40 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center text-iq-neon-green flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-mist-gray leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bubo-glass rounded-3xl p-12 border border-iq-neon-green/20">
            <div className="w-20 h-20 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-iq-neon-green" />
            </div>
            
            <h2 className="font-space-grotesk text-3xl font-bold text-pure-white mb-6">
              Enterprise-Grade Security
            </h2>
            
            <p className="text-lg text-mist-gray mb-8 leading-relaxed">
              Every remote session is end-to-end encrypted with AES-256, fully logged for compliance, 
              and integrated with your existing SSO infrastructure.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-iq-neon-green mx-auto" />
                <div className="font-semibold text-pure-white">SOC 2 Type II</div>
                <div className="text-sm text-mist-gray">Certified compliance</div>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-iq-neon-green mx-auto" />
                <div className="font-semibold text-pure-white">GDPR Ready</div>
                <div className="text-sm text-mist-gray">European data protection</div>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-iq-neon-green mx-auto" />
                <div className="font-semibold text-pure-white">Zero Trust</div>
                <div className="text-sm text-mist-gray">Device verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ConnectFAQ />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-iq-neon-green/10 to-electric-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-pure-white mb-6">
            Ready to Transform Your IT Support?
          </h2>
          <p className="text-xl text-mist-gray mb-12 leading-relaxed">
            Start your free Pro trial today and experience the power of integrated remote access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => onTryItNow('pro')}
              className="bubo-btn-neon-primary text-xl px-12 py-6"
              size="lg"
            >
              Start Free Trial
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button 
              onClick={() => onNavigate('demo')}
              className="bubo-btn-secondary text-xl px-12 py-6"
              size="lg"
            >
              Watch Demo
            </Button>
          </div>
          
          <p className="text-mist-gray text-sm mt-8">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};