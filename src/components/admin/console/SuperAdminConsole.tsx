import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Shield, 
  CreditCard, 
  Building, 
  Server, 
  FileText, 
  PlayCircle, 
  Activity,
  Search,
  Bell,
  User,
  ChevronDown,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  LogOut,
  Brain,
  LayoutTemplate,
  Monitor,
  Ticket,
  Download,
  History,
  Webhook,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Avatar } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { useAuth } from '../../../context/AuthContext';
import { PlanBadge } from '../../marketing/PlanBadge';

import { SuperAdminProvider, useSuperAdmin } from './SuperAdminContext';

// Dashboard Cards
import { PlatformOverviewCard } from './dashboard/PlatformOverviewCard';
import { FeatureMatrixCard } from './dashboard/FeatureMatrixCard';
import { PricingPlansCard } from './dashboard/PricingPlansCard';
import { OrgTestAccountsCard } from './dashboard/OrgTestAccountsCard';
import { AgentsDevicesCard } from './dashboard/AgentsDevicesCard';
import { ComplianceCard } from './dashboard/ComplianceCard';
import { IntegrationsCard } from './dashboard/IntegrationsCard';
import { DemoPresetsCard } from './dashboard/DemoPresetsCard';
import { AdminProtocolCard } from './dashboard/AdminProtocolCard';
import { DangerSystemStrip } from './dashboard/DangerSystemStrip';

// Full Pages (kept for drill-down, though mostly we focus on Overview)
import { FeatureControls } from '../FeatureControls';
import { OrganizationManagement } from '../OrganizationManagement';
import { PricingManagement } from '../PricingManagement';
import { AgentsManagement } from '../AgentsManagement';
import { ComplianceManagement } from '../ComplianceManagement';
import { DemoManagement } from '../DemoManagement';
import { ActivityLogFull } from '../ActivityLogFull';

type ConsoleView = 'overview' | 'features' | 'pricing' | 'orgs' | 'agents' | 'compliance' | 'demo' | 'logs' | 'orgs-manager';

const DashboardContent = () => {
  const { config, loading } = useSuperAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iq-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Platform Overview */}
      <PlatformOverviewCard />

      {/* 2. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Row 2: Feature Matrix (2/3) + Pricing (1/3) */}
        <FeatureMatrixCard />
        <div className="lg:row-span-2">
          <PricingPlansCard />
        </div>

        {/* Row 3: Orgs + Agents */}
        <OrgTestAccountsCard />
        <AgentsDevicesCard />

        {/* Row 4: Compliance + Integrations + Demo Presets */}
        <ComplianceCard />
        <IntegrationsCard />
        <DemoPresetsCard />
        
        {/* Row 5: Admin Protocol (Full Width) */}
        <AdminProtocolCard />
      </div>

      {/* 3. Danger Strip */}
      <DangerSystemStrip />
    </div>
  );
};

export const SuperAdminConsole = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ConsoleView>('overview');
  const [environment, setEnvironment] = useState('production');
  const [scope, setScope] = useState('global');

  // Navigation Items - Cleaned up for Super Admin Context
  const navItems = [
    { section: 'Platform Control', items: [
      { id: 'overview', label: 'Owner / Super Admin Console', icon: Shield, active: currentView === 'overview' },
      { id: 'orgs-manager', label: 'Organization Manager', icon: Building, active: currentView === 'orgs-manager' },
    ]},
    { section: 'System Intelligence', items: [
      { id: 'audit', label: 'Audit Logs', icon: History, active: currentView === 'logs' },
      { id: 'api', label: 'API & Webhooks', icon: Webhook, active: currentView === 'api' },
    ]}
  ];

  const renderContent = () => {
    if (currentView === 'orgs-manager') {
      return (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setCurrentView('overview')} className="text-mist-gray hover:text-white">
              ← Back to Console
            </Button>
            <h2 className="text-xl font-bold text-white">Organization Manager</h2>
          </div>
          <OrganizationManagement />
        </div>
      );
    }
    
    if (currentView === 'logs') {
      return (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setCurrentView('overview')} className="text-mist-gray hover:text-white">
              ← Back to Console
            </Button>
            <h2 className="text-xl font-bold text-white">System Audit Logs</h2>
          </div>
          <div className="p-8 border border-slate-gray/30 rounded-lg bg-white/5 text-center text-mist-gray">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white">Full Audit Log Archive</h3>
            <p className="max-w-md mx-auto mt-2">Detailed system-wide logs would be displayed here, allowing filtering by Admin, Action, and Entity.</p>
          </div>
        </div>
      );
    }

     if (currentView === 'api') {
      return (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setCurrentView('overview')} className="text-mist-gray hover:text-white">
              ← Back to Console
            </Button>
            <h2 className="text-xl font-bold text-white">API & Webhooks</h2>
          </div>
          <div className="p-8 border border-slate-gray/30 rounded-lg bg-white/5 text-center text-mist-gray">
            <Webhook className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white">API Configuration</h3>
            <p className="max-w-md mx-auto mt-2">Global API keys and Webhook endpoints for platform-wide integrations.</p>
          </div>
        </div>
      );
    }

    // Default to Overview Dashboard
    return <DashboardContent />;
  };

  return (
    <SuperAdminProvider environment={environment}>
      <SuperAdminConsoleInner 
        user={user} 
        signOut={signOut} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        environment={environment} 
        setEnvironment={setEnvironment} 
        scope={scope} 
        setScope={setScope}
        navItems={navItems}
        renderContent={renderContent}
      />
    </SuperAdminProvider>
  );
};

