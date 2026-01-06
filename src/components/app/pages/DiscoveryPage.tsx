import React, { useState, useEffect } from 'react';
import {
  Search,
  Wifi,
  Network,
  Key,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Zap,
  RefreshCw,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Activity,
  Settings,
  Shield,
  Database,
  Server,
  Layers,
  Target,
  Scan
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Progress } from '../../ui/progress';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Separator } from '../../ui/separator';
import { LoadingSpinner, ErrorState, EmptyState } from '../../SystemStates';

// Define locally to avoid circular dependency
type AppRoute = string;

interface DiscoveryPageProps {
  user: any;
  onNavigate: (route: AppRoute, options?: any) => void;
}

interface Subnet {
  id: string;
  cidr: string;
  name: string;
  location: string;
  last_scan: string;
  devices_found: number;
  scan_status: 'idle' | 'running' | 'completed' | 'failed';
  next_scan: string;
}

interface ScanProfile {
  id: string;
  name: string;
  type: 'ping' | 'nmap_light' | 'snmp' | 'wmi' | 'ssh' | 'mdns';
  description: string;
  parameters: Record<string, any>;
  is_active: boolean;
  last_used: string;
}

interface DiscoveryJob {
  id: string;
  name: string;
  subnet_id: string;
  profile_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  started_at?: string;
  completed_at?: string;
  devices_found: number;
  new_devices: number;
  errors: number;
}

interface NewFind {
  id: string;
  ip_address: string;
  mac_address?: string;
  hostname?: string;
  operating_system?: string;
  vendor?: string;
  ports?: number[];
  discovered_at: string;
  confidence: number;
  status: 'new' | 'merged' | 'ignored';
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('subnets');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [scanProfiles, setScanProfiles] = useState<ScanProfile[]>([]);
  const [discoveryJobs, setDiscoveryJobs] = useState<DiscoveryJob[]>([]);
  const [newFinds, setNewFinds] = useState<NewFind[]>([]);
  
