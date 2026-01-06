import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Shield, 
  Activity, 
  Users, 
  Settings, 
  LogOut, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Eye,
  Bell,
  Monitor,
  Globe,
  Crown,
  HelpCircle,
  Command,
  BarChart3,
  Clock,
  Sparkles,
  Target,
  Layers,
  ArrowUp,
  Info,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Plus,
  ChevronRight,
  Lightbulb,
  Gauge,
  Network
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { RemoteIntegrationsShowcase } from './RemoteIntegrationsShowcase';
import { IntegrationsShowcase } from './IntegrationsShowcase';
import { DashboardPreview } from './marketing/DashboardPreview';
import { UpgradeModal } from './marketing/UpgradeModal';
import { TierGuard, useTierAccess } from './TierGuard';
import { useAuth } from '../context/AuthContext';
import { ticketsApi, signalsApi, devicesApi, statsApi } from '../utils/supabase/client';
import { LoadingSpinner, ErrorState, EmptyState, SystemStatus } from './SystemStates';
import { UpgradeSuccessModal } from './marketing/UpgradeSuccessModal';
import { TierLockingMatrix } from './marketing/TierLockingMatrix';
import { ProFeatureTooltip } from './marketing/ProFeatureTooltip';
import { PlanBadge } from './marketing/PlanBadge';
import { TicketConnectPanel } from './connect/TicketConnectPanel';

interface BuboMainDashboardProps {
  user: any;
  onLogout: () => void;
}

