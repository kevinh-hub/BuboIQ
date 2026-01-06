# 🎯 FINAL DEPLOYMENT INSTRUCTIONS

## Current Status
✅ Backend code is CORRECT in Figma Make  
❌ Deployed Edge Function is OUTDATED  
🎯 Goal: Redeploy the latest code

---

## 🚀 **FASTEST METHOD: Download from Browser**

Since you're using Figma Make in a browser, you can see all the files. Here's the quickest path:

### Step 1: Open These Files in Figma Make

Navigate to `/supabase/functions/make-server-55e8c5b2/` and you'll see all 17 files.

### Step 2: Create Local Directory

```bash
mkdir -p ~/BuboIQ-Deploy/supabase/functions/make-server-55e8c5b2
cd ~/BuboIQ-Deploy/supabase/functions/make-server-55e8c5b2
```

### Step 3: Copy Files One-by-One

I've created reference files for you in the Figma Make workspace. Open each file below and copy its content:

#### Small Files (Quick Copy)
1. `/FILE_kv_store.ts` → Copy to `kv_store.ts`
2. Open `/supabase/functions/make-server-55e8c5b2/constants.ts` in Figma Make → Copy
3. Open `/supabase/functions/make-server-55e8c5b2/init.ts` → Copy
4. Open `/supabase/functions/make-server-55e8c5b2/remote.ts` → Copy
5. Open `/supabase/functions/make-server-55e8c5b2/integrations.ts` → Copy
6. Open `/supabase/functions/make-server-55e8c5b2/partner-leads.ts` → Copy

#### Large Files (Important)
7. Open `/supabase/functions/make-server-55e8c5b2/demo-leads.ts` → Copy (319 lines)
8. Open `/supabase/functions/make-server-55e8c5b2/auth.ts` → Copy (**CRITICAL** - 434 lines)
9. Open `/supabase/functions/make-server-55e8c5b2/super-admin-routes.ts` → Copy (**CRITICAL** - 256 lines)
10. Open `/supabase/functions/make-server-55e8c5b2/index.ts` → Copy (**MAIN FILE** - 746 lines)

#### Stub Files (Create Manually)
```bash
# Run these in your terminal:
echo '{
  "imports": {
    "hono": "npm:hono@^4.0.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2"
  },
  "compilerOptions": {
    "lib": ["deno.ns", "dom"]
  }
}' > deno.json

echo "// Notifications module stubs
export async function notifyNewLead(lead: any) {
  console.log('Notification stub: New lead', lead);
}
export async function notifyLeadStatusChange(lead: any, oldStatus: string, newStatus: string) {
  console.log('Notification stub: Lead status change', { lead, oldStatus, newStatus });
}
export default {
  notifyNewLead,
  notifyLeadStatusChange
};" > notifications.ts

echo "// Intelligence module exports
export function getAnalysts() { return []; }
export function getIncidents() { return []; }
export function getIncidentById(id: string) { return null; }
export function addIncidentAssessment(id: string, assessment: any) { return null; }
export function getAIMetrics() { return {}; }
export function getNeuralStatus() { return {}; }" > intelligence.ts

echo "// Compliance module exports
export async function scanAndLogPHI(...args: any[]) { return {}; }
export async function updateDevicePosture(...args: any[]) { return {}; }
export async function getDevicePosture(...args: any[]) { return {}; }
export async function getNonCompliantDevices(...args: any[]) { return []; }
export async function createBreachIncident(...args: any[]) { return {}; }
export async function getBreachIncidents(...args: any[]) { return []; }
export async function updateBreachWorkflowStep(...args: any[]) { return {}; }
export async function createNetworkZone(...args: any[]) { return {}; }
export async function assignDeviceToZone(...args: any[]) { return {}; }
export async function checkZoneAccessAuthorization(...args: any[]) { return false; }
export async function logCardholderAccess(...args: any[]) { return {}; }
export async function runPCIComplianceScan(...args: any[]) { return ''; }
export async function detectAnomalies(...args: any[]) { return []; }
export async function getComplianceDashboard(...args: any[]) { return {}; }
export async function calculateComplianceScore(...args: any[]) { return 0; }" > compliance.ts

echo "import { Hono } from 'npm:hono@4';" > lead-export.ts
echo "const app = new Hono();" >> lead-export.ts
echo "export default app;" >> lead-export.ts

echo "import { Hono } from 'npm:hono@4';" > early-access.ts
echo "const app = new Hono();" >> early-access.ts
echo "export default app;" >> early-access.ts

echo "import { Hono } from 'npm:hono@4';" > guided-fixes.ts
echo "const app = new Hono();" >> guided-fixes.ts
echo "export default app;" >> guided-fixes.ts

echo "import { Hono } from 'npm:hono@4';" > admin.ts
echo "const admin = new Hono();" >> admin.ts
echo "export default admin;" >> admin.ts
```

### Step 4: Deploy

```bash
cd ~/BuboIQ-Deploy
supabase login
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg --no-verify-jwt
```

### Step 5: Test

```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -H "Content-Type: application/json" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}' \
  https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin | jq .
```

**Expected:**
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

## 📋 Checklist

- [ ] Step 1: Create local directory
- [ ] Step 2: Copy/create all 17 files
- [ ] Step 3: Install Supabase CLI (`brew install supabase/tap/supabase` or `npm i -g supabase`)
- [ ] Step 4: Login to Supabase (`supabase login`)
- [ ] Step 5: Deploy (`supabase functions deploy...`)
- [ ] Step 6: Test login endpoint
- [ ] Step 7: Test Super Admin login in browser

---

## 🆘 Need Help?

**Can't access files?** → I'll provide full content for each
**No Supabase CLI?** → I'll guide you through dashboard deployment
**Deployment fails?** → Check logs with `supabase functions logs make-server-55e8c5b2`

**Just tell me which step you're stuck on!**
