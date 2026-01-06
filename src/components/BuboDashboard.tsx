import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { SignalCard, FocusQueueItem, CommandBar, EmptyState, StatusIndicator, RoleBadge } from './BuboKit';
import { 
  Brain, 
  Eye, 
  Zap, 
  Activity, 
  Shield, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function BuboDashboard() {
  const { user, tickets } = useApp();
  const [activeSignals, setActiveSignals] = useState(12);
  const [criticalIncidents, setCriticalIncidents] = useState(3);
  const [aiConfidence, setAiConfidence] = useState(87);
  const [systemStatus, setSystemStatus] = useState<'online' | 'warning' | 'error'>('online');

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignals(prev => prev + Math.floor(Math.random() * 3) - 1);
      setAiConfidence(prev => Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 5)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const mockSignals = [
    {
      title: "Anomalous Network Traffic Detected",
      description: "Unusual spike in outbound connections from DC-SRV-01. Pattern suggests potential data exfiltration or compromised system behavior.",
      severity: "critical" as const,
      confidence: 94,
      correlations: ["Port Scan", "Failed Logins", "Process Anomaly"],
      timestamp: "2 min ago",
      source: "BuboIQ Network Monitor"
    },
    {
      title: "Database Performance Degradation",
      description: "Query response times increasing by 340% over baseline. Connection pool saturation detected on primary database cluster.",
      severity: "high" as const,
      confidence: 89,
      correlations: ["Memory Leak", "Deadlock Pattern"],
      timestamp: "7 min ago",
      source: "BuboIQ Performance Monitor"
    },
    {
      title: "Certificate Expiration Warning",
      description: "SSL certificate for api.company.com expires in 14 days. Automatic renewal failed due to DNS validation issues.",
      severity: "medium" as const,
      confidence: 98,
      correlations: ["DNS Misconfiguration"],
      timestamp: "1 hour ago",
      source: "BuboIQ Certificate Monitor"
    }
  ];

  const mockFocusQueue = [
    {
      title: "Network Intrusion Response",
      description: "Coordinate immediate response to detected network anomaly. Isolate affected systems and analyze attack vectors.",
      priority: "critical" as const,
      impact: "High - Production Systems",
      eta: "30 minutes",
      aiSuggestion: "Execute Incident Response Playbook #3. Isolate DC-SRV-01 and collect forensic evidence."
    },
    {
      title: "Database Tuning Required",
      description: "Improve query performance and connection pool settings to fix slow response times.",
      priority: "high" as const,
      impact: "Medium - User Experience",
      eta: "2 hours",
      aiSuggestion: "Add recommended database index and increase connection pool size to 150."
    },
    {
      title: "Certificate Renewal Process",
      description: "Resolve DNS validation issues and renew SSL certificate before expiration.",
      priority: "medium" as const,
      impact: "Low - Future Availability",
      eta: "4 hours"
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  return (
    <div className="min-h-screen bg-background bubo-neural-bg">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-8 h-8 text-iq-green" />
                <h1 className="text-3xl font-bold text-cloud-white">
                  {getGreeting()}, {user?.name}
                </h1>
              </div>
              <RoleBadge role={user?.role === 'admin' ? 'admin' : 'agent'} />
            </div>
            <p className="text-mist-gray text-lg">
              BuboIQ is watching your infrastructure. Here's what needs your attention.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusIndicator status={systemStatus} label="All Systems" />
            <Button className="bubo-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Incident
            </Button>
          </div>
        </div>

        {/* Command Bar */}
        <div className="max-w-2xl">
          <CommandBar onSearch={handleSearch} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bubo-signal-card bubo-glow-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-mist-gray">Active Signals</CardTitle>
              <Activity className="h-5 w-5 text-iq-green" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cloud-white">{activeSignals}</div>
              <p className="text-xs text-mist-gray mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +3 in last hour
              </p>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-mist-gray">Critical Incidents</CardTitle>
              <AlertTriangle className="h-5 w-5 text-crimson-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crimson-danger">{criticalIncidents}</div>
              <p className="text-xs text-mist-gray mt-1">Requires immediate action</p>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-mist-gray">AI Confidence</CardTitle>
              <Brain className="h-5 w-5 text-prediction-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cloud-white">{aiConfidence}%</div>
              <div className="mt-2">
                <div className="bubo-confidence-ribbon">
                  <div 
                    className="h-full rounded-full bg-iq-green transition-all duration-1000"
                    style={{ width: `${aiConfidence}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-mist-gray">Response Time</CardTitle>
              <Clock className="h-5 w-5 text-signal-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cloud-white">1.2m</div>
              <p className="text-xs text-mist-gray mt-1 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-iq-green" />
                43% faster than target
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Signal Stream */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-iq-green" />
                <h2 className="text-2xl font-bold text-cloud-white">Signal Stream</h2>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" />
                  <span className="text-sm text-mist-gray">Live</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="bubo-btn-ghost">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" className="bubo-btn-ghost">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockSignals.map((signal, index) => (
                <SignalCard key={index} {...signal} />
              ))}
            </div>

            {mockSignals.length === 0 && (
              <EmptyState
                title="It's quiet. Bubo is watching the wires."
                description="No active signals detected. Your infrastructure is running smoothly, but we're always vigilant."
                icon={Eye}
              />
            )}
          </div>

          {/* Focus Queue */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-iq-green" />
                <h2 className="text-xl font-bold text-cloud-white">Focus Queue</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-iq-green hover:text-iq-green/80">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {mockFocusQueue.map((item, index) => (
                <FocusQueueItem key={index} {...item} />
              ))}
            </div>

            {/* AI Insights Panel */}
            <Card className="bubo-prediction-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cloud-white">
                  <Brain className="w-5 h-5 text-prediction-purple" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-iq-green rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-cloud-white font-medium">Pattern Recognition</p>
                      <p className="text-xs text-mist-gray">Similar network anomalies occurred 3 times this month, all traced to misconfigured firewall rules.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-signal-blue rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-cloud-white font-medium">Predictive Alert</p>
                      <p className="text-xs text-mist-gray">Database backup failure predicted for tomorrow based on storage capacity trends.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-warning rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-cloud-white font-medium">Correlation Found</p>
                      <p className="text-xs text-mist-gray">Certificate issues may be related to recent DNS provider change 2 weeks ago.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bubo-signal-card">
              <CardHeader>
                <CardTitle className="text-cloud-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bubo-btn-secondary">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Dashboard
                </Button>
                <Button className="w-full justify-start bubo-btn-secondary">
                  <Activity className="w-4 h-4 mr-2" />
                  Performance Monitor
                </Button>
                <Button className="w-full justify-start bubo-btn-secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Observatory View
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}