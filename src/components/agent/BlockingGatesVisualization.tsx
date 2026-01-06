import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Lock, 
  Database, 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Pause,
  Play,
  Eye,
  Clock,
  Zap,
  RefreshCw,
  Search,
  Command,
  Download
} from 'lucide-react';

export function BlockingGatesVisualization() {
  const [gateStatus, setGateStatus] = useState<{
    enrollment: 'locked' | 'unlocking' | 'unlocked';
    firstSnapshot: 'locked' | 'unlocking' | 'unlocked';
  }>({
    enrollment: 'locked',
    firstSnapshot: 'locked'
  });

  const [backgroundServices, setBackgroundServices] = useState({
    heartbeat: false,
    telemetry: false,
    deltaSync: false,
    updateChecks: false,
    commandPolling: false,
    discovery: false
  });

  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [snapshotProgress, setSnapshotProgress] = useState(0);

  // Simulate enrollment process
  const handleEnrollment = () => {
    setGateStatus(prev => ({ ...prev, enrollment: 'unlocking' }));
    setEnrollmentProgress(0);
    
    const interval = setInterval(() => {
      setEnrollmentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGateStatus(prev => ({ ...prev, enrollment: 'unlocked' }));
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);
  };

  // Simulate first snapshot process
  const handleFirstSnapshot = () => {
    if (gateStatus.enrollment !== 'unlocked') return;
    
    setGateStatus(prev => ({ ...prev, firstSnapshot: 'unlocking' }));
    setSnapshotProgress(0);
    
    const interval = setInterval(() => {
      setSnapshotProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGateStatus(prev => ({ ...prev, firstSnapshot: 'unlocked' }));
          // Enable background services
          setBackgroundServices({
            heartbeat: true,
            telemetry: true,
            deltaSync: true,
            updateChecks: true,
            commandPolling: true,
            discovery: false // Still disabled by default
          });
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 200);
  };

  const resetDemo = () => {
    setGateStatus({ enrollment: 'locked', firstSnapshot: 'locked' });
    setBackgroundServices({
      heartbeat: false,
      telemetry: false,
      deltaSync: false,
      updateChecks: false,
      commandPolling: false,
      discovery: false
    });
    setEnrollmentProgress(0);
    setSnapshotProgress(0);
  };

  const getGateIcon = (status: 'locked' | 'unlocking' | 'unlocked') => {
    switch (status) {
      case 'locked': return <Lock className="w-8 h-8 text-crimson-danger" />;
      case 'unlocking': return <RefreshCw className="w-8 h-8 text-amber-warning animate-spin" />;
      case 'unlocked': return <CheckCircle className="w-8 h-8 text-iq-neon-green" />;
    }
  };

  const getGateColor = (status: 'locked' | 'unlocking' | 'unlocked') => {
    switch (status) {
      case 'locked': return 'border-crimson-danger/50 bg-crimson-danger/5';
      case 'unlocking': return 'border-amber-warning/50 bg-amber-warning/5';
      case 'unlocked': return 'border-iq-neon-green/50 bg-iq-neon-green/5';
    }
  };

  const backgroundServicesList = [
    { 
      id: 'heartbeat', 
      name: 'Health Monitoring', 
      description: 'CPU, memory, disk metrics every 5 minutes',
      icon: Activity,
      interval: '5 min'
    },
    { 
      id: 'telemetry', 
      name: 'System Telemetry', 
      description: 'Performance data and alerts',
      icon: Zap,
      interval: '30 sec'
    },
    { 
      id: 'deltaSync', 
      name: 'Delta Inventory', 
      description: 'Incremental device changes',
      icon: RefreshCw,
      interval: '6-12 hours'
    },
    { 
      id: 'updateChecks', 
      name: 'Agent Updates', 
      description: 'Check for new agent versions',
      icon: Download,
      interval: '1-4 hours'
    },
    { 
      id: 'commandPolling', 
      name: 'Remote Commands', 
      description: 'Listen for admin commands',
      icon: Command,
      interval: '1 min'
    },
    { 
      id: 'discovery', 
      name: 'Network Discovery', 
      description: 'Scan for network devices (Pro/Team)',
      icon: Search,
      interval: 'On-demand'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-surface-dark/50 border-amber-warning/30">
        <CardHeader>
          <CardTitle className="text-amber-warning font-space-grotesk">
            Blocking Gates Visualization
          </CardTitle>
          <CardDescription>
            Interactive demonstration of sequential gates that must complete before background services start
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={resetDemo} variant="outline" className="border-slate-gray/50">
              Reset Demo
            </Button>
            <div className="text-sm text-mist-gray">
              Click the gates to simulate the onboarding process
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gate 1: Enrollment */}
      <Card className={`transition-all duration-500 ${getGateColor(gateStatus.enrollment)}`}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`
              w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500
              ${gateStatus.enrollment === 'locked' ? 'border-crimson-danger bg-crimson-danger/10' :
                gateStatus.enrollment === 'unlocking' ? 'border-amber-warning bg-amber-warning/10' :
                'border-iq-neon-green bg-iq-neon-green/10'}
            `}>
              {getGateIcon(gateStatus.enrollment)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-amber-warning font-space-grotesk">
                GATE 1: ENROLLMENT
              </CardTitle>
              <CardDescription>
                Agent must authenticate with organization before ANY background activity
              </CardDescription>
            </div>
            <Button
              onClick={handleEnrollment}
              disabled={gateStatus.enrollment !== 'locked'}
              className={gateStatus.enrollment === 'unlocked' ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'}
            >
              {gateStatus.enrollment === 'locked' ? 'Start Enrollment' :
               gateStatus.enrollment === 'unlocking' ? 'Enrolling...' : 'Enrolled ✓'}
            </Button>
          </div>
        </CardHeader>
        
        {gateStatus.enrollment === 'unlocking' && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enrollment Progress</span>
                <span className="text-sm text-mist-gray">{Math.round(enrollmentProgress)}%</span>
              </div>
              <Progress value={enrollmentProgress} className="h-2" />
              <div className="text-xs text-mist-gray">
                Sequence: org_code → device keypair → JWT → secure storage
              </div>
            </div>
          </CardContent>
        )}

        {gateStatus.enrollment === 'unlocked' && (
          <CardContent>
            <div className="p-3 border rounded-lg bg-iq-neon-green/10 border-iq-neon-green/30">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                <span className="text-sm text-iq-neon-green font-medium">
                  JWT token secured. Agent authenticated.
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Gate 2: First Snapshot */}
      <Card className={`transition-all duration-500 ${getGateColor(gateStatus.firstSnapshot)}`}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`
              w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500
              ${gateStatus.firstSnapshot === 'locked' ? 'border-crimson-danger bg-crimson-danger/10' :
                gateStatus.firstSnapshot === 'unlocking' ? 'border-amber-warning bg-amber-warning/10' :
                'border-iq-neon-green bg-iq-neon-green/10'}
            `}>
              <Database className={`w-8 h-8 ${
                gateStatus.firstSnapshot === 'locked' ? 'text-crimson-danger' :
                gateStatus.firstSnapshot === 'unlocking' ? 'text-amber-warning' :
                'text-iq-neon-green'
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-electric-blue font-space-grotesk">
                GATE 2: FIRST FULL SNAPSHOT
              </CardTitle>
              <CardDescription>
                Complete device inventory must be sent to /ingest/device before background loops start
              </CardDescription>
            </div>
            <Button
              onClick={handleFirstSnapshot}
              disabled={gateStatus.enrollment !== 'unlocked' || gateStatus.firstSnapshot !== 'locked'}
              className={gateStatus.firstSnapshot === 'unlocked' ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'}
            >
              {gateStatus.firstSnapshot === 'locked' ? 'Start Snapshot' :
               gateStatus.firstSnapshot === 'unlocking' ? 'Syncing...' : 'Completed ✓'}
            </Button>
          </div>
        </CardHeader>
        
        {gateStatus.enrollment !== 'unlocked' && (
          <CardContent>
            <div className="p-3 border rounded-lg bg-crimson-danger/10 border-crimson-danger/30">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-crimson-danger" />
                <span className="text-sm text-crimson-danger font-medium">
                  BLOCKED: Enrollment must complete first
                </span>
              </div>
            </div>
          </CardContent>
        )}

        {gateStatus.firstSnapshot === 'unlocking' && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Snapshot Progress</span>
                <span className="text-sm text-mist-gray">{Math.round(snapshotProgress)}%</span>
              </div>
              <Progress value={snapshotProgress} className="h-2" />
              <div className="text-xs text-mist-gray">
                Collecting: OS info, CPU/RAM/storage, network config, software inventory
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Eye className="w-3 h-3 text-electric-blue" />
                <span className="text-electric-blue">API: POST /ingest/device</span>
              </div>
            </div>
          </CardContent>
        )}

        {gateStatus.firstSnapshot === 'unlocked' && (
          <CardContent>
            <div className="p-3 border rounded-lg bg-iq-neon-green/10 border-iq-neon-green/30">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                <span className="text-sm text-iq-neon-green font-medium">
                  Device registered! Card appears in dashboard within minutes.
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Background Services */}
      <Card className="bg-surface-dark/50 border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white font-space-grotesk">
            Background Services Status
          </CardTitle>
          <CardDescription>
            These services only start AFTER both blocking gates complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backgroundServicesList.map((service) => {
              const Icon = service.icon;
              const isEnabled = backgroundServices[service.id as keyof typeof backgroundServices];
              const isBlocked = gateStatus.firstSnapshot !== 'unlocked';
              
              return (
                <div 
                  key={service.id}
                  className={`
                    p-4 border rounded-lg transition-all duration-500
                    ${isEnabled 
                      ? 'bg-iq-neon-green/10 border-iq-neon-green/30' 
                      : isBlocked
                      ? 'bg-crimson-danger/5 border-crimson-danger/20'
                      : 'bg-slate-gray/10 border-slate-gray/30'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isEnabled 
                        ? 'bg-iq-neon-green/20' 
                        : isBlocked
                        ? 'bg-crimson-danger/20'
                        : 'bg-slate-gray/20'}
                    `}>
                      {isEnabled ? (
                        <Icon className="w-5 h-5 text-iq-neon-green" />
                      ) : isBlocked ? (
                        <Pause className="w-5 h-5 text-crimson-danger" />
                      ) : (
                        <Icon className="w-5 h-5 text-mist-gray" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-semibold ${
                          isEnabled ? 'text-iq-neon-green' : 
                          isBlocked ? 'text-crimson-danger' : 'text-mist-gray'
                        }`}>
                          {service.name}
                        </h4>
                        {isEnabled && (
                          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                            ACTIVE
                          </Badge>
                        )}
                        {isBlocked && (
                          <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                            BLOCKED
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-mist-gray">{service.description}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-mist-gray" />
                        <span className="text-xs text-mist-gray">{service.interval}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Critical Requirements Summary */}
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
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-l-amber-warning bg-amber-warning/5">
              <h4 className="font-semibold text-amber-warning mb-2">Enrollment Gate</h4>
              <ul className="text-sm text-mist-gray space-y-1">
                <li>• If enrollment fails → NOTHING else starts</li>
                <li>• All background loops remain blocked until JWT present</li>
                <li>• Exponential backoff on retry with user feedback</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-l-electric-blue bg-electric-blue/5">
              <h4 className="font-semibold text-electric-blue mb-2">First Snapshot Gate</h4>
              <ul className="text-sm text-mist-gray space-y-1">
                <li>• If first snapshot POST fails → NOTHING else starts</li>
                <li>• Heartbeat/telemetry/discovery/updates remain BLOCKED</li>
                <li>• Device card appears in dashboard only after snapshot success</li>
                <li>• Backend uses this data for ticket auto-population</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-l-iq-neon-green bg-iq-neon-green/5">
              <h4 className="font-semibold text-iq-neon-green mb-2">Post-Snapshot Behavior</h4>
              <ul className="text-sm text-mist-gray space-y-1">
                <li>• Only after snapshot success do background services start</li>
                <li>• Discovery remains disabled by default to prevent network overload</li>
                <li>• Agent orb does not pulse until first snapshot completes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}