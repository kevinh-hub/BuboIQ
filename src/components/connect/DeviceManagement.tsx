import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Server, 
  Laptop, 
  Smartphone, 
  Plus, 
  Settings, 
  Trash2, 
  Wifi, 
  WifiOff,
  Clock,
  Tag,
  MapPin,
  Building2,
  User,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { connectApi } from '../../utils/supabase/client';

interface Device {
  id: string;
  user_id: string;
  display_name: string;
  device_type: 'workstation' | 'server' | 'laptop' | 'mobile';
  hostname?: string;
  ip_address?: string;
  mac_address?: string;
  operating_system?: string;
  agent_version?: string;
  tags: string[];
  location?: string;
  department?: string;
  owner_email?: string;
  last_seen?: string;
  is_online: boolean;
  is_managed: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface DeviceManagementProps {
  user: any;
  userTier: 'basic' | 'pro';
  onUpgrade: () => void;
}

export const DeviceManagement: React.FC<DeviceManagementProps> = ({
  user,
  userTier,
  onUpgrade
}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [filterType, setFilterType] = useState<'all' | 'workstation' | 'server' | 'laptop' | 'mobile'>('all');

  // Add device form state
  const [newDevice, setNewDevice] = useState({
    display_name: '',
    device_type: 'workstation' as const,
    hostname: '',
    ip_address: '',
    operating_system: '',
    location: '',
    department: '',
    owner_email: '',
    tags: [] as string[],
    tagInput: ''
  });

  useEffect(() => {
    if (user && userTier === 'pro') {
      loadDevices();
    }
  }, [user, userTier]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await connectApi.getDevices();
      if (response?.devices) {
        setDevices(response.devices);
      }
    } catch (error: any) {
      console.error('Error loading devices:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async () => {
    try {
      const deviceData = {
        display_name: newDevice.display_name,
        device_type: newDevice.device_type,
        hostname: newDevice.hostname || undefined,
        ip_address: newDevice.ip_address || undefined,
        operating_system: newDevice.operating_system || undefined,
        location: newDevice.location || undefined,
        department: newDevice.department || undefined,
        owner_email: newDevice.owner_email || undefined,
        tags: newDevice.tags,
        metadata: {
          created_from: 'buboiq_dashboard',
          version: '1.0'
        }
      };

      const response = await connectApi.addDevice(deviceData);
      if (response?.device) {
        setDevices(prev => [response.device, ...prev]);
        setShowAddDevice(false);
        
        // Reset form
        setNewDevice({
          display_name: '',
          device_type: 'workstation',
          hostname: '',
          ip_address: '',
          operating_system: '',
          location: '',
          department: '',
          owner_email: '',
          tags: [],
          tagInput: ''
        });
      }
    } catch (error: any) {
      console.error('Error adding device:', error);
      setError(error.message);
    }
  };

  const deleteDevice = async (deviceId: string) => {
    try {
      await connectApi.deleteDevice(deviceId);
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-iq-neon-green' : 'text-mist-gray';
  };

  const addTag = () => {
    if (newDevice.tagInput.trim() && !newDevice.tags.includes(newDevice.tagInput.trim())) {
      setNewDevice(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewDevice(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Filter devices
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'online' && device.is_online) ||
                         (filterStatus === 'offline' && !device.is_online);
    
    const matchesType = filterType === 'all' || device.device_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Show upgrade guard for Basic users
  if (userTier === 'basic') {
    return (
      <div className="bubo-glass rounded-3xl p-8 text-center border border-iq-neon-green/20">
        <div className="w-20 h-20 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Monitor className="w-10 h-10 text-iq-neon-green" />
        </div>
        <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-4">
          Device Management • Pro Feature
        </h2>
        <p className="text-mist-gray mb-8 max-w-md mx-auto">
          Manage your entire device fleet from one dashboard. Add devices, monitor status, and access them instantly.
        </p>
        <Button onClick={onUpgrade} className="bubo-btn-neon-primary">
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-iq-neon-green animate-spin mx-auto mb-4" />
        <p className="text-mist-gray">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-space-grotesk text-3xl font-bold text-pure-white">
            Device Management
          </h1>
          <p className="text-mist-gray mt-2">
            Manage and monitor your connected devices
          </p>
        </div>
        
        <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
          <DialogTrigger asChild>
            <Button className="bubo-btn-neon-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-iq-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">{devices.length}</p>
                <p className="text-mist-gray text-sm">Total Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-iq-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {devices.filter(d => d.is_online).length}
                </p>
                <p className="text-mist-gray text-sm">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-mist-gray/20 rounded-xl flex items-center justify-center">
                <WifiOff className="w-6 h-6 text-mist-gray" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {devices.filter(d => !d.is_online).length}
                </p>
                <p className="text-mist-gray text-sm">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {devices.filter(d => d.is_managed).length}
                </p>
                <p className="text-mist-gray text-sm">Managed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bubo-glass border-iq-neon-green/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bubo-glass"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-32 bubo-glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-40 bubo-glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workstation">Workstations</SelectItem>
                <SelectItem value="server">Servers</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={loadDevices}
              variant="outline"
              className="bubo-btn-secondary"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      {error && (
        <div className="bubo-error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="bubo-glass border-iq-neon-green/20">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${getStatusColor(device.is_online)}`}>
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div>
                    <CardTitle className="text-pure-white text-lg">
                      {device.display_name}
                    </CardTitle>
                    <p className="text-mist-gray text-sm capitalize">
                      {device.device_type}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => deleteDevice(device.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Device
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-mist-gray text-sm">Status</span>
                  <Badge variant={device.is_online ? "default" : "secondary"}>
                    {device.is_online ? (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                </div>

                {/* Hostname */}
                {device.hostname && (
                  <div className="flex items-center justify-between">
                    <span className="text-mist-gray text-sm">Hostname</span>
                    <span className="text-pure-white text-sm font-mono">
                      {device.hostname}
                    </span>
                  </div>
                )}

                {/* Operating System */}
                {device.operating_system && (
                  <div className="flex items-center justify-between">
                    <span className="text-mist-gray text-sm">OS</span>
                    <span className="text-pure-white text-sm">
                      {device.operating_system}
                    </span>
                  </div>
                )}

                {/* Location */}
                {device.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-mist-gray" />
                    <span className="text-mist-gray text-sm">{device.location}</span>
                  </div>
                )}

                {/* Department */}
                {device.department && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-mist-gray" />
                    <span className="text-mist-gray text-sm">{device.department}</span>
                  </div>
                )}

                {/* Owner */}
                {device.owner_email && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-mist-gray" />
                    <span className="text-mist-gray text-sm">{device.owner_email}</span>
                  </div>
                )}

                {/* Tags */}
                {device.tags && device.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {device.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Last Seen */}
                {device.last_seen && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-iq-neon-green/10">
                    <Clock className="w-4 h-4 text-mist-gray" />
                    <span className="text-mist-gray text-xs">
                      Last seen {new Date(device.last_seen).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && !loading && (
        <div className="text-center py-12">
          <Monitor className="w-16 h-16 text-mist-gray mx-auto mb-4" />
          <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
            No Devices Found
          </h3>
          <p className="text-mist-gray mb-6">
            {devices.length === 0 
              ? "Add your first device to get started with remote access"
              : "No devices match your current filters"
            }
          </p>
          {devices.length === 0 && (
            <Button onClick={() => setShowAddDevice(true)} className="bubo-btn-neon-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add First Device
            </Button>
          )}
        </div>
      )}

      {/* Add Device Dialog */}
      <DialogContent className="bubo-glass border-iq-neon-green/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pure-white font-space-grotesk">
            Add New Device
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_name" className="text-pure-white">
                Device Name *
              </Label>
              <Input
                id="display_name"
                value={newDevice.display_name}
                onChange={(e) => setNewDevice(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="CORP-LAPTOP-001"
                className="bubo-glass mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="device_type" className="text-pure-white">
                Device Type *
              </Label>
              <Select 
                value={newDevice.device_type} 
                onValueChange={(value: any) => setNewDevice(prev => ({ ...prev, device_type: value }))}
              >
                <SelectTrigger className="bubo-glass mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workstation">Workstation</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="mobile">Mobile Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Network Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hostname" className="text-pure-white">
                Hostname
              </Label>
              <Input
                id="hostname"
                value={newDevice.hostname}
                onChange={(e) => setNewDevice(prev => ({ ...prev, hostname: e.target.value }))}
                placeholder="laptop001.company.com"
                className="bubo-glass mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="ip_address" className="text-pure-white">
                IP Address
              </Label>
              <Input
                id="ip_address"
                value={newDevice.ip_address}
                onChange={(e) => setNewDevice(prev => ({ ...prev, ip_address: e.target.value }))}
                placeholder="192.168.1.100"
                className="bubo-glass mt-2"
              />
            </div>
          </div>

          {/* System Info */}
          <div>
            <Label htmlFor="operating_system" className="text-pure-white">
              Operating System
            </Label>
            <Input
              id="operating_system"
              value={newDevice.operating_system}
              onChange={(e) => setNewDevice(prev => ({ ...prev, operating_system: e.target.value }))}
              placeholder="Windows 11 Pro"
              className="bubo-glass mt-2"
            />
          </div>

          {/* Location & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-pure-white">
                Location
              </Label>
              <Input
                id="location"
                value={newDevice.location}
                onChange={(e) => setNewDevice(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Office Floor 2, Desk 15"
                className="bubo-glass mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="department" className="text-pure-white">
                Department
              </Label>
              <Input
                id="department"
                value={newDevice.department}
                onChange={(e) => setNewDevice(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Engineering"
                className="bubo-glass mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="owner_email" className="text-pure-white">
              Owner Email
            </Label>
            <Input
              id="owner_email"
              type="email"
              value={newDevice.owner_email}
              onChange={(e) => setNewDevice(prev => ({ ...prev, owner_email: e.target.value }))}
              placeholder="john.doe@company.com"
              className="bubo-glass mt-2"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-pure-white">
              Tags
            </Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newDevice.tagInput}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, tagInput: e.target.value }))}
                  placeholder="Add tag..."
                  className="bubo-glass flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              {newDevice.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {newDevice.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-crimson-danger"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-iq-neon-green/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddDevice(false)}
              className="bubo-btn-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={addDevice}
              disabled={!newDevice.display_name}
              className="bubo-btn-neon-primary"
            >
              Add Device
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
};