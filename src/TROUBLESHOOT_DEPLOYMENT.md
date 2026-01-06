# 🔧 TROUBLESHOOT: "Failed to fetch" After Deployment

## 🧪 Step 1: Test the Backend Directly

I created a test page for you. Open this file in your browser:
```
/test-backend.html
```

This will test:
1. Health endpoint connectivity
2. CORS configuration
3. Login endpoint
4. Show you exact error messages

---

## 🔍 Step 2: Check Function Status

### A) Check if function exists in Supabase:

1. Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/functions
2. Look for a function named: `make-server-55e8c5b2`
3. Check its status (should be "Active" with green dot)

**❌ If function is NOT listed:**
- Deployment failed
- Re-run: `supabase functions deploy make-server-55e8c5b2`

**✅ If function IS listed but not active:**
- Click on the function
- Check the logs for errors

---

## 🔍 Step 3: Check Environment Variables

### A) Via Supabase CLI:
```bash
supabase secrets list --project-ref xwcgpmqgqysxeovbrbxg
```

### B) Via Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/settings/functions
2. Click "Secrets" tab
3. Verify these exist:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

**❌ If missing, set them:**
```bash
supabase secrets set SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co --project-ref xwcgpmqgqysxeovbrbxg

# Get your service role key from:
# https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/settings/api
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> --project-ref xwcgpmqgqysxeovbrbxg
```

---

## 🔍 Step 4: Check Function Logs

### Via Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/logs/edge-functions
2. Select `make-server-55e8c5b2` from dropdown
3. Look for errors (red lines)

### Via CLI:
```bash
supabase functions logs make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg
```

**Common errors in logs:**

| Error | Cause | Fix |
|-------|-------|-----|
| `SUPABASE_URL is not defined` | Env var not set | Run `supabase secrets set SUPABASE_URL=...` |
| `SUPABASE_SERVICE_ROLE_KEY is not defined` | Env var not set | Run `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...` |
| `Cannot read property '...' of undefined` | Import error | Check all files deployed correctly |
| `Module not found` | Missing file | Re-deploy function |

---

## 🔍 Step 5: Test with curl (Bypasses Browser CORS)

### Test 1: Health Check
```bash
curl -v https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
```

**✅ Expected (Success):**
```
< HTTP/2 200
< content-type: application/json
{"status":"ok","timestamp":"..."}
```

**❌ If you get 404:**
```
< HTTP/2 404
```
**Cause:** Function not deployed or wrong path

**Fix:**
```bash
# Re-deploy
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg
```

**❌ If you get 500:**
```
< HTTP/2 500
```
**Cause:** Function is crashing (likely missing env vars)

**Fix:** Check logs and set environment variables

---

### Test 2: Login Endpoint
```bash
curl -X POST https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}'
```

**✅ Expected (Success):**
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

**❌ If you get error:**
Check the error message and logs

---

## 🔍 Step 6: Common Issues & Fixes

### Issue: "Failed to fetch" in browser but curl works

**Cause:** CORS issue

**Fix:**
1. Check CORS configuration in `/supabase/functions/make-server-55e8c5b2/index.ts` (lines 47-51)
2. It should have:
   ```typescript
   app.use('*', cors({
     origin: '*',
     allowHeaders: ['Content-Type', 'Authorization'],
     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   }))
   ```
3. Re-deploy if needed

---

### Issue: Function deploys but returns 500

**Cause:** Missing environment variables or runtime error

**Fix:**
1. Check logs
2. Set all required environment variables:
   ```bash
   supabase secrets set SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-key>
   ```
3. Restart function (redeploy)

---

### Issue: "Function not found" (404)

**Cause:** Function not deployed or wrong name

**Fix:**
```bash
# List all functions
supabase functions list --project-ref xwcgpmqgqysxeovbrbxg

# If make-server-55e8c5b2 is not listed, deploy it:
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg
```

---

## 🚀 Step 7: Complete Re-deployment (Nuclear Option)

If nothing works, do a complete clean re-deployment:

```bash
# 1. Make sure you're in the project directory
cd /path/to/your/buboiq/project

# 2. Link to project (if not already linked)
supabase link --project-ref xwcgpmqgqysxeovbrbxg

# 3. Deploy function with verbose output
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg --debug

# 4. Set environment variables
supabase secrets set SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co --project-ref xwcgpmqgqysxeovbrbxg

# Get your service role key from dashboard and set it:
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key --project-ref xwcgpmqgqysxeovbrbxg

# 5. Check deployment worked
curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health

# 6. Check logs
supabase functions logs make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg
```

---

## 📊 Deployment Checklist

Run through this checklist:

- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Logged in to Supabase (`supabase login`)
- [ ] Linked to project (`supabase link --project-ref xwcgpmqgqysxeovbrbxg`)
- [ ] Function deployed (`supabase functions deploy make-server-55e8c5b2`)
- [ ] Function shows in dashboard (https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/functions)
- [ ] Function status is "Active"
- [ ] `SUPABASE_URL` environment variable set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` environment variable set
- [ ] Health endpoint returns 200 (test with curl)
- [ ] Login endpoint works (test with curl)
- [ ] No errors in function logs

---

## 🆘 Still Not Working?

### Share these details:

1. **Output of:**
   ```bash
   supabase functions list --project-ref xwcgpmqgqysxeovbrbxg
   ```

2. **Output of:**
   ```bash
   curl -v https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
   ```

3. **Function logs:**
   Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/logs/edge-functions
   
   Copy the last 10-20 lines

4. **Environment variables set:**
   ```bash
   supabase secrets list --project-ref xwcgpmqgqysxeovbrbxg
   ```

With these details, I can pinpoint the exact issue!
