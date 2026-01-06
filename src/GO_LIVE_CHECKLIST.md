# 🎯 Surgical Go-Live Checklist - Phase 5

## ⏱️ Go / No-Go (2 minutes)

### ✅ Secrets Verification
```bash
# Check all required secrets are set
supabase secrets list

# Must show:
# - RESEND_API_KEY (email notifications)
# - SALES_EMAIL (lead notifications destination)
# - FRONTEND_URL (for email links)
# - SLACK_WEBHOOK_URL (optional, for hot lead alerts)
# - SUPABASE_URL (already set)
# - SUPABASE_SERVICE_ROLE_KEY (already set)
# - SUPABASE_ANON_KEY (already set)
```

**Decision:** 
- ✅ **GO** if RESEND_API_KEY, SALES_EMAIL, FRONTEND_URL are set
- ❌ **NO-GO** if any required secret missing

### ✅ CORS Configuration
```bash
# Verify CORS allows marketing origin
# Check supabase/functions/make-server/index.ts

# Should include:
# origin: ['https://buboiq.com', 'http://localhost:5173']
```

**Decision:**
- ✅ **GO** if production domain is in allowed origins
- ❌ **NO-GO** if CORS will block requests

### ✅ HTTPS Enforcement
```bash
# Verify production URL uses HTTPS
echo $FRONTEND_URL | grep -q "https://" && echo "✅ HTTPS" || echo "❌ HTTP"

# Expected: ✅ HTTPS
```

**Decision:**
- ✅ **GO** if HTTPS
- ❌ **NO-GO** if HTTP only

### ✅ DNS Verification
```bash
# Check DNS points to correct environment
dig buboiq.com +short

# Should return your hosting provider's IP/CNAME
# Vercel: 76.76.21.21 or cname.vercel-dns.com
```

**Decision:**
- ✅ **GO** if DNS resolves correctly
- ❌ **NO-GO** if DNS not configured

---

## 🚀 Deploy

```bash
# Make executable
chmod +x DEPLOY_PHASE_5_NOW.sh

# Run deployment with pre-flight checks
./DEPLOY_PHASE_5_NOW.sh
```

**Expected duration:** 5-10 minutes

**What it does:**
1. ✅ Checks prerequisites (CLI tools, login)
2. ✅ Verifies environment (.env file)
3. ✅ Confirms secrets (prompts if missing)
4. ✅ Runs database migration (demo_leads table)
5. ✅ Deploys Edge Functions (make-server)
6. ✅ Installs dependencies (npm install)
7. ✅ Builds app (npm run build)
8. ✅ Tests function endpoint
9. ✅ Deploys to production (Vercel/manual)

---

## ✅ Immediate Verify (3 Commands)

### 1. App/Functions Health
```bash
# Test health endpoint
curl -sf https://buboiq.com/api/health && echo "✅ OK" || echo "❌ FAIL"

# Or test function directly:
curl -sf https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/health && echo "✅ OK" || echo "❌ FAIL"
```

**Expected:**
```json
{"status":"ok","timestamp":"2025-10-22T15:30:00.000Z","services":{"database":"ok","email":"ok"}}
```

**Decision:**
- ✅ **PASS** if returns 200 OK with status:"ok"
- ❌ **FAIL** if 404, 500, or error

### 2. Demo Start (Ephemeral Org + JWT)
```bash
# Test demo initialization
curl -sf -X POST https://buboiq.com/api/demo/start \
  -H "Content-Type: application/json" \
  && echo "✅ OK" || echo "❌ FAIL"
```

**Expected:**
```json
{
  "success": true,
  "org_id": "demo_xxxxx",
  "token": "eyJ...",
  "expires_at": "2025-10-22T16:30:00.000Z"
}
```

**Decision:**
- ✅ **PASS** if returns demo org + token
- ❌ **FAIL** if error or missing fields

### 3. Email Path (Resend)
```bash
# Trigger test lead submission (uses RESEND_API_KEY)
curl -sf -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"name":"Deploy Test","email":"test@buboiq.com","company":"BuboIQ","source":"go_live_test"}' \
  && echo "✅ OK" || echo "❌ FAIL"
```

