# BuboIQ Analyst v1 - System Architecture Map

## 📐 File Structure

```
/components/analyst/
│
├── 📄 index.ts                          # Public exports
├── 📄 design-tokens.ts                  # Design system tokens (colors, typography, spacing)
│
├── 🎨 AnalystPrototype.tsx              # Main prototype router with navigation
├── 🎨 AnalystComponentLibrary.tsx       # Complete UI kit showcase
├── 📚 HandoffPage.tsx                   # Developer documentation
│
└── 📁 screens/
    ├── AgentConsole.tsx                 # Screen 1: Main dashboard
    ├── IssueDetail.tsx                  # Screen 2: Ticket with AI panel
    ├── KBDraftEditor.tsx                # Screen 3: Article editor
    ├── AllScreens.tsx                   # Screens 4-8
    │   ├── ApprovalDialog               # Screen 4: Action approval modal
    │   ├── PolicySettings               # Screen 5: Tier & guardrails config
    │   ├── DeviceActionJobs             # Screen 6: Execution monitoring
    │   ├── AlertsTelemetry              # Screen 7: Metrics dashboard
    │   └── TracesLineage                # Screen 8: Reasoning visualization
    └── RemainingScreens.tsx             # Screens 9-11
        ├── RolesAccess                  # Screen 9: User management
        ├── OrgOnboarding                # Screen 10: Setup wizard
        └── RunbookKillSwitch            # Screen 11: Emergency controls

/components/
└── 📄 AnalystDemoPage.tsx               # Standalone entry point

/
├── 📖 ANALYST_V1_COMPLETE.md            # Complete documentation
├── 🚀 ANALYST_QUICK_START.md            # Quick start guide
└── 🗺️ ANALYST_SYSTEM_MAP.md             # This file
```

## 🧩 Component Hierarchy

```
AnalystPrototype (Main Router)
│
├── AnalystComponentLibrary
│   ├── TokenGrid
│   ├── Primitives
│   │   ├── AnalystButton
│   │   ├── AnalystInput
│   │   ├── AnalystBadge
│   │   └── StatusPill
│   │
│   ├── Specialized
│   │   ├── ConfidenceOrb
│   │   ├── MetricCard
│   │   ├── PolicyChip
│   │   ├── RiskHint
│   │   ├── CodeBlock
│   │   └── EmptyState
│   │
│   └── Patterns
│       ├── ReasoningTraceCard
│       ├── ActionItem
│       ├── DeviceJobRow
│       └── TierGuardBanner
│
├── Screens (11 total)
│   ├── AgentConsole
│   │   ├── ReasoningTraceCard (multiple)
│   │   ├── ActionItem (multiple)
│   │   └── StatusPill
│   │
│   ├── IssueDetail
│   │   ├── ConfidenceOrb
│   │   └── ApplyConfirmationModal
│   │
│   ├── KBDraftEditor
│   │   ├── Accordion (sections)
│   │   ├── CodeBlock
│   │   └── TierGuardBanner
│   │
│   ├── ApprovalDialog
│   │   ├── ConfidenceOrb
│   │   ├── PolicyChip (multiple)
│   │   └── RiskHint (multiple)
│   │
│   ├── PolicySettings
│   │   ├── Slider
│   │   ├── Switch (multiple)
│   │   └── PolicyChip (multiple)
│   │
│   ├── DeviceActionJobs
│   │   ├── DeviceJobRow (multiple)
│   │   └── DetailDrawer
│   │
│   ├── AlertsTelemetry
│   │   ├── MetricCard (4 cards)
│   │   └── AlertsList
│   │
│   ├── TracesLineage
│   │   ├── ConfidenceOrb (on nodes)
│   │   └── LineageGraph
│   │
│   ├── RolesAccess
│   │   ├── UserTable
│   │   └── PermissionMatrix
│   │
│   ├── OrgOnboarding
│   │   ├── ProgressStepper
│   │   └── StepForms
│   │
│   └── RunbookKillSwitch
│       ├── KillSwitchToggle
│       └── PlaybookGrid
│
└── HandoffPage
    ├── DesignTokens (Tailwind config, CSS vars)
    ├── ComponentExamples (JSX snippets)
    └── PatternLibrary (State management, microcopy)
```

## 🔄 Navigation Flow

```
Entry Point: AnalystPrototype
    │
    ├─> [Library Tab] ────────> AnalystComponentLibrary
    │
    ├─> [Console Tab] ────────> AgentConsole
    │       │
    │       ├─> Click Trace ──────────> TracesLineage
    │       ├─> Click Action ─────────> ApprovalDialog
    │       │       │
    │       │       └─> Approve ──────> DeviceActionJobs
    │       │
    │       └─> Settings Icon ────────> RunbookKillSwitch
    │
    ├─> [Issue Tab] ──────────> IssueDetail
    │       │
    │       └─> Apply to Ticket ──────> Confirmation Modal
    │
    ├─> [KB Editor Tab] ──────> KBDraftEditor
    │
    ├─> [Policy Tab] ─────────> PolicySettings
    │
    ├─> [Jobs Tab] ───────────> DeviceActionJobs
    │       │
    │       └─> Click Job ───────────> Detail Drawer
    │
    ├─> [Alerts Tab] ─────────> AlertsTelemetry
    │
    ├─> [Traces Tab] ─────────> TracesLineage
    │
    ├─> [Roles Tab] ──────────> RolesAccess
    │
    ├─> [Onboarding Tab] ─────> OrgOnboarding
    │       │
    │       └─> Complete ────────────> AgentConsole
    │
    ├─> [Kill Switch Tab] ────> RunbookKillSwitch
    │
    └─> [Handoff Tab] ────────> HandoffPage
```

