# 🗺️ Live Demo System - Visual Integration Map

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         APP.TSX                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Main Application                      │  │
│  │                                                       │  │
│  │  State: [showLiveDemo, setShowLiveDemo]             │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │          MARKETING PAGES                    │    │  │
│  │  │  ┌───────────────────────────────────────┐  │    │  │
│  │  │  │        HomePage.tsx                   │  │    │  │
│  │  │  │                                       │  │    │  │
│  │  │  │  Props:                               │  │    │  │
│  │  │  │    - onNavigate                       │  │    │  │
│  │  │  │    - onTryItNow (old demo)           │  │    │  │
│  │  │  │    - onStartLiveDemo (NEW) ◄─────────┼──┼────┼──┤
│  │  │  │                                       │  │    │  │
│  │  │  │  Hero Section:                        │  │    │  │
│  │  │  │    ┌──────────────────────────────┐  │  │    │  │
│  │  │  │    │ "Start the Live Demo" ◄──────┼──┼──┼────┼──┤
│  │  │  │    │  (Neon Green Primary CTA)    │  │  │    │  │
│  │  │  │    └──────────────────────────────┘  │  │    │  │
│  │  │  │                                       │  │    │  │
│  │  │  │  Content Sections:                    │  │    │  │
│  │  │  │    - ValuePropositionSection          │  │    │  │
│  │  │  │    - HowItWorksSection                │  │    │  │
│  │  │  │    - Core Capabilities (existing)     │  │    │  │
│  │  │  │                                       │  │    │  │
│  │  │  └───────────────────────────────────────┘  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │      DEMO ORCHESTRATOR (Overlay)            │    │  │
│  │  │                                             │    │  │
│  │  │  Renders when: showLiveDemo === true       │    │  │
│  │  │                                             │    │  │
│  │  │  ┌───────────────────────────────────────┐ │    │  │
│  │  │  │      DemoLauncher.tsx                 │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  Modal explaining sandbox             │ │    │  │
│  │  │  │    - Time-limited (30-60 min)         │ │    │  │
│  │  │  │    - Synthetic data only              │ │    │  │
│  │  │  │    - Production recommendations       │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  Actions:                             │ │    │  │
│  │  │  │    [Maybe Later] [Start Demo]         │ │    │  │
│  │  │  │                    │                  │ │    │  │
│  │  │  └────────────────────┼──────────────────┘ │    │  │
│  │  │                       ↓                    │    │  │
│  │  │  ┌───────────────────────────────────────┐ │    │  │
│  │  │  │   LiveDemoConsole.tsx                 │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  Full-screen demo experience          │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  ┌──────────────┬──────────────────┐ │ │    │  │
│  │  │  │  │ Left Panel   │  Right Panel     │ │ │    │  │
│  │  │  │  ├──────────────┼──────────────────┤ │ │    │  │
│  │  │  │  │ Reasoning    │  Pending Actions │ │ │    │  │
│  │  │  │  │ Traces       │                  │ │ │    │  │
│  │  │  │  │              │  [Approve]       │ │ │    │  │
│  │  │  │  │ • Confidence │  [Reject]        │ │ │    │  │
│  │  │  │  │   Orb (87%)  │                  │ │ │    │  │
│  │  │  │  │              │                  │ │ │    │  │
│  │  │  │  │ • JSON       │                  │ │ │    │  │
│  │  │  │  │   Preview    │                  │ │ │    │  │
│  │  │  │  │              │                  │ │ │    │  │
│  │  │  │  └──────────────┴──────────────────┘ │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  Tabs: [Console] [Policies] [Jobs]    │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  User clicks Approve ──┐              │ │    │  │
│  │  │  └────────────────────────┼──────────────┘ │    │  │
│  │  │                           ↓                │    │  │
│  │  │  ┌───────────────────────────────────────┐ │    │  │
│  │  │  │   LeadCaptureModal.tsx                │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  "Want this on your devices?"         │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  Form:                                │ │    │  │
│  │  │  │    [Name]                             │ │    │  │
│  │  │  │    [Email]                            │ │    │  │
│  │  │  │    [Company]                          │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  [Get Your Pilot Started]             │ │    │  │
│  │  │  │  [Skip for now]                       │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  │  On submit → Success screen           │ │    │  │
│  │  │  │  Auto-close after 3s                  │ │    │  │
│  │  │  │                                       │ │    │  │
│  │  │  └───────────────────────────────────────┘ │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Flow Diagram

