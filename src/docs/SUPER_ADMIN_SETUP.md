# BuboIQ Super Admin Setup - Create Login Credentials

**Create working Super Admin credentials for testing and production**

---

## Quick Setup (30 seconds)

### Step 1: Create Super Admin User in Supabase

Open **Supabase Dashboard → SQL Editor** and run this script:

```sql
-- ============================================================================
-- CREATE SUPER ADMIN USER FOR BUBOIQ
-- Email: admin@buboiq.dev
-- Password: BuboIQ2024!Admin
-- ============================================================================

-- Create super admin user via Supabase Auth
-- This ensures the user is created in auth.users table with proper password hashing
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@buboiq.dev',
  crypt('BuboIQ2024!Admin', gen_salt('bf')), -- bcrypt hash of password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"super_admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) 
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Get the user ID for next steps
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@buboiq.dev';
  RAISE NOTICE 'Super Admin User ID: %', admin_user_id;
  
  -- Create corresponding entry in public.users table
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (
    admin_user_id,
    'admin@buboiq.dev',
    'super_admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
  
  RAISE NOTICE '✓ Super admin user created successfully';
END $$;
```

---

## Alternative: Use Supabase Admin API

If the SQL approach doesn't work (some Supabase versions restrict auth.users inserts), use this method:

### Method 2: Via Supabase Admin SDK

Create a temporary script file `create-super-admin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createSuperAdmin() {
  // Create user via Admin API
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: 'admin@buboiq.dev',
    password: 'BuboIQ2024!Admin',
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      role: 'super_admin'
    }
  })

  if (createError) {
    console.error('Error creating user:', createError)
    return
  }

  console.log('✓ User created:', user.user?.id)

  // Update public.users table with super_admin role
  const { error: updateError } = await supabase
    .from('users')
    .upsert({
      id: user.user!.id,
      email: 'admin@buboiq.dev',
      role: 'super_admin'
    })

  if (updateError) {
    console.error('Error updating users table:', updateError)
    return
  }

  console.log('✓ Super admin role granted')
  console.log('✅ Super Admin created successfully!')
  console.log('\nCredentials:')
  console.log('Email: admin@buboiq.dev')
  console.log('Password: BuboIQ2024!Admin')
}

createSuperAdmin()
```

Run it:
```bash
npx tsx create-super-admin.ts
```

---

## Method 3: Via Supabase Dashboard UI

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add User"** button
3. Fill in:
   - **Email:** `admin@buboiq.dev`
   - **Password:** `BuboIQ2024!Admin`
   - **Auto Confirm User:** ✅ (check this box)
4. Click **"Create User"**
5. Copy the User ID from the users table
6. Run this SQL to grant super_admin role:

```sql
-- Replace USER_ID with the actual UUID from step 5
UPDATE public.users 
SET role = 'super_admin' 
WHERE id = 'USER_ID';

-- Or create if doesn't exist
INSERT INTO public.users (id, email, role)
VALUES ('USER_ID', 'admin@buboiq.dev', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
```

---

## Verification

After creating the super admin user, verify it works:

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

-- Expected result:
-- id                                    | email               | role        | created_at
-- --------------------------------------|---------------------|-------------|------------------------
-- <some-uuid>                           | admin@buboiq.dev    | super_admin | 2024-01-15 10:30:00...
```

### 2. Test Login via API

```bash
# Test login endpoint
curl -X POST "https://YOUR-PROJECT-ID.supabase.co/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "email": "admin@buboiq.dev",
    "password": "BuboIQ2024!Admin"
  }'

# Expected response:
# {
#   "access_token": "eyJxxx...",
#   "token_type": "bearer",
#   "expires_in": 3600,
#   "refresh_token": "xxx",
#   "user": {
#     "id": "uuid",
#     "email": "admin@buboiq.dev",
#     ...
#   }
# }
```

### 3. Test Login via UI

1. Navigate to `http://localhost:5173/` (or your app URL)
2. Click **"Sign In"**
3. Click **"Login as Super Admin"** button (quick login)
   - OR manually enter:
     - Email: `admin@buboiq.dev`
     - Password: `BuboIQ2024!Admin`
4. Should redirect to dashboard/admin interface
5. Check browser console for `bubo_access_token` in localStorage
6. Navigate to `/admin` route - should load Back Office

---

## Test User Setup (Optional)

For testing the "non-super-admin" flow (Test B), create a regular user:

