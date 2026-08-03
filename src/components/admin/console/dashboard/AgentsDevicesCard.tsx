import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Server, Download, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { useAuth } from '../../../../context/AuthContext';
import { projectId } from '../../../../utils/supabase/info';
import { toast } from 'sonner';

export const AgentsDevicesCard = () => {
  const { session } = useAuth();
  const [stats, setStats] = useState({ onlineAgents: 0, totalDevices: 0, totalAgents: 0 });
  const [platform, setPlatform] = useState('windows');
  const [loading, setLoading] = useState(false);

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

  const handleDownload = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents/download/${platform}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.success) {
        window.open(data.download_url, '_blank');
        toast.success(`Generated ${platform} installer`);
      } else {
        toast.error('Failed to generate installer');
      }
    } catch (e) {
      toast.error('Error generating installer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bubo-glass border-slate-gray/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-accent/10 rounded-lg">
            <Server className="w-5 h-5 text-cyan-accent" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Agents & Devices</CardTitle>
            <p className="text-xs text-mist-gray">Deployment & Posture</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-iq-neon-green animate-pulse" />
              <span className="text-xs text-iq-neon-green">{stats.onlineAgents} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-gray" />
              <span className="text-xs text-mist-gray">{stats.totalAgents - stats.onlineAgents} Offline</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.totalDevices}</div>
            <div className="text-[10px] text-mist-gray uppercase tracking-wider">Total Devices</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between border-slate-gray/30 text-white hover:bg-white/5">
            <span>View Agents Dashboard</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Button>

          <div className="flex gap-2">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="h-9 bg-dark-midnight border-slate-gray/30 text-xs w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="flex-1 h-9 bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent/20 border border-cyan-accent/30 text-xs"
              onClick={handleDownload}
              disabled={loading}
            >
              <Download className="w-3 h-3 mr-2" />
              {loading ? 'Generating...' : 'Generate Installer'}
            </Button>
          </div>
          
          <p className="text-[10px] text-mist-gray text-center pt-2">
            Control agent deployment, posture checks, and registration keys.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
