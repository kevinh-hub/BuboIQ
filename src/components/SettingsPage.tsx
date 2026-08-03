import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Sidebar from './Sidebar';
import CompanySettings from './settings/CompanySettings';
import NotificationSettings from './settings/NotificationSettings';
import SLASettings from './settings/SLASettings';
import BrandingSettings from './settings/BrandingSettings';
import { AppSettings, DEFAULT_SETTINGS } from './settings/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1>Settings</h1>
            <p className="text-gray-600 text-sm mt-1">Configure your TicketEase system</p>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="sla">SLA Settings</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <CompanySettings
                settings={settings.company}
                onUpdate={(companySettings) => setSettings({ ...settings, company: companySettings })}
                onSave={() => handleSave('Company')}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings
                settings={settings.notifications}
                onUpdate={(notificationSettings) => setSettings({ ...settings, notifications: notificationSettings })}
                onSave={() => handleSave('Notification')}
              />
            </TabsContent>

            <TabsContent value="sla" className="space-y-6">
              <SLASettings
                settings={settings.sla}
                onUpdate={(slaSettings) => setSettings({ ...settings, sla: slaSettings })}
                onSave={() => handleSave('SLA')}
              />
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <BrandingSettings
                settings={settings.branding}
                onUpdate={(brandingSettings) => setSettings({ ...settings, branding: brandingSettings })}
                onSave={() => handleSave('Branding')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}