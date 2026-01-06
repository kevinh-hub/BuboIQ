import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Eye, 
  Radio, 
  AlertTriangle, 
  Brain, 
  Zap, 
  Layers3,
  Network,
  Headphones,
  Settings, 
  LogOut,
  Search,
  Bell,
  Crown,
  Users,
  CreditCard,
  User,
  Sparkles,
  Palette
} from 'lucide-react';
import { motion } from 'motion/react';

const BuboSidebar: React.FC = () => {
  const { 
    user, 
    currentPage, 
    setCurrentPage, 
    logout, 
    permissions,
    subscriptionInfo,
    setShowUpgradeModal
  } = useApp();

  const navigationItems = [
    { 
      id: 'observatory', 
      label: 'Observatory', 
      icon: Eye, 
      description: 'AI intelligence hub',
      badge: 'Live' 
    },
    { 
      id: 'signals', 
      label: 'Signal Stream', 
      icon: Radio, 
      description: 'Real-time triage',
      badge: '12' 
    },
    { 
      id: 'incidents', 
      label: 'Incident Room', 
      icon: AlertTriangle, 
      description: 'Active investigations',
      badge: '3' 
    },
    { 
      id: 'intelligence-flow', 
      label: 'Intelligence Flow', 
      icon: Brain, 
      description: 'End-to-end workflow',
      badge: 'Demo' 
    },
    { 
      id: 'automations', 
      label: 'Automation Studio', 
      icon: Zap, 
      description: 'Workflow builder',
      comingSoon: true 
    },
    { 
      id: 'knowledge-graph', 
      label: 'Knowledge Graph', 
      icon: Network, 
      description: 'System relationships',
      comingSoon: true 
    },
    { 
      id: 'self-service', 
      label: 'Self-Service Hub', 
      icon: Headphones, 
      description: 'End-user portal',
      comingSoon: true 
    },
    { 
      id: 'governance', 
      label: 'Governance', 
      icon: Settings, 
      description: 'Platform settings',
      adminOnly: true 
    },
    { 
      id: 'brand-kit', 
      label: 'Brand Kit', 
      icon: Palette, 
      description: 'Design system',
      adminOnly: true 
    }
  ];

  // Legacy mapping for existing functionality
  const legacyItems = [
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users, 
      description: 'Team management',
      permission: 'canManageTeam'
    },
    { 
      id: 'pricing', 
      label: 'Pricing', 
      icon: CreditCard, 
      description: 'Subscription plans',
      permission: 'canViewPricing'
    }
  ];

  const handleNavigation = (pageId: string) => {
    // BuboIQ native page routing
    switch (pageId) {
      case 'observatory':
        setCurrentPage('observatory');
        break;
      case 'signals':
        setCurrentPage('signals');
        break;
      case 'incidents':
        setCurrentPage('incidents');
        break;
      case 'assist':
        setCurrentPage('assist');
        break;
      case 'automations':
        setCurrentPage('automations');
        break;
      case 'playbooks':
        setCurrentPage('playbooks');
        break;
      case 'governance':
        setCurrentPage('governance');
        break;
      case 'brand-kit':
        setCurrentPage('brand-kit');
        break;
      case 'intelligence-flow':
        setCurrentPage('intelligence-flow');
        break;
      default:
        setCurrentPage(pageId);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isActive = (pageId: string) => {
    // Direct page matching for BuboIQ
    switch (currentPage) {
      case 'dashboard':
        return pageId === 'observatory';
      case 'observatory':
        return pageId === 'observatory';
      case 'signals':
        return pageId === 'signals';
      case 'incidents':
        return pageId === 'incidents';
      case 'assist':
        return pageId === 'assist';
      case 'automations':
        return pageId === 'automations';
      case 'playbooks':
        return pageId === 'playbooks';
      case 'governance':
      case 'settings':
        return pageId === 'governance';
      case 'brand-kit':
      case 'design-system':
        return pageId === 'brand-kit';
      case 'intelligence-flow':
      case 'workflow-demo':
        return pageId === 'intelligence-flow';
      // Legacy TicketEase mapping for transition
      case 'tickets':
      case 'my-tickets':
        return pageId === 'signals';
      default:
        return pageId === currentPage;
    }
  };

  return (
    <div className="w-64 bg-nocturne-indigo text-cloud-white flex flex-col h-screen border-r border-mist-gray/10 bubo-neural-bg relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-iq-green/5 via-transparent to-signal-blue/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-iq-green/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-iq-green to-glow-cyan rounded-xl flex items-center justify-center bubo-glow-green shadow-lg">
            <Eye className="w-5 h-5 text-nocturne-indigo" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-iq-green to-glow-cyan bg-clip-text text-transparent">
              BuboIQ
            </h1>
            <p className="text-xs text-mist-gray">AI Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Mission Progress */}
      {subscriptionInfo.isActive && (
        <div className="relative mx-4 mb-4 p-4 bg-gradient-to-br from-prediction-purple/10 to-signal-blue/10 rounded-xl border border-prediction-purple/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 bg-gradient-to-br from-iq-green to-glow-cyan rounded-lg flex items-center justify-center"
                >
                  <Eye className="w-3 h-3 text-nocturne-indigo" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-prediction-purple">Mission Active</p>
                  <p className="text-xs text-cloud-white/80">{subscriptionInfo.daysRemaining} days remaining</p>
                </div>
              </div>
              <Crown className="w-5 h-5 text-iq-green" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-mist-gray">AI Learning Progress</span>
                <span className="text-iq-green">73%</span>
              </div>
              <div className="bubo-confidence-ribbon h-2" />
            </div>

            <Button
              size="sm"
              className="w-full bubo-btn-primary text-xs"
              onClick={() => setShowUpgradeModal(true)}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Unlock Full Intelligence
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative flex-1 px-4 space-y-1">
        {navigationItems.map((item) => {
          if (!item) return null;
          const Icon = item.icon;
          if (!Icon) return null;
          const active = isActive(item.id);
          
          // Hide admin-only items for non-admins
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }
          
          return (
            <button
              key={item.id}
              onClick={() => !item.comingSoon && handleNavigation(item.id)}
              disabled={item.comingSoon}
              className={`relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                active 
                  ? 'bg-gradient-to-r from-iq-green/20 to-glow-cyan/20 text-iq-green border border-iq-green/30 bubo-glow-green shadow-lg' 
                  : item.comingSoon
                  ? 'text-mist-gray/50 cursor-not-allowed'
                  : 'text-cloud-white hover:bg-slate-gray/30 hover:border-iq-green/20 border border-transparent'
              }`}
            >
              {/* Hover glow effect */}
              {!item.comingSoon && !active && (
                <div className="absolute inset-0 bg-gradient-to-r from-iq-green/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              <div className="relative flex items-center space-x-3 flex-1">
                <Icon className={`w-5 h-5 ${active ? 'text-iq-green' : item.comingSoon ? 'text-mist-gray/50' : ''}`} />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.badge && !item.comingSoon && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 ${
                          item.badge === 'Live' 
                            ? 'bg-iq-green/20 text-iq-green border-iq-green/30 animate-pulse' 
                            : 'bg-amber-warning/20 text-amber-warning border-amber-warning/30'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.comingSoon && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-mist-gray/10 text-mist-gray border-mist-gray/30">
                        Soon
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs ${
                    active ? 'text-iq-green/80' : 
                    item.comingSoon ? 'text-mist-gray/50' : 'text-mist-gray'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Separator */}
        <div className="border-t border-mist-gray/20 my-4 mx-2" />

        {/* Legacy Items */}
        {legacyItems.map((item) => {
          if (!item) return null;
          const Icon = item.icon;
          if (!Icon) return null;
          const active = isActive(item.id);
          
          // Check permissions
          if (item.permission && !permissions[item.permission as keyof typeof permissions]) {
            return null;
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                active 
                  ? 'bg-gradient-to-r from-iq-green/20 to-glow-cyan/20 text-iq-green border border-iq-green/30 bubo-glow-green shadow-lg' 
                  : 'text-cloud-white hover:bg-slate-gray/30 hover:border-iq-green/20 border border-transparent'
              }`}
            >
              {/* Hover glow effect */}
              {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-iq-green/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              <div className="relative flex items-center space-x-3 flex-1">
                <Icon className={`w-5 h-5 ${active ? 'text-iq-green' : ''}`} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className={`text-xs ${active ? 'text-iq-green/80' : 'text-mist-gray'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Command Palette Hint */}
      <div className="relative px-4 mb-4">
        <div className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-gray/30 to-slate-gray/10 rounded-xl border border-mist-gray/20 backdrop-blur-sm">
          <Search className="w-4 h-4 text-iq-green" />
          <span className="text-sm text-mist-gray">Press</span>
          <kbd className="px-2 py-1 text-xs bg-nocturne-indigo/80 border border-iq-green/30 rounded-lg text-iq-green font-mono">⌘K</kbd>
          <span className="text-sm text-mist-gray">to search</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="relative p-4 border-t border-mist-gray/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="border-2 border-iq-green/30">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-iq-green to-glow-cyan text-nocturne-indigo font-semibold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-cloud-white">{user?.name}</p>
            <p className="text-xs text-iq-green capitalize">{user?.role}</p>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-mist-gray hover:text-iq-green cursor-pointer transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-crimson-danger rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-cloud-white hover:bg-slate-gray/30 hover:text-iq-green transition-all duration-300"
            onClick={() => handleNavigation('profile')}
          >
            <User className="w-4 h-4 mr-3" />
            Profile Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-cloud-white hover:bg-crimson-danger/20 hover:text-crimson-danger transition-all duration-300"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuboSidebar;