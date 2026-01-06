# BuboIQ Agent Installer UI Mockups

## Design System

### Colors
- **Primary**: `#00FF85` (Neon Green)
- **Background**: `#0E0E0E` (Dark Midnight)
- **Surface**: `#1C1C1E` (Surface Dark)
- **Text**: `#FFFFFF` (Pure White)
- **Secondary**: `#1E90FF` (Electric Blue)
- **Error**: `#E64848` (Crimson Danger)

### Typography
- **Headers**: Space Grotesk Bold
- **Body**: Inter Regular
- **Technical**: JetBrains Mono

## Installer Flow Screens

### 1. Welcome Screen
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    ╭─────╮                                             │
│    │ 🦉  │  BuboIQ Endpoint Agent                      │
│    ╰─────╯                                             │
│                                                         │
│    Connect your device to BuboIQ for intelligent       │
│    IT support and monitoring.                          │
│                                                         │
│    Features:                                            │
│    • Real-time device health monitoring                │
│    • Automatic issue detection and resolution          │
│    • Secure remote support when needed                 │
│    • Privacy-focused data collection                   │
│                                                         │
│    ┌─────────────────┐  ┌─────────────────┐            │
│    │    Continue     │  │      Exit       │            │
│    └─────────────────┘  └─────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Organization Enrollment
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    Connect to Your Organization                         │
│                                                         │
│    Enter the enrollment code provided by your          │
│    IT administrator:                                    │
│                                                         │
│    ┌─────────────────────────────────────────────────┐ │
│    │ ACME-2024-ABC123                               │ │
│    └─────────────────────────────────────────────────┘ │
│                                                         │
│    □ Remember this organization                         │
│                                                         │
│    Having trouble? Contact your IT team or visit       │
│    support.buboiq.com                                  │
│                                                         │
│    ┌─────────────────┐  ┌─────────────────┐            │
│    │      Back       │  │     Connect     │            │
│    └─────────────────┘  └─────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. Privacy & Permissions
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    Privacy & Data Collection                            │
│                                                         │
│    BuboIQ Agent will collect the following:            │
│                                                         │
│    ✓ Hardware information (CPU, RAM, storage)          │
│    ✓ Operating system and version                      │
│    ✓ Network configuration                             │
│    ✓ Installed software (if enabled)                   │
│    ✓ System health metrics                             │
│                                                         │
│    □ Enable software inventory collection              │
│      (Can be changed later in settings)               │
│                                                         │
│    All data is encrypted and only shared with your     │
│    organization's IT team.                             │
│                                                         │
│    ┌─────────────────┐  ┌─────────────────┐            │
│    │      Back       │  │     Accept      │            │
│    └─────────────────┘  └─────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4. Installation Progress
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    Installing BuboIQ Agent...                          │
│                                                         │
│    ████████████████████████████████████▒▒▒▒ 85%       │
│                                                         │
│    Current step: Configuring service...                │
│                                                         │
│    Steps completed:                                     │
│    ✓ Downloaded agent binary                           │
│    ✓ Verified digital signature                        │
│    ✓ Created service account                           │
│    ✓ Installed system service                          │
│    ⧗ Configuring service...                            │
│      Starting initial sync...                          │
│                                                         │
│    Please wait, this may take a few minutes.           │
│                                                         │
│                    ┌─────────────────┐                 │
│                    │      Cancel     │                 │
│                    └─────────────────┘                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5. Success & Device Registration
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    🎉 Successfully Connected!                          │
│                                                         │
│    Your device is now managed by BuboIQ:               │
│                                                         │
│    Device Name: LAPTOP-USER-2024                       │
│    Organization: Acme Corporation                      │
│    Agent Version: 1.0.0                                │
│    Status: ●  Online                                   │
│                                                         │
│    What happens next:                                   │
│    • Your IT team can now see this device              │
│    • Automatic health monitoring is active             │
│    • Remote support is available when needed           │
│                                                         │
│    Need help? Your agent status is available in        │
│    System Preferences / Settings.                      │
│                                                         │
│                    ┌─────────────────┐                 │
│                    │      Finish     │                 │
│                    └─────────────────┘                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## System Tray Interface

### Windows System Tray
```
Right-click menu:
┌─────────────────────────┐
│ ●  BuboIQ Agent         │
│ ─────────────────────── │
│ Status: Online          │
│ Last Check: 2 min ago   │
│ ─────────────────────── │
│ 📊 View Health          │
│ ⚙️  Settings            │
│ 🔄 Check for Updates    │
│ ─────────────────────── │
│ ❌ Exit                 │
└─────────────────────────┘
```

### macOS Menu Bar
```
Click menu:
┌─────────────────────────┐
│    🦉 BuboIQ Agent      │
│ ─────────────────────── │
│ ●  Connected            │
│ Organization: Acme Corp │
│ Health: Good            │
│ ─────────────────────── │
│ Open Dashboard...       │
│ Preferences...          │
│ Check for Updates...    │
│ ─────────────────────── │
│ Quit BuboIQ Agent       │
└─────────────────────────┘
```

## Settings Interface

### Agent Settings Window
```
┌─────────────────────────────────────────────────────────┐
│ BuboIQ Agent Settings                            [ × ] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─ General ──────────────────────────────────────────┐  │
│ │                                                   │  │
│ │ Organization: Acme Corporation                    │  │
│ │ Device ID: abc-123-def-456                        │  │
│ │ Agent Version: 1.0.0                              │  │
│ │ Status: ●  Online                                 │  │
│ │                                                   │  │
│ │ Last Check-in: 2 minutes ago                      │  │
│ │ Next Check-in: 8 minutes                          │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌─ Privacy Settings ─────────────────────────────────┐  │
│ │                                                   │  │
│ │ □ Collect installed software inventory           │  │
│ │ □ Include personal file metadata                 │  │
│ │ ☑ Send anonymous usage statistics               │  │
│ │                                                   │  │
│ │ Data Retention: 90 days                          │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌─ Remote Access ────────────────────────────────────┐  │
│ │                                                   │  │
│ │ ☑ Allow remote support sessions                  │  │
│ │ ☑ Require user consent for each session         │  │
│ │ □ Enable session recording                       │  │
│ │                                                   │  │
│ │ Current session: None                             │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│    │   Export    │  │   Reset     │  │   Save      │   │
│    │    Logs     │  │   Agent     │  │  Settings   │   │
│    └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Health Monitor Dashboard

### Device Health Overview
```
┌─────────────────────────────────────────────────────────┐
│ Device Health - LAPTOP-USER-2024                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─ System Health ────────────────────────────────────┐  │
│ │                                                   │  │
│ │ Overall Health: ████████████████████████▒▒ 85%    │  │
│ │                                                   │  │
│ │ CPU Usage:      ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 23%     │  │
│ │ Memory Usage:   ████████████▒▒▒▒▒▒▒▒▒▒▒▒ 58%     │  │
│ │ Disk Usage:     ██████████████████▒▒▒▒▒▒ 72%     │  │
│ │ Network:        ●  Connected (Ethernet)          │  │
│ │ Battery:        ████████████████████████ 96%     │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌─ Recent Events ────────────────────────────────────┐  │
│ │                                                   │  │
│ │ 🟢 System startup completed        2 hours ago   │  │
│ │ 🟡 High memory usage detected      1 hour ago    │  │
│ │ 🟢 Network connectivity restored   45 min ago    │  │
│ │ 🔵 Software update available       30 min ago    │  │
│ │ 🟢 Health check completed          2 min ago     │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌─ Quick Actions ────────────────────────────────────┐  │
│ │                                                   │  │
│ │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│ │ │   Refresh   │  │  Run Full   │  │   Export    │ │  │
│ │ │   Status    │  │    Scan     │  │   Report    │ │  │
│ │ └─────────────┘  └─────────────┘  └─────────────┘ │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Remote Session UI

### Incoming Remote Session Request
```
┌─────────────────────────────────────────────────────────┐
│ 🔐 Remote Support Request                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Your IT administrator has requested to connect to      │
│ your device for technical support:                     │
│                                                         │
│ Technician: John Smith (john.smith@acme.com)           │
│ Ticket ID: #12345                                       │
│ Reason: Resolve network connectivity issue             │
│                                                         │
│ This session will allow the technician to:             │
│ • View your screen                                      │
│ • Control your mouse and keyboard                      │
│ • Access system settings and files                     │
│                                                         │
│ You can end the session at any time by pressing        │
│ Ctrl+Alt+End or clicking the "End Session" button.     │
│                                                         │
│ ☑ Record this session for quality assurance           │
│                                                         │
│    ┌─────────────────┐  ┌─────────────────┐            │
│    │     Decline     │  │     Allow       │            │
│    └─────────────────┘  └─────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Active Remote Session Indicator
```
┌─────────────────────────────────────────────────────────┐
│ 🔴 LIVE: Remote Support Session Active                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Technician: John Smith                                  │
│ Session Duration: 00:15:32                              │
│ Connection: Secure (AES-256)                            │
│                                                         │
│ Session is being recorded for quality assurance.       │
│                                                         │
│         ┌─────────────────┐  ┌─────────────────┐        │
│         │   End Session   │  │   Minimize      │        │
│         └─────────────────┘  └─────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Visual Design Elements

### Color Scheme (Dark Theme)
- **Window Background**: `#0E0E0E`
- **Panel Background**: `#1C1C1E`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#9CA3AF`
- **Accent**: `#00FF85`
- **Status Good**: `#38E27D`
- **Status Warning**: `#FFB020`
- **Status Error**: `#E64848`

### Component Styling
- **Buttons**: Rounded corners (8px), subtle shadows
- **Progress Bars**: Gradient fills with glow effects
- **Status Indicators**: Circular dots with pulse animation
- **Cards**: Glass morphism with border highlights

### Animations
- **Status Updates**: Smooth color transitions
- **Progress**: Animated progress bars
- **Notifications**: Slide-in from top
- **Health Metrics**: Real-time value updates

### Accessibility
- **High Contrast**: Support for high contrast mode
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels
- **Font Scaling**: Respects system font size settings

### Platform-Specific Considerations

#### Windows
- Follows Windows 11 design guidelines
- Native Windows controls where appropriate
- System tray integration
- Windows Defender integration

#### macOS
- Follows macOS Human Interface Guidelines
- Native Cocoa controls
- Menu bar integration
- Keychain integration for secure storage

#### Linux
- GTK+ based interface
- Follows desktop environment themes
- systemd integration
- PackageKit integration for updates