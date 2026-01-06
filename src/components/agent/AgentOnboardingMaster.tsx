import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Download, 
  Activity, 
  Monitor, 
  Shield, 
  Lock, 
  Database,
  Eye,
  Play,
  AlertTriangle
} from 'lucide-react';
import { AgentOnboardingFlow } from './AgentOnboardingFlow';
import { AgentSequenceDiagram } from './AgentSequenceDiagram';
import { BlockingGatesVisualization } from './BlockingGatesVisualization';

interface AgentOnboardingMasterProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AgentOnboardingMaster({ isOpen = true, onClose }: AgentOnboardingMasterProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Eye,
      description: 'Complete onboarding flow visualization'
    },
    {
      id: 'installer',
      label: 'Installer Flow',
      icon: Download,
      description: 'Cross-platform installation process'
    },
    {
      id: 'sequence',
      label: 'Sequence Diagram',
      icon: Activity,
      description: 'Step-by-step technical flow'
    },
    {
      id: 'gates',
      label: 'Blocking Gates',
      icon: Lock,
      description: 'Interactive blocking gates demo'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Master Header */}
      <Card className="bg-surface-dark/50 border-iq-neon-green/30">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-iq-neon-green" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-iq-neon-green font-space-grotesk">
                BuboIQ Agent Onboarding System
              </CardTitle>
              <CardDescription className="text-lg">
                Complete visualization of the endpoint agent deployment and integration flow
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-amber-warning/5 border-amber-warning/20">
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-amber-warning" />
                <div>
                  <h4 className="font-semibold text-amber-warning">Enrollment Gate</h4>
                  <p className="text-xs text-mist-gray">JWT authentication required</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-electric-blue/5 border-electric-blue/20">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-electric-blue" />
                <div>
                  <h4 className="font-semibold text-electric-blue">First Snapshot</h4>
                  <p className="text-xs text-mist-gray">Complete inventory sync</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-iq-neon-green" />
                <div>
                  <h4 className="font-semibold text-iq-neon-green">Background Loops</h4>
                  <p className="text-xs text-mist-gray">Monitoring & telemetry</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Contract */}
      <Card className="bg-crimson-danger/5 border-crimson-danger/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-crimson-danger" />
            <CardTitle className="text-crimson-danger font-space-grotesk">
              Non-Negotiable Contract
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
                  <span className="text-iq-neon-green font-bold">1</span>
                </div>
                <h4 className="font-semibold text-iq-neon-green">Agent Launches Instantly</h4>
              </div>
              <p className="text-sm text-mist-gray">
                Service starts immediately after installation and begins enrollment process
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-warning/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-warning font-bold">2</span>
                </div>
                <h4 className="font-semibold text-amber-warning">Completes Enrollment</h4>
              </div>
              <p className="text-sm text-mist-gray">
                JWT authentication must succeed before any background activity can begin
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                  <span className="text-electric-blue font-bold">3</span>
                </div>
                <h4 className="font-semibold text-electric-blue">Sends First Snapshot</h4>
              </div>
              <p className="text-sm text-mist-gray">
                Complete device inventory to /ingest/device before any loops start
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-surface-dark/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center space-x-2 data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-surface-dark/50">
            <CardHeader>
              <CardTitle className="text-iq-neon-green font-space-grotesk">
                Complete Onboarding Overview
              </CardTitle>
              <CardDescription>
                End-to-end visualization of the agent deployment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgentOnboardingFlow isOpen={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installer" className="space-y-6">
          <Card className="bg-surface-dark/50">
            <CardHeader>
              <CardTitle className="text-signal-blue font-space-grotesk">
                Cross-Platform Installer Flow
              </CardTitle>
              <CardDescription>
                Platform-specific installation with service startup and enrollment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Platform Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-signal-blue/10 border-signal-blue/30">
                    <CardHeader>
                      <CardTitle className="text-signal-blue">Windows</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm space-y-1">
                        <p><strong>Installer:</strong> NSIS (.exe)</p>
                        <p><strong>Service:</strong> Windows Service</p>
                        <p><strong>Storage:</strong> DPAPI encryption</p>
                        <p><strong>Config:</strong> ProgramData\BuboIQ</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-cloud-white/10 border-cloud-white/30">
                    <CardHeader>
                      <CardTitle className="text-cloud-white">macOS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm space-y-1">
                        <p><strong>Installer:</strong> PKG package</p>
                        <p><strong>Service:</strong> LaunchDaemon</p>
                        <p><strong>Storage:</strong> Keychain Services</p>
                        <p><strong>Config:</strong> /Library/Application Support</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-warning/10 border-amber-warning/30">
                    <CardHeader>
                      <CardTitle className="text-amber-warning">Linux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm space-y-1">
                        <p><strong>Installer:</strong> DEB/RPM packages</p>
                        <p><strong>Service:</strong> systemd daemon</p>
                        <p><strong>Storage:</strong> Encrypted file store</p>
                        <p><strong>Config:</strong> /etc/buboiq</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service Startup Flow */}
                <div className="p-4 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
                  <h4 className="font-semibold text-iq-neon-green mb-3">Service Startup Sequence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4 text-iq-neon-green" />
                      <span className="text-sm">1. Service starts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-amber-warning" />
                      <span className="text-sm">2. Waits for enrollment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-electric-blue" />
                      <span className="text-sm">3. First snapshot</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-iq-neon-green" />
                      <span className="text-sm">4. Background loops</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequence" className="space-y-6">
          <AgentSequenceDiagram />
        </TabsContent>

        <TabsContent value="gates" className="space-y-6">
          <BlockingGatesVisualization />
        </TabsContent>
      </Tabs>

      {/* Agent Orb Visualization */}
      <Card className="bg-surface-dark/50 border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white font-space-grotesk">
            Agent Orb Status Indicator
          </CardTitle>
          <CardDescription>
            Visual representation of agent state throughout onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-slate-gray/50 bg-slate-gray/20 flex items-center justify-center">
                <Monitor className="w-8 h-8 text-mist-gray" />
              </div>
              <div>
                <h4 className="font-semibold text-mist-gray">Dormant</h4>
                <p className="text-xs text-mist-gray">Service installed, awaiting enrollment</p>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-warning/50 bg-amber-warning/20 flex items-center justify-center animate-pulse">
                <Monitor className="w-8 h-8 text-amber-warning" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-warning">Enrolling</h4>
                <p className="text-xs text-mist-gray">Validating organization credentials</p>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-electric-blue/50 bg-electric-blue/20 flex items-center justify-center animate-spin">
                <Monitor className="w-8 h-8 text-electric-blue" />
              </div>
              <div>
                <h4 className="font-semibold text-electric-blue">Syncing</h4>
                <p className="text-xs text-mist-gray">First snapshot in progress</p>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-iq-neon-green/50 bg-iq-neon-green/20 flex items-center justify-center bubo-animate-pulse-glow">
                <Monitor className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div>
                <h4 className="font-semibold text-iq-neon-green">Active</h4>
                <p className="text-xs text-mist-gray">Full monitoring and management</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-iq-neon-green" />
              <span className="text-sm text-iq-neon-green font-medium">
                Critical: Agent orb does NOT pulse until first snapshot completes successfully
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AgentOnboardingMaster;