import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Eye, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight,
  Wifi,
  Server,
  Shield,
  Clock,
  Brain,
  Target
} from 'lucide-react';

interface FocusQueueItem {
  id: string;
  title: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  affectedUsers: number;
  estimatedDowntime: string;
  category: 'network' | 'server' | 'security' | 'user';
  lastSeen: string;
  correlatedSignals: number;
}

interface Prediction {
  id: string;
  title: string;
  probability: number;
  timeframe: string;
  category: 'outage' | 'performance' | 'security' | 'capacity';
  impact: string;
  preventable: boolean;
}

interface LiveSignal {
  id: string;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  timestamp: Date;
  fingerprint: string;
  duplicates: number;
}

const Observatory: React.FC = () => {
  const { user, trialInfo } = useApp();
  const [focusQueue, setFocusQueue] = useState<FocusQueueItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);

  useEffect(() => {
    // Mock data - would come from AI analysis in production
    setFocusQueue([
      {
        id: '1',
        title: 'VPN dropping packets',
        impact: 'critical',
        confidence: 87,
        affectedUsers: 45,
        estimatedDowntime: '15 min',
        category: 'network',
        lastSeen: '2 min ago',
        correlatedSignals: 12
      },
      {
        id: '2',
        title: 'Database running out of connections',
        impact: 'high',
        confidence: 73,
        affectedUsers: 23,
        estimatedDowntime: '8 min',
        category: 'server',
        lastSeen: '5 min ago',
        correlatedSignals: 8
      },
      {
        id: '3',
        title: 'Strange login activity',
        impact: 'medium',
        confidence: 65,
        affectedUsers: 3,
        estimatedDowntime: 'N/A',
        category: 'security',
        lastSeen: '12 min ago',
        correlatedSignals: 4
      }
    ]);

    setPredictions([
      {
        id: '1',
        title: '3 VPN outages predicted',
        probability: 78,
        timeframe: 'next 4 hours',
        category: 'outage',
        impact: 'High user impact',
        preventable: true
      },
      {
        id: '2',
        title: 'Disk space threshold breach',
        probability: 92,
        timeframe: 'next 2 days',
        category: 'capacity',
        impact: 'Service degradation',
        preventable: true
      },
      {
        id: '3',
        title: 'SSL certificate expiration',
        probability: 100,
        timeframe: 'in 7 days',
        category: 'security',
        impact: 'Service outage',
        preventable: true
      }
    ]);

    setLiveSignals([
      {
        id: '1',
        source: 'web-01.prod',
        severity: 'warning',
        description: 'High memory usage detected',
        timestamp: new Date(Date.now() - 30000),
        fingerprint: 'mem_high_web',
        duplicates: 3
      },
      {
        id: '2',
        source: 'db-cluster-02',
        severity: 'info',
        description: 'Connection pool recovered',
        timestamp: new Date(Date.now() - 120000),
        fingerprint: 'db_pool_ok',
        duplicates: 1
      }
    ]);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background bubo-neural-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-iq-green" />
            <h1 className="text-2xl font-semibold text-bubo-indigo">Observatory</h1>
          </div>
          <Badge variant="outline" className="text-iq-green border-iq-green">
            <Brain className="w-3 h-3 mr-1" />
            Learning patterns
          </Badge>
        </div>
        
        {trialInfo.isActive && (
          <div className="bg-gradient-to-r from-iq-green to-green-400 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">
              14-Day Free Trial — learning your environment as we speak
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-interface-gray">Early warnings</p>
              <p className="text-2xl font-semibold text-bubo-indigo">23</p>
            </div>
            <Zap className="w-8 h-8 text-iq-green" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-interface-gray">What might break</p>
              <p className="text-2xl font-semibold text-bubo-indigo">3</p>
            </div>
            <TrendingUp className="w-8 h-8 text-prediction-blue" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-interface-gray">Noise Filtered</p>
              <p className="text-2xl font-semibold text-bubo-indigo">38%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-iq-green" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-interface-gray">Faster fixes</p>
              <p className="text-2xl font-semibold text-bubo-indigo">-45%</p>
            </div>
            <Target className="w-8 h-8 text-iq-green" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Focus Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-bubo-indigo">Focus Queue</h2>
            <Badge variant="secondary" className="text-xs">
              Ranked by Impact, Not Time
            </Badge>
          </div>
          
          <div className="space-y-4">
            {focusQueue.map((item) => (
              <Card key={item.id} className="focus-queue-item">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-1 h-16 rounded-full ${getImpactColor(item.impact)}`} />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(item.category)}
                        <h3 className="font-medium text-bubo-indigo">{item.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-interface-gray">
                        <span>👥 {item.affectedUsers} users</span>
                        <span>⏱️ {item.estimatedDowntime}</span>
                        <span>🔗 {item.correlatedSignals} signals</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-interface-gray">Confidence:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${item.confidence > 70 ? 'bg-iq-green' : item.confidence > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-interface-gray">{item.lastSeen}</span>
                    <ArrowUpRight className="w-4 h-4 text-interface-gray" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="default" className="bg-iq-green hover:bg-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Acknowledge All
            </Button>
            <Button variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Escalate Critical
            </Button>
            <Button variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Run Playbook
            </Button>
          </div>
        </div>

        {/* Predictions & Live Signals */}
        <div className="space-y-6">
          {/* Predictions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-bubo-indigo">Predictions</h2>
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="prediction-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-bubo-indigo">{prediction.title}</h3>
                    <Badge className="bg-prediction-blue text-white">
                      {prediction.probability}%
                    </Badge>
                  </div>
                  <div className="text-sm text-interface-gray space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{prediction.timeframe}</span>
                    </div>
                    <div>{prediction.impact}</div>
                    {prediction.preventable && (
                      <div className="flex items-center space-x-2 text-iq-green">
                        <Shield className="w-3 h-3" />
                        <span>Preventable</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Live Signals */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-bubo-indigo">Live Signals</h2>
            {liveSignals.map((signal) => (
              <Card key={signal.id} className="signal-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getSeverityColor(signal.severity)}>
                      {signal.severity.toUpperCase()}
                    </Badge>
                    {signal.duplicates > 1 && (
                      <Badge variant="outline" className="text-xs">
                        {signal.duplicates}x
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-bubo-indigo">{signal.source}</p>
                    <p className="text-sm text-interface-gray">{signal.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-interface-gray">
                    <span>#{signal.fingerprint}</span>
                    <span>{signal.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Observatory;