```
┌──────────────┐
│  App Loads   │
└──────┬───────┘
       │
       ├─→ showLiveDemo = false (initial)
       │
       ├─→ HomePage renders with CTA
       │
       └─→ User clicks "Start the Live Demo"
           │
           ├─→ showLiveDemoExperience() fires
           │   │
           │   ├─→ setShowLiveDemo(true)
           │   │
           │   └─→ gtag('event', 'live_demo_started')
           │
           └─→ DemoOrchestrator renders
               │
               ├─→ DemoLauncher shows
               │   │
               │   ├─→ User clicks "Maybe Later"
               │   │   └─→ onClose() → showLiveDemo = false
               │   │
               │   └─→ User clicks "Start Demo"
               │       │
               │       ├─→ 1.5s loading simulation
               │       │
               │       └─→ LiveDemoConsole renders
               │           │
               │           ├─→ Initialize traces & actions
               │           │
               │           ├─→ User explores tabs
               │           │   ├─→ Console
               │           │   ├─→ Policies (kill switch)
               │           │   └─→ Device Jobs
               │           │
               │           ├─→ User approves action
               │           │   │
               │           │   ├─→ Toast notification
               │           │   │
               │           │   ├─→ Wait 1.5s
               │           │   │
               │           │   └─→ LeadCaptureModal shows
               │           │       │
               │           │       ├─→ User fills form
               │           │       │   │
               │           │       │   ├─→ Submit → Success screen
               │           │       │   │
               │           │       │   └─→ Auto-close after 3s
               │           │       │
               │           │       └─→ User clicks "Skip"
               │           │           └─→ Modal closes
               │           │
               │           └─→ User clicks X to close
               │               │
               │               └─→ onClose() → showLiveDemo = false
               │
               └─→ Back to HomePage
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER ACTIONS                            │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─→ Click "Start the Live Demo"
             │   │
             │   └─→ HomePage.tsx
             │       └─→ onStartLiveDemo()
             │           └─→ App.tsx
             │               └─→ setShowLiveDemo(true)
             │
             ├─→ Click "Start Demo" in Launcher
             │   │
             │   └─→ DemoLauncher.tsx
             │       └─→ onStartDemo()
             │           └─→ DemoOrchestrator.tsx
             │               └─→ setDemoFlow('console')
             │
             ├─→ Approve Action
             │   │
             │   └─→ LiveDemoConsole.tsx
             │       │
             │       ├─→ handleApprove()
             │       │   │
             │       │   ├─→ Update local state
             │       │   │   - Remove from pendingActions
             │       │   │   - Add to jobs (if applicable)
             │       │   │
             │       │   ├─→ Show toast notification
             │       │   │
             │       │   └─→ Trigger conversion check
             │       │       └─→ onConversion()
             │       │           └─→ DemoOrchestrator.tsx
             │       │               └─→ setShowLeadCapture(true)
             │       │
             │       └─→ Analytics Event
             │           └─→ gtag('event', 'demo_action_approved')
             │
             └─→ Submit Lead Form
                 │
                 └─→ LeadCaptureModal.tsx
                     │
                     ├─→ handleSubmit()
                     │   │
                     │   ├─→ POST to backend
                     │   │   └─→ /functions/v1/make-server/partner-leads
                     │   │       └─→ Save to database
                     │   │
                     │   ├─→ Analytics Event
                     │   │   └─→ gtag('event', 'lead_captured')
                     │   │
                     │   └─→ Show success screen
                     │       └─→ Auto-close after 3s
                     │
                     └─→ onSubmit()
                         └─→ DemoOrchestrator.tsx
                             └─→ setLeadSubmitted(true)
```

