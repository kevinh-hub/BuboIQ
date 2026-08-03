import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import UserSidebar from './UserSidebar';
import { useApp } from '../App';
import { User as UserIcon, Bell, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfile() {
  const { user } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    ticketAssigned: true,
    ticketResolved: true,
    weeklyDigest: false
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the profile
    toast.success('Profile updated!');
  };

  const handleSaveNotifications = () => {
    // Here you would typically make an API call to update notification preferences
    toast.success('Preferences saved!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.currentPassword || !profileData.newPassword) {
      toast.error('Fill in all password fields');
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error('Passwords don\'t match');
      return;
    }

    if (profileData.newPassword.length < 8) {
      toast.error('Password needs 8+ characters');
      return;
    }

    // Here you would typically make an API call to change the password
    toast.success('Password changed!');
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">Manage your account</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl space-y-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your info</CardTitle>
                <CardDescription>
                  Update your details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter your department"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This email will be used for ticket notifications and account communications
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="btn-cta-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="btn-cta-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailUpdates" className="text-base">Email Updates</Label>
                      <p className="text-sm text-gray-500">Receive email notifications for ticket updates</p>
                    </div>
                    <Switch
                      id="emailUpdates"
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailUpdates: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ticketAssigned" className="text-base">Ticket Status Changes</Label>
                      <p className="text-sm text-gray-500">Get notified when your tickets are assigned or updated</p>
                    </div>
                    <Switch
                      id="ticketAssigned"
                      checked={notifications.ticketAssigned}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, ticketAssigned: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ticketResolved" className="text-base">Fix notifications</Label>
                      <p className="text-sm text-gray-500">Get notified when your issues are fixed</p>
                    </div>
                    <Switch
                      id="ticketResolved"
                      checked={notifications.ticketResolved}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, ticketResolved: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyDigest" className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-gray-500">Receive a weekly summary of your ticket activity</p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveNotifications} className="btn-cta-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account details and role information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">User ID</Label>
                    <p className="font-mono text-gray-900">{user?.id}</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-600">Role</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-blue-700 capitalize">{user?.role}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-600">Member Since</Label>
                    <p className="text-gray-900">January 15, 2024</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-600">Last Login</Label>
                    <p className="text-gray-900">Today at 9:24 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}