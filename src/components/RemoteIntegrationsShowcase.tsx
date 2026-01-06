import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Ticket, 
  Monitor, 
  Archive, 
  Shield, 
  UserCheck, 
  FileText,
  ArrowLeft,
  CheckCircle,
  Play,
  Clock,
  Users,
  Video
} from 'lucide-react';

type ShowcaseView = 'overview' | 'integrations' | 'session-panel' | 'workroom' | 'artifacts' | 'policies' | 'consent' | 'attached';

export const RemoteIntegrationsShowcase: React.FC = () => {
  const [currentView, setCurrentView] = useState<ShowcaseView>('overview');

  const showcaseComponents = [
    {
      id: 'integrations',
      title: 'Integrations Hub',
      description: 'Connect and manage remote support providers',
      icon: <Settings className="w-5 h-5" />,
      color: 'text-iq-neon-green',
      status: 'Production Ready'
    },
    {
      id: 'session-panel',
      title: 'Ticket Remote Panel',
      description: 'Launch remote sessions from tickets',
      icon: <Ticket className="w-5 h-5" />,
      color: 'text-cyan-accent',
      status: 'Production Ready'
    },
    {
      id: 'workroom',
      title: 'Live Remote Workroom',
      description: 'Active session interface with collaboration',
      icon: <Monitor className="w-5 h-5" />,
      color: 'text-signal-yellow',
      status: 'Production Ready'
    },
    {
      id: 'artifacts',
      title: 'Session Artifact Bundle',
      description: 'Review and attach session artifacts',
      icon: <Archive className="w-5 h-5" />,
      color: 'text-prediction-purple',
      status: 'Production Ready'
    },
    {
      id: 'policies',
      title: 'Policies & Compliance',
      description: 'Configure security and compliance settings',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-amber-warning',
      status: 'Production Ready'
    },
    {
      id: 'consent',
      title: 'End-User Consent',
      description: 'End-user permission and consent flow',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'text-iq-green',
      status: 'Production Ready'
    },
    {
      id: 'attached',
      title: 'Attached Session View',
      description: 'Read-only view of completed sessions',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-crimson-danger',
      status: 'Production Ready'
    }
  ];

  const renderComponentDemo = (componentId: string) => {
    const component = showcaseComponents.find(c => c.id === componentId);
    if (!component) return null;

    switch (componentId) {
      case 'integrations':
        return <IntegrationsDemo />;
      case 'session-panel':
        return <SessionPanelDemo />;
      case 'workroom':
        return <WorkroomDemo />;
      case 'artifacts':
        return <ArtifactsDemo />;
      case 'policies':
        return <PoliciesDemo />;
      case 'consent':
        return <ConsentDemo />;
      case 'attached':
        return <AttachedSessionDemo />;
      default:
        return (
          <div className="text-center py-12">
            <div className={`w-16 h-16 bg-surface-dark/50 rounded-full flex items-center justify-center mx-auto mb-4 ${component.color}`}>
              {component.icon}
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
              {component.title}
            </h3>
            <p className="text-mist-gray max-w-md mx-auto">
              {component.description}
            </p>
            <Badge className="mt-4 bg-iq-green/20 text-iq-green border-iq-green/30">
              {component.status}
            </Badge>
          </div>
        );
    }
  };

  if (currentView !== 'overview') {
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
                <div className={showcaseComponents.find(c => c.id === currentView)?.color}>
                  {showcaseComponents.find(c => c.id === currentView)?.icon}
                </div>
                <div>
                  <h1 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                    {showcaseComponents.find(c => c.id === currentView)?.title}
                  </h1>
                  <p className="text-sm text-mist-gray">
                    {showcaseComponents.find(c => c.id === currentView)?.description}
                  </p>
                </div>
              </div>
            </div>
            
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              Production Ready
            </Badge>
          </div>
        </div>

        {/* Component Content */}
        <div className="p-6">
          {renderComponentDemo(currentView)}
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
          {showcaseComponents.map((component) => (
            <Card 
              key={component.id}
              className="bubo-glass p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentView(component.id as ShowcaseView)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-surface-dark/50 rounded-lg flex items-center justify-center ${component.color} group-hover:scale-110 transition-transform`}>
                  {component.icon}
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                    {component.title}
                  </h3>
                  <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30 text-xs mt-1">
                    {component.status}
                  </Badge>
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

        {/* System Status */}
        <Card className="bubo-glass p-6">
          <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-iq-green/10 rounded-lg">
              <CheckCircle className="w-8 h-8 text-iq-green mx-auto mb-2" />
              <p className="text-sm font-medium text-iq-green">Backend API</p>
              <p className="text-xs text-mist-gray">Fully Functional</p>
            </div>
            
            <div className="text-center p-4 bg-iq-green/10 rounded-lg">
              <Settings className="w-8 h-8 text-iq-green mx-auto mb-2" />
              <p className="text-sm font-medium text-iq-green">Integrations</p>
              <p className="text-xs text-mist-gray">6 Providers Ready</p>
            </div>
            
            <div className="text-center p-4 bg-iq-green/10 rounded-lg">
              <Shield className="w-8 h-8 text-iq-green mx-auto mb-2" />
              <p className="text-sm font-medium text-iq-green">Webhooks</p>
              <p className="text-xs text-mist-gray">Active & Secure</p>
            </div>
            
            <div className="text-center p-4 bg-iq-green/10 rounded-lg">
              <Archive className="w-8 h-8 text-iq-green mx-auto mb-2" />
              <p className="text-sm font-medium text-iq-green">Artifacts</p>
              <p className="text-xs text-mist-gray">Storage Ready</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Demo Components (simplified versions)
const IntegrationsDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { name: 'Splashtop', status: 'Connected', icon: '🖥️' },
      { name: 'ScreenConnect', status: 'Disconnected', icon: '🔗' },
      { name: 'BeyondTrust', status: 'Connected', icon: '🛡️' }
    ].map((provider, i) => (
      <Card key={i} className="bubo-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{provider.icon}</span>
          <div>
            <h3 className="font-semibold text-pure-white">{provider.name}</h3>
            <Badge className={provider.status === 'Connected' 
              ? 'bg-iq-green/20 text-iq-green' 
              : 'bg-mist-gray/20 text-mist-gray'
            }>
              {provider.status}
            </Badge>
          </div>
        </div>
        <Button className="bubo-btn-secondary w-full">
          {provider.status === 'Connected' ? 'Configure' : 'Connect'}
        </Button>
      </Card>
    ))}
  </div>
);

const SessionPanelDemo = () => (
  <div className="space-y-6">
    <Card className="bubo-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
          Ticket #4321 - Remote Support
        </h3>
        <Button className="bubo-btn-neon-primary">
          <Play className="w-4 h-4 mr-2" />
          Start Remote Session
        </Button>
      </div>
      <div className="flex items-center gap-4 text-sm text-mist-gray">
        <div className="flex items-center gap-1">
          <Monitor className="w-4 h-4" />
          <span>WS-JENNIFER-PC</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-iq-green rounded-full" />
          <span>Online</span>
        </div>
      </div>
    </Card>
  </div>
);

const WorkroomDemo = () => (
  <div className="bg-dark-midnight rounded-xl p-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bubo-glass p-4">
        <h4 className="font-semibold text-pure-white mb-3">Technicians</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-iq-green rounded-full" />
            <span className="text-cloud-white text-sm">Kevin H.</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-iq-green rounded-full" />
            <span className="text-cloud-white text-sm">Sarah M.</span>
          </div>
        </div>
      </Card>
      
      <Card className="bubo-glass p-4 lg:col-span-2">
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Monitor className="w-16 h-16 text-mist-gray mx-auto mb-4 opacity-50" />
            <p className="text-mist-gray">Remote Desktop Session</p>
            <Badge className="mt-2 bg-crimson-danger/20 text-crimson-danger">
              Recording Active
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const ArtifactsDemo = () => (
  <div className="space-y-6">
    <Card className="bubo-glass p-6">
      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">Session Artifacts</h3>
      <div className="space-y-3">
        {[
          { name: 'session-recording.mp4', size: '142.3 MB', type: 'recording' },
          { name: 'session-transcript.vtt', size: '8.2 KB', type: 'transcript' },
          { name: 'session-actions.json', size: '4.1 KB', type: 'actions' }
        ].map((artifact, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Video className="w-4 h-4 text-crimson-danger" />
              <div>
                <p className="text-cloud-white text-sm">{artifact.name}</p>
                <p className="text-mist-gray text-xs">{artifact.size}</p>
              </div>
            </div>
            <Button size="sm" className="bubo-btn-ghost">Download</Button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const PoliciesDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="bubo-glass p-6">
      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">Security Policies</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-cloud-white text-sm">Require Consent</span>
          <div className="w-10 h-6 bg-iq-green rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-cloud-white text-sm">Mandatory Recording</span>
          <div className="w-10 h-6 bg-iq-green rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-cloud-white text-sm">Session Watermark</span>
          <div className="w-10 h-6 bg-iq-green rounded-full" />
        </div>
      </div>
    </Card>
    
    <Card className="bubo-glass p-6">
      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">Compliance Status</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-iq-green" />
          <span className="text-cloud-white text-sm">GDPR Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-iq-green" />
          <span className="text-cloud-white text-sm">SOC 2 Type II</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-iq-green" />
          <span className="text-cloud-white text-sm">HIPAA Compliant</span>
        </div>
      </div>
    </Card>
  </div>
);

const ConsentDemo = () => (
  <Card className="bubo-glass p-8 max-w-2xl mx-auto">
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-iq-neon-green" />
      </div>
      <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
        Remote Support Request
      </h2>
      <p className="text-mist-gray">Kevin from BuboIQ requests access to WS-JENNIFER-PC</p>
    </div>
    
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
        <span className="text-cloud-white text-sm">View Screen</span>
        <div className="w-10 h-6 bg-iq-green rounded-full" />
      </div>
      <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
        <span className="text-cloud-white text-sm">Control Input</span>
        <div className="w-10 h-6 bg-iq-green rounded-full" />
      </div>
    </div>
    
    <div className="flex gap-4">
      <Button className="bubo-btn-neon-primary flex-1">Grant Access</Button>
      <Button className="bubo-btn-secondary flex-1">Deny Access</Button>
    </div>
  </Card>
);

const AttachedSessionDemo = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <Card className="bubo-glass p-6">
        <div className="aspect-video bg-dark-midnight rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Play className="w-16 h-16 text-mist-gray opacity-50 mx-auto mb-4" />
            <p className="text-mist-gray">Session Recording Playback</p>
            <p className="text-sm text-slate-gray">23m 45s duration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="bubo-btn-secondary">
            <Play className="w-4 h-4" />
          </Button>
          <div className="flex-1 h-2 bg-slate-gray/30 rounded-full">
            <div className="h-full w-1/3 bg-iq-neon-green rounded-full" />
          </div>
          <span className="text-sm text-cloud-white font-jetbrains-mono">12:34 / 23:45</span>
        </div>
      </Card>
    </div>
    
    <Card className="bubo-glass p-6">
      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">AI Summary</h3>
      <div className="space-y-3 text-sm">
        <div>
          <h4 className="text-cloud-white font-medium">Root Cause</h4>
          <p className="text-mist-gray">Corrupted print spooler cache preventing service startup</p>
        </div>
        <div>
          <h4 className="text-cloud-white font-medium">Fix Applied</h4>
          <p className="text-mist-gray">Cleared cache, restarted service, updated driver</p>
        </div>
      </div>
      <Button className="bubo-btn-secondary w-full mt-4">Copy to notes</Button>
    </Card>
  </div>
);