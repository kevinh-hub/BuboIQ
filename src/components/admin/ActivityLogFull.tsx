import React from 'react';
import { Activity, User, Clock, Filter, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export const ActivityLogFull = () => {
  const activities = [
    {
      id: 1,
      user: 'kevinh',
      action: 'Changed Pro plan price from $149 → $179',
      time: '10m ago',
      env: 'production',
      ip: '192.168.1.42'
    },
    {
      id: 2,
      user: 'kevinh',
      action: 'Enabled "Unlock All Tiers" override',
      time: '45m ago',
      env: 'staging',
      ip: '192.168.1.42'
    },
    {
      id: 3,
      user: 'system',
      action: 'Created Test – Healthcare Team org',
      time: '2h ago',
      env: 'demo',
      ip: '10.0.0.1'
    },
    {
      id: 4,
      user: 'sarahj',
      action: 'Updated Compliance Suite toggle',
      time: '5h ago',
      env: 'production',
      ip: '172.16.0.5'
    }
  ];

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'production': return <Badge variant="outline" className="border-crimson-danger/30 text-crimson-danger">PROD</Badge>;
      case 'staging': return <Badge variant="outline" className="border-amber-warning/30 text-amber-warning">STG</Badge>;
      case 'demo': return <Badge variant="outline" className="border-iq-neon-green/30 text-iq-neon-green">DEMO</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">System Activity Log</h2>
          <p className="text-mist-gray">Audit trail of all Super Admin actions and system changes.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-slate-gray text-mist-gray">
             <Download className="w-4 h-4 mr-2" /> Export CSV
           </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
          <Input placeholder="Filter by user, action, or IP..." className="pl-10 bg-dark-midnight border-slate-gray text-white" />
        </div>
        <Button variant="outline" className="border-slate-gray text-mist-gray">
           Date Range
        </Button>
      </div>

      <Card className="bg-dark-midnight/40 border-slate-gray/30">
        <div className="divide-y divide-slate-gray/10">
          {activities.map((log) => (
            <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-slate-gray/20 flex items-center justify-center text-xs font-mono text-mist-gray">
                    {log.user.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-white">{log.user}</span>
                       {getEnvBadge(log.env)}
                    </div>
                    <p className="text-sm text-mist-gray">{log.action}</p>
                 </div>
              </div>
              <div className="text-right text-xs text-mist-gray">
                 <div className="flex items-center justify-end gap-1 mb-1">
                    <Clock className="w-3 h-3" /> {log.time}
                 </div>
                 <div className="font-mono opacity-60">{log.ip}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
