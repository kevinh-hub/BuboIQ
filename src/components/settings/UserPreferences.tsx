import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Clock, 
  Bell, 
  AlertTriangle, 
  Settings, 
  Save,
  Phone,
  Mail,
  MessageSquare,
  Zap,
  Users,
  Shield
} from 'lucide-react';

interface UserPreferencesSettings {
  // Business Hours
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    workDays: string[];
  };
  
  // Contact Preferences
  contactMethods: {
    email: boolean;
    sms: boolean;
    teams: boolean;
    slack: boolean;
    primaryMethod: string;
  };
  
  // Notifications
  notifications: {
    criticalIssues: boolean;
    weeklyReports: boolean;
    deviceAlerts: boolean;
    ticketUpdates: boolean;
    quietHours: boolean;
    quietStart: string;
    quietEnd: string;
  };
  
  // Escalation Rules
  escalation: {
    autoEscalate: boolean;
    escalateAfter: string;
    escalateTo: string;
    skipWeekends: boolean;
  };
  
  // Priority Settings
  priorities: {
    autoAssign: boolean;
    criticalDevices: string[];
    vipUsers: string[];
  };
}

interface UserPreferencesProps {
  settings: UserPreferencesSettings;
  onUpdate: (settings: UserPreferencesSettings) => void;
  onSave: () => void;
  loading?: boolean;
}

