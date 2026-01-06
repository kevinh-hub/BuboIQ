# BuboIQ Analyst v1 - Quick Start Guide

## 🚀 Immediate Access

The complete BuboIQ Analyst v1 prototype is ready to view! Here's how to access it:

### Option 1: Direct Import (Recommended)

Add this to your `App.tsx` or create a new route:

```tsx
import { AnalystDemoPage } from './components/AnalystDemoPage';

// In your router or App component:
<AnalystDemoPage />
```

### Option 2: Component Library Only

View just the component library and design system:

```tsx
import { AnalystComponentLibrary } from './components/analyst/AnalystComponentLibrary';

<AnalystComponentLibrary />
```

### Option 3: Full Prototype with Navigation

Import the complete prototype with all 11 screens:

```tsx
import { AnalystPrototype } from './components/analyst/AnalystPrototype';

<AnalystPrototype />
```

## 📋 What's Included

### ✅ Component Library
Navigate to **Library** tab to see:
- All primitive components (buttons, inputs, badges)
- Specialized components (ConfidenceOrb, MetricCard, PolicyChip)
- Pattern components (ReasoningTraceCard, ActionItem, DeviceJobRow)
- Accessibility specs and design tokens

### ✅ 11 Production Screens

1. **Console** - Main dashboard with reasoning traces and pending actions
2. **Issue** - Ticket detail with AI analyst recommendation panel
3. **KB Editor** - Knowledge base article editor with confidence trends
4. **Policy** - Tier and guardrail configuration
5. **Jobs** - Device action execution monitoring
6. **Alerts** - Telemetry and alert dashboard
7. **Traces** - Reasoning lineage visualization
8. **Roles** - User and permission management
9. **Onboarding** - 6-step org setup wizard
10. **Kill Switch** - Emergency controls and runbooks
11. **Handoff** - Complete developer documentation

### ✅ Interactive Flows

The prototype includes wired interactions:

- **Console → Trace Click** → Opens Traces & Lineage page
- **Console → Approve Action** → Opens Approval Modal → Success → Navigates to Jobs
- **Issue → Apply to Ticket** → Shows confirmation modal with diff → Success toast
- **Policy → Save** → Updates status pills on Console
- **Jobs → Click Row** → Opens detail drawer with rollback option
- **Onboarding → Complete** → Navigates to Console

## 🎨 Navigation Guide

The prototype includes a **fixed top navigation bar** with tabs:

```
[Library] [Console] [Issue] [KB Editor] [Policy] [Jobs] 
[Alerts] [Traces] [Roles] [Onboarding] [Kill Switch] [Handoff]
```

- **Active tab** is highlighted in neon green
- **Handoff tab** has special accent styling (this is your developer documentation)
- Click any tab to switch screens instantly

## 🎯 Key Features to Explore

### 1. Component Library Tab
- **Design Tokens**: Complete color palette, typography, spacing
- **Primitives**: See all button variants, inputs, badges with live examples
- **Specialized**: ConfidenceOrb with dynamic aura, MetricCard with deltas
- **Patterns**: Pre-built card components with real data examples

### 2. Console Screen
- **Recent Reasoning Traces**: AI analysis cards with confidence orbs
- **Pending Actions**: Actionable items with risk hints and approval buttons
- **Kill Switch Indicator**: Global observe-only mode banner
- **Footer Controls**: Org selector, trace ID, re-run button

### 3. Issue Detail Screen
- **AI Recommendation Panel**: Sticky sidebar with confidence orb
- **Apply to Ticket**: Click to see before/after diff modal
- **Activity Log**: Timeline of ticket events

### 4. Handoff Tab ⭐
**This is where developers should start!**
- **Design Tokens**: Copy-paste ready Tailwind config and CSS variables
- **Component Examples**: JSX code snippets with props contracts
- **Pattern Library**: State management examples and microcopy reference
- **Redlines**: Typography specs, spacing, shadows, breakpoints

## 📦 Component Usage Examples

### ConfidenceOrb
```tsx
import { ConfidenceOrb } from './components/analyst';

<ConfidenceOrb value={87} />
```
- Value 0-100
- Color auto-adjusts: ≥80 green, ≥60 yellow, <60 red
- Aura intensity scales with confidence

### StatusPill
```tsx
import { StatusPill } from './components/analyst';

<StatusPill status="approvalRequired" />
```
- States: `observing` | `approvalRequired` | `autoApproveActive`
- Includes animated pulse dot

### ActionItem
```tsx
import { ActionItem } from './components/analyst';

<ActionItem
  actionType="restart_service"
  params={{ service: 'print_spooler' }}
  risks={['rollback']}
  confidence={87}
  onApprove={() => console.log('Approved')}
  onReject={() => console.log('Rejected')}
/>
```

