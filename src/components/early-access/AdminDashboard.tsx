/**
 * Early Access Admin Dashboard
 * 
 * Super admin interface for managing Early Access program:
 * - View stats and cohort status
 * - Create/revoke invites
 * - Manage cohort settings
 * - Monitor redemptions
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Copy, Ban, Mail, Search, Filter, 
  TrendingUp, Users, HardDrive, Clock, AlertCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { EABadge, CountdownBadge } from './EABadges';
import { CreateInviteModal } from './CreateInviteModal';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface CohortStats {
  invitesAvailable: number;
  invitesRedeemed: number;
  invitesExpired: number;
  invitesRevoked: number;
  totalInvites: number;
}

interface CohortConfig {
  orgCap: number;
  deviceCap: number;
  closesAt: string | null;
  emergencyClosed: boolean;
  autoExpireInvites: boolean;
  currentOrgs: number;
  currentDevices: number;
}

interface Invite {
  id: string;
  token: string;
  email: string | null;
  plan_name: string;
  devices_included: number;
  overage_rate: number;
  days_valid: number;
  expires_at: string;
  status: 'unused' | 'redeemed' | 'expired' | 'revoked';
  notes: string | null;
  redeemed_at: string | null;
  redeemed_by_user_id: string | null;
  created_at: string;
  revoked_at: string | null;
  revoke_reason: string | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<CohortStats | null>(null);
  const [cohort, setCohort] = useState<CohortConfig | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load stats
      const statsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/admin/stats`,
        { headers }
      );
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setCohort(data.cohort);
      }

      // Load invites
      const invitesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/admin/invites`,
        { headers }
      );
      
      if (invitesRes.ok) {
        const data = await invitesRes.json();
        setInvites(data.invites || []);
      }
    } catch (error) {
      console.error('[EA Admin] Load error:', error);
      toast.error('Failed to load Early Access data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/invite/ea?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Invite link copied to clipboard');
  };

  const handleRevoke = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this invite? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('supabase.auth.token');
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/admin/revoke/${inviteId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: 'Revoked by admin' })
        }
      );

      if (res.ok) {
        toast.success('Invite revoked successfully');
        loadData();
      } else {
        throw new Error('Failed to revoke invite');
      }
    } catch (error) {
      console.error('[EA Admin] Revoke error:', error);
      toast.error('Failed to revoke invite');
    }
  };

  const handleUpdateCohort = async (updates: Partial<CohortConfig>) => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/admin/cohort`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (res.ok) {
        toast.success('Cohort settings updated');
        loadData();
      } else {
        throw new Error('Failed to update cohort');
      }
    } catch (error) {
      console.error('[EA Admin] Update cohort error:', error);
      toast.error('Failed to update cohort settings');
    }
  };

  const filteredInvites = invites.filter(invite => {
    const matchesSearch = !searchQuery || 
      invite.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.token.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || invite.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#00FF85] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-cloud-white font-inter">Loading Early Access Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-midnight py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white mb-2">
              Early Access Dashboard
            </h1>
            <p className="text-mist-gray font-inter">
              Manage invite-only, time-gated Early Access program
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bubo-btn-neon-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Invite
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-[#00FF85]" />
            </div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              {stats?.invitesAvailable || 0}
            </div>
            <div className="text-sm text-mist-gray mt-1">Invites Available</div>
          </Card>

          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-[#00FF85]" />
            </div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              {stats?.invitesRedeemed || 0}
            </div>
            <div className="text-sm text-mist-gray mt-1">Invites Redeemed</div>
          </Card>

          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-[#1E90FF]" />
            </div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              {cohort?.currentOrgs || 0} / {cohort?.orgCap || 0}
            </div>
            <div className="text-sm text-mist-gray mt-1">EA Orgs / Cap</div>
          </Card>

          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-5 h-5 text-[#1E90FF]" />
            </div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              {cohort?.currentDevices || 0} / {cohort?.deviceCap || 0}
            </div>
            <div className="text-sm text-mist-gray mt-1">Total Devices / Cap</div>
          </Card>

          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              {stats?.invitesExpired || 0}
            </div>
            <div className="text-sm text-mist-gray mt-1">Expired Invites</div>
          </Card>
        </div>

        {/* Cohort Controls */}
        <Card className="bubo-glass p-6">
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-4">
            Cohort Controls
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-mist-gray mb-2">Organization Cap</label>
              <Input 
                type="number" 
                value={cohort?.orgCap || 0}
                onChange={(e) => setCohort(prev => prev ? {...prev, orgCap: parseInt(e.target.value)} : null)}
                className="bg-surface-dark border-slate-gray/30 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-mist-gray mb-2">Device Cap</label>
              <Input 
                type="number" 
                value={cohort?.deviceCap || 0}
                onChange={(e) => setCohort(prev => prev ? {...prev, deviceCap: parseInt(e.target.value)} : null)}
                className="bg-surface-dark border-slate-gray/30 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-mist-gray mb-2">Cohort Closes At</label>
              <Input 
                type="datetime-local" 
                value={cohort?.closesAt ? new Date(cohort.closesAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => setCohort(prev => prev ? {...prev, closesAt: e.target.value} : null)}
                className="bg-surface-dark border-slate-gray/30 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-cloud-white cursor-pointer">
              <input 
                type="checkbox" 
                checked={cohort?.emergencyClosed || false}
                onChange={(e) => setCohort(prev => prev ? {...prev, emergencyClosed: e.target.checked} : null)}
                className="w-4 h-4 rounded border-slate-gray/30 text-[#00FF85] focus:ring-[#00FF85]"
              />
              <span className="text-sm">Emergency Close (kills redemption instantly)</span>
            </label>

            <label className="flex items-center gap-2 text-cloud-white cursor-pointer">
              <input 
                type="checkbox" 
                checked={cohort?.autoExpireInvites || false}
                onChange={(e) => setCohort(prev => prev ? {...prev, autoExpireInvites: e.target.checked} : null)}
                className="w-4 h-4 rounded border-slate-gray/30 text-[#00FF85] focus:ring-[#00FF85]"
              />
              <span className="text-sm">Auto-expire invites</span>
            </label>
          </div>

          <Button 
            onClick={() => handleUpdateCohort(cohort || {})}
            className="bubo-btn-neon-primary"
          >
            Save Limits
          </Button>

          <p className="text-sm text-mist-gray mt-4">
            Early Access is invite-only. Single-use links expire automatically. You can close the cohort at any time.
          </p>
        </Card>

        {/* Invites Table */}
        <Card className="bubo-glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Invites
            </h3>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-gray" />
                <Input 
                  placeholder="Search by email or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-surface-dark border-slate-gray/30 text-white w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-surface-dark border border-slate-gray/30 text-white"
              >
                <option value="all">All Status</option>
                <option value="unused">Unused</option>
                <option value="redeemed">Redeemed</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>

          {filteredInvites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mist-gray mb-4">No invites found</p>
              <Button onClick={() => setShowCreateModal(true)} className="bubo-btn-neon-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Invite
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-gray/30">
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Devices</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Overage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Expires</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-mist-gray">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvites.map((invite) => (
                    <tr key={invite.id} className="border-b border-slate-gray/20 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <span className="text-cloud-white font-inter text-sm">
                          {invite.email || <span className="text-mist-gray italic">Open invite</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20">
                          {invite.plan_name}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-cloud-white font-jetbrains-mono text-sm">
                        {invite.devices_included}
                      </td>
                      <td className="py-3 px-4 text-cloud-white font-jetbrains-mono text-sm">
                        ${invite.overage_rate.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <CountdownBadge expiresAt={invite.expires_at} />
                      </td>
                      <td className="py-3 px-4">
                        <EABadge type={invite.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {invite.status === 'unused' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyLink(invite.token)}
                                className="text-[#00FF85] hover:text-white"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRevoke(invite.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Create Invite Modal */}
      {showCreateModal && (
        <CreateInviteModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}