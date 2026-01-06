import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Download, 
  Shield, 
  Monitor, 
  Wifi, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Server,
  RefreshCw,
  Lock,
  Key,
  Database,
  Search,
  Ticket,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  Eye,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Timer
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface AgentOnboardingFlowProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'blocked' | 'error';
  isBlockingGate?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  dependencies?: string[];
}

export function AgentOnboardingFlow({ isOpen = true, onClose }: AgentOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [agentOrb, setAgentOrb] = useState<'dormant' | 'enrolling' | 'syncing' | 'active'>('dormant');
  const [enrollmentCode, setEnrollmentCode] = useState('ACME-2024-ABC123-DEF456');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [firstSyncProgress, setFirstSyncProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'installer' | 'timeline' | 'dashboard'>('installer');

  const flowSteps: FlowStep[] = [
    {
      id: 'install',
      title: 'Install Agent',
      description: 'Download and install the BuboIQ agent on target device',
      status: 'completed',
      icon: Download
    },
    {
      id: 'service_start',
      title: 'Service Started',
      description: 'Agent service initialized and running',
      status: 'completed',
      icon: Play,
      dependencies: ['install']
    },
    {
      id: 'enrollment',
      title: 'ENROLLMENT GATE',
      description: 'Device must authenticate with organization before proceeding',
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'active' : 'pending',
      isBlockingGate: true,
      icon: Lock,
      dependencies: ['service_start']
    },
    {
      id: 'first_snapshot',
      title: 'FIRST FULL SNAPSHOT',
      description: 'Complete device inventory must be sent before any background loops start',
      status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'active' : 'blocked',
      isBlockingGate: true,
      icon: Database,
      dependencies: ['enrollment']
    },
    {
      id: 'background_loops',
      title: 'Background Monitoring',
      description: 'Health telemetry, delta sync, and commands - ONLY after first snapshot',
      status: currentStep >= 4 ? 'active' : 'blocked',
      icon: Activity,
      dependencies: ['first_snapshot']
    },
    {
      id: 'discovery',
      title: 'Network Discovery',
      description: 'Optional discovery jobs (Pro/Team) - disabled by default to prevent overload',
      status: 'blocked',
      icon: Search,
      dependencies: ['background_loops']
    }
  ];

  useEffect(() => {
    if (currentStep === 1) setAgentOrb('enrolling');
    else if (currentStep === 2) setAgentOrb('syncing');
    else if (currentStep >= 3) setAgentOrb('active');
  }, [currentStep]);

  // Simulate first sync progress
  useEffect(() => {
    if (currentStep === 2) {
      const interval = setInterval(() => {
        setFirstSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleEnrollment = () => {
    setEnrollmentStatus('validating');
    setTimeout(() => {
      setEnrollmentStatus('success');
      setCurrentStep(2);
    }, 2000);
  };

  const handleNextStep = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepStatus = (step: FlowStep, index: number) => {
    if (step.isBlockingGate && index > currentStep) return 'blocked';
    if (index === currentStep) return 'active';
    if (index < currentStep) return 'completed';
    return 'pending';
  };

  const renderAgentOrb = () => {
    const orbClasses = {
      dormant: 'bg-slate-gray/30 border-slate-gray/50',
      enrolling: 'bg-amber-warning/20 border-amber-warning/50 animate-pulse',
      syncing: 'bg-electric-blue/20 border-electric-blue/50 animate-spin',
      active: 'bg-iq-neon-green/20 border-iq-neon-green/50 bubo-animate-pulse-glow'
    };

    return (
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${orbClasses[agentOrb]}`}>
        <Monitor className={`w-8 h-8 ${
          agentOrb === 'active' ? 'text-iq-neon-green' :
          agentOrb === 'syncing' ? 'text-electric-blue' :
          agentOrb === 'enrolling' ? 'text-amber-warning' : 'text-mist-gray'
        }`} />
      </div>
    );
  };

  const renderInstaller = () => (
    <div className="space-y-6">
      {/* Platform Selection */}
      <Card className="bg-surface-dark/50 border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-iq-neon-green font-space-grotesk">
            Install BuboIQ Agent
          </CardTitle>
          <CardDescription>
            Cross-platform installation with instant service startup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-dark-midnight/50 border-signal-blue/30 cursor-pointer hover:border-signal-blue/50 transition-colors">
              <CardContent className="p-4 text-center space-y-2">
                <Monitor className="w-8 h-8 text-signal-blue mx-auto" />
                <h4 className="font-semibold">Windows</h4>
                <p className="text-xs text-mist-gray">Service + NSIS Installer</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-midnight/50 border-cloud-white/30 cursor-pointer hover:border-cloud-white/50 transition-colors">
              <CardContent className="p-4 text-center space-y-2">
                <Monitor className="w-8 h-8 text-cloud-white mx-auto" />
                <h4 className="font-semibold">macOS</h4>
                <p className="text-xs text-mist-gray">LaunchDaemon + PKG</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-midnight/50 border-amber-warning/30 cursor-pointer hover:border-amber-warning/50 transition-colors">
              <CardContent className="p-4 text-center space-y-2">
                <Server className="w-8 h-8 text-amber-warning mx-auto" />
                <h4 className="font-semibold">Linux</h4>
                <p className="text-xs text-mist-gray">systemd + DEB/RPM</p>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5" />
              <div>
                <p className="font-medium text-iq-neon-green">Service Auto-Start</p>
                <p className="text-sm text-mist-gray">
                  Agent service launches immediately after installation and begins enrollment process.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Gate */}
      <Card className="bg-surface-dark/50 border-amber-warning/30">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-warning" />
            </div>
            <div>
              <CardTitle className="text-amber-warning font-space-grotesk">
                ENROLLMENT GATE (Blocking)
              </CardTitle>
              <CardDescription>
                No background activity until JWT authentication succeeds
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enrollment-code">Organization Enrollment Code</Label>
            <Input
              id="enrollment-code"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value)}
              className="font-mono bg-dark-midnight/50"
              placeholder="ORG-YYYY-XXXXXX-CHECKSUM"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {renderAgentOrb()}
              <div>
                <p className="font-medium">Agent Status</p>
                <p className="text-sm text-mist-gray">
                  {agentOrb === 'dormant' ? 'Awaiting enrollment' :
                   agentOrb === 'enrolling' ? 'Validating credentials...' :
                   agentOrb === 'syncing' ? 'First snapshot in progress' : 'Active and monitoring'}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleEnrollment}
              disabled={enrollmentStatus === 'validating' || currentStep >= 2}
              className="bubo-btn-neon-primary"
            >
              {enrollmentStatus === 'validating' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {currentStep >= 2 ? 'Enrolled' : 'Enroll Device'}
            </Button>
          </div>

          {enrollmentStatus === 'success' && (
            <div className="p-3 border rounded-lg bg-iq-neon-green/10 border-iq-neon-green/30">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                <span className="text-sm text-iq-neon-green font-medium">
                  Enrollment successful! JWT token secured.
                </span>
              </div>
            </div>
          )}

          <div className="p-4 border rounded-lg bg-crimson-danger/5 border-crimson-danger/20">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-crimson-danger mt-0.5" />
              <div>
                <p className="font-medium text-crimson-danger">Critical Blocking Gate</p>
                <p className="text-sm text-mist-gray">
                  Heartbeat, telemetry, discovery, and updates remain BLOCKED until enrollment completes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First Snapshot Gate */}
      {currentStep >= 2 && (
        <Card className="bg-surface-dark/50 border-electric-blue/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <CardTitle className="text-electric-blue font-space-grotesk">
                  FIRST FULL SNAPSHOT (Blocking)
                </CardTitle>
                <CardDescription>
                  Complete device inventory required before background loops start
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection Progress</span>
                <span className="text-sm text-mist-gray">{Math.round(firstSyncProgress)}%</span>
              </div>
              <Progress value={firstSyncProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-dark-midnight/30">
                <Cpu className="w-4 h-4 text-signal-blue" />
                <span className="text-xs">CPU & Hardware</span>
                {firstSyncProgress > 25 && <CheckCircle className="w-3 h-3 text-iq-neon-green ml-auto" />}
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-dark-midnight/30">
                <MemoryStick className="w-4 h-4 text-signal-blue" />
                <span className="text-xs">Memory & Storage</span>
                {firstSyncProgress > 50 && <CheckCircle className="w-3 h-3 text-iq-neon-green ml-auto" />}
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-dark-midnight/30">
                <Network className="w-4 h-4 text-signal-blue" />
                <span className="text-xs">Network Config</span>
                {firstSyncProgress > 75 && <CheckCircle className="w-3 h-3 text-iq-neon-green ml-auto" />}
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded-lg bg-dark-midnight/30">
                <HardDrive className="w-4 h-4 text-signal-blue" />
                <span className="text-xs">Software Inventory</span>
                {firstSyncProgress > 90 && <CheckCircle className="w-3 h-3 text-iq-neon-green ml-auto" />}
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-electric-blue/10 border-electric-blue/30">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-electric-blue" />
                <span className="text-sm text-electric-blue font-medium">
                  API Endpoint: POST /ingest/device
                </span>
              </div>
              <p className="text-xs text-mist-gray mt-1">
                Full device snapshot with OS, hardware, network, and software inventory
              </p>
            </div>

            {firstSyncProgress >= 100 && (
              <div className="p-3 border rounded-lg bg-iq-neon-green/10 border-iq-neon-green/30">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                  <span className="text-sm text-iq-neon-green font-medium">
                    First snapshot complete! Device registered in dashboard.
                  </span>
                </div>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="mt-2 bubo-btn-neon-primary"
                  size="sm"
                >
                  Start Background Monitoring
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-iq-neon-green font-space-grotesk">
          Agent Onboarding Timeline
        </h3>
        <p className="text-mist-gray">
          Sequential flow with mandatory blocking gates
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-gray/50" />
        
        {flowSteps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step, index);
          
          return (
            <div key={step.id} className="relative flex items-start space-x-6 pb-8">
              {/* Timeline Node */}
              <div className={`
                relative z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500
                ${status === 'completed' ? 'bg-iq-neon-green/20 border-iq-neon-green' :
                  status === 'active' ? 'bg-electric-blue/20 border-electric-blue animate-pulse' :
                  status === 'blocked' ? 'bg-crimson-danger/20 border-crimson-danger/50' :
                  'bg-slate-gray/20 border-slate-gray/50'}
                ${step.isBlockingGate ? 'ring-4 ring-amber-warning/30' : ''}
              `}>
                <Icon className={`w-6 h-6 ${
                  status === 'completed' ? 'text-iq-neon-green' :
                  status === 'active' ? 'text-electric-blue' :
                  status === 'blocked' ? 'text-crimson-danger' : 'text-mist-gray'
                }`} />
                
                {status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-iq-neon-green rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-dark-midnight" />
                  </div>
                )}
                
                {status === 'blocked' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-crimson-danger rounded-full flex items-center justify-center">
                    <Pause className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={`font-semibold font-space-grotesk ${
                    step.isBlockingGate ? 'text-amber-warning' : 'text-white'
                  }`}>
                    {step.title}
                  </h4>
                  
                  {step.isBlockingGate && (
                    <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
                      BLOCKING GATE
                    </Badge>
                  )}
                  
                  {status === 'blocked' && (
                    <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                      BLOCKED
                    </Badge>
                  )}
                </div>
                
                <p className="text-mist-gray text-sm mb-3">{step.description}</p>
                
                {/* Dependencies */}
                {step.dependencies && step.dependencies.length > 0 && (
                  <div className="text-xs text-mist-gray">
                    Requires: {step.dependencies.join(', ')}
                  </div>
                )}
                
                {/* Step-specific content */}
                {step.id === 'enrollment' && status === 'active' && (
                  <div className="mt-3 p-3 border rounded-lg bg-amber-warning/5 border-amber-warning/20">
                    <p className="text-xs text-amber-warning">
                      Sequence: org_code → device keypair → JWT → secure storage (DPAPI/Keychain/secret store)
                    </p>
                  </div>
                )}
                
                {step.id === 'first_snapshot' && status === 'active' && (
                  <div className="mt-3 p-3 border rounded-lg bg-electric-blue/5 border-electric-blue/20">
                    <p className="text-xs text-electric-blue">
                      POST /ingest/device: Complete OS, CPU/RAM/storage, NICs, serial/UUID inventory
                    </p>
                  </div>
                )}
                
                {step.id === 'background_loops' && (status === 'active' || status === 'completed') && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <Activity className="w-3 h-3 text-iq-neon-green" />
                      <span className="text-iq-neon-green">Heartbeat & Health: every 5 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <RefreshCw className="w-3 h-3 text-signal-blue" />
                      <span className="text-signal-blue">Delta Inventory: every 6-12 hours</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Timer className="w-3 h-3 text-amber-warning" />
                      <span className="text-amber-warning">Update Checks: 30 min initial, then 1-4 hours</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Critical Annotations */}
      <div className="space-y-3">
        <div className="p-4 border rounded-lg bg-crimson-danger/5 border-crimson-danger/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-crimson-danger mt-0.5" />
            <div>
              <p className="font-medium text-crimson-danger">Critical Requirements</p>
              <ul className="text-sm text-mist-gray mt-2 space-y-1">
                <li>• If enrollment fails → nothing else starts</li>
                <li>• If first snapshot POST fails → nothing else starts</li>
                <li>• Only after first snapshot success do heartbeat/delta/updates/commands begin</li>
                <li>• Discovery jobs disabled by default to prevent network overload</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-iq-neon-green font-space-grotesk">
          Dashboard Integration
        </h3>
        <p className="text-mist-gray">
          Device appears within minutes of successful enrollment
        </p>
      </div>

      {/* New Device Card */}
      <Card className="bg-iq-neon-green/5 border-iq-neon-green/30 bubo-animate-pulse-glow">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-iq-neon-green font-space-grotesk">LAPTOP-USER-2024</CardTitle>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                  NEW DEVICE
                </Badge>
              </div>
              <CardDescription>Windows 11 Pro • 10.0.1.156 • Just enrolled</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-iq-neon-green">87%</div>
              <div className="text-xs text-mist-gray">Health Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-electric-blue">Intel i7</div>
              <div className="text-xs text-mist-gray">CPU</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-electric-blue">32GB</div>
              <div className="text-xs text-mist-gray">Memory</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-electric-blue">1TB SSD</div>
              <div className="text-xs text-mist-gray">Storage</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-iq-neon-green">Online</div>
              <div className="text-xs text-mist-gray">Status</div>
            </div>
          </div>
          
          <Separator className="bg-slate-gray/30" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-mist-gray">Auto-populated from agent data</span>
            <Button size="sm" className="bubo-btn-neon-primary">
              <Ticket className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Creation with Auto-Population */}
      <Card className="bg-surface-dark/50 border-electric-blue/30">
        <CardHeader>
          <CardTitle className="text-electric-blue font-space-grotesk">
            Ticket Auto-Population
          </CardTitle>
          <CardDescription>
            Device context automatically fills ticket forms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-electric-blue/5 border-electric-blue/20">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-iq-neon-green" />
              <span className="font-medium text-iq-neon-green">Auto-populated fields:</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-mist-gray">Device:</span>
                <span className="text-white">LAPTOP-USER-2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">IP Address:</span>
                <span className="text-white">10.0.1.156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Operating System:</span>
                <span className="text-white">Windows 11 Pro (22H2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Health Score:</span>
                <span className="text-iq-neon-green">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Last Seen:</span>
                <span className="text-white">2 minutes ago</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
            <p className="text-sm text-iq-neon-green">
              <strong>Backend uses "latest snapshot"</strong> - All device context comes from the agent's 
              first full snapshot and subsequent delta updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-dark-midnight border-slate-gray/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-iq-neon-green font-space-grotesk">
            BuboIQ Agent Onboarding Flow
          </DialogTitle>
        </DialogHeader>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={viewMode === 'installer' ? 'default' : 'ghost'}
            onClick={() => setViewMode('installer')}
            className={viewMode === 'installer' ? 'bubo-btn-neon-primary' : ''}
          >
            <Download className="w-4 h-4 mr-2" />
            Installer Flow
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            onClick={() => setViewMode('timeline')}
            className={viewMode === 'timeline' ? 'bubo-btn-neon-primary' : ''}
          >
            <Activity className="w-4 h-4 mr-2" />
            Master Timeline
          </Button>
          <Button
            variant={viewMode === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setViewMode('dashboard')}
            className={viewMode === 'dashboard' ? 'bubo-btn-neon-primary' : ''}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Dashboard Integration
          </Button>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'installer' && renderInstaller()}
        {viewMode === 'timeline' && renderTimeline()}
        {viewMode === 'dashboard' && renderDashboard()}
      </DialogContent>
    </Dialog>
  );
}