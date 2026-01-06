import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Switch } from '../../../ui/switch';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { Separator } from '../../../ui/separator';
import { useSuperAdmin } from '../SuperAdminContext';

export const FeatureMatrixCard = () => {
  const { config, updateConfig } = useSuperAdmin();

  if (!config) return null;

  const toggleFeature = async (key: string) => {
    if (!config) return;
    const newFeatureMatrix = { ...config.featureMatrix };
    newFeatureMatrix[key] = {
      ...newFeatureMatrix[key],
      global: !newFeatureMatrix[key].global
    };
    await updateConfig({ featureMatrix: newFeatureMatrix }, `Toggled global feature: ${config.featureMatrix[key].label}`);
  };

  const toggleOverride = async (key: keyof typeof config.overrides, value: boolean) => {
    if (!config) return;
    const newOverrides = { ...config.overrides, [key]: value };
    await updateConfig({ overrides: newOverrides }, `Changed override: ${key} to ${value}`);
  };

  return (
    <Card className="bubo-glass border-slate-gray/30 col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-iq-neon-green/10 rounded-lg">
              <Shield className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Feature Matrix</CardTitle>
              <p className="text-xs text-mist-gray">Global feature availability by plan</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Matrix Header */}
        <div className="grid grid-cols-12 gap-2 mb-3 text-xs font-bold text-mist-gray uppercase tracking-wider border-b border-slate-gray/30 pb-2">
          <div className="col-span-4">Module</div>
          <div className="col-span-2 text-center">Starter</div>
          <div className="col-span-2 text-center">Pro</div>
          <div className="col-span-2 text-center">Team</div>
          <div className="col-span-2 text-center text-white">Global</div>
        </div>

        {/* Matrix Rows */}
        <div className="space-y-2 mb-6">
          {Object.entries(config.featureMatrix).map(([key, data]) => (
            <div key={key} className="grid grid-cols-12 gap-2 items-center py-1 hover:bg-white/5 rounded px-1 transition-colors">
              <div className="col-span-4 text-sm text-white font-medium">{data.label}</div>
              
              {/* Plan Availability (Read-only visualization usually, but could be toggles) */}
              <div className="col-span-2 flex justify-center">
                {data.starter ? <Check className="w-4 h-4 text-slate-gray" /> : <span className="w-4 h-4 block bg-slate-gray/10 rounded-full" />}
              </div>
              <div className="col-span-2 flex justify-center">
                {data.pro ? <Check className="w-4 h-4 text-electric-blue" /> : <span className="w-4 h-4 block bg-slate-gray/10 rounded-full" />}
              </div>
              <div className="col-span-2 flex justify-center">
                {data.team ? <Check className="w-4 h-4 text-iq-neon-green" /> : <span className="w-4 h-4 block bg-slate-gray/10 rounded-full" />}
              </div>
              
              {/* Global Toggle */}
              <div className="col-span-2 flex justify-center">
                <Switch 
                  checked={data.global} 
                  onCheckedChange={() => toggleFeature(key)}
                  className="data-[state=checked]:bg-iq-neon-green"
                />
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-gray/20 my-4" />

        {/* Dangerous Overrides */}
        <div className="bg-crimson-danger/5 border border-crimson-danger/20 rounded-lg p-4">
          <h4 className="text-xs font-bold text-crimson-danger uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Dangerous Overrides
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Unlock All Features</span>
              <Switch 
                checked={config.overrides.unlockFeatures} 
                onCheckedChange={(v) => toggleOverride('unlockFeatures', v)}
                className="data-[state=checked]:bg-crimson-danger"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Unlock All Tiers</span>
              <Switch 
                checked={config.overrides.unlockTiers} 
                onCheckedChange={(v) => toggleOverride('unlockTiers', v)}
                className="data-[state=checked]:bg-crimson-danger"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Disable TierGuard Checks</span>
              <Switch 
                checked={config.overrides.disableTierGuard} 
                onCheckedChange={(v) => toggleOverride('disableTierGuard', v)}
                className="data-[state=checked]:bg-crimson-danger"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Enable Beta Features</span>
              <Switch 
                checked={config.overrides.enableBeta} 
                onCheckedChange={(v) => toggleOverride('enableBeta', v)}
                className="data-[state=checked]:bg-crimson-danger"
              />
            </div>
          </div>
          <p className="text-[10px] text-crimson-danger/70 mt-3 text-center">
            Warning: Enabling these overrides affects all organizations in this environment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