export const UserPreferences: React.FC<UserPreferencesProps> = ({
  settings,
  onUpdate,
  onSave,
  loading = false
}) => {
  const [activeSection, setActiveSection] = useState<string>('business-hours');

  const handleSectionUpdate = (section: keyof UserPreferencesSettings, updates: any) => {
    onUpdate({
      ...settings,
      [section]: {
        ...settings[section],
        ...updates
      }
    });
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const sections = [
    { id: 'business-hours', label: 'Business Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'escalation', label: 'Escalation', icon: AlertTriangle },
    { id: 'contact', label: 'Contact Methods', icon: Phone }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">
            Simple Preferences
          </h1>
          <p className="text-mist-gray">
            Quick setup for how you want to be notified and when you're available
          </p>
        </div>
        
        <Button 
          onClick={onSave}
          disabled={loading}
          className="bubo-btn-neon-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="col-span-3">
          <Card className="bubo-glass">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                        activeSection === section.id
                          ? 'bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30'
                          : 'text-mist-gray hover:bg-slate-gray/20 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <Card className="bubo-glass">
            <CardContent className="p-6">
              {activeSection === 'business-hours' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                      Business Hours
                    </h3>
                    <p className="text-mist-gray mb-6">
                      When are you typically available to handle IT issues?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Work Starts</Label>
                      <Select 
                        value={settings.workingHours.start} 
                        onValueChange={(value) => handleSectionUpdate('workingHours', { start: value })}
                      >
                        <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Work Ends</Label>
                      <Select 
                        value={settings.workingHours.end} 
                        onValueChange={(value) => handleSectionUpdate('workingHours', { end: value })}
                      >
                        <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Timezone</Label>
                    <Select 
                      value={settings.workingHours.timezone} 
                      onValueChange={(value) => handleSectionUpdate('workingHours', { timezone: value })}
                    >
                      <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Working Days</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {weekDays.map((day) => (
                        <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.workingHours.workDays.includes(day.value)}
                            onChange={(e) => {
                              const updatedDays = e.target.checked
                                ? [...settings.workingHours.workDays, day.value]
                                : settings.workingHours.workDays.filter(d => d !== day.value);
                              handleSectionUpdate('workingHours', { workDays: updatedDays });
                            }}
                            className="rounded border-slate-gray/30 text-iq-neon-green focus:ring-iq-neon-green"
                          />
                          <span className="text-sm text-white">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                      Notification Settings
                    </h3>
                    <p className="text-mist-gray mb-6">
                      Choose what alerts you want to receive and when
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Critical Notifications */}
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-crimson-danger/20 rounded-lg">
                          <Zap className="w-4 h-4 text-crimson-danger" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Critical Issues</div>
                          <div className="text-sm text-mist-gray">
                            Servers down, security alerts, system failures
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.criticalIssues}
                        onCheckedChange={(checked) => handleSectionUpdate('notifications', { criticalIssues: checked })}
                      />
                    </div>

                    {/* Device Alerts */}
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-warning/20 rounded-lg">
                          <Settings className="w-4 h-4 text-amber-warning" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Device Alerts</div>
                          <div className="text-sm text-mist-gray">
                            Low storage, software updates, hardware issues
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.deviceAlerts}
                        onCheckedChange={(checked) => handleSectionUpdate('notifications', { deviceAlerts: checked })}
                      />
                    </div>

                    {/* Ticket Updates */}
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-signal-blue/20 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-signal-blue" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Ticket Updates</div>
                          <div className="text-sm text-mist-gray">
                            New requests, comments, status changes
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.ticketUpdates}
                        onCheckedChange={(checked) => handleSectionUpdate('notifications', { ticketUpdates: checked })}
                      />
                    </div>

                    {/* Weekly Reports */}
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-iq-neon-green/20 rounded-lg">
                          <Users className="w-4 h-4 text-iq-neon-green" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Weekly Reports</div>
                          <div className="text-sm text-mist-gray">
                            Summary of IT activity, trends, and metrics
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyReports}
                        onCheckedChange={(checked) => handleSectionUpdate('notifications', { weeklyReports: checked })}
                      />
                    </div>

                    <Separator className="my-6" />

                    {/* Quiet Hours */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Quiet Hours</div>
                          <div className="text-sm text-mist-gray">
                            Don't send non-critical alerts during these hours
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.quietHours}
                          onCheckedChange={(checked) => handleSectionUpdate('notifications', { quietHours: checked })}
                        />
                      </div>

                      {settings.notifications.quietHours && (
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Quiet Starts</Label>
                            <Select 
                              value={settings.notifications.quietStart} 
                              onValueChange={(value) => handleSectionUpdate('notifications', { quietStart: value })}
                            >
                              <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                                <SelectValue placeholder="Start time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white text-sm">Quiet Ends</Label>
                            <Select 
                              value={settings.notifications.quietEnd} 
                              onValueChange={(value) => handleSectionUpdate('notifications', { quietEnd: value })}
                            >
                              <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                                <SelectValue placeholder="End time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'escalation' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                      Escalation Rules
                    </h3>
                    <p className="text-mist-gray mb-6">
                      Automatically escalate issues that aren't resolved quickly
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div>
                        <div className="font-medium text-white">Auto-Escalate Issues</div>
                        <div className="text-sm text-mist-gray">
                          Move unresolved tickets to a manager or senior tech
                        </div>
                      </div>
                      <Switch
                        checked={settings.escalation.autoEscalate}
                        onCheckedChange={(checked) => handleSectionUpdate('escalation', { autoEscalate: checked })}
                      />
                    </div>

                    {settings.escalation.autoEscalate && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-white">Escalate After</Label>
                          <Select 
                            value={settings.escalation.escalateAfter} 
                            onValueChange={(value) => handleSectionUpdate('escalation', { escalateAfter: value })}
                          >
                            <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2h">2 hours</SelectItem>
                              <SelectItem value="4h">4 hours</SelectItem>
                              <SelectItem value="8h">8 hours</SelectItem>
                              <SelectItem value="1d">1 day</SelectItem>
                              <SelectItem value="2d">2 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Escalate To</Label>
                          <Input
                            value={settings.escalation.escalateTo}
                            onChange={(e) => handleSectionUpdate('escalation', { escalateTo: e.target.value })}
                            placeholder="manager@company.com or Senior Tech Team"
                            className="bg-nocturne-indigo/30 border-slate-gray/30"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                          <div>
                            <div className="font-medium text-white">Skip Weekends</div>
                            <div className="text-sm text-mist-gray">
                              Don't count weekend time toward escalation
                            </div>
                          </div>
                          <Switch
                            checked={settings.escalation.skipWeekends}
                            onCheckedChange={(checked) => handleSectionUpdate('escalation', { skipWeekends: checked })}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                      Contact Methods
                    </h3>
                    <p className="text-mist-gray mb-6">
                      How should people reach you and what's your preferred method?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-iq-neon-green" />
                        <div>
                          <div className="font-medium text-white">Email</div>
                          <div className="text-sm text-mist-gray">Standard email notifications</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.contactMethods.email}
                        onCheckedChange={(checked) => handleSectionUpdate('contactMethods', { email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-signal-blue" />
                        <div>
                          <div className="font-medium text-white">SMS / Text</div>
                          <div className="text-sm text-mist-gray">For urgent issues only</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.contactMethods.sms}
                        onCheckedChange={(checked) => handleSectionUpdate('contactMethods', { sms: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-amber-warning" />
                        <div>
                          <div className="font-medium text-white">Microsoft Teams</div>
                          <div className="text-sm text-mist-gray">Teams channel notifications</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.contactMethods.teams}
                        onCheckedChange={(checked) => handleSectionUpdate('contactMethods', { teams: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-nocturne-indigo/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-glow-cyan" />
                        <div>
                          <div className="font-medium text-white">Slack</div>
                          <div className="text-sm text-mist-gray">Slack workspace notifications</div>
                        </div>
                      </div>
                      <Switch
                        checked={settings.contactMethods.slack}
                        onCheckedChange={(checked) => handleSectionUpdate('contactMethods', { slack: checked })}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <Label className="text-white">Primary Contact Method</Label>
                    <Select 
                      value={settings.contactMethods.primaryMethod} 
                      onValueChange={(value) => handleSectionUpdate('contactMethods', { primaryMethod: value })}
                    >
                      <SelectTrigger className="bg-nocturne-indigo/30 border-slate-gray/30">
                        <SelectValue placeholder="Choose primary method" />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.contactMethods.email && <SelectItem value="email">Email</SelectItem>}
                        {settings.contactMethods.sms && <SelectItem value="sms">SMS / Text</SelectItem>}
                        {settings.contactMethods.teams && <SelectItem value="teams">Microsoft Teams</SelectItem>}
                        {settings.contactMethods.slack && <SelectItem value="slack">Slack</SelectItem>}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-mist-gray">
                      This method will be used for the most important alerts
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Default settings for new users
export const defaultUserPreferences: UserPreferencesSettings = {
  workingHours: {
    start: '09:00',
    end: '17:00',
    timezone: 'EST',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  contactMethods: {
    email: true,
    sms: false,
    teams: false,
    slack: false,
    primaryMethod: 'email'
  },
  notifications: {
    criticalIssues: true,
    weeklyReports: true,
    deviceAlerts: true,
    ticketUpdates: true,
    quietHours: true,
    quietStart: '18:00',
    quietEnd: '08:00'
  },
  escalation: {
    autoEscalate: true,
    escalateAfter: '4h',
    escalateTo: '',
    skipWeekends: true
  },
  priorities: {
    autoAssign: true,
    criticalDevices: [],
    vipUsers: []
  }
};

export default UserPreferences;