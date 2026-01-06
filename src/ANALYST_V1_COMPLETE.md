# BuboIQ Analyst v1 - Complete Design System & Prototype

## 🎯 Project Overview

A production-ready React/TypeScript UI system and full application prototype for **BuboIQ Analyst v1** — an AI support analyst for IT operations. Complete with 11 screens, comprehensive component library, design tokens, and developer handoff materials.

## 📦 Deliverables

### ✅ Component Library
- **Location**: `/components/analyst/AnalystComponentLibrary.tsx`
- **Primitives**: Buttons, Inputs, Badges, Status Pills, Toggles
- **Specialized**: ConfidenceOrb, MetricCard, PolicyChip, RiskHint, CodeBlock, EmptyState
- **Patterns**: ReasoningTraceCard, ActionItem, DeviceJobRow, TierGuardBanner

### ✅ 11 Production Screens

1. **Agent Console** (`/components/analyst/screens/AgentConsole.tsx`)
   - Main dashboard with reasoning traces and pending actions
   - Kill switch indicator
   - Org selector and trace ID preview
   - Loading, empty, and error states included

2. **Issue Detail** (`/components/analyst/screens/IssueDetail.tsx`)
   - Ticket management with AI recommendation panel
   - Apply to Ticket confirmation modal with diff preview
   - Priority and status selectors

3. **KB Draft Editor** (`/components/analyst/screens/KBDraftEditor.tsx`)
   - Article editor with accordion sections (Prechecks, Fix, Verify)
   - Confidence trend chart
   - Version history
   - Tier-gated publish functionality

4. **Approval Dialog** (`/components/analyst/screens/AllScreens.tsx`)
   - Modal for action approval
   - Risk hints and policy summary
   - Confidence display with orb
   - View lineage link

5. **Policy Settings** (`/components/analyst/screens/AllScreens.tsx`)
   - Tier selection (Starter/Pro/Team)
   - Confidence threshold slider
   - Safelist action toggles
   - Rollback requirement switch
   - Active policy chips

6. **Device Action Jobs** (`/components/analyst/screens/AllScreens.tsx`)
   - Job status table (queued/running/succeeded/failed)
   - Detail drawer with execution timeline
   - Rollback button
   - Logs download

7. **Alerts & Telemetry** (`/components/analyst/screens/AllScreens.tsx`)
   - Metric cards (24h stats)
   - Alert list with severity filters
   - Deep links to traces

8. **Traces & Lineage** (`/components/analyst/screens/AllScreens.tsx`)
   - Visual trace graph (reason → actions → callbacks)
   - Confidence orbs on nodes
   - Embedded JSON with copy buttons

9. **Roles & Access** (`/components/analyst/screens/RemainingScreens.tsx`)
   - User table with role management
   - Permission matrix
   - Invite user flow

10. **Org Onboarding** (`/components/analyst/screens/RemainingScreens.tsx`)
    - 6-step wizard
    - Beta notice banner
    - Progress stepper
    - Legal review step

11. **Runbook & Kill Switch** (`/components/analyst/screens/RemainingScreens.tsx`)
    - Global kill switch control with confirmation
    - 8 operational playbooks
    - Impact warnings

### ✅ Interactive Prototype
- **Location**: `/components/analyst/AnalystPrototype.tsx`
- Complete navigation system linking all screens
- Wired interactions:
  - Console → Trace detail
  - Console → Action approval → Jobs
  - Issue → Apply modal → Success toast
  - Policy → Save → Console update
  - Jobs → Detail drawer → Rollback modal
  - Onboarding → Final step → Console

### ✅ Developer Handoff
- **Location**: `/components/analyst/HandoffPage.tsx`
- Tailwind-compatible design tokens
- CSS custom properties
- Redlines & specifications
- JSX component examples with props contracts
- State management patterns
- Microcopy reference
- Responsive breakpoints

### ✅ Design Tokens
- **Location**: `/components/analyst/design-tokens.ts`
- Complete color palette
- Typography scale
- Spacing system
- Border radius values
- Elevation (shadows)
- Export-ready for Tailwind and CSS

## 🎨 Design System Specifications

### Brand Colors
- **Primary Accent**: `#00FF85` (Neon Green)
- **Info**: `#3EA0FF` (Electric Blue)
- **Warning**: `#F6C14A`
- **Danger**: `#FF6B6B`
- **Success**: `#55D187`
- **Background**: `#050607` → `#0A0B0D` → `#0E1014`
- **Border**: `#1F242D`
- **Text**: `#EAEFF5` → `#C7D0DA` → `#AAB4C0` → `#7A8694`

### Typography
- **Headings**: Space Grotesk (Bold/SemiBold)
- **Body**: Inter (Regular/Medium)
- **Code/Technical**: JetBrains Mono

### Glassmorphism
- Background: `rgba(15, 18, 22, 0.82)`
- Backdrop blur: `12px`
- Border: `1px solid rgba(0, 255, 133, 0.1)`

### Accessibility
- ✅ WCAG AA contrast ratios (4.5:1 minimum)
- ✅ Visible focus rings on all interactive elements
- ✅ 44×44px touch targets
- ✅ ARIA labels for icons
- ✅ Keyboard navigation support
- ✅ Loading skeletons and retry affordances

