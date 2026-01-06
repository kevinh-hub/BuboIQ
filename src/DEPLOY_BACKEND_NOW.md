# 🚀 DEPLOY BACKEND TO SUPABASE - STEP BY STEP

## ❌ Current Error: "Failed to fetch"

**Root Cause:** The backend code exists locally but is NOT deployed to Supabase Edge Functions yet.

---

## ✅ SOLUTION: Deploy in 5 Minutes

### **OPTION 1: Supabase CLI (FASTEST - Recommended)**

#### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

#### Step 2: Login to Supabase
```bash
supabase login
```
This will open your browser to authenticate.

#### Step 3: Link to Your Project
```bash
cd /path/to/your/buboiq/project
supabase link --project-ref xwcgpmqgqysxeovbrbxg
```

#### Step 4: Deploy the Function
```bash
supabase functions deploy make-server-55e8c5b2
```

This will deploy ALL files in `/supabase/functions/make-server-55e8c5b2/` automatically.

#### Step 5: Set Environment Variables
```bash
# Required for the backend to work
supabase secrets set SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co

# Get your Service Role Key from: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/settings/api
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional (for email features)
supabase secrets set RESEND_API_KEY=<your-resend-key>
```

#### Step 6: Test the Deployment
```bash
# Test health endpoint
curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health

# Expected: {"status":"ok","timestamp":"..."}
```

✅ **DONE! Now try logging in again.**

---

### **OPTION 2: Supabase Dashboard (Manual)**

#### Step 1: Go to Edge Functions
1. Open: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg
2. Click **"Edge Functions"** in the left sidebar
3. Click **"Deploy new function"**

#### Step 2: Create the Function
- **Function name:** `make-server-55e8c5b2`
- **Copy/paste the code from:** `/supabase/functions/make-server-55e8c5b2/index.ts`

#### Step 3: Add Supporting Files
You need to add ALL these files to the function:

**Core Files:**
- `index.ts` (main entry point)
- `kv_store.ts` (database utilities)
- `constants.ts` (demo accounts)
- `auth.ts` (authentication logic)

**Route Files:**
- `super-admin-routes.ts` (Super Admin API)
- `early-access.ts` (Early Access System)
- `demo-leads.ts` (Demo Leads System)
- `guided-fixes.ts` (Guided Fixes System)
- `lead-export.ts` (Lead Export)

**Import map for dependencies:**
Create a `deno.json` file:
```json
{
  "imports": {
    "hono": "https://deno.land/x/hono@v4.0.0/mod.ts",
    "hono/cors": "https://deno.land/x/hono@v4.0.0/middleware.ts",
    "hono/logger": "https://deno.land/x/hono@v4.0.0/middleware.ts"
  }
}
```

#### Step 4: Set Environment Variables
1. Go to **Settings → Edge Functions → Secrets**
2. Add these secrets:
   - `SUPABASE_URL` = `https://xwcgpmqgqysxeovbrbxg.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = Get from **Settings → API → service_role key**
   - `SUPABASE_ANON_KEY` = Get from **Settings → API → anon public key**
   - `RESEND_API_KEY` = (Optional, for emails)

#### Step 5: Deploy
Click **"Deploy function"**

---

## 🔍 HOW TO GET YOUR SERVICE ROLE KEY

1. Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/settings/api
2. Scroll to **"Project API keys"**
3. Copy the **`service_role` key** (secret)
4. ⚠️ **DO NOT share this key publicly!**

---

## ✅ VERIFY DEPLOYMENT WORKED

### Test 1: Health Check
```bash
curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
```

**✅ Expected:**
```json
{"status":"ok","timestamp":"2024-11-21T..."}
```

**❌ If you get 404:** Function not deployed yet

### Test 2: Login Endpoint
```bash
curl -X POST https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}'
```

**✅ Expected:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "email": "kevinh@buboiq.com",
    "name": "Kevin H",
    "role": "super_admin"
  }
}
```

---

## 🎯 WHAT HAPPENS WHEN YOU LOGIN

The backend has **auto-creation logic** for Kevin's super admin account:

1. You enter: `kevinh@buboiq.com` / `TestAccount123!`
2. Backend checks if account exists in Supabase Auth
3. **If NOT exists:** Backend automatically creates the account with `super_admin` role
4. Backend signs you in
5. Returns JWT token + user object
6. Frontend stores token in `localStorage.buboiq_session`
7. Redirects to Super Admin Dashboard

**This is all in the code at line 91-156 of `/supabase/functions/make-server-55e8c5b2/auth.ts`**

---

## 📋 TROUBLESHOOTING

### Problem: "Function not found"
**Solution:** Function not deployed yet. Use CLI or dashboard to deploy.

### Problem: "Internal Server Error"
**Solution:** Environment variables not set. Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Supabase secrets.

### Problem: "Invalid API key"
**Solution:** Wrong anon key in `/utils/supabase/info.tsx`. Should be:
```typescript
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k"
```

### Problem: Still getting "Failed to fetch"
**Check:**
1. Is the function deployed? (Check dashboard)
2. Are environment variables set?
3. Try the health check curl command above
4. Check browser console for exact error

---

## 🔗 USEFUL LINKS

| Resource | URL |
|----------|-----|
| **Supabase Project** | https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg |
| **Edge Functions** | https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/functions |
| **API Settings** | https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/settings/api |
| **Function Logs** | https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/logs/edge-functions |

---

## 🎉 AFTER DEPLOYMENT

Once deployed, you can:

1. ✅ Login at `/super-admin` with `kevinh@buboiq.com` / `TestAccount123!`
2. ✅ View dashboard stats
3. ✅ Manage organizations
4. ✅ Manage users
5. ✅ Impersonate users
6. ✅ Access all Super Admin features

---

## 📝 QUICK COMMAND SUMMARY

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref xwcgpmqgqysxeovbrbxg

# Deploy function
supabase functions deploy make-server-55e8c5b2

# Set secrets
supabase secrets set SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key_here

# Test
curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
```

---

**That's it! Deploy and you're done! 🚀**
