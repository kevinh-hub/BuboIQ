# BuboIQ Back Office - Quick Start Guide

**Get the Admin Console running in 5 minutes**

---

## Prerequisites

- Supabase project (existing BuboIQ instance)
- Super admin email/password
- Stripe account (optional, for billing features)
- Resend account (optional, for email features)

---

## Step 1: Run Database Migrations (2 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire `/docs/MIGRATIONS.sql` file
3. Click "Run" to execute migrations
4. Verify tables created:

```sql
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname IN ('audit_compliance', 'finance', 'support', 'system', 'analytics')
ORDER BY schemaname, tablename;
```

Expected output:
```
 schemaname      | tablename
-----------------+-----------------------
 analytics       | analytics_usage_mv
 audit_compliance| admin_orgs_view
 audit_compliance| audit_log
 finance         | finance_ops
 support         | support_tickets
 system          | feature_flags
 system          | system_jobs
```

---

## Step 2: Create Super Admin User (30 seconds)

```sql
-- Find your user ID
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';

-- Grant super_admin role
UPDATE users SET role = 'super_admin' WHERE email = 'your-email@example.com';

-- Verify
SELECT email, role FROM users WHERE role = 'super_admin';
```

---

## Step 3: Deploy Edge Functions (1 minute)

```bash
# If not already deployed
cd /path/to/buboiq

# Deploy make-server (includes admin routes)
supabase functions deploy make-server

# Test deployment
curl https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-55e8c5b2/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00Z","version":"2.0.0","services":{"database":"ok","email":"warning","storage":"ok"},"initialized":true}
```

---

## Step 4: Access Back Office (30 seconds)

1. Navigate to `/admin` in your BuboIQ app
2. If not logged in, sign in with your super admin credentials
3. You should see the Back Office dashboard

**First-time view:**
- Organizations tab: "No organizations yet" (if fresh DB)
- Billing tab: "Connect Stripe webhook to see invoice details"
- Analytics tab: "No usage data yet"
- Support tab: "No open support tickets"
- System tab: Empty feature flags, jobs list
- Compliance tab: Empty audit logs

This is **correct behavior** - no mock data is shown.

---

## Step 5: Configure Integrations (Optional)

### Stripe Webhook (for billing features)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://YOUR-PROJECT-ID.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Click "Add endpoint"
6. Copy webhook signing secret and add to Supabase secrets:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Resend Email (for admin notifications)

```bash
# Add Resend API key to Supabase secrets
supabase secrets set RESEND_API_KEY=re_xxx
```

---

## Step 6: Seed Initial Data (Optional)

### Add Feature Flags

```sql
INSERT INTO system.feature_flags (key, enabled, rollout_percent, description) VALUES
('coming_soon_mode', false, 0, 'Show coming soon banner on homepage'),
('guided_fixes_v2', false, 0, 'Enable new guided fixes UI'),
('analytics_dashboard', true, 100, 'Analytics page for admins');
```

### Add Test Organization (for testing)

```sql
-- Create test company
INSERT INTO companies (name, tier) VALUES ('Test Corp', 'Pro') RETURNING id;

-- Create finance record (using ID from above)
INSERT INTO finance.finance_ops (org_id, stripe_customer_id, plan, mrr_cents, status)
VALUES (
  'PASTE-ID-HERE',
  'cus_test',
  'Pro',
  9900,
  'active'
);
```

---

## Verification Checklist

After setup, verify everything works:

### ✅ Authentication
- [ ] Can access `/admin` with super_admin account
- [ ] Regular users cannot access `/admin` (get redirected or see "Unauthorized")

### ✅ Organizations Tab
- [ ] See list of organizations (or empty state if none)
- [ ] Can change tier → success toast appears
- [ ] Can extend trial → success toast appears
- [ ] Can impersonate org → page reloads with impersonation active

### ✅ Billing Tab
- [ ] See MRR total (or $0.00 if no subscriptions)
- [ ] See "Connect Stripe webhook" message if Stripe not configured

### ✅ Analytics Tab
- [ ] See "No usage data yet" message (if fresh DB)
- [ ] OR see real metrics if tickets exist

### ✅ Support Tab
- [ ] See empty state "No open support tickets" (if none)
- [ ] OR see list of tickets

### ✅ System Tab
- [ ] See feature flags (if seeded)
- [ ] See DB latency (number in ms)
- [ ] Can toggle feature flag → success toast

### ✅ Compliance Tab
- [ ] See empty state "No audit logs yet" (if fresh)
- [ ] OR see audit log entries if admin actions performed
- [ ] Can generate evidence CSV → downloads file

---

## Common Issues

### Issue: "Unauthorized" when accessing /admin

**Solution:**
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'your-email@example.com';
```

### Issue: Billing shows $0 MRR but subscriptions exist

**Solution:**
- Check Stripe webhook is configured
- Manually sync one subscription to test:

```sql
-- Get Stripe subscription ID from Stripe Dashboard
INSERT INTO finance.finance_ops (org_id, stripe_customer_id, stripe_subscription_id, plan, mrr_cents, status)
VALUES (
  (SELECT id FROM companies LIMIT 1),
  'cus_xxx',
  'sub_xxx',
  'Pro',
  9900,
  'active'
);
```

### Issue: Analytics shows "No data yet" but tickets exist

**Solution:**
```sql
-- Refresh materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.analytics_usage_mv;

-- Verify data
SELECT * FROM analytics.analytics_usage_mv LIMIT 5;
```

### Issue: Empty state messages not showing

**Solution:**
- This is expected! Empty states only show when data arrays are truly empty `[]`
- Check browser console for errors
- Verify API responses: Network tab → check `/admin/*` responses

---

## Next Steps

Now that Back Office is set up:

1. **Read the full documentation:**
   - `/docs/ADMIN_README.md` - Complete feature guide
   - `/docs/RUNBOOK_BACK_OFFICE.md` - Operations playbook
   - `/docs/TESTING_SPEC.md` - Testing guide

2. **Perform your first admin action:**
   - Go to Organizations tab
   - Click "Change Tier" on an org
   - Go to Compliance tab
   - Verify audit log entry was created

3. **Set up monitoring:**
   - Configure Supabase alerts for high DB latency
   - Set up Stripe webhook delivery monitoring
   - Add custom alerts for failed payments, expiring trials

4. **Run tests:**
   ```bash
   npm run test:unit
   npm run test:integration
   npm run test:e2e
   ```

---

## Keyboard Shortcuts Cheat Sheet

| Shortcut | Action |
|----------|--------|
| `g` + `o` | Organizations |
| `g` + `b` | Billing |
| `g` + `a` | Analytics |
| `g` + `s` | Support |
| `g` + `y` | System |
| `g` + `c` | Compliance |
| `/` | Search |

---

## Support

**Questions?** Check:
- `/docs/ADMIN_README.md` - Full documentation
- `/docs/RUNBOOK_BACK_OFFICE.md` - Troubleshooting guide
- Supabase Dashboard Logs - Check for errors

**Still stuck?**
- Check #platform-team Slack channel
- Contact on-call engineer (see PagerDuty)

---

**Setup complete! 🎉 Your production-ready Back Office is now live.**

**Remember:** All data is real. No mocks. No fakes. Production-safe from day one.
