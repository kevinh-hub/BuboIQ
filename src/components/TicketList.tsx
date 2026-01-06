import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useApp } from '../App';
import Sidebar from './Sidebar';
import UserSidebar from './UserSidebar';
import CreateTicketForm from './CreateTicketForm';
import { 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  Ticket as TicketIcon,
  User as UserIcon,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function TicketList() {
  const { user, tickets, setSelectedTicket, setCurrentPage, createTicket, permissions, updateTicket, users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter tickets based on user role and permissions
  const getFilteredTickets = () => {
    let filteredTickets = tickets;

    // Role-based filtering
    if (user?.role === 'user') {
      // Users can only see their own tickets
      filteredTickets = tickets.filter(ticket => ticket.createdBy.id === user.id);
    } else if (user?.role === 'agent') {
      // Agents see all tickets, but we might add assignment filtering
      filteredTickets = tickets;
    } else if (user?.role === 'admin') {
      // Admins see all tickets
      filteredTickets = tickets;
    }

    // Apply search filter
    if (searchTerm) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredTickets.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        filteredTickets.sort((a, b) => priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]);
        break;
      case 'status':
        filteredTickets.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    return filteredTickets;
  };

  const filteredTickets = getFilteredTickets();

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setCurrentPage('ticket-detail');
  };

  const handleAssignTicket = (ticketId: string, assigneeId: string) => {
    const assignee = users.find(u => u.id === assigneeId);
    updateTicket(ticketId, { assignedTo: assignee });
    toast.success('Issue assigned');
  };

  const handleStatusChange = (ticketId: string, status: string) => {
    updateTicket(ticketId, { status: status as any });
    toast.success('Ticket status updated');
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPageTitle = () => {
    if (user?.role === 'user') {
      return 'My Tickets';
    }
    return 'All Tickets';
  };

  const getPageDescription = () => {
    if (user?.role === 'user') {
      return 'View and track all your support requests';
    }
    return 'Manage and track all support tickets';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user?.role === 'user' ? <UserSidebar /> : <Sidebar />}
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600">
                  {getPageDescription()}
                </p>
              </div>
              
              {permissions.canCreateTickets && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-cta-primary" data-create-ticket>
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Ticket</DialogTitle>
                      <DialogDescription>
                        Submit a new support request. Provide as much detail as possible for faster resolution.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateTicketForm 
                      onSubmit={(ticketData) => {
                        createTicket(ticketData);
                        setIsCreateDialogOpen(false);
                      }}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tickets by ID, subject, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TicketIcon className="h-5 w-5" />
                  <span>Tickets ({filteredTickets.length})</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTickets.length > 0 ? (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                          
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <div className="flex items-center space-x-1">
                              <UserIcon className="h-3 w-3" />
                              <span>Created by {ticket.createdBy.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                            {ticket.assignedTo && (
                              <span>Assigned to {ticket.assignedTo.name}</span>
                            )}
                            {ticket.comments.length > 0 && (
                              <span>{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Admin/Agent Actions */}
                        {permissions.canAssignTickets && (
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={ticket.assignedTo?.id || 'unassigned'}
                              onValueChange={(value) => handleAssignTicket(ticket.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {users
                                  .filter(u => u.role === 'agent' || u.role === 'admin')
                                  .map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleStatusChange(ticket.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <TicketIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'No tickets match your filters' 
                      : 'No tickets found'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {user?.role === 'user' 
                      ? "You haven't submitted any tickets yet."
                      : "No tickets have been created yet."}
                  </p>
                  {permissions.canCreateTickets && (
                    <Button 
                      className="btn-cta-primary"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}