-- 🔑 BuboIQ Super Admin Setup
-- Run this AFTER deploying the schema and signing up with admin@buboiq.dev

-- Step 1: First sign up through your deployed app with these credentials:
-- Email: admin@buboiq.dev
-- Password: BuboIQ2024!Admin

-- Step 2: Find the user ID (run this to get the UUID)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@buboiq.dev';

-- Step 3: Copy the UUID from above and replace 'PASTE-YOUR-UUID-HERE' below:
INSERT INTO users (
  id,
  email,
  name,
  role,
  org_id,
  created_at,
  updated_at
) VALUES (
  'PASTE-YOUR-UUID-HERE',  -- Replace with UUID from Step 2
  'admin@buboiq.dev',
  'Super Admin',
  'super_admin',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  org_id = NULL,
  updated_at = NOW();

-- Step 4: Verify super admin was created successfully
SELECT u.id, u.email, users.role, users.org_id, users.name
FROM auth.users u
JOIN users ON u.id = users.id
WHERE users.role = 'super_admin';

-- Step 5: Log the super admin creation for audit trail
INSERT INTO super_admin_audit_log (
  super_admin_id,
  action,
  target_org_id,
  details
) VALUES (
  'PASTE-YOUR-UUID-HERE',  -- Same UUID as above
  'create_super_admin',
  NULL,
  jsonb_build_object(
    'method', 'manual_sql_setup',
    'created_at', NOW(),
    'note', 'Initial super admin setup for production launch'
  )
);

-- 🎉 SUPER ADMIN SETUP COMPLETE!
-- You can now login with admin@buboiq.dev / BuboIQ2024!Admin