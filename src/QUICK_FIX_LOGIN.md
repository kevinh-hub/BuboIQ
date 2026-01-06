# ⚡ QUICK FIX: Login "Deprecated" Error

## 🎯 THE FIX (60 seconds)

### 1. Open Supabase Dashboard
→ https://supabase.com/dashboard

### 2. Deploy Edge Function
1. Click **Edge Functions** (left sidebar)
2. Find **`server`** function
3. Click **"Deploy"** or **"Redeploy"**
4. Wait 30 seconds

### 3. Test Login
1. Go to your published site
2. Click "Sign In"
3. Enter: `admin@buboiq.dev` / `BuboIQ2024!Admin`
4. ✅ Should work!

---

## If "Invalid Credentials" Error

That's good! Auth is working. Just create the user:

### Quick SQL Fix
1. **Supabase Dashboard** → **SQL Editor**
2. **Paste and RUN:**

```sql
-- Create auth user
DO $$
DECLARE
  admin_id uuid;
BEGIN
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(),
    'admin@buboiq.dev',
    crypt('BuboIQ2024!Admin', gen_salt('bf')),
    NOW(),
    '{"name":"Super Admin","role":"super_admin"}'::jsonb,
    NOW(), NOW()
  )
  ON CONFLICT (email) DO UPDATE 
  SET email_confirmed_at = NOW()
  RETURNING id INTO admin_id;

  -- Grant super_admin role
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (admin_id, 'admin@buboiq.dev', 'super_admin', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

  RAISE NOTICE 'Super admin created: %', admin_id;
END $$;
```

3. **Try login again** → Should work! ✅

---

## Credentials

```
Email:    admin@buboiq.dev
Password: BuboIQ2024!Admin
Role:     super_admin
```

---

## That's It!

**Problem:** `Error: This function has been deprecated`
**Solution:** Deploy `server` function in Supabase Dashboard
**Time:** 60 seconds

🎉 Done!
