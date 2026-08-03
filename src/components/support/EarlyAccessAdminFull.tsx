// EA Admin - Cohort & Invites Management
// BuboIQ - Complete Early Access Admin Interface
import React, { useState } from 'react';
import { Plus, Copy, Check, Calendar, AlertCircle, Settings, Users, Link as LinkIcon, Mail, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';

interface Invite {
  id: string;
  email: string | null;
  plan: string;
  devicesIncluded: number;
  overageRate: string;
  expiresAt: string;
  status: 'Unused' | 'Redeemed' | 'Expired' | 'Revoked';
  link: string;
  notes: string;
  createdAt: string;
}

export const EarlyAccessAdminFull: React.FC = () => {
  const [cohortCloseDate, setCohortCloseDate] = useState('2025-02-15T23:59');
  const [orgCap, setOrgCap] = useState('50');
  const [deviceCap, setDeviceCap] = useState('5000');
  const [emergencyClose, setEmergencyClose] = useState(false);
  const [autoExpire, setAutoExpire] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Create invite form state
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [daysValid, setDaysValid] = useState('10');
  const [selectedPlan, setSelectedPlan] = useState('EA-Pro');
  const [devicesIncluded, setDevicesIncluded] = useState('100');
  const [overageRate, setOverageRate] = useState('0.90');
  const [inviteNotes, setInviteNotes] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  // Sample data
  const [invites, setInvites] = useState<Invite[]>([
    {
      id: 'inv_001',
      email: 'sarah@techcorp.com',
      plan: 'EA-Pro',
      devicesIncluded: 100,
      overageRate: '$0.90',
      expiresAt: '2025-01-05T23:59:59',
      status: 'Unused',
      link: 'https://buboiq.com/invite/ea/abc123def456',
      notes: 'CEO referral - high priority',
      createdAt: '2024-12-26T10:00:00',
    },
    {
      id: 'inv_002',
      email: 'mike@healthplus.com',
      plan: 'EA-Pro',
      devicesIncluded: 100,
      overageRate: '$0.90',
      expiresAt: '2025-01-10T23:59:59',
      status: 'Redeemed',
      link: 'https://buboiq.com/invite/ea/xyz789ghi012',
      notes: 'Healthcare vertical - dental practice',
      createdAt: '2024-12-20T14:30:00',
    },
    {
      id: 'inv_003',
      email: null,
      plan: 'EA-Pro',
      devicesIncluded: 100,
      overageRate: '$0.90',
      expiresAt: '2024-12-28T23:59:59',
      status: 'Expired',
      link: 'https://buboiq.com/invite/ea/jkl345mno678',
      notes: 'Partner demo - not used',
      createdAt: '2024-12-18T09:15:00',
    },
  ]);

  const handleSaveCohort = () => {
    toast.success('Cohort settings saved successfully');
  };

  const handleCopyLink = (inviteId: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedInviteId(inviteId);
    toast.success('Invite link copied to clipboard');
    setTimeout(() => setCopiedInviteId(null), 2000);
  };

  const handleRevokeInvite = (inviteId: string) => {
    setInvites(invites.map(inv => 
      inv.id === inviteId ? { ...inv, status: 'Revoked' as const } : inv
    ));
    toast.success('Invite revoked successfully');
  };

  const handleGenerateInvite = (sendEmail: boolean) => {
    const token = Math.random().toString(36).substring(2, 15);
    const link = `https://buboiq.com/invite/ea/${token}`;
    setGeneratedLink(link);
    
    const newInvite: Invite = {
      id: `inv_${Date.now()}`,
      email: newInviteEmail || null,
      plan: selectedPlan,
      devicesIncluded: parseInt(devicesIncluded),
      overageRate: `$${overageRate}`,
      expiresAt: new Date(Date.now() + parseInt(daysValid) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Unused',
      link,
      notes: inviteNotes,
      createdAt: new Date().toISOString(),
    };
    
    setInvites([newInvite, ...invites]);
    
    if (sendEmail && newInviteEmail) {
      toast.success(`Invite sent to ${newInviteEmail}`);
    } else {
      toast.success('Invite link generated successfully');
    }
  };

  const handleResetForm = () => {
    setNewInviteEmail('');
    setInviteNotes('');
    setGeneratedLink('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unused':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Redeemed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Expired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Revoked':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/20 text-white border-white/30';
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diff < 0) return 'Expired';
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
              <span className="text-white">Early Access</span>{' '}
              <span className="text-[#00FF85]">Admin</span>
            </h1>
            <p className="text-white/60">Manage cohort settings and invitations</p>
          </div>
          
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] font-bold transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,133,0.4)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1E] border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Create</span>{' '}
                  <span className="text-[#00FF85]">Invite</span>
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Generate a new early access invitation link
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Recipient Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah@company.com"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                  />
                  <p className="text-white/40 text-xs mt-1">
                    Leave empty to generate a shareable link
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="days" className="text-white/80">Days Valid</Label>
                    <Input
                      id="days"
                      type="number"
                      value={daysValid}
                      onChange={(e) => setDaysValid(e.target.value)}
                      className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan" className="text-white/80">Plan</Label>
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1E] border-white/20">
                        <SelectItem value="EA-Pro">EA-Pro ($99/mo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="devices" className="text-white/80">Devices Included</Label>
                    <Input
                      id="devices"
                      type="number"
                      value={devicesIncluded}
                      onChange={(e) => setDevicesIncluded(e.target.value)}
                      className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overage" className="text-white/80">Overage Rate ($)</Label>
                    <Input
                      id="overage"
                      type="number"
                      step="0.01"
                      value={overageRate}
                      onChange={(e) => setOverageRate(e.target.value)}
                      className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white/80">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this invite..."
                    value={inviteNotes}
                    onChange={(e) => setInviteNotes(e.target.value)}
                    className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2 min-h-[80px]"
                  />
                </div>

                {generatedLink && (
                  <div className="bg-[#00FF85]/10 border border-[#00FF85]/30 rounded-lg p-4">
                    <Label className="text-[#00FF85] mb-2 block">Generated Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="bg-[#0A0A0A]/60 border-white/10 text-white"
                      />
                      <Button
                        onClick={() => handleCopyLink('new', generatedLink)}
                        className="bg-[#00FF85]/20 hover:bg-[#00FF85]/30 text-[#00FF85]"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Expires: {new Date(Date.now() + parseInt(daysValid) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  onClick={handleResetForm}
                  className="text-white/60 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleGenerateInvite(false)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Generate Link Only
                </Button>
                <Button
                  onClick={() => handleGenerateInvite(true)}
                  disabled={!newInviteEmail}
                  className="bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] disabled:opacity-40"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Generate & Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cohort Controls */}
        <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <Settings className="w-5 h-5 text-[#00FF85]" />
              <span className="text-white">Cohort</span>
              <span className="text-[#00FF85]">Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="closeDate" className="text-white/80">Cohort Closes At</Label>
                <Input
                  id="closeDate"
                  type="datetime-local"
                  value={cohortCloseDate}
                  onChange={(e) => setCohortCloseDate(e.target.value)}
                  className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="orgCap" className="text-white/80">Organization Cap</Label>
                <Input
                  id="orgCap"
                  type="number"
                  value={orgCap}
                  onChange={(e) => setOrgCap(e.target.value)}
                  className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deviceCap" className="text-white/80">Device Cap</Label>
                <Input
                  id="deviceCap"
                  type="number"
                  value={deviceCap}
                  onChange={(e) => setDeviceCap(e.target.value)}
                  className="bg-[#0A0A0A]/60 border-white/10 text-white mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSaveCohort}
                  className="w-full bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30"
                >
                  Save Settings
                </Button>
              </div>
            </div>

            <div className="flex gap-6 p-4 bg-[#0A0A0A]/40 border border-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  id="emergency"
                  checked={emergencyClose}
                  onCheckedChange={setEmergencyClose}
                />
                <Label htmlFor="emergency" className="text-white/80 cursor-pointer">
                  Emergency Close
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="autoExpire"
                  checked={autoExpire}
                  onCheckedChange={setAutoExpire}
                />
                <Label htmlFor="autoExpire" className="text-white/80 cursor-pointer">
                  Auto-expire Invites
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invites Table */}
        <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Users className="w-5 h-5 text-[#00FF85]" />
                <span className="text-white">Active</span>
                <span className="text-[#00FF85]">Invites</span>
              </CardTitle>
              <div className="flex gap-2 text-sm">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {invites.filter(i => i.status === 'Unused').length} Unused
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {invites.filter(i => i.status === 'Redeemed').length} Redeemed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Plan</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Devices</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Overage</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Expires</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        {invite.email ? (
                          <div>
                            <p className="text-white/90 text-sm">{invite.email}</p>
                            {invite.notes && (
                              <p className="text-white/40 text-xs mt-1">{invite.notes}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm italic">No email (link only)</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 text-xs">
                          {invite.plan}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-white/80 text-sm">{invite.devicesIncluded}</td>
                      <td className="py-4 px-4 text-white/80 text-sm">{invite.overageRate}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white/80 text-sm">
                            {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                          <p className="text-white/40 text-xs">
                            {getTimeRemaining(invite.expiresAt)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(invite.status)} border text-xs`}>
                          {invite.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyLink(invite.id, invite.link)}
                            className="text-[#00FF85] hover:text-white hover:bg-[#00FF85]/10"
                          >
                            {copiedInviteId === invite.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          {invite.status === 'Unused' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevokeInvite(invite.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default EarlyAccessAdminFull;
