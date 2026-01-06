import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Download, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Activity, 
  Settings, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Laptop,
  Server,
  Smartphone,
  HardDrive,
  Cpu,
  MemoryStick,
  Search,
  Filter,
  MoreVertical,
  Terminal,
  Shield,
  Zap
} from 'lucide-react';
import { AgentInstaller } from './AgentInstaller';
import { toast } from 'sonner';

interface Device {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  platform: 'windows' | 'macos' | 'linux';
  osVersion: string;
  agentVersion: string;
  status: 'online' | 'offline' | 'stale';
  lastSeen: Date;
  healthScore: number;
  cpu: {
    usage: number;
    model: string;
    cores: number;
  };
  memory: {
    usage: number;
    total: number;
  };
  disk: {
    usage: number;
    total: number;
  };
  uptime: number;
  location?: string;
  owner?: string;
  tags: string[];
}

interface AgentManagementProps {
  organizationId: string;
  organizationName: string;
  userRole: 'owner' | 'admin' | 'tech' | 'viewer';
}

export function AgentManagement({ organizationId, organizationName, userRole }: AgentManagementProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'stale'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'windows' | 'macos' | 'linux'>('all');
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in production, this would come from your API
  useEffect(() => {
    const mockDevices: Device[] = [
      {
        id: '1',
        hostname: 'LAPTOP-SARAH-2024',
        ipAddress: '10.0.1.156',
        macAddress: '00:1A:2B:3C:4D:5E',
        platform: 'windows',
        osVersion: 'Windows 11 Pro (22H2)',
        agentVersion: '1.0.0',
        status: 'online',
        lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        healthScore: 87,
        cpu: {
          usage: 23.5,
          model: 'Intel Core i7-12700H',
          cores: 14
        },
        memory: {
          usage: 58.2,
          total: 32768
        },
        disk: {
          usage: 72.1,
          total: 1024
        },
        uptime: 86400 * 3, // 3 days
        location: 'New York Office',
        owner: 'sarah.johnson@acme.com',
        tags: ['laptop', 'remote-work', 'finance']
      },
      {
        id: '2',
        hostname: 'MBP-DEV-001',
        ipAddress: '10.0.1.89',
        macAddress: '00:1B:2C:3D:4E:6F',
        platform: 'macos',
        osVersion: 'macOS Sonoma 14.1',
        agentVersion: '1.0.0',
        status: 'online',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        healthScore: 94,
        cpu: {
          usage: 12.3,
          model: 'Apple M2 Pro',
          cores: 10
        },
        memory: {
          usage: 45.8,
          total: 16384
        },
        disk: {
          usage: 41.2,
          total: 512
        },
        uptime: 86400 * 7, // 7 days
        location: 'San Francisco HQ',
        owner: 'dev.team@acme.com',
        tags: ['macbook', 'development', 'mobile']
      },
      {
        id: '3',
        hostname: 'SRV-DB-PROD-01',
        ipAddress: '10.0.2.10',
        macAddress: '00:2C:3D:4E:5F:70',
        platform: 'linux',
        osVersion: 'Ubuntu Server 22.04 LTS',
        agentVersion: '1.0.0',
        status: 'stale',
        lastSeen: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        healthScore: 76,
        cpu: {
          usage: 67.8,
          model: 'AMD EPYC 7402P',
          cores: 24
        },
        memory: {
          usage: 89.1,
          total: 65536
        },
        disk: {
          usage: 34.5,
          total: 2048
        },
        uptime: 86400 * 45, // 45 days
        location: 'Data Center East',
        owner: 'infrastructure@acme.com',
        tags: ['server', 'database', 'production']
      }
    ];

    setDevices(mockDevices);
    setFilteredDevices(mockDevices);
  }, []);

  // Filter devices based on search and filters
  useEffect(() => {
    let filtered = devices;

    if (searchQuery) {
      filtered = filtered.filter(device => 
        device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ipAddress.includes(searchQuery) ||
        device.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }

    if (platformFilter !== 'all') {
      filtered = filtered.filter(device => device.platform === platformFilter);
    }

    setFilteredDevices(filtered);
  }, [devices, searchQuery, statusFilter, platformFilter]);

  const refreshDevices = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Device list refreshed');
    } catch (error) {
      toast.error('Failed to refresh devices');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30">Online</Badge>;
      case 'offline':
        return <Badge variant="secondary" className="bg-slate-gray/20 text-mist-gray">Offline</Badge>;
      case 'stale':
        return <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">Stale</Badge>;
    }
  };

  const getPlatformIcon = (platform: Device['platform']) => {
    switch (platform) {
      case 'windows':
        return <Monitor className="w-4 h-4 text-signal-blue" />;
      case 'macos':
        return <Laptop className="w-4 h-4 text-cloud-white" />;
      case 'linux':
        return <Server className="w-4 h-4 text-amber-warning" />;
    }
  };

  const getHealthColor = (score: number = 0) => {
    if (score >= 80) return 'text-iq-neon-green';
    if (score >= 60) return 'text-amber-warning';
    return 'text-crimson-danger';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const canManageAgents = userRole === 'owner' || userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-iq-neon-green font-space-grotesk">Software Management</h2>
          <p className="text-mist-gray">Install and manage BuboIQ software across your computers</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={refreshDevices}
            disabled={isRefreshing}
            className="border-slate-gray/50 hover:bg-slate-gray/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {canManageAgents && (
            <Button
              onClick={() => setIsInstallerOpen(true)}
              className="bubo-btn-neon-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Install Software
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface-dark/50 border-iq-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-iq-green/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-iq-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-iq-green">
                  {devices.filter(d => d.status === 'online').length}
                </p>
                <p className="text-sm text-mist-gray">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-dark/50 border-amber-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-warning">
                  {devices.filter(d => d.status === 'stale').length}
                </p>
                <p className="text-sm text-mist-gray">Stale</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-dark/50 border-slate-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-gray/20 rounded-lg flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-mist-gray" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mist-gray">
                  {devices.filter(d => d.status === 'offline').length}
                </p>
                <p className="text-sm text-mist-gray">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-dark/50 border-electric-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-electric-blue">
                  {Math.round(devices.reduce((acc, d) => acc + d.healthScore, 0) / devices.length) || 0}
                </p>
                <p className="text-sm text-mist-gray">Avg Health</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-surface-dark/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
                <Input
                  placeholder="Search devices by name, IP, owner, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-dark-midnight/50 border-slate-gray/50"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <Label className="text-xs text-mist-gray">Status</Label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-dark-midnight border border-slate-gray/50 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="stale">Stale</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-mist-gray">Platform</Label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value as any)}
                  className="px-3 py-2 bg-dark-midnight border border-slate-gray/50 rounded-lg text-sm"
                >
                  <option value="all">All Platforms</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="bg-surface-dark/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-gray/20">
                <TableHead>Computer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow 
                  key={device.id} 
                  className="border-slate-gray/20 hover:bg-slate-gray/5 cursor-pointer"
                  onClick={() => setSelectedDevice(device)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getPlatformIcon(device.platform)}
                      </div>
                      <div>
                        <p className="font-medium">{device.hostname}</p>
                        <p className="text-xs text-mist-gray">{device.ipAddress}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(device.status)}
                      {device.status === 'online' && (
                        <div className="w-2 h-2 bg-iq-green rounded-full animate-pulse" />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${getHealthColor(device.healthScore)}`}>
                        {device.healthScore}%
                      </div>
                      <div className="w-16 h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            device.healthScore >= 80 ? 'bg-iq-green' :
                            device.healthScore >= 60 ? 'bg-amber-warning' : 'bg-crimson-danger'
                          }`}
                          style={{ width: `${device.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <Cpu className="w-3 h-3 text-mist-gray" />
                        <span className="text-mist-gray">CPU:</span>
                        <span>{device.cpu.usage.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <MemoryStick className="w-3 h-3 text-mist-gray" />
                        <span className="text-mist-gray">RAM:</span>
                        <span>{device.memory.usage.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <HardDrive className="w-3 h-3 text-mist-gray" />
                        <span className="text-mist-gray">Disk:</span>
                        <span>{device.disk.usage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{formatLastSeen(device.lastSeen)}</p>
                      <p className="text-xs text-mist-gray">Up: {formatUptime(device.uptime)}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{device.owner}</p>
                      <p className="text-xs text-mist-gray">{device.location}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredDevices.length === 0 && (
        <Card className="bg-surface-dark/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-gray/20 rounded-full flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8 text-mist-gray" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Devices Found</h3>
            <p className="text-mist-gray mb-6">
              {searchQuery || statusFilter !== 'all' || platformFilter !== 'all'
                ? 'No devices match your current filters.'
                : 'Get started by installing the BuboIQ agent on your devices.'
              }
            </p>
            {canManageAgents && (
              <Button
                onClick={() => setIsInstallerOpen(true)}
                className="bubo-btn-neon-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Agent
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agent Installer Modal */}
      <AgentInstaller
        isOpen={isInstallerOpen}
        onClose={() => setIsInstallerOpen(false)}
        organizationId={organizationId}
        organizationName={organizationName}
      />

      {/* Device Detail Modal */}
      {selectedDevice && (
        <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
          <DialogContent className="max-w-4xl bg-dark-midnight border-slate-gray/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-iq-neon-green font-space-grotesk">
                {selectedDevice.hostname}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-surface-dark/50">
                  <CardHeader>
                    <CardTitle className="text-sm">System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Platform:</span>
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(selectedDevice.platform)}
                        <span className="capitalize">{selectedDevice.platform}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">OS Version:</span>
                      <span>{selectedDevice.osVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Agent Version:</span>
                      <span>{selectedDevice.agentVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">IP Address:</span>
                      <span className="font-mono text-sm">{selectedDevice.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">MAC Address:</span>
                      <span className="font-mono text-sm">{selectedDevice.macAddress}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-dark/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Hardware Specs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-mist-gray">CPU:</span>
                      <div className="text-right">
                        <p>{selectedDevice.cpu.model}</p>
                        <p className="text-xs text-mist-gray">{selectedDevice.cpu.cores} cores</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Memory:</span>
                      <span>{(selectedDevice.memory.total / 1024).toFixed(0)} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Storage:</span>
                      <span>{selectedDevice.disk.total} GB</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-surface-dark/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-mist-gray">Status:</span>
                      {getStatusBadge(selectedDevice.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Health Score:</span>
                      <span className={getHealthColor(selectedDevice.healthScore)}>
                        {selectedDevice.healthScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Last Seen:</span>
                      <span>{formatLastSeen(selectedDevice.lastSeen)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mist-gray">Uptime:</span>
                      <span>{formatUptime(selectedDevice.uptime)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-dark/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-mist-gray">CPU Usage</span>
                        <span>{selectedDevice.cpu.usage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-electric-blue transition-all"
                          style={{ width: `${selectedDevice.cpu.usage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-mist-gray">Memory Usage</span>
                        <span>{selectedDevice.memory.usage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-warning transition-all"
                          style={{ width: `${selectedDevice.memory.usage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-mist-gray">Disk Usage</span>
                        <span>{selectedDevice.disk.usage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-iq-green transition-all"
                          style={{ width: `${selectedDevice.disk.usage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {canManageAgents && (
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-slate-gray/50">
                      <Terminal className="w-4 h-4 mr-2" />
                      Run Command
                    </Button>
                    <Button variant="outline" className="flex-1 border-slate-gray/50">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}