import React, { useState } from 'react';
import { AlertTriangle, Server, Users, Wifi, ArrowRight, ChevronDown, ChevronRight, GroupIcon as Group } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

const mockAlerts = [
  {
    id: 1,
    title: 'Database won\'t connect',
    source: 'MySQL Server',
    severity: 'critical',
    confidence: 94,
    timestamp: '2 min ago',
    affected: 150,
    category: 'database'
  },
  {
    id: 2,
    title: 'Memory running high',
    source: 'App Server 03',
    severity: 'warning',
    confidence: 87,
    timestamp: '3 min ago',
    affected: 45,
    category: 'performance'
  },
  {
    id: 3,
    title: 'Too many failed logins',
    source: 'Auth Service',
    severity: 'info',
    confidence: 76,
    timestamp: '5 min ago',
    affected: 8,
    category: 'security'
  },
  {
    id: 4,
    title: 'Network getting slow',
    source: 'Load Balancer',
    severity: 'warning',
    confidence: 91,
    timestamp: '7 min ago',
    affected: 200,
    category: 'network'
  }
];

export const SignalStreamDemo: React.FC = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
  const [showGrouped, setShowGrouped] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'warning': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'info': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-iq-neon-green';
    if (confidence >= 75) return 'text-amber-warning';
    return 'text-crimson-danger';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Server className="w-4 h-4" />;
      case 'performance': return <AlertTriangle className="w-4 h-4" />;
      case 'security': return <Users className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const toggleAlertSelection = (id: number) => {
    setSelectedAlerts(prev => 
      prev.includes(id) 
        ? prev.filter(aid => aid !== id)
        : [...prev, id]
    );
  };

  const groupToIncident = () => {
    if (selectedAlerts.length < 2) return;
    setShowGrouped(true);
    setTimeout(() => {
      setShowGrouped(false);
      setSelectedAlerts([]);
      // Remove grouped alerts and add new incident alert
      setAlerts(prev => [
        {
          id: Date.now(),
          title: 'Database problem',
          source: 'BuboIQ',
          severity: 'critical',
          confidence: 95,
          timestamp: 'Just now',
          affected: 395,
          category: 'incident'
        },
        ...prev.filter(a => !selectedAlerts.includes(a.id))
      ]);
    }, 2000);
  };

  return (
    <Card className="bubo-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
            Alert Stream
          </h3>
          <p className="text-mist-gray">
            Real-time monitoring with AI-powered false alarm reduction and problem grouping
          </p>
        </div>
        
        {selectedAlerts.length >= 2 && (
          <Button 
            onClick={groupToIncident}
            className="bubo-btn-neon-primary"
            disabled={showGrouped}
          >
            {showGrouped ? 'Grouping...' : 'Group to Incident'}
            <Group className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {showGrouped && (
        <div className="mb-6 p-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
          <div className="flex items-center space-x-2 text-iq-neon-green">
            <div className="w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
            <span className="font-semibold">AI Problem Grouping in progress...</span>
          </div>
          <p className="text-sm text-mist-gray mt-1">
            Analyzing {selectedAlerts.length} related alerts for common root cause
          </p>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card 
            key={alert.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedAlerts.includes(alert.id)
                ? 'bg-iq-neon-green/10 border-iq-neon-green/30 bubo-glow-green'
                : 'bg-slate-gray/20 border-slate-gray/30 hover:border-slate-gray/50'
            }`}
            onClick={() => toggleAlertSelection(alert.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-mist-gray mt-0.5">
                  {getCategoryIcon(alert.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-pure-white">{alert.title}</h4>
                    <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-mist-gray">
                    <span>{alert.source}</span>
                    <span>{alert.timestamp}</span>
                    <span>{alert.affected} users affected</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-mist-gray">Confidence</span>
                  <span className={`font-bold ${getConfidenceColor(alert.confidence)}`}>
                    {alert.confidence}%
                  </span>
                </div>
                
                {selectedAlerts.includes(alert.id) && (
                  <div className="mt-2">
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-nocturne-indigo/50 rounded-xl">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-nocturne-indigo/30 p-2 -m-2 rounded-lg transition-colors duration-200"
          onClick={() => setShowHelp(!showHelp)}
        >
          <div className="flex-1">
            <h4 className="font-semibold text-pure-white mb-1 flex items-center">
              How Alert Stream Works
              <span className="ml-2 text-xs text-cyan-accent">Click for tips</span>
            </h4>
            <p className="text-sm text-mist-gray">
              Real-time alerts flow in continuously. BuboIQ's AI analyzes patterns, correlates related issues, and intelligently groups them into incidents. Select multiple alerts and click "Group to Incident" to see the AI problem grouping in action.
            </p>
            
            {showHelp && (
              <div className="mt-4 p-4 bg-dark-midnight/50 rounded-lg border border-iq-neon-green/20">
                <h5 className="font-medium text-iq-neon-green mb-3 text-sm">Pro Tips for This Demo:</h5>
                <ul className="space-y-2 text-xs text-mist-gray">
                  <li className="flex items-start">
                    <span className="text-iq-neon-green mr-2">•</span>
                    <span>Try selecting alerts with similar categories (like database alerts) to see optimal grouping</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iq-neon-green mr-2">•</span>
                    <span>Notice how confidence scores and timestamps influence the AI's correlation decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iq-neon-green mr-2">•</span>
                    <span>The "affected users" count shows the potential impact scope for prioritization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-iq-neon-green mr-2">•</span>
                    <span>In real BuboIQ, this happens automatically in milliseconds across thousands of alerts</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="ml-4 transition-transform duration-200">
            {showHelp ? (
              <ChevronDown className="w-5 h-5 text-iq-neon-green" />
            ) : (
              <ChevronRight className="w-5 h-5 text-iq-neon-green" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};