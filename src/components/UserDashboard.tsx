import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import UserSidebar from './UserSidebar';
import { useApp } from '../App';
import { 
  Plus, 
  Ticket, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, tickets, createTicket, setCurrentPage, setSelectedTicket } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    category: 'General'
  });

  // Filter tickets created by the current user
  const userTickets = tickets.filter(ticket => ticket.createdBy.id === user?.id);

  // Calculate user stats
  const openTickets = userTickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = userTickets.filter(t => t.status === 'In Progress').length;
  const resolvedTickets = userTickets.filter(t => t.status === 'Resolved').length;
  const recentTickets = userTickets.slice(0, 4);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    createTicket({
      subject: ticketForm.subject,
      description: ticketForm.description,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'Open',
      createdBy: user!
    });

    toast.success('Your support ticket has been submitted successfully!');
    setIsCreateDialogOpen(false);
    setTicketForm({ subject: '', description: '', priority: 'Medium', category: 'General' });
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

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setCurrentPage('ticket-detail');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600">
                      {user?.department} • {user?.email}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Submit and track your support requests in one place.
                </p>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-cta-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Submit Support Ticket</DialogTitle>
                    <DialogDescription>
                      Describe your issue or request below. Our support team will get back to you soon.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({...ticketForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Bug Report">Bug Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={ticketForm.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setTicketForm({...ticketForm, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your issue"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-cta-primary">
                        Submit Ticket
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <Ticket className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userTickets.length}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{inProgressTickets}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4" style={{ color: '#00C48C' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: '#00C48C' }}>{resolvedTickets}</div>
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
                      <span>My Recent Tickets</span>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage('my-tickets')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentTickets.length > 0 ? (
                    <div className="space-y-4">
                      {recentTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
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
                      <p className="text-gray-600 mb-6">
                        Submit your first support ticket to get help with any issues.
                      </p>
                      <Button 
                        className="btn-cta-primary"
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Submit Your First Ticket
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Help & Support Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Response Times</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>High Priority:</span>
                        <span>2-4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium Priority:</span>
                        <span>8-12 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low Priority:</span>
                        <span>24-48 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 support@ticketease.com</p>
                      <p>📞 +1 (555) 123-4567</p>
                      <p>🕒 Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Be specific in your ticket description to get faster resolution</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Include screenshots when reporting visual issues</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">Check your email for updates on your tickets</p>
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