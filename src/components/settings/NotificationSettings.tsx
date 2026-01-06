import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Mail, Save } from 'lucide-react';
import { NotificationSettings as NotificationSettingsType } from './types';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: NotificationSettingsType) => void;
  onSave: () => void;
}

export default function NotificationSettings({ settings, onUpdate, onSave }: NotificationSettingsProps) {
  const notificationOptions = [
    {
      key: 'emailOnNewTicket' as keyof NotificationSettingsType,
      title: 'New issue',
      description: 'Email me when someone opens an issue'
    },
    {
      key: 'emailOnStatusChange' as keyof NotificationSettingsType,
      title: 'Status changes',
      description: 'Email me when issue status changes'
    },
    {
      key: 'emailOnComment' as keyof NotificationSettingsType,
      title: 'New comments',
      description: 'Email me when someone comments'
    },
    {
      key: 'pushNotifications' as keyof NotificationSettingsType,
      title: 'Browser alerts',
      description: 'Show alerts in browser'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Email alerts</CardTitle>
        </div>
        <CardDescription>
          Choose when to get emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{option.title}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <Switch
              checked={settings[option.key] as boolean}
              onCheckedChange={(checked) => onUpdate({ ...settings, [option.key]: checked })}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <Button 
            onClick={onSave}
            style={{ backgroundColor: '#00C48C' }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}