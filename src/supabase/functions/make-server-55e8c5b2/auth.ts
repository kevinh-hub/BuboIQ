import { createClient } from 'npm:@supabase/supabase-js@2'
import { DEMO_ACCOUNTS } from './constants.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tech' | 'owner' | 'super_admin' | 'analyst' | 'engineer' | 'manager' | 'observer';
  department?: string;
  specialization?: string;
  org_id: string | null;
  tier: 'starter' | 'pro' | 'team';
  company?: {
    id: string;
    name: string;
    domain?: string;
    tier: string;
  };
  isDemo?: boolean;
}

/**
 * Find a demo account by email
 */
export function findDemoAccount(email: string) {
  return DEMO_ACCOUNTS.find(account => account.email === email)
}

/**
 * Process demo account login
 */
export async function processDemoLogin(demoUser: any, password: string) {
  // Demo accounts use password "demo"
  if (password !== 'demo') {
    return {
      success: false,
      error: 'Invalid credentials'
    }
  }

  // Create a JWT-like token for demo users (not a real JWT, just a unique identifier)
  const demoToken = `demo_${demoUser.id}_${Date.now()}`

  return {
    success: true,
    token: demoToken,
    access_token: demoToken,
    refresh_token: demoToken,
    user: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      department: demoUser.department,
      specialization: demoUser.specialization,
      org_id: 'demo_org',
      tier: 'pro' as const,
      isDemo: true
    }
  }
}

/**
 * Process regular (non-demo) authentication through Supabase
 */
