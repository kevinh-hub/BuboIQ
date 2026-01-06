# 🎟️ Early Access System — Quick Start Guide

## 🚀 Deploy in 5 Minutes

### 1. Run Deployment Script

```bash
chmod +x DEPLOY_EARLY_ACCESS.sh
./DEPLOY_EARLY_ACCESS.sh
```

This will:
- ✅ Apply database migration
- ✅ Deploy server functions
- ✅ Verify secrets configured
- ✅ Initialize cohort settings

### 2. Set Resend API Key (if not already set)

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

Get your API key from: https://resend.com

### 3. Create Super Admin (if needed)

```sql
-- In Supabase SQL Editor:
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'your@email.com';
```

### 4. Access Admin Dashboard

Navigate to: **`/early-access-admin`**

(Add this route to your App.tsx router)

---

## 📊 Admin Dashboard Quick Tour

### Stats Cards
- **Invites Available** - Unused invites ready to send
- **Invites Redeemed** - Successfully activated invites
- **EA Orgs / Cap** - Current EA organizations vs limit
- **Total Devices / Cap** - Total devices vs limit
- **Expired Invites** - Invites that expired unused

### Cohort Controls
- **Organization Cap** - Max EA organizations allowed
- **Device Cap** - Max total devices across all EA orgs
- **Cohort Closes At** - Date when new redemptions stop
- **Emergency Close** - Toggle to immediately block all redemptions
- **Auto-expire Invites** - Automatically expire invites on expiration date

### Create Invite
1. Click **"Create Invite"** button
2. Fill form:
   - **Email** (optional - leave blank for open invite)
   - **Days Valid** (default 10)
   - **Notes** (internal use)
   - Toggle **Send Email** if email provided
3. Click **"Generate & Send"** or **"Generate Link Only"**
4. Copy the invite URL or email is sent automatically

### Invites Table
- **Search** - Filter by email or token
- **Filter** - By status (unused, redeemed, expired, revoked)
- **Copy Link** - Copy invite URL to clipboard
- **Revoke** - Immediately invalidate an invite

---

## 🎫 How Invite Redemption Works

### 1. Recipient Gets Invite
- Via email (if sent)
- Or copy/paste link from admin

### 2. Clicks Invite Link
`https://your-app.com/invite/ea?token=ABC123XYZ`

### 3. System Validates Token
- ✅ Token exists and is valid
- ✅ Not expired
- ✅ Not already used
- ✅ Not revoked
- ✅ Cohort not closed
- ✅ Under capacity limits

### 4. Redemption Page Shows
- **If not signed in:** Prompt to sign in or create account
- **If signed in:** Show invite details and "Activate Early Access" button

### 5. User Activates
- Creates new organization with:
  - `is_early_access = true`
  - `ea_founders_rate = 99.00` (locked for 12 months)
  - `tier = 'pro'`
  - `device_limit = 100`
  - `is_trial = true`
  - `trial_ends_at = now + 14 days`
- Marks invite as redeemed
- Sends acceptance email
- Redirects to EA onboarding

### 6. User Onboards
- 14-day trial starts
- Can explore full EA-Pro features
- Billing activation coming soon
- Founders rate guaranteed

---

## 📧 Email Templates

### Invite Email
**Subject:** Your BuboIQ Early Access Invite

**Includes:**
- Welcome message
- Plan details (EA-Pro, $99/mo, 100 devices)
- Expiration date (prominent)
- CTA button to activate
- Fallback link
- Support email (help@buboiq.com)

### Acceptance Email
**Subject:** Welcome to BuboIQ Early Access (EA-Pro)

**Includes:**
- Congratulations message
- Founders rate confirmation
- 14-day trial details
- Next steps
- Support contact

---

## 🎯 Key Features

### Single-Use Tokens
- Each invite can only be redeemed once
- After redemption, status changes to "redeemed"
- Cannot be reused or shared

### Time-Gated
- Invites expire after configured days (default 10)
- Auto-expiration runs periodically
- Expiring soon shows in UI (< 2 days)

### Cohort Limits
- **Organization Cap** - Max number of EA orgs
- **Device Cap** - Max total devices across all EA orgs
- **Closing Date** - Hard deadline for redemptions
- **Emergency Close** - Instant shutdown toggle

### Founders Pricing
- $99/month (vs regular $149)
- Locked for 12 months
- Automatically applied on redemption
- Shown prominently in UI

### Audit Trail
- Every action logged (create, send, redeem, revoke)
- Includes actor, timestamp, IP, details
- Queryable for analytics and compliance

---

## 🧪 Testing Checklist

### Create Invite
- [ ] Create invite with email → Email sent
- [ ] Create invite without email → Open invite
- [ ] Copy invite link works
- [ ] Invite appears in table

### Redeem Invite
- [ ] Valid token shows details
- [ ] Expired token shows error
- [ ] Used token shows error
- [ ] Revoked token shows error
- [ ] Cohort closed shows error
- [ ] Unauthenticated prompts sign in
- [ ] Authenticated can activate
- [ ] Org created with EA settings
- [ ] Acceptance email sent

### Admin Controls
- [ ] Stats update in real-time
- [ ] Cohort settings save
- [ ] Emergency close blocks redemptions
- [ ] Search/filter works
- [ ] Revoke changes status

---

## 🚨 Common Issues & Solutions

### "Email not sending"
**Solution:** Verify RESEND_API_KEY is set and Resend domain is configured

### "Cohort is closed"
**Solution:** Check closes_at date and emergency_closed flag in cohort settings

### "Cannot access admin dashboard"
**Solution:** Ensure your user has role = 'super_admin'

### "Invite already used"
**Solution:** Create new invite - tokens are single-use only

### "User already has an organization"
**Solution:** Each user can only redeem one EA invite

---

## 📊 Key Metrics to Monitor

Track these in your analytics:

1. **Invite Conversion Rate**
   - Redeemed / Created
   - Target: >60%

2. **Time to Redemption**
   - Created → Redeemed timestamp
   - Optimize days_valid based on this

3. **Expiration Rate**
   - Expired / Created
   - High rate = increase days_valid

4. **Cohort Capacity**
   - Current vs Cap
   - Plan ahead for hitting limits

5. **Trial-to-Paid Conversion**
   - After 14-day trial ends
   - Target: >40%

---

## 🎨 Branding Consistency

All EA components use:

**Colors:**
- Primary: `#00FF85` (neon green)
- Surface: `#1C1C1E`
- Background: `#0A0A0A`
- Accent: `#1E90FF` (electric blue)

**Typography:**
- Headlines: Space Grotesk Bold
- Body: Inter Regular  
- Technical: JetBrains Mono

**Effects:**
- Glass panels with backdrop blur
- Neon glow on primary actions
- Smooth 0.3s transitions
- Pulse animation on expiring badges

**Badges:**
- EA-PRO (neon green, glowing)
- FOUNDERS RATE (green outline)
- TRIAL (electric blue)
- EXPIRES SOON (orange, pulsing)

---

## 📞 Support

**Questions?** Email help@buboiq.com

**Documentation:**
- Full guide: `EARLY_ACCESS_SYSTEM_COMPLETE.md`
- API routes: `/supabase/functions/server/early-access.ts`
- Components: `/components/early-access/`

**Monitoring:**
- Check Supabase logs for API errors
- Check Resend dashboard for email delivery
- Query audit_log table for detailed history

---

## 🎉 You're Ready!

Your Early Access system is now live. Start creating invites and building your founder cohort!

**Next Steps:**
1. Create your first invite
2. Test the full redemption flow
3. Monitor conversion metrics
4. Iterate based on feedback

**Built with ❤️ by the BuboIQ team**
**BUBO**IQ — The Brain of Modern IT Operations
