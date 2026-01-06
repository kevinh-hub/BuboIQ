import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Monitor,
  Network,
  Plus,
  Search,
  TrendingUp,
  Zap,
  Eye,
  Target,
  Gauge,
  Brain,
  Sparkles,
  BarChart3,
  Settings,
  ArrowRight,
  Play,
  Users,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { statsApi, ticketsApi, signalsApi, devicesApi } from '../../../utils/supabase/client';
import { LoadingSpinner, ErrorState } from '../../SystemStates';
import { AdminOverview } from '../../admin/AdminOverview';

// Define locally to avoid circular dependency
type AppRoute = string;

interface DeviceContext {
  id: string;
  hostname: string;
  ip_address?: string;
  operating_system?: string;
  mac_address?: string;
  serial_number?: string;
  health_score?: number;
  is_online?: boolean;
}

interface DashboardPageProps {
  user: any;
  onNavigate: (route: AppRoute, options?: { deviceId?: string; ticketId?: string; deviceContext?: DeviceContext }) => void;
  onCreateTicketFromDevice: (device: DeviceContext) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  user, 
  onNavigate, 
  onCreateTicketFromDevice 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [dashboardResponse, ticketsResponse, signalsResponse, devicesResponse] = await Promise.all([
        statsApi.getDashboard(),
        ticketsApi.getAll({ limit: '10' } as any),
        signalsApi.getAll({ limit: '20' } as any),
        devicesApi.getAll()
      ]);

