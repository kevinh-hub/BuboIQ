import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Laptop,
  Server,
  Smartphone,
  Wifi,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  Ticket,
  Play,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Shield
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Progress } from '../../ui/progress';
import { devicesApi } from '../../../utils/supabase/client';
import { LoadingSpinner, ErrorState, EmptyState } from '../../SystemStates';
import { TierGuard } from '../../TierGuard';

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

interface Device {
  id: string;
  hostname: string;
  display_name?: string;
  device_type: 'workstation' | 'server' | 'laptop' | 'mobile' | 'network';
  ip_address?: string;
  mac_address?: string;
  operating_system?: string;
  os_version?: string;
  location?: string;
  department?: string;
  owner_email?: string;
  tags?: string[];
  is_online: boolean;
  health_score: number;
  last_seen: string;
  created_at: string;
  updated_at: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  linked_tickets_count: number;
  metadata?: Record<string, any>;
}

interface DevicesPageProps {
  user: any;
  onNavigate: (route: AppRoute, options?: { deviceId?: string; ticketId?: string; deviceContext?: DeviceContext }) => void;
  onCreateTicketFromDevice: (device: DeviceContext) => void;
}

export const DevicesPage: React.FC<DevicesPageProps> = ({ 
  user, 
  onNavigate, 
  onCreateTicketFromDevice 
}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('hostname');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await devicesApi.getAll();
      setDevices(response.devices || []);
    } catch (error) {
      console.error('Failed to load devices:', error);
      
      // Use empty data when backend is offline
      console.log('🔄 Backend offline - showing empty devices list');
      setDevices([]);
      setError(null); // Don't show error, just empty state
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = (device: Device) => {
    const deviceContext: DeviceContext = {
      id: device.id,
      hostname: device.hostname,
      ip_address: device.ip_address,
      operating_system: device.operating_system,
      mac_address: device.mac_address,
      serial_number: device.metadata?.serial_number,
      health_score: device.health_score,
      is_online: device.status === 'online'
    };
    
    onCreateTicketFromDevice(deviceContext);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedDevices.size === 0) return;
    
    try {
      switch (action) {
        case 'rescan':
          // Bulk rescan devices
          console.log('Rescanning devices:', Array.from(selectedDevices));
          break;
        case 'export':
          // Export selected devices
          console.log('Exporting devices:', Array.from(selectedDevices));
          break;
        case 'remote':
          // Start remote sessions (Pro feature)
          console.log('Starting remote sessions for devices:', Array.from(selectedDevices));
          break;
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  // Filter and sort devices
  const filteredDevices = devices
    .filter(device => {
      const matchesSearch = searchQuery === '' || 
        device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ip_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.operating_system?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.owner_email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'online' && device.is_online) ||
        (filterStatus === 'offline' && !device.is_online);
      
      const matchesType = filterType === 'all' || device.device_type === filterType;
      const matchesRisk = filterRisk === 'all' || device.risk_level === filterRisk;
      
      return matchesSearch && matchesStatus && matchesType && matchesRisk;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof Device] || '';
      const bValue = b[sortField as keyof Device] || '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'workstation': return Monitor;
      case 'laptop': return Laptop;
      case 'server': return Server;
      case 'mobile': return Smartphone;
      case 'network': return Wifi;
      default: return Monitor;
    }
  };

  const getStatusColor = (isOnline: boolean, healthScore: number = 0) => {
    if (!isOnline) return 'bg-slate-gray text-slate-gray';
    if (healthScore >= 80) return 'bg-iq-neon-green/20 text-iq-neon-green';
    if (healthScore >= 60) return 'bg-amber-warning/20 text-amber-warning';
    return 'bg-crimson-danger/20 text-crimson-danger';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'medium': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'high': return 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30';
      case 'critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      default: return 'bg-slate-gray/20 text-mist-gray border-slate-gray/30';
    }
  };

  const getLastSeenText = (lastSeen: string) => {
    if (!lastSeen) return 'Never';
    const date = new Date(lastSeen);
    if (isNaN(date.getTime())) return 'Unknown';
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
        <LoadingSpinner size="lg" message="Loading devices..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Devices Error"
          message={error}
          onRetry={loadDevices}
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
            Computers
          </h1>
          <p className="text-mist-gray">
            All computers and devices on your network • {devices.length} total computers
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={loadDevices}
            className="text-mist-gray hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <TierGuard requiredTier="pro" feature="device-discovery" showUpgrade={false}>
            <Button className="bubo-btn-secondary">
              <Search className="w-4 h-4 mr-2" />
              Find Computers
            </Button>
          </TierGuard>
          
          <Button 
            className="bubo-btn-neon-primary"
            onClick={() => {/* TODO: Open add device modal */}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Computer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {devices.filter(d => d.is_online).length}
              </div>
              <div className="text-xs text-mist-gray">Online</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-gray/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-slate-gray" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {devices.filter(d => !d.is_online).length}
              </div>
              <div className="text-xs text-mist-gray">Offline</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {devices.filter(d => d.risk_level === 'high' || d.risk_level === 'critical').length}
              </div>
              <div className="text-xs text-mist-gray">At Risk</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {devices.reduce((sum, d) => sum + (d.linked_tickets_count || 0), 0)}
              </div>
              <div className="text-xs text-mist-gray">Open Issues</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bubo-glass p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
              <Input
                placeholder="Search by computer name, location, or owner..."
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
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workstation">Desktop</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="network">Network Device</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDevices.size > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-gray/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">
                {selectedDevices.size} computer{selectedDevices.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <TierGuard requiredTier="pro" feature="bulk-actions" showUpgrade={false}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBulkAction('remote')}
                    className="text-electric-blue hover:bg-electric-blue/10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start remote help
                  </Button>
                </TierGuard>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBulkAction('rescan')}
                  className="text-amber-warning hover:bg-amber-warning/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Health
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBulkAction('export')}
                  className="text-iq-neon-green hover:bg-iq-neon-green/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Devices Table */}
      <Card className="bubo-glass">
        {filteredDevices.length === 0 ? (
          <EmptyState
            icon={Monitor}
            title="No computers found"
            description={searchQuery ? "No computers match your search criteria" : "Start by adding computers or scanning your network"}
            actions={[
              {
                label: "Add Computer",
                onClick: () => {/* TODO: Open add device modal */},
                primary: true
              },
              {
                label: "Find Computers",
                onClick: () => onNavigate('discovery'),
                tier: 'pro'
              }
            ]}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-gray/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedDevices.size === filteredDevices.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDevices(new Set(filteredDevices.map(d => d.id)));
                      } else {
                        setSelectedDevices(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="text-mist-gray">Status</TableHead>
                <TableHead className="text-mist-gray cursor-pointer" onClick={() => {
                  setSortField('hostname');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Computer Name
                </TableHead>
                <TableHead className="text-mist-gray">Operating System</TableHead>
                <TableHead className="text-mist-gray">Owner/Location</TableHead>
                <TableHead className="text-mist-gray">IP Address</TableHead>
                <TableHead className="text-mist-gray">Network ID</TableHead>
                <TableHead className="text-mist-gray">Last Seen</TableHead>
                <TableHead className="text-mist-gray">Risk</TableHead>
                <TableHead className="text-mist-gray">Issues</TableHead>
                <TableHead className="text-mist-gray w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.device_type);
                
                return (
                  <TableRow 
                    key={device.id} 
                    className="border-slate-gray/30 hover:bg-nocturne-indigo/30 cursor-pointer"
                    onClick={() => onNavigate('device-detail', { deviceId: device.id })}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedDevices.has(device.id)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedDevices);
                          if (checked) {
                            newSelected.add(device.id);
                          } else {
                            newSelected.delete(device.id);
                          }
                          setSelectedDevices(newSelected);
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          device.is_online ? 'bg-iq-neon-green animate-pulse' : 'bg-slate-gray'
                        }`} />
                        <Badge className={getStatusColor(device.is_online, device.health_score)}>
                          {device.is_online ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                          <DeviceIcon className="w-4 h-4 text-electric-blue" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{device.hostname}</div>
                          <div className="text-xs text-mist-gray font-mono">{device.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="text-white">{device.operating_system || 'Unknown'}</div>
                        {device.os_version && (
                          <div className="text-xs text-mist-gray">{device.os_version}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        {device.owner_email && (
                          <div className="text-white text-sm">{device.owner_email.split('@')[0]}</div>
                        )}
                        <div className="text-xs text-mist-gray">{device.location || device.department || 'Unassigned'}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <code className="text-xs bg-nocturne-indigo/50 px-2 py-1 rounded text-electric-blue">
                        {device.ip_address || 'N/A'}
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      <code className="text-xs bg-nocturne-indigo/50 px-2 py-1 rounded text-cyan-accent">
                        {device.mac_address ? device.mac_address.slice(0, 8) + '...' : 'N/A'}
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-mist-gray" />
                        <span className="text-sm text-mist-gray">
                          {getLastSeenText(device.last_seen)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getRiskColor(device.risk_level)}>
                        {device.risk_level}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Ticket className="w-3 h-3 text-electric-blue" />
                        <span className="text-sm text-white">{device.linked_tickets_count}</span>
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
                          <DropdownMenuItem onClick={() => onNavigate('device-detail', { deviceId: device.id })}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCreateTicket(device)}>
                            <Ticket className="w-4 h-4 mr-2" />
                            Report Issue
                          </DropdownMenuItem>
                          <TierGuard requiredTier="pro" feature="remote-access" showUpgrade={false}>
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Connect Remotely
                            </DropdownMenuItem>
                          </TierGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};