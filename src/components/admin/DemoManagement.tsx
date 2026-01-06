import React from 'react';
import { PlayCircle, Settings2, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

export const DemoManagement = () => {
  return (
     <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Demo Environment & Presets</h2>
        <p className="text-mist-gray">Configure demo data sets and reset policies for the sandbox environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Healthcare Demo */}
         <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-iq-neon-green/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-iq-neon-green/10" />
            <h3 className="text-lg font-bold text-white mb-2">Healthcare Demo</h3>
            <p className="text-sm text-mist-gray mb-4">
               Simulates a hospital network with 500+ devices, HIPAA compliance alerts, and medical IoT devices.
            </p>
            <div className="flex items-center justify-between mt-4">
               <Button variant="outline" size="sm" className="border-slate-gray text-white hover:bg-white/5">
                  <Settings2 className="w-4 h-4 mr-2" /> Configure
               </Button>
               <Switch checked={true} />
            </div>
         </Card>

         {/* Finance Demo */}
         <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-electric-blue/10" />
            <h3 className="text-lg font-bold text-white mb-2">Finance Demo</h3>
            <p className="text-sm text-mist-gray mb-4">
               Simulates a trading firm with high-performance workstations, latency alerts, and PCI-DSS monitoring.
            </p>
            <div className="flex items-center justify-between mt-4">
               <Button variant="outline" size="sm" className="border-slate-gray text-white hover:bg-white/5">
                  <Settings2 className="w-4 h-4 mr-2" /> Configure
               </Button>
               <Switch />
            </div>
         </Card>

         {/* SaaS Startup Demo */}
         <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-prediction-purple/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-prediction-purple/10" />
            <h3 className="text-lg font-bold text-white mb-2">SaaS Startup Demo</h3>
            <p className="text-sm text-mist-gray mb-4">
               Simulates a remote-first company with MacBook Pro fleet, SaaS integrations (Slack/Jira), and zero-trust access.
            </p>
            <div className="flex items-center justify-between mt-4">
               <Button variant="outline" size="sm" className="border-slate-gray text-white hover:bg-white/5">
                  <Settings2 className="w-4 h-4 mr-2" /> Configure
               </Button>
               <Switch />
            </div>
         </Card>
      </div>

      <Card className="p-6 border-amber-warning/30 bg-amber-warning/5 mt-8">
         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-lg font-bold text-amber-warning mb-1">Reset Demo Environment</h3>
               <p className="text-sm text-amber-warning/80">
                  This will wipe all data in the 'Demo' environment and restore the selected preset. 
                  <br/><strong>Warning: This action cannot be undone.</strong>
               </p>
            </div>
            <Button className="bg-amber-warning text-dark-midnight hover:bg-amber-warning/90">
               <RefreshCw className="w-4 h-4 mr-2" /> Reset Environment
            </Button>
         </div>
      </Card>
     </div>
  );
};
