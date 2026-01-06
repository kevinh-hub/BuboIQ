import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { Webhook, CheckCircle2, ExternalLink } from 'lucide-react';
import { useSuperAdmin } from '../SuperAdminContext';

export const IntegrationsCard = () => {
  const { config, updateConfig } = useSuperAdmin();

  if (!config) return null;

  const toggleIntegration = async (key: string, value: boolean) => {
    // Simulate connect/disconnect
    const status = value ? 'connected' : 'disconnected';
    const newIntegrations = { ...config.integrations, [key]: status };
    await updateConfig({ integrations: newIntegrations }, `Toggled integration: ${key} to ${status}`);
  };

  const integrations = [
    { key: 'email', name: 'Email (Helpdesk)', status: config.integrations.email },
    { key: 'remote', name: 'Remote Access Provider', status: config.integrations.remote },
    { key: 'stripe', name: 'Stripe Billing', status: config.integrations.stripe },
    { key: 'crm', name: 'CRM / Streak', status: config.integrations.crm },
  ];

  return (
    <Card className="bubo-glass border-slate-gray/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-prediction-purple/10 rounded-lg">
            <Webhook className="w-5 h-5 text-prediction-purple" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Integrations & API</CardTitle>
            <p className="text-xs text-mist-gray">External Connections</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 mb-6">
          {integrations.map((integration, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${integration.status === 'connected' ? 'bg-iq-neon-green' : 'bg-slate-gray'}`} />
                <span className="text-sm text-white">{integration.name}</span>
              </div>
              <Switch 
                checked={integration.status === 'connected'} 
                onCheckedChange={(v) => toggleIntegration(integration.key, v)}
              />
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-slate-gray/30 text-white hover:bg-white/5">
          Open API & Webhooks
          <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
        </Button>
      </CardContent>
    </Card>
  );
};