const SuperAdminConsoleInner = ({ 
  user, signOut, currentView, setCurrentView, 
  environment, setEnvironment, scope, setScope, 
  navItems, renderContent 
}: any) => {
  const { config } = useSuperAdmin();
  
  // Check for active overrides
  const overridesActive = config?.overrides ? Object.values(config.overrides).some(v => v) : false;

  return (
    <div className="min-h-screen bg-dark-midnight text-white flex font-sans">
      {/* Left Sidebar */}
      <div className="w-72 bg-dark-midnight border-r border-slate-gray/30 flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-xl font-bold">
                <span className="text-white">BUBO</span>
                <span className="text-iq-neon-green">IQ</span>
              </h1>
              <p className="text-xs text-mist-gray">Intelligence Platform</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-8">
          {navItems.map((section, idx) => (
            <div key={idx}>
              <div className="text-xs font-semibold text-mist-gray uppercase tracking-wider mb-3 px-3">
                {section.section}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start ${
                      item.active
                        ? 'bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30'
                        : 'text-mist-gray hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => setCurrentView(item.id as ConsoleView)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-gray/30 bg-dark-midnight/95">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-8 h-8 bg-iq-neon-green/20">
               <div className="w-full h-full flex items-center justify-center text-iq-neon-green font-semibold text-sm">
                 {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SA'}
               </div>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || 'Super Admin'}</div>
              <div className="text-xs text-mist-gray truncate">Owner Access</div>
            </div>
            <PlanBadge variant="team" />
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-mist-gray hover:text-crimson-danger hover:bg-crimson-danger/10" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen relative bg-gradient-to-br from-dark-midnight via-[#0B101B] to-[#05080F]">
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-iq-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header */}
        <header className="flex flex-col sticky top-0 z-10">
          <div className="h-20 border-b border-slate-gray/30 bg-dark-midnight/80 backdrop-blur-xl flex items-center justify-between px-8">
            {/* Left: Title & Subtitle */}
            <div>
              <h1 className="text-xl font-space-grotesk font-bold text-white flex items-center gap-3">
                Owner / Super Admin Console
                <Badge variant="outline" className="border-iq-neon-green/50 text-iq-neon-green bg-iq-neon-green/10 text-[10px]">MASTER</Badge>
              </h1>
              <p className="text-xs text-mist-gray">Global control of BuboIQ features, pricing, and organizations.</p>
            </div>

            {/* Right: Environment & Scope */}
            <div className="flex items-center space-x-4">
              {/* Environment Selector */}
              <div className="flex bg-slate-gray/20 rounded-lg p-1">
                {['Production', 'Staging', 'Demo'].map((env) => {
                  const id = env.toLowerCase();
                  const isActive = environment === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setEnvironment(id)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-iq-neon-green text-dark-midnight shadow-sm font-bold'
                          : 'text-mist-gray hover:text-white'
                      }`}
                    >
                      {env}
                    </button>
                  );
                })}
              </div>

              <div className="h-8 w-[1px] bg-slate-gray/30" />

              {/* Org Scope */}
              <div className="flex items-center space-x-2 bg-dark-midnight/50 px-3 py-1.5 rounded-lg border border-slate-gray/30">
                <span className="text-xs text-mist-gray">Scope:</span>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger className="h-6 border-none bg-transparent text-white text-xs focus:ring-0 w-[140px] p-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Orgs)</SelectItem>
                    <SelectItem value="test-msp">Test MSP Corp</SelectItem>
                    <SelectItem value="acme">Acme Industries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Overrides Status Strip */}
          {overridesActive && (
            <div className="bg-crimson-danger/10 border-b border-crimson-danger/20 py-1.5 px-8 flex items-center justify-center space-x-2 animate-in slide-in-from-top-2 fade-in duration-300">
              <Badge variant="default" className="bg-crimson-danger hover:bg-crimson-danger text-white text-[9px] px-1.5 py-0 h-4">OVERRIDES ACTIVE</Badge>
              <span className="text-xs font-medium text-crimson-danger/90 tracking-wide">
                Global restrictions are currently bypassed in this environment.
              </span>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
