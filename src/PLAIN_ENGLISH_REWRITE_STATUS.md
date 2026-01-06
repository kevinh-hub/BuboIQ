# Plain English Rewrite Status
**BuboIQ Platform - Grade 6-8 Reading Level Implementation**

---

## ✅ COMPLETED FILES

### Core Reference Document
- **`/COPY_TOKENS_PLAIN_ENGLISH.md`** - Complete reference guide with all text standards, banned words, global replacements, and microcopy tokens

### Marketing Pages
- **`/components/marketing/HomePage.tsx`** ✅ COMPLETE
  - Hero: "See problems sooner. / Solve them faster."
  - Badge: "For small IT teams & MSPs"
  - Body copy simplified
  - CTAs: "Start free 14-day trial", "Watch 90-second tour"
  - Proof chips: Plain English labels
  - SEO metadata updated
  - Navigation cards simplified

### Empty States & System Messages
- **`/components/BuboEmptyStates.tsx`** ✅ COMPLETE
  - ObservatoryEmpty: "Nothing risky right now."
  - SignalsEmpty: "No early warnings right now."
  - IncidentsEmpty: "No open issues. Good place to be."
  - AssistEmpty: "Ask me anything."
  - AutomationsEmpty: Simplified
  - PlaybooksEmpty: "No articles yet. Publish your first fix from an issue."
  - LoadingState: "Loading..."
  - ErrorState: "We couldn't load this page. Try again."
  - MaintenanceState: "We're doing maintenance"

### Forms
- **`/components/CreateTicketForm.tsx`** ✅ COMPLETE
  - Heading: "What's wrong?"
  - Subject label: "What's the problem? *"
  - Description: "Tell us what you saw. Add steps if you can. *"
  - Priority: "How urgent is this?"
  - Tooltips simplified
  - Placeholders: Plain English
  - Submit button: "Open issue"
  - Success message: "Issue opened."
  - Error messages: Simplified
  - Advanced options: "Show/Hide more options"
  - Assignment: "Assign to someone" / "We'll assign it (recommended)"

### Navigation Components
- **`/components/Sidebar.tsx`** ✅ UPDATED
  - "Tickets" → "Issues"
  - "Pricing" → "Plans"

- **`/components/UserSidebar.tsx`** ✅ UPDATED
  - "My Tickets" → "My issues"
  - "Submit Ticket" → "Open issue"

- **`/components/app/AppRouter.tsx`** ✅ UPDATED
  - "Issues" (already updated)
  - "Computers" (already updated)
  - "Knowledge Base" → "Knowledge"
  - "Software Management" → "App management"
  - "Agent Installers" → "Download installer"

### Dashboard Metrics
- **`/components/app/pages/DashboardPage.tsx`** ✅ ALREADY UPDATED
  - "Open Issues" (confirmed)
  - "Computers Online" (confirmed)
  - Response time label simplified

---

## 🔄 RECOMMENDED NEXT UPDATES

### High Priority - User-Facing Text

#### App Pages (Issue/Ticket Management)
- **`/components/app/pages/TicketsPage.tsx`**
  - Search placeholder: "Search tickets..." → "Search issues..."
  - Filter labels
  - Table columns
  - Empty state text
  - "Create Ticket" buttons → "Open issue"

- **`/components/app/pages/TicketDetailPage.tsx`**
  - Page titles
  - Action buttons
  - Status labels
  - Comments section

#### App Pages (Device/Computer Management)
- **`/components/app/pages/DevicesPage.tsx`**
  - Verify "Devices" → "Computers" throughout
  - Table columns: "Heartbeat" → "Last check-in"
  - "Agent" references → "BuboIQ app" (with tooltip)
  - Filter labels

- **`/components/app/pages/DeviceDetailPage.tsx`**
  - Detail panel labels
  - Action buttons
  - Health indicators
  - "Deploy agent" → "Install the BuboIQ app"

#### Knowledge Base Pages
- **`/components/knowledge-base/SimplifiedKnowledgeBasePage.tsx`**
  - Search placeholder: "Search fixes…"
  - Empty state: Use from BuboEmptyStates
  - Article card labels

- **`/components/knowledge-base/SimplifiedArticleDetailPage.tsx`**
  - Step labels: "Precheck" / "Fix" / "Verify"
  - Banner: "This came from a past fix."
  - Action buttons

