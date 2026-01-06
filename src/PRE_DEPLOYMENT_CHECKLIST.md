# ✅ Pre-Deployment Checklist - Phase 5

## Before Running Deployment Script

### 1. Supabase Setup ✓
- [ ] Logged into Supabase CLI (`supabase login`)
- [ ] Project linked (`supabase link --project-ref YOUR_REF`)
- [ ] Can access project (`supabase projects list`)

### 2. Environment Variables ✓
- [ ] `.env` file exists in project root
- [ ] Contains `VITE_SUPABASE_URL`
- [ ] Contains `VITE_SUPABASE_ANON_KEY`

### 3. Supabase Secrets (Required for Email) ✓
Get these ready before deployment:

**RESEND_API_KEY** (Required for email notifications)
- Sign up: https://resend.com/signup
- Free tier: 100 emails/day, 3,000/month
- Get API key: https://resend.com/api-keys
- Format: `re_xxxxxxxxxxxxxxxxxx`

**SALES_EMAIL** (Where to send lead notifications)
- Your sales team email
- Example: `sales@buboiq.com`

**FRONTEND_URL** (For email links)
- Your production URL
- Example: `https://buboiq.com`

**SLACK_WEBHOOK_URL** (Optional - for Slack notifications)
- Go to: https://api.slack.com/messaging/webhooks
- Create incoming webhook
- Format: `https://hooks.slack.com/services/...`

### 4. Code Verification ✓
Check these files exist and are up to date:

- [ ] `/components/demo/FullJourneyDemo.tsx` (main demo component)
- [ ] `/components/admin/DemoLeadsPanel.tsx` (admin panel)
- [ ] `/components/app/pages/DemoLeadsAdminPage.tsx` (admin page)
- [ ] `/supabase/functions/make-server/demo-leads.ts` (API endpoint)
- [ ] `/supabase/functions/make-server/notifications.ts` (email system)
- [ ] `/supabase/functions/make-server/lead-export.ts` (CSV export)
- [ ] `/supabase/migrations/20251023_demo_leads.sql` (database migration)

### 5. Git Status ✓
- [ ] All changes committed
- [ ] Pushed to remote repository (if using Git deployment)

---

## Quick Setup Commands

If you haven't set up Supabase secrets yet:

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_your_key_here

# Set sales email
supabase secrets set SALES_EMAIL=sales@buboiq.com

# Set frontend URL
supabase secrets set FRONTEND_URL=https://buboiq.com

# Set Slack webhook (optional)
supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Deployment Command

Once checklist is complete:

```bash
# Make script executable
chmod +x DEPLOY_PHASE_5_NOW.sh

# Run deployment
./DEPLOY_PHASE_5_NOW.sh
```

---

## What Happens During Deployment

1. **Prerequisites Check** - Verifies CLI tools installed
2. **Environment Setup** - Checks .env file exists
3. **Secrets Verification** - Confirms required secrets are set
4. **Database Migration** - Creates demo_leads table
5. **Function Deployment** - Deploys make-server function
6. **Dependencies Install** - Runs npm install
7. **Build** - Runs npm run build
8. **Health Check** - Tests function endpoint
9. **Production Deploy** - Deploys to Vercel (or manual)

**Total Time:** ~5-10 minutes

---

## After Deployment

### Immediate Tests

1. **Test Full-Journey Demo**
   ```
   → Go to your site (incognito/logged out)
   → Click "Start the Live Demo" button
   → Walk through all 6 steps
   → Submit lead form at the end
   ```

2. **Check Emails**
   ```
   → Check inbox for auto-reply email
   → Check sales email for lead notification
   → If hot lead (high engagement), verify urgent template
   ```

3. **Verify Admin Panel**
   ```
   → Login as super admin
   → Navigate to "Demo Leads" in sidebar
   → Verify lead appears in table
   → Check lead score and quality
   → Click "Export CSV" and verify download
   ```

