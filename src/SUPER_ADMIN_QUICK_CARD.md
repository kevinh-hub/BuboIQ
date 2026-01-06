# 🔑 Super Admin Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│           BUBOIQ SUPER ADMIN ACCESS             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Email:    admin@buboiq.dev                     │
│  Password: BuboIQ2024!Admin                     │
│                                                 │
│  ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN          │
│                                                 │
├─────────────────────────────────────────────────┤
│  QUICK ACCESS ROUTES:                           │
│                                                 │
│  /admin              → Super Admin Dashboard    │
│  /early-access-admin → Early Access Management  │
│  /admin/demo-leads   → Demo Leads Panel         │
│                                                 │
├─────────────────────────────────────────────────┤
│  SETUP (if account doesn't exist):              │
│                                                 │
│  1. Sign up with credentials above              │
│  2. Run this SQL in Supabase:                   │
│                                                 │
│     UPDATE users                                │
│     SET role = 'super_admin'                    │
│     WHERE email = 'admin@buboiq.dev';           │
│                                                 │
│  3. Login and enjoy full access!                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Actions

### Login Now
1. Go to your login page
2. Enter email: `admin@buboiq.dev`
3. Enter password: `BuboIQ2024!Admin`
4. Click "Sign In"

### Access Early Access
1. Login as super admin
2. Navigate to `/early-access-admin`
3. Create your first invite!

### Create Another Super Admin
```sql
UPDATE users 
SET role = 'super_admin'
WHERE email = 'your-email@company.com';
```

---

**Full details:** See `/SUPER_ADMIN_CREDENTIALS.md`
