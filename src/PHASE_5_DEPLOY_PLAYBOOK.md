# 🚀 Phase 5 Deployment Playbook - BuboIQ Vite/React App

## 0️⃣ Prerequisites (One-Time Setup)

### Supabase CLI
```bash
# Install Supabase CLI (if not already)
brew install supabase/tap/supabase  # macOS
# OR
npm install -g supabase  # Cross-platform

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF
```

### Environment Variables

**Supabase Edge Functions (already set):**
```bash
# Check existing secrets
supabase secrets list

# Should show (already configured from previous phases):
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY
# - OPENAI_API_KEY
```

**New secrets for Phase 4-5:**
```bash
# Email notifications (Phase 4)
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set SALES_EMAIL=sales@buboiq.com
supabase secrets set FRONTEND_URL=https://buboiq.com

# Slack (optional)
supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

**Vite App (.env):**
```bash
# Create/update .env file in project root
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 1️⃣ Run Database Migrations

```bash
# From project root
supabase db push

# Verify migrations applied
supabase db remote commit

# Expected output:
# ✓ 20251023_demo_leads.sql applied
```

---

## 2️⃣ Deploy Edge Functions

**You have a single omnibus function: `make-server`**

```bash
# Deploy the main function
supabase functions deploy make-server

# Verify deployment
supabase functions list

# Expected output:
# ┌────────────┬──────────┬─────────────┐
# │ Name       │ Version  │ Status      │
# ├────────────┼──────────┼─────────────┤
# │ make-server│ 1        │ ACTIVE      │
# └────────────┴──────────┴─────────────┘
```

**Smoke test:**
```bash
# Test health endpoint
curl -s https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/health

# Expected: {"status":"ok","timestamp":"..."}
```

---

## 3️⃣ Add DemoLeadsPanel to Admin Navigation

### Update AppRouter to include Demo Leads route

**File: `/components/app/pages/DemoLeadsPage.tsx`** (NEW)

```tsx
import React from 'react';
import { DemoLeadsPanel } from '../../admin/DemoLeadsPanel';

export function DemoLeadsPage() {
  return (
    <div className="p-6">
      <DemoLeadsPanel />
    </div>
  );
}
```

**File: `/components/app/AppRouter.tsx`** (UPDATE)

Add to imports:
```tsx
import { DemoLeadsPage } from './pages/DemoLeadsPage';
```

Add to navigation items (around line 50-60):
```tsx
// In the navigation links array
{
  name: 'Demo Leads',
  icon: Users,
  page: 'demo-leads',
  requiresSuperAdmin: true, // Only super admins can see
}
```

Add to switch statement (around line 200):
```tsx
case 'demo-leads':
  return user?.role === 'super_admin' ? (
    <DemoLeadsPage />
  ) : (
    <div className="p-6 text-center">
      <p className="text-text-400">Access denied. Super admin only.</p>
    </div>
  );
```

---

## 4️⃣ Test End-to-End

### A. Database + Functions Online

```bash
# Check function logs
supabase functions logs make-server --follow

# In another terminal, trigger a test request
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  --data '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "source": "manual_test"
  }'

# Expected response:
# {"success":true,"message":"Thank you! We'll reach out within 24 hours.","lead_id":"..."}
```

### B. Frontend Environment

```bash
# From app root
npm run dev

# Verify environment variables loaded
# Open browser console, type:
# console.log(import.meta.env.VITE_SUPABASE_URL)
# Should show your Supabase URL
```

### C. UI Smoke Test

1. **Login as super admin** → Navigate to `/admin`
2. Click **"Demo Leads"** in sidebar
3. Should see DemoLeadsPanel with table
4. Click **"Export CSV"** → File downloads
5. Check data matches database

### D. Full Journey Demo Test

1. Go to homepage (not logged in)
2. Click **"Start the Live Demo"**
3. Should see full-page demo (6 steps)
4. Click through all 6 steps
5. At Step 6, click **"See It On Your Devices"**
6. Fill lead form and submit
7. Check:
   - Auto-reply email received (check inbox)
   - Sales notification email received
   - Slack notification (if configured)
   - Lead appears in admin panel

### E. Email Notifications Test

```bash
# Check function logs for email sending
supabase functions logs make-server | grep "Email sent"

# Expected:
# ✅ Email sent successfully: msg_xxxxx
# ✅ Slack notification sent successfully
```

---

## 5️⃣ Production Deployment

### Build Vite App

```bash
# From project root
npm run build

# Verify build output
ls -lh dist/

# Expected: dist/ directory with index.html, assets/, etc.
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Deploy to production
vercel --prod

# Follow prompts:
# - Link to existing project? Yes (if you have one)
# - Build command: npm run build
# - Output directory: dist
```

### Set Vercel Environment Variables

