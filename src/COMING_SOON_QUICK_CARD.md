# Coming Soon Mode - Quick Reference Card

## Current Status
```
🟡 COMING SOON MODE ACTIVE
   ├─ Platform: Fully deployed ✅
   ├─ Marketing: All pages visible ✅
   ├─ Billing: Blocked (shows modal) 🚫
   └─ Early Access: Working independently ✅
```

## One-Line Summary
> Deploy BuboIQ to production with billing blocked. Enable later by changing 1 line.

---

## Quick Actions

### Check Status (5 seconds)
```bash
cat utils/feature-flags.ts | grep BILLING_ENABLED
```

### Test Locally (30 seconds)
```bash
npm run dev
# Visit http://localhost:3000
# Click "Start free 14-day trial"
# ✅ Should show Coming Soon modal
```

### Enable Billing (10 seconds)
```bash
# Edit utils/feature-flags.ts, line 16:
BILLING_ENABLED: true,  # Change from false

# Deploy:
vercel --prod
```

### Verify Setup (30 seconds)
```bash
chmod +x verify-coming-soon.sh
./verify-coming-soon.sh
# ✅ Should show all green checkmarks
```

---

## What's Blocked

When `BILLING_ENABLED: false`:

| Action | Before | After |
|--------|--------|-------|
| Click "Start free trial" | → Pricing page | → Coming Soon modal |
| Click "Start Free Trial" (pricing) | → Stripe checkout | → Coming Soon modal |
| Click upgrade (in-app) | → Upgrade modal | → Coming Soon modal |
| Click "Manage billing" | → Stripe portal | → Coming Soon modal |

---

## Protected Entry Points (4)

1. **HomePage.tsx** - "Start free 14-day trial" button
2. **StripePricingPageV2.tsx** - All checkout buttons  
3. **App.tsx** - `handleUpgrade()` function
4. **BillingSettings.tsx** - Upgrade & portal buttons

---

## Files Modified (4)

```
/components/marketing/HomePage.tsx          (~20 lines)
/components/marketing/StripePricingPageV2.tsx  (~15 lines)
/App.tsx                                    (~20 lines)
/components/settings/BillingSettings.tsx    (~20 lines)
```

## Files Created (6)

```
/utils/feature-flags.ts                     (Core feature flag)
/components/marketing/ComingSoonModal.tsx   (Reusable modal)
/COMING_SOON_MODE.md                        (Technical guide)
/DEPLOY_WITH_COMING_SOON.md                 (Deployment guide)
/COMING_SOON_IMPLEMENTATION.md              (Implementation details)
/verify-coming-soon.sh                      (Verification script)
```

---

## Configuration

Edit `/utils/feature-flags.ts`:

```typescript
export const FEATURE_FLAGS = {
  BILLING_ENABLED: false,  // ← Toggle billing
} as const;

export const COMING_SOON_CONFIG = {
  title: "Coming Soon",
  message: "BuboIQ will be available...",
  ctaText: "Join Waitlist",
  ctaAction: "mailto:hello@buboiq.com...",
  showDebugInfo: false,
} as const;
```

---

## Common Scenarios

### Scenario 1: Deploy to Production Today
```
1. Keep BILLING_ENABLED: false
2. Deploy: vercel --prod
3. Users see Coming Soon on trial/payment
4. Collect waitlist emails
5. Enable billing when ready
```

### Scenario 2: Launch Day
```
1. Deploy days before with billing disabled
2. Test everything thoroughly
3. On launch day: Set BILLING_ENABLED: true
4. Deploy (10 seconds)
5. Announce launch
```

### Scenario 3: Gradual Beta
```
1. Keep BILLING_ENABLED: false globally
2. Enable for specific users:
   if (user.isBeta) return true;
3. Expand gradually
```

---

## Testing Checklist

### Homepage Test
- [ ] Click "Start free 14-day trial"
- [ ] See Coming Soon modal
- [ ] Click "Join Waitlist"
- [ ] Email client opens with pre-filled message

### Pricing Page Test
- [ ] Navigate to /stripe-pricing
- [ ] Select a plan
- [ ] Click "Start Free Trial"
- [ ] See Coming Soon modal

### In-App Test (if logged in)
- [ ] Settings > Billing
- [ ] Try to upgrade
- [ ] See Coming Soon modal

---

## Rollback Plan

If issues after enabling billing:

```bash
# 1. Immediate rollback (10 seconds)
# Edit utils/feature-flags.ts:
BILLING_ENABLED: false,

# 2. Deploy
vercel --prod

# ✅ All billing instantly shows Coming Soon again
```

---

## Monitoring

### What Works
✅ Page analytics  
✅ Button click tracking  
✅ User journeys visible  
✅ Waitlist conversions  

### What's Blocked
🚫 Stripe checkouts  
🚫 Trial signups  
🚫 Paid subscriptions  
🚫 Upgrade flows  

---

## Important Notes

⚠️ **Early Access is INDEPENDENT**  
→ Uses separate invite system  
→ Not affected by BILLING_ENABLED flag  

⚠️ **Super Admin is UNAFFECTED**  
→ Full access regardless of billing state  

⚠️ **Marketing Pages FULLY VISIBLE**  
→ All content accessible  
→ Only checkout is blocked  

---

## When to Enable Billing

✅ **Enable if**:
- Stripe is fully configured
- Payment flows tested
- Ready to accept real money
- Support team prepared
- Launch announcement ready

❌ **Don't enable if**:
- Still testing Stripe integration
- Not ready for real customers
- Want to build waitlist first
- Soft launch to friends/family

---

## Support

### Documentation
- **Technical**: `COMING_SOON_MODE.md`
- **Deployment**: `DEPLOY_WITH_COMING_SOON.md`
- **Implementation**: `COMING_SOON_IMPLEMENTATION.md`

### Quick Help
```bash
# Verify setup
./verify-coming-soon.sh

# Check feature flag
cat utils/feature-flags.ts | grep BILLING_ENABLED

# Check if modal exists
ls components/marketing/ComingSoonModal.tsx
```

---

## Summary

| Aspect | Status |
|--------|--------|
| Implementation | ✅ Complete |
| Testing | ✅ Verified |
| Documentation | ✅ Comprehensive |
| Ready to Deploy | ✅ Yes |
| Enable Time | ⏱️ 10 seconds |
| Rollback Time | ⏱️ 10 seconds |

---

**Current Mode**: 🟡 Coming Soon  
**To Go Live**: Change 1 line → Deploy  
**Questions**: See documentation files above  
