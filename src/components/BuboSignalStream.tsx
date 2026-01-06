import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Brain,
  Filter,
  Volume2,
  VolumeX,
  Activity,
  TrendingUp,
  Network,
  Server,
  Database,
  Globe,
  Shield,
  Settings,
  Eye
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { motion as Motion } from 'motion/react';

interface Signal {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  timestamp: Date;
  source: string;
  category: 'performance' | 'security' | 'infrastructure' | 'application' | 'network';
  correlations: Correlation[];
  confidence: number;
  aiGenerated: boolean;
  metadata: {
    affectedServices: string[];
    impactScore: number;
    predictedFix: string;
  };
}

interface Correlation {
  id: string;
  type: 'causal' | 'temporal' | 'pattern' | 'anomaly';
  description: string;
  strength: number;
  connectedSignalId?: string;
}

const BuboSignalStream: React.FC = () => {
  const [noiseCompression, setNoiseCompression] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string[]>(['critical', 'high', 'medium']);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);

  const signals: Signal[] = [
    {
      id: '1',
      title: 'Database Connection Pool Exhaustion Predicted',
      description: 'AI detected unusual connection patterns that may lead to pool exhaustion in the next 2-3 hours.',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      source: 'BuboIQ Prediction Engine',
      category: 'performance',
      confidence: 94,
      aiGenerated: true,
      correlations: [
        {
          id: 'c1',
          type: 'causal',
          description: 'Increased API traffic from mobile apps',
          strength: 87,
          connectedSignalId: '3'
        },
        {
          id: 'c2',
          type: 'temporal',
          description: 'Similar pattern observed 3 weeks ago',
          strength: 72
        }
      ],
      metadata: {
        affectedServices: ['User API', 'Payment Service', 'Analytics DB'],
        impactScore: 8.5,
        predictedFix: 'Scale connection pool or improve queries'
      }
    },
    {
      id: '2',
      title: 'Security Alert: Unusual Authentication Pattern',
      description: 'Multiple failed login attempts from EU region detected. Potential credential stuffing attack.',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      source: 'Security Monitor',
      category: 'security',
      confidence: 96,
      aiGenerated: false,
      correlations: [
        {
          id: 'c3',
          type: 'pattern',
          description: 'IP addresses match known botnet signatures',
          strength: 91
        }
      ],
      metadata: {
        affectedServices: ['Auth Service', 'User Portal'],
        impactScore: 9.2,
        predictedFix: 'Enable rate limiting and IP blocking'
      }
    },
    {
      id: '3',
      title: 'Mobile API Traffic Surge',
      description: 'API requests from mobile clients increased by 340% in the last hour.',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      source: 'API Gateway',
      category: 'application',
      confidence: 98,
      aiGenerated: false,
      correlations: [
        {
          id: 'c4',
          type: 'temporal',
          description: 'Coincides with new mobile app release',
          strength: 95
        }
      ],
      metadata: {
        affectedServices: ['Mobile API', 'CDN'],
        impactScore: 6.8,
        predictedFix: 'Scale API instances horizontally'
      }
    },
    {
      id: '4',
      title: 'Disk Space Saving Opportunity',
      description: 'AI identified 2.3TB of data that can be archived or compressed without impact.',
      severity: 'low',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      source: 'BuboIQ Storage Manager',
      category: 'infrastructure',
      confidence: 89,
      aiGenerated: true,
      correlations: [
        {
          id: 'c5',
          type: 'anomaly',
          description: 'Log files growing faster than expected',
          strength: 73
        }
      ],
      metadata: {
        affectedServices: ['Log Storage', 'Backup System'],
        impactScore: 3.2,
        predictedFix: 'Archive logs older than 90 days'
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-crimson-danger border-crimson-danger/50 bg-crimson-danger/10';
      case 'high': return 'text-amber-warning border-amber-warning/50 bg-amber-warning/10';
      case 'medium': return 'text-signal-blue border-signal-blue/50 bg-signal-blue/10';
      case 'low': return 'text-iq-green border-iq-green/50 bg-iq-green/10';
      case 'info': return 'text-mist-gray border-mist-gray/50 bg-mist-gray/10';
      default: return 'text-mist-gray border-mist-gray/50 bg-mist-gray/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return CheckCircle2;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Activity;
      case 'security': return Shield;
      case 'infrastructure': return Server;
      case 'application': return Globe;
      case 'network': return Network;
      default: return Settings;
    }
  };

  const getCorrelationColor = (type: string) => {
    switch (type) {
      case 'causal': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'temporal': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      case 'pattern': return 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30';
      case 'anomaly': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const filteredSignals = signals.filter(signal => 
    filterSeverity.includes(signal.severity) && 
    (!noiseCompression || signal.severity !== 'low')
  );

  return (
    <div className="min-h-screen bg-background bubo-neural-bg p-6">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-signal-blue/20 rounded-lg bubo-glow-blue">
              <Activity className="w-6 h-6 text-signal-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Signal Stream</h1>
              <p className="text-mist-gray">Real-time intelligent triage and correlation</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={noiseCompression}
                onCheckedChange={setNoiseCompression}
                id="noise-compression"
              />
              <label htmlFor="noise-compression" className="text-sm flex items-center gap-2">
                {noiseCompression ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                Noise Compression
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <label htmlFor="auto-refresh" className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Mode
              </label>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-mist-gray mr-2">Severity:</span>
          {['critical', 'high', 'medium', 'low', 'info'].map((severity) => (
            <button
              key={severity}
              onClick={() => {
                if (filterSeverity.includes(severity)) {
                  setFilterSeverity(filterSeverity.filter(s => s !== severity));
                } else {
                  setFilterSeverity([...filterSeverity, severity]);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                filterSeverity.includes(severity)
                  ? getSeverityColor(severity)
                  : 'text-mist-gray border-mist-gray/30 hover:border-mist-gray/50'
              }`}
            >
              {severity.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Active Signals</span>
              <span className="font-bold text-foreground">{filteredSignals.length}</span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Critical</span>
              <span className="font-bold text-crimson-danger">
                {filteredSignals.filter(s => s.severity === 'critical').length}
              </span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">AI Generated</span>
              <span className="font-bold text-iq-green">
                {filteredSignals.filter(s => s.aiGenerated).length}
              </span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Avg Confidence</span>
              <span className="font-bold text-foreground">
                {Math.round(filteredSignals.reduce((acc, s) => acc + s.confidence, 0) / filteredSignals.length)}%
              </span>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Signal Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSignals.map((signal, index) => {
            const SeverityIcon = getSeverityIcon(signal.severity);
            const CategoryIcon = getCategoryIcon(signal.category);
            
            return (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                layout
              >
                <Card className={`bubo-signal-card p-6 cursor-pointer transition-all duration-300 ${
                  selectedSignal === signal.id ? 'ring-2 ring-iq-green/50 bubo-glow-green' : ''
                }`}
                onClick={() => setSelectedSignal(selectedSignal === signal.id ? null : signal.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Indicator */}
                    <div className={`p-2 rounded-lg border ${getSeverityColor(signal.severity)}`}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>

                    {/* Signal Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground leading-tight">
                            {signal.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-mist-gray">
                            <span className="flex items-center gap-1">
                              <CategoryIcon className="w-3 h-3" />
                              {signal.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {signal.timestamp.toLocaleTimeString()}
                            </span>
                            <span>
                              {signal.source}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {signal.aiGenerated && (
                            <Badge variant="outline" className="bg-iq-green/20 text-iq-green border-iq-green/30">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          <Badge variant="outline" className={`border ${getSeverityColor(signal.severity)}`}>
                            {signal.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-mist-gray text-sm leading-relaxed">
                        {signal.description}
                      </p>

                      {/* Correlations */}
                      {signal.correlations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium text-mist-gray uppercase tracking-wide">
                            Correlations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {signal.correlations.map((correlation) => (
                              <motion.div
                                key={correlation.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`bubo-correlation-chip ${getCorrelationColor(correlation.type)} 
                                          hover:scale-105 transition-transform cursor-help`}
                                title={correlation.description}
                              >
                                <span className="capitalize">{correlation.type}</span>
                                <span className="mx-1">•</span>
                                <span>{correlation.strength}%</span>
                                {correlation.connectedSignalId && (
                                  <Network className="w-3 h-3 ml-1" />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedSignal === signal.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border/50 pt-4 mt-4 space-y-4"
                          >
                            {/* Confidence and Impact */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex justify-between text-xs text-mist-gray mb-2">
                                  <span>AI Confidence</span>
                                  <span>{signal.confidence}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${signal.confidence}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-iq-green/50 to-iq-green"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-mist-gray mb-2">
                                  <span>Impact Score</span>
                                  <span>{signal.metadata.impactScore}/10</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${signal.metadata.impactScore * 10}%` }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="h-full bg-gradient-to-r from-amber-warning/50 to-crimson-danger"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Affected Services */}
                            <div>
                              <h4 className="text-xs font-medium text-mist-gray uppercase tracking-wide mb-2">
                                Affected Services
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {signal.metadata.affectedServices.map((service) => (
                                  <Badge key={service} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Predicted Fix */}
                            <div>
                              <h4 className="text-xs font-medium text-mist-gray uppercase tracking-wide mb-2">
                                Predicted fix
                              </h4>
                              <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                                {signal.metadata.predictedFix}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSignals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto w-16 h-16 bg-iq-green/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-iq-green" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All Clear</h3>
          <p className="text-mist-gray">
            No signals matching your current filters. Your systems are running smoothly.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BuboSignalStream;