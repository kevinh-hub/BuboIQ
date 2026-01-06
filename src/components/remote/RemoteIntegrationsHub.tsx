import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { remoteService, type RemoteProvider } from '../../utils/remote-service';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Shield, 
  Zap, 
  Globe, 
  Key,
  Webhook,
  TestTube
} from 'lucide-react';

interface ProviderDisplay extends RemoteProvider {
  logo: string;
  description: string;
  features: string[];
}

const RemoteIntegrationsHub: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderDisplay | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [providers, setProviders] = useState<ProviderDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [configForm, setConfigForm] = useState({
    apiUrl: '',
    apiKey: '',
    accountId: '',
    scopes: [] as string[]
  });

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const remoteProviders = await remoteService.getProviders();
      
      // Add display properties to providers
      const displayProviders: ProviderDisplay[] = remoteProviders.map(provider => ({
        ...provider,
        logo: getProviderLogo(provider.id),
        description: getProviderDescription(provider.id),
        features: getProviderFeatures(provider.capabilities)
      }));
      
      setProviders(displayProviders);
    } catch (error) {
      console.error('Failed to load providers:', error);
      toast.error('Failed to load remote providers');
      
      // Fallback to mock data for demo purposes
      setProviders(getMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const getMockProviders = (): ProviderDisplay[] => [
    {
      id: 'splashtop',
      name: 'Splashtop',
      logo: '🖥️',
      description: 'Enterprise remote access with SOS and Streamer APIs',
      status: 'connected',
      features: ['Ad-hoc sessions', 'Managed devices', 'Session recording', 'File transfer']
    },
    {
      id: 'screenconnect',
      name: 'ScreenConnect',
      logo: '🔗',
      description: 'ConnectWise Control for complete remote support',
      status: 'disconnected',
      features: ['Session control', 'Audit logs', 'Screen recording', 'Chat transcripts']
    },
    {
      id: 'beyondtrust',
      name: 'BeyondTrust',
      logo: '🛡️',
      description: 'Enterprise-grade privileged remote access',
      status: 'disconnected',
      features: ['Jump/Rep console', 'Session reports', 'Compliance logging', 'Zero-trust access']
    },
    {
      id: 'zoho',
      name: 'Zoho Assist',
      logo: '📱',
      description: 'Cloud-based remote support platform',
      status: 'disconnected',
      features: ['Multi-platform support', 'Session recordings', 'Chat history', 'File sharing']
    },
    {
      id: 'rustdesk',
      name: 'RustDesk',
      logo: '🦀',
      description: 'Open-source remote desktop solution',
      status: 'disconnected',
      features: ['Self-hosted', 'Cross-platform', 'P2P connections', 'Custom deployment']
    },
    {
      id: 'meshcentral',
      name: 'MeshCentral',
      logo: '🌐',
      description: 'Open-source computer management platform',
      status: 'disconnected',
      features: ['Self-hosted', 'Device management', 'Remote terminal', 'File operations']
    }
  ];

  const handleConnect = async (provider: ProviderDisplay) => {
    if (!configForm.apiUrl || !configForm.apiKey) {
      toast.error('Please fill in the required fields (API URL and API Key)');
      return;
    }

    setIsConnecting(true);
    
    try {
      const result = await remoteService.configureProvider(provider.id, {
        apiUrl: configForm.apiUrl,
        apiKey: configForm.apiKey,
        accountId: configForm.accountId || undefined,
        scopes: configForm.scopes
      });

      if (result.success) {
        toast.success(`Connected to ${provider.name}. Webhooks verified. Sessions will auto-attach to tickets.`);
        setSelectedProvider(null);
        setConfigForm({ apiUrl: '', apiKey: '', accountId: '', scopes: [] });
        await loadProviders(); // Refresh provider status
      } else {
        toast.error(`Failed to connect: ${result.message}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;

    setIsConnecting(true);
    
    try {
      const result = await remoteService.testProviderConnection(selectedProvider.id);
      
      if (result.success) {
        toast.success('Connection test successful! Provider is responding correctly.');
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Test connection error:', error);
      toast.error(`Connection test failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const generateWebhookUrl = (providerId: string) => {
    return remoteService.generateWebhookUrl(providerId);
  };

  const getProviderLogo = (providerId: string): string => {
    const logos = {
      splashtop: '🖥️',
      screenconnect: '🔗',
      beyondtrust: '🛡️',
      zoho: '📱',
      rustdesk: '🦀',
      meshcentral: '🌐'
    };
    return logos[providerId] || '🔧';
  };

  const getProviderDescription = (providerId: string): string => {
    const descriptions = {
      splashtop: 'Enterprise remote access with SOS and Streamer APIs',
      screenconnect: 'ConnectWise Control for complete remote support',
      beyondtrust: 'Enterprise-grade privileged remote access',
      zoho: 'Cloud-based remote support platform',
      rustdesk: 'Open-source remote desktop solution',
      meshcentral: 'Open-source computer management platform'
    };
    return descriptions[providerId] || 'Remote support provider';
  };

  const getProviderFeatures = (capabilities: string[]): string[] => {
    const featureMap = {
      adhoc: 'Ad-hoc sessions',
      managed: 'Managed devices',
      recording: 'Session recording',
      file_transfer: 'File transfer',
      session_control: 'Session control',
      audit_logs: 'Audit logs',
      chat: 'Chat transcripts',
      privileged_access: 'Privileged access',
      session_reports: 'Session reports',
      compliance: 'Compliance logging',
      multi_platform: 'Multi-platform support',
      file_sharing: 'File sharing',
      self_hosted: 'Self-hosted',
      p2p: 'P2P connections',
      cross_platform: 'Cross-platform',
      device_management: 'Device management',
      terminal: 'Remote terminal',
      file_operations: 'File operations'
    };
    
    return capabilities.map(cap => featureMap[cap] || cap).slice(0, 4);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-iq-neon-green/30 border-t-iq-neon-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-mist-gray">Loading remote providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-iq-neon-green" />
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
            Remote Providers
          </h1>
        </div>
        <p className="text-mist-gray">
          Connect your preferred remote support tools to launch sessions directly from tickets
        </p>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="bubo-glass p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{provider.logo}</div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                    {provider.name}
                  </h3>
                  <Badge 
                    className={provider.status === 'connected' 
                      ? 'bg-iq-green/20 text-iq-green border-iq-green/30' 
                      : 'bg-mist-gray/20 text-mist-gray border-mist-gray/30'
                    }
                  >
                    {provider.status === 'connected' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {provider.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-mist-gray text-sm mb-4 leading-relaxed">
              {provider.description}
            </p>

            <div className="space-y-2 mb-4">
              {provider.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-cloud-white">
                  <div className="w-1 h-1 bg-iq-neon-green rounded-full" />
                  {feature}
                </div>
              ))}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  className={provider.status === 'connected' 
                    ? 'bubo-btn-secondary w-full' 
                    : 'bubo-btn-neon-primary w-full'
                  }
                  onClick={() => setSelectedProvider(provider)}
                >
                  {provider.status === 'connected' ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent className="bubo-glass border-slate-gray/30 w-[600px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-pure-white">
                    <span className="text-2xl">{selectedProvider?.logo}</span>
                    Connect {selectedProvider?.name}
                  </SheetTitle>
                </SheetHeader>

                {selectedProvider && (
                  <div className="space-y-6 mt-6">
                    {/* API Configuration */}
                    <div className="space-y-4">
                      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-iq-neon-green" />
                        API Configuration
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="apiUrl" className="text-cloud-white">API URL</Label>
                          <Input
                            id="apiUrl"
                            value={configForm.apiUrl}
                            onChange={(e) => setConfigForm({...configForm, apiUrl: e.target.value})}
                            placeholder={`https://api.${selectedProvider.id}.com/v1`}
                            className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="apiKey" className="text-cloud-white">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            value={configForm.apiKey}
                            onChange={(e) => setConfigForm({...configForm, apiKey: e.target.value})}
                            placeholder="Enter your API key..."
                            className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="accountId" className="text-cloud-white">Account ID</Label>
                          <Input
                            id="accountId"
                            value={configForm.accountId}
                            onChange={(e) => setConfigForm({...configForm, accountId: e.target.value})}
                            placeholder="Your account identifier"
                            className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Webhook Configuration */}
                    <div className="space-y-4">
                      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white flex items-center gap-2">
                        <Webhook className="w-4 h-4 text-cyan-accent" />
                        Webhook Endpoint
                      </h3>
                      
                      <div className="bubo-glass p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <code className="font-jetbrains-mono text-sm text-iq-neon-green">
                            {generateWebhookUrl(selectedProvider.id)}
                          </code>
                          <Button size="sm" className="bubo-btn-ghost">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-mist-gray mt-2">
                          Configure this URL in your {selectedProvider.name} webhook settings
                        </p>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-signal-yellow" />
                        Required Permissions
                      </h3>
                      
                      <div className="space-y-3">
                        {[
                          'Create remote sessions',
                          'Access session recordings',
                          'Retrieve session metadata',
                          'Manage device connections'
                        ].map((permission, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`permission-${index}`}
                              defaultChecked
                              className="border-iq-neon-green/30"
                            />
                            <Label 
                              htmlFor={`permission-${index}`}
                              className="text-cloud-white text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-slate-gray/30">
                      <Button 
                        onClick={handleTestConnection}
                        disabled={isConnecting}
                        className="bubo-btn-secondary flex-1"
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                      
                      <Button 
                        onClick={() => handleConnect(selectedProvider)}
                        disabled={isConnecting}
                        className="bubo-btn-neon-primary flex-1"
                      >
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-surface-dark border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        {selectedProvider.status === 'connected' ? 'Update' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {providers.filter(p => p.status === 'connected').length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-mist-gray" />
          </div>
          <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-2">
            No providers connected
          </h3>
          <p className="text-mist-gray">
            Choose a remote support provider above to get started with integrated sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export { RemoteIntegrationsHub };