## 🚀 Quick Start

### View the Prototype

```tsx
import { AnalystPrototype } from './components/analyst/AnalystPrototype';

function App() {
  return <AnalystPrototype />;
}
```

Or access via standalone page:

```tsx
import { AnalystDemoPage } from './components/AnalystDemoPage';

<AnalystDemoPage />
```

### Use Individual Components

```tsx
import { 
  ConfidenceOrb, 
  ReasoningTraceCard, 
  ActionItem 
} from './components/analyst';

function MyScreen() {
  return (
    <div>
      <ConfidenceOrb value={87} />
      <ReasoningTraceCard
        timestamp="2025-10-22 14:32:15"
        confidence={87}
        summary={{
          device: 'WKS-SALES-042',
          issue: 'Print spooler failure',
          predicted_root_cause: 'Driver corruption detected',
        }}
        traceId="trace_abc123"
      />
    </div>
  );
}
```

### Import Design Tokens

```tsx
import { AnalystTokens, cssVariables } from './components/analyst/design-tokens';

// Use in your Tailwind config or CSS
```

## 📐 Component Specifications

### ConfidenceOrb
- **Props**: `{ value: number }` (0-100)
- **Behavior**: Aura intensity scales with value
- **Colors**: ≥80 green, ≥60 yellow, <60 red
- **Size**: 96px × 96px (w-24 h-24)

### StatusPill
- **Props**: `{ status: 'observing' | 'approvalRequired' | 'autoApproveActive' }`
- **States**:
  - Observing: Blue (`#3EA0FF`)
  - Approval Required: Yellow (`#F6C14A`)
  - Auto-Approve Active: Green (`#00FF85`)

### PolicyChip
- **Props**: `{ label: string; active?: boolean }`
- **Variants**: Neutral (inactive) or Accent (active with pulse dot)

### RiskHint
- **Props**: `{ type: 'rollback' | 'blast' | 'confidence'; children: ReactNode }`
- **Icons**: Info, AlertTriangle based on type
- **Colors**: Blue (rollback), Yellow (blast), Red (confidence)

## 🔗 Screen Navigation Map

```
Component Library
  ↓
Agent Console ← Main Entry Point
  ├→ Traces & Lineage
  ├→ Action Approval Modal → Device Jobs
  ├→ Issue Detail → Apply Modal
  ├→ Policy Settings
  ├→ Alerts & Telemetry
  ├→ Roles & Access
  └→ Kill Switch & Runbook

Org Onboarding → Agent Console
```

## 📱 Responsive Breakpoints

- **1440px**: Desktop XL (default design)
- **1280px**: Desktop
- **1024px**: Laptop
- **768px**: Tablet (2-column → 1-column grids)

## 🎭 Microcopy Reference

### Status Pills
- "Observing"
- "Approval Required"
- "Auto-Approve Active"

### Guardrails
- "AI suggestions require review."

### Risk Hints
- "Rollback required by policy."
- "High blast radius: affects multiple devices."
- "Low confidence: consider manual review."

### Kill Switch
- "Observe-Only is enabled. Executable actions are paused."

### Success Toasts
- "Action approved & dispatched."
- "Ticket updated."
- "Draft saved."
- "Embedding generated."
- "Policy saved."

## 🛠️ Developer Notes

### File Structure
```
/components/analyst/
  ├── AnalystPrototype.tsx        # Main prototype router
  ├── AnalystComponentLibrary.tsx # Complete UI kit
  ├── HandoffPage.tsx             # Developer handoff
  ├── design-tokens.ts            # Design system tokens
  ├── index.ts                    # Public exports
  └── screens/
      ├── AgentConsole.tsx
      ├── IssueDetail.tsx
      ├── KBDraftEditor.tsx
      ├── AllScreens.tsx          # Screens 4-8
      └── RemainingScreens.tsx    # Screens 9-11
```

### Dependencies
- React 18+
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- lucide-react (icons)
- sonner (toasts)

### Integration with BuboIQ
This system is designed to be:
1. **Standalone**: Can run as independent prototype
2. **Embeddable**: Components can be imported into existing BuboIQ app
3. **Extensible**: Easy to add new screens or modify existing ones
4. **Production-ready**: Includes error boundaries, loading states, accessibility

## 🎯 Next Steps

### For Designers
1. Review Component Library page
2. Explore all 11 screens in prototype
3. Check Handoff page for redlines and specs

### For Developers
1. Import design tokens into Tailwind config
2. Use component examples from Handoff page
3. Integrate screens into Next.js routing
4. Connect to backend APIs (placeholders included)

### For Product
1. Test interactive flows in prototype
2. Review microcopy for consistency
3. Validate tier-gating logic in Policy Settings

## 📄 License & Credits

**Created for**: BuboIQ Platform  
**Design System**: Analyst v1  
**Brand**: Dark-first, glass panels, neon accent #00FF85  
**Accessibility**: WCAG AA compliant  
**Status**: Production-ready ✅

---

**All 11 screens, component library, prototype navigation, and handoff materials are complete and ready for developer handoff.**
