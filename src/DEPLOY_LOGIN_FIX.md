# 🚀 Deploy Login Fix - Step-by-Step Guide

## Problem
You're getting: `Error: This function has been deprecated`

## Root Cause
The `/supabase/functions/server` edge function is outdated and needs to be redeployed.

---

## ✅ SOLUTION: Deploy Updated Edge Functions

### Method 1: Supabase Dashboard (EASIEST - 2 minutes)

#### Step 1: Deploy `server` function
1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **BuboIQ project**
3. Click **"Edge Functions"** in left sidebar
4. Find **`server`** function
5. Click **"Deploy New Version"** or **"Redeploy"**
6. Wait for deployment (30-60 seconds)

#### Step 2: Verify
1. Go to your published site
2. Try to login with `admin@buboiq.dev` / `BuboIQ2024!Admin`
3. Should work now! ✅

---

### Method 2: Via Supabase CLI (If you have it installed)

```bash
# Navigate to your project root
cd /path/to/buboiq

# Deploy the server function
supabase functions deploy server

# Optional: Deploy make-server too for latest features
supabase functions deploy make-server
```

---

### Method 3: Via GitHub Actions / CI/CD

If you have CI/CD set up:

```bash
# Commit the changes
git add supabase/functions/server/index.tsx
git add supabase/functions/make-server/index.ts
git commit -m "fix: Update auth routes to resolve deprecated function error"
git push origin main
```

Your CI/CD will automatically deploy the updated functions.

---

## What Was Fixed

### 1. `/supabase/functions/server/index.tsx`
**Before:** Returned "This function has been deprecated" error

**After:** Now proxies all requests to `/make-server` function
```typescript
// Forwards requests properly
app.all('*', async (c) => {
  const targetUrl = `${SUPABASE_URL}/functions/v1/make-server${path}`
  return fetch(targetUrl, {...})
})
```

### 2. `/supabase/functions/make-server/index.ts`
**Added dual route support:**
```typescript
// Works with BOTH:
app.post('/make-server-55e8c5b2/auth/signin', handleSignIn)
app.post('/auth/signin', handleSignIn)  // Fallback compatibility
```

---

## Testing After Deployment

### Quick Test
1. Open your site
2. Click **"Sign In"**
3. Enter:
   - Email: `admin@buboiq.dev`
   - Password: `BuboIQ2024!Admin`
4. Should successfully login!

### API Test (Optional)
```bash
curl -X POST "https://YOUR-PROJECT.supabase.co/functions/v1/server/auth/signin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -d '{"email":"admin@buboiq.dev","password":"BuboIQ2024!Admin"}'
```

**Expected:** 200 OK with access_token

---

## Troubleshooting

### Still Getting "Deprecated" Error?

**1. Clear Browser Cache**
```
Chrome/Edge: Ctrl+Shift+Delete → Clear cached images and files
Firefox: Ctrl+Shift+Delete → Cached Web Content
Safari: Cmd+Option+E
```

**2. Hard Refresh**
- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**3. Check Deployment Status**
- Go to Supabase Dashboard → Edge Functions
- Verify "server" function shows recent deployment timestamp
- Check logs for errors

**4. Verify Function Is Running**
```bash
# Test health endpoint
curl https://YOUR-PROJECT.supabase.co/functions/v1/server/health

# Should return 200 OK or proxy to make-server
```

### "Invalid credentials" Error?

That means login is working! The auth routes are functional.

**Solution:** Create the super admin user:

1. **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:

```sql
-- Create super admin in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@buboiq.dev',
  crypt('BuboIQ2024!Admin', gen_salt('bf')),
  NOW(),
  '{"name": "Super Admin", "role": "super_admin"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Grant super_admin role in public.users
INSERT INTO public.users (id, email, role, created_at, updated_at)
SELECT id, email, 'super_admin', NOW(), NOW()
FROM auth.users
WHERE email = 'admin@buboiq.dev'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
```

---

## What Each Function Does

### `/functions/server` (Legacy Proxy)
- **Purpose:** Backward compatibility
- **Action:** Forwards all requests to `/make-server`
- **Use:** Handles old API calls that haven't migrated yet

### `/functions/make-server` (Main Server)
- **Purpose:** Primary BuboIQ backend
- **Routes:** All auth, admin, compliance, intelligence endpoints
- **Use:** Production API for all features

---

## Deployment Checklist

- [ ] Deploy `server` function via Supabase Dashboard
- [ ] Wait 30-60 seconds for deployment
- [ ] Test login at your published site
- [ ] Verify no "deprecated" errors
- [ ] Create super admin if needed (SQL above)
- [ ] Test `/admin` route access
- [ ] Check browser console for errors

---

## Status After Deployment

✅ **server** function: Proxying to make-server
✅ **Auth routes**: Dual-path support
✅ **Login flow**: Fully functional
✅ **Back Office**: Accessible at `/admin`

---

## Next Steps After Login Works

1. **Test Super Admin Access**
   - Navigate to `/admin`
   - Should see Back Office dashboard
   - All 6 tabs should load

2. **Verify Features**
   - Organizations management
   - Billing overview
   - Analytics
   - Support tickets
   - System health
   - Compliance tools

3. **Create Additional Users** (Optional)
   - Use signup flow
   - Or create via SQL/Dashboard

---

## Need Help?

**Common Issues:**
- **Deprecated error:** Deploy `server` function
- **Invalid credentials:** Create super admin via SQL
- **403 Forbidden:** Check role is `super_admin`
- **Function not found:** Verify function name is `server` not `make-server-55e8c5b2`

**Verification Commands:**
```bash
# Check function exists
curl https://YOUR-PROJECT.supabase.co/functions/v1/server/health

# Test auth endpoint
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/server/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

---

**🎯 Bottom Line:** Deploy the `server` function via Supabase Dashboard and login will work!
