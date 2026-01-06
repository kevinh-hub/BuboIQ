# Guided Fixes — Complete Implementation Handoff

**Customer-facing label:** Guided Fixes  
**Internal model name:** runbook  
**Status:** ✅ Complete — Production-ready component library

---

## 🎯 Executive Summary

Guided Fixes is a first-class BuboIQ capability that turns common IT fixes into safe, step-by-step actions that run on any computer—Windows, macOS, or Linux—through the BuboIQ Agent or Connect. The system includes:

- **Complete component library** (10 reusable components)
- **Multi-tier access control** (Starter/Pro/Team at $33/$127/$297)
- **Safety-first execution** (Read-Only, Low, Risky, Destructive grades)
- **Knowledge Base integration** (auto-draft after successful fixes)
- **14 FAQ entries** added to marketing
- **Features page section** showcasing capabilities

---

## 📦 Component Library

All components are in `/components/guided-fixes/` with proper TypeScript types and accessibility.

### Core Components

| Component | File | Purpose | Variants |
|-----------|------|---------|----------|
| **OSBadge** | `os-badge.tsx` | OS indicator chips | windows, macos, linux |
| **SafetyChip** | `safety-chip.tsx` | Safety level badges | readOnly, low, risky, destructive |
| **CommandBlock** | `command-block.tsx` | Monospace code display | elevated, dry-run, compact/expanded |
| **StepListItem** | `step-list-item.tsx` | Step navigation | locked, ready, running, complete, error |
| **ConsoleStream** | `console-stream.tsx` | Live output viewer | idle, running, success, failed, aborted |
| **PolicyBadge** | `policy-badge.tsx` | Team approval indicator | - |
| **GuidedFixCard** | `guided-fix-card.tsx` | Main fix card | starterLocked, pro, team; comfortable, compact |
| **QuickActionTile** | `quick-action-tile.tsx` | Single-step tile | - |
| **GuidedFixRunnerDrawer** | `guided-fix-runner-drawer.tsx` | Main execution UI | - |
| **GuidedFixesShowcase** | `GuidedFixesShowcase.tsx` | Marketing demo | - |

### Export Manifest

```typescript
export { OSBadge, OSType } from './os-badge';
export { SafetyChip, SafetyLevel } from './safety-chip';
export { CommandBlock } from './command-block';
export { StepListItem, StepState } from './step-list-item';
export { ConsoleStream, ConsoleStatus } from './console-stream';
export { PolicyBadge } from './policy-badge';
export { GuidedFixCard, TierState, Density } from './guided-fix-card';
export { QuickActionTile } from './quick-action-tile';
export { GuidedFixRunnerDrawer, ExecutionPath } from './guided-fix-runner-drawer';
```

---

## 🎨 Design System Integration

### Color Tokens (reused from BuboIQ globals)

- **Accent:** `color/accent-neo` → `#00FF85` (Neon Green)
- **Backgrounds:** `color/bg-900`, `color/bg-800`, `color/panel-700` (glass)
- **Text:** `color/text-100` (primary white), `color/text-400` (muted)
- **Status:**
  - `color/danger` → `#FF4D4D` (crimson-danger)
  - `color/warn` → `#FFC24D` (signal-yellow)
  - `color/safe` → `#61D095` (success-green)
- **Focus ring:** 2px solid `color/accent-neo` on all interactive elements

### Typography

- **Display:** Space Grotesk Bold (headings, titles)
- **UI:** Inter Regular (body text, labels)
- **Code:** JetBrains Mono (commands, console output)

### Spacing

- All components use **8px grid** spacing
- Auto Layout with gap-2 (8px), gap-3 (12px), gap-4 (16px)
- Padding: p-3 (12px), p-4 (16px), p-6 (24px)

---

## 🔐 Tier Guard Integration

### Pricing Display

```typescript
const tierMessages = {
  starterLocked: 'Starter ($33/mo) includes safe Quick Actions. Advanced Guided Fixes require Pro ($127/mo).',
  pro: 'Pro active. Remote runs use your session pool.',
  team: 'Team policy: approvals required for destructive steps.'
};
```

### Access Matrix

