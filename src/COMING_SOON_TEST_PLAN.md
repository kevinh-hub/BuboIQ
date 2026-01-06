# Coming Soon Mode - Test Plan

## Pre-Deployment Testing (Local)

### 1. Feature Flag State Test (2 minutes)

**Objective**: Verify feature flag controls billing state

```bash
# Terminal 1: Check current state
cat utils/feature-flags.ts | grep BILLING_ENABLED

# Terminal 2: Start dev server
npm run dev
```

**Test Cases**:
- [ ] Feature flag shows `BILLING_ENABLED: false`
- [ ] Dev server starts without errors
- [ ] No console errors in browser

---

### 2. Homepage Coming Soon Test (3 minutes)

**URL**: `http://localhost:3000`

**Test Flow**:
1. Load homepage
2. Scroll to "Start free 14-day trial" button
3. Click button
4. **Expected**: Coming Soon modal appears
5. Click "Join Waitlist"
6. **Expected**: Email client opens with pre-filled message
7. Close modal by clicking X
8. **Expected**: Modal closes
9. Click "Compare plans" button (bottom of page)
10. **Expected**: Coming Soon modal appears again

**Checklist**:
- [ ] Modal appears smoothly (no flash)
- [ ] Modal design matches BuboIQ dark theme
- [ ] Green neon accent colors visible
- [ ] Benefits list shows 3 items with checkmarks
- [ ] "Join Waitlist" button has hover effect
- [ ] "Maybe Later" button works
- [ ] X button closes modal
- [ ] Modal backdrop dims background

---

### 3. Pricing Page Coming Soon Test (3 minutes)

**URL**: `http://localhost:3000` → Navigate to Pricing

**Test Flow**:
1. Click "Pricing" in navigation
2. **Expected**: Pricing page loads normally
3. All 3 tiers are visible (Starter, Pro, Team)
4. Add-ons are visible and toggleable
5. Total price updates when add-ons selected
6. Click "Start Free Trial" button
7. **Expected**: Coming Soon modal appears (not redirect to Stripe)

**Checklist**:
- [ ] Pricing page loads without errors
- [ ] All plan cards render correctly
- [ ] Add-on checkboxes work
- [ ] Price calculation updates
- [ ] "Start Free Trial" shows Coming Soon modal
- [ ] Modal shows same design as homepage test

---

### 4. In-App Upgrade Flow Test (5 minutes)

**Prerequisites**: Create test account or use existing

**Test Flow**:
1. Log in to BuboIQ app
2. Navigate to a Pro/Team feature (e.g., Analytics)
3. If you're on Starter tier, you should hit a tier guard
4. Click "Upgrade" button
5. **Expected**: Coming Soon modal appears
6. **Should NOT**: Show upgrade modal or redirect to Stripe

