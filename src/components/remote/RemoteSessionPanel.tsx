import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { remoteService, type RemoteSession, type SessionOptions } from '../../utils/remote-service';
import { toast } from 'sonner';
import { 
  Play, 
  Clock, 
  Monitor, 
  User, 
  Video, 
  FileText, 
  Activity,
  Shield,
  Eye,
  Download,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface RemoteSessionDisplay {
  id: string;
  started: string;
  provider: string;
  technicians: string[];
  duration: string;
  recording?: string;
  artifacts: number;
  outcome: 'resolved' | 'escalated' | 'in-progress';
}

interface TicketMeta {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  sla: string;
  device?: {
    hostname: string;
    assetId: string;
    status: 'online' | 'offline';
  };
}

const RemoteSessionPanel: React.FC = () => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [sessionMode, setSessionMode] = useState<'known' | 'adhoc'>('known');
  const [selectedProvider, setSelectedProvider] = useState('splashtop');
  const [providers, setProviders] = useState<any[]>([]);
  const [sessions, setSessions] = useState<RemoteSessionDisplay[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [options, setOptions] = useState<SessionOptions>({
    consent: true,
    mask: true,
    record: true,
    watermark: true
  });

  useEffect(() => {
    loadProviders();
    loadSessions();
  }, []);

  const loadProviders = async () => {
    try {
      const remoteProviders = await remoteService.getProviders();
      setProviders(remoteProviders.filter(p => p.status === 'connected'));
      
      // Set first connected provider as default
      const connectedProvider = remoteProviders.find(p => p.status === 'connected');
      if (connectedProvider) {
        setSelectedProvider(connectedProvider.id);
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      // Use mock data for demo
      const mockProviders = [
        { id: 'splashtop', name: 'Splashtop', status: 'connected' },
        { id: 'screenconnect', name: 'ScreenConnect', status: 'connected' },
        { id: 'beyondtrust', name: 'BeyondTrust', status: 'disconnected' }
      ];
      setProviders(mockProviders.filter(p => p.status === 'connected'));
    }
  };

  const loadSessions = async () => {
    // For demo purposes, using mock sessions
    // In production, this would fetch from API based on ticket ID
    setSessions([
      {
        id: 'RW-9825',
        started: '2024-01-15 14:32',
        provider: 'Splashtop',
        technicians: ['Kevin H.', 'Sarah M.'],
        duration: '23m 45s',
        recording: 'session-9825.mp4',
        artifacts: 4,
        outcome: 'resolved'
      },
      {
        id: 'RW-9824',
        started: '2024-01-15 09:15',
        provider: 'ScreenConnect',
        technicians: ['Mike R.'],
        duration: '12m 18s',
        artifacts: 2,
        outcome: 'escalated'
      }
    ]);
  };

  const ticket: TicketMeta = {
    id: '4321',
    priority: 'high',
    sla: '2h 15m remaining',
    device: {
      hostname: 'WS-JENNIFER-PC',
      assetId: 'AST-001287',
      status: 'online'
    }
  };

  const handleStartSession = async () => {
    if (!selectedProvider) {
      toast.error('Please select a remote provider');
      return;
    }

    setIsStarting(true);

    try {
      const sessionData = {
        ticketId: ticket.id,
        assetId: sessionMode === 'known' ? ticket.device?.assetId : undefined,
        mode: sessionMode,
        requester: {
          id: 'current-user-id', // This would come from auth context
          email: 'technician@buboiq.com',
          name: 'Current Technician'
        },
        options
      };

      const result = await remoteService.startSession(selectedProvider, sessionData);

      if (result.success) {
        toast.success('Remote session started successfully!');
        setIsStartModalOpen(false);
        
        // In a real app, you might navigate to the session or show session details
        console.log('Session started:', result);
        
        // Optionally start polling for session updates
        remoteService.startSessionPolling(result.sessionId);
        
        // Refresh session list
        await loadSessions();
      } else {
        toast.error('Failed to start remote session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error(`Failed to start session: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-crimson-danger border-crimson-danger/30 bg-crimson-danger/10';
      case 'high': return 'text-amber-warning border-amber-warning/30 bg-amber-warning/10';
      case 'medium': return 'text-cyan-accent border-cyan-accent/30 bg-cyan-accent/10';
      default: return 'text-mist-gray border-mist-gray/30 bg-mist-gray/10';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'resolved': return 'text-iq-green border-iq-green/30 bg-iq-green/10';
      case 'escalated': return 'text-amber-warning border-amber-warning/30 bg-amber-warning/10';
      default: return 'text-cyan-accent border-cyan-accent/30 bg-cyan-accent/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card className="bubo-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
              Ticket #{ticket.id}
            </h2>
            <Badge className={getPriorityColor(ticket.priority)}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {ticket.priority.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2 text-mist-gray">
              <Clock className="w-4 h-4" />
              <span className="text-sm">SLA: {ticket.sla}</span>
            </div>
          </div>

          <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
            <DialogTrigger asChild>
              <Button className="bubo-btn-neon-primary">
                <Play className="w-4 h-4 mr-2" />
                Start Remote
              </Button>
            </DialogTrigger>

            <DialogContent className="bubo-glass border-slate-gray/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-pure-white font-['Space_Grotesk']">
                  Start Remote Session
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <Tabs value={sessionMode} onValueChange={(v) => setSessionMode(v as 'known' | 'adhoc')}>
                  <TabsList className="grid w-full grid-cols-2 bg-surface-dark/50">
                    <TabsTrigger value="known" className="data-[state=active]:bg-iq-neon-green/20">
                      Known Device
                    </TabsTrigger>
                    <TabsTrigger value="adhoc" className="data-[state=active]:bg-iq-neon-green/20">
                      Ad-hoc Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="known" className="space-y-4">
                    <div>
                      <Label htmlFor="device" className="text-cloud-white">Target Device</Label>
                      <Select defaultValue={ticket.device?.assetId}>
                        <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ticket.device?.assetId || ''}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                ticket.device?.status === 'online' ? 'bg-iq-green' : 'bg-mist-gray'
                              }`} />
                              {ticket.device?.hostname} ({ticket.device?.assetId})
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="adhoc" className="space-y-4">
                    <div>
                      <Label htmlFor="oneTimeCode" className="text-cloud-white">
                        One-time Access Code
                      </Label>
                      <Input
                        id="oneTimeCode"
                        placeholder="Generated code will appear here..."
                        className="bg-surface-dark/50 border-slate-gray/30 text-pure-white font-jetbrains-mono"
                        value="RT-8394-XK72"
                        readOnly
                      />
                      <p className="text-xs text-mist-gray mt-1">
                        Share this code with the end user to establish connection
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="provider" className="text-cloud-white">Remote Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id} disabled={provider.status !== 'connected'}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              provider.status === 'connected' ? 'bg-iq-green' : 'bg-mist-gray'
                            }`} />
                            {provider.name}
                            {provider.status !== 'connected' && <span className="text-mist-gray">(Disconnected)</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white">Session Options</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                      <div>
                        <Label className="text-cloud-white text-sm">Request Consent</Label>
                        <p className="text-xs text-mist-gray">End user approval required</p>
                      </div>
                      <Switch 
                        checked={options.consent}
                        onCheckedChange={(checked) => setOptions({...options, consent: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                      <div>
                        <Label className="text-cloud-white text-sm">Mask Sensitive</Label>
                        <p className="text-xs text-mist-gray">Hide sensitive windows</p>
                      </div>
                      <Switch 
                        checked={options.mask}
                        onCheckedChange={(checked) => setOptions({...options, mask: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                      <div>
                        <Label className="text-cloud-white text-sm">Record Session</Label>
                        <p className="text-xs text-mist-gray">Required by policy</p>
                      </div>
                      <Switch 
                        checked={options.record}
                        disabled
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                      <div>
                        <Label className="text-cloud-white text-sm">Watermark</Label>
                        <p className="text-xs text-mist-gray">Tenant + timestamp</p>
                      </div>
                      <Switch 
                        checked={options.watermark}
                        onCheckedChange={(checked) => setOptions({...options, watermark: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="bubo-btn-neon-primary w-full"
                  onClick={handleStartSession}
                  disabled={isStarting || providers.length === 0}
                >
                  {isStarting ? (
                    <div className="w-4 h-4 border-2 border-surface-dark border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isStarting ? 'Starting Session...' : 'Start Session'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {ticket.device && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-iq-neon-green" />
              <span className="text-cloud-white">{ticket.device.hostname}</span>
              <Badge className="bg-slate-gray/20 text-mist-gray border-slate-gray/30">
                {ticket.device.assetId}
              </Badge>
            </div>
            <div className={`flex items-center gap-1 ${
              ticket.device.status === 'online' ? 'text-iq-green' : 'text-mist-gray'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                ticket.device.status === 'online' ? 'bg-iq-green' : 'bg-mist-gray'
              }`} />
              {ticket.device.status}
            </div>
          </div>
        )}
      </Card>

      {/* Session History */}
      <Card className="bubo-glass p-6">
        <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-iq-neon-green" />
          Session History
        </h3>

        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-jetbrains-mono text-sm text-iq-neon-green">
                      {session.id}
                    </div>
                    <div className="text-xs text-mist-gray">
                      {session.started} • {session.duration}
                    </div>
                  </div>
                  
                  <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                    {session.provider}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-mist-gray" />
                    <span className="text-xs text-cloud-white">
                      {session.technicians.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getOutcomeColor(session.outcome)}>
                    {session.outcome}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-xs text-mist-gray">
                    {session.recording && (
                      <div className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Recording</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{session.artifacts} artifacts</span>
                    </div>
                  </div>

                  <Button size="sm" className="bubo-btn-ghost">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Monitor className="w-12 h-12 text-mist-gray mx-auto mb-3 opacity-50" />
            <p className="text-mist-gray">No remote sessions yet</p>
            <p className="text-sm text-slate-gray">Start a session to provide remote support</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export { RemoteSessionPanel };