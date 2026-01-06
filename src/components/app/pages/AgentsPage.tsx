import React, { useState, useEffect } from 'react';
import {
  Download,
  Plus,
  RefreshCw,
  Trash2,
  Monitor,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Terminal,
  Copy,
  Check,
  Play,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { LoadingSpinner, ErrorState, EmptyState } from '../../SystemStates';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';

interface Agent {
  id: string;
  hostname: string;
  platform: 'windows' | 'macos' | 'linux';
  platform_version: string;
  agent_version: string;
  org_id: string;
  ip_address?: string;
  mac_address?: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'offline' | 'error';
  registered_at: string;
  last_checkin: string;
  metadata?: Record<string, any>;
}

interface AgentsPageProps {
  user: any;
  onNavigate: (route: string, options?: any) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ user, onNavigate }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [registrationKey, setRegistrationKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      console.log(`[AgentsPage] GET /agents - Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[AgentsPage] Failed to load agents:', errorData);
        throw new Error(errorData.error || 'Failed to load agents');
      }

      const data = await response.json();
      console.log('[AgentsPage] Loaded agents:', data.agents?.length || 0);
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAgent = async (platform: 'windows' | 'macos' | 'linux') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents/download/${platform}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate download link');
      }

      const data = await response.json();
      
      setDownloadUrl(data.download_url);
      setRegistrationKey(data.config.registration_key);
      setSelectedPlatform(platform);
      setShowDownloadModal(true);

      toast.success('Download link generated', {
        description: `Ready to install ${platform} agent`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate download link');
    }
  };

  const handleCreateTestAgent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const testData = {
      hostname: formData.get('hostname') as string,
      platform: formData.get('platform') as string,
      platform_version: formData.get('platform_version') as string,
      ip_address: formData.get('ip_address') as string,
      mac_address: formData.get('mac_address') as string,
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents/test`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create test agent');
      }

      const data = await response.json();
      
      toast.success('Test agent created', {
        description: `Agent ${data.agent.hostname} is now active`
      });

      setShowTestModal(false);
      loadAgents();
    } catch (error) {
      console.error('Test agent creation error:', error);
      toast.error('Failed to create test agent');
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents/${agentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      toast.success('Agent deleted');
      loadAgents();
    } catch (error) {
      console.error('Delete agent error:', error);
      toast.error('Failed to delete agent');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-iq-neon-green/20 text-iq-neon-green';
      case 'inactive': return 'bg-amber-warning/20 text-amber-warning';
      case 'offline': return 'bg-slate-gray/20 text-mist-gray';
      case 'error': return 'bg-crimson-danger/20 text-crimson-danger';
      default: return 'bg-slate-gray/20 text-mist-gray';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Return Monitor for all platforms for now
    return Monitor;
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

  const isAgentOnline = (agent: Agent) => {
    const lastCheckin = new Date(agent.last_checkin);
    const now = new Date();
    const diffMins = (now.getTime() - lastCheckin.getTime()) / (1000 * 60);
    return diffMins < 10; // Online if checked in within last 10 minutes
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchQuery === '' ||
      agent.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.ip_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'online' && isAgentOnline(agent)) ||
      (filterStatus === 'offline' && !isAgentOnline(agent));
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" message="Loading agents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Agents Error"
          message={error}
          onRetry={loadAgents}
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
            BuboIQ Agents
          </h1>
          <p className="text-mist-gray">
            Deploy and manage agents on computers • {agents.length} total agents
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={loadAgents}
            className="text-mist-gray hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowTestModal(true)}
            className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
          >
            <Terminal className="w-4 h-4 mr-2" />
            Create Test Agent
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bubo-btn-neon-primary">
                <Download className="w-4 h-4 mr-2" />
                Download Agent
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadAgent('windows')}>
                <Monitor className="w-4 h-4 mr-2" />
                Windows Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadAgent('macos')}>
                <Monitor className="w-4 h-4 mr-2" />
                macOS Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadAgent('linux')}>
                <Monitor className="w-4 h-4 mr-2" />
                Linux Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                {agents.filter(a => isAgentOnline(a)).length}
              </div>
              <div className="text-xs text-mist-gray">Online</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-gray/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-slate-gray" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {agents.filter(a => !isAgentOnline(a)).length}
              </div>
              <div className="text-xs text-mist-gray">Offline</div>
            </div>
          </div>
        </Card>

        <Card className="bubo-glass p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-electric-blue" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {agents.filter(a => a.status === 'active').length}
              </div>
              <div className="text-xs text-mist-gray">Active</div>
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
                {agents.filter(a => a.capabilities?.includes('posture')).length}
              </div>
              <div className="text-xs text-mist-gray">With Posture</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bubo-glass p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search agents by hostname, IP, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-nocturne-indigo/30 border-slate-gray/30"
            />
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
          </div>
        </div>
      </Card>

      {/* Agents Table */}
      <Card className="bubo-glass">
        {filteredAgents.length === 0 ? (
          <EmptyState
            icon={Monitor}
            title="No agents deployed"
            description="Download and install agents on your computers to start monitoring"
            actions={[
              {
                label: "Download Agent",
                onClick: () => handleDownloadAgent('windows'),
                primary: true
              },
              {
                label: "Create Test Agent",
                onClick: () => setShowTestModal(true)
              }
            ]}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-gray/30">
                <TableHead className="text-mist-gray">Status</TableHead>
                <TableHead className="text-mist-gray">Hostname</TableHead>
                <TableHead className="text-mist-gray">Platform</TableHead>
                <TableHead className="text-mist-gray">Version</TableHead>
                <TableHead className="text-mist-gray">IP Address</TableHead>
                <TableHead className="text-mist-gray">Capabilities</TableHead>
                <TableHead className="text-mist-gray">Last Check-in</TableHead>
                <TableHead className="text-mist-gray w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => {
                const PlatformIcon = getPlatformIcon(agent.platform);
                const online = isAgentOnline(agent);
                
                return (
                  <TableRow
                    key={agent.id}
                    className="border-slate-gray/30 hover:bg-nocturne-indigo/30"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          online ? 'bg-iq-neon-green animate-pulse' : 'bg-slate-gray'
                        }`} />
                        <Badge className={getStatusColor(online ? 'active' : 'offline')}>
                          {online ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{agent.hostname}</div>
                        <div className="text-xs text-mist-gray font-mono">{agent.id.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <PlatformIcon className="w-4 h-4 text-electric-blue" />
                        <span className="text-white capitalize">{agent.platform}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="text-white">{agent.agent_version}</div>
                        <div className="text-xs text-mist-gray">{agent.platform_version}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <code className="text-xs bg-nocturne-indigo/50 px-2 py-1 rounded text-electric-blue">
                        {agent.ip_address || 'N/A'}
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities?.map((cap) => (
                          <Badge
                            key={cap}
                            variant="outline"
                            className="text-xs border-electric-blue/30 text-electric-blue"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-mist-gray" />
                        <span className="text-sm text-mist-gray">
                          {getTimeAgo(agent.last_checkin)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="w-4 h-4 mr-2" />
                            View Metrics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="text-crimson-danger"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Agent
                          </DropdownMenuItem>
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

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="sm:max-w-2xl bubo-glass">
          <DialogHeader>
            <DialogTitle className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Download BuboIQ Agent - {selectedPlatform}
            </DialogTitle>
            <DialogDescription className="text-mist-gray">
              Install the agent on your computers to enable monitoring and management
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-nocturne-indigo/50 border border-slate-gray/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white">Registration Key</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(registrationKey)}
                  className="text-electric-blue hover:bg-electric-blue/10"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <code className="text-sm text-iq-neon-green break-all">
                {registrationKey}
              </code>
            </div>

            <Tabs defaultValue="windows" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="windows">Windows</TabsTrigger>
                <TabsTrigger value="macos">macOS</TabsTrigger>
                <TabsTrigger value="linux">Linux</TabsTrigger>
              </TabsList>
              
              <TabsContent value="windows" className="space-y-4">
                <div className="p-4 bg-nocturne-indigo/30 rounded-lg">
                  <p className="text-white mb-2">Installation Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-mist-gray text-sm">
                    <li>Download the installer using the button below</li>
                    <li>Run the installer as Administrator</li>
                    <li>The agent will automatically register using the key above</li>
                    <li>Verify the agent appears in the dashboard</li>
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="macos" className="space-y-4">
                <div className="p-4 bg-nocturne-indigo/30 rounded-lg">
                  <p className="text-white mb-2">Installation Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-mist-gray text-sm">
                    <li>Download the .pkg installer</li>
                    <li>Double-click the file and follow the installer</li>
                    <li>Grant necessary permissions when prompted</li>
                    <li>The agent will start automatically</li>
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="linux" className="space-y-4">
                <div className="p-4 bg-nocturne-indigo/30 rounded-lg">
                  <p className="text-white mb-2">Installation Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-mist-gray text-sm">
                    <li>Download the .deb package</li>
                    <li>Run: <code className="bg-dark-midnight px-2 py-1 rounded text-iq-neon-green">sudo dpkg -i buboiq-agent-linux-amd64.deb</code></li>
                    <li>Start the service: <code className="bg-dark-midnight px-2 py-1 rounded text-iq-neon-green">sudo systemctl start buboiq-agent</code></li>
                    <li>Enable auto-start: <code className="bg-dark-midnight px-2 py-1 rounded text-iq-neon-green">sudo systemctl enable buboiq-agent</code></li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDownloadModal(false)}
              className="border-slate-gray/30"
            >
              Close
            </Button>
            <Button
              className="bubo-btn-neon-primary"
              onClick={() => window.open(downloadUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Installer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Agent Modal */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="sm:max-w-md bubo-glass">
          <DialogHeader>
            <DialogTitle className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Create Test Agent
            </DialogTitle>
            <DialogDescription className="text-mist-gray">
              Create a simulated agent for testing purposes
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateTestAgent} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Hostname</Label>
              <Input
                name="hostname"
                placeholder="test-workstation-01"
                required
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Platform</Label>
              <Select name="platform" defaultValue="windows">
                <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="linux">Linux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Platform Version</Label>
              <Input
                name="platform_version"
                placeholder="Windows 11 Pro"
                defaultValue="Windows 11 Pro"
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">IP Address</Label>
              <Input
                name="ip_address"
                placeholder="192.168.1.100"
                defaultValue="192.168.1.100"
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">MAC Address</Label>
              <Input
                name="mac_address"
                placeholder="00:1B:44:11:3A:B7"
                defaultValue="00:1B:44:11:3A:B7"
                className="bg-nocturne-indigo/30 border-slate-gray/30"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTestModal(false)}
                className="border-slate-gray/30"
              >
                Cancel
              </Button>
              <Button type="submit" className="bubo-btn-neon-primary">
                <Play className="w-4 h-4 mr-2" />
                Create Test Agent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};