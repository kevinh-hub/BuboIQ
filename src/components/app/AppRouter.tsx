import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Monitor,
  Search,
  Ticket,
  Users,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Crown,
  Brain,
  Activity,
  Download,
  Building,
  CreditCard,
  History,
  Webhook,
  User,
  ShieldCheck,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useAuth } from '../../context/AuthContext';

// Import page components
import { DashboardPage } from './pages/DashboardPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { AgentsPage } from './pages/AgentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TierGuard } from '../TierGuard';
import { PlanBadge } from '../marketing/PlanBadge';

// Import Knowledge Base components
import { 
  ReviewerConsole, 
  KnowledgeBaseMetrics,
  SupabaseSchemaVisualization
} from '../knowledge-base';
import { SimplifiedKnowledgeBasePage } from '../knowledge-base/SimplifiedKnowledgeBasePage';
import { SimplifiedArticleDetailPage } from '../knowledge-base/SimplifiedArticleDetailPage';
import { SuperAdminConsole } from '../admin/console/SuperAdminConsole';
import TrialCountdown from '../TrialCountdown';
import { calculateTrialDaysRemaining } from '../../utils/trial';

export type AppRoute = 
  | 'dashboard'
  | 'devices'
  | 'device-detail'
  | 'discovery'
  | 'tickets'
  | 'ticket-detail'
  | 'settings'
  | 'agents'
  | 'knowledge-base'
  | 'article-detail'
  | 'reviewer-console'
  | 'kb-metrics'
  | 'schema-viz'
  | 'super-admin-console';

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

interface AppRouterProps {
  user: any;
  onLogout: () => void;
  onNavigateToMarketing?: (page: string) => void;
}

type AppRole = "super_admin" | "owner" | "admin" | "agent" | "viewer" | "guest";

// --- Safe Routing Implementation ---

// Props bag that all pages can potentially receive
interface RouteProps {
  user: any;
  onNavigate: (route: AppRoute, options?: any) => void;
  onCreateTicketFromDevice?: (device: DeviceContext) => void;
  onClearDeviceContext?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  
  // Context specific
  deviceId?: string | null;
  ticketId?: string | null;
  deviceContext?: DeviceContext | null;
  articleId?: string | null;
}

// Wrapper for TierGuard pages to ensure they are valid components
const DiscoveryPageWrapper = (props: RouteProps) => (
  <TierGuard requiredTier="pro" feature="discovery">
    <DiscoveryPage user={props.user} onNavigate={props.onNavigate} />
  </TierGuard>
);

// Role-based route mapping
const ROUTES_BY_ROLE: Record<string, Record<string, React.ComponentType<any>>> = {
  owner: {
    'dashboard': DashboardPage,
    'devices': DevicesPage,
    'device-detail': DeviceDetailPage,
    'discovery': DiscoveryPageWrapper,
    'tickets': TicketsPage,
    'ticket-detail': TicketDetailPage,
    'settings': SettingsPage,
    'agents': AgentsPage,
    'knowledge-base': SimplifiedKnowledgeBasePage,
    'article-detail': SimplifiedArticleDetailPage,
    'reviewer-console': ReviewerConsole,
    'kb-metrics': KnowledgeBaseMetrics,
    'schema-viz': SupabaseSchemaVisualization,
    'super-admin-console': SuperAdminConsole
  },
  admin: {
    'dashboard': DashboardPage,
    'devices': DevicesPage,
    'device-detail': DeviceDetailPage,
    'discovery': DiscoveryPageWrapper,
    'tickets': TicketsPage,
    'ticket-detail': TicketDetailPage,
    'settings': SettingsPage,
    'agents': AgentsPage,
    'knowledge-base': SimplifiedKnowledgeBasePage,
    'article-detail': SimplifiedArticleDetailPage
  },
  viewer: {
    'dashboard': DashboardPage,
    'devices': DevicesPage,
    'device-detail': DeviceDetailPage,
    'tickets': TicketsPage,
    'ticket-detail': TicketDetailPage,
    'knowledge-base': SimplifiedKnowledgeBasePage,
    'article-detail': SimplifiedArticleDetailPage,
    'settings': SettingsPage // Limited settings usually handled inside the page
  }
};

// Fallback for unknown roles
ROUTES_BY_ROLE.authenticated = ROUTES_BY_ROLE.owner; // Temporary fallback if AuthContext logic misses something
ROUTES_BY_ROLE.agent = ROUTES_BY_ROLE.viewer; // Map agent to viewer for now
// Map super_admin to owner routes explicitly for safety (though user.role will be 'owner')
ROUTES_BY_ROLE.super_admin = ROUTES_BY_ROLE.owner;