  // UI states
  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(null);
  const [jobLogs, setJobLogs] = useState<Record<string, string[]>>({});
  const [activeJobs, setActiveJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo - replace with real API calls
      setSubnets([
        {
          id: 'subnet-1',
          cidr: '10.0.1.0/24',
          name: 'Headquarters Network',
          location: 'New York Office',
          last_scan: '2024-01-15T10:30:00Z',
          devices_found: 42,
          scan_status: 'completed',
          next_scan: '2024-01-16T10:30:00Z'
        },
        {
          id: 'subnet-2',
          cidr: '10.0.2.0/24',
          name: 'Branch Office Network',
          location: 'Chicago Office',
          last_scan: '2024-01-15T14:00:00Z',
          devices_found: 18,
          scan_status: 'idle',
          next_scan: '2024-01-16T14:00:00Z'
        },
        {
          id: 'subnet-3',
          cidr: '192.168.1.0/24',
          name: 'Guest Network',
          location: 'All Locations',
          last_scan: '2024-01-14T09:00:00Z',
          devices_found: 7,
          scan_status: 'failed',
          next_scan: '2024-01-16T09:00:00Z'
        }
      ]);
      
      setScanProfiles([
        {
          id: 'profile-1',
          name: 'Quick Ping Sweep',
          type: 'ping',
          description: 'Fast ping-based discovery for basic connectivity',
          parameters: { timeout: 1000, threads: 50 },
          is_active: true,
          last_used: '2024-01-15T10:30:00Z'
        },
        {
          id: 'profile-2',
          name: 'Nmap Light Scan',
          type: 'nmap_light',
          description: 'OS detection and port scanning (top 100 ports)',
          parameters: { ports: 'top-100', os_detection: true },
          is_active: true,
          last_used: '2024-01-14T16:20:00Z'
        },
        {
          id: 'profile-3',
          name: 'SNMP Discovery',
          type: 'snmp',
          description: 'SNMP v2/v3 device information gathering',
          parameters: { version: 'v2c', community: 'public' },
          is_active: false,
          last_used: '2024-01-12T11:45:00Z'
        }
      ]);
      
      setDiscoveryJobs([
        {
          id: 'job-1',
          name: 'Headquarters Scan',
          subnet_id: 'subnet-1',
          profile_id: 'profile-1',
          status: 'completed',
          progress: 100,
          started_at: '2024-01-15T10:30:00Z',
          completed_at: '2024-01-15T10:33:45Z',
          devices_found: 42,
          new_devices: 3,
          errors: 0
        },
        {
          id: 'job-2',
          name: 'Branch Office Deep Scan',
          subnet_id: 'subnet-2',
          profile_id: 'profile-2',
          status: 'running',
          progress: 67,
          started_at: '2024-01-15T15:00:00Z',
          devices_found: 15,
          new_devices: 2,
          errors: 1
        }
      ]);
      
      setNewFinds([
        {
          id: 'find-1',
          ip_address: '10.0.1.151',
          mac_address: '00:1B:44:11:3A:B7',
          hostname: 'WIN-DESKTOP-NEW',
          operating_system: 'Windows 11',
          vendor: 'Dell Inc.',
          ports: [22, 80, 443, 3389],
          discovered_at: '2024-01-15T10:32:15Z',
          confidence: 95,
          status: 'new'
        },
        {
          id: 'find-2',
          ip_address: '10.0.1.200',
          mac_address: 'AC:DE:48:00:11:22',
          hostname: 'PRINTER-HP-COLOR',
          operating_system: 'HP Printer',
          vendor: 'Hewlett Packard',
          ports: [80, 443, 631, 9100],
          discovered_at: '2024-01-15T10:31:42Z',
          confidence: 88,
          status: 'new'
        },
        {
          id: 'find-3',
          ip_address: '10.0.2.88',
          mac_address: 'B8:27:EB:A4:C2:D1',
          hostname: 'raspberrypi-iot',
          operating_system: 'Linux (Raspberry Pi)',
          vendor: 'Raspberry Pi Foundation',
          ports: [22, 80, 1883],
          discovered_at: '2024-01-15T15:12:30Z',
          confidence: 92,
          status: 'new'
        }
      ]);
      
    } catch (error) {
      console.error('Failed to load discovery data:', error);
      setError('Failed to load discovery data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartScan = async (subnetId: string, profileId: string) => {
    try {
      // Create new discovery job
      const jobId = `job-${Date.now()}`;
      const newJob: DiscoveryJob = {
        id: jobId,
        name: `Scan ${subnets.find(s => s.id === subnetId)?.name}`,
        subnet_id: subnetId,
        profile_id: profileId,
        status: 'running',
        progress: 0,
        started_at: new Date().toISOString(),
        devices_found: 0,
        new_devices: 0,
        errors: 0
      };
      
      setDiscoveryJobs(prev => [newJob, ...prev]);
      setActiveJobs(prev => new Set([...prev, jobId]));
      
      // Simulate job progress
      simulateJobProgress(jobId);
      
    } catch (error) {
      console.error('Failed to start scan:', error);
    }
  };

  const simulateJobProgress = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete the job
        setDiscoveryJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                status: 'completed', 
                progress: 100, 
                completed_at: new Date().toISOString(),
                devices_found: Math.floor(Math.random() * 20) + 10,
                new_devices: Math.floor(Math.random() * 5) + 1
              }
            : job
        ));
        
        setActiveJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        setDiscoveryJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, progress, devices_found: Math.floor(progress / 10) } : job
        ));
      }
    }, 1000);
  };

  const handleFindAction = async (findId: string, action: 'merge' | 'ignore') => {
    try {
      setNewFinds(prev => prev.map(find => 
        find.id === findId ? { ...find, status: action === 'merge' ? 'merged' : 'ignored' } : find
      ));
      
      if (action === 'merge') {
        // TODO: Create new device from find
        console.log('Creating device from find:', findId);
      }
    } catch (error) {
      console.error('Failed to process find:', error);
    }
  };

  const getSubnetStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
      case 'completed': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'failed': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      default: return 'bg-slate-gray/20 text-mist-gray border-slate-gray/30';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-electric-blue/20 text-electric-blue';
      case 'completed': return 'bg-iq-neon-green/20 text-iq-neon-green';
      case 'failed': return 'bg-crimson-danger/20 text-crimson-danger';
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
        <LoadingSpinner size="lg" message="Loading discovery..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Discovery Error"
          message={error}
          onRetry={loadDiscoveryData}
          type="server"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">
            Find Computers
          </h1>
          <p className="text-mist-gray">
            Automatically discover computers on your network • Pro feature
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={loadDiscoveryData}
            className="text-mist-gray hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button className="bubo-btn-secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import Networks
          </Button>
          
          <Button className="bubo-btn-neon-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Network
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{subnets.length}</div>
              <div className="text-xs text-mist-gray">Networks</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {subnets.reduce((sum, s) => sum + s.devices_found, 0)}
              </div>
              <div className="text-xs text-mist-gray">Computers Found</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {discoveryJobs.filter(j => j.status === 'running').length}
              </div>
              <div className="text-xs text-mist-gray">Running Scans</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-prediction-purple/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-prediction-purple" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {newFinds.filter(f => f.status === 'new').length}
              </div>
              <div className="text-xs text-mist-gray">New Computers</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-nocturne-indigo/50">
          <TabsTrigger value="subnets" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            <Network className="w-4 h-4 mr-2" />
            Networks
          </TabsTrigger>
          <TabsTrigger value="profiles" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            <Settings className="w-4 h-4 mr-2" />
            Scan Methods
          </TabsTrigger>
          <TabsTrigger value="credentials" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            <Key className="w-4 h-4 mr-2" />
            Login Info
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            <Activity className="w-4 h-4 mr-2" />
            Scans
          </TabsTrigger>
          <TabsTrigger value="finds" className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green">
            <Search className="w-4 h-4 mr-2" />
            New Computers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subnets" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {subnets.map((subnet) => (
              <Card key={subnet.id} className="bubo-glass p-6 hover:bubo-glow-blue transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-1">
                      {subnet.name}
                    </h3>
                    <code className="text-electric-blue bg-nocturne-indigo/50 px-2 py-1 rounded text-sm">
                      {subnet.cidr}
                    </code>
                  </div>
                  <Badge className={getSubnetStatusColor(subnet.scan_status)}>
                    {subnet.scan_status}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-mist-gray" />
                    <span className="text-sm text-mist-gray">{subnet.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-iq-neon-green" />
                    <span className="text-sm text-white">{subnet.devices_found} computers found</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-mist-gray" />
                    <span className="text-sm text-mist-gray">
                      Last scan: {getTimeAgo(subnet.last_scan)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className="bubo-btn-neon-primary flex-1"
                    onClick={() => handleStartScan(subnet.id, scanProfiles[0]?.id)}
                    disabled={subnet.scan_status === 'running'}
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    {subnet.scan_status === 'running' ? 'Searching...' : 'Find Computers'}
                  </Button>
                  
                  <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {scanProfiles.map((profile) => (
              <Card key={profile.id} className="bubo-glass p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-1">
                      {profile.name}
                    </h3>
                    <Badge className={`${
                      profile.type === 'ping' ? 'bg-iq-neon-green/20 text-iq-neon-green' :
                      profile.type === 'nmap_light' ? 'bg-electric-blue/20 text-electric-blue' :
                      profile.type === 'snmp' ? 'bg-amber-warning/20 text-amber-warning' :
                      'bg-prediction-purple/20 text-prediction-purple'
                    }`}>
                      {profile.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.is_active && (
                      <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
                    )}
                    <span className={`text-sm ${profile.is_active ? 'text-iq-neon-green' : 'text-mist-gray'}`}>
                      {profile.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-mist-gray mb-4">{profile.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-mist-gray">Parameters:</div>
                  <div className="bg-nocturne-indigo/50 p-3 rounded-lg">
                    <code className="text-xs text-cyan-accent">
                      {JSON.stringify(profile.parameters, null, 2)}
                    </code>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mist-gray">
                    Last used: {getTimeAgo(profile.last_used)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-mist-gray hover:text-crimson-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="bubo-glass p-6 text-center">
            <Database className="w-12 h-12 text-mist-gray mx-auto mb-4" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
              Create Custom Profile
            </h3>
            <p className="text-mist-gray mb-4">
              Define custom scan parameters for your specific discovery needs
            </p>
            <Button className="bubo-btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              New Scan Profile
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Credentials Vault
              </h3>
              <Button className="bubo-btn-neon-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-iq-neon-green" />
                  <div>
                    <div className="font-medium text-white">Windows Domain Admin</div>
                    <div className="text-sm text-mist-gray">WMI/SMB access for Windows devices</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Active</Badge>
                  <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Key className="w-8 h-8 text-electric-blue" />
                  <div>
                    <div className="font-medium text-white">SSH Key Pair</div>
                    <div className="text-sm text-mist-gray">Linux/Unix device access</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Active</Badge>
                  <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Network className="w-8 h-8 text-amber-warning" />
                  <div>
                    <div className="font-medium text-white">SNMP v3 Community</div>
                    <div className="text-sm text-mist-gray">Network device management</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-slate-gray/20 text-mist-gray">Inactive</Badge>
                  <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-warning/10 border border-amber-warning/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-warning mt-0.5" />
                <div>
                  <div className="font-medium text-amber-warning mb-1">Security Notice</div>
                  <p className="text-sm text-mist-gray">
                    All credentials are encrypted at rest using AES-256 encryption. 
                    Credentials are never logged or transmitted in plain text.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="space-y-4">
            {discoveryJobs.map((job) => (
              <Card key={job.id} className="bubo-glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-electric-blue" />
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                        {job.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-mist-gray">
                        <span>{subnets.find(s => s.id === job.subnet_id)?.cidr}</span>
                        <span>•</span>
                        <span>{scanProfiles.find(p => p.id === job.profile_id)?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getJobStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    {job.status === 'running' && (
                      <Button size="sm" variant="ghost" className="text-amber-warning hover:bg-amber-warning/10">
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-mist-gray hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {job.status === 'running' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-mist-gray">Progress</span>
                      <span className="text-sm text-white">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="w-full h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">{job.devices_found}</div>
                    <div className="text-xs text-mist-gray">Devices Found</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-iq-neon-green">{job.new_devices}</div>
                    <div className="text-xs text-mist-gray">New Devices</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-crimson-danger">{job.errors}</div>
                    <div className="text-xs text-mist-gray">Errors</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-mist-gray">
                      {job.started_at ? getTimeAgo(job.started_at) : 'N/A'}
                    </div>
                    <div className="text-xs text-mist-gray">Started</div>
                  </div>
                </div>
                
                {job.status === 'running' && (
                  <div className="mt-4 p-3 bg-nocturne-indigo/50 rounded-lg">
                    <div className="text-xs text-mist-gray mb-2">Live Output:</div>
                    <div className="font-mono text-xs text-cyan-accent space-y-1">
                      <div>Scanning subnet {subnets.find(s => s.id === job.subnet_id)?.cidr}...</div>
                      <div>Discovered device at 10.0.1.{Math.floor(Math.random() * 255)}</div>
                      <div>Running port scan on active hosts...</div>
                      <div className="text-iq-neon-green">Progress: {job.progress}% complete</div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finds" className="space-y-6">
          <div className="space-y-4">
            {newFinds.filter(find => find.status === 'new').map((find) => (
              <Card key={find.id} className="bubo-glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                      <Server className="w-6 h-6 text-iq-neon-green" />
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                        {find.hostname || 'Unknown Device'}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-mist-gray">
                        <code className="bg-nocturne-indigo/50 px-2 py-1 rounded text-electric-blue">
                          {find.ip_address}
                        </code>
                        {find.mac_address && (
                          <>
                            <span>•</span>
                            <code className="bg-nocturne-indigo/50 px-2 py-1 rounded text-cyan-accent">
                              {find.mac_address}
                            </code>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      {find.confidence}% confidence
                    </Badge>
                    <Badge variant="outline" className="text-amber-warning border-amber-warning/30">
                      New
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-mist-gray mb-1">Operating System</div>
                    <div className="text-white">{find.operating_system || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-mist-gray mb-1">Vendor</div>
                    <div className="text-white">{find.vendor || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-mist-gray mb-1">Open Ports</div>
                    <div className="text-white">
                      {find.ports ? find.ports.slice(0, 3).join(', ') + (find.ports.length > 3 ? '...' : '') : 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-mist-gray mb-1">Discovered</div>
                    <div className="text-white">{getTimeAgo(find.discovered_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mist-gray">
                    Add this device to your inventory?
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-mist-gray hover:text-white"
                      onClick={() => handleFindAction(find.id, 'ignore')}
                    >
                      Ignore
                    </Button>
                    <Button 
                      size="sm" 
                      className="bubo-btn-neon-primary"
                      onClick={() => handleFindAction(find.id, 'merge')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Asset
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {newFinds.filter(find => find.status === 'new').length === 0 && (
              <Card className="bubo-glass p-12 text-center">
                <Search className="w-16 h-16 text-mist-gray mx-auto mb-4" />
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                  No New Discoveries
                </h3>
                <p className="text-mist-gray mb-6">
                  Run a discovery scan to find new devices on your network
                </p>
                <Button 
                  className="bubo-btn-neon-primary"
                  onClick={() => setActiveTab('subnets')}
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Start Discovery
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};