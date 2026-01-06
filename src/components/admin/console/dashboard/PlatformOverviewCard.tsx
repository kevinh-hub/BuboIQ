import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Activity, Users, Server, AlertCircle, CheckCircle, ShieldAlert, Lock } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { useSuperAdmin } from '../SuperAdminContext';
import { projectId } from '../../../utils/supabase/info';
import { useAuth } from '../../../context/AuthContext';

export const PlatformOverviewCard = () => {
  const { config } = useSuperAdmin();
  const { session } = useAuth();
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalDevices: 0,
    onlineAgents: 0,
    openIssues: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/stats`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, [session]);

  const overridesActive = config?.overrides ? Object.values(config.overrides).some(v => v) : false;
  const complianceEnabled = config?.compliance ? Object.values(config.compliance).some(v => v) : false;
  const readOnly = config?.danger?.readOnlyMode;

  const statItems = [
    { label: 'Total Organizations', value: stats.totalOrgs.toString(), icon: Users, color: 'text-white' },
    { label: 'Active Devices', value: stats.totalDevices.toString(), icon: Server, color: 'text-white' },
    { label: 'Open Issues', value: stats.openIssues.toString(), icon: AlertCircle, color: 'text-amber-warning' },
    { label: 'Online Agents', value: stats.onlineAgents.toString(), icon: Activity, color: 'text-iq-neon-green' },
  ];

  return (
    <Card className="bubo-glass border-slate-gray/30 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-iq-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Platform Overview</h3>
          <div className="flex gap-2">
            {readOnly && (
              <Badge variant="outline" className="border-crimson-danger text-crimson-danger bg-crimson-danger/10 text-[10px] px-2 py-0.5 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only Mode
              </Badge>
            )}
            {overridesActive && (
              <Badge variant="outline" className="border-amber-warning text-amber-warning bg-amber-warning/10 text-[10px] px-2 py-0.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Overrides Active
              </Badge>
            )}
            {!readOnly && !overridesActive && (
              <Badge variant="outline" className="border-iq-neon-green/30 text-iq-neon-green bg-iq-neon-green/10 text-[10px] px-2 py-0.5 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> All systems operational
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className={`p-2 rounded-md bg-dark-midnight border border-white/10 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
                  <div className="text-[10px] text-mist-gray uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