**Expected:**
```json
{
  "success": true,
  "message": "Thank you! We'll reach out within 24 hours.",
  "lead_id": "xxxxx"
}
```

**Then check:**
- Email received at test@buboiq.com (auto-reply)
- Email received at sales@buboiq.com (notification)
- Function logs show: `✅ Email sent successfully: msg_xxxxx`

**Decision:**
- ✅ **PASS** if emails arrive within 2 minutes
- ⚠️ **WARN** if lead captured but emails delayed
- ❌ **FAIL** if lead submission fails

---

## 🧪 5-Minute Smoke Test (Production URL)

### Step 1: Home → Start Demo
```
1. Go to https://buboiq.com (incognito/logged out)
2. Click "Start the Live Demo" button
3. Full-page demo opens
```

**Verify:**
- ✅ Demo loads in <2 seconds
- ✅ Background darkens (overlay)
- ✅ Close button (X) visible
- ❌ **FAIL** if demo doesn't load

### Step 2: Approve Action at Step 3
```
1. Auto-advance through Steps 1-2 (7 seconds total)
2. At Step 3 (Recommended Actions), click "Approve" on any action
3. See toast: "Action approved"
```

**Verify:**
- ✅ Toast appears
- ✅ Action card shows "Approved" state
- ✅ Step auto-advances to Step 4 after 5s
- ❌ **FAIL** if no toast or hangs

### Step 3: Step 4 Progress States
```
1. Watch Step 4 (Execution) progress
2. Should see: "Queued" → "Running" → "Succeeded"
3. Duration: ~4 seconds total
```

**Verify:**
- ✅ All 3 states show in sequence
- ✅ Progress bar animates smoothly
- ✅ Auto-advances to Step 5
- ❌ **FAIL** if stuck in "Queued"

### Step 4: Step 5 KB Article (6s duration)
```
1. At Step 5, full KB article displays
2. Shows: Title, Issue, Root Cause, Solution, Prevention
3. "Copy Article" button functional
4. Auto-advances after 6 seconds
```

**Verify:**
- ✅ Full article text visible (not truncated)
- ✅ Copy button works (copies to clipboard)
- ✅ Duration is LONGEST (6s vs 3-5s for others)
- ✅ Auto-advances to Step 6
- ❌ **FAIL** if article missing or truncated

### Step 5: Submit Lead Form
```
1. At Step 6, click "See It On Your Devices"
2. Lead form modal opens
3. Fill: Name, Email, Company
4. Click "Submit"
5. Success message appears
6. Demo auto-closes after 2s
```

**Verify:**
- ✅ Form validates (required fields)
- ✅ Submit button shows loading state
- ✅ Success message: "Thanks—check your inbox!"
- ✅ Demo closes and returns to homepage
- ❌ **FAIL** if submission fails

### Step 6: Admin Panel Check
```
1. Login as super admin
2. Navigate to "Demo Leads" in sidebar
3. Find your test lead
4. Verify score, quality, engagement data
5. Click "Export CSV"
```

**Verify:**
- ✅ Lead appears in table within 10 seconds
- ✅ Lead score calculated (should be ~85-90 for full demo)
- ✅ Quality badge shows "HOT" (if score ≥80)
- ✅ CSV downloads with lead data
- ❌ **FAIL** if lead not in admin panel

---

## 📊 KPIs to Watch (First 30 Minutes)

### Funnel Metrics
Track in Google Analytics (Events):

```javascript
// Expected event flow:
1. full_journey_demo_started
2. demo_step_completed (step: 1)
3. demo_step_completed (step: 2)
4. demo_step_completed (step: 3)
5. demo_step_completed (step: 4)
6. demo_step_completed (step: 5) // KB shown
7. demo_step_completed (step: 6)
8. lead_captured
```

### Target Completion Rates (Day 1)
```
demo_started → step_3 (first_trace): >70%
demo_started → step_5 (KB shown): >55%
demo_started → lead_submitted: 5-15%
```

