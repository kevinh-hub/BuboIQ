import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Radio,
  Filter,
  Search,
  Fingerprint,
  Link,
  Clock,
  Server,
  Wifi,
  Shield,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

interface Signal {
  id: string;
  timestamp: Date;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'network' | 'server' | 'security' | 'user' | 'application';
  message: string;
  fingerprint: string;
  duplicates: number;
  correlatedSignals: string[];
  deviceId?: string;
  userId?: string;
  resolved: boolean;
  acknowledgedBy?: string;
}

const Signals: React.FC = () => {
  const { user } = useApp();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    // Mock signals data - would come from real-time monitoring in production
    const mockSignals: Signal[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60000),
        source: 'web-01.prod',
        severity: 'critical',
        category: 'server',
        message: 'Memory over 95%',
        fingerprint: 'mem_critical_web01',
        duplicates: 5,
        correlatedSignals: ['2', '3'],
        deviceId: 'web-01',
        resolved: false
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3 * 60000),
        source: 'loadbalancer-01',
        severity: 'warning',
        category: 'network',
        message: 'Too many connections',
        fingerprint: 'conn_high_lb01',
        duplicates: 12,
        correlatedSignals: ['1'],
        deviceId: 'lb-01',
        resolved: false
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 5 * 60000),
        source: 'auth-service',
        severity: 'error',
        category: 'security',
        message: 'Failed logins from strange IP',
        fingerprint: 'auth_fail_suspicious',
        duplicates: 8,
        correlatedSignals: ['1'],
        resolved: false
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 8 * 60000),
        source: 'app-gateway',
        severity: 'info',
        category: 'application',
        message: 'Auto-added 2 more servers',
        fingerprint: 'autoscale_up',
        duplicates: 1,
        correlatedSignals: [],
        resolved: true,
        acknowledgedBy: 'system'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 12 * 60000),
        source: 'db-cluster-01',
        severity: 'warning',
        category: 'server',
        message: 'Slow query detected: >5s execution time',
        fingerprint: 'query_slow_db01',
        duplicates: 3,
        correlatedSignals: [],
        resolved: false
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 15 * 60000),
        source: 'monitoring-agent',
        severity: 'info',
        category: 'user',
        message: 'User session timeout increased for mobile clients',
        fingerprint: 'session_timeout_mobile',
        duplicates: 1,
        correlatedSignals: [],
        userId: 'mobile-users',
        resolved: true
      }
    ];
    
    setSignals(mockSignals);
  }, []);

  useEffect(() => {
    let filtered = signals.filter(signal => {
      const matchesSearch = signal.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           signal.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           signal.fingerprint.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || signal.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || signal.category === categoryFilter;
      const matchesSource = sourceFilter === 'all' || signal.source.includes(sourceFilter);
      const matchesResolved = showResolved || !signal.resolved;
      
      return matchesSearch && matchesSeverity && matchesCategory && matchesSource && matchesResolved;
    });

    setFilteredSignals(filtered);
  }, [signals, searchQuery, severityFilter, categoryFilter, sourceFilter, showResolved]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'error': return 'bg-red-400 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'application': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const acknowledgeSignal = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, resolved: true, acknowledgedBy: user?.name || 'Unknown' }
        : signal
    ));
  };

  const getUniqueValues = (field: keyof Signal) => {
    return [...new Set(signals.map(signal => signal[field] as string))];
  };

  return (
    <div className="p-8 space-y-8 bg-background-gray min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Radio className="w-6 h-6 text-iq-green animate-pulse" />
          <h1 className="text-2xl font-semibold text-bubo-indigo">Live Signals</h1>
          <Badge variant="outline" className="text-iq-green border-iq-green">
            {filteredSignals.filter(s => !s.resolved).length} Active
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800">
            38% duplicates filtered
          </Badge>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-interface-gray" />
            <Input
              placeholder="Search signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="application">Application</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {getUniqueValues('source').map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showResolved"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showResolved" className="text-sm text-interface-gray">
              Show resolved
            </label>
          </div>
        </div>
      </Card>

      {/* Signals Feed */}
      <div className="space-y-4">
        {filteredSignals.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Radio className="w-12 h-12 text-interface-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-bubo-indigo mb-2">
              Nothing to show right now.
            </h3>
            <p className="text-interface-gray">
              No warnings match your filters.
            </p>
          </Card>
        ) : (
          filteredSignals.map((signal) => (
            <Card key={signal.id} className={`signal-card ${signal.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Severity & Category */}
                  <div className="flex flex-col items-center space-y-2">
                    <Badge className={getSeverityColor(signal.severity)}>
                      {signal.severity.toUpperCase()}
                    </Badge>
                    <div className="text-interface-gray">
                      {getCategoryIcon(signal.category)}
                    </div>
                  </div>
                  
                  {/* Signal Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-bubo-indigo">{signal.message}</h3>
                      {signal.resolved && (
                        <Badge variant="outline" className="text-iq-green border-iq-green">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-interface-gray">
                      <span className="flex items-center space-x-1">
                        <Server className="w-3 h-3" />
                        <span>{signal.source}</span>
                      </span>
                      
                      {signal.deviceId && (
                        <span className="flex items-center space-x-1">
                          <Fingerprint className="w-3 h-3" />
                          <span>{signal.deviceId}</span>
                        </span>
                      )}
                      
                      {signal.duplicates > 1 && (
                        <Badge variant="outline" className="text-xs">
                          {signal.duplicates}x duplicates
                        </Badge>
                      )}
                      
                      {signal.correlatedSignals.length > 0 && (
                        <Badge className="correlation-chip">
                          <Link className="w-3 h-3 mr-1" />
                          {signal.correlatedSignals.length} correlated
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-interface-gray">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{signal.timestamp.toLocaleTimeString()}</span>
                      </span>
                      <span className="font-mono">#{signal.fingerprint}</span>
                      {signal.acknowledgedBy && (
                        <span>Acknowledged by {signal.acknowledgedBy}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!signal.resolved && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeSignal(signal.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Acknowledge
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Automate
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {filteredSignals.length > 0 && (
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between text-sm text-interface-gray">
            <span>
              Showing {filteredSignals.length} of {signals.length} signals
            </span>
            <span>
              {signals.filter(s => s.duplicates > 1).reduce((acc, s) => acc + s.duplicates - 1, 0)} duplicates filtered
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Signals;