// Extracted Sidebar to prevent re-renders
const AppSidebar = ({ 
  className = "",
  user,
  navigationItems,
  currentRoute,
  navigationOptions,
  onNavigate,
  onLogout,
  hasRole,
  checkTierAccess
}: { 
  className?: string;
  user: any;
  navigationItems: any[];
  currentRoute: string;
  navigationOptions: any;
  onNavigate: (route: AppRoute | 'website', options?: any) => void;
  onLogout: () => void;
  hasRole: (role: string) => boolean;
  checkTierAccess: (tier: string) => boolean;
}) => {
  // Safety check
  if (!user) return null;
  
  return (
    <div className={`bg-dark-midnight/95 backdrop-blur-xl border-r border-slate-gray/30 flex flex-col ${className}`}>
      <div className="p-6 flex-shrink-0">
        {/* Logo */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
        <nav className="space-y-2">
          {/* Standard User Navigation */}
          {navigationItems.map((item: any, index) => {
            if (!item) return null;
            
            // Handle separators
            if (item.type === 'separator') {
              return (
                 <div key={`sep-${index}`} className="mt-4 mb-2 px-3 text-xs font-semibold text-mist-gray uppercase tracking-wider">
                   {item.label}
                 </div>
              );
            }

            // Skip website item in main list, we'll render it separately
            if (item.id === 'website') return null;
            
            const Icon = item.icon;
            if (!Icon) return null;

            // Check if this item is active
            // For settings items, we need to check the tab too
            let isActive = false;
            if (item.route === 'settings' && item.tab) {
               isActive = currentRoute === 'settings' && navigationOptions?.tab === item.tab;
               // Default fallback: if route is settings but no tab options, highlight profile or the default
               if (currentRoute === 'settings' && !navigationOptions?.tab && item.tab === 'profile') {
                 isActive = true;
               }
            } else {
               isActive = currentRoute === item.route;
            }

            const hasAccess = (!item.tierRequired || checkTierAccess(item.tierRequired)) && 
                              (item.id !== 'agents' || hasRole('admin') || hasRole('owner')) &&
                              (item.id !== 'team' || hasRole('admin') || hasRole('owner')) &&
                              (item.id !== 'billing' || hasRole('owner'));
            
            if (!hasAccess) return null;

            return (
              <Button
                key={item.id}
                variant="ghost"
                data-active={isActive}
                className={`w-full justify-start ${
                  isActive 
                    ? "bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30" 
                    : "text-mist-gray hover:text-white hover:bg-slate-gray/30 border border-transparent"
                }`}
                onClick={() => {
                   if (item.route === 'settings' && item.tab) {
                     onNavigate('settings', { tab: item.tab });
                   } else {
                     onNavigate(item.route);
                   }
                }}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-amber-warning/20 text-amber-warning">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}

          {/* Website Button - Explicitly rendered */}
          <div className="pt-4 mt-4 border-t border-slate-gray/30">
             <Button
                variant="ghost"
                className="w-full justify-start text-mist-gray hover:text-white hover:bg-slate-gray/30"
                onClick={() => onNavigate('website')}
              >
                <LayoutTemplate className="w-4 h-4 mr-3" />
                Website
              </Button>
          </div>
        </nav>
        </div>
      

      {/* User section */}
      <div className="flex-shrink-0 p-6 border-t border-slate-gray/30 bg-dark-midnight/95">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8 bg-iq-neon-green/20">
            <div className="w-full h-full flex items-center justify-center text-iq-neon-green font-semibold text-sm">
              {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : (user.email ? user.email.substring(0, 2).toUpperCase() : 'U')}
            </div>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.name || user.email || 'User'}</div>
            <div className="text-xs text-mist-gray truncate">{user.role || 'Viewer'}</div>
          </div>
          <PlanBadge variant={user.role === 'owner' || user.role === 'super_admin' ? 'team' : (user.tier || 'starter')} />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-mist-gray hover:text-crimson-danger hover:bg-crimson-danger/10"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export const AppRouter: React.FC<AppRouterProps> = ({ user, onLogout, onNavigateToMarketing }) => {
  const { hasRole, checkTierAccess } = useAuth();
  
  // Ensure we have a valid role string
  const userRole = (user?.role || 'owner') as string;
  
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    console.log('AppRouter: Initializing with user role:', userRole);
    const initialRoute = 'dashboard';
    console.log('AppRouter: Initial route set to:', initialRoute);
    return initialRoute;
  });
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [deviceContext, setDeviceContext] = useState<DeviceContext | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [navigationOptions, setNavigationOptions] = useState<any>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      
      // Admin panel hotkey
      if (e.key === 'A' && hasRole('admin') && currentRoute === 'dashboard') {
        e.preventDefault();
        setCurrentRoute('admin' as any); // Type cast for hidden route
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, hasRole, currentRoute]);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: 'dashboard' as AppRoute,
      badge: null,
      tierRequired: null
    },
    {
      id: 'devices',
      label: 'Computers',
      icon: Monitor,
      route: 'devices' as AppRoute,
      badge: null,
      tierRequired: null
    },
    {
      id: 'discovery',
      label: 'Find Computers',
      icon: Search,
      route: 'discovery' as AppRoute,
      badge: checkTierAccess('pro') ? null : 'Pro',
      tierRequired: 'pro' as const
    },
    {
      id: 'tickets',
      label: 'Issues',
      icon: Ticket,
      route: 'tickets' as AppRoute,
      badge: null,
      tierRequired: null
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: Download,
      route: 'agents' as AppRoute,
      badge: hasRole('admin') || hasRole('owner') ? null : 'Admin',
      tierRequired: null
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge',
      icon: Brain,
      route: 'knowledge-base' as AppRoute,
      badge: null,
      tierRequired: null
    },
    // Settings Items Flattened
    {
      type: 'separator',
      label: 'Management'
    },
    {
      id: 'team',
      label: 'Team Members',
      icon: Users,
      route: 'settings' as AppRoute,
      tab: 'users',
      badge: null,
      tierRequired: null
    },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: CreditCard,
      route: 'settings' as AppRoute,
      tab: 'billing',
      badge: hasRole('owner') ? null : 'Owner',
      tierRequired: null
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building,
      route: 'settings' as AppRoute,
      tab: 'company',
      badge: null,
      tierRequired: null
    },
    // Super Admin Features
    ...(user?.db_role === 'super_admin' ? [
      {
        type: 'separator',
        label: 'Super Admin'
      },
      {
        id: 'super-admin-console',
        label: 'Super Admin Console',
        icon: Shield,
        route: 'super-admin-console' as AppRoute,
        badge: 'Master',
        tierRequired: null
      },
      {
        id: 'organizations-admin',
        label: 'Organizations',
        icon: Building,
        route: 'settings' as AppRoute,
        tab: 'organizations-admin',
        badge: 'Old View' as string | null,
        tierRequired: null
      },
      {
        id: 'feature-controls',
        label: 'Feature Controls',
        icon: Shield,
        route: 'settings' as AppRoute,
        tab: 'feature-controls',
        badge: 'Super Admin' as string | null,
        tierRequired: null
      }
    ] : []),
    {
      type: 'separator',
      label: 'System'
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: History,
      route: 'settings' as AppRoute,
      tab: 'audit',
      badge: null,
      tierRequired: null
    },
    {
      id: 'api',
      label: 'API & Webhooks',
      icon: Webhook,
      route: 'settings' as AppRoute,
      tab: 'api',
      badge: null,
      tierRequired: null
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      route: 'settings' as AppRoute,
      tab: 'security',
      badge: null,
      tierRequired: null
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      route: 'settings' as AppRoute,
      tab: 'profile',
      badge: null,
      tierRequired: null
    },
    {
      id: 'website',
      label: 'Website',
      icon: LayoutTemplate,
      route: 'website' as any,
      badge: null,
      tierRequired: null
    }
  ];

  const handleNavigation = (route: AppRoute | 'website', options?: { deviceId?: string; ticketId?: string; deviceContext?: DeviceContext; articleId?: string; tab?: string }) => {
    if (route === 'website') {
      if (onNavigateToMarketing) {
        onNavigateToMarketing('home');
      }
      return;
    }
    
    setCurrentRoute(route as AppRoute);
    setNavigationOptions(options);
    setSelectedDeviceId(options?.deviceId || options?.articleId || null); // Reusing for article ID
    setSelectedTicketId(options?.ticketId || null);
    setDeviceContext(options?.deviceContext || null);
    setShowMobileMenu(false);
  };

  const handleCreateTicketFromDevice = (device: DeviceContext) => {
    setDeviceContext(device);
    setCurrentRoute('tickets');
  };

  const renderCurrentPage = () => {
    // Special handling for full-screen consoles
    if (currentRoute === 'super-admin-console') {
      // Verify role again for safety
      if (user?.db_role !== 'super_admin') {
        return (
          <div className="p-6 text-crimson-danger">
             Access Denied: Super Admin privileges required.
             <Button className="ml-4" onClick={() => handleNavigation('dashboard')}>Return</Button>
          </div>
        );
      }
      return <SuperAdminConsole />;
    }

    // 1. Look up role configuration
    const roleConfig = ROUTES_BY_ROLE[userRole] || ROUTES_BY_ROLE['owner']; // Default to owner if role not found

    if (!roleConfig) {
      console.error("Unknown role in AppRouter:", userRole);
      return (
        <div className="p-6 text-crimson-danger">
          Role not allowed or misconfigured: {String(userRole)}
        </div>
      );
    }

    // 2. Look up component for current route
    const Component = roleConfig[currentRoute];

    // 3. Validate component is a function
    if (typeof Component !== "function") {
      console.error("Invalid route component", {
        role: userRole,
        route: currentRoute,
        Component,
      });
      
      // Fallback for known missing routes or errors
      return (
        <div className="p-6 text-mist-gray">
          <h3 className="text-lg font-semibold text-white mb-2">Page Not Found</h3>
          <p>The requested page "{currentRoute}" is not available for your role ({userRole}).</p>
          <Button 
            className="mt-4" 
            onClick={() => handleNavigation('dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      );
    }

    console.log(
      "AppRouter: Rendering initial route:",
      currentRoute,
      "for role:",
      userRole
    );

    // 4. Render component with props bag
    // We pass all potential props; components will only use what they define
    // We add a key based on route and tab to ensure components remount when switching sub-tabs
    return (
      <Component 
        key={`${currentRoute}-${navigationOptions?.tab || 'default'}`}
        user={user}
        onNavigate={handleNavigation}
        onCreateTicketFromDevice={handleCreateTicketFromDevice}
        onClearDeviceContext={() => setDeviceContext(null)}
        onBack={() => handleNavigation('knowledge-base')} // Default back for KB pages
        onClose={() => handleNavigation('knowledge-base')} // Default close for modals
        
        // Context specific props
        deviceId={selectedDeviceId}
        ticketId={selectedTicketId}
        deviceContext={deviceContext}
        articleId={selectedDeviceId} // Mapping selectedDeviceId to articleId for KB
        options={navigationOptions}
      />
    );
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg flex">
      {/* Background effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Desktop Sidebar */}
      {currentRoute !== 'super-admin-console' && (
        <div className="hidden lg:block w-80 relative z-10">
          <AppSidebar 
            className="h-full" 
            user={user}
            navigationItems={navigationItems}
            currentRoute={currentRoute}
            navigationOptions={navigationOptions}
            onNavigate={handleNavigation}
            onLogout={onLogout}
            hasRole={hasRole}
            checkTierAccess={checkTierAccess}
          />
        </div>
      )}

      {/* Mobile Header & Sidebar */}
      {currentRoute !== 'super-admin-console' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-midnight/95 backdrop-blur-xl border-b border-slate-gray/30">
          <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Activity className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <AppSidebar 
                  user={user}
                  navigationItems={navigationItems}
                  currentRoute={currentRoute}
                  navigationOptions={navigationOptions}
                  onNavigate={handleNavigation}
                  onLogout={onLogout}
                  hasRole={hasRole}
                  checkTierAccess={checkTierAccess}
                />
              </SheetContent>
            </Sheet>
            
            <h1 className="font-['Space_Grotesk'] text-lg font-bold">
              <span className="text-white">BUBO</span>
              <span className="text-iq-neon-green">IQ</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-mist-gray" />
            <Avatar className="w-8 h-8 bg-iq-neon-green/20">
              <div className="w-full h-full flex items-center justify-center text-iq-neon-green font-semibold text-xs">
                {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : (user.email ? user.email.substring(0, 2).toUpperCase() : 'U')}
              </div>
            </Avatar>
          </div>
        </div>
      </div>
      )}

      {/* Trial Banner (for trial users) */}
      {(user.tier === 'trial' || !user.tier || user.tier === 'starter') && user.trialEndDate && (
        <div className="fixed top-16 lg:top-0 left-0 lg:left-80 right-0 z-40 p-4 bg-dark-midnight/95 backdrop-blur-xl border-b border-slate-gray/30">
          <TrialCountdown 
            trialInfo={{
              isActive: calculateTrialDaysRemaining(new Date(user.trialEndDate)) > 0,
              daysRemaining: calculateTrialDaysRemaining(new Date(user.trialEndDate)),
              plan: user.tier || 'trial'
            }}
            onNavigate={(page) => {
              if (onNavigateToMarketing) {
                onNavigateToMarketing(page);
              }
            }}
            user={user}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 relative z-10 lg:ml-0 ${
        currentRoute !== 'super-admin-console' ? 'pt-16 lg:pt-0' : ''
      } ${
        (user.tier === 'trial' || !user.tier || user.tier === 'starter') && user.trialEndDate && currentRoute !== 'super-admin-console'
          ? 'lg:pt-32' 
          : ''
      }`}>
        {renderCurrentPage()}
      </div>
    </div>
  );
};