export interface CompanySettings {
  name: string;
  logo: string;
  website: string;
  supportEmail: string;
}

export interface NotificationSettings {
  emailOnNewTicket: boolean;
  emailOnStatusChange: boolean;
  emailOnComment: boolean;
  slackIntegration: boolean;
  pushNotifications: boolean;
}

export interface SLASettings {
  highPriority: string;
  mediumPriority: string;
  lowPriority: string;
  workingHours: string;
  timezone: string;
}

export interface BrandingSettings {
  primaryColor: string;
  logo: string;
  customDomain: string;
}

export interface AppSettings {
  company: CompanySettings;
  notifications: NotificationSettings;
  sla: SLASettings;
  branding: BrandingSettings;
}

export const TIMEZONE_OPTIONS = [
  { value: 'EST', label: 'Eastern Time (EST)' },
  { value: 'CST', label: 'Central Time (CST)' },
  { value: 'MST', label: 'Mountain Time (MST)' },
  { value: 'PST', label: 'Pacific Time (PST)' },
  { value: 'UTC', label: 'UTC' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  company: {
    name: 'TicketEase Demo Company',
    logo: '',
    website: 'https://ticketease.com',
    supportEmail: 'support@ticketease.com'
  },
  notifications: {
    emailOnNewTicket: true,
    emailOnStatusChange: true,
    emailOnComment: true,
    slackIntegration: false,
    pushNotifications: true
  },
  sla: {
    highPriority: '4',
    mediumPriority: '12',
    lowPriority: '48',
    workingHours: '9-17',
    timezone: 'EST'
  },
  branding: {
    primaryColor: '#00C48C',
    logo: '',
    customDomain: 'support.company.com'
  }
};