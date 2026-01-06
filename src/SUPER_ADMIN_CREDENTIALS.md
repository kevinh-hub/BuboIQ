# BuboIQ Super Admin - Login Credentials Guide

**Complete guide to create and use Super Admin credentials for testing and production**

---

## 🎯 Quick Answer

**Test/Dev Super Admin Credentials:**
```
Email:    admin@buboiq.dev
Password: BuboIQ2024!Admin
Role:     super_admin
```

These credentials are referenced in:
- `/tests/e2e/super-admin-login.spec.ts` (Playwright tests)
- All documentation examples
- Quick login buttons in UI

---

## 🚀 Create Super Admin User (Choose One Method)

### Method 1: Automated Script (Recommended) ⭐

**Using TypeScript:**
```bash
# Set environment variables
export SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Run script
npx tsx scripts/create-super-admin.ts
```

**Using Bash:**
```bash
# Set environment variables
export SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Make executable and run
chmod +x scripts/create-super-admin.sh
./scripts/create-super-admin.sh
```

**Expected output:**
```
🚀 BuboIQ Super Admin Creation Script
======================================
Creating super admin user...
Email: admin@buboiq.dev

Step 1/3: Creating user in Supabase Auth...
✓ User created successfully
  User ID: 12345678-1234-1234-1234-123456789abc

Step 2/3: Granting super_admin role in database...
✓ Super admin role granted

Step 3/3: Verifying setup...
Testing login...
✓ Login test successful

======================================
✅ Super Admin User Created Successfully!
======================================
```

---

### Method 2: Supabase Dashboard UI

1. Open **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in:
   - **Email:** `admin@buboiq.dev`
   - **Password:** `BuboIQ2024!Admin`
   - **Auto Confirm User:** ✅ Check this!
4. Click **"Create User"**
5. Copy the User ID from the table
6. Go to **SQL Editor** and run:

```sql
-- Update the users table with super_admin role
UPDATE public.users 
SET role = 'super_admin' 
WHERE email = 'admin@buboiq.dev';

-- Or insert if doesn't exist
INSERT INTO public.users (id, email, role, created_at, updated_at)
SELECT 
  id,
  'admin@buboiq.dev',
  'super_admin',
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@buboiq.dev'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
```

---

### Method 3: SQL Only (Advanced)

