import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Key,
  Webhook,
  History,
  LogOut,
  ChevronRight,
  Save,
  Laptop,
  Mail,
  Smartphone
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';

// Import sub-components
import { UserManagement } from '../../admin/UserManagement';
import { OrganizationManagement } from '../../admin/OrganizationManagement';
import { FeatureControls } from '../../admin/FeatureControls';
import { BillingSettings } from '../../settings/BillingSettings';
import { UserPreferences } from '../../settings/UserPreferences';
import { defaultUserPreferences } from '../../settings/UserPreferences';

interface SettingsPageProps {
  user: any;
  onNavigate: (route: string, options?: any) => void;
  options?: any;
}

type SettingsSection = 
  | 'profile' 
  | 'security' 
  | 'company' 
  | 'team' 
  | 'billing' 
  | 'notifications' 
  | 'api' 
  | 'audit'
  | 'organizations-admin' // Test organizations
  | 'feature-controls'; // Super admin feature controls

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigate, options }) => {
  const { signOut } = useAuth();
  
  // Helper to resolve tab to section
  const resolveSection = (tab?: string): SettingsSection => {
    if (!tab) return 'profile';
    const tabMap: Record<string, SettingsSection> = {
      'users': 'team',
      'team': 'team',
      'billing': 'billing',
      'preferences': 'profile',
      'notifications': 'notifications',
      'company': 'company',
      'organization': 'company',
      'audit': 'audit',
      'api': 'api',
      'security': 'security',
      'profile': 'profile',
      'organizations-admin': 'organizations-admin', // Add mapping
      'feature-controls': 'feature-controls'
    };
    return tabMap[tab] || 'profile';
  };

  // Initialize state directly from options to avoid effect delay
  const [activeSection, setActiveSection] = useState<SettingsSection>(() => resolveSection(options?.tab));

  // Keep synced if options change while mounted
  useEffect(() => {
    const targetSection = resolveSection(options?.tab);
    if (targetSection !== activeSection) {
      setActiveSection(targetSection);
    }
  }, [options?.tab]);

  const menuItems = [
    {
      heading: 'Account',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      heading: 'Organization',
      items: [
        { id: 'company', label: 'General', icon: Building },
        { id: 'team', label: 'Team Members', icon: User, badge: 'Admin' },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard, badge: 'Owner' },
      ]
    },
    // Add Super Admin section if user is super admin
    ...(user?.db_role === 'super_admin' ? [{
      heading: 'Super Admin',
      items: [
        { id: 'organizations-admin', label: 'Test Organizations', icon: Building, badge: 'Super Admin' },
        { id: 'feature-controls', label: 'Feature Controls', icon: Shield, badge: 'Super Admin' },
      ]
    }] : []),
    {
      heading: 'Developers',
      items: [
        { id: 'api', label: 'API & Webhooks', icon: Webhook },
        { id: 'audit', label: 'Audit Log', icon: History },
      ]
    }
  ];

  const renderContent = () => {
    // Safety check - ensure user exists
    if (!user) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-mist-gray">Loading user data...</p>
          </div>
        </div>
      );
    }

    try {
      switch (activeSection) {
        case 'profile':
          return <ProfileSettings user={user} />;
        case 'security':
          return <SecuritySettings user={user} />;
        case 'notifications':
          return <NotificationsSettings />;
        case 'company':
          return <OrganizationSettings user={user} />;
        case 'team':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Team Members</h2>
                <p className="text-mist-gray">Manage access and roles for your team.</p>
              </div>
              <UserManagement />
            </div>
          );
        case 'billing':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Billing & Subscription</h2>
                <p className="text-mist-gray">Manage your plan and payment methods.</p>
              </div>
              <BillingSettings />
            </div>
          );
        case 'organizations-admin':
          // Only render if user is super admin
          if (user?.db_role !== 'super_admin') {
            return (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-mist-gray">Access denied. Super Admin privileges required.</p>
                </div>
              </div>
            );
          }
          return <OrganizationManagement />;
        case 'feature-controls':
          // Only render if user is super admin
          if (user?.db_role !== 'super_admin') {
            return (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-mist-gray">Access denied. Super Admin privileges required.</p>
                </div>
              </div>
            );
          }
          return <FeatureControls />;
        case 'api':
          return <ApiSettings />;
        case 'audit':
          return <AuditSettings />;
        default:
          return <ProfileSettings user={user} />;
      }
    } catch (error) {
      console.error('Error rendering settings section:', error);
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-crimson-danger mb-2">Error loading settings</p>
            <p className="text-mist-gray text-sm">Please try refreshing the page</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-dark-midnight">
      {/* Content Area - Internal Sidebar Removed */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 bg-gradient-to-br from-dark-midnight via-dark-midnight/95 to-[#0A0F1E]">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Sections ---

const ProfileSettings = ({ user }: { user: any }) => {
  // Safety check
  if (!user) return null;
  
  const displayName = user.name || user.email || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Profile Settings</h2>
        <p className="text-mist-gray">Manage your personal information and preferences.</p>
      </div>

      <Card className="bubo-glass border-slate-gray/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-8">
            <Avatar className="w-20 h-20 border-2 border-slate-gray/50">
              <AvatarFallback className="bg-iq-neon-green/20 text-iq-neon-green text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">{displayName}</h3>
              <p className="text-sm text-mist-gray">{user.email}</p>
              <Badge variant="outline" className="mt-2 border-iq-neon-green/30 text-iq-neon-green capitalize">
                {user.role || 'tech'}
              </Badge>
            </div>
            <Button variant="outline" className="ml-auto border-slate-gray/30 text-white hover:bg-white/5">
              Change Avatar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Full Name</Label>
              <Input defaultValue={displayName} className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email Address</Label>
              <Input defaultValue={user.email} disabled className="bg-dark-midnight/30 border-slate-gray/30 text-mist-gray cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Job Title</Label>
              <Input placeholder="e.g. Senior IT Manager" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Phone Number</Label>
              <Input placeholder="+1 (555) 000-0000" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bubo-btn-neon-primary">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SecuritySettings = ({ user }: { user: any }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Security</h2>
        <p className="text-mist-gray">Protect your account and data.</p>
      </div>

      <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Password</CardTitle>
          <CardDescription className="text-mist-gray">Update your password associated with your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Current Password</Label>
            <Input type="password" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">New Password</Label>
              <Input type="password" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Confirm New Password</Label>
              <Input type="password" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="bubo-btn-neon-primary">Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-mist-gray">Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-iq-neon-green/10 rounded-full">
              <Shield className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-medium">Two-factor authentication is currently off</p>
              <p className="text-sm text-mist-gray">We recommend enabling 2FA for higher security.</p>
            </div>
          </div>
          <Button variant="outline" className="border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10">
            Enable 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsSettings = () => {
  const [preferences, setPreferences] = useState(defaultUserPreferences);

  // We are reusing the logic from UserPreferences but rendering a customized view here if needed.
  // For now, we can just wrap the existing component or build a simpler one.
  // Let's use the existing complex one as it's quite "useful".
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Notifications</h2>
        <p className="text-mist-gray">Configure how and when you get alerted.</p>
      </div>
      <UserPreferences 
        settings={preferences} 
        onUpdate={setPreferences} 
        onSave={() => toast.success("Notification preferences saved")} 
      />
    </div>
  );
};

const OrganizationSettings = ({ user }: { user: any }) => {
  // Safety check
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Organization</h2>
        <p className="text-mist-gray">Manage your company details and branding.</p>
      </div>

      <Card className="bubo-glass border-slate-gray/30">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Company Name</Label>
              <Input defaultValue="Acme Corp" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Support Email</Label>
              <Input defaultValue="support@acme.com" className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Technical Contact</Label>
              <Input defaultValue={user.name || ''} className="bg-dark-midnight/50 border-slate-gray/30 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="bg-dark-midnight/50 border-slate-gray/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  <SelectItem value="est">EST (GMT-5)</SelectItem>
                  <SelectItem value="pst">PST (GMT-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Address</Label>
            <Textarea className="bg-dark-midnight/50 border-slate-gray/30 text-white min-h-[80px]" placeholder="123 Tech Blvd..." />
          </div>

          <div className="flex justify-end">
            <Button className="bubo-btn-neon-primary">Save Organization</Button>
          </div>
        </CardContent>
      </Card>

       <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Danger Zone</CardTitle>
          <CardDescription className="text-mist-gray">Irreversible actions for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="border border-crimson-danger/30 rounded-lg p-4 flex items-center justify-between bg-crimson-danger/5">
             <div>
               <h4 className="text-crimson-danger font-bold">Delete Organization</h4>
               <p className="text-sm text-crimson-danger/70">This will permanently delete all data, tickets, and devices.</p>
             </div>
             <Button variant="destructive" className="bg-crimson-danger hover:bg-crimson-danger/80 text-white">
               Delete
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ApiSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">API & Integrations</h2>
        <p className="text-mist-gray">Connect BuboIQ with your other tools.</p>
      </div>

      <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white">API Keys</CardTitle>
          <CardDescription className="text-mist-gray">Manage keys for accessing the BuboIQ API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-dark-midnight/50 border border-slate-gray/30 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono text-sm">sk_live_...4x9k</span>
                <Badge variant="outline" className="text-iq-neon-green border-iq-neon-green/30 text-[10px]">Active</Badge>
              </div>
              <p className="text-xs text-mist-gray">Created on Nov 12, 2023</p>
            </div>
            <Button variant="ghost" size="sm" className="text-crimson-danger hover:bg-crimson-danger/10">Revoke</Button>
          </div>
          <Button variant="outline" className="w-full border-slate-gray/30 text-white hover:bg-white/5">
            <Key className="w-4 h-4 mr-2" />
            Generate New API Key
          </Button>
        </CardContent>
      </Card>

      <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Webhooks</CardTitle>
          <CardDescription className="text-mist-gray">Receive real-time events from BuboIQ.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex flex-col items-center justify-center py-8 text-center">
             <Webhook className="w-12 h-12 text-slate-gray mb-3" />
             <h3 className="text-white font-medium">No webhooks configured</h3>
             <p className="text-sm text-mist-gray max-w-xs mb-4">Add a webhook endpoint to receive real-time updates about tickets and devices.</p>
             <Button className="bubo-btn-neon-primary">Add Webhook</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AuditSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Audit Log</h2>
        <p className="text-mist-gray">View recent activity within your organization.</p>
      </div>

      <Card className="bubo-glass border-slate-gray/30">
        <CardContent className="p-0">
          <div className="rounded-md border border-slate-gray/20 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-mist-gray font-medium">
                <tr>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-gray/20">
                {[
                  { actor: 'Kevin H', action: 'Updated settings', resource: 'Organization', date: 'Just now' },
                  { actor: 'System', action: 'Ran automation', resource: 'Device Cleanup', date: '2h ago' },
                  { actor: 'Sarah C', action: 'Deleted user', resource: 'User: John Doe', date: '1d ago' },
                  { actor: 'Kevin H', action: 'Created ticket', resource: 'Ticket #1023', date: '2d ago' },
                  { actor: 'System', action: 'Health check', resource: 'Server Alpha', date: '2d ago' },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{log.actor}</td>
                    <td className="px-4 py-3 text-cloud-white">{log.action}</td>
                    <td className="px-4 py-3 text-mist-gray">{log.resource}</td>
                    <td className="px-4 py-3 text-right text-mist-gray">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Removed local FeatureControls component to use the imported one from ../../admin/FeatureControls