**Alternative Test** (if tier guards don't trigger):
1. Go to Settings → Billing
2. Try to change plan or add an add-on
3. **Expected**: Coming Soon modal appears

**Checklist**:
- [ ] Tier restrictions still work
- [ ] Upgrade button triggers Coming Soon modal
- [ ] No Stripe redirect occurs
- [ ] Modal is consistent with other tests

---

### 5. Billing Settings Test (3 minutes)

**URL**: `http://localhost:3000` → Login → Settings → Billing

**Test Flow**:
1. Navigate to Settings page
2. Click "Billing" tab
3. Current plan is displayed
4. Try to upgrade plan
5. **Expected**: Coming Soon modal appears
6. Try to add an add-on
7. **Expected**: Coming Soon modal appears
8. Try to "Manage Subscription" (if button exists)
9. **Expected**: Coming Soon modal appears

**Checklist**:
- [ ] Billing settings page renders
- [ ] Current plan shows correctly
- [ ] All upgrade buttons trigger Coming Soon modal
- [ ] Add-on toggles trigger Coming Soon modal
- [ ] Portal button triggers Coming Soon modal
- [ ] No Stripe API calls made (check Network tab)

---

### 6. Billing Enabled Test (5 minutes)

**Objective**: Verify billing works when enabled

```bash
# 1. Edit feature flag
# Change: BILLING_ENABLED: true

# 2. Refresh browser (may need to restart dev server)
```

**Test Flow**:
1. Go to homepage
2. Click "Start free 14-day trial"
3. **Expected**: Navigate to pricing page (NOT Coming Soon modal)
4. Select a plan
5. Click "Start Free Trial"
6. **Expected**: Begin redirect to Stripe checkout (may fail if Stripe not configured locally)

**Checklist**:
- [ ] Coming Soon modal does NOT appear
- [ ] Navigation to pricing works
- [ ] Checkout flow begins
- [ ] No console errors

```bash
# 3. Change back for deployment
# Change: BILLING_ENABLED: false
```

---

### 7. Configuration Test (2 minutes)

**Objective**: Verify Coming Soon config can be customized

**Edit**: `utils/feature-flags.ts`

```typescript
export const COMING_SOON_CONFIG = {
  title: "Test Title",
  message: "Test message for configuration.",
  ctaText: "Test CTA",
  ctaAction: "https://google.com",
  showDebugInfo: true,  // Enable debug
} as const;
```

**Test Flow**:
1. Refresh browser
2. Trigger Coming Soon modal
3. **Expected**: See custom title, message, and CTA text
4. Click CTA button
5. **Expected**: Opens google.com in new tab
6. **Expected**: See debug info banner at bottom

**Checklist**:
- [ ] Custom title appears
- [ ] Custom message appears
- [ ] Custom CTA text appears
- [ ] URL opens correctly
- [ ] Debug banner shows when enabled

```bash
# Reset to original config after testing
```

---

### 8. Mobile Responsiveness Test (2 minutes)

**Objective**: Verify modal works on mobile

**Test Flow**:
1. Open DevTools
2. Toggle device emulation (iPhone/Android)
3. Navigate to homepage
4. Trigger Coming Soon modal
5. **Expected**: Modal fits mobile screen
6. Buttons are tappable
7. Modal is readable

**Checklist**:
- [ ] Modal fits mobile viewport
- [ ] Text is readable (not too small)
- [ ] Buttons are easily tappable
- [ ] Benefits list doesn't overflow
- [ ] X button is accessible
- [ ] No horizontal scroll

---

### 9. Verification Script Test (1 minute)

**Objective**: Verify automated checks work

```bash
chmod +x verify-coming-soon.sh
./verify-coming-soon.sh
```

**Expected Output**:
```
✓ Billing is DISABLED (Coming Soon mode active)
✓ All required files exist
✓ All components use isBillingEnabled()
✓ All components render ComingSoonModal
✓ Coming Soon config present
✓ All checks passed!
```

**Checklist**:
- [ ] Script runs without errors
- [ ] All checks show green ✓
- [ ] Summary shows "All checks passed"
- [ ] Next steps are displayed

---

## Post-Deployment Testing (Production)

### 10. Production Smoke Test (5 minutes)

**URL**: Your production domain (e.g., `https://buboiq.com`)

**Critical Path Test**:
1. [ ] Homepage loads
2. [ ] Click "Start free 14-day trial" → Coming Soon modal
3. [ ] Navigate to Pricing → Page loads
4. [ ] Click checkout → Coming Soon modal
5. [ ] Log in → Dashboard loads
6. [ ] Settings → Billing → Upgrade → Coming Soon modal

**Network Tab Verification**:
- [ ] No failed Stripe API calls
- [ ] No 404 errors on modal files
- [ ] No console errors

---

### 11. Analytics Verification (5 minutes)

**Objective**: Verify tracking still works

**Test Flow**:
1. Open Google Analytics (if configured)
2. Navigate through BuboIQ
3. Trigger Coming Soon modal multiple times
4. Check Analytics Real-Time view

**Expected Events**:
- [ ] Page views tracked
- [ ] Button clicks tracked
- [ ] Custom events fire (if configured)
- [ ] Coming Soon modal views can be tracked

---

### 12. SEO Verification (3 minutes)

**Objective**: Verify search engines can still crawl

```bash
# Test robots.txt
curl https://your-domain.com/robots.txt

# Test sitemap
curl https://your-domain.com/sitemap.xml

# Test homepage
curl https://your-domain.com/ | grep -i "buboiq"
```

**Checklist**:
- [ ] Robots.txt accessible
- [ ] Sitemap accessible
- [ ] Homepage meta tags present
- [ ] Content is crawlable

---

### 13. Multi-Browser Test (5 minutes)

**Objective**: Verify cross-browser compatibility

**Browsers to Test**:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

**Test in Each**:
1. Load homepage
2. Trigger Coming Soon modal
3. Verify design renders correctly
4. Test CTA button

---

### 14. Load Test (Optional, 3 minutes)

**Objective**: Verify modal doesn't break under load

**Simple Test**:
1. Open 5-10 browser tabs
2. In each tab, repeatedly trigger Coming Soon modal
3. Check for:
   - [ ] Memory leaks (DevTools Memory tab)
   - [ ] Performance issues
   - [ ] Modal state conflicts

---

## Rollback Test (Production)

### 15. Emergency Rollback Test (2 minutes)

**Scenario**: Need to disable billing immediately after enabling

**Test Flow**:
1. Enable billing: `BILLING_ENABLED: true`
2. Deploy to production
3. Verify checkout works
4. Rollback: `BILLING_ENABLED: false`
5. Deploy to production
6. **Expected**: Coming Soon modal appears again
7. **Expected**: No Stripe checkouts work

**Checklist**:
- [ ] Rollback completes in < 1 minute
- [ ] Coming Soon modal immediately active
- [ ] No errors during rollback
- [ ] Users see Coming Soon, not errors

---

## Performance Benchmarks

### Modal Load Time
- [ ] Modal appears in < 100ms after click
- [ ] No layout shift when modal opens
- [ ] Smooth animation (60fps)

### Bundle Size Impact
- [ ] Coming Soon modal < 5KB
- [ ] Feature flags < 1KB
- [ ] No significant bundle increase

### Runtime Performance
- [ ] No memory leaks after 10+ modal opens
- [ ] Feature flag check < 1ms
- [ ] Modal render < 50ms

---

## Accessibility Test (WCAG)

### Keyboard Navigation
- [ ] Tab through modal elements
- [ ] Enter key triggers CTA button
- [ ] Escape key closes modal
- [ ] Focus trap works correctly

### Screen Reader
- [ ] Modal announced when opened
- [ ] Benefits list readable
- [ ] Buttons have proper labels
- [ ] Close button accessible

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Buttons meet WCAG AA
- [ ] Focus indicators visible

---

## Test Results Template

```markdown
## Coming Soon Mode Test Results

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Environment**: Local / Production

### Results Summary
- Total Tests: 15
- Passed: __
- Failed: __
- Skipped: __

### Failed Tests (if any)
1. Test #__ - Description
   - Expected: ...
   - Actual: ...
   - Impact: High / Medium / Low

### Notes
- Any observations
- Performance issues
- Suggestions for improvement

### Sign-off
✅ Ready for deployment / ⚠️ Needs fixes
```

---

## Quick Smoke Test (30 seconds)

If you only have 30 seconds, run this:

```bash
# 1. Check feature flag
cat utils/feature-flags.ts | grep "BILLING_ENABLED: false" && echo "✅ Billing disabled"

# 2. Run verification
./verify-coming-soon.sh | grep "All checks passed" && echo "✅ Setup verified"

# 3. Test modal (manual)
# Open http://localhost:3000
# Click "Start free trial"
# See Coming Soon modal → ✅
```

---

## Continuous Monitoring (Post-Launch)

### Daily Checks
- [ ] Coming Soon modal appearance count (Analytics)
- [ ] Waitlist signup rate
- [ ] Error rate (should be 0)
- [ ] User feedback

### Weekly Checks
- [ ] Waitlist size growth
- [ ] Bounce rate on pricing page
- [ ] Time to enable billing readiness

### Pre-Launch Checks (Before Enabling Billing)
- [ ] Stripe fully configured
- [ ] Payment webhooks tested
- [ ] Support team ready
- [ ] Billing docs updated
- [ ] Rollback plan tested

---

**Test Status**: □ Not Started | ◐ In Progress | ✓ Complete  
**Overall Readiness**: □ Not Ready | ◐ Needs Testing | ✓ Ready to Deploy