| Feature | Starter ($33) | Pro ($127) | Team ($297) |
|---------|---------------|------------|-------------|
| View Guided Fixes | ✅ | ✅ | ✅ |
| Safe Quick Actions (Read-Only/Low) | ✅ | ✅ | ✅ |
| Full Guided Fixes | ❌ | ✅ | ✅ |
| Remote Execution (Connect) | ❌ | ✅ | ✅ |
| Auto-Draft KB Articles | ❌ | ✅ | ✅ |
| Approvals for Destructive | ❌ | ❌ | ✅ |
| Custom Org Guided Fixes | ❌ | ✅ | ✅ |

---

## 🛡️ Safety System

### Safety Levels

| Level | Icon | Color | Requires Confirm | Requires Approval (Team) |
|-------|------|-------|------------------|--------------------------|
| **Read-Only** | `ShieldCheck` | `success-green` | ❌ | ❌ |
| **Low** | `Shield` | `iq-neon-green` | ❌ | ❌ |
| **Risky** | `AlertTriangle` | `signal-yellow` | ✅ (type "confirm") | ❌ |
| **Destructive** | `ShieldOff` | `crimson-danger` | ✅ (type "confirm") | ✅ (Team only) |

### Confirmation Flow

1. **Risky/Destructive step** → Show warning banner
2. User must type `"confirm"` in input field
3. **Team + Destructive** → PolicyBadge appears, approver must review
4. Button enabled only when confirmation valid
5. Execution proceeds with full audit trail

---

## 🖥️ Multi-OS Support

### OS Detection

```typescript
type OSType = 'windows' | 'macos' | 'linux';

// Each GuidedFix step specifies:
{
  os: OSType;
  shell: 'PowerShell' | 'cmd' | 'zsh' | 'bash';
  command: string;
}
```

### Example Commands

**Flush DNS Cache:**
- **Windows:** `ipconfig /flushdns`
- **macOS:** `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`
- **Linux:** `sudo resolvectl flush-caches`

UI shows **only valid steps** for target device OS.

---

## 🔄 Execution Paths

| Path | Label | Availability | Description |
|------|-------|--------------|-------------|
| **agent** | Agent (Local) | All tiers | Runs on device via BuboIQ Agent |
| **connect** | Connect (Remote) | Pro & Team | Runs via BuboIQ Connect session |
| **winrm** | WinRM | Future | Windows Remote Management (planned) |

---

## 📊 Console Stream Features

### Live Output

- **Real-time streaming** with timestamps
- **Type indicators:** stdout, stderr, info, error
- **Auto-scroll** to latest output
- **Syntax highlighting** for commands

### Controls

- **Copy** → Copies all output to clipboard
- **Save .txt** → Downloads console log
- **Redact toggle** → Auto-redacts emails, IPs, UUIDs, passwords
- **Find** → Search within output

### Redaction Patterns

```typescript
// Auto-redacted on copy/export when enabled:
/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g → [EMAIL_REDACTED]
/\b(?:\d{1,3}\.){3}\d{1,3}\b/g → [IP_REDACTED]
/\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi → [ID_REDACTED]
/password[=:]\s*\S+/gi → password=[REDACTED]
```

---

## 📚 Knowledge Base Integration

### Auto-Draft Workflow

1. **Guided Fix completes successfully** → All steps executed
2. **System creates draft article** with structure:
   - **Prechecks:** Prerequisites and environment validation
   - **Fix:** Step-by-step commands with output
   - **Verify:** Validation steps to confirm resolution
3. **Header metadata:** Source execution ID, device, timestamp
4. **Toast notification:** "Draft created in Knowledge Base" with CTA link
5. **User reviews/edits** in KB editor
6. **Publish** or **Request Review** (Team tier)

### Draft Metadata

```typescript
{
  source: 'guided_fix',
  executionId: 'guid',
  deviceId: 'device-guid',
  guidedFixId: 'network-dns',
  timestamp: '2024-10-28T...',
  redacted: true,
  status: 'draft'
}
```

---

## 🎭 Product Screens (Conceptual Integration Points)

Based on Figma prompt, these are the intended integration points:

### 1. Issue Detail — "Fix Suggestions"

**Location:** Below Signals panel on ticket/issue detail page

**Content:** List of `GuidedFixCard` components matching issue symptoms

**Example:**
```tsx
<GuidedFixCard
  id="network-dns"
  title="Network: No Internet Connection"
  description="Diagnose and fix DNS issues, flush cache, reset Winsock catalog"
  os={['windows', 'macos', 'linux']}
  safety="low"
  estMins="2–4 min"
  tierState="pro"
  onRun={(id) => setShowRunner(true)}
/>
```

