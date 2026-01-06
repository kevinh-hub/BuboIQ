export interface KnowledgeArticle {
  id: string;
  title: string;
  problem: string;
  category: string;
  confidence: number;
  casesCount: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  status: 'published' | 'draft' | 'deprecated';
  lastVerified: Date;
  prechecks: StepItem[];
  fixSteps: StepItem[];
  verifySteps: StepItem[];
  tags: string[];
  successRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface StepItem {
  id: string;
  title: string;
  description: string;
  command?: string;
  expectedResult?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedTime: string;
  canRollback: boolean;
  rollbackInstructions?: string;
}

export const sampleArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Fix Windows printing when jobs are stuck',
    problem: 'Print jobs get stuck in the queue and won\'t print, even though the printer is working fine.',
    category: 'Hardware',
    confidence: 92,
    casesCount: 47,
    estimatedTime: '5-10 minutes',
    difficulty: 'Easy',
    status: 'published',
    lastVerified: new Date('2024-09-20'),
    successRate: 94,
    riskLevel: 'Low',
    tags: ['printing', 'windows', 'queue', 'hardware'],
    prechecks: [
      {
        id: 'p1',
        title: 'Check printer status',
        description: 'Make sure the printer shows as online and ready',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Printer should show "Ready" or "Online" status'
      },
      {
        id: 'p2',
        title: 'Verify print queue',
        description: 'Open the print queue to see stuck jobs',
        command: 'Control Panel > Devices and Printers > Right-click printer > See what\'s printing',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'You should see pending print jobs in the queue'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Clear the print queue',
        description: 'Cancel all pending print jobs to clear the queue',
        command: 'Select all jobs in queue and press Delete key',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: true,
        rollbackInstructions: 'You can resend the print jobs if needed',
        expectedResult: 'Print queue should be empty'
      },
      {
        id: 'f2',
        title: 'Restart print spooler service',
        description: 'Restart the Windows service that manages printing',
        command: 'Press Win+R, type "services.msc", find "Print Spooler", right-click and restart',
        riskLevel: 'Medium',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'The service will restart automatically if something goes wrong',
        expectedResult: 'Print Spooler service should show "Running" status'
      },
      {
        id: 'f3',
        title: 'Test with a simple document',
        description: 'Print a test page to verify everything works',
        command: 'Right-click printer > Printer properties > Print Test Page',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Test page should print successfully'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Confirm print queue is empty',
        description: 'Check that no jobs are stuck in the queue',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Print queue window should show no pending jobs'
      },
      {
        id: 'v2',
        title: 'Print a regular document',
        description: 'Try printing a normal document to make sure everything works',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Document should print without getting stuck'
      }
    ]
  },
  {
    id: '2',
    title: 'Stop Outlook asking for your password again and again',
    problem: 'Outlook keeps asking for your password even though you enter it correctly every time.',
    category: 'Email',
    confidence: 87,
    casesCount: 34,
    estimatedTime: '10-15 minutes',
    difficulty: 'Medium',
    status: 'published',
    lastVerified: new Date('2024-09-18'),
    successRate: 89,
    riskLevel: 'Medium',
    tags: ['outlook', 'email', 'password', 'authentication'],
    prechecks: [
      {
        id: 'p1',
        title: 'Verify internet connection',
        description: 'Make sure you can access other websites and services',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Internet should be working normally'
      },
      {
        id: 'p2',
        title: 'Check if password is correct',
        description: 'Try logging into your email on the web to verify password',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'You should be able to log into webmail successfully'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Clear stored credentials',
        description: 'Remove saved passwords from Windows Credential Manager',
        command: 'Control Panel > Credential Manager > Windows Credentials > Remove Outlook entries',
        riskLevel: 'Medium',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'You can re-enter credentials if this doesn\'t help',
        expectedResult: 'Old stored passwords should be removed'
      },
      {
        id: 'f2',
        title: 'Restart Outlook',
        description: 'Close and reopen Outlook to refresh the connection',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Outlook should prompt for password on startup'
      },
      {
        id: 'f3',
        title: 'Re-enter credentials',
        description: 'Enter your email and password when prompted',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'Outlook should accept credentials and stop asking'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Send a test email',
        description: 'Send an email to yourself to verify everything works',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Email should send without password prompts'
      },
      {
        id: 'v2',
        title: 'Check for 24 hours',
        description: 'Monitor Outlook for a day to ensure no more password prompts',
        riskLevel: 'Low',
        estimatedTime: '1 day',
        canRollback: false,
        expectedResult: 'No password prompts should appear during normal use'
      }
    ]
  },
  {
    id: '3',
    title: 'Unstick OneDrive when it says "Processing changes…"',
    problem: 'OneDrive is stuck on "Processing changes" and won\'t sync your files.',
    category: 'Software',
    confidence: 78,
    casesCount: 23,
    estimatedTime: '15-20 minutes',
    difficulty: 'Medium',
    status: 'published',
    lastVerified: new Date('2024-09-15'),
    successRate: 82,
    riskLevel: 'Medium',
    tags: ['onedrive', 'sync', 'cloud', 'microsoft'],
    prechecks: [
      {
        id: 'p1',
        title: 'Check OneDrive status',
        description: 'Look at the OneDrive icon in your system tray',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Should show "Processing changes" or sync error'
      },
      {
        id: 'p2',
        title: 'Verify internet connection',
        description: 'Make sure you can access OneDrive.com in your browser',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'OneDrive website should load and show your files'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Pause and resume sync',
        description: 'Try pausing OneDrive sync for a few minutes, then resume',
        command: 'Right-click OneDrive icon > Pause syncing > Wait 5 minutes > Resume syncing',
        riskLevel: 'Low',
        estimatedTime: '7 minutes',
        canRollback: true,
        rollbackInstructions: 'If this doesn\'t work, sync will resume automatically',
        expectedResult: 'OneDrive should start fresh sync process'
      },
      {
        id: 'f2',
        title: 'Reset OneDrive',
        description: 'Reset OneDrive to clear any stuck processes',
        command: 'Press Win+R, type "%localappdata%\\Microsoft\\OneDrive\\onedrive.exe /reset"',
        riskLevel: 'Medium',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'OneDrive will restart automatically and re-sync everything',
        expectedResult: 'OneDrive icon should disappear then reappear'
      },
      {
        id: 'f3',
        title: 'Sign back into OneDrive',
        description: 'Enter your credentials when OneDrive restarts',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'OneDrive should start syncing your files again'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Check sync status',
        description: 'Verify OneDrive shows "Up to date" instead of processing',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'OneDrive icon should show green checkmark when complete'
      },
      {
        id: 'v2',
        title: 'Test file sync',
        description: 'Create a test file and verify it syncs to the cloud',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'New file should appear on OneDrive.com within minutes'
      }
    ]
  },
  {
    id: '4',
    title: 'Help Teams log in after a password change',
    problem: 'Microsoft Teams won\'t log in after you changed your work password.',
    category: 'Software',
    confidence: 91,
    casesCount: 28,
    estimatedTime: '5-8 minutes',
    difficulty: 'Easy',
    status: 'published',
    lastVerified: new Date('2024-09-12'),
    successRate: 93,
    riskLevel: 'Low',
    tags: ['teams', 'microsoft', 'password', 'authentication'],
    prechecks: [
      {
        id: 'p1',
        title: 'Verify new password works',
        description: 'Try logging into your company portal or email with new password',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'New password should work for other company services'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Sign out of Teams completely',
        description: 'Make sure Teams is fully signed out, not just closed',
        command: 'Click your profile picture > Sign out',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Teams should show the login screen'
      },
      {
        id: 'f2',
        title: 'Clear Teams cache',
        description: 'Delete Teams temporary files to clear old credentials',
        command: 'Close Teams completely, go to %appdata%\\Microsoft\\Teams and delete all folders',
        riskLevel: 'Medium',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'Teams will recreate these files automatically',
        expectedResult: 'Teams cache folder should be empty'
      },
      {
        id: 'f3',
        title: 'Restart Teams',
        description: 'Open Teams and sign in with your new password',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Teams should accept new password and log you in'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Test Teams functions',
        description: 'Make sure you can send messages and join meetings',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'All Teams features should work normally'
      }
    ]
  },
  {
    id: '5',
    title: 'Get your VPN working again when it says "No Internet"',
    problem: 'VPN connects successfully but shows "No Internet" and you can\'t access websites.',
    category: 'Network',
    confidence: 85,
    casesCount: 19,
    estimatedTime: '10-15 minutes',
    difficulty: 'Advanced',
    status: 'published',
    lastVerified: new Date('2024-09-10'),
    successRate: 88,
    riskLevel: 'High',
    tags: ['vpn', 'network', 'internet', 'connectivity'],
    prechecks: [
      {
        id: 'p1',
        title: 'Verify VPN connection status',
        description: 'Check that VPN shows as connected in your VPN app',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'VPN should show "Connected" status'
      },
      {
        id: 'p2',
        title: 'Test without VPN',
        description: 'Disconnect VPN and verify internet works normally',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Internet should work fine without VPN'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Flush DNS settings',
        description: 'Clear your computer\'s DNS cache to fix routing issues',
        command: 'Open Command Prompt as admin, run "ipconfig /flushdns"',
        riskLevel: 'Medium',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'DNS cache will rebuild automatically',
        expectedResult: 'Should see "Successfully flushed the DNS Resolver Cache"'
      },
      {
        id: 'f2',
        title: 'Reset network adapter',
        description: 'Restart your network connection to clear any conflicts',
        command: 'Control Panel > Network Connections > Disable then Enable your main adapter',
        riskLevel: 'High',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'Re-enable the adapter if internet stops working',
        expectedResult: 'Network adapter should reconnect to internet'
      },
      {
        id: 'f3',
        title: 'Reconnect VPN',
        description: 'Disconnect and reconnect your VPN with fresh settings',
        riskLevel: 'Medium',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'You can always disconnect VPN if this doesn\'t work',
        expectedResult: 'VPN should connect and allow internet access'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Test website access',
        description: 'Try accessing both company websites and external sites',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Both company and external websites should load normally'
      },
      {
        id: 'v2',
        title: 'Check IP location',
        description: 'Verify your IP shows the VPN location, not your real location',
        command: 'Go to whatismyipaddress.com',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'IP location should match your VPN server location'
      }
    ]
  },
  {
    id: '6',
    title: 'Fix Windows 11 24H2 updates stuck on "Pending Restart"',
    problem: 'Windows Update shows updates are ready but they stay stuck on "Pending Restart" even after multiple restarts.',
    category: 'Software',
    confidence: 89,
    casesCount: 41,
    estimatedTime: '15-20 minutes',
    difficulty: 'Medium',
    status: 'published',
    lastVerified: new Date('2024-09-25'),
    successRate: 91,
    riskLevel: 'Medium',
    tags: ['windows', 'updates', '24H2', 'restart', 'microsoft'],
    prechecks: [
      {
        id: 'p1',
        title: 'Check Windows Update service',
        description: 'Verify Windows Update service is running normally',
        command: 'Services.msc > Windows Update > Status should be "Running"',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Windows Update service shows "Running" status'
      },
      {
        id: 'p2',
        title: 'Verify available disk space',
        description: 'Make sure you have enough space for the update',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'At least 10GB free space on C: drive'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Stop Windows Update services',
        description: 'Stop the update services to clear any stuck processes',
        command: 'Run as admin: net stop wuauserv && net stop cryptSvc && net stop bits',
        riskLevel: 'Medium',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'Services will restart automatically on next boot',
        expectedResult: 'All three services should show as stopped'
      },
      {
        id: 'f2',
        title: 'Clear update cache',
        description: 'Delete temporary update files that might be corrupted',
        command: 'Delete contents of C:\\Windows\\SoftwareDistribution\\Download folder',
        riskLevel: 'Medium',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'Windows will re-download needed files',
        expectedResult: 'Download folder should be empty'
      },
      {
        id: 'f3',
        title: 'Restart Windows Update services',
        description: 'Start the services back up with fresh cache',
        command: 'Run as admin: net start wuauserv && net start cryptSvc && net start bits',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'All services should start successfully'
      },
      {
        id: 'f4',
        title: 'Run Windows Update again',
        description: 'Check for updates and install them normally',
        command: 'Settings > Windows Update > Check for updates',
        riskLevel: 'Low',
        estimatedTime: '5 minutes',
        canRollback: false,
        expectedResult: 'Updates should download and install without getting stuck'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Verify update status',
        description: 'Check that updates show as successfully installed',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Windows Update should show "You\'re up to date"'
      },
      {
        id: 'v2',
        title: 'Restart and confirm',
        description: 'Restart computer and verify system is stable',
        riskLevel: 'Low',
        estimatedTime: '5 minutes',
        canRollback: false,
        expectedResult: 'System should boot normally with updates applied'
      }
    ]
  },
  {
    id: '7',
    title: 'Reset MFA when Microsoft 365 login policies change',
    problem: 'You can\'t log into Microsoft 365 apps after your company changed multi-factor authentication requirements.',
    category: 'Security',
    confidence: 94,
    casesCount: 31,
    estimatedTime: '8-12 minutes',
    difficulty: 'Medium',
    status: 'published',
    lastVerified: new Date('2024-09-22'),
    successRate: 96,
    riskLevel: 'Low',
    tags: ['microsoft365', 'mfa', 'authentication', 'security', 'policies'],
    prechecks: [
      {
        id: 'p1',
        title: 'Verify MFA device availability',
        description: 'Make sure you have your phone or authenticator app ready',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'You can access your phone for SMS or have Microsoft Authenticator installed'
      },
      {
        id: 'p2',
        title: 'Test company portal access',
        description: 'Try logging into your company\'s main portal to verify account status',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'You should be able to reach the login page but may get MFA errors'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Clear saved credentials',
        description: 'Remove old authentication tokens from your computer',
        command: 'Control Panel > Credential Manager > Remove all Microsoft/365/Azure entries',
        riskLevel: 'Medium',
        estimatedTime: '4 minutes',
        canRollback: true,
        rollbackInstructions: 'You\'ll just need to sign in again with current credentials',
        expectedResult: 'All Microsoft-related saved passwords should be removed'
      },
      {
        id: 'f2',
        title: 'Sign out of all Microsoft apps',
        description: 'Make sure you\'re completely signed out of Outlook, Teams, etc.',
        command: 'In each app: Settings > Account > Sign out',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'All Microsoft apps should show login screens'
      },
      {
        id: 'f3',
        title: 'Re-register MFA device',
        description: 'Set up your multi-factor authentication again with new policies',
        command: 'Go to aka.ms/mfasetup and follow the setup wizard',
        riskLevel: 'Low',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'Contact IT if you can\'t complete setup',
        expectedResult: 'MFA should be configured with your current device'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Test login with MFA',
        description: 'Sign into a Microsoft 365 app and complete MFA challenge',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'Login should work with MFA prompt and succeed'
      },
      {
        id: 'v2',
        title: 'Verify all apps work',
        description: 'Check that Outlook, Teams, and other Microsoft apps all sign in properly',
        riskLevel: 'Low',
        estimatedTime: '5 minutes',
        canRollback: false,
        expectedResult: 'All Microsoft 365 apps should work without MFA errors'
      }
    ]
  },
  {
    id: '8',
    title: 'Get Zoom or Teams to recognize your headset after updates',
    problem: 'After a Windows or app update, Zoom or Teams can\'t find your headset or the audio sounds terrible.',
    category: 'Hardware',
    confidence: 86,
    casesCount: 37,
    estimatedTime: '10-15 minutes',
    difficulty: 'Easy',
    status: 'published',
    lastVerified: new Date('2024-09-19'),
    successRate: 89,
    riskLevel: 'Low',
    tags: ['zoom', 'teams', 'headset', 'audio', 'microphone'],
    prechecks: [
      {
        id: 'p1',
        title: 'Check Windows audio settings',
        description: 'Verify Windows can see your headset in sound settings',
        command: 'Settings > System > Sound > Check if headset appears in device list',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Headset should appear in both playback and recording devices'
      },
      {
        id: 'p2',
        title: 'Test headset outside apps',
        description: 'Play music and record voice memo to verify headset works',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'You should hear audio clearly and microphone should pick up your voice'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Set headset as default device',
        description: 'Make your headset the default for both speakers and microphone',
        command: 'Settings > System > Sound > Set headset as default for Output and Input',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: true,
        rollbackInstructions: 'You can always change default devices back',
        expectedResult: 'Headset should show green checkmark as default device'
      },
      {
        id: 'f2',
        title: 'Restart the problem app',
        description: 'Close Zoom or Teams completely and reopen it',
        command: 'Task Manager > End all Zoom/Teams processes > Restart app',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'App should restart and re-detect audio devices'
      },
      {
        id: 'f3',
        title: 'Reset app audio settings',
        description: 'Clear the app\'s saved audio settings so it picks up changes',
        command: 'In app: Settings > Audio > Select correct devices for Speaker and Microphone',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: true,
        rollbackInstructions: 'You can select different devices if needed',
        expectedResult: 'App should show your headset as selected audio device'
      },
      {
        id: 'f4',
        title: 'Test audio in app',
        description: 'Use the app\'s audio test feature to verify everything works',
        command: 'In app: Settings > Audio > Test Speaker and Test Microphone',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'You should hear test sound and see microphone level responding'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Make a test call',
        description: 'Start a test call or meeting to verify audio quality',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'Audio should be clear in both directions during call'
      },
      {
        id: 'v2',
        title: 'Check for echo or feedback',
        description: 'Listen for any audio problems during the test call',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'No echo, static, or feedback should be present'
      }
    ]
  },
  {
    id: '9',
    title: 'Restore Slack notifications on macOS Sonoma',
    problem: 'Slack notifications stopped working after updating to macOS Sonoma, even though notification settings look correct.',
    category: 'Software',
    confidence: 92,
    casesCount: 24,
    estimatedTime: '8-12 minutes',
    difficulty: 'Medium',
    status: 'published',
    lastVerified: new Date('2024-09-16'),
    successRate: 94,
    riskLevel: 'Low',
    tags: ['slack', 'macos', 'sonoma', 'notifications', 'focus'],
    prechecks: [
      {
        id: 'p1',
        title: 'Check Do Not Disturb status',
        description: 'Make sure Do Not Disturb and Focus modes are turned off',
        command: 'Control Center > Focus > Verify Do Not Disturb is off',
        riskLevel: 'Low',
        estimatedTime: '1 minute',
        canRollback: false,
        expectedResult: 'Do Not Disturb should be disabled and no Focus modes active'
      },
      {
        id: 'p2',
        title: 'Verify Slack notification permissions',
        description: 'Check that Slack has permission to send notifications',
        command: 'System Settings > Notifications > Slack > Verify notifications are enabled',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Slack should have notification permissions enabled'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Reset Slack notification preferences',
        description: 'Clear Slack\'s notification settings and start fresh',
        command: 'Slack > Preferences > Notifications > Reset to defaults',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: true,
        rollbackInstructions: 'You can reconfigure notifications to your preferences',
        expectedResult: 'Slack notification settings should return to default values'
      },
      {
        id: 'f2',
        title: 'Clear Slack cache and restart',
        description: 'Remove temporary files that might be causing issues',
        command: 'Quit Slack > Delete ~/Library/Application Support/Slack/storage > Restart Slack',
        riskLevel: 'Medium',
        estimatedTime: '4 minutes',
        canRollback: true,
        rollbackInstructions: 'Slack will recreate these files automatically',
        expectedResult: 'Slack should restart and rebuild its cache'
      },
      {
        id: 'f3',
        title: 'Re-enable macOS notifications for Slack',
        description: 'Turn off and on notification permissions to refresh the connection',
        command: 'System Settings > Notifications > Slack > Turn off Allow Notifications > Wait 30 seconds > Turn back on',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: true,
        rollbackInstructions: 'Just toggle the setting back if needed',
        expectedResult: 'macOS should prompt to allow Slack notifications again'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Send yourself a test message',
        description: 'Have someone send you a direct message or @mention to test notifications',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'You should receive a notification banner and hear notification sound'
      },
      {
        id: 'v2',
        title: 'Test different notification types',
        description: 'Verify DMs, mentions, and channel messages all trigger notifications properly',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'All configured notification types should work as expected'
      }
    ]
  },
  {
    id: '10',
    title: 'Fix Microsoft Copilot in Word or Excel when it won\'t load',
    problem: 'Copilot button appears in Word or Excel but clicking it does nothing, or it shows an error about not being available.',
    category: 'Software',
    confidence: 79,
    casesCount: 18,
    estimatedTime: '12-18 minutes',
    difficulty: 'Advanced',
    status: 'published',
    lastVerified: new Date('2024-09-24'),
    successRate: 83,
    riskLevel: 'Medium',
    tags: ['copilot', 'microsoft', 'word', 'excel', 'ai', 'office365'],
    prechecks: [
      {
        id: 'p1',
        title: 'Verify Copilot license',
        description: 'Make sure your Microsoft 365 subscription includes Copilot',
        command: 'Check with your IT admin or in Microsoft 365 admin center',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'Your account should have Copilot license assigned'
      },
      {
        id: 'p2',
        title: 'Check regional availability',
        description: 'Verify Copilot is available in your region and language settings',
        command: 'Account Settings > Check region is supported (US, EU, etc.)',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Your region and language should support Copilot features'
      }
    ],
    fixSteps: [
      {
        id: 'f1',
        title: 'Update Office to latest version',
        description: 'Make sure you have the newest version that supports Copilot',
        command: 'File > Account > Update Options > Update Now',
        riskLevel: 'Low',
        estimatedTime: '5 minutes',
        canRollback: true,
        rollbackInstructions: 'Office updates can be rolled back if needed',
        expectedResult: 'Office should update to the latest version with Copilot support'
      },
      {
        id: 'f2',
        title: 'Disable and re-enable Copilot add-in',
        description: 'Reset the Copilot add-in to clear any loading issues',
        command: 'File > Options > Add-ins > Manage COM Add-ins > Uncheck Microsoft Copilot > Restart Office > Re-enable',
        riskLevel: 'Medium',
        estimatedTime: '6 minutes',
        canRollback: true,
        rollbackInstructions: 'You can disable the add-in again if it causes problems',
        expectedResult: 'Copilot add-in should be refreshed and working'
      },
      {
        id: 'f3',
        title: 'Clear Office credentials',
        description: 'Sign out and back in to refresh Copilot authentication',
        command: 'File > Account > Sign out > Restart Office > Sign back in',
        riskLevel: 'Medium',
        estimatedTime: '4 minutes',
        canRollback: false,
        expectedResult: 'Office should re-authenticate and enable Copilot features'
      }
    ],
    verifySteps: [
      {
        id: 'v1',
        title: 'Test Copilot button',
        description: 'Click the Copilot button and verify the sidebar opens',
        riskLevel: 'Low',
        estimatedTime: '2 minutes',
        canRollback: false,
        expectedResult: 'Copilot sidebar should open on the right side of the screen'
      },
      {
        id: 'v2',
        title: 'Try a simple Copilot task',
        description: 'Ask Copilot to help with a basic task like summarizing or formatting',
        command: 'Type a simple request like "Create a summary of this document"',
        riskLevel: 'Low',
        estimatedTime: '3 minutes',
        canRollback: false,
        expectedResult: 'Copilot should respond and perform the requested task'
      }
    ]
  }
];