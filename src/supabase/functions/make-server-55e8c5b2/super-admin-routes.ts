import { Hono } from 'npm:hono@4';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.ts';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to verify super admin
async function verifySuperAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.warn('Invalid token in super admin verification:', authError?.message);
      return null;
    }

    // Check if user is super admin (hardcoded check for Kevin)
    const isSuperAdmin = user.email?.toLowerCase() === 'kevinh@buboiq.com' || 
                         user.user_metadata?.role === 'super_admin' ||
                         user.app_metadata?.role === 'super_admin';
    
    if (!isSuperAdmin) {
      console.warn('User is not super admin:', user.email);
      return null;
    }

    // Return super admin user info
    return {
      id: user.id,
      email: user.email,
      role: 'super_admin',
      name: user.user_metadata?.name || 'Super Admin'
    };
  } catch (error) {
    console.error('Super admin verification error:', error);
    return null;
  }
}

// GET /super-admin/stats - Dashboard statistics
app.get('/stats', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    // Get all users from KV store
    const userKeys = await kv.getByPrefix('user:');
    const users = userKeys || [];
    
    // Get all organizations (if you have them)
    const orgKeys = await kv.getByPrefix('org:');
    const organizations = orgKeys || [];

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      totalOrganizations: organizations.length,
      activeUsers: users.filter((u: any) => !u.isDemo).length,
      demoUsers: users.filter((u: any) => u.isDemo).length,
      superAdmins: users.filter((u: any) => u.role === 'super_admin').length,
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.error('Super admin stats error:', error);
    return c.json({ error: 'Failed to fetch stats: ' + error.message }, 500);
  }
});

// GET /super-admin/organizations - List all organizations
app.get('/organizations', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const orgKeys = await kv.getByPrefix('org:');
    const organizations = orgKeys || [];

    return c.json({ success: true, organizations });
  } catch (error) {
    console.error('Super admin organizations error:', error);
    return c.json({ error: 'Failed to fetch organizations: ' + error.message }, 500);
  }
});

// POST /super-admin/organizations/:id/toggle-status - Toggle organization status
app.post('/organizations/:id/toggle-status', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const orgId = c.req.param('id');
    const org = await kv.get(`org:${orgId}`);
    
    if (!org) {
      return c.json({ error: 'Organization not found' }, 404);
    }

    // Toggle status
    org.status = org.status === 'active' ? 'inactive' : 'active';
    await kv.set(`org:${orgId}`, org);

    return c.json({ success: true, organization: org });
  } catch (error) {
    console.error('Toggle organization status error:', error);
    return c.json({ error: 'Failed to toggle status: ' + error.message }, 500);
  }
});

// GET /super-admin/users - List all users
app.get('/users', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const userKeys = await kv.getByPrefix('user:');
    const users = userKeys || [];

    return c.json({ success: true, users });
  } catch (error) {
    console.error('Super admin users error:', error);
    return c.json({ error: 'Failed to fetch users: ' + error.message }, 500);
  }
});

// POST /super-admin/users/:id/role - Update user role
app.post('/users/:id/role', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const userId = c.req.param('id');
    const { role } = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update role
    user.role = role;
    await kv.set(`user:${userId}`, user);

    return c.json({ success: true, user });
  } catch (error) {
    console.error('Update user role error:', error);
    return c.json({ error: 'Failed to update role: ' + error.message }, 500);
  }
});

// POST /super-admin/users/create - Create new user
app.post('/users/create', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const { email, name, role, password } = await c.req.json();

    // Check if user exists
    const existingUserId = await kv.get(`user_email:${email}`);
    if (existingUserId) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      app_metadata: { role },
      email_confirm: true
    });

    if (error) {
      return c.json({ error: 'Failed to create user: ' + error.message }, 500);
    }

    // Create user profile
    const userId = data.user.id;
    const userProfile = {
      id: userId,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    await kv.set(`user:${userId}`, userProfile);
    await kv.set(`user_email:${email}`, userId);

    return c.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Failed to create user: ' + error.message }, 500);
  }
});