## 🎨 Design Token Structure

```
AnalystTokens
├── colors
│   ├── bg-950, bg-900, bg-850
│   ├── panel-glass (rgba)
│   ├── border, divider
│   ├── text-100, text-300, text-400, text-600
│   └── accent, info, warn, danger, success
│
├── radius
│   ├── xs (6px)
│   ├── sm (10px)
│   ├── md (16px)
│   ├── xl (20px) ← default
│   └── modal (32px)
│
├── spacing
│   ├── xs (4px)
│   ├── sm (8px)
│   ├── md (12px)
│   ├── base (16px)
│   ├── lg (24px)
│   ├── xl (32px)
│   └── 2xl (48px)
│
├── elevation
│   ├── tiny
│   ├── card
│   └── modal
│
└── typography
    ├── h1 (36/44, Space Grotesk Bold)
    ├── h2 (28/36, Space Grotesk Bold)
    ├── h3 (22/30, Space Grotesk SemiBold)
    ├── body (16/24, Inter Regular)
    ├── small (14/20, Inter Regular)
    └── mono (13/18, JetBrains Mono)
```

## 📊 Data Flow

```
User Action
    │
    ├─> Button Click
    │       │
    │       ├─> State Update (useState)
    │       ├─> Toast Notification (sonner)
    │       └─> Navigation (onNavigate)
    │
    ├─> Form Submission
    │       │
    │       ├─> Validation
    │       ├─> API Call (placeholder)
    │       └─> Success/Error State
    │
    └─> Modal Open/Close
            │
            ├─> Dialog State
            └─> Confirmation Flow
```

## 🔧 Component Props Patterns

### Basic Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

### Complex Component
```typescript
interface ReasoningTraceCardProps {
  timestamp: string;
  confidence: number; // 0-100
  summary: Record<string, string>;
  traceId: string;
}
```

### Pattern Component
```typescript
interface ActionItemProps {
  actionType: string;
  params: Record<string, string>;
  risks: Array<'rollback' | 'blast' | 'low-confidence'>;
  confidence: number;
  onApprove: () => void;
  onReject: () => void;
}
```

## 🎯 State Management

```
AnalystPrototype
    │
    ├─> currentScreen: Screen (useState)
    │       └─> Changes: navigate(newScreen)
    │
    └─> showApprovalDialog: boolean (useState)
            └─> Changes: setShowApprovalDialog(true/false)

AgentConsole
    │
    ├─> killSwitch: boolean (useState)
    └─> agentStatus: Status (useState)

PolicySettings
    │
    ├─> tier: 'starter' | 'pro' | 'team' (useState)
    ├─> confidenceThreshold: number (useState)
    ├─> requireRollback: boolean (useState)
    └─> safelistActions: Record<string, boolean> (useState)
```

## 📱 Responsive Strategy

```
Desktop XL (1440px)  ←─ Design source
    │
    ├─> Desktop (1280px)
    │       └─> Maintain 2-column layouts
    │
    ├─> Laptop (1024px)
    │       └─> Slightly condensed, still 2-column
    │
    └─> Tablet (768px)
            └─> Switch to 1-column, stack layouts
```

## 🔐 Accessibility Features

```
All Components
├── Focus Rings (2px solid #00FF85, 2px offset)
├── ARIA Labels (icon-only buttons)
├── Touch Targets (44×44px minimum)
└── Keyboard Navigation (Tab, Enter, Esc)

Text Contrast
├── White on dark: 15:1 (AAA+)
├── Light gray on dark: 7:1 (AA+)
└── Medium gray on dark: 4.5:1 (AA)

Interactive States
├── Hover (border glow, shadow increase)
├── Focus (visible ring, color shift)
├── Active (scale transform, shadow decrease)
└── Disabled (50% opacity, no interactions)
```

## 🚀 Integration Points

```
BuboIQ Main App
    │
    ├─> Route: /analyst
    │       └─> Component: <AnalystDemoPage />
    │
    ├─> Import Components
    │       ├─> import { ConfidenceOrb } from './components/analyst'
    │       └─> Use in existing screens
    │
    └─> Import Tokens
            ├─> Tailwind Config
            └─> CSS Variables
```

## 📦 Export Structure

```typescript
// From /components/analyst/index.ts

export {
  // Main prototype
  AnalystPrototype,
  
  // Showcase pages
  AnalystComponentLibrary,
  HandoffPage,
  
  // All screens
  AgentConsole,
  IssueDetail,
  KBDraftEditor,
  ApprovalDialog,
  PolicySettings,
  DeviceActionJobs,
  AlertsTelemetry,
  TracesLineage,
  RolesAccess,
  OrgOnboarding,
  RunbookKillSwitch,
  
  // Design tokens
  AnalystTokens,
  cssVariables,
  
  // Components
  AnalystButton,
  AnalystInput,
  AnalystBadge,
  StatusPill,
  ConfidenceOrb,
  MetricCard,
  PolicyChip,
  RiskHint,
  CodeBlock,
  EmptyState,
  ReasoningTraceCard,
  ActionItem,
  DeviceJobRow,
  TierGuardBanner,
};
```

## 🎓 Learning Resources

```
1. Component Library  ─> See all components with live examples
2. Handoff Page       ─> Copy tokens, JSX, state patterns
3. Source Code        ─> /components/analyst/screens/*.tsx
4. Documentation      ─> ANALYST_V1_COMPLETE.md
5. Quick Start        ─> ANALYST_QUICK_START.md
6. This Map           ─> ANALYST_SYSTEM_MAP.md
```

---

**Complete system delivered: Component library + 11 screens + Prototype + Handoff materials ✅**
