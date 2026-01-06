import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Sidebar from './Sidebar';
import TrialCountdown from './TrialCountdown';
import FreeTrialBanner from './FreeTrialBanner';
import { useApp } from '../App';
import { apiClient } from '../hooks/useApi';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  MessageSquare,
  Star,
  Timer,
  Crown,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const { user, tickets, setSelectedTicket, setCurrentPage, permissions, trialInfo } = useApp();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load statistics from backend
  useEffect(() => {
    const loadStats = async () => {
      if (!permissions.canViewReports) {
        setLoading(false);
        return;
      }

      try {
        const { stats: statsData } = await apiClient.getTicketStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [permissions.canViewReports]);

  // Calculate local stats from tickets data
  const localStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'Open').length,
    inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'Resolved').length,
    closedTickets: tickets.filter(t => t.status === 'Closed').length,
    highPriorityTickets: tickets.filter(t => t.priority === 'High').length,
    myAssignedTickets: tickets.filter(t => t.assignedTo?.id === user?.id && t.status !== 'Closed').length,
    recentTickets: tickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  };

  const displayStats = stats || {
    total: localStats.totalTickets,
    open: localStats.openTickets,
    inProgress: localStats.inProgressTickets,
    resolved: localStats.resolvedTickets,
    closed: localStats.closedTickets,
    highPriority: localStats.highPriorityTickets
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setCurrentPage('ticket-detail');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Free Trial Banner */}
        <FreeTrialBanner />
        
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getGreeting()}, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your support tickets today.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm">
                  {user?.role === 'admin' ? '👑 Administrator' : '🛠️ Support Agent'}
                </Badge>
                
                {trialInfo.isActive && (
                  <Button
                    onClick={() => setCurrentPage('pricing')}
                    className="btn-cta-primary"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Trial Info */}
          {(user?.role === 'admin' || user?.role === 'agent') && trialInfo.isActive && (
            <div className="mb-8">
              <TrialCountdown />
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <Ticket className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : displayStats.total}</div>
                <p className="text-xs text-gray-600 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{loading ? '...' : displayStats.open}</div>
                <p className="text-xs text-gray-600 mt-1">Needs attention</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{loading ? '...' : displayStats.inProgress}</div>
                <p className="text-xs text-gray-600 mt-1">Being worked on</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#2ECC71]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2ECC71]">
                  {loading ? '...' : displayStats.resolved}
                </div>
                <p className="text-xs text-gray-600 mt-1">Successfully completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Tickets */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Recent Tickets</span>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage('tickets')}
                      className="btn-cta-secondary"
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {localStats.recentTickets.length > 0 ? (
                    <div className="space-y-4">
                      {localStats.recentTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                          onClick={() => handleTicketClick(ticket)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Created {formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTo && (
                                <span>Assigned to {ticket.assignedTo.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                      <p className="text-gray-600">
                        Tickets will appear here once they are created.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Priority Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Priority Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">High Priority</span>
                    </div>
                    <span className="font-semibold">{loading ? '...' : displayStats.highPriority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Medium Priority</span>
                    </div>
                    <span className="font-semibold">{loading ? '...' : (displayStats.mediumPriority || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Low Priority</span>
                    </div>
                    <span className="font-semibold">{loading ? '...' : (displayStats.lowPriority || 0)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* My Assignments */}
              {(user?.role === 'agent' || user?.role === 'admin') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Timer className="h-5 w-5" />
                      <span>My Assignments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {localStats.myAssignedTickets}
                      </div>
                      <p className="text-sm text-gray-600">Active tickets assigned to you</p>
                      {localStats.myAssignedTickets > 0 && (
                        <Button 
                          size="sm" 
                          className="mt-3 w-full btn-cta-primary"
                          onClick={() => setCurrentPage('tickets')}
                        >
                          View My Tickets
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start btn-cta-secondary" 
                    variant="outline"
                    onClick={() => setCurrentPage('tickets')}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    All Tickets
                  </Button>
                  {permissions.canManageTeam && (
                    <Button 
                      className="w-full justify-start btn-cta-secondary" 
                      variant="outline"
                      onClick={() => setCurrentPage('team')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Team Management
                    </Button>
                  )}
                  {permissions.canViewPricing && (
                    <Button 
                      className="w-full justify-start btn-cta-primary"
                      onClick={() => setCurrentPage('pricing')}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      View Pricing
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolution Rate</span>
                      <span className="font-semibold text-green-600">
                        {displayStats.total > 0 
                          ? Math.round((displayStats.resolved / displayStats.total) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Response Time</span>
                      <span className="font-semibold">2.4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-semibold text-green-600">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}