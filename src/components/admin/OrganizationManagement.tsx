import React, { useEffect, useState } from 'react';
import { 
  Building, 
  Plus, 
  Users, 
  Settings, 
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Edit,
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

interface Organization {
  id: string;
  name: string;
  domain: string | null;
  tier: 'starter' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'inactive';
  createdAt: string;
  settings?: {
    maxUsers: number;
    maxDevices: number;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  org_id: string;
  tier: string;
  createdAt: string;
}

export const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showViewUsersModal, setShowViewUsersModal] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  // Form state for creating organization
  const [newOrg, setNewOrg] = useState({
    name: '',
    domain: '',
    tier: 'starter' as Organization['tier'],
    status: 'active' as Organization['status']
  });

  // Form state for creating user
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'owner',
    password: '',
    tier: 'starter'
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Not authenticated. Please log in again.');
        toast.error('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/organizations`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Organizations API response:', data);
      
      if (data.success) {
        setOrganizations(data.organizations || []);
        console.log('Loaded organizations:', data.organizations?.length || 0);
      } else {
        setError(data.error || 'Failed to load organizations');
        toast.error(data.error || 'Failed to load organizations');
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to load organizations';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgUsers = async (orgId: string) => {
    try {
      // Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/organizations/${orgId}/users`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setOrgUsers(data.users || []);
      } else {
        toast.error(data.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrg.name) {
      toast.error('Organization name is required');
      return;
    }

    try {
      // Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/organizations/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(newOrg)
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success('Organization created successfully');
        setShowCreateOrgModal(false);
        setNewOrg({ name: '', domain: '', tier: 'starter', status: 'active' });
        loadOrganizations();
      } else {
        toast.error(data.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
      toast.error('Failed to create organization');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !selectedOrg) {
      toast.error('Email and organization are required');
      return;
    }

    try {
      // Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/organizations/${selectedOrg.id}/users/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(newUser)
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setCreatedPassword(data.defaultPassword);
        toast.success('User created successfully');
        setNewUser({ email: '', name: '', role: 'owner', password: '', tier: 'starter' });
        // Reload org users if viewing that org
        if (showViewUsersModal) {
          loadOrgUsers(selectedOrg.id);
        }
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleViewUsers = async (org: Organization) => {
    setSelectedOrg(org);
    await loadOrgUsers(org.id);
    setShowViewUsersModal(true);
  };

  const handleAddUserToOrg = (org: Organization) => {
    setSelectedOrg(org);
    setNewUser({ 
      ...newUser, 
      tier: org.tier // Default to org's tier
    });
    setShowCreateUserModal(true);
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.domain && org.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTierBadge = (tier: string) => {
    const colors = {
      starter: 'bg-slate-gray/20 text-slate-gray border-slate-gray/30',
      pro: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
      team: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
      enterprise: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30'
    };
    return <Badge className={colors[tier] || colors.starter}>{tier.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-gray border-t-iq-neon-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-terminal-white">Organization Management</h2>
          <p className="text-mist-gray">Create and manage test organizations and accounts</p>
        </div>
        <Button
          onClick={() => setShowCreateOrgModal(true)}
          className="bg-iq-neon-green/20 text-iq-neon-green hover:bg-iq-neon-green/30 border border-iq-neon-green/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mist-gray" />
        <Input
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-midnight border-slate-gray text-terminal-white"
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrgs.map((org) => (
          <Card key={org.id} className="bg-slate-midnight border-slate-gray p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-electric-blue" />
                  <h3 className="text-terminal-white font-medium">{org.name}</h3>
                </div>
                {getStatusBadge(org.status)}
              </div>

              {org.domain && (
                <p className="text-sm text-mist-gray">{org.domain}</p>
              )}

              <div className="flex items-center space-x-2">
                {getTierBadge(org.tier)}
                <span className="text-xs text-mist-gray">
                  Created {new Date(org.createdAt).toLocaleDateString()}
                </span>
              </div>

              {org.settings && (
                <div className="text-xs text-mist-gray space-y-1 pt-2 border-t border-slate-gray">
                  <div>Max Users: {org.settings.maxUsers === -1 ? '∞' : org.settings.maxUsers}</div>
                  <div>Max Devices: {org.settings.maxDevices === -1 ? '∞' : org.settings.maxDevices}</div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewUsers(org)}
                  className="flex-1 text-electric-blue border-electric-blue/30 hover:bg-electric-blue/10"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Users
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddUserToOrg(org)}
                  className="flex-1 text-iq-neon-green border-iq-neon-green/30 hover:bg-iq-neon-green/10"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add User
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-mist-gray mx-auto mb-4" />
          <h3 className="text-terminal-white mb-2">No organizations found</h3>
          <p className="text-mist-gray mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first test organization'}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setShowCreateOrgModal(true)}
              className="bg-iq-neon-green/20 text-iq-neon-green hover:bg-iq-neon-green/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          )}
        </div>
      )}

      {/* Create Organization Modal */}
      <Dialog open={showCreateOrgModal} onOpenChange={setShowCreateOrgModal}>
        <DialogContent className="bg-slate-midnight border-slate-gray text-terminal-white">
          <DialogHeader>
            <DialogTitle>Create Test Organization</DialogTitle>
            <DialogDescription className="text-mist-gray">
              Create a new organization for testing BuboIQ features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="org-name">Organization Name *</Label>
              <Input
                id="org-name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                placeholder="Acme Corp"
                className="bg-dark-midnight border-slate-gray text-terminal-white"
              />
            </div>

            <div>
              <Label htmlFor="org-domain">Domain (optional)</Label>
              <Input
                id="org-domain"
                value={newOrg.domain}
                onChange={(e) => setNewOrg({ ...newOrg, domain: e.target.value })}
                placeholder="acme.com"
                className="bg-dark-midnight border-slate-gray text-terminal-white"
              />
            </div>

            <div>
              <Label htmlFor="org-tier">Tier</Label>
              <Select
                value={newOrg.tier}
                onValueChange={(value: any) => setNewOrg({ ...newOrg, tier: value })}
              >
                <SelectTrigger className="bg-dark-midnight border-slate-gray text-terminal-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="org-status">Status</Label>
              <Select
                value={newOrg.status}
                onValueChange={(value: any) => setNewOrg({ ...newOrg, status: value })}
              >
                <SelectTrigger className="bg-dark-midnight border-slate-gray text-terminal-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateOrgModal(false)}
              className="border-slate-gray text-mist-gray"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrganization}
              className="bg-iq-neon-green text-dark-midnight hover:bg-iq-neon-green/90"
            >
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={showCreateUserModal} onOpenChange={(open) => {
        setShowCreateUserModal(open);
        if (!open) {
          setCreatedPassword(null);
        }
      }}>
        <DialogContent className="bg-slate-midnight border-slate-gray text-terminal-white">
          <DialogHeader>
            <DialogTitle>Add User to {selectedOrg?.name}</DialogTitle>
            <DialogDescription className="text-mist-gray">
              Create a new test user account in this organization
            </DialogDescription>
          </DialogHeader>

          {createdPassword ? (
            <div className="space-y-4">
              <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-lg p-4">
                <h4 className="text-iq-neon-green font-medium mb-2">User Created Successfully!</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-mist-gray">Email:</span>
                    <span className="text-terminal-white ml-2 font-mono">{newUser.email}</span>
                  </div>
                  <div>
                    <span className="text-mist-gray">Password:</span>
                    <span className="text-terminal-white ml-2 font-mono">{createdPassword}</span>
                  </div>
                  <p className="text-xs text-mist-gray mt-3">
                    Save these credentials now - you won't see them again!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-email">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@acme.com"
                  className="bg-dark-midnight border-slate-gray text-terminal-white"
                />
              </div>

              <div>
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-dark-midnight border-slate-gray text-terminal-white"
                />
              </div>

              <div>
                <Label htmlFor="user-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="bg-dark-midnight border-slate-gray text-terminal-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-password">Password (leave empty for default)</Label>
                <Input
                  id="user-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Default: Welcome123!"
                  className="bg-dark-midnight border-slate-gray text-terminal-white"
                />
              </div>

              <div>
                <Label htmlFor="user-tier">Tier</Label>
                <Select
                  value={newUser.tier}
                  onValueChange={(value) => setNewUser({ ...newUser, tier: value })}
                >
                  <SelectTrigger className="bg-dark-midnight border-slate-gray text-terminal-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            {createdPassword ? (
              <Button
                onClick={() => {
                  setShowCreateUserModal(false);
                  setCreatedPassword(null);
                  setNewUser({ email: '', name: '', role: 'owner', password: '', tier: 'starter' });
                }}
                className="bg-iq-neon-green text-dark-midnight hover:bg-iq-neon-green/90"
              >
                Done
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateUserModal(false)}
                  className="border-slate-gray text-mist-gray"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="bg-iq-neon-green text-dark-midnight hover:bg-iq-neon-green/90"
                >
                  Create User
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Users Modal */}
      <Dialog open={showViewUsersModal} onOpenChange={setShowViewUsersModal}>
        <DialogContent className="bg-slate-midnight border-slate-gray text-terminal-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Users in {selectedOrg?.name}</DialogTitle>
            <DialogDescription className="text-mist-gray">
              {orgUsers.length} user{orgUsers.length !== 1 ? 's' : ''} in this organization
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {orgUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-mist-gray mx-auto mb-2" />
                <p className="text-mist-gray">No users in this organization yet</p>
              </div>
            ) : (
              orgUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-dark-midnight border border-slate-gray rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-terminal-white font-medium">{user.name}</h4>
                      <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-mist-gray">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTierBadge(user.tier)}
                      <span className="text-xs text-mist-gray">
                        Created {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowViewUsersModal(false)}
              className="border-slate-gray text-mist-gray"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowViewUsersModal(false);
                handleAddUserToOrg(selectedOrg!);
              }}
              className="bg-iq-neon-green text-dark-midnight hover:bg-iq-neon-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};