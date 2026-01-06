# 🔍 Live Demo Integration Verification

## Quick Verification Steps

### 1. File Structure Check ✅

Run this to verify all demo files exist:
```bash
ls -la components/demo/
```

**Expected output:**
```
DemoOrchestrator.tsx
DemoLauncher.tsx
LiveDemoConsole.tsx
LeadCaptureModal.tsx
DemoHeroSection.tsx
HowItWorksSection.tsx
ValuePropositionSection.tsx
DemoTokensExport.tsx
index.ts
DEMO_HANDOFF.md
```

---

### 2. Import Check ✅

Verify App.tsx imports the demo system:
```bash
grep "from './components/demo'" App.tsx
```

**Expected output:**
```typescript
import { DemoOrchestrator } from './components/demo';
```

---

### 3. HomePage Integration Check ✅

Verify HomePage has the new prop:
```bash
grep "onStartLiveDemo" components/marketing/HomePage.tsx | head -5
```

**Expected output:**
```typescript
onStartLiveDemo?: () => void;
onStartLiveDemo
{onStartLiveDemo && (
```

---

### 4. Component Dependencies Check ✅

Verify analyst components exist:
```bash
ls -la components/analyst/production/
```

**Expected output:**
```
ConfidenceOrb.tsx
ActionItem.tsx
ReasoningTraceCard.tsx
KillSwitchBanner.tsx
index.ts
```

---

### 5. Design Tokens Check ✅

Verify CSS variables are defined:
```bash
grep "bg-900" styles/globals.css
grep "accent-analyst" styles/globals.css
```

**Expected output:**
```css
--bg-900: 10 11 13;
--accent-analyst: 0 255 133;
```

---

### 6. Tailwind Config Check ✅

Verify Tailwind utilities:
```bash
grep "bg-900" tailwind.config.ts
```

**Expected output:**
```typescript
900: 'rgb(var(--bg-900) / <alpha-value>)',
```

---

## Browser Testing Checklist

### Desktop (1440px)
- [ ] Open http://localhost:5173
- [ ] See "Start the Live Demo" button (neon green, primary position)
- [ ] Click button
- [ ] Demo Launcher modal appears
- [ ] Click "Start Demo"
- [ ] Loading spinner (1.5s)
- [ ] Console loads with traces on left, actions on right
- [ ] Click "Approve" on update_ticket action
- [ ] Toast "Ticket updated." appears
- [ ] Lead Capture Modal appears after 1.5s
- [ ] Fill form and submit
- [ ] Success screen appears
- [ ] Modal auto-closes after 3s
- [ ] Back to console
- [ ] Click X to close
- [ ] Back to HomePage

### Tablet (1024px)
- [ ] Same flow as desktop
- [ ] Verify responsive layout (single column)

### Mobile (768px)
- [ ] Same flow as desktop
- [ ] Verify touch targets ≥44×44px
- [ ] Verify full-width CTAs

---

## Analytics Verification

Open browser console and watch for:

```javascript
// When clicking "Start the Live Demo"
gtag('event', 'live_demo_started', {
  source: 'home',
  user_tier: 'anonymous'
});

// When clicking "Start Demo" in launcher
gtag('event', 'demo_started', {
  demo_type: 'live_analyst_console',
  source: 'demo_launcher'
});

// When submitting lead form
gtag('event', 'lead_captured', {
  lead_source: 'demo_conversion',
  company: 'Test Company'
});

// When closing demo
gtag('event', 'demo_closed', {
  lead_captured: true
});
```

---

## Error Scenarios

### Test 1: Skip Lead Capture
- [ ] Approve action
- [ ] Lead modal appears
- [ ] Click "Skip for now"
- [ ] Modal closes, console remains open
- [ ] Approve another action
- [ ] Lead modal does NOT appear again

### Test 2: Close Without Conversion
- [ ] Open demo
- [ ] Do NOT approve any actions
- [ ] Click X to close
- [ ] gtag 'demo_closed' with lead_captured: false

### Test 3: Navigation After Demo
- [ ] Close demo
- [ ] Click "See MSP Plans"
- [ ] Navigate to pricing page
- [ ] Verify no errors

---

## Performance Checks

### Lighthouse Audit
```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse
# Run audit on homepage
```

**Target Scores:**
- Performance: >90
- Accessibility: 100
- Best Practices: >95
- SEO: 100

### Bundle Size Check
```bash
npm run build
```

Look for:
```
dist/assets/index-[hash].js  X.XX kB
```

Demo system should add <50kB to bundle (lazy loaded).

---

## Accessibility Audit

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus rings visible (2px accent color)
- [ ] Enter activates buttons
- [ ] Esc closes modals
- [ ] Tab trapped in modal

### Screen Reader Test (macOS)
```bash
# Enable VoiceOver: Cmd+F5
# Navigate through demo flow
# Verify all elements announced correctly
```

### Color Contrast
- [ ] Use Chrome DevTools Accessibility panel
- [ ] Verify all text meets WCAG AA (4.5:1)
- [ ] Verify interactive elements have clear focus

---

## Backwards Compatibility

### Existing Flow Unchanged
- [ ] Navigate to pricing directly
- [ ] Navigate to features
- [ ] Click "Try Interactive Demo" (old PlatformDemo)
- [ ] All existing functionality works

### User Dashboard
- [ ] Login with test account
- [ ] Verify app loads normally
- [ ] No demo-related components in authenticated area
- [ ] Verify no console errors

---

## Integration Points

### 1. App.tsx State Management
```typescript
const [showLiveDemo, setShowLiveDemo] = useState(false);
```
✅ Should be initialized to false

### 2. HomePage Prop Passing
```typescript
<HomePage 
  onNavigate={navigateToPage} 
  onTryItNow={showInteractiveShowcase}
  onStartLiveDemo={showLiveDemoExperience}
/>
```
✅ All three props should be present

### 3. Demo Orchestrator Rendering
```typescript
{showLiveDemo && (
  <DemoOrchestrator onClose={closeLiveDemo} />
)}
```
✅ Should be after PlatformDemo, before UpgradeModal

### 4. HomePage Sections
```typescript
{onStartLiveDemo && <ValuePropositionSection />}
{onStartLiveDemo && <HowItWorksSection />}
```
✅ Should be before final CTA rail

---

## Production Deployment Readiness

### Pre-Deploy Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Analytics tracking verified
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Environment Variables
Verify these are set in production:
```
VITE_SUPABASE_URL=your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Deployment Command
```bash
# If using Vercel
vercel --prod

# If using custom deployment
npm run build
# Upload dist/ to your hosting
```

---

## Rollback Plan

If issues arise, quick rollback:

### Option 1: Feature Flag Disable
In App.tsx line ~151:
```typescript
// Change this:
onStartLiveDemo={showLiveDemoExperience}

// To this:
onStartLiveDemo={undefined}
```

Redeploy. HomePage will revert to original CTAs.

### Option 2: Full Rollback
```bash
git revert <commit-hash>
git push origin main
```

---

## Success Criteria

### ✅ Integration is successful when:
1. Demo launches without errors
2. All states (loading, empty, error) work
3. Lead capture triggers correctly
4. Analytics events fire
5. No regression in existing features
6. Performance remains acceptable
7. Accessibility maintained
8. Mobile experience smooth

### 🎯 Launch is ready when:
1. All verification steps pass
2. Staging environment tested
3. Team approval obtained
4. Monitoring dashboards ready
5. Support team briefed
6. Rollback plan confirmed

---

**Current Status**: ✅ READY FOR VERIFICATION

Run through this checklist before deploying to production!