### 2. Computer Page — "Quick Actions"

**Location:** Side panel on device detail page

**Content:** Grid of `QuickActionTile` for single-step fixes

**Example:**
```tsx
<QuickActionTile
  id="flush-dns"
  icon={Network}
  title="Flush DNS Cache"
  os="windows"
  safety="low"
  onClick={(id) => executeQuickAction(id)}
/>
```

### 3. Incident Room — "Diagnostics"

**Location:** New tab in Incident Room

**Content:** Embedded `GuidedFixRunnerDrawer` for triage workflow

**Flow:** Network → Disk → Process → Updates (progress dots)

### 4. Admin — "Guided Fixes"

**Location:** Admin section (future)

**Content:**
- Table: Title, OS targets, Safety, Version, Status
- Detail view with read-only step list
- v2 placeholder: disabled "Visual Authoring" button

---

## 📝 FAQ Integration

**Added 14 questions** to `/components/marketing/FAQPage.tsx`:

1. What are Guided Fixes?
2. Do Guided Fixes execute commands automatically?
3. Which plans include Guided Fixes?
4. Are Guided Fixes safe for production machines?
5. How does remote execution work with Guided Fixes?
6. What data is collected during execution?
7. Can I create my own Guided Fixes?
8. Do Guided Fixes cover all operating systems?
9. Can I preview a Guided Fix before running it?
10. How do approvals work for Guided Fixes?
11. What happens if a step fails?
12. Will Guided Fixes create Knowledge Base articles automatically?
13. Can I use industry presets?
14. Do Guided Fixes change my pricing?

All categorized under `'features'`, `'pricing'`, `'security'`, or `'support'`.

---

## 🎨 Features Page Section

**Added to `/components/marketing/FeaturesPage.tsx`:**

```typescript
{
  id: 'guided-fixes',
  title: 'Guided Fixes',
  subtitle: 'Resolve issues faster—with safety built in',
  icon: <Wrench />,
  description: 'One-click actions across Windows, macOS, and Linux with safety grades and auto-generated KB articles',
  features: [
    'Cross-OS Actions',
    'Safety Grades',
    'Typed Confirms',
    'Auto-Draft KB',
    'Team Controls',
    'Live Console'
  ]
}
```

---

## 🧪 Sample Guided Fixes (Content Seeds)

### Network: No Internet

**Steps:**
1. Check DNS configuration (Read-Only)
2. Flush DNS cache (Low)
3. Reset network adapter (Risky)

**OS:** Windows, macOS, Linux

**Est:** 2–4 min

### Investigate High CPU

**Steps:**
1. List top processes (Read-Only)
2. Collect performance counters (Read-Only)
3. Generate report (Read-Only)

**OS:** Windows, macOS, Linux

**Est:** 1–3 min

### Collect Logs Bundle

**Steps:**
1. Export system logs (Read-Only)
2. Export event logs (Read-Only)
3. Package for support (Read-Only)

**OS:** Windows

**Est:** 1–2 min

### Disk Space Sweep

**Steps:**
1. Find large files (Read-Only)
2. Clean temp folders (Risky)
3. Empty recycle bin (Risky)

**OS:** Windows, Linux

**Est:** 2–6 min

---

## 🔌 API Integration (Backend Stub)

### Endpoints (to be implemented)

```typescript
// GET /runbooks
// List all available Guided Fixes
GET /api/guided-fixes
Response: GuidedFix[]

// GET /runbooks/:id
// Get detailed steps for a Guided Fix
GET /api/guided-fixes/:id
Response: GuidedFixDetail

// POST /runbooks/:id/execute
// Execute a Guided Fix on a device
POST /api/guided-fixes/:id/execute
Body: { deviceId, path: 'agent' | 'connect', options }
Response: { executionId, wsUrl }

// WS /executions/:id/stream
// WebSocket for live console output
WS /api/executions/:id/stream
Events: step_start, output, parser_signal, step_complete, execution_complete
```

### WebSocket Events

```typescript
// Server → Client
{
  type: 'step_start',
  stepId: 'step-1',
  timestamp: '...'
}

{
  type: 'output',
  text: 'Running: ipconfig /flushdns',
  stream: 'stdout' | 'stderr',
  timestamp: '...'
}

{
  type: 'parser_signal',
  signal: 'DNS_TIMEOUT',
  severity: 'warning'
}

{
  type: 'step_complete',
  stepId: 'step-1',
  status: 'success' | 'failed',
  duration: 1234
}

{
  type: 'execution_complete',
  status: 'success',
  kbDraftId: 'guid'
}
```

