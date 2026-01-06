import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Activity, ListChecks } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { useAuth } from '../../../context/AuthContext';
import { projectId } from '../../../utils/supabase/info';
import { formatDistanceToNow } from 'date-fns';

export const AdminProtocolCard = () => {
  const { session } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/activity-log`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <Card className="bubo-glass border-slate-gray/30 lg:col-span-3">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-gray/10 rounded-lg">
            <ListChecks className="w-5 h-5 text-slate-gray" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Super Admin Activity & Protocol</CardTitle>
            <p className="text-xs text-mist-gray">System Logs & Best Practices</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Protocol */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-gray/20 pb-2">Admin Protocol</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-mist-gray">
              <div className="w-1.5 h-1.5 rounded-full bg-iq-neon-green mt-1.5 shrink-0" />
              <span>Test changes in <span className="text-white font-mono">Demo</span> → then <span className="text-white font-mono">Staging</span> → then <span className="text-white font-mono">Production</span>.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-mist-gray">
              <div className="w-1.5 h-1.5 rounded-full bg-iq-neon-green mt-1.5 shrink-0" />
              <span>Use Test Organizations for experiments and demos.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-mist-gray">
              <div className="w-1.5 h-1.5 rounded-full bg-iq-neon-green mt-1.5 shrink-0" />
              <span>Review the Activity Log after major pricing or feature changes.</span>
            </li>
          </ul>
        </div>

        {/* Activity Log */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-gray/20 pb-2 mb-3">Recent Actions</h4>
          <div className="space-y-0 max-h-[200px] overflow-y-auto pr-2">
            {logs.length === 0 && (
              <div className="text-xs text-mist-gray py-2">No recent activity.</div>
            )}
            {logs.map((log, i) => {
              const isDanger = log.is_danger;
              const env = log.env?.toUpperCase() || 'PROD';
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-gray/10 last:border-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs text-mist-gray font-mono w-20 shrink-0">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                    <span className={`text-sm truncate ${isDanger ? 'text-crimson-danger' : 'text-white'}`}>
                      {log.action} <span className="text-mist-gray text-xs">by {log.actor}</span>
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] h-5 px-2 border-opacity-30 bg-opacity-10 ml-2 shrink-0
                      ${env === 'PROD' || env === 'PRODUCTION' ? 'border-crimson-danger text-crimson-danger bg-crimson-danger' : 
                        env === 'STAGING' || env === 'STG' ? 'border-amber-warning text-amber-warning bg-amber-warning' : 
                        'border-iq-neon-green text-iq-neon-green bg-iq-neon-green'}`}
                  >
                    {env}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