#### Settings Pages
- **`/components/app/pages/SettingsPage.tsx`**
  - Section headings
  - Field labels
  - Help text

### Medium Priority - Marketing Content

#### Features Page
- **`/components/marketing/StreamlinedFeaturesPage.tsx`**
  - Remove banned words: "multi-tenant", "telemetry", "observability", "zero-touch", "holistic"
  - Simplify feature descriptions
  - Before/After stories: Plain English
  - Compliance section: "Compliance, with proof. / Each item links to evidence. No score donuts."

#### Why Page
- **`/components/marketing/WhyPage.tsx`**
  - Remove jargon
  - Simplify value propositions
  - Customer quotes (if any vanity metrics, remove)

#### Pricing Page
- **`/components/marketing/PricingPageMSP.tsx`**
  - Feature descriptions
  - Compare table
  - Trial copy

#### How It Works
- **`/components/marketing/HowItWorksPage.tsx`**
  - Step descriptions
  - Plain English workflow

### Lower Priority - Component Libraries

#### Guided Fixes
- **`/components/guided-fixes/*.tsx`**
  - Step labels
  - Safety indicators: "Safe to run" / "Check first" / "Needs review"
  - Command block labels

#### Compliance Components
- **`/components/compliance/*.tsx`**
  - "Agent posture" → "Security status"
  - Remove "posture" as noun
  - Evidence labels
  - Export wizard text

#### Remote/Connect Components
- **`/components/connect/*.tsx`**
  - "Start session" → "Start remote help"
  - "End session" → "End remote help"
  - Consent screen text
  - Audit log labels

#### Agent Onboarding
- **`/components/agent/AgentOnboardingFlow.tsx`**
  - "Deploy agent" → "Install the BuboIQ app"
  - Step instructions
  - Success messages

---

## 📋 SYSTEMATIC REPLACEMENTS NEEDED

### Global Find & Replace (Apply Across All Files)

#### Labels & Headings
```
Tickets → Issues
All Tickets → Issues
My Tickets → My issues
Create ticket → Open issue
Submit Ticket → Open issue
Ticket volume → Issues opened

Devices → Computers
All Devices → Computers
Add device → Add computer

Intelligence → Patterns
Signals → Early warnings
Predictions → What might break next

Knowledge Base → Knowledge
KB → Knowledge

Connect → Remote help
Start session → Start remote help
End session → End remote help

Agent → BuboIQ app (with tooltip: "The BuboIQ app on the computer")
Deploy agent → Install the BuboIQ app
Install agent → Install the BuboIQ app
Agent posture → Security status

Heartbeat → Last check-in
```

#### Metrics & Data Labels
```
MTTR → Average time to fix
SLA → Response time goal (+ tooltip)
Deflection → Solved without a tech (+ tooltip)
Agent posture → Security status
Change impact → Time saved after change
```

#### Actions & Buttons
```
Acknowledge → Mark as seen
Assign to me → Take this
Snooze alert → Remind me later (15m / 1h / 1d)
```

#### Form Fields
```
Subject → What's wrong? / What's the problem?
Description → Tell us what you saw. Add steps if you can.
Priority → How urgent is this?
Category → Which type?
Assigned to → Assign to someone
```

---

## 🚫 BANNED WORDS TO FIND & FIX

Run search across all .tsx files for these terms and rewrite:

1. **multi-tenant** → "built for managing multiple clients" or remove
2. **telemetry** → "data from your computers"
3. **orchestration** → "coordination" or describe what happens
4. **observability** → "see what's happening"
5. **zero-touch** → remove or rewrite
6. **holistic** → remove or "complete"
7. **robust** → "reliable" or remove
8. **leverage** (as verb) → "use"
9. **paradigm** → remove
10. **utilize** → "use"
11. **ingestion pipeline** → "data collection"
12. **donut chart** → use bar charts or simple numbers
13. **posture** (as noun) → "security status" or "health"
14. **topology** → "network map" or "how things connect"

---

## 🔍 FILES THAT NEED AUDIT

