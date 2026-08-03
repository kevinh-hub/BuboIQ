import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { CreditCard, Save } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { useSuperAdmin } from '../SuperAdminContext';
import { toast } from 'sonner';

export const PricingPlansCard = () => {
  const { config, updateConfig } = useSuperAdmin();
  const [activeTab, setActiveTab] = useState('plans');
  
  // Local state for form editing
  const [localPricing, setLocalPricing] = useState<any>(null);

  useEffect(() => {
    if (config?.pricing) {
      setLocalPricing(JSON.parse(JSON.stringify(config.pricing)));
    }
  }, [config]);

  if (!localPricing) return null;

  const handleSave = async () => {
    await updateConfig({ pricing: localPricing }, 'Updated pricing configuration');
  };

  const updatePlan = (planKey: string, field: string, value: string) => {
    setLocalPricing((prev: any) => ({
      ...prev,
      plans: {
        ...prev.plans,
        [planKey]: {
          ...prev.plans[planKey],
          [field]: Number(value) || 0
        }
      }
    }));
  };

  const updateAddon = (addonKey: string, field: string, value: any) => {
    setLocalPricing((prev: any) => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonKey]: {
          ...prev.addons[addonKey],
          [field]: value
        }
      }
    }));
  };

  const updateDiscount = (index: number, field: string, value: any) => {
    const newDiscounts = [...localPricing.discounts];
    newDiscounts[index] = { ...newDiscounts[index], [field]: value };
    setLocalPricing((prev: any) => ({
      ...prev,
      discounts: newDiscounts
    }));
  };

  return (
    <Card className="bubo-glass border-slate-gray/30 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-electric-blue/10 rounded-lg">
            <CreditCard className="w-5 h-5 text-electric-blue" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Pricing & Plans</CardTitle>
            <p className="text-xs text-mist-gray">Subscription & Add-on Control</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-dark-midnight border border-slate-gray/30 w-full">
            <TabsTrigger value="plans" className="flex-1">Plans</TabsTrigger>
            <TabsTrigger value="addons" className="flex-1">Add-ons</TabsTrigger>
            <TabsTrigger value="discounts" className="flex-1">Discounts</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="flex-1 space-y-4 mt-4 overflow-y-auto pr-1">
            {Object.entries(localPricing.plans).map(([key, plan]: [string, any]) => (
              <div key={key} className="p-3 bg-white/5 rounded-lg border border-slate-gray/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white capitalize text-sm">{key} Plan</span>
                  <Badge variant="outline" className="text-[10px] border-slate-gray/30 text-slate-gray">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-mist-gray">Monthly ($)</Label>
                    <Input 
                      type="number"
                      value={plan.monthly} 
                      onChange={(e) => updatePlan(key, 'monthly', e.target.value)}
                      className="h-7 text-xs bg-dark-midnight border-slate-gray/30" 
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-mist-gray">Annual ($)</Label>
                    <Input 
                      type="number"
                      value={plan.annual} 
                      onChange={(e) => updatePlan(key, 'annual', e.target.value)}
                      className="h-7 text-xs bg-dark-midnight border-slate-gray/30" 
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-mist-gray">Included Devices</Label>
                    <Input 
                      type="number"
                      value={plan.devices} 
                      onChange={(e) => updatePlan(key, 'devices', e.target.value)}
                      className="h-7 text-xs bg-dark-midnight border-slate-gray/30" 
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-mist-gray">Overage ($/dev)</Label>
                    <Input 
                      type="number"
                      value={plan.overage} 
                      onChange={(e) => updatePlan(key, 'overage', e.target.value)}
                      className="h-7 text-xs bg-dark-midnight border-slate-gray/30" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="addons" className="flex-1 mt-4 space-y-4">
            {Object.entries(localPricing.addons).map(([key, addon]: [string, any]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-gray/20">
                <div>
                  <div className="text-sm font-bold text-white">{addon.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      type="number"
                      value={addon.price} 
                      onChange={(e) => updateAddon(key, 'price', Number(e.target.value))}
                      className="w-16 h-6 text-xs bg-dark-midnight border-slate-gray/30" 
                    />
                    <span className="text-xs text-mist-gray">/mo</span>
                  </div>
                </div>
                <Switch 
                  checked={addon.active} 
                  onCheckedChange={(checked) => updateAddon(key, 'active', checked)}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="discounts" className="flex-1 mt-4 space-y-4">
            {localPricing.discounts.map((discount: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-gray/20">
                <div>
                  <div className="text-sm font-bold text-white">{discount.name}</div>
                  <div className="text-xs text-iq-neon-green font-mono mt-1">{discount.value}</div>
                </div>
                <Switch 
                  checked={discount.active} 
                  onCheckedChange={(checked) => updateDiscount(i, 'active', checked)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="pt-4 mt-2">
          <Button className="w-full bubo-btn-neon-primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Pricing Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
