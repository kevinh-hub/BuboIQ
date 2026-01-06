-- BuboIQ Super Admin Setup SQL Script
-- Use this in the Supabase SQL Editor if you need to create a super admin directly

-- Step 1: First create a user account through your normal signup flow
-- Then use this script to promote them to super admin

-- Replace 'your-user-id-here' with the actual user ID from auth.users table
-- Replace 'admin@yourcompany.com' with the actual email

-- 1. Find your user ID (run this first to get the user ID)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@yourcompany.com';

-- 2. Update the user to be a super admin (replace the UUID with actual user ID)
UPDATE users 
SET 
  role = 'super_admin',
  org_id = NULL,
  updated_at = NOW()
WHERE id = 'your-user-id-here';

-- 3. Verify the super admin was created
SELECT u.id, u.email, users.role, users.org_id, users.name
FROM auth.users u
JOIN users ON u.id = users.id
WHERE users.role = 'super_admin';

-- 4. Log the super admin creation (optional - for audit trail)
INSERT INTO super_admin_audit_log (
  super_admin_id,
  action,
  target_org_id,
  details
) VALUES (
  'your-user-id-here',
  'create_super_admin',
  NULL,
  jsonb_build_object(
    'method', 'manual_sql_setup',
    'created_at', NOW(),
    'note', 'Initial super admin setup via SQL'
  )
);

-- Alternative: If you want to create a super admin from scratch (advanced)
-- This requires you to manually handle the auth.users entry as well

/*
-- Step A: Insert into auth.users (this is more complex and not recommended)
-- It's better to use the normal signup flow first, then promote

-- Step B: Insert into users table with super admin role
INSERT INTO users (
  id,
  email,
  name,
  role,
  org_id,
  created_at,
  updated_at
) VALUES (
  'your-new-user-id',
  'admin@yourcompany.com',
  'Super Admin',
  'super_admin',
  NULL,
  NOW(),
  NOW()
);
*/

-- Verification queries to check super admin setup:

-- Check all super admins
SELECT 
  u.email,
  users.name,
  users.role,
  users.org_id,
  users.created_at
FROM auth.users u
JOIN users ON u.id = users.id
WHERE users.role = 'super_admin'
ORDER BY users.created_at DESC;

-- Check super admin audit log
SELECT 
  super_admin_id,
  action,
  target_org_id,
  details,
  created_at
FROM super_admin_audit_log
ORDER BY created_at DESC
LIMIT 10;

-- Check RLS policies are working (should return data for super admin)
SELECT COUNT(*) as total_companies FROM companies;
SELECT COUNT(*) as total_users FROM users WHERE org_id IS NOT NULL;
SELECT COUNT(*) as total_devices FROM devices;
SELECT COUNT(*) as total_tickets FROM tickets;