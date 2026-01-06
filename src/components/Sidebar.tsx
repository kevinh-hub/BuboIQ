import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useApp } from '../App';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings, 
  User,
  LogOut,
  Crown,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
// Remove logo import

export default function Sidebar() {
  const { 
    user, 
    currentPage, 
    setCurrentPage, 
    logout, 
    trialInfo, 
    setShowUpgradeModal,
    permissions 
  } = useApp();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      show: true
    },
    { 
      id: 'tickets', 
      label: 'Issues', 
      icon: Ticket,
      show: permissions.canViewAllTickets
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users,
      show: permissions.canManageTeam
    },
    { 
      id: 'pricing', 
      label: 'Plans', 
      icon: Crown,
      show: permissions.canViewPricing,
      badge: trialInfo.isActive && trialInfo.daysRemaining <= 5 ? 'trial-ending' : null
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      show: permissions.canAccessSettings
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User,
      show: true
    }
  ];

  const visibleItems = navigationItems.filter(item => item.show);

  const handleNavClick = (itemId: string) => {
    setCurrentPage(itemId);
  };

  const getNavItemClass = (itemId: string) => {
    return `flex items-center justify-between space-x-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
      currentPage === itemId
        ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  const getBadge = (badge: string | null) => {
    if (!badge) return null;
    
    if (badge === 'trial-ending') {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0">
          <Clock className="h-2 w-2 mr-1" />
          {trialInfo.daysRemaining}d
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwRkY4NSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzBFMEUwRSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+QjwvdGV4dD4KPHN2Zz4K" 
              alt="TicketEase Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">TicketEase</h1>
            <p className="text-xs text-gray-500">Less Clicks. More Fixes.</p>
          </div>
        </div>
      </div>

      {/* Trial Status */}
      {trialInfo.isActive && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Free Trial</span>
            <Badge className="bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20 text-xs">
              <Clock className="h-2 w-2 mr-1" />
              {trialInfo.daysRemaining}d left
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
            <div 
              className="h-1.5 bg-gradient-to-r from-blue-400 to-[#2ECC71] rounded-full transition-all duration-300"
              style={{ 
                width: `${((14 - trialInfo.daysRemaining) / 14) * 100}%` 
              }}
            />
          </div>
          <Button
            onClick={() => setCurrentPage('pricing')}
            size="sm"
            className="btn-cta-primary w-full text-xs py-1.5"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => {
          if (!item) return null;
          const IconComponent = item.icon;
          if (!IconComponent) return null;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={getNavItemClass(item.id)}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {getBadge(item.badge)}
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* CTA Section */}
      {trialInfo.isActive && trialInfo.daysRemaining <= 7 && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-800">Trial Ending Soon</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">
              Don't lose your data! Upgrade to continue using TicketEase.
            </p>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              size="sm"
              className="w-full btn-cta-primary text-xs py-1.5"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Quick Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          {user?.role === 'admin' && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
              Admin
            </Badge>
          )}
        </div>
        
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}