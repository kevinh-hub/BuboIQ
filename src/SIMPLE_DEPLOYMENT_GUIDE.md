# 🚀 BuboIQ Backend - Simple Deployment Guide

## **Problem**
The deployed Edge Function is outdated. We need to redeploy the correct code.

## **Solution** 
Deploy from your local machine using the Supabase CLI.

---

## ✅ **OPTION 1: Use Supabase Dashboard (EASIEST - No CLI needed!)**

### Step 1: Go to Supabase Dashboard
Open: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/functions

### Step 2: Find Your Function
Look for `make-server-55e8c5b2` in the list

### Step 3: Deploy New Version
1. Click on the function name
2. Click "Deploy new version"
3. You'll see an option to upload code or edit directly

### Step 4: Upload Files
You need to upload all the files from `/supabase/functions/make-server-55e8c5b2/`

**Problem:** The dashboard might only allow editing, not bulk upload.

---

## ✅ **OPTION 2: Use Supabase CLI (RECOMMENDED)**

### Step 1: Install Supabase CLI

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Windows/Linux:**
```bash
npm install -g supabase
```

### Step 2: Login
```bash
supabase login
```
This will open a browser for authentication.

### Step 3: Get the Files

You have 2 choices:

**A) Manual Copy (from Figma Make)**
1. In Figma Make, select all files in `/supabase/functions/make-server-55e8c5b2/`
2. Copy them to your local machine at `~/BuboIQ-Deploy/supabase/functions/make-server-55e8c5b2/`

**B) I'll provide file-by-file** (see below)

### Step 4: Deploy
```bash
cd ~/BuboIQ-Deploy
supabase functions deploy make-server-55e8c5b2 \
  --project-ref xwcgpmqgqysxeovbrbxg \
  --no-verify-jwt
```

### Step 5: Test
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -H "Content-Type: application/json" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}' \
  https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJ...",
  "user": {
    "email": "kevinh@buboiq.com",
    "role": "super_admin"
  }
}
```

---

## 📦 **OPTION 3: I'll Give You All Files** 

### Files You Need (17 total):

1. ✅ deno.json (8 lines)
2. ✅ notifications.ts (14 lines)
3. ✅ intelligence.ts (25 lines)
4. ✅ compliance.ts (17 lines)
5. ✅ lead-export.ts (3 lines)
6. ✅ early-access.ts (3 lines)
7. ✅ guided-fixes.ts (3 lines)
8. ✅ admin.ts (3 lines)
9. ⚠️ kv_store.ts (88 lines) - **CRITICAL**
10. ⚠️ constants.ts (213 lines)
11. ⚠️ init.ts (75 lines)
12. ⚠️ remote.ts (45 lines)
13. ⚠️ integrations.ts (54 lines)
14. ⚠️ partner-leads.ts (93 lines)
15. ⚠️ demo-leads.ts (319 lines) - **LARGE**
16. ⚠️ auth.ts (434 lines) - **CRITICAL**
17. ⚠️ super-admin-routes.ts (256 lines) - **CRITICAL**
18. ⚠️ index.ts (746 lines) - **MAIN FILE**

**Files marked ⚠️ are the critical ones I can provide next.**

---

## 🤔 **Which Option Do You Prefer?**

1. **Dashboard Upload** - Try first, might be limited
2. **CLI Deployment** - Most reliable, needs file copy
3. **File-by-File** - I'll provide each file content

**Tell me which you'd like to proceed with!**

---

## 🆘 **Quick Help**

- **I don't have CLI**: Use Option 1 (Dashboard) or I'll provide files
- **I have CLI but no files**: Use Option 3 (I'll provide all content)
- **I want fastest**: Use Option 2 (CLI with file copy from Figma Make)
