import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Building, ArrowUpRight, UserCog } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { useAuth } from '../../../../context/AuthContext';
import { projectId } from '../../../../utils/supabase/info';

interface OrgTestAccountsCardProps {
  onOpenManager?: () => void;
}

export const OrgTestAccountsCard: React.FC<OrgTestAccountsCardProps> = ({ onOpenManager }) => {
  const { session } = useAuth();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/organizations`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrgs(data.organizations || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, [session]);

  const testOrgs = orgs.filter(o => o.name.toLowerCase().includes('test') || o.name.toLowerCase().includes('demo'));
  const displayOrgs = testOrgs.length > 0 ? testOrgs.slice(0, 4) : orgs.slice(0, 4);

  return (
    <Card className="bubo-glass border-slate-gray/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-prediction-purple/10 rounded-lg">
              <Building className="w-5 h-5 text-prediction-purple" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Organizations</CardTitle>
              <p className="text-xs text-mist-gray">Manage client environments</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-8 mb-6">
          <div>
            <div className="text-2xl font-bold text-white">{loading ? '-' : orgs.length}</div>
            <div className="text-[10px] text-mist-gray uppercase tracking-wider">Total Orgs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{loading ? '-' : testOrgs.length}</div>
            <div className="text-[10px] text-mist-gray uppercase tracking-wider">Test Orgs</div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold text-mist-gray uppercase mb-2">Key Test Accounts</div>
          {displayOrgs.map((org, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:border-slate-gray/30 transition-colors group">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'active' ? 'bg-prediction-purple' : 'bg-slate-gray'}`} />
                <span className="text-xs text-white font-medium truncate max-w-[120px]">{org.name}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-mist-gray hover:text-white">
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-mist-gray hover:text-white">
                  <UserCog className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {displayOrgs.length === 0 && !loading && (
            <div className="text-xs text-mist-gray italic">No organizations found.</div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full border-slate-gray/30 text-white hover:bg-white/5"
          onClick={onOpenManager}
        >
          Open Organization Manager
        </Button>
      </CardContent>
    </Card>
  );
};