export async function processRegularAuth(email: string, password: string) {
  try {
    console.log('=== PROCESS REGULAR AUTH START ===')
    console.log('Processing regular auth for:', email)
    console.log('Password provided:', password ? '***' : 'NONE')

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Supabase signInWithPassword result:', { 
      hasData: !!authData, 
      hasSession: !!authData?.session,
      hasUser: !!authData?.user,
      error: authError?.message 
    })

    // AUTO-CREATE KEVIN AS SUPER ADMIN IF NOT EXISTS
    if (authError && email.toLowerCase() === 'kevinh@buboiq.com') {
      console.log('Kevin super admin account not found, auto-creating...')
      
      // Create the super admin account
      const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
        email: 'kevinh@buboiq.com',
        password: password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: 'Kevin H',
          role: 'super_admin'
        },
        app_metadata: {
          role: 'super_admin',
          tier: 'team',
          org_id: null
        }
      })

      if (createError) {
        console.error('Failed to create Kevin super admin:', createError)
        return {
          success: false,
          error: createError.message
        }
      }

      console.log('Kevin super admin created successfully, attempting sign in...')
      
      // Now try to sign in again
      const { data: retryAuthData, error: retryAuthError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (retryAuthError || !retryAuthData.user || !retryAuthData.session) {
        console.error('Failed to sign in after creating Kevin:', retryAuthError)
        return {
          success: false,
          error: 'Account created but sign in failed. Please try again.'
        }
      }

      // Successfully created and signed in
      const user: User = {
        id: retryAuthData.user.id,
        email: retryAuthData.user.email!,
        name: 'Kevin H',
        role: 'super_admin',
        org_id: null,
        tier: 'team',
        department: undefined,
        specialization: undefined,
        company: undefined
      }

      console.log('Kevin super admin auto-creation complete')

      return {
        success: true,
        token: retryAuthData.session.access_token,
        access_token: retryAuthData.session.access_token,
        refresh_token: retryAuthData.session.refresh_token,
        user
      }
    }

    if (authError) {
      console.error('Supabase auth error:', authError)
      return {
        success: false,
        error: authError.message
      }
    }

    if (!authData.user || !authData.session) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    console.log('Supabase auth successful for user:', authData.user.id)

    // Try to get user details from our custom users table (gracefully handle missing schema)
    let userData = null
    let userError = null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies:org_id (
            id,
            name,
            domain,
            tier
          ),
          subscriptions:org_id (
            tier,
            status
          )
        `)
        .eq('id', authData.user.id)
        .single()
      
      userData = data
      userError = error
    } catch (schemaError) {
      console.warn('Database schema not found, using basic auth:', schemaError)
      userData = null
      userError = { message: 'Schema not found' }
    }

    // If user table doesn't exist or user not found, create a minimal user from auth data
    if (userError || !userData) {
      console.warn('User data not in database, using auth metadata. Error:', userError?.message)
      
      // Create a basic user from auth metadata
      const authUser = authData.user
      userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: authUser.user_metadata?.role || authUser.app_metadata?.role || 'admin',
        org_id: authUser.user_metadata?.org_id || authUser.app_metadata?.org_id || null,
        department: authUser.user_metadata?.department,
        specialization: authUser.user_metadata?.specialization
      }
    }

    // Get current subscription tier (safely handle missing data)
    const currentTier = userData.subscriptions?.[0]?.tier || userData.companies?.tier || authData.user.app_metadata?.tier || 'pro'

    // Create custom JWT claims
    const customClaims = {
      org_id: userData.org_id,
      role: userData.role,
      tier: currentTier,
      email: userData.email
    }

    // Update the user's auth metadata with our custom claims
    try {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        authData.user.id,
        {
          app_metadata: customClaims
        }
      )

      if (updateError) {
        console.error('Failed to update user metadata:', updateError)
        // Continue anyway, we'll fall back to database values
      }
    } catch (metaError) {
      console.warn('Could not update user metadata:', metaError)
    }

    // Refresh the session to get updated metadata
    let finalSession = authData.session
    try {
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: authData.session.refresh_token
      })
      
      // Use refreshed session if available, otherwise fall back to original
      finalSession = refreshedSession?.session || authData.session
    } catch (refreshErr) {
      console.warn('Could not refresh session:', refreshErr)
    }

    // Log successful login (gracefully handle missing audit_logs table)
    try {
      await supabase
        .from('audit_logs')
        .insert({
          org_id: userData.org_id,
          actor_id: userData.id,
          action: 'user_login',
          entity: 'user',
          entity_id: userData.id,
          description: `User ${userData.name} logged in`,
          meta: {
            login_method: 'email_password',
            success: true
          }
        })
    } catch (auditError) {
      console.warn('Could not log audit entry (table may not exist):', auditError)
    }

    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      specialization: userData.specialization,
      org_id: userData.org_id,
      tier: currentTier,
      company: userData.companies ? {
        id: userData.companies.id,
        name: userData.companies.name,
        domain: userData.companies.domain,
        tier: userData.companies.tier
      } : undefined
    }

    console.log('Auth successful, returning user:', { id: user.id, email: user.email, role: user.role })

    return {
      success: true,
      token: finalSession.access_token,
      access_token: finalSession.access_token,
      refresh_token: finalSession.refresh_token,
      user
    }

  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid request'
    }
  }
}

/**
 * Get authenticated user from request headers
 */
export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Missing or invalid authorization header')
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Check if this is a demo token
    if (token.startsWith('demo_')) {
      // Extract user ID from demo token
      const userId = token.split('_')[1]
      const demoUser = DEMO_ACCOUNTS.find(u => u.id === userId)
      if (demoUser) {
        return {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role as any,
          department: demoUser.department,
          specialization: demoUser.specialization,
          org_id: 'demo_org',
          tier: 'pro',
          isDemo: true
        }
      }
    }
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.warn('Invalid token:', authError?.message)
      return null
    }

    // Try to get user details (gracefully handle missing schema)
    let userData = null
    let userError = null
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies:org_id (
            id,
            name,
            domain,
            tier
          ),
          subscriptions:org_id (
            tier,
            status
          )
        `)
        .eq('id', user.id)
        .single()
      
      userData = data
      userError = error
    } catch (schemaError) {
      console.warn('Database schema not found in getAuthenticatedUser:', schemaError)
      userData = null
      userError = { message: 'Schema not found' }
    }

    // If user table doesn't exist or user not found, create a minimal user from auth data
    if (userError || !userData) {
      console.warn('User data not in database, using auth metadata')
      
      // Create a basic user from auth metadata
      userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: user.user_metadata?.role || user.app_metadata?.role || 'admin',
        org_id: user.user_metadata?.org_id || user.app_metadata?.org_id || null,
        department: user.user_metadata?.department,
        specialization: user.user_metadata?.specialization
      }
    }

    const currentTier = userData.subscriptions?.[0]?.tier || userData.companies?.tier || user.app_metadata?.tier || 'pro'

    const responseUser: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      specialization: userData.specialization,
      org_id: userData.org_id,
      tier: currentTier,
      company: userData.companies ? {
        id: userData.companies.id,
        name: userData.companies.name,
        domain: userData.companies.domain,
        tier: userData.companies.tier
      } : undefined
    }

    return responseUser

  } catch (error) {
    console.error('Get authenticated user error:', error)
    return null
  }
}
