import React from 'react';
import { Server, Download, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const AgentsManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Agent Management</h2>
          <p className="text-mist-gray">Manage BuboIQ agent versions, updates, and deployment installers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-dark-midnight/40 border-slate-gray/30 flex items-center gap-4">
           <div className="p-3 rounded-lg bg-iq-neon-green/10 text-iq-neon-green">
              <Server className="w-6 h-6" />
           </div>
           <div>
              <div className="text-2xl font-bold text-white">854</div>
              <div className="text-xs text-mist-gray uppercase tracking-wider">Total Agents</div>
           </div>
        </Card>
        <Card className="p-6 bg-dark-midnight/40 border-slate-gray/30 flex items-center gap-4">
           <div className="p-3 rounded-lg bg-cyan-accent/10 text-cyan-accent">
              <CheckCircle className="w-6 h-6" />
           </div>
           <div>
              <div className="text-2xl font-bold text-white">98.6%</div>
              <div className="text-xs text-mist-gray uppercase tracking-wider">Online Rate</div>
           </div>
        </Card>
         <Card className="p-6 bg-dark-midnight/40 border-slate-gray/30 flex items-center gap-4">
           <div className="p-3 rounded-lg bg-amber-warning/10 text-amber-warning">
              <Download className="w-6 h-6" />
           </div>
           <div>
              <div className="text-2xl font-bold text-white">v2.4.1</div>
              <div className="text-xs text-mist-gray uppercase tracking-wider">Latest Version</div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6">
             <h3 className="text-lg font-bold text-white mb-4">Deployment Installers</h3>
             <div className="space-y-4">
                {['Windows (.msi)', 'macOS (.pkg)', 'Linux (.deb)', 'Linux (.rpm)'].map(os => (
                   <div key={os} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-white">{os}</span>
                      <Button size="sm" variant="outline" className="text-iq-neon-green border-iq-neon-green/30 hover:bg-iq-neon-green/10">
                         <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                   </div>
                ))}
             </div>
          </Card>

           <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6">
             <h3 className="text-lg font-bold text-white mb-4">Update Policy</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Auto-Update Agents</div>
                      <div className="text-xs text-mist-gray">Automatically push new versions to endpoints</div>
                   </div>
                   <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Enabled</Badge>
                </div>
                 <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Staggered Rollout</div>
                      <div className="text-xs text-mist-gray">Update 10% of fleet per day to prevent issues</div>
                   </div>
                   <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Enabled</Badge>
                </div>
             </div>
          </Card>
      </div>
    </div>
  );
};
