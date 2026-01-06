import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Ticket,
  User,
  Clock,
  Monitor,
  Edit,
  MessageSquare,
  Plus,
  Link as LinkIcon,
  Settings,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Eye,
  Play,
  Tag
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { Separator } from '../../ui/separator';
import { ticketsApi } from '../../../utils/supabase/client';
import { LoadingSpinner, ErrorState } from '../../SystemStates';

// Define locally to avoid circular dependency
type AppRoute = string;

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

interface TicketDetailPageProps {
  ticketId: string;
  user: any;
  onNavigate: (route: AppRoute, options?: any) => void;
  onCreateTicketFromDevice: (device: DeviceContext) => void;
}

export const TicketDetailPage: React.FC<TicketDetailPageProps> = ({ 
  ticketId, 
  user, 
  onNavigate,
  onCreateTicketFromDevice 
}) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  const loadTicketData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApi.getById(ticketId);
      setTicket(response.ticket);
    } catch (error) {
      console.error('Failed to load ticket:', error);
      setError('Couldn\'t load issue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" message="Loading issue..." />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <ErrorState
          title="Issue Error"
          message={error || 'Issue not found'}
          onRetry={loadTicketData}
          type="server"
        />
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'high': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'medium': return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
      case 'low': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      default: return 'bg-slate-gray/20 text-mist-gray border-slate-gray/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-crimson-danger/20 text-crimson-danger';
      case 'in_progress': return 'bg-amber-warning/20 text-amber-warning';
      case 'resolved': return 'bg-iq-neon-green/20 text-iq-neon-green';
      case 'closed': return 'bg-slate-gray/20 text-mist-gray';
      default: return 'bg-slate-gray/20 text-mist-gray';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('tickets')}
            className="text-mist-gray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Issues
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-electric-blue" />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                {ticket.title}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-mist-gray">
                <code className="bg-nocturne-indigo/50 px-2 py-1 rounded">
                  {ticket.id.slice(0, 8)}
                </code>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="text-mist-gray hover:text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          {ticket.device && (
            <Button className="bubo-btn-secondary">
              <Play className="w-4 h-4 mr-2" />
              Start remote help
            </Button>
          )}
          
          <Button className="bubo-btn-neon-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-nocturne-indigo/50">
              <TabsTrigger value="details" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                Details
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Description
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-mist-gray whitespace-pre-wrap">
                    {ticket.description || 'No description provided.'}
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Comments & Updates
                </h3>
                
                {/* Comment Form */}
                <div className="space-y-3 mb-6">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-nocturne-indigo/30 border-slate-gray/30"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="internal" className="rounded" />
                      <label htmlFor="internal" className="text-sm text-mist-gray">Internal comment</label>
                    </div>
                    <Button className="bubo-btn-neon-primary" disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Mock Comments */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-iq-neon-green/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-iq-neon-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{user.name}</span>
                        <span className="text-xs text-mist-gray">2 hours ago</span>
                      </div>
                      <p className="text-sm text-mist-gray">
                        I've checked the device and it appears to be responding normally now. 
                        The issue may have been temporary.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Ticket Activity
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-iq-neon-green rounded-full mt-2" />
                    <div>
                      <div className="text-sm text-white">Ticket created</div>
                      <div className="text-xs text-mist-gray">
                        {new Date(ticket.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {ticket.device && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-electric-blue rounded-full mt-2" />
                      <div>
                        <div className="text-sm text-white">Linked to device</div>
                        <div className="text-xs text-mist-gray">
                          Device: {ticket.device.hostname}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Device Panel */}
          {ticket.device && (
            <Card className="bubo-glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                  Affected Device
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('device-detail', { deviceId: ticket.device.id })}
                  className="text-iq-neon-green hover:bg-iq-neon-green/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-electric-blue" />
                  <div>
                    <div className="font-medium text-white">{ticket.device.hostname}</div>
                    <div className="text-sm text-mist-gray">{ticket.device.operating_system}</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mist-gray">IP Address:</span>
                    <code className="text-electric-blue">{ticket.device.ip_address}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist-gray">Status:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-iq-neon-green rounded-full" />
                      <span className="text-iq-neon-green">Online</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bubo-btn-secondary mt-4">
                  <Play className="w-4 h-4 mr-2" />
                  Connect to Device
                </Button>
              </div>
            </Card>
          )}

          {/* Ticket Info */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
              Ticket Information
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-mist-gray">Requester:</span>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-electric-blue" />
                  <span className="text-white">{ticket.requester?.name || 'Unknown'}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-mist-gray">Assignee:</span>
                {ticket.assignee ? (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-iq-neon-green" />
                    <span className="text-white">{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-mist-gray">Unassigned</span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-mist-gray">Created:</span>
                <span className="text-white">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-mist-gray">Updated:</span>
                <span className="text-white">{new Date(ticket.updated_at).toLocaleDateString()}</span>
              </div>
              
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <span className="text-mist-gray mb-2 block">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-iq-neon-green hover:bg-iq-neon-green/10">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Resolved
              </Button>
              
              <Button variant="ghost" className="w-full justify-start text-mist-gray hover:text-white hover:bg-slate-gray/30">
                <Edit className="w-4 h-4 mr-2" />
                Edit Ticket
              </Button>
              
              {ticket.device && (
                <Button variant="ghost" className="w-full justify-start text-mist-gray hover:text-white hover:bg-slate-gray/30">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Change Device
                </Button>
              )}
              
              <Button variant="ghost" className="w-full justify-start text-mist-gray hover:text-white hover:bg-slate-gray/30">
                <User className="w-4 h-4 mr-2" />
                Reassign
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};