```sql
-- Method 1: SQL (if auth.users insert allowed)
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
  'user@example.com',
  crypt('TestUser123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"user"}'
)
ON CONFLICT (email) DO NOTHING;

-- Add to public.users with regular role
INSERT INTO public.users (id, email, role)
SELECT id, 'user@example.com', 'user'
FROM auth.users WHERE email = 'user@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'user';
```

Or via Admin API:
```typescript
const { data } = await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'TestUser123!',
  email_confirm: true,
  user_metadata: { role: 'user' }
})

await supabase.from('users').upsert({
  id: data.user!.id,
  email: 'user@example.com',
  role: 'user' // NOT super_admin
})
```

---

## Environment Variables

Add these to your `.env.local` for tests:

```bash
# Supabase (already have these)
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Test credentials (for Playwright tests)
SUPER_ADMIN_EMAIL=admin@buboiq.dev
SUPER_ADMIN_PASSWORD=BuboIQ2024!Admin
REGULAR_USER_EMAIL=user@example.com
REGULAR_USER_PASSWORD=TestUser123!
```

---

## Troubleshooting

### Issue: "User already exists" error

```sql
-- Delete existing user
DELETE FROM public.users WHERE email = 'admin@buboiq.dev';
DELETE FROM auth.users WHERE email = 'admin@buboiq.dev';

-- Then re-run creation script
```

### Issue: "Cannot insert into auth.users" error

This means your Supabase instance doesn't allow direct inserts into `auth.users`. Use **Method 2** (Admin API) or **Method 3** (Dashboard UI) instead.

### Issue: Login works but no super_admin role

```sql
-- Check current role
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';

-- Force update to super_admin
UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';

-- Verify
SELECT email, role FROM public.users WHERE email = 'admin@buboiq.dev';
-- Should show: admin@buboiq.dev | super_admin
```

### Issue: Password not working

If you created the user via Dashboard UI, the password may be different. Reset it:

```bash
# Via Supabase Dashboard → Authentication → Users → Find user → Reset password
# Or via Admin API:
supabase.auth.admin.updateUserById(USER_ID, {
  password: 'BuboIQ2024!Admin'
})
```

---

## Production Credentials

**⚠️ IMPORTANT: For production, use a strong, unique password!**

Suggested production setup:

1. Generate secure password:
```bash
openssl rand -base64 32
# Or use a password manager
```

2. Create production super admin:
```sql
-- Use real email and strong password
INSERT INTO auth.users (...)
VALUES (
  ...,
  'admin@your-company.com',
  crypt('STRONG_RANDOM_PASSWORD_HERE', gen_salt('bf')),
  ...
);
```

3. Store credentials securely:
   - Password manager (1Password, LastPass)
   - Environment variable (CI/CD only)
   - Secret management service (AWS Secrets Manager, Vault)

4. Enable MFA:
   - Supabase Dashboard → Authentication → Users → Enable MFA for admin user

---

## Quick Reference Card

**Test/Dev Credentials:**
```
Email: admin@buboiq.dev
Password: BuboIQ2024!Admin
Role: super_admin
```

**Regular User (Test B):**
```
Email: user@example.com
Password: TestUser123!
Role: user
```

**Verification Commands:**
```sql
-- Check super admin exists
SELECT email, role FROM public.users WHERE role = 'super_admin';

-- Check auth entry exists
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'admin@buboiq.dev';

-- Test login (via psql or SQL Editor)
-- (This just checks the user exists, actual login happens via Supabase Auth API)
```

**API Test:**
```bash
curl -X POST "https://YOUR-PROJECT-ID.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@buboiq.dev","password":"BuboIQ2024!Admin"}'
```

---

## Next Steps

After creating super admin credentials:

1. ✅ Run Playwright tests: `npm run test:e2e`
2. ✅ Login manually via UI to verify
3. ✅ Navigate to `/admin` to test Back Office access
4. ✅ Perform an admin action (change tier) and verify audit log
5. ✅ Document credentials securely for your team

---

**Credentials created successfully? Run the tests!**

```bash
npm run test:e2e
```

**Expected output:**
```
✓ Test A (Happy Path) PASSED
✓ Test A2 (Manual Form) PASSED
✓ Test C (Invalid Credentials) PASSED
✓ Test D (Button Interactivity) PASSED
✓ Test E (Session Persistence) PASSED
✓ Test F (Network Error) PASSED
```
