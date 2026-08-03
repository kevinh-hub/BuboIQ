import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useApp } from '../context/AppContext';
import { Plus, MessageSquare, Clock, Paperclip, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientPortal() {
  const { user, legacySignals, logout, createLegacySignal } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  // Filter signals created by the current client user
  const clientSignals = legacySignals.filter(signal => signal.createdBy?.id === user?.id);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    createLegacySignal({
      subject: ticketForm.subject,
      description: ticketForm.description,
      category: 'General Inquiry',
      priority: ticketForm.priority,
      status: 'Open',
      createdBy: user!
    });

    toast.success('Your support request has been submitted successfully!');
    setIsCreateDialogOpen(false);
    setTicketForm({ subject: '', description: '', priority: 'Medium' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      case 'In Progress': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'Resolved': return 'bg-iq-green/20 text-iq-green border-iq-green/30';
      case 'Closed': return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'Medium': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'Low': return 'bg-iq-green/20 text-iq-green border-iq-green/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-nocturne-indigo">
      {/* Header */}
      <div className="bg-slate-gray/50 border-b border-mist-gray/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-iq-green to-glow-cyan rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-nocturne-indigo" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-cloud-white">BuboIQ Observer Portal</h1>
                <p className="text-sm text-mist-gray">Welcome, {user?.name}</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={logout} className="bubo-btn-ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cloud-white">Support Dashboard</h2>
              <p className="text-mist-gray mt-1">Submit support requests and track the status of your inquiries</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bubo-btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-slate-gray border-mist-gray/30">
                <DialogHeader>
                  <DialogTitle className="text-cloud-white">Submit Support Request</DialogTitle>
                  <DialogDescription className="text-mist-gray">
                    Describe your issue or request below. Our support team will get back to you soon.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="subject" className="text-cloud-white">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      required
                      className="bg-nocturne-indigo border-mist-gray/30 text-cloud-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="priority" className="text-cloud-white">Priority</Label>
                    <Select value={ticketForm.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setTicketForm({...ticketForm, priority: value})}>
                      <SelectTrigger className="bg-nocturne-indigo border-mist-gray/30 text-cloud-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-cloud-white">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      rows={5}
                      required
                      className="bg-nocturne-indigo border-mist-gray/30 text-cloud-white"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="bubo-btn-ghost">
                      Cancel
                    </Button>
                    <Button type="submit" className="bubo-btn-primary">
                      Submit Request
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cloud-white">Total Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-iq-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iq-green">{clientSignals.length}</div>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cloud-white">Open</CardTitle>
              <Clock className="h-4 w-4 text-signal-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-signal-blue">
                {clientSignals.filter(t => t.status === 'Open').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cloud-white">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-amber-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-warning">
                {clientSignals.filter(t => t.status === 'In Progress').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bubo-signal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cloud-white">Resolved</CardTitle>
              <Clock className="h-4 w-4 text-iq-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iq-green">
                {clientSignals.filter(t => t.status === 'Resolved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Requests */}
        <Card className="bubo-signal-card">
          <CardHeader>
            <CardTitle className="text-cloud-white">My Support Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {clientSignals.length > 0 ? (
              <div className="space-y-4">
                {clientSignals.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-slate-gray/30 border border-mist-gray/20 rounded-xl hover:bg-slate-gray/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-mist-gray">{ticket.id}</span>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-cloud-white mb-2">{ticket.subject}</h3>
                        <p className="text-mist-gray text-sm mb-3 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center text-xs text-mist-gray space-x-4">
                          <span>Created {formatDate(ticket.createdAt)}</span>
                          {ticket.assignedTo && (
                            <>
                              <span>•</span>
                              <span>Assigned to {ticket.assignedTo.name}</span>
                            </>
                          )}
                          {ticket.comments?.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{ticket.comments.length} update{ticket.comments.length !== 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Latest Comments */}
                    {ticket.comments?.length > 0 && (
                      <div className="border-t border-mist-gray/20 pt-3 mt-3">
                        <h4 className="text-sm font-medium text-cloud-white mb-2">Latest Update:</h4>
                        <div className="bg-nocturne-indigo/50 p-3 rounded-xl text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-iq-green">
                              {ticket.comments[ticket.comments.length - 1].author.name}
                            </span>
                            <span className="text-xs text-mist-gray">
                              {formatDate(ticket.comments[ticket.comments.length - 1].createdAt)}
                            </span>
                          </div>
                          <p className="text-cloud-white">
                            {ticket.comments[ticket.comments.length - 1].content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-iq-green/20 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-iq-green" />
                </div>
                <h3 className="text-lg font-medium text-cloud-white mb-2">No requests yet</h3>
                <p className="text-mist-gray mb-6">
                  Get started by submitting your first support request.
                </p>
                <Button 
                  className="bubo-btn-primary"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card className="mt-6 bubo-signal-card">
          <CardContent className="p-6">
            <h3 className="font-semibold text-cloud-white mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-iq-green mb-2">Response Times</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>High Priority: 2-4 hours</li>
                  <li>Medium Priority: 8-12 hours</li>
                  <li>Low Priority: 24-48 hours</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-iq-green mb-2">Contact Information</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>Email: support@buboiq.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Hours: Mon-Fri 9AM-6PM EST</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}