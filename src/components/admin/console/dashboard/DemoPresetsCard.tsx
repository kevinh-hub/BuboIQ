import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { PlayCircle, Settings2 } from 'lucide-react';
import { useSuperAdmin } from '../SuperAdminContext';

export const DemoPresetsCard = () => {
  const { config, updateConfig } = useSuperAdmin();

  if (!config) return null;

  const togglePreset = async (key: string, value: boolean) => {
    const newPresets = { ...config.demoPresets, [key]: value };
    await updateConfig({ demoPresets: newPresets }, `Toggled demo preset: ${key}`);
  };

  const presets = [
    { key: 'healthcare', name: 'Healthcare Provider', active: config.demoPresets.healthcare },
    { key: 'finance', name: 'Finance Firm', active: config.demoPresets.finance },
    { key: 'saas', name: 'SaaS / Tech Co', active: config.demoPresets.saas },
  ];

  return (
    <Card className="bubo-glass border-slate-gray/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-iq-neon-green/10 rounded-lg">
            <PlayCircle className="w-5 h-5 text-iq-neon-green" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Demo Presets</CardTitle>
            <p className="text-xs text-mist-gray">Industry Profiles</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-6">
          {presets.map((preset, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
              <span className="text-sm text-white font-medium">{preset.name}</span>
              <div className="flex items-center gap-2">
                 <Button size="icon" variant="ghost" className="h-6 w-6 text-mist-gray hover:text-white">
                  <Settings2 className="w-3 h-3" />
                </Button>
                <Switch 
                  checked={preset.active} 
                  onCheckedChange={(v) => togglePreset(preset.key, v)}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-mist-gray text-center">
          Control default data, dashboards, and messaging for demo mode.
        </p>
      </CardContent>
    </Card>
  );
};
