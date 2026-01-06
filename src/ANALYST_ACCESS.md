# 🚀 Quick Access: BuboIQ Analyst v1 Prototype

## ⚡ 3 Ways to View the Prototype

### 1. Simplest (Recommended for First View)
Import the standalone demo page:

```tsx
import { AnalystDemoPage } from './components/AnalystDemoPage';

// Use anywhere in your app
<AnalystDemoPage />
```

### 2. Direct Prototype Access
Import the main prototype component:

```tsx
import { AnalystPrototype } from './components/analyst/AnalystPrototype';

<AnalystPrototype />
```

### 3. Individual Components
Use specific components in your existing screens:

```tsx
import { 
  ConfidenceOrb, 
  ReasoningTraceCard,
  ActionItem,
  StatusPill
} from './components/analyst';

// Use anywhere
<ConfidenceOrb value={87} />
```

## 📍 What You'll See

### Navigation Bar (Fixed Top)
```
[Library] [Console] [Issue] [KB Editor] [Policy] [Jobs] 
[Alerts] [Traces] [Roles] [Onboarding] [Kill Switch] [Handoff]
```

- **Green highlight** = Active screen
- **Handoff tab** = Developer documentation (start here!)
- Click any tab to switch screens

### Screen Overview

| Tab | Screen | Purpose |
|-----|--------|---------|
| **Library** | Component Library | All UI components with live examples |
| **Console** | Agent Console | Main dashboard (entry point) |
| **Issue** | Issue Detail | Ticket with AI recommendation |
| **KB Editor** | KB Draft Editor | Article editor with version history |
| **Policy** | Policy Settings | Configure AI guardrails |
| **Jobs** | Device Action Jobs | Monitor execution status |
| **Alerts** | Alerts & Telemetry | Metrics and alert dashboard |
| **Traces** | Traces & Lineage | Reasoning flow visualization |
| **Roles** | Roles & Access | User management |
| **Onboarding** | Org Onboarding | 6-step setup wizard |
| **Kill Switch** | Runbook & Kill Switch | Emergency controls |
| **Handoff** ⭐ | Developer Handoff | Tokens, examples, docs |

## 🎯 Recommended Exploration Path

### For Designers
1. **Library** → See all components
2. **Console** → See main layout
3. **Issue** → See AI integration
4. **Handoff** → Review specs

### For Developers
1. **Handoff** → Copy tokens first! ⭐
2. **Library** → Understand components
3. **Console** → See components in context
4. **Source code** → `/components/analyst/screens/`

### For Product
1. **Console** → Main user flow
2. **Policy** → Configuration options
3. **Kill Switch** → Emergency features
4. **Onboarding** → Setup experience

## 🛠️ Quick Component Examples

### Display AI Confidence
```tsx
import { ConfidenceOrb } from './components/analyst';

<ConfidenceOrb value={87} />
// Auto-colors: ≥80 green, ≥60 yellow, <60 red
// Aura scales with value
```

### Show Agent Status
```tsx
import { StatusPill } from './components/analyst';

<StatusPill status="approvalRequired" />
// Options: 'observing' | 'approvalRequired' | 'autoApproveActive'
```

### Display AI Reasoning
```tsx
import { ReasoningTraceCard } from './components/analyst';

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

### Pending Actions
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

## 📚 Documentation Files

- **ANALYST_V1_COMPLETE.md** → Complete system documentation
- **ANALYST_QUICK_START.md** → Detailed getting started guide
- **ANALYST_SYSTEM_MAP.md** → Architecture and file structure
- **This file** → Quick access reference

## ✨ Interactive Features

The prototype includes working interactions:

✅ **Console → Trace** → Opens lineage view  
✅ **Console → Approve** → Shows modal → Navigates to jobs  
✅ **Issue → Apply** → Shows diff modal → Success toast  
✅ **Policy → Save** → Updates console status  
✅ **Jobs → Click** → Opens detail drawer  
✅ **Kill Switch → Toggle** → Shows confirmation → Global banner  

## 🎨 Design Tokens

All tokens are in the **Handoff** tab, but here's a quick reference:

### Colors
- Accent: `#00FF85` (neon green)
- Info: `#3EA0FF` (electric blue)
- Warning: `#F6C14A`
- Danger: `#FF6B6B`
- Success: `#55D187`

### Typography
- Headlines: **Space Grotesk** (Bold/SemiBold)
- Body: **Inter** (Regular)
- Code: **JetBrains Mono**

### Spacing
4px, 8px, 12px, 16px, 24px, 32px, 48px

## 🚨 Important Notes

### This is a Complete Prototype
- All 11 screens are functional
- Navigation is fully wired
- Components are production-ready
- Design tokens are export-ready
- Accessibility is WCAG AA compliant

### What's NOT Included
- Real backend API connections (uses mock data)
- Authentication (assumes logged in)
- Mobile optimization (desktop-first design)

### Ready for Integration
✅ Copy components to use in existing BuboIQ screens  
✅ Import design tokens into Tailwind config  
✅ Use as reference for building real features  
✅ Hand off to developers with Handoff tab  

## 📞 Need Help?

1. Check the **Handoff** tab in the prototype
2. Read **ANALYST_V1_COMPLETE.md** for full docs
3. See **ANALYST_QUICK_START.md** for tutorials
4. View **ANALYST_SYSTEM_MAP.md** for architecture

---

## ⚡ TL;DR - Start Here

```tsx
// Add this ONE line to your app:
import { AnalystDemoPage } from './components/AnalystDemoPage';

// Then render it:
<AnalystDemoPage />

// That's it! The prototype is ready to explore.
```

**Navigate to the Handoff tab first for design tokens and component docs!** ⭐
