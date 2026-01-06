import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Monitor,
  Laptop,
  Server,
  Smartphone,
  Wifi,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  User,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Shield,
  Activity,
  Ticket,
  Play,
  RefreshCw,
  Edit,
  Trash2,
  Download,
  Link,
  Eye,
  Zap,
  Settings,
  History,
  Info
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { devicesApi, ticketsApi, signalsApi } from '../../../utils/supabase/client';
import { LoadingSpinner, ErrorState } from '../../SystemStates';
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

interface DeviceDetailPageProps {
  deviceId: string;
  user: any;
  onNavigate: (route: AppRoute, options?: { deviceId?: string; ticketId?: string; deviceContext?: DeviceContext }) => void;
  onCreateTicketFromDevice: (device: DeviceContext) => void;
}

export const DeviceDetailPage: React.FC<DeviceDetailPageProps> = ({ 
  deviceId, 
  user, 
  onNavigate, 
  onCreateTicketFromDevice 
}) => {
  const [device, setDevice] = useState<any>(null);
  const [linkedTickets, setLinkedTickets] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDeviceData();
  }, [deviceId]);

  const loadDeviceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [deviceResponse, ticketsResponse, eventsResponse] = await Promise.all([
        devicesApi.getById(deviceId),
        ticketsApi.getAll({ device_id: deviceId } as any),
        signalsApi.getAll({ device_id: deviceId } as any)
      ]);

      setDevice(deviceResponse.device);
      setLinkedTickets(ticketsResponse.tickets || []);
      setRecentEvents(eventsResponse.signals || []);
    } catch (error) {
      console.error('Failed to load device data:', error);
      setError('Couldn\'t load computer details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    if (!device) return;
    
    const deviceContext: DeviceContext = {
      id: device.id,
      hostname: device.hostname,
      ip_address: device.ip_address,
      operating_system: device.operating_system,
      mac_address: device.mac_address,
      serial_number: device.metadata?.serial_number,
      health_score: device.health_score,
      is_online: device.is_online
    };
    
    onCreateTicketFromDevice(deviceContext);
  };

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
    if (!isOnline) return 'text-slate-gray';
    if (healthScore >= 80) return 'text-iq-neon-green';
    if (healthScore >= 60) return 'text-amber-warning';
    return 'text-crimson-danger';
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
    const date = new Date(lastSeen);
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
        <LoadingSpinner size="lg" message="Loading computer..." />
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="p-6">
        <ErrorState
          title="Computer error"
          message={error || 'Computer not found'}
          onRetry={loadDeviceData}
          type="server"
        />
      </div>
    );
  }

  const DeviceIcon = getDeviceIcon(device.device_type);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('devices')}
            className="text-mist-gray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Computers
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
              <DeviceIcon className="w-6 h-6 text-electric-blue" />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                {device.hostname}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-mist-gray">
                <code className="bg-nocturne-indigo/50 px-2 py-1 rounded">
                  {device.id.slice(0, 8)}
                </code>
                <span>•</span>
                <span>{device.device_type}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    device.is_online ? 'bg-iq-neon-green animate-pulse' : 'bg-slate-gray'
                  }`} />
                  <span className={getStatusColor(device.is_online, device.health_score)}>
                    {device.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={loadDeviceData}
            className="text-mist-gray hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <TierGuard requiredTier="pro" feature="remote-access" showUpgrade={false}>
            <Button className="bubo-btn-secondary">
              <Play className="w-4 h-4 mr-2" />
              Start remote help
            </Button>
          </TierGuard>
          
          <Button 
            className="bubo-btn-neon-primary"
            onClick={handleCreateTicket}
          >
            <Ticket className="w-4 h-4 mr-2" />
            Open issue
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{device.health_score ?? 0}%</div>
              <div className="text-xs text-mist-gray">Health</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{linkedTickets.length}</div>
              <div className="text-xs text-mist-gray">Open Issues</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{recentEvents.length}</div>
              <div className="text-xs text-mist-gray">Recent warnings</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-prediction-purple/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-prediction-purple" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {getLastSeenText(device.last_seen_at)}
              </div>
              <div className="text-xs text-mist-gray">Last Seen</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-nocturne-indigo/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Overview
          </TabsTrigger>
          <TabsTrigger value="hardware" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Hardware
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Network
          </TabsTrigger>
          <TabsTrigger value="software" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Software
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Events
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            Issues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Computer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Computer Name</div>
                      <div className="text-white font-medium">{device.hostname}</div>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Operating System</div>
                      <div className="text-white">{device.operating_system || 'Unknown'}</div>
                      {device.os_version && (
                        <div className="text-xs text-mist-gray">{device.os_version}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Computer Type</div>
                      <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                        {device.device_type}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Risk Level</div>
                      <Badge className={getRiskColor(device.risk_level)}>
                        {device.risk_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Network Address</div>
                      <code className="text-sm bg-nocturne-indigo/50 px-2 py-1 rounded text-electric-blue">
                        {device.ip_address || 'N/A'}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Hardware ID</div>
                      <code className="text-sm bg-nocturne-indigo/50 px-2 py-1 rounded text-cyan-accent">
                        {device.mac_address || 'N/A'}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Serial Number</div>
                      <code className="text-sm bg-nocturne-indigo/50 px-2 py-1 rounded text-mist-gray">
                        {device.metadata?.serial_number || 'N/A'}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">System ID</div>
                      <code className="text-sm bg-nocturne-indigo/50 px-2 py-1 rounded text-mist-gray">
                        {device.metadata?.uuid || device.id.slice(0, 8) + '...'}
                      </code>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Ownership & Location */}
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Ownership & Location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Owner</div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-electric-blue" />
                        <span className="text-white">{device.owner_email || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Department</div>
                      <div className="text-white">{device.department || 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Location</div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-amber-warning" />
                        <span className="text-white">{device.location || 'Unknown'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-mist-gray mb-1">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {device.tags && device.tags.length > 0 ? (
                          device.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-mist-gray text-sm">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Health & Status */}
            <div className="space-y-6">
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Health Status
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{device.health_score ?? 0}%</div>
                    <Progress value={device.health_score ?? 0} className="w-full h-3 mb-2" />
                    <div className={`text-sm font-medium ${getStatusColor(device.is_online, device.health_score ?? 0)}`}>
                      {(device.health_score ?? 0) >= 80 ? 'Excellent' : 
                       (device.health_score ?? 0) >= 60 ? 'Good' : 
                       (device.health_score ?? 0) >= 40 ? 'Fair' : 'Poor'}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Connection Status</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          device.is_online ? 'bg-iq-neon-green animate-pulse' : 'bg-slate-gray'
                        }`} />
                        <span className={`text-sm ${getStatusColor(device.is_online, device.health_score)}`}>
                          {device.is_online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Last Check-in</span>
                      <span className="text-sm text-white">
                        {getLastSeenText(device.last_seen_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mist-gray">Uptime</span>
                      <span className="text-sm text-iq-neon-green">
                        {device.metadata?.uptime || '99.2%'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="bubo-glass p-6">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full bubo-btn-neon-primary"
                    onClick={handleCreateTicket}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                  
                  <TierGuard requiredTier="pro" feature="remote-access" showUpgrade={false}>
                    <Button className="w-full bubo-btn-secondary">
                      <Play className="w-4 h-4 mr-2" />
                      Connect Remotely
                    </Button>
                  </TierGuard>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-mist-gray hover:text-white hover:bg-slate-gray/30"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Health
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-mist-gray hover:text-white hover:bg-slate-gray/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hardware" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-6">
              Hardware Information
            </h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-nocturne-indigo/30 rounded-xl">
                  <Cpu className="w-8 h-8 text-electric-blue" />
                  <div>
                    <div className="font-medium text-white">Processor</div>
                    <div className="text-sm text-mist-gray">{device.metadata?.cpu || 'Unknown CPU'}</div>
                    <div className="text-xs text-electric-blue">{device.metadata?.cpu_cores || '4'} cores</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-nocturne-indigo/30 rounded-xl">
                  <MemoryStick className="w-8 h-8 text-iq-neon-green" />
                  <div>
                    <div className="font-medium text-white">Memory</div>
                    <div className="text-sm text-mist-gray">{device.metadata?.memory || '16 GB'}</div>
                    <div className="text-xs text-iq-neon-green">DDR4</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-nocturne-indigo/30 rounded-xl">
                  <HardDrive className="w-8 h-8 text-amber-warning" />
                  <div>
                    <div className="font-medium text-white">Storage</div>
                    <div className="text-sm text-mist-gray">{device.metadata?.storage || '512 GB SSD'}</div>
                    <div className="text-xs text-amber-warning">85% used</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-nocturne-indigo/30 rounded-xl">
                  <Monitor className="w-8 h-8 text-prediction-purple" />
                  <div>
                    <div className="font-medium text-white">Graphics</div>
                    <div className="text-sm text-mist-gray">{device.metadata?.gpu || 'Integrated Graphics'}</div>
                    <div className="text-xs text-prediction-purple">DirectX 12</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-6">
              Network Configuration
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-mist-gray mb-1">Primary IP Address</div>
                  <code className="bg-nocturne-indigo/50 px-3 py-2 rounded text-electric-blue block">
                    {device.ip_address || 'N/A'}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-mist-gray mb-1">MAC Address</div>
                  <code className="bg-nocturne-indigo/50 px-3 py-2 rounded text-cyan-accent block">
                    {device.mac_address || 'N/A'}
                  </code>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-mist-gray mb-1">Subnet</div>
                  <code className="bg-nocturne-indigo/50 px-3 py-2 rounded text-mist-gray block">
                    {device.metadata?.subnet || '192.168.1.0/24'}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-mist-gray mb-1">Gateway</div>
                  <code className="bg-nocturne-indigo/50 px-3 py-2 rounded text-mist-gray block">
                    {device.metadata?.gateway || '192.168.1.1'}
                  </code>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-mist-gray mb-1">DNS Servers</div>
                  <code className="bg-nocturne-indigo/50 px-3 py-2 rounded text-mist-gray block">
                    {device.metadata?.dns || '8.8.8.8, 8.8.4.4'}
                  </code>
                </div>
                <div>
                  <div className="text-xs text-mist-gray mb-1">DHCP</div>
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                    {device.metadata?.dhcp_enabled !== false ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="software" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-6">
              Installed Software
            </h3>
            <div className="space-y-4">
              {device.metadata?.software ? (
                device.metadata.software.map((software: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-nocturne-indigo/30 rounded-xl">
                    <div>
                      <div className="font-medium text-white">{software.name}</div>
                      <div className="text-sm text-mist-gray">{software.version}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {software.category || 'Application'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-mist-gray mx-auto mb-4" />
                  <p className="text-mist-gray">Software inventory not available</p>
                  <p className="text-sm text-mist-gray mt-2">Run discovery or install agent to collect software information</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-6">
              Recent Events
            </h3>
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 bg-nocturne-indigo/30 rounded-xl">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.severity === 'critical' ? 'bg-crimson-danger' :
                      event.severity === 'high' ? 'bg-amber-warning' :
                      event.severity === 'medium' ? 'bg-electric-blue' : 'bg-iq-neon-green'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{event.title}</span>
                        <Badge className={`text-xs ${
                          event.severity === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
                          event.severity === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
                          event.severity === 'medium' ? 'bg-electric-blue/20 text-electric-blue' :
                          'bg-iq-neon-green/20 text-iq-neon-green'
                        }`}>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-mist-gray mb-2">{event.description}</p>
                      <p className="text-xs text-mist-gray">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-mist-gray mx-auto mb-4" />
                  <p className="text-mist-gray">No recent events</p>
                  <p className="text-sm text-mist-gray mt-2">Events will appear here as they are detected</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Linked Tickets
              </h3>
              <Button 
                className="bubo-btn-neon-primary"
                onClick={handleCreateTicket}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </div>
            
            <div className="space-y-4">
              {linkedTickets.length > 0 ? (
                linkedTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl hover:bg-nocturne-indigo/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('ticket-detail', { ticketId: ticket.id })}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{ticket.title}</span>
                        <Badge className={`text-xs ${
                          ticket.priority === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
                          ticket.priority === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
                          ticket.priority === 'medium' ? 'bg-electric-blue/20 text-electric-blue' :
                          'bg-iq-neon-green/20 text-iq-neon-green'
                        }`}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={`text-xs ${
                          ticket.status === 'open' ? 'bg-crimson-danger/20 text-crimson-danger' :
                          ticket.status === 'in_progress' ? 'bg-amber-warning/20 text-amber-warning' :
                          'bg-iq-neon-green/20 text-iq-neon-green'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-mist-gray">
                        <span className="font-mono">{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.assignee?.name || 'Unassigned'}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-mist-gray" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 text-mist-gray mx-auto mb-4" />
                  <p className="text-mist-gray">No tickets linked to this device</p>
                  <p className="text-sm text-mist-gray mt-2">Create a ticket to track issues with this device</p>
                  <Button 
                    className="mt-4 bubo-btn-secondary"
                    onClick={handleCreateTicket}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Ticket
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};