---

## ♿ Accessibility

### Keyboard Navigation

- **Tab order:** All interactive elements focusable
- **Enter:** Activates Run/Preview buttons
- **Esc:** Closes drawer/modals
- **Arrow keys:** Navigate step list

### Focus Management

- **Focus ring:** 2px solid `color/accent-neo` (`#00FF85`)
- **Touch targets:** Minimum 44px × 44px
- **Contrast:** All text meets WCAG AA against backgrounds

### Screen Readers

- All icons have `aria-label`
- Status changes announced via `aria-live="polite"`
- Step states clearly labeled
- Command blocks selectable for copy

---

## 🚀 Deployment Checklist

### Frontend

- [x] Component library created in `/components/guided-fixes/`
- [x] All components exported via `index.ts`
- [x] TypeScript types defined
- [x] Accessibility features implemented
- [x] FAQ entries added (14 questions)
- [x] Features page section added
- [x] Showcase/demo page created

### Backend (To-Do)

- [ ] Create `runbooks` table in Supabase
- [ ] Implement API endpoints for listing/executing
- [ ] Set up WebSocket server for console streaming
- [ ] Add tier enforcement middleware
- [ ] Implement KB auto-draft creation
- [ ] Add audit logging for executions
- [ ] Create Team approval workflow

### Content (To-Do)

- [ ] Seed initial Guided Fixes (5–10 common fixes)
- [ ] Create industry preset packs (Healthcare, Finance, SaaS)
- [ ] Write internal runbook documentation
- [ ] Create video demos for marketing

---

## 📖 Developer Notes

### Internal vs. Customer-Facing Terminology

- **Customer UI:** Always say "Guided Fix(es)"
- **Internal code:** Resource name may be `runbook`
- **Admin UI:** Can display "runbook" in dev notes only
- **API:** Endpoints use `/guided-fixes` or `/runbooks` (decide on one)

### Component Props Interface

```typescript
// GuidedFixCard
interface GuidedFixCardProps {
  id: string;                    // Unique identifier
  title: string;                 // Display name
  description: string;           // One-line summary
  os: OSType[];                  // Supported operating systems
  safety: SafetyLevel;           // Safety classification
  estMins: string;               // Time estimate (e.g., "2–4 min")
  tierState: TierState;          // Access control state
  density?: Density;             // UI density (comfortable | compact)
  requiresApproval?: boolean;    // Team approval required
  onRun?: (id: string) => void;
  onPreview?: (id: string) => void;
}

// GuidedFixRunner
interface GuidedFixRunnerDrawerProps {
  guidedFixId: string;           // Which fix to run
  title: string;                 // Display title
  issueId?: string;              // Optional linked ticket
  computerId?: string;           // Target device
  defaultPath?: ExecutionPath;   // 'agent' | 'connect' | 'winrm'
  onClose: () => void;
}
```

---

## 🎯 Next Steps

### Phase 1: Backend Implementation
1. Create Supabase schema for `guided_fixes` table
2. Implement API endpoints
3. Set up WebSocket streaming
4. Add tier guards to API

### Phase 2: Content Creation
1. Seed 10 common Guided Fixes
2. Create industry packs
3. Write comprehensive docs

### Phase 3: Integration
1. Add Guided Fix suggestions to Issue Detail
2. Implement Quick Actions panel on Computer page
3. Add Diagnostics tab to Incident Room
4. Build Admin management UI

### Phase 4: Advanced Features
1. Visual authoring for custom Guided Fixes
2. Rollback command support
3. Scheduling/automation
4. Conditional logic (if/then steps)

---

## 📚 References

- **Component Library:** `/components/guided-fixes/`
- **FAQ Updates:** `/components/marketing/FAQPage.tsx` (lines 145–186)
- **Features Page:** `/components/marketing/FeaturesPage.tsx` (Guided Fixes bucket)
- **Showcase:** `/components/guided-fixes/GuidedFixesShowcase.tsx`
- **Design System:** `/styles/globals.css`
- **Pricing:** Starter $33 | Pro $127 | Team $297

---

**Status:** ✅ Complete and ready for backend integration  
**Last Updated:** October 28, 2024  
**Maintained by:** BuboIQ Engineering  
**Questions?** See FAQ or contact help@buboiq.com