## 🎭 State Variants

Each screen includes multiple states:

### Agent Console
- **Default**: With data
- **Loading**: Skeleton screens (`AgentConsoleLoading`)
- **Empty**: No data state (`AgentConsoleEmpty`)

### All Screens
- **Responsive**: Tested at 1440px, 1280px, 1024px, 768px
- **Interactive**: Hover states, focus rings, loading spinners
- **Accessible**: ARIA labels, keyboard navigation, WCAG AA contrast

## 🔧 Developer Workflow

### Step 1: Explore the Prototype
```bash
# The prototype is ready to run - just navigate to it in your app
```

### Step 2: Copy Design Tokens
1. Go to **Handoff** tab
2. Click **Design Tokens** section
3. Copy Tailwind config or CSS variables
4. Paste into your `tailwind.config.js` or `globals.css`

### Step 3: Use Components
1. Import from `./components/analyst`
2. Copy JSX examples from **Handoff → Component Examples**
3. Customize props as needed

### Step 4: Integrate Screens
1. Import individual screens from `./components/analyst/screens`
2. Add to your router
3. Connect to real backend APIs (replace mock data)

## 📱 Responsive Behavior

All screens are responsive:

- **Desktop (1440px)**: Full 2-column layouts, side-by-side panels
- **Laptop (1024px)**: Slightly condensed, maintains 2-column where possible
- **Tablet (768px)**: Single column, stacked layouts
- **Mobile**: Not optimized (desktop-first design as specified)

## ✨ Design Highlights

### Glassmorphism
- Background: `rgba(15, 18, 22, 0.82)`
- Backdrop blur: `12px`
- Subtle border glow on hover

### Neon Accent
- Primary: `#00FF85` (neon green)
- Used for: Primary buttons, focus rings, orb auras, selection highlights
- Hover effects: Glow shadows (`0 0 20px rgba(0, 255, 133, 0.3)`)

### Typography Pairing
- **Headlines**: Space Grotesk Bold
- **Body**: Inter Regular
- **Code/Technical**: JetBrains Mono

## 🚨 Important Notes

### Kill Switch Feature
- Located in **Kill Switch** tab
- Toggle to enable "Observe-Only" mode
- Shows confirmation modal with impact warnings
- When active, displays global banner on Console

### Tier Gating
- Some features show `TierGuardBanner` component
- Examples in KB Editor (Publish) and Policy Settings
- Includes upgrade CTA and feature explanation

### Microcopy Consistency
All strings are standardized (see Handoff → Pattern Library → Microcopy):
- Status: "Observing", "Approval Required", "Auto-Approve Active"
- Guardrails: "AI suggestions require review."
- Toasts: "Action approved & dispatched.", "Ticket updated.", etc.

## 📊 Data Structure Examples

### Reasoning Trace
```typescript
{
  timestamp: '2025-10-22 14:32:15',
  confidence: 87,
  summary: {
    device: 'WKS-SALES-042',
    issue: 'Print spooler failure',
    predicted_root_cause: 'Driver corruption detected',
  },
  traceId: 'trace_abc123',
}
```

### Action Item
```typescript
{
  actionType: 'restart_service',
  params: { service: 'print_spooler', device: 'WKS-SALES-042' },
  risks: ['rollback'],
  confidence: 87,
}
```

### Device Job
```typescript
{
  jobId: 'job_abc123',
  device: 'WKS-SALES-042',
  actionType: 'restart_service',
  status: 'succeeded',
  started: '2025-10-22 14:35:00',
  ended: '2025-10-22 14:35:12',
}
```

## 🎓 Learning Path

### For Designers
1. Start with **Component Library** tab
2. Explore each screen to see components in context
3. Check **Handoff** tab for spacing and typography specs

### For Developers
1. Start with **Handoff** tab for tokens and examples
2. Review **Component Library** tab for available components
3. Explore screen source code in `/components/analyst/screens/`

### For Product Managers
1. Navigate through all 11 screens via top nav
2. Test interactive flows (approval, policy saves, etc.)
3. Review microcopy in **Handoff → Pattern Library**

## 📞 Support

All code is fully documented with:
- JSDoc comments
- TypeScript interfaces
- Props contracts in Handoff page
- Component state examples

**Files to Reference:**
- `/ANALYST_V1_COMPLETE.md` - Complete documentation
- `/components/analyst/HandoffPage.tsx` - Developer documentation UI
- `/components/analyst/design-tokens.ts` - Token definitions
- `/components/analyst/AnalystComponentLibrary.tsx` - Component implementations

---

**The prototype is production-ready and fully functional. Start exploring! 🚀**