export const BuboMainDashboard: React.FC<BuboMainDashboardProps> = ({ user, onLogout }) => {
  const { hasRole, checkTierAccess } = useAuth();
  const { currentTier, isStarter, isPro, isTeam } = useTierAccess();
  
  // State management
  const [activeTab, setActiveTab] = useState('live');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [aiStatus, setAiStatus] = useState<'active' | 'learning' | 'idle'>('active');
  
  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showQuickTour, setShowQuickTour] = useState(false);

  // Use unified tier state
  const userPlan = currentTier;
  const showProPill = isPro;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem(`bubo_visited_${user.id}`);
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem(`bubo_visited_${user.id}`, 'true');
    }
  }, [user.id]);

  useEffect(() => {
    // Simulate AI status changes for demo
    const aiStatusInterval = setInterval(() => {
      const statuses: Array<'active' | 'learning' | 'idle'> = ['active', 'learning', 'idle'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setAiStatus(randomStatus);
    }, 15000);

    return () => clearInterval(aiStatusInterval);
  }, []);

  // Data loading on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  // Data loading function
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [dashboardResponse, ticketsResponse, signalsResponse, devicesResponse] = await Promise.all([
        statsApi.getDashboard(),
        ticketsApi.getAll({ limit: '10' }),
        signalsApi.getAll({ limit: '20' }),
        devicesApi.getAll()
      ]);

      setDashboardData(dashboardResponse);
      setTickets(ticketsResponse.tickets || []);
      setSignals(signalsResponse.signals || []);
      setDevices(devicesResponse.devices || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  // Static data for demo (replace with real data from API)
  const incidents = tickets.slice(0, 3).map((ticket, index) => ({
    id: ticket.id || `INC-00${index + 1}`,
    title: ticket.title || 'System Alert',
    severity: ticket.priority === 'critical' ? 'Critical' : 
              ticket.priority === 'high' ? 'High' : 
              ticket.priority === 'medium' ? 'Medium' : 'Low',
    status: ticket.status === 'open' ? 'Active' :
            ticket.status === 'in_progress' ? 'Investigating' : 'Resolved',
    confidence: ticket.risk_score || 85,
    assignee: ticket.assignee?.name || 'Unassigned',
    time: new Date(ticket.created_at).toLocaleString(),
    eta: ticket.sla_deadline ? `${Math.max(0, Math.floor((new Date(ticket.sla_deadline).getTime() - Date.now()) / (1000 * 60)))} mins` : 'No SLA',
    aiActions: Math.floor(Math.random() * 5) + 1
  }));

  const liveMetrics = {
    activeTickets: tickets.filter(t => t.status === 'open').length,
    resolvedToday: tickets.filter(t => t.status === 'resolved' && 
      new Date(t.resolved_at || t.updated_at).toDateString() === new Date().toDateString()).length,
    aiAutomations: signals.filter(s => s.status === 'resolved').length,
    avgResponseTime: '2.3h',
    slaCompliance: 94,
    teamEfficiency: 87,
    predictiveAlerts: signals.filter(s => s.severity === 'high' || s.severity === 'critical').length,
    networkHealth: Math.round(devices.filter(d => d.is_online).length / Math.max(devices.length, 1) * 100)
  };

  const recentAiActions = signals.slice(0, 4).map((signal, index) => ({
    time: new Date(signal.created_at).toLocaleTimeString(),
    action: `${signal.type}: ${signal.title}`,
    type: signal.severity === 'critical' ? 'escalation' : 
          signal.status === 'resolved' ? 'resolution' : 'triage'
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'High': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'Medium': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      default: return 'bg-iq-green/20 text-iq-green border-iq-green/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-crimson-danger/20 text-crimson-danger';
      case 'Investigating': return 'bg-amber-warning/20 text-amber-warning';
      case 'Resolved': return 'bg-iq-green/20 text-iq-green';
      default: return 'bg-slate-gray/20 text-mist-gray';
    }
  };

  // Show loading state while data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-midnight">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  // Show error state if data loading failed
  if (error) {
    return (
      <div className="min-h-screen bg-dark-midnight">
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
          type="server"
        />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-gray/30 bg-dark-midnight/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-iq-neon-green" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-blue rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
                  <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> <span className="text-sm font-normal text-mist-gray">Live</span>
                </h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus === 'active' ? 'bg-iq-neon-green animate-pulse' :
                    aiStatus === 'learning' ? 'bg-amber-warning animate-pulse' : 'bg-slate-gray'
                  }`} />
                  <p className="text-xs text-mist-gray">
                    {aiStatus === 'active' ? 'Watching for problems' :
                     aiStatus === 'learning' ? 'Learning patterns' : 'Watching'}
                  </p>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-mist-gray">Plan:</span>
                  <PlanBadge variant={userPlan} />
                  {showProPill && userPlan === 'pro' && (
                    <Badge className="bg-iq-neon-green text-dark-midnight px-2 py-1 animate-pulse">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Unlocked!
                    </Badge>
                  )}
                  {userPlan === 'basic' && (
                    <Button
                      onClick={handleUpgrade}
                      className="bubo-btn-ghost text-xs px-2 py-1"
                      size="sm"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
                <Bell className="w-5 h-5 text-mist-gray hover:text-iq-neon-green cursor-pointer transition-colors" />
                <div className="text-right">
                  <div className="text-sm font-medium text-cloud-white">{user.name}</div>
                  <div className="text-xs text-mist-gray">{user.specialization}</div>
                </div>
                <Avatar className="w-8 h-8 bg-iq-neon-green/20">
                  <div className="w-full h-full flex items-center justify-center text-iq-neon-green font-semibold">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </Avatar>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-mist-gray hover:text-crimson-danger hover:bg-crimson-danger/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
                Welcome back, {user.name.split(' ')[0]}
              </h2>
              <p className="text-mist-gray">
                Intelligence dashboard • {currentTime.toLocaleTimeString()} • {user.department}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-iq-neon-green font-medium">AI Intelligence Active</div>
                <div className="text-xs text-mist-gray">Neural networks online</div>
              </div>
              <div className="w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Dashboard Preview with Pro Gating */}
        <DashboardPreview 
          userPlan={userPlan}
          userId={user.id}
          onUpgrade={handleUpgrade}
        />

        {/* Main Dashboard Tabs */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-nocturne-indigo/50">
              <TabsTrigger value="live" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                <Activity className="w-4 h-4 mr-2" />
                Live
              </TabsTrigger>
              <TabsTrigger value="incidents" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Incidents
              </TabsTrigger>
              
              {/* Intelligence Tab - Pro Feature */}
              {userPlan === 'pro' ? (
                <TabsTrigger value="intelligence" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                  <Brain className="w-4 h-4 mr-2" />
                  Intelligence
                </TabsTrigger>
              ) : (
                <ProFeatureTooltip
                  feature="ai-triage"
                  title="AI Intelligence Center"
                  description="Powerful AI analytics, neural network insights, and predictive intelligence for proactive IT support."
                  value="94% accuracy in issue prediction"
                  onUpgrade={openUpgradeModal}
                  userId={user.id}
                >
                  <TabsTrigger 
                    value="intelligence" 
                    className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green opacity-60 cursor-help"
                    onClick={(e) => {
                      e.preventDefault();
                      openUpgradeModal('ai-triage');
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Intelligence
                    <Crown className="w-3 h-3 ml-1 text-amber-warning" />
                  </TabsTrigger>
                </ProFeatureTooltip>
              )}
              
              <TabsTrigger value="remote" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                <Monitor className="w-4 h-4 mr-2" />
                Remote
              </TabsTrigger>
              
              {/* Integrations Tab - Pro Feature for unlimited */}
              {userPlan === 'pro' ? (
                <TabsTrigger value="integrations" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                  <Globe className="w-4 h-4 mr-2" />
                  Integrations
                </TabsTrigger>
              ) : (
                <ProFeatureTooltip
                  feature="integrations"
                  title="Unlimited Integrations"
                  description="Connect with 200+ tools and services. Basic plan includes 2 integrations."
                  value="Unlimited connections"
                  onUpgrade={openUpgradeModal}
                  userId={user.id}
                >
                  <TabsTrigger value="integrations" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                    <Globe className="w-4 h-4 mr-2" />
                    Integrations
                    {userPlan === 'basic' && (
                      <Badge className="ml-2 bg-amber-warning/20 text-amber-warning text-xs">
                        2/2
                      </Badge>
                    )}
                  </TabsTrigger>
                </ProFeatureTooltip>
              )}
              
              <TabsTrigger value="settings" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Live Dashboard */}
            <TabsContent value="live" className="space-y-6">
              {/* First Time User Guide */}
              {isFirstVisit && (
                <Card className="bubo-glass-bright border-iq-neon-green/50 p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-iq-neon-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-2">
                        Welcome to BuboIQ Live! 
                      </h3>
                      <p className="text-cloud-white mb-4">
                        Your AI-powered command center is now active. Watch as BuboIQ automatically detects, 
                        triages, and resolves IT issues in real-time.
                      </p>
                      <div className="flex items-center space-x-3">
                        <Button 
                          onClick={() => setShowQuickTour(true)}
                          className="bubo-btn-neon-primary text-sm"
                          size="sm"
                        >
                          Take Quick Tour
                        </Button>
                        <Button 
                          onClick={() => setIsFirstVisit(false)}
                          variant="ghost"
                          className="text-mist-gray hover:text-pure-white text-sm"
                          size="sm"
                        >
                          Got it
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bubo-glass p-4 hover:bubo-glow-green transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-iq-neon-green" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-iq-neon-green" />
                  </div>
                  <div className="text-2xl font-bold text-pure-white">{liveMetrics.activeTickets}</div>
                  <div className="text-xs text-mist-gray">Active Tickets</div>
                  <div className="text-xs text-iq-neon-green mt-1">
                    +{liveMetrics.resolvedToday} resolved today
                  </div>
                </Card>

                <Card className="bubo-glass p-4 hover:bubo-glow-blue transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-electric-blue" />
                    </div>
                    <Sparkles className="w-4 h-4 text-electric-blue" />
                  </div>
                  <div className="text-2xl font-bold text-pure-white">{liveMetrics.aiAutomations}</div>
                  <div className="text-xs text-mist-gray">AI Automations</div>
                  <div className="text-xs text-electric-blue mt-1">Active rules</div>
                </Card>

                <Card className="bubo-glass p-4 hover:bubo-glow-amber transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-amber-warning/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-warning" />
                    </div>
                    <Target className="w-4 h-4 text-amber-warning" />
                  </div>
                  <div className="text-2xl font-bold text-pure-white">{liveMetrics.avgResponseTime}</div>
                  <div className="text-xs text-mist-gray">Avg Response</div>
                  <div className="text-xs text-amber-warning mt-1">
                    {liveMetrics.slaCompliance}% SLA compliance
                  </div>
                </Card>

                <Card className="bubo-glass p-4 hover:bubo-glow-green transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-prediction-purple/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-prediction-purple" />
                    </div>
                    <Gauge className="w-4 h-4 text-prediction-purple" />
                  </div>
                  <div className="text-2xl font-bold text-pure-white">{liveMetrics.predictiveAlerts}</div>
                  <div className="text-xs text-mist-gray">Predictive Alerts</div>
                  <div className="text-xs text-prediction-purple mt-1">
                    {liveMetrics.networkHealth}% network health
                  </div>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Real-time AI Actions */}
                  <Card className="bubo-glass p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white flex items-center">
                        <Brain className="w-5 h-5 text-iq-neon-green mr-2" />
                        AI Live Actions
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                        <span className="text-xs text-iq-neon-green">Live</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {recentAiActions.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-nocturne-indigo/30 rounded-xl bubo-animate-fadeInUp">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            action.type === 'triage' ? 'bg-electric-blue' :
                            action.type === 'resolution' ? 'bg-iq-neon-green' :
                            action.type === 'prediction' ? 'bg-prediction-purple' : 'bg-amber-warning'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-cloud-white">{action.action}</p>
                            <p className="text-xs text-mist-gray">{action.time}</p>
                          </div>
                          <Badge className={`text-xs ${
                            action.type === 'triage' ? 'bg-electric-blue/20 text-electric-blue border-electric-blue/30' :
                            action.type === 'resolution' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' :
                            action.type === 'prediction' ? 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30' :
                            'bg-amber-warning/20 text-amber-warning border-amber-warning/30'
                          }`}>
                            {action.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Active Incidents with Enhanced Info */}
                  <Card className="bubo-glass p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                        Active Incidents
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-mist-gray hover:text-iq-neon-green">
                          <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-mist-gray hover:text-iq-neon-green">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {incidents.map((incident) => (
                        <div key={incident.id} className="p-4 bg-nocturne-indigo/30 rounded-xl hover:bg-nocturne-indigo/50 transition-all cursor-pointer group">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-cloud-white group-hover:text-iq-neon-green transition-colors">
                                  {incident.title}
                                </span>
                                <Badge className={getSeverityColor(incident.severity)}>
                                  {incident.severity}
                                </Badge>
                                <Badge className={getStatusColor(incident.status)}>
                                  {incident.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-mist-gray">
                                <span className="font-mono">{incident.id}</span>
                                <span>•</span>
                                <span>{incident.assignee}</span>
                                <span>•</span>
                                <span>{incident.time}</span>
                                <span>•</span>
                                <span className="text-iq-neon-green">ETA: {incident.eta}</span>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-xs text-iq-neon-green font-medium">
                                {incident.confidence}% confidence
                              </div>
                              <div className="text-xs text-electric-blue">
                                {incident.aiActions} AI actions
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Progress value={incident.confidence} className="w-24 h-1" />
                            <ChevronRight className="w-4 h-4 text-mist-gray group-hover:text-iq-neon-green transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* AI Status Panel */}
                  <Card className="bubo-glass p-6">
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-4 flex items-center">
                      <Network className="w-5 h-5 text-iq-neon-green mr-2" />
                      AI Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist-gray">Neural Networks</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                          <span className="text-sm text-iq-neon-green">7 Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist-gray">Prediction Engine</span>
                        <span className="text-sm text-iq-neon-green">94.7% accuracy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist-gray">Auto-resolution</span>
                        <span className="text-sm text-cyan-accent">12 active rules</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mist-gray">Learning Status</span>
                        <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                          Continuous
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bubo-glass p-6">
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full bubo-btn-secondary justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Ticket
                      </Button>
                      <Button className="w-full bubo-btn-ghost justify-start">
                        <Search className="w-4 h-4 mr-2" />
                        Search Issues
                      </Button>
                      <Button className="w-full bubo-btn-ghost justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button className="w-full bubo-btn-ghost justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        AI Settings
                      </Button>
                    </div>
                  </Card>

                  {/* Connect Panel */}
                  <TicketConnectPanel
                    ticketId="INC-001"
                    userTier={userPlan}
                    onUpgrade={handleUpgrade}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Incidents */}
                <Card className="bubo-glass p-6">
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-4">
                    Recent Incidents
                  </h3>
                  <div className="space-y-4">
                    {incidents.slice(0, 3).map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-3 bg-nocturne-indigo/30 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-cloud-white">{incident.title}</span>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-mist-gray">
                            <span>{incident.id}</span>
                            <span>•</span>
                            <span>{incident.assignee}</span>
                            <span>•</span>
                            <span>{incident.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-iq-neon-green font-medium">
                            {incident.confidence}% confidence
                          </div>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* AI Intelligence Status */}
                <Card className="bubo-glass p-6">
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-4">
                    AI Intelligence Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Neural Network Status</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" />
                        <span className="text-sm text-iq-green">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Learning Models</span>
                      <span className="text-sm text-cloud-white">7 Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Prediction Accuracy</span>
                      <span className="text-sm text-iq-neon-green">94.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">False Positive Rate</span>
                      <span className="text-sm text-cyan-accent">2.1%</span>
                    </div>
                    <div className="mt-4 p-3 bg-iq-neon-green/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                        <span className="text-sm text-iq-neon-green font-medium">
                          All systems operating normally
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Incidents List */}
                <div className="lg:col-span-2">
                  <Card className="bubo-glass p-6">
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-6">
                      Active Incidents
                    </h3>
                    <div className="space-y-3">
                      {incidents.map((incident) => (
                        <div key={incident.id} className="p-4 bg-nocturne-indigo/30 rounded-xl hover:bg-nocturne-indigo/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-cloud-white">{incident.title}</span>
                              <Badge className={getSeverityColor(incident.severity)}>
                                {incident.severity}
                              </Badge>
                              <Badge className={getStatusColor(incident.status)}>
                                {incident.status}
                              </Badge>
                            </div>
                            <span className="text-sm text-iq-neon-green font-medium">
                              {incident.confidence}% confidence
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-mist-gray">
                            <span>{incident.id}</span>
                            <span>•</span>
                            <span>Assigned to {incident.assignee}</span>
                            <span>•</span>
                            <span>{incident.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Connect Panel */}
                <div className="lg:col-span-1">
                  <TicketConnectPanel
                    ticketId="INC-001"
                    userTier={userPlan}
                    onUpgrade={handleUpgrade}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-6">
                  AI Intelligence Center
                </h3>
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-iq-neon-green mx-auto mb-4 animate-pulse" />
                  <h4 className="text-lg font-semibold text-cloud-white mb-2">
                    Intelligence Module Loading...
                  </h4>
                  <p className="text-mist-gray mb-6">
                    Powerful AI analytics and neural network insights will be available in the full platform.
                  </p>
                  <Button className="bubo-btn-neon-primary">
                    Access Full Intelligence Suite
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="remote" className="space-y-6">
              <RemoteIntegrationsShowcase />
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <IntegrationsShowcase />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-6">
                  Platform Settings
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-nocturne-indigo/30 rounded-xl">
                    <h4 className="font-medium text-cloud-white mb-2">User Profile</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mist-gray">Name:</span>
                        <span className="text-cloud-white">{user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mist-gray">Role:</span>
                        <span className="text-cloud-white">{user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mist-gray">Department:</span>
                        <span className="text-cloud-white">{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mist-gray">Specialization:</span>
                        <span className="text-cloud-white">{user.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mist-gray">Plan:</span>
                        <PlanBadge variant={userPlan} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <Settings className="w-16 h-16 text-mist-gray mx-auto mb-4" />
                    <p className="text-mist-gray">
                      Detailed settings and configuration options will be available in the full platform.
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Feature Comparison Matrix */}
              <TierLockingMatrix 
                userPlan={userPlan}
                onUpgrade={(feature) => feature ? openUpgradeModal(feature as any) : handleUpgrade()}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Upgrade Modal */}
      {upgradeModal.feature && (
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={closeUpgradeModal}
          feature={upgradeModal.feature}
          userId={user.id}
          onUpgradeComplete={handleUpgradeComplete}
        />
      )}

      {/* Upgrade Success Modal */}
      {successModal.isOpen && (
        <UpgradeSuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ isOpen: false })}
          unlockedFeature={successModal.unlockedFeature}
        />
      )}

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />

      {/* System Status Popover */}
      {dashboardData && (
        <div className="fixed bottom-6 right-6 z-40">
          <SystemStatus
            uptime={dashboardData.system?.uptime || 99.9}
            errorRate={dashboardData.system?.errorRate || 0.1}
            queueDepth={dashboardData.system?.queueDepth || 0}
          />
        </div>
      )}
    </div>
  );
};