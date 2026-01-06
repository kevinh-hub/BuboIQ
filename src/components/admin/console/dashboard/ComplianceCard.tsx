import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Switch } from '../../../ui/switch';
import { Lock, AlertCircle } from 'lucide-react';
import { Label } from '../../../ui/label';
import { useSuperAdmin } from '../SuperAdminContext';

export const ComplianceCard = () => {
  const { config, updateConfig } = useSuperAdmin();

  if (!config) return null;

  const toggleCompliance = async (key: string, value: boolean) => {
    if (!config) return;
    const newCompliance = { ...config.compliance, [key]: value };
    await updateConfig({ compliance: newCompliance }, `Toggled compliance setting: ${key}`);
  };

  return (
    <Card className="bubo-glass border-slate-gray/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-warning/10 rounded-lg">
            <Lock className="w-5 h-5 text-amber-warning" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Compliance & Security</CardTitle>
            <p className="text-xs text-mist-gray">Global Security Policies</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white cursor-pointer" htmlFor="hipaa">HIPAA Dashboards</Label>
            <Switch 
              id="hipaa" 
              checked={config.compliance.hipaa} 
              onCheckedChange={(v) => toggleCompliance('hipaa', v)} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white cursor-pointer" htmlFor="pci">PCI-DSS Dashboards</Label>
            <Switch 
              id="pci" 
              checked={config.compliance.pci} 
              onCheckedChange={(v) => toggleCompliance('pci', v)} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white cursor-pointer" htmlFor="soc2">SOC 2 Evidence Export</Label>
            <Switch 
              id="soc2" 
              checked={config.compliance.soc2} 
              onCheckedChange={(v) => toggleCompliance('soc2', v)} 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white cursor-pointer" htmlFor="mfa">Require MFA (Admins)</Label>
            <Switch 
              id="mfa" 
              checked={config.compliance.mfaRequired} 
              onCheckedChange={(v) => toggleCompliance('mfaRequired', v)} 
            />
          </div>
        </div>

        <div className="mt-6 p-3 rounded bg-amber-warning/5 border border-amber-warning/10 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-warning shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-warning/80 leading-snug">
            These are normally Team-tier features. Overrides may change access for lower tiers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