---

## 🎨 Component Dependency Graph

```
App.tsx
  │
  ├─→ DemoOrchestrator
  │     │
  │     ├─→ DemoLauncher
  │     │     │
  │     │     └─→ Uses:
  │     │           - Button (shadcn)
  │     │           - Play icon (lucide-react)
  │     │
  │     ├─→ LiveDemoConsole
  │     │     │
  │     │     ├─→ ReasoningTraceCard
  │     │     │     └─→ ConfidenceOrb
  │     │     │
  │     │     ├─→ ActionItem
  │     │     │
  │     │     ├─→ KillSwitchBanner
  │     │     │
  │     │     └─→ JobStatusBadge (inline)
  │     │
  │     └─→ LeadCaptureModal
  │           └─→ Uses:
  │                 - Input (shadcn)
  │                 - Button (shadcn)
  │
  └─→ HomePage
        │
        ├─→ DemoHeroSection
        │     └─→ Uses:
        │           - Button (shadcn)
        │           - Play icon
        │
        ├─→ ValuePropositionSection
        │     └─→ Uses:
        │           - Card (shadcn)
        │           - Icons (lucide-react)
        │
        └─→ HowItWorksSection
              └─→ Uses:
                    - Badge (shadcn)
                    - Animated step cards
```

---

## 🔗 API & Backend Integration

```
Frontend                    Backend                    Database
────────                    ───────                    ────────

LeadCaptureModal
    │
    └─→ Submit Form
        │
        └─→ POST /functions/v1/make-server/partner-leads
            │
            ├─→ Headers:
            │   - Authorization: Bearer ${publicAnonKey}
            │   - Content-Type: application/json
            │
            ├─→ Body:
            │   {
            │     name: "John Doe",
            │     email: "john@company.com",
            │     company: "Acme Corp",
            │     source: "demo_conversion",
            │     notes: "Captured from live demo..."
            │   }
            │
            └─→ Server Endpoint
                │
                ├─→ Validate data
                │
                ├─→ Save to database
                │   └─→ INSERT INTO partner_leads
                │       (name, email, company, source, notes)
                │
                └─→ Return Success
                    └─→ { success: true }
                        │
                        └─→ Frontend shows success screen
```

---

## 📈 Analytics Event Flow

```
User Journey              Analytics Event              Properties
────────────              ───────────                 ──────────

HomePage loads            (pageview)                   page_title: "Home"
    │
    ├─→ Click CTA         live_demo_started            source: "home"
    │                                                   user_tier: "anonymous"
    ↓
DemoLauncher opens        demo_started                 demo_type: "live_analyst_console"
    │                                                   source: "demo_launcher"
    ↓
LiveConsole loads         (automatic)                  -
    │
    ├─→ Approve action    demo_action_approved         action_type: "update_ticket"
    │                                                   confidence: 0.87
    ↓
LeadModal opens           (automatic)                  -
    │
    ├─→ Submit form       lead_captured                lead_source: "demo_conversion"
    │                                                   company: "Acme Corp"
    ↓
Demo closes               demo_closed                  lead_captured: true
    │
    └─→ Back to HomePage  (pageview)                   page_title: "Home"
```

---

## 🎯 User Experience Flow Map

