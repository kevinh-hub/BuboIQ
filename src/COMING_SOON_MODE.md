# Coming Soon Mode - Quick Reference

## Overview

BuboIQ is currently deployed in **Coming Soon Mode**, which blocks all payment and trial access while keeping the full platform visible and functional. This allows you to deploy to production while controlling when billing goes live.

## Current State

- ✅ Full platform is deployable
- ✅ Marketing pages are accessible
- ✅ Pricing pages are visible
- ❌ Trial signup is blocked
- ❌ Payment checkout is blocked
- ❌ Upgrade flows are blocked

## How It Works

### Single Feature Flag
All billing functionality is controlled by one feature flag in `/utils/feature-flags.ts`:

```typescript
export const FEATURE_FLAGS = {
  BILLING_ENABLED: false,  // Set to true to enable billing
} as const;
```

### Protected Entry Points

When `BILLING_ENABLED: false`, these actions show a Coming Soon modal:

1. **HomePage** - "Start free 14-day trial" button
2. **HomePage** - "Compare plans" button  
3. **StripePricingPageV2** - All checkout buttons
4. **UpgradeModal** - Tier upgrade flows
5. **BillingSettings** - Plan upgrades and add-on purchases
6. **BillingSettings** - Stripe portal access

### Coming Soon Modal

Location: `/components/marketing/ComingSoonModal.tsx`

Features:
- Clean, on-brand design matching BuboIQ's dark futuristic aesthetic
- Configurable messaging and CTA
- Default: Email waitlist (mailto link)
- Alternative: Newsletter signup (can be configured)
- Benefits list for user motivation
- Optional debug mode

## Configuration

Edit `/utils/feature-flags.ts` to customize the Coming Soon experience:

```typescript
export const COMING_SOON_CONFIG = {
  title: "Coming Soon",
  message: "BuboIQ will be available for trial and purchase very soon. Join our waitlist to be notified when we launch!",
  ctaText: "Join Waitlist",
  ctaAction: "mailto:hello@buboiq.com?subject=Early%20Access%20Waitlist&body=I'm%20interested%20in%20getting%20early%20access%20to%20BuboIQ.",
  
  // Alternative: Newsletter signup
  // ctaText: "Get Notified",
  // ctaAction: "https://buboiq.com/newsletter",
  
  showDebugInfo: false, // Set to true to show feature flag status
} as const;
```

## Enabling Billing (Go Live)

### Option 1: Enable Immediately (10 seconds)

1. Open `/utils/feature-flags.ts`
2. Change line 11:
   ```typescript
   BILLING_ENABLED: true,  // Changed from false
   ```
3. Deploy to production
4. ✅ Done - All billing functionality is live

### Option 2: Gradual Rollout

Keep the feature flag in place and enable billing for specific users or cohorts by adding conditional logic:

```typescript
export const isBillingEnabled = (user?: User) => {
  // Enable for beta testers
  if (user?.email?.includes('@trusted-beta.com')) {
    return true;
  }
  
  // Enable for specific org IDs
  if (['org-123', 'org-456'].includes(user?.org_id || '')) {
    return true;
  }
  
  // Default to feature flag
  return FEATURE_FLAGS.BILLING_ENABLED;
};
```

## Testing

### Test Coming Soon Mode (Current State)

1. Visit homepage: `https://buboiq.com`
2. Click "Start free 14-day trial"
3. ✅ Should see Coming Soon modal
4. Click "Join Waitlist" 
5. ✅ Should open email client with pre-filled subject/body

### Test with Billing Enabled

1. Set `BILLING_ENABLED: true` in `/utils/feature-flags.ts`
2. Rebuild/restart: `npm run dev`
3. Click "Start free 14-day trial"
4. ✅ Should navigate to pricing page
5. Select a plan and click checkout
6. ✅ Should redirect to Stripe checkout

### Test Upgrade Flow

1. Log in as a Starter tier user
2. Try to access a Pro feature
3. With billing disabled: ✅ See Coming Soon modal
4. With billing enabled: ✅ See upgrade modal with Stripe checkout

## Architecture

### File Structure

```
/utils/feature-flags.ts                    # Single source of truth
/components/marketing/ComingSoonModal.tsx  # Reusable modal component

Entry Points (4 total):
/components/marketing/HomePage.tsx         # Main CTA
/components/marketing/StripePricingPageV2.tsx  # Checkout
/App.tsx                                   # Upgrade handler
/components/settings/BillingSettings.tsx   # Settings page
```

### Data Flow

```
User Action → Check isBillingEnabled()
                ↓
         false  |  true
                ↓
    Show Coming Soon  →  Proceed with Billing
```

## Removal (Future)

When you're ready to permanently enable billing and remove the feature flag system:

### Quick Removal (5 minutes)

1. Delete `/utils/feature-flags.ts`
2. Delete `/components/marketing/ComingSoonModal.tsx`
3. Delete `/COMING_SOON_MODE.md`
4. Search and remove all imports:
   - `import { isBillingEnabled } from '../../utils/feature-flags'`
   - `import { ComingSoonModal } from './ComingSoonModal'`
5. Remove feature flag checks:
   - Find: `if (isBillingEnabled())`
   - Replace with: Direct billing action
6. Remove modal state: `const [showComingSoon, setShowComingSoon] = useState(false)`
7. Remove modal render: `<ComingSoonModal ... />`

### Files to Update (4 total)

1. `/components/marketing/HomePage.tsx`
2. `/components/marketing/StripePricingPageV2.tsx`
3. `/App.tsx`
4. `/components/settings/BillingSettings.tsx`

## Notes

- Coming Soon mode does NOT affect Early Access invites
- Early Access system works independently and is always enabled
- Super admin functions are not affected
- Demo system and marketing pages function normally
- Analytics and tracking still work (helps measure interest)

## Support

If you need to customize the Coming Soon experience:
- Edit `/utils/feature-flags.ts` for messaging
- Edit `/components/marketing/ComingSoonModal.tsx` for design
- Add additional entry points by importing `isBillingEnabled()` and checking before billing actions

---

**Current Status**: Coming Soon Mode Active 🟡  
**To Go Live**: Set `BILLING_ENABLED: true` in `/utils/feature-flags.ts` ✅
