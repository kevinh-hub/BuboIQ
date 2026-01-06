# 🚀 BuboIQ Backend Deployment Guide

## Problem Summary
The Super Admin login is working in the backend (curl test passed ✅), but the **deployed Edge Function on Supabase is outdated**. The curl test returned `{"ok":true,...}` instead of returning user data and tokens.

## Solution: Deploy Updated Backend Locally

Since Figma Make files are cloud-based, you need to deploy from your **local machine**.

---

## 📋 Prerequisites

1. **Supabase CLI** installed
2. **Supabase Account** access (logged in)
3. **Terminal** access

---

## 🎯 Step-by-Step Deployment

### Step 1: Open Terminal on Your Machine

```bash
# Navigate to a working directory
cd ~/Desktop
```

### Step 2: Login to Supabase CLI

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

### Step 3: Deploy the Function

```bash
supabase functions deploy make-server-55e8c5b2 \
  --project-ref xwcgpmqgqysxeovbrbxg \
  --no-verify-jwt
```

**IMPORTANT:** The Supabase CLI will look for the function code in:
```
./supabase/functions/make-server-55e8c5b2/
```

So you need to be in the **root directory of your BuboIQ project** where the `supabase/` folder exists.

---

## ⚠️ If You Don't Have Local Files

If you don't have the code locally, I can provide you with a ZIP download link or individual files to copy. The key files needed are:

```
supabase/
└── functions/
    └── make-server-55e8c5b2/
        ├── index.ts
        ├── auth.ts
        ├── super-admin-routes.ts
        ├── kv_store.ts
        ├── constants.ts
        ├── init.ts
        ├── intelligence.ts
        ├── compliance.ts
        ├── remote.ts
        ├── integrations.ts
        ├── demo-leads.ts
        ├── lead-export.ts
        ├── early-access.ts
        ├── guided-fixes.ts
        ├── admin.ts
        ├── partner-leads.ts
        └── deno.json
```

---

## 🧪 Testing After Deployment

### Test 1: Health Check
```bash
curl -i -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
```

**Expected:** 200 OK with health status

### Test 2: Login
```bash
curl -i -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -H "Content-Type: application/json" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}' \
  https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin
```

**Expected:** 200 OK with `{ success: true, user: {...}, token: "..." }`

---

## 🎉 Success Criteria

After deployment, the login response should include:

```json
{
  "success": true,
  "token": "eyJhbGc...",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "kevinh@buboiq.com",
    "name": "Kevin H",
    "role": "super_admin",
    "org_id": null,
    "tier": "team"
  }
}
```

---

## 🆘 Alternative: Supabase Dashboard Deployment

If CLI doesn't work, you can also deploy via the Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/functions
2. Click on `make-server-55e8c5b2`
3. Click "Deploy new version"
4. Upload the function code
5. Deploy

---

## 🔧 Troubleshooting

### Issue: "Function not found"
- Make sure you're in the project root directory
- The `supabase/functions/make-server-55e8c5b2/` folder must exist

### Issue: "Not logged in"
- Run `supabase login` first
- Authorize in the browser

### Issue: "Deployment failed"
- Check that all environment variables are set in Supabase:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ANON_KEY`

---

## 📞 Need the Files?

If you don't have the files locally, let me know and I'll provide:
1. Individual file contents to copy
2. A complete deployment package
3. Alternative deployment methods

---

**Current Status:** Backend code is correct ✅ | Edge Function needs redeployment 🔄
