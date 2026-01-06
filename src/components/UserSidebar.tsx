import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useApp } from '../App';
import { 
  Home, 
  Ticket, 
  Plus,
  User as UserIcon,
  LogOut, 
  HelpCircle
} from 'lucide-react';
// Remove logo import

export default function UserSidebar() {
  const { user, logout, currentPage, setCurrentPage, tickets } = useApp();

  // Filter tickets for current user
  const userTickets = tickets.filter(t => t.createdBy.id === user?.id);
  const openTicketsCount = userTickets.filter(t => t.status === 'Open').length;

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      key: 'dashboard',
      badge: null
    },
    {
      name: 'My issues',
      icon: Ticket,
      key: 'my-tickets',
      badge: openTicketsCount > 0 ? openTicketsCount : null
    },
    {
      name: 'Open issue',
      icon: Plus,
      key: 'submit-ticket',
      badge: null,
      action: true
    },
    {
      name: 'Profile',
      icon: UserIcon,
      key: 'profile',
      badge: null
    }
  ];

  const handleNavigation = (key: string) => {
    if (key === 'submit-ticket') {
      // This will be handled by opening the create ticket dialog
      setCurrentPage('dashboard');
      // Trigger the dialog via a custom event or state
      setTimeout(() => {
        const createButton = document.querySelector('[data-create-ticket]') as HTMLButtonElement;
        if (createButton) {
          createButton.click();
        }
      }, 100);
    } else {
      setCurrentPage(key);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#00C48C' }}
          >
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzAwRkY4NSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzBFMEUwRSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+QjwvdGV4dD4KPHN2Zz4K" 
              alt="TicketEase Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">TicketEase</h2>
            <p className="text-xs text-gray-500">Less Clicks. More Fixes.</p>
          </div>
        </div>
      </div>

      {/* User Role Indicator */}
      <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon className="h-3 w-3 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-700">User Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => {
          if (!item) return null;
          const Icon = item.icon;
          if (!Icon) return null;
          const isActive = currentPage === item.key || 
                          (item.key === 'my-tickets' && currentPage === 'tickets') ||
                          (item.key === 'submit-ticket' && currentPage === 'dashboard');
          
          return (
            <Button
              key={item.key}
              variant={isActive && !item.action ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive && !item.action
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : item.action
                  ? 'text-white hover:bg-green-600 bg-green-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleNavigation(item.key)}
              style={item.action ? { backgroundColor: '#2ECC71' } : {}}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.name}
              {item.badge && (
                <Badge 
                  className="ml-auto text-xs" 
                  style={{ backgroundColor: '#00C48C', color: 'white' }}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          <HelpCircle className="h-4 w-4 mr-3" />
          Help & Support
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback style={{ backgroundColor: '#00C48C', color: 'white' }}>
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.department}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}