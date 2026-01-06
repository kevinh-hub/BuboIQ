# BuboIQ Super Admin - Quick Reference Card

**Keep this handy for testing and development**

---

## 🔑 Credentials

### Test/Dev Super Admin
```
Email:    admin@buboiq.dev
Password: BuboIQ2024!Admin
Role:     super_admin
```

### Regular Test User (for permission tests)
```
Email:    user@example.com
Password: TestUser123!
Role:     user
```

---

## 🚀 Setup Commands

```bash
# 1. Set environment variables
export SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# 2. Create super admin user
npm run create-super-admin

# 3. Verify in database
# Open Supabase Dashboard → SQL Editor:
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';

# 4. Run tests
npm run test:e2e
```

---

## 🧪 Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run only login tests
npm run test:e2e:login

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run specific test
npx playwright test tests/e2e/super-admin-login.spec.ts

# Debug mode
npx playwright test --debug
```

---

## ✅ Verification Checklist

Before running tests:

```bash
# Check user exists in auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@buboiq.dev';
# ✓ Should return 1 row

# Check user has super_admin role
SELECT id, email, role 
FROM public.users 
WHERE email = 'admin@buboiq.dev';
# ✓ Should show: admin@buboiq.dev | super_admin

# Test login via API
curl -X POST "https://YOUR-PROJECT-ID.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@buboiq.dev","password":"BuboIQ2024!Admin"}'
# ✓ Should return access_token

# Test admin API access
curl -X GET "https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-55e8c5b2/admin/orgs" \
  -H "Authorization: Bearer ACCESS_TOKEN_FROM_ABOVE"
# ✓ Should return {"data":[...]}
```

---

## 🔧 Quick Fixes

### "User already exists" error
```sql
-- Option 1: Delete and recreate
DELETE FROM public.users WHERE email = 'admin@buboiq.dev';
DELETE FROM auth.users WHERE email = 'admin@buboiq.dev';
-- Then run: npm run create-super-admin

-- Option 2: Just update role
UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'admin@buboiq.dev';
```

### "Unauthorized" at /admin
```sql
-- Force set super_admin role
UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'admin@buboiq.dev';
```

### Password not working
```bash
# Re-run creation script (will update password)
npm run create-super-admin
```

---

## 📍 UI Login Flow

1. Navigate to `http://localhost:5173/`
2. Click **"Sign In"** link/button
3. Look for **"Login as Super Admin"** quick login button
4. Click it → auto-fills and submits
5. Should redirect to dashboard/admin interface
6. Navigate to `/admin` to test Back Office

**OR manually enter:**
- Email: `admin@buboiq.dev`
- Password: `BuboIQ2024!Admin`
- Click **"Sign In"**

---

## 🎯 Test Scenarios

### Test A: Happy Path Login
✓ Click "Login as Super Admin" button  
✓ Should auto-login and redirect  
✓ localStorage has `bubo_access_token`  
✓ Can access `/admin` route

### Test B: Non-Super-Admin Access
✓ Login as regular user  
✓ Should NOT see admin UI  
✓ Cannot access `/admin` route

### Test C: Invalid Credentials
✓ Enter wrong password  
✓ Should show error message  
✓ Should NOT create session  
✓ Should stay on login page

### Test D: Button Interactivity
✓ Button enabled initially  
✓ Shows loading state during auth  
✓ Form validation works

### Test E: Session Persistence
✓ Login successfully  
✓ Refresh page  
✓ Should still be logged in  
✓ Token persists in localStorage

---

## 📚 Documentation

**Detailed guides:**
- `/SUPER_ADMIN_CREDENTIALS.md` - Complete setup guide
- `/docs/SUPER_ADMIN_SETUP.md` - Alternative setup methods
- `/docs/ADMIN_README.md` - Back Office documentation
- `/tests/e2e/super-admin-login.spec.ts` - Test specifications

**Scripts:**
- `/scripts/create-super-admin.ts` - TypeScript creation script
- `/scripts/create-super-admin.sh` - Bash creation script

---

## 🔐 Security Reminders

**Development/Testing:**
- ✅ Use `admin@buboiq.dev` / `BuboIQ2024!Admin`
- ✅ These credentials are safe for local testing
- ✅ Hardcoded in test files for consistency

**Production:**
- ⚠️ **NEVER** use test credentials in production
- ✅ Generate strong password: `openssl rand -base64 32`
- ✅ Use real company email (e.g., `admin@your-company.com`)
- ✅ Store in password manager (1Password, LastPass)
- ✅ Enable MFA in Supabase Dashboard

---

## 🚨 Emergency Access

If locked out of super admin:

```sql
-- Via Supabase SQL Editor (requires DB access)

-- Create new super admin
DO $$
DECLARE
  new_admin_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_admin_id, 'authenticated', 'authenticated',
    'emergency@buboiq.dev',
    crypt('EmergencyAccess2024!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"super_admin"}'
  );
  
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new_admin_id, 'emergency@buboiq.dev', 'super_admin', NOW(), NOW());
  
  RAISE NOTICE 'Emergency admin created: emergency@buboiq.dev';
END $$;
```

Then login with:
```
Email: emergency@buboiq.dev
Password: EmergencyAccess2024!
```

---

## 📞 Support

**Issues with credentials?**
1. Check `/SUPER_ADMIN_CREDENTIALS.md` for troubleshooting
2. Verify environment variables are set correctly
3. Check Supabase Dashboard → Authentication → Users
4. Check Supabase Dashboard → SQL Editor for manual fixes

**Tests failing?**
1. Run verification checklist above
2. Check `/tests/README.md` for test documentation
3. Check browser console for errors
4. Check Supabase logs for auth failures

---

**Print this page or bookmark it for quick reference during development!** 📋