Open **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Create user in Supabase Auth (may not work on all Supabase versions)
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to create user via auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@buboiq.dev',
    crypt('BuboIQ2024!Admin', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"super_admin"}'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- If user already exists, get ID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@buboiq.dev';
  END IF;

  -- Create/update in public.users
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (admin_user_id, 'admin@buboiq.dev', 'super_admin', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

  RAISE NOTICE '✅ Super admin created with ID: %', admin_user_id;
END $$;
```

**Note:** If you get permission errors on `auth.users`, use **Method 1** or **Method 2** instead.

---

## ✅ Verification Steps

After creating the user, verify it works:

### 1. Check Database

```sql
-- Verify auth.users entry
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@buboiq.dev';

-- Verify public.users entry with super_admin role
SELECT id, email, role, created_at 
FROM public.users 
WHERE email = 'admin@buboiq.dev';
```

**Expected result:**
```
id                                    | email             | role        
--------------------------------------|-------------------|-------------
12345678-1234-1234-1234-123456789abc | admin@buboiq.dev  | super_admin
```

---

### 2. Test Login via UI

1. Navigate to `http://localhost:5173/`
2. Click **"Sign In"**
3. You should see a **"Login as Super Admin"** quick login button
4. Click it → should auto-fill and login
5. Check browser **localStorage** for `bubo_access_token`
6. Navigate to `/admin` → should load Back Office

**OR manually enter credentials:**
- Email: `admin@buboiq.dev`
- Password: `BuboIQ2024!Admin`
- Click **"Sign In"**

---

### 3. Test Login via API

```bash
# Replace YOUR-PROJECT-ID and YOUR-ANON-KEY
curl -X POST "https://YOUR-PROJECT-ID.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@buboiq.dev",
    "password": "BuboIQ2024!Admin"
  }'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "xxx",
  "user": {
    "id": "12345678-1234-1234-1234-123456789abc",
    "email": "admin@buboiq.dev",
    "role": "authenticated",
    ...
  }
}
```

---

### 4. Test Back Office Access

```bash
# Replace with your project ID and the access_token from step 3
curl -X GET "https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-55e8c5b2/admin/orgs" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response:**
```json
{
  "data": [],
  "message": "No organizations yet. New signups will appear here."
}
```

If you get `{"error": "Unauthorized"}`, the role is not set correctly. Re-run step 6 from Method 2.

---

## 🧪 Run Tests

After creating super admin:

```bash
# Run Playwright tests
npm run test:e2e

# Or run specific test file
npx playwright test tests/e2e/super-admin-login.spec.ts
```

**Expected output:**
```
Running 8 tests using 1 worker

✓ Super Admin Login - Happy Path (Test A) > should successfully login super admin and redirect to dashboard (5s)
✓ Super Admin Login - Happy Path (Test A) > should login via manual form entry (3s)
✓ Invalid Credentials (Test C) > should show error for invalid password (2s)
✓ Button Interactivity (Test D) > should disable button during async auth (3s)
✓ Button Interactivity (Test D) > should only enable submit when form is valid (2s)
✓ Session Persistence (Test E) > should persist session across page refresh (4s)
✓ Error Handling > should show helpful error for network issues (2s)

7 passed (21s)
```

---

## 🔐 Security Notes

### For Development/Testing
✅ Use `admin@buboiq.dev` / `BuboIQ2024!Admin` (hardcoded in tests)

### For Production
⚠️ **DO NOT use test credentials in production!**

**Production setup:**

1. Generate strong password:
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Password manager
# Use 1Password, LastPass, etc. to generate 20+ character password
```

2. Create production admin:
```bash
# Use real company email
export ADMIN_EMAIL="admin@your-company.com"
export ADMIN_PASSWORD="<strong-random-password-from-step-1>"

# Run script with custom credentials
npx tsx scripts/create-super-admin.ts
```

3. Store credentials securely:
   - ✅ Password manager (1Password, LastPass)
   - ✅ Secret management service (AWS Secrets Manager, HashiCorp Vault)
   - ✅ CI/CD secrets (GitHub Secrets, GitLab CI/CD Variables)
   - ❌ Never commit to git
   - ❌ Never share in Slack/email plain text

4. Enable MFA:
   - Supabase Dashboard → Authentication → Users
   - Find admin user → Enable MFA
   - Scan QR code with authenticator app (Google Authenticator, Authy)

---

## 🔧 Troubleshooting

### Issue: "User already exists" error

**Solution:**
```sql
-- Option 1: Delete and recreate
DELETE FROM public.users WHERE email = 'admin@buboiq.dev';
DELETE FROM auth.users WHERE email = 'admin@buboiq.dev';
-- Then re-run creation script

-- Option 2: Just update role
UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';
```

---

### Issue: Login works but "Unauthorized" at /admin

**Cause:** User exists in `auth.users` but `public.users.role` is not `super_admin`

**Solution:**
```sql
-- Check current role
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';

-- Force update to super_admin
UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';

-- Verify
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';
```

---

### Issue: Password not working

**Solution:**
```bash
# Reset password via Supabase Dashboard:
# 1. Go to Authentication → Users
# 2. Find admin@buboiq.dev
# 3. Click "..." menu → "Reset Password"
# 4. Set new password: BuboIQ2024!Admin

# OR via script:
npx tsx scripts/create-super-admin.ts
# (Will update password if user exists)
```

---

### Issue: Cannot insert into auth.users (SQL Method)

**Cause:** Some Supabase versions restrict direct `auth.users` inserts

**Solution:** Use **Method 1** (automated script) or **Method 2** (Dashboard UI) instead of SQL

---

### Issue: Tests fail with "Login failed"

**Debug steps:**

1. Check credentials are correct:
```sql
SELECT email FROM auth.users WHERE email = 'admin@buboiq.dev';
-- Should return 1 row
```

2. Check role is set:
```sql
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';
-- Should show: admin@buboiq.dev | super_admin
```

3. Test manual login in browser:
   - Go to http://localhost:5173/
   - Sign in with admin@buboiq.dev / BuboIQ2024!Admin
   - Should succeed

4. Check test environment variables:
```bash
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
# Should match your project
```

---

## 📚 Related Documentation

- **Full setup guide:** `/docs/SUPER_ADMIN_SETUP.md`
- **Test specs:** `/tests/e2e/super-admin-login.spec.ts`
- **Back Office docs:** `/docs/ADMIN_README.md`
- **Quick start:** `/docs/QUICK_START.md`

---

## ✅ Checklist

Before running tests, verify:

- [ ] Super admin user exists in `auth.users`
- [ ] Super admin user exists in `public.users` with `role = 'super_admin'`
- [ ] Can login via UI with admin@buboiq.dev / BuboIQ2024!Admin
- [ ] Can access /admin route (not redirected or blocked)
- [ ] `SUPABASE_URL` environment variable set
- [ ] `SUPABASE_ANON_KEY` environment variable set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` environment variable set (for scripts)

---

## 🎬 Quick Start Commands

```bash
# 1. Set environment variables (if not in .env)
export SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# 2. Create super admin
npx tsx scripts/create-super-admin.ts

# 3. Verify in database
# (Open Supabase Dashboard → SQL Editor)
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';

# 4. Test login in browser
# Navigate to http://localhost:5173/ → Sign In → Login as Super Admin

# 5. Run tests
npm run test:e2e
```

---

**Credentials ready? Start testing!** 🚀

```bash
npm run test:e2e
```
