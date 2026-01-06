import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CommandBar, StatusIndicator, RoleBadge } from './BuboKit';
import { OwlEye } from './BuboIconPack';
import { 
  Menu, 
  X, 
  Eye, 
  AlertTriangle, 
  Brain, 
  Zap, 
  Search,
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface BuboMobileViewProps {
  user: any;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

export const BuboMobileView: React.FC<BuboMobileViewProps> = ({ 
  user, 
  onLogout, 
  onSearch 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('observatory');

  const priorityIncidents = [
    {
      id: 'INC-001',
      title: 'Database Connection Pool Exhausted',
      severity: 'critical',
      confidence: 96,
      eta: '15 min',
      impact: 'Production API'
    },
    {
      id: 'INC-002', 
      title: 'SSL Certificate Expiring',
      severity: 'medium',
      confidence: 99,
      eta: '2 days',
      impact: 'External Services'
    }
  ];

  const quickActions = [
    { id: 'create-incident', label: 'Create Incident', icon: AlertTriangle, color: 'bg-crimson-danger/10 text-crimson-danger' },
    { id: 'run-diagnostic', label: 'Run Diagnostic', icon: Eye, color: 'bg-iq-green/10 text-iq-green' },
    { id: 'ai-assist', label: 'AI Assist', icon: Brain, color: 'bg-prediction-purple/10 text-prediction-purple' },
    { id: 'emergency', label: 'Emergency Mode', icon: Zap, color: 'bg-amber-warning/10 text-amber-warning' }
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'text-crimson-danger border-crimson-danger',
      high: 'text-amber-warning border-amber-warning',
      medium: 'text-[#FCD34D] border-[#F59E0B]',
      low: 'text-iq-green border-iq-green'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="bg-bubo-indigo border-b border-slate-gray/30 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-cloud-white hover:bg-slate-gray/30"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="flex items-center gap-2">
              <OwlEye size={24} className="text-iq-green" />
              <div>
                <h1 className="text-lg font-bold text-cloud-white">BuboIQ</h1>
                <p className="text-xs text-mist-gray -mt-1">Mobile</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="online" label="" />
            <Bell className="w-5 h-5 text-mist-gray" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-bubo-indigo border-r border-slate-gray/30 p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-iq-green rounded-xl flex items-center justify-center">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-cloud-white">{user?.name}</p>
                  <RoleBadge role={user?.role || 'user'} size="sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-cloud-white">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start text-cloud-white">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-cloud-white" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Command Bar */}
        <CommandBar onSearch={onSearch} placeholder="Search incidents, systems..." />

        {/* Priority Incidents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cloud-white">Priority Queue</h2>
            <Badge className="bg-crimson-danger/10 text-crimson-danger border-crimson-danger/30">
              {priorityIncidents.filter(i => i.severity === 'critical').length} Critical
            </Badge>
          </div>
          
          <div className="space-y-3">
            {priorityIncidents.map((incident) => (
              <Card key={incident.id} className="bubo-signal-card border-l-4 border-l-crimson-danger">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-mono text-mist-gray">{incident.id}</p>
                      <h3 className="font-semibold text-cloud-white">{incident.title}</h3>
                    </div>
                    <Badge className={`text-xs border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-mist-gray">Confidence</p>
                      <p className="text-cloud-white font-medium">{incident.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-mist-gray">ETA</p>
                      <p className="text-cloud-white font-medium">{incident.eta}</p>
                    </div>
                    <div>
                      <p className="text-mist-gray">Impact</p>
                      <p className="text-cloud-white font-medium text-xs">{incident.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-bold text-cloud-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-slate-gray/10 hover:bg-slate-gray/20 border border-slate-gray/30"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="text-xs text-cloud-white font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div>
          <h2 className="text-xl font-bold text-cloud-white mb-4">System Status</h2>
          <Card className="bubo-signal-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-mist-gray">Infrastructure</span>
                <StatusIndicator status="online" label="Operational" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mist-gray">AI Processing</span>
                <StatusIndicator status="online" label="Active" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mist-gray">Alert Pipeline</span>
                <StatusIndicator status="warning" label="Degraded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="text-xl font-bold text-cloud-white mb-4">AI Insights</h2>
          <Card className="bubo-prediction-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-cloud-white">
                <Brain className="w-5 h-5 text-prediction-purple" />
                Recent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-cloud-white font-medium mb-1">Pattern Recognition</p>
                <p className="text-mist-gray text-xs leading-relaxed">
                  Database connection issues correlate with increased API response times. 
                  Consider improving connection pool settings.
                </p>
              </div>
              <div className="text-sm">
                <p className="text-cloud-white font-medium mb-1">Prediction Alert</p>
                <p className="text-mist-gray text-xs leading-relaxed">
                  SSL certificate renewal required within 48 hours to prevent service disruption.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-bubo-indigo border-t border-slate-gray/30 p-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'observatory', icon: Eye, label: 'Observatory' },
            { id: 'signals', icon: Zap, label: 'Signals' },
            { id: 'incidents', icon: AlertTriangle, label: 'Incidents' },
            { id: 'assist', icon: Brain, label: 'Assist' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                activeTab === tab.id 
                  ? 'text-iq-green bg-iq-green/10' 
                  : 'text-mist-gray hover:text-cloud-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  );
};

export default BuboMobileView;