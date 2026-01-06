/**
 * BuboIQ Super Admin User Creation Script
 * 
 * Creates super admin user via Supabase Admin API
 * Credentials: admin@buboiq.dev / BuboIQ2024!Admin
 * 
 * Usage:
 *   npx tsx scripts/create-super-admin.ts
 *   OR
 *   node scripts/create-super-admin.js (if compiled)
 */

import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'admin@buboiq.dev'
const ADMIN_PASSWORD = 'BuboIQ2024!Admin'

async function createSuperAdmin() {
  console.log('🚀 BuboIQ Super Admin Creation Script')
  console.log('======================================')
  console.log('')

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error('❌ Error: SUPABASE_URL environment variable not set')
    console.error('   Please set: export SUPABASE_URL=https://your-project-id.supabase.co')
    process.exit(1)
  }

  if (!serviceRoleKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set')
    console.error('   Please set: export SUPABASE_SERVICE_ROLE_KEY=eyJxxx...')
    process.exit(1)
  }

  console.log('Creating super admin user...')
  console.log(`Email: ${ADMIN_EMAIL}`)
  console.log('')

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Step 1: Create user via Admin API
  console.log('Step 1/3: Creating user in Supabase Auth...')

  try {
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'super_admin'
      }
    })

    if (createError) {
      if (createError.message.includes('already exists')) {
        console.log('⚠ User already exists, fetching existing user...')
        
        // Get existing user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        
        if (listError) {
          console.error('❌ Error fetching existing user:', listError.message)
          process.exit(1)
        }

        const existingUser = users.find(u => u.email === ADMIN_EMAIL)
        
        if (!existingUser) {
          console.error('❌ Error: User exists but could not be found')
          process.exit(1)
        }

        console.log('  User ID:', existingUser.id)
        console.log('  Updating password...')

        // Update password
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: ADMIN_PASSWORD }
        )

        if (updateError) {
          console.error('❌ Error updating password:', updateError.message)
          process.exit(1)
        }

        console.log('  ✓ Password updated')
        
        // Use existing user ID for next steps
        userData.user = existingUser
      } else {
        console.error('❌ Error creating user:', createError.message)
        process.exit(1)
      }
    } else {
      console.log('✓ User created successfully')
      console.log('  User ID:', userData.user?.id)
    }

    const userId = userData.user!.id
    console.log('')

    // Step 2: Insert/update public.users table with super_admin role
    console.log('Step 2/3: Granting super_admin role in database...')

    const { error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          email: ADMIN_EMAIL,
          role: 'super_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'id'
        }
      )

    if (upsertError) {
      console.error('❌ Error granting super_admin role:', upsertError.message)
      console.error('   You may need to manually run:')
      console.error(`   UPDATE public.users SET role = 'super_admin' WHERE id = '${userId}';`)
      process.exit(1)
    }

    console.log('✓ Super admin role granted')
    console.log('')

    // Step 3: Verify setup
    console.log('Step 3/3: Verifying setup...')
    console.log('Testing login...')

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })

    if (signInError) {
      console.error('❌ Login test failed:', signInError.message)
      process.exit(1)
    }

    console.log('✓ Login test successful')
    console.log('  Access token:', signInData.session?.access_token?.substring(0, 20) + '...')

    // Verify role in public.users
    const { data: userRecord, error: selectError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', userId)
      .single()

    if (selectError) {
      console.warn('⚠ Warning: Could not verify role in users table:', selectError.message)
    } else {
      console.log('✓ Role verified in database:', userRecord.role)
    }

    console.log('')
    console.log('======================================')
    console.log('✅ Super Admin User Created Successfully!')
    console.log('======================================')
    console.log('')
    console.log('Credentials:')
    console.log(`  Email:    ${ADMIN_EMAIL}`)
    console.log(`  Password: ${ADMIN_PASSWORD}`)
    console.log(`  Role:     super_admin`)
    console.log(`  User ID:  ${userId}`)
    console.log('')
    console.log('Next steps:')
    console.log('  1. Test login: Navigate to http://localhost:5173/ and click "Sign In"')
    console.log('  2. Click "Login as Super Admin" button')
    console.log('  3. Navigate to /admin to access Back Office')
    console.log('  4. Run tests: npm run test:e2e')
    console.log('')
    console.log('⚠️  IMPORTANT: For production, change this password to a strong, unique value!')
    console.log('')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run the script
createSuperAdmin()