// POST /super-admin/impersonate - Impersonate a user
app.post('/impersonate', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const { userId } = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Create impersonation token (simplified - in production use proper JWT signing)
    const impersonationToken = btoa(JSON.stringify({
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      impersonatedBy: superAdmin.id,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }));

    return c.json({ 
      success: true, 
      token: impersonationToken,
      user 
    });
  } catch (error) {
    console.error('Impersonate error:', error);
    return c.json({ error: 'Failed to impersonate user: ' + error.message }, 500);
  }
});

// POST /super-admin/organizations/create - Create new organization
app.post('/organizations/create', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const { name, domain, tier, status } = await c.req.json();

    // Generate org ID
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create organization profile
    const organization = {
      id: orgId,
      name,
      domain: domain || null,
      tier: tier || 'starter',
      status: status || 'active',
      createdAt: new Date().toISOString(),
      settings: {
        maxUsers: tier === 'enterprise' ? -1 : tier === 'team' ? 50 : tier === 'pro' ? 10 : 5,
        maxDevices: tier === 'enterprise' ? -1 : tier === 'team' ? 500 : tier === 'pro' ? 100 : 25
      }
    };

    await kv.set(`org:${orgId}`, organization);

    // Also store organization by domain for lookup
    if (domain) {
      await kv.set(`org_domain:${domain}`, orgId);
    }

    return c.json({ success: true, organization });
  } catch (error) {
    console.error('Create organization error:', error);
    return c.json({ error: 'Failed to create organization: ' + error.message }, 500);
  }
});

// POST /super-admin/organizations/:id/users/create - Create user in organization
app.post('/organizations/:orgId/users/create', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const orgId = c.req.param('orgId');
    const { email, name, role, password, tier } = await c.req.json();

    // Check if organization exists
    const org = await kv.get(`org:${orgId}`);
    if (!org) {
      return c.json({ error: 'Organization not found' }, 404);
    }

    // Check if user exists
    const existingUserId = await kv.get(`user_email:${email}`);
    if (existingUserId) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Create auth user with Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: password || 'Welcome123!', // Default password
      user_metadata: { 
        name: name || email.split('@')[0], 
        role: role || 'owner',
        org_id: orgId,
        tier: tier || org.tier || 'starter'
      },
      app_metadata: { 
        role: role || 'owner',
        org_id: orgId,
        tier: tier || org.tier || 'starter'
      },
      email_confirm: true
    });

    if (error) {
      return c.json({ error: 'Failed to create user: ' + error.message }, 500);
    }

    // Create user profile in KV store
    const userId = data.user.id;
    const userProfile = {
      id: userId,
      email,
      name: name || email.split('@')[0],
      role: role || 'owner',
      org_id: orgId,
      tier: tier || org.tier || 'starter',
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    await kv.set(`user:${userId}`, userProfile);
    await kv.set(`user_email:${email}`, userId);

    // Add user to organization's user list
    const orgUsersKey = `org_users:${orgId}`;
    const orgUsers = await kv.get(orgUsersKey) || [];
    orgUsers.push(userId);
    await kv.set(orgUsersKey, orgUsers);

    return c.json({ success: true, user: userProfile, defaultPassword: password || 'Welcome123!' });
  } catch (error) {
    console.error('Create user in organization error:', error);
    return c.json({ error: 'Failed to create user: ' + error.message }, 500);
  }
});

// GET /super-admin/organizations/:id/users - Get users in organization
app.get('/organizations/:orgId/users', async (c) => {
  try {
    const superAdmin = await verifySuperAdmin(c.req.header('Authorization'));
    
    if (!superAdmin) {
      return c.json({ error: 'Unauthorized - Super admin access required' }, 401);
    }

    const orgId = c.req.param('orgId');

    // Check if organization exists
    const org = await kv.get(`org:${orgId}`);
    if (!org) {
      return c.json({ error: 'Organization not found' }, 404);
    }

    // Get all users for this organization
    const orgUsersKey = `org_users:${orgId}`;
    const userIds = await kv.get(orgUsersKey) || [];
    
    const users = [];
    for (const userId of userIds) {
      const user = await kv.get(`user:${userId}`);
      if (user) {
        users.push(user);
      }
    }

    return c.json({ success: true, users, organization: org });
  } catch (error) {
    console.error('Get organization users error:', error);
    return c.json({ error: 'Failed to fetch users: ' + error.message }, 500);
  }
});

export default app;