import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Brain, Zap, Target, Users, Clock, AlertTriangle, CheckCircle, ArrowRight, Activity, Shield, Cpu } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import OrbAnimation from './OrbAnimation';
import IQMeter from './IQMeter';
import SignalCard from './SignalCard';
import TicketPreviewCard from './TicketPreviewCard';
import AdaptersRow from './AdaptersRow';

interface Signal {
  id: string;
  source: string;
  message: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  correlations: string[];
}

interface Incident {
  id: string;
  title: string;
  hypothesis: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  signals: Signal[];
  evidencePacks: string[];
  status: 'analyzing' | 'confirmed' | 'ticket-created';
}

const BuboIntelligenceFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [iqMeterValue, setIqMeterValue] = useState(0);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);

  // Demo data
  const demoSignals: Signal[] = [
    {
      id: '1',
      source: 'Database Monitor',
      message: 'Database running slow',
      confidence: 87,
      severity: 'high',
      timestamp: new Date(),
      correlations: ['db-performance', 'user-complaints']
    },
    {
      id: '2',
      source: 'System Monitor',
      message: 'Website response time getting slower',
      confidence: 94,
      severity: 'critical',
      timestamp: new Date(Date.now() - 30000),
      correlations: ['db-performance', 'load-increase']
    },
    {
      id: '3',
      source: 'User Reports',
      message: 'Login failures increasing 340%',
      confidence: 76,
      severity: 'medium',
      timestamp: new Date(Date.now() - 60000),
      correlations: ['auth-system', 'db-performance']
    }
  ];

  const demoIncident: Incident = {
    id: 'INC-2025-001',
    title: 'Database Running Slow',
    hypothesis: 'Database issues are making login problems worse',
    confidence: 89,
    severity: 'critical',
    signals: demoSignals,
    evidencePacks: ['Performance Data', 'Error Reports', 'User Experience'],
    status: 'confirmed'
  };

  const workflowSteps = [
    { id: 'signals', label: 'Spot Problems', icon: Activity, color: 'cyan-accent' },
    { id: 'correlation', label: 'Smart Analysis', icon: Brain, color: 'prediction-purple' },
    { id: 'incident', label: 'Group Related Issues', icon: Target, color: 'iq-neon-green' },
    { id: 'ticketing', label: 'Smart Ticketing', icon: CheckCircle, color: 'signal-yellow' },
    { id: 'resolution', label: 'Resolution', icon: Shield, color: 'iq-green' }
  ];

  // Simulate intelligence flow
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeStep < workflowSteps.length - 1) {
        setActiveStep(prev => prev + 1);
        setIqMeterValue(prev => Math.min(prev + 20, 100));
      }
    }, 3000);

    // Add signals progressively
    const signalInterval = setInterval(() => {
      if (signals.length < demoSignals.length) {
        setSignals(prev => [...prev, demoSignals[prev.length]]);
      }
    }, 1000);

    // Set incident after correlation
    const incidentTimeout = setTimeout(() => {
      setActiveIncident(demoIncident);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(signalInterval);
      clearTimeout(incidentTimeout);
    };
  }, [signals.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-crimson-danger';
      case 'high': return 'text-amber-warning';
      case 'medium': return 'text-signal-yellow';
      case 'low': return 'text-iq-green';
      default: return 'text-mist-gray';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-crimson-danger/10 border-crimson-danger/30';
      case 'high': return 'bg-amber-warning/10 border-amber-warning/30';
      case 'medium': return 'bg-signal-yellow/10 border-signal-yellow/30';
      case 'low': return 'bg-iq-green/10 border-iq-green/30';
      default: return 'bg-mist-gray/10 border-mist-gray/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-midnight p-6">
      {/* Hero Frame - AI Brain */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <OrbAnimation 
          size="xl" 
          variant="eye" 
          intensity="high" 
          showOrbitals={true}
          className="mb-8"
        />
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl font-bold text-pure-white mt-8 mb-4 bubo-neon-text-green"
        >
          BuboIQ: The Brain of IT Operations
        </motion.h1>
        
        <div className="flex justify-center gap-4 mt-6">
          {['Alert patterns', 'Smart sorting', 'Auto-fix'].map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              className="px-4 py-2 bg-iq-neon-green/10 border border-iq-neon-green/30 
                       rounded-full text-iq-neon-green text-sm font-medium backdrop-blur-sm"
            >
              {tag}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Workflow Timeline */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mb-12"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <motion.div
                key={step.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                <motion.div
                  animate={isActive ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 10px rgba(0,255,133,0.3)',
                      '0 0 20px rgba(0,255,133,0.6)',
                      '0 0 10px rgba(0,255,133,0.3)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 
                           backdrop-blur-sm transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-iq-neon-green/20 border-iq-neon-green text-iq-neon-green'
                      : isActive 
                      ? 'bg-cyan-accent/20 border-cyan-accent text-cyan-accent'
                      : 'bg-mist-gray/10 border-mist-gray/30 text-mist-gray'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                
                <span className={`text-sm mt-2 font-medium transition-colors ${
                  isActive ? 'text-cyan-accent' : isCompleted ? 'text-iq-neon-green' : 'text-mist-gray'
                }`}>
                  {step.label}
                </span>
                
                {index < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute top-8 left-16 w-20 h-0.5 bg-gradient-to-r 
                             from-iq-neon-green to-cyan-accent"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Signal Stream Feed */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-dark-midnight/80 border-iq-neon-green/20 backdrop-blur-xl h-fit">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-iq-neon-green" />
                <h3 className="text-xl font-semibold text-pure-white">Signal Stream</h3>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                  Live
                </Badge>
              </div>
              
              <div className="space-y-4">
                {signals.map((signal, index) => (
                  <SignalCard
                    key={signal.id}
                    id={signal.id}
                    source={signal.source}
                    message={signal.message}
                    confidence={signal.confidence}
                    severity={signal.severity}
                    timestamp={signal.timestamp}
                    correlations={signal.correlations}
                    expandable={true}
                    onPromote={(id) => console.log('Promote signal:', id)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Incident Room Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-dark-midnight/80 border-iq-neon-green/20 backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-iq-neon-green" />
                  <h3 className="text-xl font-semibold text-pure-white">Incident Room</h3>
                  {activeIncident && (
                    <Badge className={`${getSeverityBg(activeIncident.severity)} ${getSeverityColor(activeIncident.severity)} border`}>
                      {activeIncident.severity.toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                {/* IQ Meter */}
                <IQMeter 
                  value={iqMeterValue} 
                  size="md" 
                  showLabel={false} 
                  animated={true}
                />
              </div>

              {activeIncident ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  {/* Incident Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-bold text-pure-white">{activeIncident.id}</h4>
                        <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                          AI Generated
                        </Badge>
                      </div>
                      <h5 className="text-lg text-cloud-white mb-3">{activeIncident.title}</h5>
                      <p className="text-mist-gray mb-4">{activeIncident.hypothesis}</p>
                    </div>
                  </div>

                  {/* Evidence Pack Carousel */}
                  <div>
                    <h6 className="text-sm font-semibold text-pure-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Evidence Packs
                    </h6>
                    <div className="flex gap-3">
                      {activeIncident.evidencePacks.map((pack, index) => (
                        <motion.div
                          key={pack}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="px-4 py-3 bg-signal-blue/10 border border-signal-blue/30 
                                   rounded-xl backdrop-blur-sm hover:bg-signal-blue/20 
                                   transition-colors cursor-pointer"
                        >
                          <span className="text-signal-blue font-medium">{pack}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Ticketing CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    className="flex justify-end"
                  >
                    <Button className="bubo-btn-neon-primary flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Promote to Smart Ticket
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-iq-neon-green/30 border-t-iq-neon-green 
                             rounded-full mb-4"
                  />
                  <p className="text-mist-gray">Analyzing signals and correlations...</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Smart Ticketing Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="mt-8 max-w-7xl mx-auto"
      >
        <Card className="bg-dark-midnight/80 border-signal-yellow/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-signal-yellow" />
              <h3 className="text-xl font-semibold text-pure-white">Smart Ticketing Integration</h3>
              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                Multi-Platform
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Built-in Ticketing */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-pure-white mb-4">BuboIQ Native Ticket</h4>
                <TicketPreviewCard
                  ticketId="TIX-2025-001"
                  title="Database Performance Degradation - Connection Pool Exhaustion"
                  priority="critical"
                  assignee={{
                    name: "Sarah Chen",
                    role: "Senior Database Engineer"
                  }}
                  sla={{
                    remaining: "2h 15m",
                    percentage: 65
                  }}
                  syncStatus="synced"
                  platform="buboiq"
                  onView={() => console.log('View ticket')}
                />
              </div>

              {/* External Platform Preview */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-pure-white mb-4">External Platform Sync</h4>
                <TicketPreviewCard
                  ticketId="ZD-94732"
                  title="[Synced from BuboIQ] Critical DB Performance Issue"
                  priority="critical"
                  assignee={{
                    name: "Marcus Rodriguez",
                    role: "DevOps Team Lead"
                  }}
                  sla={{
                    remaining: "2h 12m",
                    percentage: 64
                  }}
                  syncStatus="syncing"
                  platform="zendesk"
                  onView={() => console.log('View external ticket')}
                  onSync={() => console.log('Sync ticket')}
                />
              </div>
            </div>

            {/* External Platform Adapters */}
            <AdaptersRow
              adapters={[
                {
                  id: 'buboiq-native',
                  name: 'BuboIQ Native',
                  status: 'connected',
                  syncCount: 247,
                  lastSync: new Date(Date.now() - 120000),
                  version: '2.1.0',
                  isNative: true
                },
                {
                  id: 'zendesk',
                  name: 'Zendesk',
                  status: 'connected',
                  syncCount: 89,
                  lastSync: new Date(Date.now() - 300000),
                  version: '1.4.2'
                },
                {
                  id: 'jira',
                  name: 'Jira Cloud',
                  status: 'connecting',
                  version: '2.0.1'
                },
                {
                  id: 'servicenow',
                  name: 'ServiceNow',
                  status: 'available',
                  version: '1.8.0'
                }
              ]}
              onConnect={(id) => console.log('Connect adapter:', id)}
              onConfigure={(id) => console.log('Configure adapter:', id)}
              onSync={(id) => console.log('Sync adapter:', id)}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuboIntelligenceFlow;