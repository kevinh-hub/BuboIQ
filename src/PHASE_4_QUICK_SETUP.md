# ⚡ Phase 4: Email + Notifications - Quick Setup

## 🎯 5-Minute Setup Guide

### Prerequisites
- ✅ Phase 3 complete (backend lead capture working)
- ✅ Supabase CLI installed
- ✅ Access to Supabase project

---

## Step 1: Get Resend API Key (2 min)

1. Go to **https://resend.com**
2. Sign up for free account
3. Click **"API Keys"** in dashboard
4. Click **"Create API Key"**
5. Copy the key (starts with `re_`)

**Free Tier**: 100 emails/day (plenty for getting started)

---

## Step 2: Get Slack Webhook (Optional, 2 min)

1. Go to **https://api.slack.com/messaging/webhooks**
2. Click **"Create your Slack app"**
3. Choose **"From scratch"**
4. Name it **"BuboIQ Leads"**
5. Choose your workspace
6. Click **"Incoming Webhooks"**
7. Toggle **"Activate Incoming Webhooks"** ON
8. Click **"Add New Webhook to Workspace"**
9. Choose channel (e.g., **#sales** or **#leads**)
10. Copy webhook URL (starts with `https://hooks.slack.com/services/...`)

---

## Step 3: Set Environment Variables (1 min)

```bash
# Required: Email notifications
supabase secrets set RESEND_API_KEY=re_your_key_here

# Required: Where to send lead notifications
supabase secrets set SALES_EMAIL=sales@buboiq.com

# Optional: Slack notifications
supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK

# Required: Frontend URL for email links
supabase secrets set FRONTEND_URL=https://buboiq.com
```

**Verify:**
```bash
supabase secrets list
```

Should show:
```
┌─────────────────────┬─────────────┐
│ Name                │ Value       │
├─────────────────────┼─────────────┤
│ RESEND_API_KEY      │ re_***      │
│ SALES_EMAIL         │ sales@***   │
│ SLACK_WEBHOOK_URL   │ https://*** │
│ FRONTEND_URL        │ https://*** │
└─────────────────────┴─────────────┘
```

---

## Step 4: Deploy Backend (30 seconds)

```bash
# Deploy updated make-server function
supabase functions deploy make-server
```

**Expected output:**
```
Deploying make-server...
✓ Function make-server deployed successfully
```

---

## Step 5: Test Notifications (2 min)

### Test 1: Submit Demo Lead

1. Open your site: **https://buboiq.com**
2. Click **"Start the Live Demo"**
3. Click **"Start Demo"**
4. Approve an action
5. Fill lead form:
   - Name: **Test User**
   - Email: **your-email@gmail.com** (use your real email)
   - Company: **Test Company**
6. Click **"Get Your Pilot Started"**

### Test 2: Check Auto-Reply Email

Check your inbox (the email you submitted):
- **Subject**: "Thanks for trying BuboIQ! Your pilot setup is next."
- **From**: BuboIQ <noreply@buboiq.com>
- **Content**: Professional email with 3-step timeline

### Test 3: Check Sales Notification

Check the sales email inbox (`SALES_EMAIL` you set):
- **Subject**: "🔥 Hot Lead Alert: Test Company" (if score ≥ 80)
- **OR**: "New Lead: Test Company (Score: XX)" (if score < 80)
- **Content**: Lead details with engagement metrics

### Test 4: Check Slack (if configured)

Check your Slack channel:
- Should see message: "🔥 HOT LEAD ALERT: Test User from Test Company"
- Rich blocks with lead details
- Button: "View in Dashboard"

---

## Step 6: Verify Admin Dashboard (30 seconds)

1. Login as super admin
2. Navigate to **Admin → Demo Leads**
3. Click **"Export CSV"** button
4. Verify CSV downloads with test lead data

---

## ✅ Verification Checklist

- [ ] Resend API key set and working
- [ ] Sales email set correctly
- [ ] Slack webhook configured (optional)
- [ ] Frontend URL correct
- [ ] Backend deployed successfully
- [ ] Auto-reply email received
- [ ] Sales notification email received
- [ ] Slack notification appeared (if configured)
- [ ] CSV export works
- [ ] No errors in function logs

---

## 🎨 Customization

### Change Email Templates

Edit `/supabase/functions/make-server/notifications.ts`:

```typescript
// Line ~50: Hot lead template
subject: `🔥 Hot Lead Alert: ${lead.company}`,

// Line ~150: Warm lead template
subject: `New Lead: ${lead.company} (Score: ${lead.lead_score})`,

// Line ~200: Auto-reply template
subject: 'Thanks for trying BuboIQ! Your pilot setup is next.',
```

### Change Slack Message Format

Edit `/supabase/functions/make-server/notifications.ts`:

```typescript
// Line ~300: Slack notification
await sendSlackNotification({
  text: `🔥 *HOT LEAD ALERT*: ${lead.name} from ${lead.company}`,
  blocks: [
    // Customize blocks here
  ]
});
```

### Change Email Sender

```bash
# Default: noreply@buboiq.com
# Change to your domain (requires Resend domain setup)

# In notifications.ts, line ~400:
from: payload.from || 'BuboIQ <hello@yourdomain.com>',
```

---

## 🐛 Troubleshooting

### Issue: No emails received

**Check:**
```bash
# View function logs
supabase functions logs make-server

# Look for:
✅ Email sent successfully: msg_xxxxx
# OR
❌ Resend API error: ...
```

**Common causes:**
1. Wrong API key → Reset in Resend dashboard
2. Invalid email address → Check lead email
3. Email in spam → Check spam folder
4. Resend account not verified → Verify your Resend account

### Issue: No Slack notifications

**Check:**
```bash
# View function logs
supabase functions logs make-server

# Look for:
✅ Slack notification sent successfully
# OR
❌ Slack webhook error: ...
```

**Common causes:**
1. Wrong webhook URL → Regenerate in Slack
2. Channel archived → Check channel exists
3. App removed → Re-add app to workspace

### Issue: Export fails

**Check:**
```bash
# Are you super admin?
SELECT role FROM users WHERE email = 'your@email.com';

# Should return: super_admin
```

**Fix:**
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'your@email.com';
```

---

## 📊 Monitoring

### View Logs (Real-time)

```bash
supabase functions logs make-server --follow
```

### Check Resend Dashboard

1. Go to **https://app.resend.com**
2. Click **"Emails"**
3. See all sent emails, delivery status, opens, clicks

### Check Slack Channel

1. Go to your configured channel (e.g., #sales)
2. See all lead notifications
3. Click "View in Dashboard" to access admin panel

---

## 🎯 Success Indicators

### Email Working ✅
- Auto-reply arrives in <2 seconds
- Sales notification arrives in <1 minute
- Emails display correctly on mobile
- Links in emails work

### Slack Working ✅
- Notifications appear in <5 seconds
- Rich blocks display correctly
- Dashboard link works
- Hot leads have 🔥 emoji

### Export Working ✅
- CSV downloads instantly
- All columns present
- Data matches admin panel
- Opens in Excel/Google Sheets

---

## 🚀 Next Steps

### After Setup

1. **Monitor first week**
   - Check emails arriving
   - Track open rates in Resend
   - Ensure sales team sees notifications

2. **Optimize**
   - Adjust email copy based on response
   - Add custom domain in Resend
   - Create Slack channel rules

3. **Scale**
   - Upgrade Resend if >100 emails/day
   - Add more sales team members
   - Set up CRM integration

### Advanced Features

```typescript
// Add CC to sales emails
to: [salesEmail, 'manager@buboiq.com'],

// Add lead assignment
const assignTo = assignLeadToRep(lead);
await notifyAssignedRep(assignTo, lead);

// Add scheduled follow-up
await scheduleFollowUp(lead, '24 hours');
```

---

## 💰 Cost

### Resend (Email)
- **Free**: 100 emails/day = 3,000/month
- **Pro**: $20/month = 50,000 emails
- **Business**: Custom pricing

**Estimated**: $0/month for first 100 leads, then $20/month

### Slack
- **Free**: Unlimited messages
- **No cost** for notifications

### Total Cost
- **Month 1**: **$0** (free tiers)
- **Month 2+**: **$0-20** depending on volume

---

## ✅ Setup Complete!

You now have:
- ✅ Email notifications working
- ✅ Slack integration active
- ✅ Auto-reply system live
- ✅ CSV export functional
- ✅ Complete lead management flow

**Next**: Submit a real lead and watch the magic happen! 🎉

---

**Built for BuboIQ** — From Demo to Customer in Seconds

🚀 **PHASE 4 SETUP COMPLETE - NOTIFICATIONS LIVE!**
