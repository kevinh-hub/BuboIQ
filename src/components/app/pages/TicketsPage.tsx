import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Monitor,
  X,
  Link as LinkIcon,
  Target,
  RefreshCw,
  Download,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { ticketsApi, devicesApi } from '../../../utils/supabase/client';
import { LoadingSpinner, ErrorState, EmptyState } from '../../SystemStates';
import { toast } from 'sonner';

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

interface Ticket {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
  device?: {
    id: string;
    hostname: string;
    ip_address?: string;
    operating_system?: string;
  };
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  tags?: string[];
  comments_count: number;
  risk_score?: number;
}

interface TicketsPageProps {
  user: any;
  onNavigate: (route: AppRoute, options?: { deviceId?: string; ticketId?: string; deviceContext?: DeviceContext }) => void;
  deviceContext?: DeviceContext | null;
  onClearDeviceContext: () => void;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ 
  user, 
  onNavigate, 
  deviceContext,
  onClearDeviceContext
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  
  // Create ticket modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignee_id: '',
    device_id: ''
  });

  useEffect(() => {
    loadTicketsData();
  }, []);

  // Auto-open create modal when device context is provided
  useEffect(() => {
    if (deviceContext) {
      setSelectedDevice(deviceContext);
      setFormData(prev => ({
        ...prev,
        device_id: deviceContext.id,
        title: `Problem with ${deviceContext.hostname}`,
        description: `Computer: ${deviceContext.hostname}\nIP: ${deviceContext.ip_address || 'N/A'}\nOS: ${deviceContext.operating_system || 'Unknown'}\n\nWhat's happening:\n`
      }));
      setShowCreateModal(true);
    }
  }, [deviceContext]);

  const loadTicketsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ticketsResponse, devicesResponse] = await Promise.all([
        ticketsApi.getAll(),
        devicesApi.getAll()
      ]);

      setTickets(ticketsResponse.tickets || []);
      setDevices(devicesResponse.devices || []);
    } catch (error) {
      console.error('Failed to load tickets data:', error);
      setError('Couldn\'t load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!formData.title.trim()) {
      toast.error('Add a title');
      return;
    }

    setCreateLoading(true);
    
    try {
      // Create the ticket
      const ticketResponse = await ticketsApi.create({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignee_id: formData.assignee_id || undefined,
      });

      // If device is selected, link it to the ticket
      if (selectedDevice) {
        // TODO: Add device linking API call
        // await ticketsApi.linkDevice(ticketResponse.ticket.id, selectedDevice.id);
      }

      toast.success('Issue opened', {
        description: selectedDevice ? `Linked to ${selectedDevice.hostname}` : undefined
      });

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee_id: '',
        device_id: ''
      });
      setSelectedDevice(null);
      setShowCreateModal(false);
      onClearDeviceContext();
      
      // Reload tickets
      loadTicketsData();
      
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeviceSelect = (device: any) => {
    setSelectedDevice(device);
    setFormData(prev => ({
      ...prev,
      device_id: device.id
    }));
    setDeviceSearchQuery('');
  };

  const filteredDevices = devices.filter(device =>
    device.hostname.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.ip_address?.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.serial_number?.toLowerCase().includes(deviceSearchQuery.toLowerCase())
  );

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || ticket.assignee?.id === filterAssignee;
    const matchesDevice = filterDevice === 'all' || 
      (filterDevice === 'with_device' && ticket.device) ||
      (filterDevice === 'no_device' && !ticket.device);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDevice;
  });

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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" message="Loading tickets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Tickets Error"
          message={error}
          onRetry={loadTicketsData}
          type="server"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">
            Support Issues
          </h1>
          <p className="text-mist-gray">
            Track and manage IT problems • {tickets.length} total issues
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={loadTicketsData}
            className="text-mist-gray hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            className="text-mist-gray hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button 
            className="bubo-btn-neon-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Open issue
          </Button>
        </div>
      </div>

      {/* Device Context Banner */}
      {deviceContext && (
        <Card className="bubo-glass-bright border-iq-neon-green/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-iq-neon-green" />
              <div>
                <div className="font-medium text-white">
                  Opening issue for: {deviceContext.hostname}
                </div>
                <div className="text-sm text-mist-gray">
                  {deviceContext.ip_address} • {deviceContext.operating_system}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-iq-neon-green hover:bg-iq-neon-green/10"
                onClick={() => setShowCreateModal(true)}
              >
                Continue
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-mist-gray hover:text-white"
                onClick={onClearDeviceContext}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-crimson-danger/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-crimson-danger" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div className="text-xs text-mist-gray">Open</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {tickets.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-xs text-mist-gray">In Progress</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
              <div className="text-xs text-mist-gray">Resolved</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {tickets.filter(t => t.device).length}
              </div>
              <div className="text-xs text-mist-gray">With Computer</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bubo-glass p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="with_device">With Computer</SelectItem>
                <SelectItem value="no_device">No Computer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="bubo-glass">
        {filteredTickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No issues found"
            description={searchQuery ? "No issues match your search" : "Open your first issue to get started"}
            actions={[
              {
                label: "Open issue",
                onClick: () => setShowCreateModal(true),
                primary: true
              }
            ]}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-gray/30">
                <TableHead className="text-mist-gray">#</TableHead>
                <TableHead className="text-mist-gray">Title</TableHead>
                <TableHead className="text-mist-gray">Requester</TableHead>
                <TableHead className="text-mist-gray">Status</TableHead>
                <TableHead className="text-mist-gray">Priority</TableHead>
                <TableHead className="text-mist-gray">Assignee</TableHead>
                <TableHead className="text-mist-gray">Computer</TableHead>
                <TableHead className="text-mist-gray">Updated</TableHead>
                <TableHead className="text-mist-gray w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  className="border-slate-gray/30 hover:bg-nocturne-indigo/30 cursor-pointer"
                  onClick={() => onNavigate('ticket-detail', { ticketId: ticket.id })}
                >
                  <TableCell>
                    <code className="text-xs bg-nocturne-indigo/50 px-2 py-1 rounded text-electric-blue">
                      {ticket.id.slice(0, 8)}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium text-white truncate">{ticket.title}</div>
                      {ticket.description && (
                        <div className="text-xs text-mist-gray truncate">{ticket.description}</div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-mist-gray" />
                      <span className="text-white text-sm">{ticket.requester?.name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {ticket.assignee ? (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-electric-blue" />
                        <span className="text-white text-sm">{ticket.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-mist-gray text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {ticket.device ? (
                      <div className="flex items-center space-x-2 cursor-pointer hover:text-iq-neon-green"
                           onClick={(e) => {
                             e.stopPropagation();
                             if (ticket.device?.id) {
                               onNavigate('device-detail', { deviceId: ticket.device.id });
                             }
                           }}>
                        <Monitor className="w-4 h-4 text-iq-neon-green" />
                        <span className="text-white text-sm">{ticket.device.hostname}</span>
                      </div>
                    ) : (
                      <span className="text-mist-gray text-sm">No computer</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-mist-gray" />
                      <span className="text-sm text-mist-gray">
                        {getTimeAgo(ticket.updated_at)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onNavigate('ticket-detail', { ticketId: ticket.id })}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Ticket
                        </DropdownMenuItem>
                        {ticket.device && (
                          <DropdownMenuItem onClick={() => onNavigate('device-detail', { deviceId: ticket.device!.id })}>
                            <Monitor className="w-4 h-4 mr-2" />
                            View Device
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create Ticket Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-2xl bubo-glass">
          <DialogHeader>
            <DialogTitle className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Open new issue
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Device Context Display */}
            {selectedDevice && (
              <Card className="bubo-glass-bright border-iq-neon-green/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-iq-neon-green" />
                    <div>
                      <div className="font-medium text-white">Linked to: {selectedDevice.hostname}</div>
                      <div className="text-sm text-mist-gray">
                        {selectedDevice.ip_address} • {selectedDevice.operating_system}
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-mist-gray hover:text-white"
                    onClick={() => setSelectedDevice(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">What's wrong? *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Printer won't connect"
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Tell us what you saw</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happened and what you tried..."
                rows={4}
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-white">How urgent?</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <Label className="text-white">Assign to</Label>
                <Select value={formData.assignee_id} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee_id: value }))}>
                  <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    <SelectItem value={user.id}>Take this</SelectItem>
                    {/* TODO: Add other team members */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Device Picker */}
            {!selectedDevice && (
              <div className="space-y-2">
                <Label className="text-white">Which computer? (optional)</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
                    <Input
                      placeholder="Search by name, IP, or serial..."
                      value={deviceSearchQuery}
                      onChange={(e) => setDeviceSearchQuery(e.target.value)}
                      className="pl-10 bg-nocturne-indigo/30 border-slate-gray/30"
                    />
                  </div>
                  
                  {deviceSearchQuery && (
                    <Card className="bg-nocturne-indigo/50 border-slate-gray/30 max-h-48 overflow-y-auto">
                      {filteredDevices.length === 0 ? (
                        <div className="p-4 text-center text-mist-gray">
                          No computers found
                        </div>
                      ) : (
                        <div className="p-2 space-y-1">
                          {filteredDevices.slice(0, 5).map((device) => (
                            <div
                              key={device.id}
                              className="flex items-center space-x-3 p-3 hover:bg-slate-gray/30 rounded-lg cursor-pointer"
                              onClick={() => handleDeviceSelect(device)}
                            >
                              <div className={`w-2 h-2 rounded-full ${device.is_online ? 'bg-iq-neon-green' : 'bg-slate-gray'}`} />
                              <Monitor className="w-4 h-4 text-electric-blue" />
                              <div className="flex-1">
                                <div className="text-white text-sm">{device.hostname}</div>
                                <div className="text-xs text-mist-gray">
                                  {device.ip_address} • {device.operating_system}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                setSelectedDevice(null);
                onClearDeviceContext();
                setFormData({
                  title: '',
                  description: '',
                  priority: 'medium',
                  assignee_id: '',
                  device_id: ''
                });
              }}
              className="text-mist-gray hover:text-white"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleCreateTicket}
              disabled={createLoading || !formData.title.trim()}
              className="bubo-btn-neon-primary"
            >
              {createLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Open issue
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};