# BuboIQ Analyst v1 - Design System

> Complete production-ready UI system with 11 screens, component library, and developer handoff materials.

## 📦 What's Inside

```
/components/analyst/
├── index.ts                     # Public exports
├── design-tokens.ts             # Design system tokens
├── AnalystPrototype.tsx         # Main prototype with navigation
├── AnalystComponentLibrary.tsx  # Complete UI kit
├── HandoffPage.tsx              # Developer documentation
└── screens/
    ├── AgentConsole.tsx         # Main dashboard
    ├── IssueDetail.tsx          # Ticket with AI panel
    ├── KBDraftEditor.tsx        # Article editor
    ├── AllScreens.tsx           # Screens 4-8
    └── RemainingScreens.tsx     # Screens 9-11
```

## 🚀 Quick Start

### View the Complete Prototype
```tsx
import { AnalystPrototype } from './components/analyst';

<AnalystPrototype />
```

### Use Individual Components
```tsx
import { 
  ConfidenceOrb,
  StatusPill,
  ReasoningTraceCard,
  ActionItem
} from './components/analyst';

<ConfidenceOrb value={87} />
<StatusPill status="approvalRequired" />
```

### Import Design Tokens
```tsx
import { AnalystTokens, cssVariables } from './components/analyst/design-tokens';
```

## 🎨 Component Library

### Primitives
- `AnalystButton` - Primary, secondary, ghost, danger variants
- `AnalystInput` - Text inputs with error states
- `AnalystBadge` - Status and category indicators
- `StatusPill` - Agent operational status with pulse

### Specialized
- `ConfidenceOrb` - 0-100% confidence with dynamic aura
- `MetricCard` - KPI display with delta
- `PolicyChip` - Policy configuration indicator
- `RiskHint` - Action risk warnings
- `CodeBlock` - Syntax-highlighted JSON with copy
- `EmptyState` - No data placeholder

### Patterns
- `ReasoningTraceCard` - AI reasoning snapshot
- `ActionItem` - Pending action with approval
- `DeviceJobRow` - Execution job status
- `TierGuardBanner` - Feature restriction notice

## 📱 11 Screens

1. **AgentConsole** - Main dashboard with traces and actions
2. **IssueDetail** - Ticket detail with AI recommendation
3. **KBDraftEditor** - Article editor with version history
4. **ApprovalDialog** - Action approval modal
5. **PolicySettings** - Tier and guardrail configuration
6. **DeviceActionJobs** - Execution monitoring
7. **AlertsTelemetry** - Metrics and alerts
8. **TracesLineage** - Reasoning visualization
9. **RolesAccess** - User management
10. **OrgOnboarding** - 6-step setup wizard
11. **RunbookKillSwitch** - Emergency controls

## 🎯 Design Tokens

### Colors
```css
--analyst-accent: #00FF85;      /* Neon green primary */
--analyst-info: #3EA0FF;        /* Electric blue */
--analyst-warn: #F6C14A;        /* Warning yellow */
--analyst-danger: #FF6B6B;      /* Danger red */
--analyst-success: #55D187;     /* Success green */
```

### Typography
- **Headlines**: Space Grotesk (Bold/SemiBold)
- **Body**: Inter (Regular)
- **Code**: JetBrains Mono

### Spacing
4px, 8px, 12px, 16px, 24px, 32px, 48px

## ✨ Key Features

### Glassmorphism
- `rgba(15, 18, 22, 0.82)` backgrounds
- `12px` backdrop blur
- Subtle border glow on hover

### Accessibility
- ✅ WCAG AA compliant (4.5:1 contrast)
- ✅ Visible focus rings
- ✅ 44×44px touch targets
- ✅ Keyboard navigation
- ✅ ARIA labels

### Responsive
- Desktop XL: 1440px
- Desktop: 1280px
- Laptop: 1024px
- Tablet: 768px

## 📚 Documentation

See root-level docs for complete information:
- `/ANALYST_V1_COMPLETE.md` - Full documentation
- `/ANALYST_QUICK_START.md` - Getting started
- `/ANALYST_SYSTEM_MAP.md` - Architecture
- `/ANALYST_ACCESS.md` - Quick reference

## 🔧 Component Examples

### ConfidenceOrb
```tsx
<ConfidenceOrb value={87} />
```
- Auto-colors based on value
- Aura intensity scales with confidence

### StatusPill
```tsx
<StatusPill status="approvalRequired" />
```
- States: observing | approvalRequired | autoApproveActive
- Includes animated pulse dot

### ReasoningTraceCard
```tsx
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
```

### ActionItem
```tsx
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

Each screen includes:
- ✅ Default (with data)
- ✅ Loading (skeleton)
- ✅ Empty (no data)
- ✅ Error (retry)

Example:
```tsx
import { 
  AgentConsole, 
  AgentConsoleLoading, 
  AgentConsoleEmpty 
} from './components/analyst';
```

## 🔗 Prototype Navigation

The prototype includes a top navigation bar with tabs:
- Library → Component showcase
- Console → Main dashboard (entry point)
- Issue, KB Editor, Policy, Jobs, Alerts, Traces
- Roles, Onboarding, Kill Switch
- **Handoff** ⭐ → Developer documentation

### Wired Interactions
- Console → Click trace → Traces page
- Console → Approve action → Modal → Jobs page
- Issue → Apply to ticket → Confirmation modal
- Policy → Save → Console status update
- Jobs → Click row → Detail drawer
- Kill Switch → Toggle → Confirmation → Banner

## 📊 Data Structures

### Trace
```typescript
{
  timestamp: string;
  confidence: number;
  summary: Record<string, string>;
  traceId: string;
}
```

### Action
```typescript
{
  actionType: string;
  params: Record<string, string>;
  risks: string[];
  confidence: number;
}
```

### Job
```typescript
{
  jobId: string;
  device: string;
  actionType: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  started: string;
  ended?: string;
}
```

## 🎓 Best Practices

### Using Components
1. Import from `./components/analyst`
2. Check HandoffPage for props contracts
3. Use TypeScript for type safety
4. Follow microcopy standards (see Handoff)

### Styling
1. Use design tokens from `design-tokens.ts`
2. Follow spacing system (4/8/12/16/24/32/48)
3. Maintain WCAG AA contrast ratios
4. Use glassmorphism for panels

### State Management
1. Use `useState` for local state
2. Use `onNavigate` callback for routing
3. Use `toast` from sonner for notifications
4. Handle loading/empty/error states

## 🚨 Important Notes

### Production Ready
- All components are fully functional
- Design tokens are export-ready
- Accessibility is built-in
- TypeScript types included

### Mock Data
- Backend API calls use placeholder data
- Replace with real endpoints for production
- Data structures are documented

### Integration
- Import individual components as needed
- Use prototype as reference
- Copy design tokens to Tailwind config
- Refer to HandoffPage for implementation

## 📞 Support

For questions about:
- **Components**: See `AnalystComponentLibrary.tsx`
- **Tokens**: See `design-tokens.ts`
- **Implementation**: See `HandoffPage.tsx`
- **Architecture**: See `/ANALYST_SYSTEM_MAP.md`

---

**Built for BuboIQ with dark-first design, neon green accent (#00FF85), and WCAG AA accessibility.**
