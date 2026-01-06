import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  RemoteIntegrationsHub,
  RemoteSessionPanel,
  RemoteWorkroom,
  SessionArtifactBundle,
  RemotePoliciesSettings,
  EndUserConsentScreen,
  AttachedSessionView
} from './remote';
import { 
  Settings, 
  Ticket, 
  Monitor, 
  Archive, 
  Shield, 
  UserCheck, 
  FileText,
  ArrowLeft
} from 'lucide-react';

type DemoView = 'overview' | 'integrations' | 'session-panel' | 'workroom' | 'artifacts' | 'policies' | 'consent' | 'attached';

export const RemoteIntegrationsDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<DemoView>('overview');

  const demoComponents = [
    {
      id: 'integrations',
      title: 'Integrations Hub',
      description: 'Connect and manage remote support providers',
      icon: <Settings className="w-5 h-5" />,
      color: 'text-iq-neon-green',
      component: <RemoteIntegrationsHub />
    },
    {
      id: 'session-panel',
      title: 'Ticket Remote Panel',
      description: 'Launch remote sessions from tickets',
      icon: <Ticket className="w-5 h-5" />,
      color: 'text-cyan-accent',
      component: <RemoteSessionPanel />
    },
    {
      id: 'workroom',
      title: 'Live Remote Workroom',
      description: 'Active session interface with collaboration',
      icon: <Monitor className="w-5 h-5" />,
      color: 'text-signal-yellow',
      component: <RemoteWorkroom />
    },
    {
      id: 'artifacts',
      title: 'Session Artifact Bundle',
      description: 'Review and attach session artifacts',
      icon: <Archive className="w-5 h-5" />,
      color: 'text-prediction-purple',
      component: <SessionArtifactBundle />
    },
    {
      id: 'policies',
      title: 'Policies & Compliance',
      description: 'Configure security and compliance settings',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-amber-warning',
      component: <RemotePoliciesSettings />
    },
    {
      id: 'consent',
      title: 'End-User Consent',
      description: 'End-user permission and consent flow',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'text-iq-green',
      component: <EndUserConsentScreen />
    },
    {
      id: 'attached',
      title: 'Attached Session View',
      description: 'Read-only view of completed sessions',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-crimson-danger',
      component: <AttachedSessionView />
    }
  ];

  const currentComponent = demoComponents.find(comp => comp.id === currentView);

  if (currentView !== 'overview' && currentComponent) {
    return (
      <div className="min-h-screen bg-dark-midnight">
        {/* Navigation Header */}
        <div className="sticky top-0 z-50 bg-surface-dark/95 backdrop-blur-sm border-b border-slate-gray/30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setCurrentView('overview')}
                className="bubo-btn-ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              
              <div className="flex items-center gap-3">
                <div className={`${currentComponent.color}`}>
                  {currentComponent.icon}
                </div>
                <div>
                  <h1 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                    {currentComponent.title}
                  </h1>
                  <p className="text-sm text-mist-gray">
                    {currentComponent.description}
                  </p>
                </div>
              </div>
            </div>
            
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              Demo Mode
            </Badge>
          </div>
        </div>

        {/* Component Content */}
        <div className="relative">
          {currentComponent.component}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-midnight p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-pure-white mb-4">
            BuboIQ Remote Integrations
          </h1>
          <p className="text-xl text-mist-gray max-w-3xl mx-auto">
            Production-ready remote support platform with provider-agnostic integrations, 
            AI-powered session analysis, and full compliance controls.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              See More. Solve Faster.
            </Badge>
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
              Integration-First Design
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoComponents.map((component) => (
            <Card 
              key={component.id}
              className="bubo-glass p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentView(component.id as DemoView)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-surface-dark/50 rounded-lg flex items-center justify-center ${component.color} group-hover:scale-110 transition-transform`}>
                  {component.icon}
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                    {component.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-mist-gray mb-4 leading-relaxed">
                {component.description}
              </p>
              
              <Button className="bubo-btn-secondary w-full group-hover:bg-iq-neon-green/20 group-hover:border-iq-neon-green/30 group-hover:text-iq-neon-green transition-all">
                Explore Component
              </Button>
            </Card>
          ))}
        </div>

        {/* Architecture Overview */}
        <Card className="bubo-glass p-8 mb-8">
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-6 text-center">
            Integration Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-iq-neon-green" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-2">
                Provider Agnostic
              </h3>
              <p className="text-sm text-mist-gray">
                Swap remote support providers behind a single, consistent UI without code changes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-prediction-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-prediction-purple" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-2">
                Artifact-First
              </h3>
              <p className="text-sm text-mist-gray">
                Automatic collection and AI analysis of session recordings, transcripts, and system actions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-warning" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-2">
                Compliance Ready
              </h3>
              <p className="text-sm text-mist-gray">
                GDPR, SOC 2, and HIPAA compliant with configurable policies and audit trails
              </p>
            </div>
          </div>
        </Card>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
              Supported Providers
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Splashtop', status: 'Production Ready', type: 'Enterprise' },
                { name: 'ScreenConnect', status: 'Production Ready', type: 'Enterprise' },
                { name: 'BeyondTrust', status: 'Production Ready', type: 'Enterprise' },
                { name: 'Zoho Assist', status: 'Beta', type: 'Cloud' },
                { name: 'RustDesk', status: 'Alpha', type: 'Open Source' },
                { name: 'MeshCentral', status: 'Alpha', type: 'Self-Hosted' }
              ].map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                  <div>
                    <span className="text-cloud-white font-medium">{provider.name}</span>
                    <Badge className="ml-2 bg-slate-gray/20 text-slate-gray border-slate-gray/30 text-xs">
                      {provider.type}
                    </Badge>
                  </div>
                  <Badge className={
                    provider.status === 'Production Ready' 
                      ? 'bg-iq-green/20 text-iq-green border-iq-green/30'
                      : provider.status === 'Beta'
                      ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30'
                      : 'bg-mist-gray/20 text-mist-gray border-mist-gray/30'
                  }>
                    {provider.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
              Key Features
            </h3>
            <div className="space-y-3">
              {[
                'Provider-agnostic UI design',
                'Real-time session collaboration',
                'AI-powered session analysis',
                'Automatic artifact collection',
                'Compliance policy enforcement',
                'End-user consent workflows',
                'SIEM integration & export',
                'Encrypted session storage'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full" />
                  <span className="text-cloud-white text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};