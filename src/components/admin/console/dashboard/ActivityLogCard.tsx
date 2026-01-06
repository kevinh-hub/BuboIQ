import React from 'react';
import { Clock, Activity, ShieldAlert, User, ArrowRight } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface ActivityLogCardProps {
  onViewAll?: () => void;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ onViewAll }) => {
  const activities = [
    {
      id: 1,
      user: 'kevinh',
      action: 'Changed Pro plan price from $149 → $179',
      time: '10m ago',
      env: 'production',
      type: 'critical'
    },
    {
      id: 2,
      user: 'kevinh',
      action: 'Enabled "Unlock All Tiers" override',
      time: '45m ago',
      env: 'staging',
      type: 'warning'
    },
    {
      id: 3,
      user: 'system',
      action: 'Created Test – Healthcare Team org',
      time: '2h ago',
      env: 'demo',
      type: 'info'
    },
    {
      id: 4,
      user: 'sarahj',
      action: 'Updated Compliance Suite toggle',
      time: '5h ago',
      env: 'production',
      type: 'info'
    }
  ];

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'production': return <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-crimson-danger/30 text-crimson-danger">PROD</Badge>;
      case 'staging': return <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-amber-warning/30 text-amber-warning">STG</Badge>;
      case 'demo': return <Badge variant="outline" className="text-[10px] px-1.5 h-5 border-iq-neon-green/30 text-iq-neon-green">DEMO</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="bubo-glass border-slate-gray/30 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-gray/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-white" />
          <h3 className="text-lg font-space-grotesk font-bold text-white">Activity Log</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-mist-gray hover:text-white h-8" onClick={onViewAll}>
          Full History
        </Button>
      </div>

      <div className="p-0 flex-1 overflow-hidden">
        <div className="divide-y divide-slate-gray/10">
          {activities.map((log) => (
            <div key={log.id} className="p-4 hover:bg-white/5 transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-gray/20 flex items-center justify-center text-[10px] text-mist-gray font-mono">
                    {log.user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-mist-gray">{log.user}</span>
                  {getEnvBadge(log.env)}
                </div>
                <span className="text-[10px] text-slate-gray flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {log.time}
                </span>
              </div>
              <div className="pl-7">
                <p className="text-sm text-white leading-snug">
                  {log.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-dark-midnight/50 border-t border-slate-gray/20 text-center">
         <p className="text-[10px] text-mist-gray">
           Showing last 4 actions. <span className="text-white cursor-pointer hover:underline">View all 142 logs</span>
         </p>
      </div>
    </Card>
  );
};