In Vercel dashboard:
1. Go to **Project Settings → Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your_anon_key`
3. **Redeploy** for changes to take effect

---

## 6️⃣ Production Recommendations

### Security
- ✅ **TLS/HTTPS** enabled (Vercel handles this)
- ✅ **Row Level Security** on demo_leads table (already configured)
- ✅ **API rate limiting** (Supabase handles this)
- ⚠️ **Rotate secrets** quarterly (add to calendar)

### Monitoring
```bash
# Set up log monitoring
supabase functions logs make-server --tail

# Watch for errors
supabase functions logs make-server | grep "ERROR"
```

### Performance
- ✅ **CDN** enabled (Vercel)
- ✅ **Function cold starts** < 1s (Supabase Edge Functions)
- ✅ **Database connection pooling** (Supabase handles)

---

## 7️⃣ Common Issues → Quick Fixes

### Issue: "Function not found"
**Cause:** Function name mismatch  
**Fix:**
```bash
# Verify function name
supabase functions list

# Redeploy
supabase functions deploy make-server
```

### Issue: "CORS error"
**Cause:** Missing CORS headers  
**Fix:** In `/supabase/functions/make-server/index.ts`:
```typescript
import { cors } from 'npm:hono/cors';

app.use('*', cors({
  origin: ['https://buboiq.com', 'http://localhost:5173'],
  credentials: true,
}));
```

### Issue: "Emails not sending"
**Cause:** RESEND_API_KEY not set  
**Fix:**
```bash
supabase secrets set RESEND_API_KEY=re_your_key
supabase functions deploy make-server  # Restart function
```

### Issue: "Lead not appearing in admin panel"
**Cause:** RLS policy blocking access  
**Fix:**
```sql
-- Verify RLS policy
SELECT * FROM demo_leads WHERE email = 'test@example.com';

-- If empty, check RLS:
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'demo_leads';
```

---

## 8️⃣ Health Check Endpoint

Add to your app (optional but recommended):

**File: `/components/app/pages/HealthPage.tsx`**
```tsx
import React, { useEffect, useState } from 'react';

export function HealthPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health`)
      .then(r => r.json())
      .then(setStatus);
  }, []);

  return (
    <div className="p-6">
      <h1>System Health</h1>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
```

**Add route:** In `AppRouter.tsx`, add:
```tsx
case 'health':
  return <HealthPage />;
```

**Access:** `https://buboiq.com/app/health` (for super admins)

---

## ✅ Deployment Checklist

- [ ] Migrations applied (`supabase db push`)
- [ ] Functions deployed (`supabase functions deploy make-server`)
- [ ] Secrets set (RESEND_API_KEY, SALES_EMAIL, etc.)
- [ ] Vite app built (`npm run build`)
- [ ] Deployed to Vercel (`vercel --prod`)
- [ ] Environment variables set in Vercel
- [ ] Full journey demo tested (6 steps)
- [ ] Lead capture form tested
- [ ] Email notifications received
- [ ] Admin panel accessible
- [ ] CSV export working
- [ ] Function logs monitored
- [ ] Health endpoint responding

---

## 🎯 Quick Verification Script

**File: `verify-deployment.sh`**
```bash
#!/bin/bash

echo "🔍 Verifying BuboIQ Phase 5 Deployment..."

# 1. Check function
echo "1️⃣ Testing function health..."
curl -s https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/health | grep "ok" && echo "✅ Function OK" || echo "❌ Function FAILED"

# 2. Check database
echo "2️⃣ Checking database..."
supabase db remote status && echo "✅ Database OK" || echo "❌ Database FAILED"

# 3. Test lead submission
echo "3️⃣ Testing lead submission..."
RESPONSE=$(curl -s -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  --data '{"name":"Test","email":"test@example.com","company":"Test Co"}')
echo $RESPONSE | grep "success" && echo "✅ Lead submission OK" || echo "❌ Lead submission FAILED"

# 4. Check frontend
echo "4️⃣ Checking frontend..."
curl -s https://buboiq.com | grep "BuboIQ" && echo "✅ Frontend OK" || echo "❌ Frontend FAILED"

echo ""
echo "🎉 Deployment verification complete!"
```

**Usage:**
```bash
chmod +x verify-deployment.sh
./verify-deployment.sh
```

---

## 📊 Post-Deployment Monitoring

### Week 1 Checklist
- [ ] Monitor function logs daily
- [ ] Check lead capture rate
- [ ] Verify email delivery (Resend dashboard)
- [ ] Review Slack notifications
- [ ] Check admin panel performance

### Analytics to Track
- Demo starts (GA event: `full_journey_demo_started`)
- Demo completions (Step 6 reached)
- Lead captures (form submissions)
- Lead quality distribution (hot/warm/cold)
- Email open rates (Resend dashboard)
- CSV exports by admin users

---

**Status**: ✅ **READY TO DEPLOY**

🚀 **Next Step:** Run the deployment commands and verify with checklist!
