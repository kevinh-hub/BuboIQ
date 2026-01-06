import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download, 
  Play, 
  Lock, 
  Database, 
  Activity, 
  Search, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Server,
  Monitor,
  ArrowRight,
  ArrowDown,
  Clock,
  Zap
} from 'lucide-react';

interface SequenceStep {
  id: string;
  actor: 'installer' | 'agent' | 'api' | 'dashboard';
  action: string;
  description: string;
  isBlocking?: boolean;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  timing?: string;
  endpoint?: string;
}

export function AgentSequenceDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const actors = [
    { id: 'installer', name: 'Installer', icon: Download, color: 'signal-blue' },
    { id: 'agent', name: 'Agent Service', icon: Shield, color: 'iq-neon-green' },
    { id: 'api', name: 'BuboIQ API', icon: Server, color: 'electric-blue' },
    { id: 'dashboard', name: 'Dashboard', icon: Monitor, color: 'amber-warning' }
  ];

  const sequenceSteps: SequenceStep[] = [
    {
      id: 'install',
      actor: 'installer',
      action: 'Install Agent Binary',
      description: 'Cross-platform installer deploys agent and configures service',
      status: 'completed'
    },
    {
      id: 'service_start',
      actor: 'agent',
      action: 'Service Startup',
      description: 'Windows Service / macOS LaunchDaemon / Linux systemd starts',
      status: 'completed',
      timing: 'Immediate'
    },
    {
      id: 'enrollment_request',
      actor: 'agent',
      action: 'ENROLLMENT GATE',
      description: 'Agent requests JWT token with enrollment code',
      status: activeStep >= 2 ? 'completed' : activeStep === 1 ? 'active' : 'pending',
      isBlocking: true,
      endpoint: 'POST /auth/agent/enroll'
    },
    {
      id: 'enrollment_response',
      actor: 'api',
      action: 'Issue JWT & Config',
      description: 'API validates enrollment and returns device JWT + configuration',
      status: activeStep >= 3 ? 'completed' : activeStep === 2 ? 'active' : 'blocked',
      isBlocking: true
    },
    {
      id: 'secure_storage',
      actor: 'agent',
      action: 'Store Credentials',
      description: 'Windows DPAPI / macOS Keychain / Linux secret store',
      status: activeStep >= 4 ? 'completed' : activeStep === 3 ? 'active' : 'blocked'
    },
    {
      id: 'first_snapshot',
      actor: 'agent',
      action: 'FIRST FULL SNAPSHOT',
      description: 'Collect complete device inventory (OS, hardware, software)',
      status: activeStep >= 5 ? 'completed' : activeStep === 4 ? 'active' : 'blocked',
      isBlocking: true,
      endpoint: 'POST /ingest/device'
    },
    {
      id: 'snapshot_response',
      actor: 'api',
      action: 'Accept Inventory',
      description: 'Store device data and calculate initial health score',
      status: activeStep >= 6 ? 'completed' : activeStep === 5 ? 'active' : 'blocked',
      isBlocking: true
    },
    {
      id: 'dashboard_update',
      actor: 'dashboard',
      action: 'Device Appears',
      description: 'New device card visible within minutes',
      status: activeStep >= 7 ? 'completed' : activeStep === 6 ? 'active' : 'blocked'
    },
    {
      id: 'start_loops',
      actor: 'agent',
      action: 'Start Background Loops',
      description: 'Begin heartbeat, telemetry, and command polling',
      status: activeStep >= 8 ? 'completed' : activeStep === 7 ? 'active' : 'blocked',
      timing: 'Every 5 min (health), 6-12h (delta), 1-4h (updates)'
    },
    {
      id: 'discovery_available',
      actor: 'agent',
      action: 'Discovery Available',
      description: 'Network discovery ready but disabled by default (Pro/Team)',
      status: activeStep >= 9 ? 'completed' : 'blocked',
      timing: 'On-demand only'
    }
  ];

  const getActorColor = (actorId: string) => {
    const actor = actors.find(a => a.id === actorId);
    return actor?.color || 'mist-gray';
  };

  const getStepIcon = (step: SequenceStep) => {
    if (step.isBlocking) return Lock;
    if (step.endpoint) return Database;
    return ArrowRight;
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <div className="space-y-6">
      {/* Sequence Header */}
      <Card className="bg-surface-dark/50 border-iq-neon-green/30">
        <CardHeader>
          <CardTitle className="text-iq-neon-green font-space-grotesk">
            Agent Onboarding Sequence
          </CardTitle>
          <CardDescription>
            Sequential flow with mandatory blocking gates - nothing proceeds until gates complete
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Actors Header */}
      <div className="grid grid-cols-4 gap-4">
        {actors.map((actor) => {
          const Icon = actor.icon;
          return (
            <Card key={actor.id} className={`bg-${actor.color}/10 border-${actor.color}/30`}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-8 h-8 text-${actor.color} mx-auto mb-2`} />
                <h4 className={`font-semibold text-${actor.color}`}>{actor.name}</h4>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sequence Steps */}
      <div className="space-y-3">
        {sequenceSteps.map((step, index) => {
          const Icon = getStepIcon(step);
          const actorColor = getActorColor(step.actor);
          const isActive = index === activeStep;
          
          return (
            <Card 
              key={step.id} 
              className={`
                cursor-pointer transition-all duration-300 border-l-4
                ${step.isBlocking 
                  ? 'border-l-amber-warning bg-amber-warning/5 border-amber-warning/20' 
                  : step.status === 'completed'
                  ? 'border-l-iq-neon-green bg-iq-neon-green/5 border-iq-neon-green/20'
                  : step.status === 'active'
                  ? 'border-l-electric-blue bg-electric-blue/5 border-electric-blue/20'
                  : step.status === 'blocked'
                  ? 'border-l-crimson-danger bg-crimson-danger/5 border-crimson-danger/20'
                  : 'border-l-slate-gray bg-surface-dark/50 border-slate-gray/20'
                }
                ${isActive ? 'ring-2 ring-electric-blue/50 transform scale-105' : ''}
              `}
              onClick={() => handleStepClick(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${step.status === 'completed' ? 'bg-iq-neon-green text-dark-midnight' :
                      step.status === 'active' ? 'bg-electric-blue text-white' :
                      step.status === 'blocked' ? 'bg-crimson-danger text-white' :
                      'bg-slate-gray text-white'}
                  `}>
                    {index + 1}
                  </div>

                  {/* Actor Badge */}
                  <Badge className={`bg-${actorColor}/20 text-${actorColor} border-${actorColor}/30`}>
                    {step.actor.toUpperCase()}
                  </Badge>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${step.isBlocking ? 'text-amber-warning' : 'text-white'}`}>
                        {step.action}
                      </h4>
                      
                      {step.isBlocking && (
                        <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
                          BLOCKING GATE
                        </Badge>
                      )}
                      
                      {step.status === 'blocked' && (
                        <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                          BLOCKED
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-mist-gray mt-1">{step.description}</p>
                    
                    {/* Additional Info */}
                    <div className="flex items-center space-x-4 mt-2">
                      {step.endpoint && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Database className="w-3 h-3 text-electric-blue" />
                          <span className="text-electric-blue font-mono">{step.endpoint}</span>
                        </div>
                      )}
                      
                      {step.timing && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Clock className="w-3 h-3 text-mist-gray" />
                          <span className="text-mist-gray">{step.timing}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="text-right">
                    {step.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-iq-neon-green" />
                    )}
                    {step.status === 'active' && (
                      <Zap className="w-6 h-6 text-electric-blue animate-pulse" />
                    )}
                    {step.status === 'blocked' && (
                      <AlertTriangle className="w-6 h-6 text-crimson-danger" />
                    )}
                    {step.status === 'pending' && (
                      <Clock className="w-6 h-6 text-mist-gray" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Critical Requirements */}
      <Card className="bg-crimson-danger/5 border-crimson-danger/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-crimson-danger" />
            <CardTitle className="text-crimson-danger font-space-grotesk">
              Non-Negotiable Requirements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-warning">Enrollment Gate</h4>
              <ul className="text-sm text-mist-gray space-y-1">
                <li>• Agent MUST authenticate before any other activity</li>
                <li>• JWT token stored securely per platform</li>
                <li>• If enrollment fails → NOTHING else starts</li>
                <li>• Exponential backoff on enrollment retry</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-electric-blue">First Snapshot Gate</h4>
              <ul className="text-sm text-mist-gray space-y-1">
                <li>• Complete device inventory MUST succeed first</li>
                <li>• Heartbeat/telemetry/discovery/updates BLOCKED until snapshot</li>
                <li>• Device card appears in dashboard within minutes</li>
                <li>• Backend uses this data for ticket auto-population</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          variant="outline"
          className="border-slate-gray/50"
        >
          Previous Step
        </Button>
        
        <div className="text-sm text-mist-gray">
          Step {activeStep + 1} of {sequenceSteps.length}
        </div>
        
        <Button
          onClick={() => setActiveStep(Math.min(sequenceSteps.length - 1, activeStep + 1))}
          disabled={activeStep === sequenceSteps.length - 1}
          className="bubo-btn-neon-primary"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}