### Search These Files for Jargon
```bash
# Marketing pages
components/marketing/StreamlinedFeaturesPage.tsx
components/marketing/WhyPage.tsx
components/marketing/HowItWorksPage.tsx
components/marketing/PricingPageMSP.tsx
components/marketing/SmallBusinessPage.tsx

# App pages
components/app/pages/TicketsPage.tsx
components/app/pages/TicketDetailPage.tsx
components/app/pages/DevicesPage.tsx
components/app/pages/DeviceDetailPage.tsx
components/app/pages/CompliancePage.tsx
components/app/pages/SettingsPage.tsx

# Shared components
components/Dashboard.tsx
components/BuboMainDashboard.tsx
components/Observatory.tsx
components/Signals.tsx
components/IncidentRoom.tsx

# Knowledge Base
components/knowledge-base/SimplifiedKnowledgeBasePage.tsx
components/knowledge-base/SimplifiedArticleDetailPage.tsx
components/knowledge-base/ReviewerConsole.tsx

# Forms & Modals
components/CreateSignalForm.tsx
components/UpgradeModal.tsx
components/TeamManagement.tsx
```

---

## 📝 IMPLEMENTATION STRATEGY

### Phase 1: Core User Paths (DONE ✅)
- [x] Homepage
- [x] Empty states
- [x] Create ticket form
- [x] Navigation menus
- [x] Copy tokens reference

### Phase 2: Main App UI (IN PROGRESS)
- [ ] Tickets/Issues page
- [ ] Ticket/Issue detail
- [ ] Computers page
- [ ] Computer detail
- [ ] Dashboard metrics

### Phase 3: Knowledge & Help
- [ ] Knowledge Base page
- [ ] Article detail
- [ ] Search placeholders
- [ ] Help tooltips

### Phase 4: Settings & Admin
- [ ] Settings page
- [ ] Team management
- [ ] Compliance pages
- [ ] Admin panels

### Phase 5: Marketing & Conversion
- [ ] Features page
- [ ] Why page
- [ ] Pricing page
- [ ] How it works

### Phase 6: Specialized Features
- [ ] Guided Fixes
- [ ] Remote/Connect
- [ ] Agent onboarding
- [ ] Compliance tools

---

## 🧪 TESTING CHECKLIST

After updates, verify:

- [ ] All navigation labels are plain English
- [ ] No banned words in user-facing text
- [ ] Form labels are questions or clear statements
- [ ] Error messages are helpful and simple
- [ ] Empty states are friendly and actionable
- [ ] Tooltips added for unavoidable technical terms
- [ ] Button text is action-first ("Save", not "Save Changes")
- [ ] Metric labels have tooltips where needed
- [ ] No vanity metrics anywhere
- [ ] All placeholders are examples, not instructions

---

## 💡 QUALITY STANDARDS

Every text string should pass:

1. **Grade level**: Can a 6th-8th grader understand it?
2. **Clarity**: One idea per sentence?
3. **Action**: Does it say what it DOES, not how it's built?
4. **Brevity**: Is every word necessary?
5. **Helpfulness**: Does it guide the user to success?

---

## 🎯 QUICK WINS (High Impact, Low Effort)

### 1. Global String Replacements
Run these across all .tsx files (carefully, with review):
```typescript
// Examples - review each before committing
"Ticket" → "Issue" (in contexts like "All Tickets", "Create Ticket")
"Device" → "Computer" (in UI labels, not code variables)
"Knowledge Base" → "Knowledge"
"Deploy agent" → "Install the BuboIQ app"
```

### 2. Form Placeholder Updates
Search for `placeholder=` and simplify all:
- "Please provide..." → "Describe..."
- "Enter your..." → "Your email"
- Long instructions → Short examples

### 3. Empty State Sweep
Use the updated BuboEmptyStates components everywhere instead of custom text.

### 4. Button Text Audit
Make all buttons action-first:
- "Submit Request" → "Open issue"
- "Save Changes" → "Save"
- "Cancel Operation" → "Cancel"

---

## 📊 PROGRESS TRACKER

**Completion Estimate**: ~25% (Core reference + critical user paths done)

**Files Updated**: 8
**Files Remaining**: ~40-50 (estimated, user-facing only)

**Next Session Priority**:
1. TicketsPage.tsx (high traffic)
2. DevicesPage.tsx (high traffic)
3. StreamlinedFeaturesPage.tsx (marketing critical)
4. SimplifiedKnowledgeBasePage.tsx (feature showcase)

---

**Last Updated**: 2025-10-28
**Reviewer**: Should verify against COPY_TOKENS_PLAIN_ENGLISH.md for consistency