4. **Monitor Function Logs**
   ```bash
   supabase functions logs make-server --follow
   
   # Look for:
   # ✅ Demo lead captured: test@example.com
   # ✅ Email sent successfully: msg_xxxxx
   # ✅ Slack notification sent successfully
   ```

### Success Criteria

✅ **Demo works** - All 6 steps visible and navigable  
✅ **KB Article shows** - Step 5 displays full article  
✅ **Lead captured** - Form submission succeeds  
✅ **Emails arrive** - Auto-reply + sales notification  
✅ **Admin access** - Lead visible in admin panel  
✅ **CSV exports** - File downloads with lead data  
✅ **No errors** - Function logs are clean  

---

## Rollback Plan (If Needed)

If something goes wrong:

### 1. Rollback Database Migration
```bash
# This won't delete data, just the table structure
supabase db reset
```

### 2. Rollback Function Deployment
```bash
# Deploy previous version
git checkout <previous-commit>
supabase functions deploy make-server
```

### 3. Rollback Frontend
```bash
# Revert to previous Vercel deployment
vercel rollback
```

---

## Common Pre-Deployment Issues

### Issue: "supabase: command not found"
**Fix:**
```bash
# macOS
brew install supabase/tap/supabase

# Other platforms
npm install -g supabase
```

### Issue: "Not logged into Supabase"
**Fix:**
```bash
supabase login
# Follow browser prompt
```

### Issue: "Project not linked"
**Fix:**
```bash
# Get your project ref from: https://supabase.com/dashboard/project/_/settings/general
supabase link --project-ref YOUR_PROJECT_REF
```

### Issue: "Missing .env file"
**Fix:**
```bash
# Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF

# Update with real values
nano .env
```

### Issue: "RESEND_API_KEY not set"
**Fix:**
```bash
# Sign up for free: https://resend.com/signup
# Get API key: https://resend.com/api-keys
supabase secrets set RESEND_API_KEY=re_your_key
```

---

## Ready to Deploy?

✅ **Checklist complete**  
✅ **Secrets configured**  
✅ **Environment set up**  
✅ **Rollback plan understood**  

**RUN:**
```bash
./DEPLOY_PHASE_5_NOW.sh
```

**Expected output:**
```
════════════════════════════════════════════════════════════════
🚀 BuboIQ Phase 5 - Full-Journey Demo Deployment
════════════════════════════════════════════════════════════════

Step 0: Checking prerequisites...
✅ Supabase CLI found
✅ npm found
✅ Logged into Supabase
✅ Project linked
✅ All prerequisites met!

Step 1: Setting up environment...
✅ Environment file exists

Step 2: Checking Supabase secrets...
✅ RESEND_API_KEY set
✅ SALES_EMAIL set
✅ FRONTEND_URL set

Step 3: Running database migration...
✅ Migration applied successfully

Step 4: Deploying Edge Functions...
✅ Function deployed successfully

Step 5: Installing npm dependencies...
✅ Dependencies installed

Step 6: Building application...
✅ Build successful

Step 7: Testing function endpoint...
✅ Function endpoint responding (HTTP 200)

Step 8: Deploy to production?
Choose deployment method:
  1) Vercel (recommended)
  2) Manual upload
  3) Skip deployment (just build)

════════════════════════════════════════════════════════════════
✅ Phase 5 Deployment Complete!
════════════════════════════════════════════════════════════════
```

---

## Support & Troubleshooting

If you encounter issues:

1. **Check function logs:**
   ```bash
   supabase functions logs make-server --tail
   ```

2. **Verify database:**
   ```bash
   # Check table exists
   supabase db remote status
   ```

3. **Test endpoint manually:**
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/health
   ```

4. **Review documentation:**
   - `PHASE_5_COMPLETE.md` - Full technical docs
   - `PHASE_5_DEPLOY_PLAYBOOK.md` - Detailed guide
   - `READY_TO_DEPLOY.md` - Quick reference

---

**Status:** ✅ **READY TO DEPLOY**

Last updated: October 22, 2025
