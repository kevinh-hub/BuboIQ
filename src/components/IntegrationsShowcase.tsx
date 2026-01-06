import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { integrationsService, type Integration, type WebhookEvent } from '../utils/integrations-service';
import { 
  Settings, 
  Code, 
  Webhook, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Activity,
  Globe,
  TestTube,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

export const IntegrationsShowcase: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiUrl: '',
    apiKey: '',
    clientId: '',
    clientSecret: ''
  });

  useEffect(() => {
    loadIntegrations();
    loadEvents();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const integrationsData = await integrationsService.getIntegrations();
      setIntegrations(integrationsData);
    } catch (error) {
      console.error('Failed to load integrations:', error);
      toast.error('Failed to load integrations');
      
      // Fallback to mock data for demo
      setIntegrations(getMockIntegrations());
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsData = await integrationsService.getIntegrationEvents(undefined, undefined, 20);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Set mock events for demo
      setEvents(getMockEvents());
    }
  };

  const handleConfigureIntegration = async (integration: Integration) => {
    if (!configForm.apiUrl || !configForm.apiKey) {
      toast.error('API URL and API Key are required');
      return;
    }

    setConfiguring(true);
    
    try {
      const result = await integrationsService.configureIntegration(integration.id, {
        apiUrl: configForm.apiUrl,
        apiKey: configForm.apiKey,
        clientId: configForm.clientId || undefined,
        clientSecret: configForm.clientSecret || undefined
      });

      if (result.success) {
        toast.success(`${integration.name} configured successfully!`);
        setSelectedIntegration(null);
        setConfigForm({ apiUrl: '', apiKey: '', clientId: '', clientSecret: '' });
        await loadIntegrations();
      } else {
        toast.error(`Configuration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Configuration error:', error);
      toast.error(`Configuration failed: ${error.message}`);
    } finally {
      setConfiguring(false);
    }
  };

  const handleTestConnection = async (integration: Integration) => {
    setTesting(true);
    
    try {
      const result = await integrationsService.testIntegration(integration.id);
      
      if (result.success) {
        toast.success(`${integration.name} connection test successful!`);
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Test connection error:', error);
      toast.error(`Connection test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSimulateWebhook = async (integration: Integration, eventType: string) => {
    try {
      const result = await integrationsService.simulateWebhookEvent(integration.id, eventType);
      
      if (result.success) {
        toast.success(`Webhook event '${eventType}' simulated successfully!`);
        await loadEvents();
      } else {
        toast.error(`Webhook simulation failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Webhook simulation error:', error);
      toast.error(`Webhook simulation failed: ${error.message}`);
    }
  };

  const getFilteredIntegrations = () => {
    return integrations.filter(integration => integration.category === selectedCategory);
  };

  const categories = integrationsService.getIntegrationCategories();
  const webhookExamples = integrationsService.getWebhookExamples();
  const apiExamples = integrationsService.getAPIExamples();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-midnight p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-iq-neon-green/30 border-t-iq-neon-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-mist-gray">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-midnight p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-pure-white mb-4">
            BuboIQ Integrations Hub
          </h1>
          <p className="text-xl text-mist-gray max-w-3xl mx-auto mb-6">
            Connect your entire tech stack and automate intelligent workflows with 200+ integrations
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              🚀 All Integrations Functional
            </Badge>
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
              🪝 Webhooks Active
            </Badge>
            <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
              📡 Real-time Events
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-dark-midnight/50 p-1 rounded-2xl mb-8">
            <TabsTrigger 
              value="integrations" 
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
            >
              <Settings className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger 
              value="webhooks"
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
            >
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger 
              value="api"
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
            >
              <Code className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
            >
              <Activity className="w-4 h-4 mr-2" />
              Live Events
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {/* Category Filter */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-dark-midnight/50 rounded-2xl p-1">
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === key
                        ? 'bg-iq-neon-green/20 text-iq-neon-green shadow-lg'
                        : 'text-mist-gray hover:text-pure-white hover:bg-slate-gray/30'
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredIntegrations().map((integration) => (
                <Card key={integration.id} className="bubo-glass p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getIntegrationIcon(integration.id)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-pure-white">{integration.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${
                            integration.status === 'active' 
                              ? 'bg-iq-green/20 text-iq-green border-iq-green/30' 
                              : 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30'
                          }`}>
                            {integration.status}
                          </Badge>
                          {integration.connected && (
                            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30 text-xs">
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {integration.connected ? (
                      <CheckCircle className="w-5 h-5 text-iq-green" />
                    ) : (
                      <XCircle className="w-5 h-5 text-mist-gray" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-mist-gray">
                      <strong className="text-cloud-white">Events:</strong> {integration.webhookEvents.slice(0, 2).join(', ')}
                      {integration.webhookEvents.length > 2 && ` +${integration.webhookEvents.length - 2} more`}
                    </div>

                    <div className="flex gap-2">
                      {integration.connected ? (
                        <>
                          <Button 
                            size="sm" 
                            className="bubo-btn-secondary flex-1"
                            onClick={() => handleTestConnection(integration)}
                            disabled={testing}
                          >
                            {testing ? (
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <TestTube className="w-3 h-3 mr-1" />
                            )}
                            Test
                          </Button>
                          <Button 
                            size="sm" 
                            className="bubo-btn-ghost flex-1"
                            onClick={() => handleSimulateWebhook(integration, integration.webhookEvents[0])}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Demo
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bubo-btn-neon-primary w-full"
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {webhookExamples.map((webhook, index) => (
                <Card key={index} className="bubo-glass p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-signal-yellow/20 rounded-lg flex items-center justify-center">
                      <Webhook className="w-5 h-5 text-signal-yellow" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-1">
                        {webhook.name}
                      </h3>
                      <p className="text-sm text-mist-gray mb-3">{webhook.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-cyan-accent font-medium">Endpoint:</span>
                          <span className="text-cloud-white ml-2 font-jetbrains-mono">{webhook.endpoint}</span>
                        </div>
                        <div>
                          <span className="text-cyan-accent font-medium">Events:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {webhook.events.map((event, idx) => (
                              <Badge key={idx} className="bg-iq-neon-green/20 text-iq-neon-green text-xs font-jetbrains-mono">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={webhook.active 
                      ? "bg-iq-green/20 text-iq-green border-iq-green/30"
                      : "bg-mist-gray/20 text-mist-gray border-mist-gray/30"
                    }>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button size="sm" className="bubo-btn-ghost">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Test Webhook
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="space-y-6">
              {Object.entries(apiExamples).map(([key, example]) => (
                <Card key={key} className="bubo-glass p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-cyan-accent/20 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-cyan-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-2">
                        API Example: {integrationsService.formatEventType(key)}
                      </h3>
                      <p className="text-sm text-mist-gray mb-4">{example.description}</p>
                      
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-cyan-accent font-medium mb-2 block">Request</Label>
                          <div className="bg-dark-midnight/50 rounded-lg p-4 font-jetbrains-mono text-xs text-cloud-white overflow-x-auto">
                            <pre>{example.code}</pre>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-iq-neon-green font-medium mb-2 block">Response</Label>
                          <div className="bg-dark-midnight/50 rounded-lg p-4 font-jetbrains-mono text-xs text-cloud-white overflow-x-auto">
                            <pre>{example.response}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
                Live Integration Events
              </h2>
              <Button onClick={loadEvents} className="bubo-btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={index} className="bubo-glass p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {integrationsService.getEventTypeIcon(event.eventType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-pure-white">
                          {integrationsService.formatEventType(event.eventType)}
                        </h4>
                        <p className="text-sm text-mist-gray">
                          From {event.providerId} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30">
                      Processed
                    </Badge>
                  </div>
                  
                  {event.data && (
                    <div className="mt-3 pt-3 border-t border-slate-gray/30">
                      <div className="bg-dark-midnight/50 rounded-lg p-3 font-jetbrains-mono text-xs text-cloud-white">
                        <pre>{JSON.stringify(event.data, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              
              {events.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-mist-gray mx-auto mb-4 opacity-50" />
                  <p className="text-mist-gray">No integration events yet</p>
                  <p className="text-sm text-slate-gray">Configure integrations to see live events here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-dark-midnight/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bubo-glass p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">
                  {getIntegrationIcon(selectedIntegration.id)}
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                    Configure {selectedIntegration.name}
                  </h3>
                  <p className="text-sm text-mist-gray">
                    Connect your {selectedIntegration.name} instance
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiUrl" className="text-cloud-white">API URL</Label>
                  <Input
                    id="apiUrl"
                    value={configForm.apiUrl}
                    onChange={(e) => setConfigForm({...configForm, apiUrl: e.target.value})}
                    placeholder={`https://api.${selectedIntegration.id}.com/v1`}
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

                <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Webhook className="w-4 h-4 text-iq-neon-green" />
                    <span className="text-sm font-medium text-iq-neon-green">Webhook URL</span>
                  </div>
                  <code className="text-xs text-cloud-white font-jetbrains-mono break-all">
                    {integrationsService.generateWebhookUrl(selectedIntegration.id)}
                  </code>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={() => setSelectedIntegration(null)}
                  className="bubo-btn-secondary flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleConfigureIntegration(selectedIntegration)}
                  className="bubo-btn-neon-primary flex-1"
                  disabled={configuring}
                >
                  {configuring ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  Configure
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
function getIntegrationIcon(integrationId: string): string {
  const icons: { [key: string]: string } = {
    slack: '💬',
    'microsoft-teams': '👥',
    jira: '🎫',
    servicenow: '⚡',
    zendesk: '🎧',
    pagerduty: '📟',
    datadog: '🐕',
    'new-relic': '📊',
    splunk: '🔍',
    prometheus: '🔥',
    grafana: '📈',
    nagios: '👁️',
    'aws-cloudwatch': '☁️',
    'azure-monitor': '🔷',
    'google-cloud': '🌤️',
    kubernetes: '⚙️',
    docker: '🐳',
    terraform: '🏗️',
    crowdstrike: '🛡️',
    sentinelone: '🔒',
    okta: '🔐',
    auth0: '🔑',
    'splunk-security': '🔍',
    qualys: '🔍'
  };
  
  return icons[integrationId] || '🔧';
}

function getMockIntegrations(): Integration[] {
  return [
    {
      id: 'slack',
      name: 'Slack',
      category: 'popular',
      status: 'active',
      connected: true,
      webhookEvents: ['incident.created', 'incident.escalated', 'sla.breach_imminent'],
      apiEndpoints: ['channels', 'messages', 'users']
    },
    {
      id: 'jira',
      name: 'Jira',
      category: 'popular',
      status: 'active',
      connected: false,
      webhookEvents: ['incident.created', 'incident.resolved', 'escalation.triggered'],
      apiEndpoints: ['issues', 'projects', 'users']
    },
    {
      id: 'datadog',
      name: 'Datadog',
      category: 'monitoring',
      status: 'active',
      connected: true,
      webhookEvents: ['alert.triggered', 'metric.threshold_exceeded', 'anomaly.detected'],
      apiEndpoints: ['metrics', 'events', 'monitors']
    }
  ];
}

function getMockEvents(): WebhookEvent[] {
  return [
    {
      id: 'evt_1',
      providerId: 'slack',
      eventType: 'incident.created',
      data: {
        id: 'inc_12345',
        title: 'Database Connection Timeout',
        severity: 'high'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: 'evt_2',
      providerId: 'datadog',
      eventType: 'alert.triggered',
      data: {
        alert_id: 'alert_67890',
        metric: 'cpu_usage',
        threshold: 80,
        current_value: 95
      },
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ];
}