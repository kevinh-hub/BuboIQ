# 🦉 BuboIQ - ONE COMMAND DEPLOYMENT

## ✅ THE ABSOLUTE EASIEST WAY

All your backend files already exist in Figma Make at `/supabase/functions/make-server-55e8c5b2/`

Just run this **ONE COMMAND**:

```bash
mkdir -p ~/BuboIQ-Deploy/supabase/functions && \
cp -r /supabase/functions/make-server-55e8c5b2 ~/BuboIQ-Deploy/supabase/functions/ && \
cd ~/BuboIQ-Deploy && \
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg --no-verify-jwt
```

That's it! ✅

---

## 📋 What this does:

1. Creates `~/BuboIQ-Deploy/supabase/functions` directory
2. Copies all 17 backend files from Figma Make
3. Changes to the deployment directory
4. Deploys to your Supabase project

---

## 🔍 Verify it worked:

After deployment, test the endpoint:

```bash
curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T...",
  "version": "2.0.0",
  "services": {
    "database": "ok",
    "email": "warning",
    "storage": "ok"
  },
  "initialized": true
}
```

---

## 🎯 What's included (all 17 files):

- ✅ index.ts (main server - 746 lines)
- ✅ auth.ts (authentication with Kevin auto-create - 434 lines)
- ✅ super-admin-routes.ts (7 super admin endpoints - 256 lines)
- ✅ kv_store.ts (database operations)
- ✅ constants.ts (demo accounts & config)
- ✅ init.ts (initialization logic)
- ✅ remote.ts (remote support routes)
- ✅ integrations.ts (webhook routes)
- ✅ partner-leads.ts (partner routing)
- ✅ demo-leads.ts (live demo system)
- ✅ notifications.ts (notification stubs)
- ✅ intelligence.ts (AI intelligence exports)
- ✅ compliance.ts (compliance API stubs)
- ✅ lead-export.ts (lead export routes)
- ✅ early-access.ts (early access routes)
- ✅ guided-fixes.ts (guided fixes routes)
- ✅ admin.ts (admin routes)
- ✅ deno.json (Deno configuration)

---

## 🔐 Critical Features Included:

### Super Admin System
- `/super-admin/stats` - Dashboard statistics
- `/super-admin/organizations` - List all orgs
- `/super-admin/users` - List all users
- `/super-admin/users/create` - Create new user
- `/super-admin/users/:id/role` - Update user role
- `/super-admin/impersonate` - User impersonation with JWT
- `/super-admin/organizations/:id/toggle-status` - Toggle org status

### Authentication
- Auto-creates Kevin (kevinh@buboiq.com / TestAccount123!) as super_admin
- Supports demo accounts with password "demo"
- JWT session management
- Role-based access (super_admin, admin, analyst, etc.)

### Infrastructure
- KV store for multi-tenant data
- Audit logging
- Session persistence
- Proper error handling & logging

---

## ⚡ Alternative: Run the helper script

```bash
chmod +x /SIMPLE_DEPLOY.sh
/SIMPLE_DEPLOY.sh
```

---

## 🆘 If the copy command doesn't work:

You can manually download each file from Figma Make browser and save to:
`~/BuboIQ-Deploy/supabase/functions/make-server-55e8c5b2/`

Then deploy with:
```bash
cd ~/BuboIQ-Deploy
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg --no-verify-jwt
```
