import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { useApp } from '../App';
import Sidebar from './Sidebar';
import { UserPlus, Mail, MoreHorizontal, Shield, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamManagement() {
  const { users } = useApp();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Support' as 'Admin' | 'Support' | 'Viewer'
  });

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock invite functionality
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setInviteForm({ name: '', email: '', role: 'Support' });
    setIsInviteDialogOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Support': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="h-3 w-3" />;
      case 'Support': return <UsersIcon className="h-3 w-3" />;
      default: return <UsersIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Team</h1>
              <p className="text-gray-600 text-sm mt-1">Manage who can access what</p>
            </div>
            
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: '#00C48C' }}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite teammate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite teammate</DialogTitle>
                  <DialogDescription>
                    Send an invite to add someone to your team.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleInviteUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteForm.role} onValueChange={(value: 'Admin' | 'Support' | 'Viewer') => setInviteForm({...inviteForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin - Full access</SelectItem>
                        <SelectItem value="Support">Support - Handle tickets</SelectItem>
                        <SelectItem value="Viewer">Viewer - Read-only access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" style={{ backgroundColor: '#00C48C' }}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <UsersIcon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2 this month</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Agents</CardTitle>
                <UsersIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Support').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active support team
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Admin').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Full access members
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback style={{ backgroundColor: '#00C48C', color: 'white' }}>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            <span className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <span>{user.role}</span>
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      
                      <Select defaultValue={user.role}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Permission</th>
                      <th className="text-center py-3 px-4">Admin</th>
                      <th className="text-center py-3 px-4">Support</th>
                      <th className="text-center py-3 px-4">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">View tickets</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Create tickets</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Update ticket status</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Manage team members</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Access settings</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">View internal notes</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}