### Expected Behavior
```
100 visitors start demo
→ 70+ reach Step 3 (approve actions)
→ 55+ reach Step 5 (see KB article)
→ 5-15 submit lead form
```

### Red Flags (Act Immediately)
```
❌ <50% reach Step 3 → Check Step 2 loading
❌ <30% reach Step 5 → Check Step 4 execution
❌ <2% submit leads → Check form validation
❌ Emails not arriving → Check RESEND_API_KEY
```

---

## 🛡️ Guardrails (Verify Behavior)

### 1. Rate Limit Hit
```bash
# Trigger 12+ approvals in 1 minute (script below)
for i in {1..15}; do
  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo/approve \
    -H "Content-Type: application/json" \
    -d '{"action_id":"test_'$i'"}' &
done
wait
```

**Expected:**
- ✅ Toast shows: "Execution rate limit reached."
- ✅ No executor blow-ups (function doesn't crash)
- ✅ Subsequent requests queue properly

**Decision:**
- ✅ **PASS** if graceful degradation
- ❌ **FAIL** if function crashes

### 2. Observe-Only Mode (Error Fallback)
```bash
# Trigger unexpected error (simulate with invalid data)
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo/force-error \
  -H "Content-Type: application/json" \
  -d '{"trigger":"error"}'
```

**Expected:**
- ✅ Banner appears: "System in Observe-Only mode"
- ✅ Approve buttons disabled
- ✅ Error logged but demo continues
- ✅ Auto-recovery after error clears

**Decision:**
- ✅ **PASS** if system degrades gracefully
- ❌ **FAIL** if demo breaks completely

### 3. Demo Org TTL Cleanup
```bash
# Check demo orgs are cleaned up (≤60 min TTL)
# Query database for demo orgs older than 60 min

supabase db remote exec <<SQL
SELECT 
  id, 
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as age_minutes
FROM organizations 
WHERE id LIKE 'demo_%' 
  AND EXTRACT(EPOCH FROM (NOW() - created_at))/60 > 60;
SQL
```

**Expected:**
- ✅ No demo orgs older than 60 minutes
- ✅ Cleanup cron job running every 15 min

**Decision:**
- ✅ **PASS** if cleanup working
- ⚠️ **WARN** if some old orgs (but <5)
- ❌ **FAIL** if many old orgs (>10)

---

## 🔄 Rollback (One Move)

### If Error Rate Spikes or Leads Freeze

**Blue/Green Rollback:**
```bash
# Vercel rollback to previous deployment
vercel rollback

# Or if using custom hosting:
# 1. Point load balancer to previous revision
# 2. Or redeploy previous Git commit
git checkout <previous-commit>
./DEPLOY_PHASE_5_NOW.sh
```

**Function Rollback:**
```bash
# Redeploy previous function version
git checkout <previous-commit> supabase/functions/make-server/
supabase functions deploy make-server
```

**Database Rollback:**
```sql
-- Demo leads table is additive (no breaking changes)
-- No rollback needed for database
-- If absolutely necessary:
DROP TABLE IF EXISTS demo_leads CASCADE;
DROP VIEW IF EXISTS demo_leads_analytics;
```

**Expected Rollback Time:** <5 minutes

---

## 🔍 Diagnostic Commands

### Check Function Logs
```bash
# Live tail
supabase functions logs make-server --follow

# Filter for errors
supabase functions logs make-server | grep ERROR

# Filter for demo events
supabase functions logs make-server | grep "Demo lead captured"
```

**Look for:**
```
✅ Demo lead captured: test@example.com
✅ Lead score calculated: 88 (HOT)
✅ Email sent successfully: msg_xxxxx
✅ Slack notification sent successfully

❌ Error sending email: <error_message>
❌ Database connection failed
❌ RESEND_API_KEY not set
```

### Check Database
```bash
# Open SQL editor
supabase db remote exec <<SQL
-- Check recent leads
SELECT 
  email, 
  company, 
  score, 
  quality, 
  created_at 
FROM demo_leads 
ORDER BY created_at DESC 
LIMIT 10;

-- Check analytics
SELECT * FROM demo_leads_analytics;
SQL
```

### Check Email Delivery (Resend Dashboard)
```
1. Go to https://resend.com/emails
2. Check recent sends
3. Look for:
   - Delivered status
   - Opened (if user checked email)
   - Bounced/Failed (red flags)
```

---

## 📝 Error Response Template

**If step fails during verification:**

### Format:
```
Step: [Step number/name]
Error: [Exact error string from logs/console]
Expected: [What should have happened]
Actual: [What actually happened]
Request ID: [From function logs]
Timestamp: [When it occurred]
```

### Example:
```
Step: 3 - Email Path
Error: "Resend API error: Invalid API key"
Expected: Auto-reply email sent to test@buboiq.com
Actual: 401 Unauthorized response
Request ID: req_abc123
Timestamp: 2025-10-22T15:35:12.000Z
```

**Response:**
```bash
# Fix: Set correct Resend API key
supabase secrets set RESEND_API_KEY=re_correct_key_here

# Redeploy function to pick up new secret
supabase functions deploy make-server

# Retry test
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"name":"Retry Test","email":"test@buboiq.com","company":"BuboIQ"}'
```

---

## ✅ Go-Live Decision Matrix

| Check | Status | Action |
|-------|--------|--------|
| Secrets set | ✅ Pass | Proceed |
| CORS configured | ✅ Pass | Proceed |
| HTTPS enforced | ✅ Pass | Proceed |
| DNS resolves | ✅ Pass | Proceed |
| Health endpoint | ✅ Pass | Proceed |
| Demo start API | ✅ Pass | Proceed |
| Email path | ✅ Pass | Proceed |
| 5-min smoke | ✅ Pass | **GO LIVE** |
| Any critical fail | ❌ Fail | **NO-GO** - Fix & retry |

---

## 🎯 Success Criteria

Deployment is **SUCCESSFUL** when:

✅ **Health checks pass** (all 3 commands return 200 OK)  
✅ **Smoke test complete** (all 6 steps pass)  
✅ **Guardrails verified** (rate limit, error handling, cleanup)  
✅ **First real lead captured** (from actual visitor)  
✅ **Emails arrive** (auto-reply + sales notification)  
✅ **Admin panel works** (lead visible, CSV exports)  
✅ **Function logs clean** (no errors in first 30 min)  

---

## 📞 Escalation Path

If critical issues arise:

### P0 - Demo Not Loading
**Impact:** No visitors can see demo  
**Fix Time:** <5 minutes  
**Action:** Rollback immediately

### P1 - Emails Not Sending
**Impact:** Leads captured but no follow-up  
**Fix Time:** <15 minutes  
**Action:** Fix RESEND_API_KEY, leads in DB are safe

### P2 - Admin Panel Slow
**Impact:** Internal only, visitors unaffected  
**Fix Time:** <1 hour  
**Action:** Monitor, optimize queries later

### P3 - CSV Export Issues
**Impact:** Minor inconvenience  
**Fix Time:** <24 hours  
**Action:** Can export via SQL in meantime

---

## 🚀 Final Checklist

Before declaring "LIVE":

- [ ] All Go/No-Go checks PASS
- [ ] Deployment script completed successfully
- [ ] All 3 immediate verify commands PASS
- [ ] 5-minute smoke test PASS (all 6 steps)
- [ ] First test lead in admin panel
- [ ] Auto-reply email received
- [ ] Sales notification email received
- [ ] Function logs show no errors
- [ ] Guardrails tested (rate limit, error handling)
- [ ] Demo org cleanup verified
- [ ] KPI tracking configured (Google Analytics)
- [ ] Rollback plan understood
- [ ] Team notified of go-live

**Status:** ⬜ NOT LIVE | ✅ **LIVE AND CAPTURING LEADS**

---

Last updated: October 22, 2025  
Phase: 5 - Full-Journey Demo Experience  
Readiness: ✅ READY FOR SURGICAL DEPLOYMENT