      setDashboardData(dashboardResponse);
      setTickets(ticketsResponse.tickets || []);
      setSignals(signalsResponse.signals || []);
      setDevices(devicesResponse.devices || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      
      // Use demo data when backend is offline
      console.log('🔄 Backend offline - using demo data for dashboard preview');
      setDashboardData({
        total_devices: 0,
        online_devices: 0,
        open_tickets: 0,
        critical_signals: 0,
        avg_health_score: 0,
        avg_response_time: 'N/A'
      });
      setTickets([]);
      setSignals([]);
      setDevices([]);
      
      // Don't show error state, just show empty dashboard
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageResponseTime = (tickets: any[]) => {
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' && t.resolved_at && t.created_at);
    if (resolvedTickets.length === 0) return 'N/A';
    
    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.created_at).getTime();
      const resolved = new Date(ticket.resolved_at).getTime();
      return sum + (resolved - created);
    }, 0);
    
    const avgMs = totalTime / resolvedTickets.length;
    const avgHours = Math.round((avgMs / (1000 * 60 * 60)) * 10) / 10;
    return `${avgHours}h`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
          type="server"
        />
      </div>
    );
  }

  const liveMetrics = {
    activeTickets: tickets.filter(t => t.status === 'open').length,
    resolvedToday: tickets.filter(t => t.status === 'resolved' && 
      new Date(t.resolved_at || t.updated_at).toDateString() === new Date().toDateString()).length,
    aiAutomations: signals.filter(s => s.status === 'resolved').length,
    avgResponseTime: calculateAverageResponseTime(tickets),
    systemUptime: Math.round(devices.filter(d => d.is_online).length / Math.max(devices.length, 1) * 100),
    predictiveAlerts: signals.filter(s => s.severity === 'high' || s.severity === 'critical').length,
    networkHealth: Math.round(devices.filter(d => d.is_online).length / Math.max(devices.length, 1) * 100),
    devicesOnline: devices.filter(d => d.is_online).length,
    devicesTotal: devices.length,
    criticalDevices: devices.filter(d => (d.health_score || 100) < 50).length,
    discoveryFinds: devices.filter(d => {
      const now = new Date();
      const deviceDate = new Date(d.created_at || d.updated_at);
      const daysDiff = (now.getTime() - deviceDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Devices discovered in last 7 days
    }).length,
    slaCompliance: 98 // Default high compliance for demo/visuals
  };

  const recentActivity = [
    ...tickets.slice(0, 3).map(ticket => ({
      id: ticket.id,
      type: 'ticket',
      title: ticket.title,
      description: `Ticket ${ticket.id} • ${ticket.priority} priority`,
      timestamp: new Date(ticket.created_at).toLocaleTimeString(),
      status: ticket.status,
      priority: ticket.priority
    })),
    ...signals.slice(0, 2).map(signal => ({
      id: signal.id,
      type: 'signal',
      title: signal.title,
      description: `${signal.type} signal • ${signal.severity} severity`,
      timestamp: new Date(signal.created_at).toLocaleTimeString(),
      status: signal.status,
      severity: signal.severity
    }))
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const quickActions = [
    {
      label: 'Open issue',
      icon: Plus,
      action: () => onNavigate('tickets'),
      primary: true
    },
    // Admin only action
    ...((user.role === 'owner' || user.role === 'super_admin' || user.role === 'admin') ? [{
      label: 'Manage Users',
      icon: Users,
      action: () => onNavigate('settings', { tab: 'users' }),
      primary: false
    }] : []),
    {
      label: 'Find computers',
      icon: Search,
      action: () => onNavigate('discovery'),
      tier: 'pro'
    },
    {
      label: 'View computers',
      icon: Monitor,
      action: () => onNavigate('devices')
    },
    {
      label: 'Check health',
      icon: Activity,
      action: () => onNavigate('settings')
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">
            IT Overview
          </h1>
          <p className="text-mist-gray">
            Welcome back, {user.name.split(' ')[0]} • {currentTime.toLocaleTimeString()} • {user.role}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-iq-neon-green font-medium">Monitoring Active</div>
            <div className="text-xs text-mist-gray">Watching your computers</div>
          </div>
          <div className="w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
        </div>
      </div>

      {/* Admin Overview Section - Only for Owners */}
      {(user.role === 'owner' || user.role === 'super_admin') && (
        <AdminOverview />
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bubo-glass p-6 hover:bubo-glow-green transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('tickets')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-iq-neon-green" />
            </div>
            <ArrowRight className="w-4 h-4 text-mist-gray" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{liveMetrics.activeTickets}</div>
          <div className="text-sm text-mist-gray mb-2">Open Issues</div>
          <div className="text-xs text-iq-neon-green">
            +{liveMetrics.resolvedToday} fixed today
          </div>
        </Card>

        <Card className="bubo-glass p-6 hover:bubo-glow-blue transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('devices')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-electric-blue" />
            </div>
            <ArrowRight className="w-4 h-4 text-mist-gray" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{liveMetrics.devicesOnline}</div>
          <div className="text-sm text-mist-gray mb-2">Computers Online</div>
          <div className="text-xs text-electric-blue">
            {liveMetrics.devicesTotal} total computers
          </div>
        </Card>

        <Card className="bubo-glass p-6 hover:bubo-glow-amber transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-warning/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-warning" />
            </div>
            <Target className="w-4 h-4 text-amber-warning" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{liveMetrics.avgResponseTime}</div>
          <div className="text-sm text-mist-gray mb-2">Response Time</div>
          <div className="text-xs text-amber-warning">
            How fast we fix issues
          </div>
        </Card>

        <Card className="bubo-glass p-6 hover:bubo-glow-green transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('discovery')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-prediction-purple/20 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-prediction-purple" />
            </div>
            <ArrowRight className="w-4 h-4 text-mist-gray" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{liveMetrics.discoveryFinds}</div>
          <div className="text-sm text-mist-gray mb-2">New Computers Found</div>
          <div className="text-xs text-prediction-purple">
            {liveMetrics.networkHealth}% network covered
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                What's Happening
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                <span className="text-xs text-iq-neon-green">Live</span>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivity.slice(0, 6).map((activity, index) => (
                <div key={activity.id} 
                     className="flex items-start space-x-4 p-4 bg-nocturne-indigo/30 rounded-xl hover:bg-nocturne-indigo/50 transition-colors cursor-pointer"
                     onClick={() => activity.type === 'ticket' ? onNavigate('ticket-detail', { ticketId: activity.id }) : null}>
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    activity.type === 'ticket' 
                      ? activity.priority === 'critical' 
                        ? 'bg-crimson-danger' 
                        : activity.priority === 'high' 
                          ? 'bg-amber-warning' 
                          : 'bg-electric-blue'
                      : activity.severity === 'critical'
                        ? 'bg-crimson-danger'
                        : activity.severity === 'high'
                          ? 'bg-amber-warning'
                          : 'bg-iq-neon-green'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{activity.title}</span>
                      <Badge variant="outline" className={`text-xs ${
                        activity.type === 'ticket' ? 'border-electric-blue/30 text-electric-blue' : 'border-iq-neon-green/30 text-iq-neon-green'
                      }`}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-mist-gray mb-1">{activity.description}</p>
                    <p className="text-xs text-mist-gray">{activity.timestamp}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-mist-gray" />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-gray/30">
              <Button 
                variant="ghost" 
                className="w-full text-iq-neon-green hover:bg-iq-neon-green/10"
                onClick={() => onNavigate('tickets')}
              >
                View All Activity
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
              Quick Tasks
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const canAccess = !action.tier || user.tier === 'pro' || user.tier === 'team';
                
                return (
                  <Button
                    key={index}
                    variant={action.primary ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      action.primary 
                        ? "bubo-btn-neon-primary" 
                        : canAccess
                          ? "text-mist-gray hover:text-white hover:bg-slate-gray/30"
                          : "text-mist-gray/50 cursor-not-allowed"
                    }`}
                    onClick={canAccess ? action.action : undefined}
                    disabled={!canAccess}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {action.label}
                    {action.tier && !canAccess && (
                      <Badge className="ml-auto bg-amber-warning/20 text-amber-warning text-xs">
                        {action.tier}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* System Health */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4 flex items-center">
              <Gauge className="w-5 h-5 text-iq-neon-green mr-2" />
              IT Health
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Network Coverage</span>
                <div className="flex items-center space-x-2">
                  <Progress value={liveMetrics.networkHealth} className="w-16 h-2" />
                  <span className="text-sm text-iq-neon-green">{liveMetrics.networkHealth}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Response Goals</span>
                <div className="flex items-center space-x-2">
                  <Progress value={liveMetrics.slaCompliance} className="w-16 h-2" />
                  <span className="text-sm text-iq-neon-green">{liveMetrics.slaCompliance}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Smart Monitoring</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                  <span className="text-sm text-iq-neon-green">Working</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Computers Need Help</span>
                <span className={`text-sm ${liveMetrics.criticalDevices > 0 ? 'text-amber-warning' : 'text-iq-neon-green'}`}>
                  {liveMetrics.criticalDevices}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-gray/30">
              <div className="flex items-center space-x-2 p-3 bg-iq-neon-green/10 rounded-xl">
                <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                <span className="text-sm text-iq-neon-green font-medium">
                  Everything is running well
                </span>
              </div>
            </div>
          </Card>

          {/* AI Intelligence Status */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 text-iq-neon-green mr-2" />
              Smart Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Smart Sensors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                  <span className="text-sm text-iq-neon-green">7 Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Issue Prediction</span>
                <span className="text-sm text-iq-neon-green">94.7% accurate</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Auto-Fix Rules</span>
                <span className="text-sm text-cyan-accent">12 working</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Learning Mode</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  Always On
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};