```
┌─────────────────────────────────────────────────────────┐
│  ENTRY POINT: Homepage                                  │
│                                                         │
│  User sees:                                             │
│    • DeviceNetworkOrb animation                         │
│    • "Operate More Clients With Fewer Technicians"     │
│    • Neon green CTA: "Start the Live Demo"            │
│                                                         │
│  ↓ Click CTA                                           │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  INTERSTITIAL: Demo Launcher                            │
│                                                         │
│  User learns:                                           │
│    ✓ Sandboxed environment                             │
│    ✓ No credit card required                           │
│    ✓ 30-60 min session                                 │
│    ✓ Synthetic data only                               │
│                                                         │
│  User sees production recommendations:                  │
│    • HTTPS + IP allowlists                             │
│    • Managed Redis                                      │
│    • Log request IDs                                    │
│    • Resource limits                                    │
│    • Secret rotation                                    │
│                                                         │
│  ↓ Click "Start Demo"                                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  MAIN EXPERIENCE: Live Demo Console                     │
│                                                         │
│  Tab 1: Console (default)                              │
│    Left: Reasoning Traces                              │
│      • AI analysis with confidence scores              │
│      • JSON preview                                     │
│      • "See lineage" links                             │
│                                                         │
│    Right: Pending Actions                              │
│      • update_ticket (Approve/Reject)                  │
│      • restart service (Approve/Reject)                │
│                                                         │
│    Footer:                                              │
│      • "Re-run reasoning now" button                   │
│                                                         │
│  Tab 2: Policies                                       │
│    • Kill Switch toggle                                │
│    • Confidence threshold slider                       │
│    • Action safelist                                   │
│                                                         │
│  Tab 3: Device Jobs                                    │
│    • Job history table                                 │
│    • Status badges (queued → running → succeeded)     │
│                                                         │
│  ↓ User approves "update_ticket" action               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  CONVERSION: Lead Capture Modal                         │
│                                                         │
│  "Want this on your devices?"                          │
│  "We'll wire a pilot in 24 hours"                      │
│                                                         │
│  Form:                                                  │
│    □ Your Name                                         │
│    □ Work Email                                        │
│    □ Company                                           │
│                                                         │
│  [Get Your Pilot Started]    [Skip for now]           │
│                                                         │
│  ↓ User submits form                                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  SUCCESS: Confirmation Screen                           │
│                                                         │
│  ✓ "Thanks—check your inbox!"                         │
│                                                         │
│  "We'll reach out within 24 hours to get your         │
│   pilot environment configured."                       │
│                                                         │
│  ↓ Auto-close after 3 seconds                         │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RETURN: Back to Console                                │
│                                                         │
│  User can continue exploring:                           │
│    • Try kill switch                                   │
│    • View device jobs                                  │
│    • Approve more actions                              │
│    • Re-run reasoning                                  │
│                                                         │
│  ↓ Click X to close                                    │
└─────────────────────────────────────────────────────────┘
                    ↓
              [Back to HomePage]
```

---

## ✅ Integration Checklist Visual

```
┌─────────────────────────────────────────────────────┐
│  PRE-INTEGRATION                                    │
├─────────────────────────────────────────────────────┤
│  [✓] Demo files created (10 files)                 │
│  [✓] Design tokens aligned                          │
│  [✓] Components tested individually                 │
│  [✓] Documentation written                          │
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  INTEGRATION POINTS                                 │
├─────────────────────────────────────────────────────┤
│  [✓] App.tsx updated (3 changes)                   │
│  [✓] HomePage.tsx updated (2 changes)              │
│  [✓] No breaking changes                           │
│  [✓] Backwards compatible                          │
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  POST-INTEGRATION                                   │
├─────────────────────────────────────────────────────┤
│  [✓] Build succeeds                                │
│  [✓] TypeScript errors: 0                          │
│  [✓] Console errors: 0                             │
│  [✓] Demo flow works end-to-end                    │
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│  READY FOR PRODUCTION                               │
└─────────────────────────────────────────────────────┘
```

---

**Visual Integration Map Complete** ✅

This map provides a comprehensive visual guide to understanding how the Live Demo System integrates with the existing BuboIQ application architecture.
