# Deploy BuboIQ with Coming Soon Mode

## Quick Start

Deploy BuboIQ to production with billing blocked. Enable billing later with a single line change.

```bash
# Current state: BILLING_ENABLED = false
# Effect: Platform is live, billing is blocked
# User experience: "Coming Soon" modal on trial/payment actions
```

## Pre-Deployment Checklist

### 1. Verify Feature Flag (30 seconds)

```bash
# Check the feature flag status
cat utils/feature-flags.ts | grep BILLING_ENABLED
```

Should show:
```typescript
BILLING_ENABLED: false,  // ✅ Billing blocked (Coming Soon mode)
```

### 2. Configure Coming Soon Message (Optional, 2 minutes)

Edit `/utils/feature-flags.ts`:

```typescript
export const COMING_SOON_CONFIG = {
  // Customize these values:
  title: "Coming Soon",
  message: "BuboIQ will be available for trial and purchase very soon. Join our waitlist to be notified when we launch!",
  ctaText: "Join Waitlist",
  ctaAction: "mailto:hello@buboiq.com?subject=Early%20Access%20Waitlist&body=I'm%20interested%20in%20getting%20early%20access%20to%20BuboIQ.",
  
  // For debugging (shows feature flag status in modal):
  showDebugInfo: false,
} as const;
```

### 3. Test Locally (5 minutes)

```bash
# Start local development server
npm run dev

# Open browser to http://localhost:3000
```

**Test Flow**:
1. Click "Start free 14-day trial" on homepage
2. ✅ Should show Coming Soon modal
3. Click "Join Waitlist"
4. ✅ Should open email client with pre-filled message

**Test Pricing Page**:
1. Navigate to pricing page
2. Select a plan and click "Start Free Trial"
3. ✅ Should show Coming Soon modal

**Test Logged-In Flow** (if you have test account):
1. Log in to the app
2. Go to Settings > Billing
3. Try to upgrade or manage subscription
4. ✅ Should show Coming Soon modal

### 4. Deploy to Production

Use your existing deployment process. Coming Soon mode is controlled by code, not environment variables.

```bash
# Example: Vercel
vercel --prod

# Example: Your custom script
./BUBO_AUTO_DEPLOY.sh
```

## Post-Deployment Verification

### 1. Verify Production (3 minutes)

Visit your production URL:

**Homepage Test**:
- ✅ Page loads correctly
- ✅ "Start free 14-day trial" button shows Coming Soon modal
- ✅ "Compare plans" link shows Coming Soon modal

**Pricing Page Test**:
- ✅ Navigate to /pricing or /stripe-pricing
- ✅ All plans are visible
- ✅ "Start Free Trial" shows Coming Soon modal

**App Test** (if logged in):
- ✅ Navigate to Settings > Billing
- ✅ Try to upgrade → Shows Coming Soon modal
- ✅ Try to manage subscription → Shows Coming Soon modal

### 2. Monitor Analytics

Coming Soon mode still tracks user intent:

```javascript
// These events are still fired:
- Page views on pricing
- Button clicks (recorded as "coming_soon_shown")
- Email waitlist conversions
```

### 3. Collect Waitlist Emails

All waitlist signups go to the configured email address. Consider:
- Setting up a dedicated waitlist@ email
- Using a Google Form instead of mailto
- Integrating with ConvertKit/Mailchimp
- Tracking in a spreadsheet

## Going Live with Billing

### Option A: Immediate Launch (10 seconds)

When ready to enable billing:

```bash
# 1. Edit the feature flag
vim utils/feature-flags.ts

# 2. Change this line:
BILLING_ENABLED: true,  // Changed from false

# 3. Deploy
vercel --prod
```

That's it! Billing is now live.

### Option B: Gradual Rollout

Enable billing for specific users/orgs first:

```typescript
// In /utils/feature-flags.ts

export const isBillingEnabled = (user?: User) => {
  // Beta testers
  if (user?.tags?.includes('beta-tester')) {
    return true;
  }
  
  // Early access cohort
  if (user?.created_at && new Date(user.created_at) < new Date('2025-01-01')) {
    return true;
  }
  
  // VIP customers
  const vipEmails = ['alice@example.com', 'bob@example.com'];
  if (user?.email && vipEmails.includes(user.email)) {
    return true;
  }
  
  // Default to feature flag
  return FEATURE_FLAGS.BILLING_ENABLED;
};
```

### Option C: Scheduled Launch

Use environment variables for dynamic control:

```typescript
// In /utils/feature-flags.ts

export const FEATURE_FLAGS = {
  BILLING_ENABLED: process.env.NEXT_PUBLIC_BILLING_ENABLED === 'true',
} as const;
```

Then set the environment variable at your desired launch time:
```bash
# In Vercel dashboard or .env.production
NEXT_PUBLIC_BILLING_ENABLED=true
```

## Monitoring After Launch

### Check Stripe Dashboard
- New subscriptions appearing
- Trial signups
- Checkout sessions

### Check Supabase
- `organizations` table → `subscription_status` updates
- `stripe_events` table → webhook events

### Check Application Logs
- Successful checkouts
- Failed payments
- Upgrade flows

## Rollback Plan

If issues arise after enabling billing:

```bash
# 1. Immediate rollback (10 seconds)
# Edit utils/feature-flags.ts
BILLING_ENABLED: false,  // Back to Coming Soon mode

# 2. Deploy
vercel --prod

# 3. All billing flows immediately show Coming Soon modal
# 4. Existing subscriptions continue unaffected
# 5. Fix issues, then re-enable
```

## Common Scenarios

### Scenario 1: Soft Launch to Friends & Family

1. Keep `BILLING_ENABLED: false`
2. Create Early Access invite codes
3. Send codes to test group
4. They can access the platform but not pay
5. Enable billing when ready for real money

### Scenario 2: Marketing Launch without Payment

1. Deploy with `BILLING_ENABLED: false`
2. Run marketing campaigns
3. Build waitlist via Coming Soon modal
4. Enable billing on official launch day
5. Email waitlist with launch announcement

### Scenario 3: Gradual Beta

1. Deploy with `BILLING_ENABLED: false`
2. Use Early Access system for beta testers
3. Enable billing for beta users only:
   ```typescript
   if (user?.tier === 'beta') return true;
   ```
4. Expand gradually:
   - Week 1: Beta testers
   - Week 2: Early adopters
   - Week 3: General public

### Scenario 4: Public Launch Day

1. Deploy days before with `BILLING_ENABLED: false`
2. Verify everything works
3. On launch day at 9 AM:
   - Set `BILLING_ENABLED: true`
   - Deploy (10 seconds)
   - Announce publicly
4. Monitor Stripe dashboard for first checkout

## Troubleshooting

### "Coming Soon modal appears when billing is enabled"

1. Check `/utils/feature-flags.ts`:
   ```typescript
   BILLING_ENABLED: true,  // Must be true
   ```
2. Clear browser cache
3. Check environment variables (if using Option C)
4. Verify code is deployed:
   ```bash
   curl https://your-site.com/utils/feature-flags.ts
   ```

### "Email waitlist not working"

1. Check browser blocks mailto links
2. Test in different browsers
3. Alternative: Switch to form:
   ```typescript
   ctaAction: "https://forms.gle/your-form-id",
   ```

### "Want to change Coming Soon message"

1. Edit `/utils/feature-flags.ts` → `COMING_SOON_CONFIG`
2. No code changes needed, just config
3. Deploy

### "Need custom modal design"

1. Edit `/components/marketing/ComingSoonModal.tsx`
2. All Tailwind classes can be modified
3. Matches BuboIQ's dark futuristic theme by default

## Summary

✅ **Current State**: Coming Soon mode active  
✅ **Platform**: Fully deployed and functional  
✅ **Marketing**: All pages accessible  
✅ **Billing**: Blocked with friendly Coming Soon modal  
✅ **Early Access**: Works independently  
✅ **To Enable**: Change 1 line in `/utils/feature-flags.ts`  

---

**Questions?** See `/COMING_SOON_MODE.md` for technical details.
