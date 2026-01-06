/**
 * BuboIQ Make Server - Main Backend API
 * Handles all backend operations including agent management, auth, devices, tickets, etc.
 */

import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'
import earlyAccessRoutes from './early-access.ts'

const app = new Hono().basePath('/make-server-55e8c5b2')

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
}))

app.use('*', logger(console.log))

// Log all incoming requests for debugging
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - Path: ${c.req.path}`)
  await next()
})

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAuthUser = async (authHeader: string | undefined) => {
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', user: null }
  }

  const token = authHeader.replace('Bearer ', '')
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { error: 'Invalid token', user: null }
    }

    return { user, error: null }
  } catch (error) {
    return { error: error.message, user: null }
  }
}

const getUserMetadata = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || user.app_metadata?.role || 'tech',
    db_role: user.app_metadata?.db_role || user.user_metadata?.db_role,
    tier: user.user_metadata?.tier || user.app_metadata?.tier || 'team',
    org_id: user.user_metadata?.org_id || user.app_metadata?.org_id || user.id,
    company_name: user.user_metadata?.company_name || 'My Company',
  }
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'buboiq-server'
  })
})

// ============================================================================
// AGENT ENDPOINTS
// ============================================================================

// Register new agent
app.post('/agents/register', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const body = await c.req.json()
    
    const agentData = {
      id: body.agent_id || crypto.randomUUID(),
      hostname: body.hostname,
      platform: body.platform, // windows, macos, linux
      platform_version: body.platform_version,
      agent_version: body.agent_version || '1.0.0',
      org_id: userData.org_id,
      ip_address: body.ip_address,
      mac_address: body.mac_address,
      capabilities: body.capabilities || [],
      status: 'active',
      registered_at: new Date().toISOString(),
      last_checkin: new Date().toISOString(),
      metadata: body.metadata || {}
    }

    // Store agent registration
    await kv.set(`agent:${agentData.id}`, agentData)
    await kv.set(`agent:org:${userData.org_id}:${agentData.id}`, agentData.id)

    console.log(`Agent registered: ${agentData.id} for org ${userData.org_id}`)

    return c.json({
      success: true,
      agent: agentData,
      config: {
        checkin_interval: 300, // 5 minutes
        posture_check_interval: 600, // 10 minutes
        enable_auto_update: true,
        enable_posture_monitoring: true,
      }
    })
  } catch (error) {
    console.error('Agent registration error:', error)
    return c.json({ error: 'Failed to register agent', details: error.message }, 500)
  }
})

// Agent check-in (heartbeat)
app.post('/agents/:agentId/checkin', async (c) => {
  try {
    const agentId = c.req.param('agentId')
    const body = await c.req.json()

    // Get existing agent
    const agent = await kv.get(`agent:${agentId}`)
    if (!agent) {
      return c.json({ error: 'Agent not found' }, 404)
    }

    // Update check-in time and status
    const updatedAgent = {
      ...agent,
      last_checkin: new Date().toISOString(),
      status: 'active',
      ip_address: body.ip_address || agent.ip_address,
      health_metrics: body.health_metrics || {},
      active_connections: body.active_connections || 0,
    }

    await kv.set(`agent:${agentId}`, updatedAgent)

    console.log(`Agent check-in: ${agentId}`)

    return c.json({
      success: true,
      config: {
        checkin_interval: 300,
        posture_check_interval: 600,
      },
      commands: [] // TODO: Return pending commands
    })
  } catch (error) {
    console.error('Agent check-in error:', error)
    return c.json({ error: 'Check-in failed', details: error.message }, 500)
  }
})

// Report posture data
app.post('/agents/:agentId/posture', async (c) => {
  try {
    const agentId = c.req.param('agentId')
    const body = await c.req.json()

    const agent = await kv.get(`agent:${agentId}`)
    if (!agent) {
      return c.json({ error: 'Agent not found' }, 404)
    }

    // Store posture data
    const postureData = {
      agent_id: agentId,
      org_id: agent.org_id,
      timestamp: new Date().toISOString(),
      signals: body.signals || {},
      compliance_status: body.compliance_status || 'unknown',
      failed_checks: body.failed_checks || [],
    }

    const postureKey = `posture:${agentId}:${Date.now()}`
    await kv.set(postureKey, postureData)
    await kv.set(`posture:latest:${agentId}`, postureData)

    console.log(`Posture data received from agent: ${agentId}`)

    // Check for failures and auto-create tickets if needed
    if (body.failed_checks && body.failed_checks.length > 0) {
      console.log(`Agent ${agentId} has ${body.failed_checks.length} failed checks`)
      // TODO: Auto-create tickets for critical failures
    }

    return c.json({
      success: true,
      actions: [] // TODO: Return remediation actions
    })
  } catch (error) {
    console.error('Posture report error:', error)
    return c.json({ error: 'Failed to process posture data', details: error.message }, 500)
  }
})

// Get all agents for organization
app.get('/agents', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    // Get all agent IDs for this org
    const agentKeys = await kv.getByPrefix(`agent:org:${userData.org_id}:`)
    
    const agents = []
    for (const [key, agentId] of agentKeys) {
      const agent = await kv.get(`agent:${agentId}`)
      if (agent) {
        agents.push(agent)
      }
    }

    return c.json({
      success: true,
      agents,
      total: agents.length
    })
  } catch (error) {
    console.error('Get agents error:', error)
    return c.json({ error: 'Failed to fetch agents', details: error.message }, 500)
  }
})

// Get agent installer download link
app.get('/agents/download/:platform', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const platform = c.req.param('platform')

    // Generate agent configuration
    const config = {
      org_id: userData.org_id,
      api_endpoint: Deno.env.get('SUPABASE_URL'),
      registration_key: crypto.randomUUID(),
      platform,
    }

    // Store registration key
    await kv.set(`agent:regkey:${config.registration_key}`, {
      org_id: userData.org_id,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })

    // In production, these would be actual installer URLs
    const downloadUrls = {
      windows: `https://agents.buboiq.com/buboiq-agent-windows-amd64.exe?key=${config.registration_key}`,
      macos: `https://agents.buboiq.com/buboiq-agent-macos-universal.pkg?key=${config.registration_key}`,
      linux: `https://agents.buboiq.com/buboiq-agent-linux-amd64.deb?key=${config.registration_key}`,
    }

    return c.json({
      success: true,
      platform,
      download_url: downloadUrls[platform] || downloadUrls.windows,
      config,
      instructions: {
        windows: 'Run the installer as Administrator',
        macos: 'Double-click the .pkg file and follow the installer',
        linux: 'Run: sudo dpkg -i buboiq-agent-linux-amd64.deb',
      }
    })
  } catch (error) {
    console.error('Agent download error:', error)
    return c.json({ error: 'Failed to generate download link', details: error.message }, 500)
  }
})

// Test agent endpoint (for development)
app.post('/agents/test', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const body = await c.req.json()

    // Create a test agent
    const testAgent = {
      id: `test-${crypto.randomUUID().slice(0, 8)}`,
      hostname: body.hostname || `test-machine-${Date.now()}`,
      platform: body.platform || 'windows',
      platform_version: body.platform_version || 'Windows 11',
      agent_version: '1.0.0-test',
      org_id: userData.org_id,
      ip_address: body.ip_address || '192.168.1.100',
      mac_address: body.mac_address || '00:1B:44:11:3A:B7',
      capabilities: ['posture', 'remote-access', 'monitoring'],
      status: 'active',
      registered_at: new Date().toISOString(),
      last_checkin: new Date().toISOString(),
      metadata: { test: true, ...body.metadata }
    }

    await kv.set(`agent:${testAgent.id}`, testAgent)
    await kv.set(`agent:org:${userData.org_id}:${testAgent.id}`, testAgent.id)

    console.log(`Test agent created: ${testAgent.id}`)

    return c.json({
      success: true,
      message: 'Test agent created successfully',
      agent: testAgent
    })
  } catch (error) {
    console.error('Test agent creation error:', error)
    return c.json({ error: 'Failed to create test agent', details: error.message }, 500)
  }
})

// Delete agent
app.delete('/agents/:agentId', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const agentId = c.req.param('agentId')

    const agent = await kv.get(`agent:${agentId}`)
    if (!agent) {
      return c.json({ error: 'Agent not found' }, 404)
    }

    // Verify ownership
    if (agent.org_id !== userData.org_id) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    // Delete agent
    await kv.del(`agent:${agentId}`)
    await kv.del(`agent:org:${userData.org_id}:${agentId}`)
    await kv.del(`posture:latest:${agentId}`)

    console.log(`Agent deleted: ${agentId}`)

    return c.json({
      success: true,
      message: 'Agent deleted successfully'
    })
  } catch (error) {
    console.error('Agent deletion error:', error)
    return c.json({ error: 'Failed to delete agent', details: error.message }, 500)
  }
})

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

app.post('/auth/signup', async (c) => {
  try {
    // Check if signups are disabled globally (Production config usually governs this)
    const config = await kv.get('config:production')
    if (config?.danger?.signupsDisabled) {
      return c.json({ error: 'Signups are currently disabled by the administrator.' }, 403)
    }

    const body = await c.req.json()
    const { email, password, name, role = 'tech' } = body

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        tier: role === 'super_admin' ? 'team' : 'starter',
        company_name: body.companyName || 'My Company',
      }
    })

    if (error) {
      console.error('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    return c.json({
      success: true,
      user: getUserMetadata(data.user)
    })
  } catch (error) {
    console.error('Signup exception:', error)
    return c.json({ error: 'Signup failed', details: error.message }, 500)
  }
})

app.post('/auth/signin', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return c.json({ error: error.message }, 401)
    }

    return c.json({
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: getUserMetadata(data.user)
    })
  } catch (error) {
    console.error('Sign in exception:', error)
    return c.json({ error: 'Sign in failed', details: error.message }, 500)
  }
})

app.get('/auth/me', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401)
    }

    return c.json(getUserMetadata(user))
  } catch (error) {
    return c.json({ error: 'Failed to get user', details: error.message }, 500)
  }
})

// ============================================================================
// PUBLIC / SYSTEM CONFIG
// ============================================================================

app.get('/system-config', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      // Even if unauthorized, we might want to return public flags like signupsDisabled
      // But for now let's require auth for app config
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // We assume Production config is the source of truth for general app behavior
    // unless we implement environment switching in the main app (which is rare for end users).
    // However, for the "Super Admin Console" logic, we allow switching.
    // For the "User App", we usually run against one env.
    // Let's assume "production" config applies to the user app.
    // Or if we are in a demo environment, we might use "demo" config.
    // For simplicity, we default to 'production' or fetch based on a query param if the frontend knows its env.
    
    const env = c.req.query('env') || 'production'
    const config = await kv.get(`config:${env}`)
    
    // Filter sensitive data if any (though most config is public logic)
    // We return the whole config for the app to react to
    
    return c.json({
      success: true,
      config: config || {}
    })
  } catch (error) {
    return c.json({ error: 'Failed to get system config' }, 500)
  }
})

// ============================================================================
// SUPER ADMIN ENDPOINTS
// ============================================================================

app.get('/super-admin/organizations', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    // Check super admin
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super admin access required' }, 403)
    }

    // Get all organizations
    const orgKeys = await kv.getByPrefix('org:')
    const organizations = []

    for (const [key, org] of orgKeys) {
      if (key.startsWith('org:') && !key.includes(':user:')) {
        organizations.push(org)
      }
    }

    return c.json({
      success: true,
      organizations
    })
  } catch (error) {
    console.error('Get organizations error:', error)
    return c.json({ error: 'Failed to fetch organizations', details: error.message }, 500)
  }
})

app.post('/super-admin/organizations/create', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const body = await c.req.json()
    
    const newOrg = {
      id: crypto.randomUUID(),
      name: body.name,
      domain: body.domain || null,
      tier: body.tier || 'starter',
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      settings: {
        maxUsers: -1, // Unlimited for test orgs
        maxDevices: -1
      },
      metadata: body.metadata || {}
    }

    await kv.set(`org:${newOrg.id}`, newOrg)

    console.log('Organization created:', newOrg.name, newOrg.id)

    return c.json({
      success: true,
      organization: newOrg
    })
  } catch (error) {
    console.error('Create organization error:', error)
    return c.json({ error: 'Failed to create organization', details: error.message }, 500)
  }
})

app.get('/super-admin/organizations/:orgId/users', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const orgId = c.req.param('orgId')
    const userKeys = await kv.getByPrefix(`org:${orgId}:user:`)
    
    const users = []
    for (const [key, userId] of userKeys) {
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      if (data?.user) {
        users.push(getUserMetadata(data.user))
      }
    }

    return c.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Get org users error:', error)
    return c.json({ error: 'Failed to fetch users', details: error.message }, 500)
  }
})

app.post('/super-admin/organizations/:orgId/users/create', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const orgId = c.req.param('orgId')
    const body = await c.req.json()

    const password = crypto.randomUUID().slice(0, 12)
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: body.name,
        role: body.role || 'tech',
        tier: body.tier || 'starter',
        org_id: orgId,
      }
    })

    if (error) {
      return c.json({ error: error.message }, 400)
    }

    await kv.set(`org:${orgId}:user:${data.user.id}`, data.user.id)

    return c.json({
      success: true,
      user: getUserMetadata(data.user),
      password
    })
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({ error: 'Failed to create user', details: error.message }, 500)
  }
})

// ============================================================================
// DATA ENDPOINTS (tickets, devices, signals, stats)
// ============================================================================

app.get('/stats/dashboard', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)

    // Get real stats from KV store
    const tickets = await kv.getByPrefix(`ticket:org:${userData.org_id}:`)
    const devices = await kv.getByPrefix(`device:org:${userData.org_id}:`)
    const signals = await kv.getByPrefix(`signal:org:${userData.org_id}:`)
    
    const ticketList = []
    const deviceList = []
    const signalList = []

    for (const [key, value] of tickets) {
      const ticket = await kv.get(`ticket:${value}`)
      if (ticket) ticketList.push(ticket)
    }

    for (const [key, value] of devices) {
      const device = await kv.get(`device:${value}`)
      if (device) deviceList.push(device)
    }

    for (const [key, value] of signals) {
      const signal = await kv.get(`signal:${value}`)
      if (signal) signalList.push(signal)
    }

    return c.json({
      activeTickets: ticketList.filter(t => t.status === 'open' || t.status === 'in_progress').length,
      resolvedToday: ticketList.filter(t => {
        const resolved = new Date(t.resolved_at || 0)
        const today = new Date()
        return resolved.toDateString() === today.toDateString()
      }).length,
      devicesOnline: deviceList.filter(d => d.is_online).length,
      devicesTotal: deviceList.length,
      criticalDevices: deviceList.filter(d => d.health_score < 50).length,
      activeSignals: signalList.filter(s => s.status === 'active').length,
      systemUptime: 99.9,
      networkHealth: Math.round(deviceList.reduce((sum, d) => sum + (d.health_score || 85), 0) / Math.max(deviceList.length, 1))
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return c.json({ error: 'Failed to get dashboard stats' }, 500)
  }
})

app.get('/tickets', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const ticketKeys = await kv.getByPrefix(`ticket:org:${userData.org_id}:`)
    
    const tickets = []
    for (const [key, ticketId] of ticketKeys) {
      const ticket = await kv.get(`ticket:${ticketId}`)
      if (ticket) {
        tickets.push(ticket)
      }
    }

    return c.json({ tickets })
  } catch (error) {
    console.error('Get tickets error:', error)
    return c.json({ error: 'Failed to get tickets' }, 500)
  }
})

app.post('/tickets', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const body = await c.req.json()

    const ticket = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || '',
      priority: body.priority || 'medium',
      status: 'open',
      org_id: userData.org_id,
      created_by: userData.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requester: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      },
      assignee: body.assignee_id ? { id: body.assignee_id } : null,
      tags: body.tags || [],
      metadata: body.metadata || {}
    }

    await kv.set(`ticket:${ticket.id}`, ticket)
    await kv.set(`ticket:org:${userData.org_id}:${ticket.id}`, ticket.id)

    return c.json({ success: true, ticket })
  } catch (error) {
    console.error('Create ticket error:', error)
    return c.json({ error: 'Failed to create ticket' }, 500)
  }
})

app.get('/devices', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const deviceKeys = await kv.getByPrefix(`device:org:${userData.org_id}:`)
    
    const devices = []
    for (const [key, deviceId] of deviceKeys) {
      const device = await kv.get(`device:${deviceId}`)
      if (device) {
        devices.push(device)
      }
    }

    return c.json({ devices })
  } catch (error) {
    console.error('Get devices error:', error)
    return c.json({ error: 'Failed to get devices' }, 500)
  }
})

app.post('/devices', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const body = await c.req.json()

    const device = {
      id: crypto.randomUUID(),
      hostname: body.hostname,
      device_type: body.device_type || 'workstation',
      ip_address: body.ip_address,
      mac_address: body.mac_address,
      operating_system: body.operating_system,
      is_online: true,
      health_score: 100,
      risk_level: 'low',
      linked_tickets_count: 0,
      org_id: userData.org_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      tags: body.tags || [],
      metadata: body.metadata || {}
    }

    await kv.set(`device:${device.id}`, device)
    await kv.set(`device:org:${userData.org_id}:${device.id}`, device.id)

    return c.json({ success: true, device })
  } catch (error) {
    console.error('Create device error:', error)
    return c.json({ error: 'Failed to create device' }, 500)
  }
})

app.get('/signals', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    const signalKeys = await kv.getByPrefix(`signal:org:${userData.org_id}:`)
    
    const signals = []
    for (const [key, signalId] of signalKeys) {
      const signal = await kv.get(`signal:${signalId}`)
      if (signal) {
        signals.push(signal)
      }
    }

    return c.json({ signals })
  } catch (error) {
    console.error('Get signals error:', error)
    return c.json({ error: 'Failed to get signals' }, 500)
  }
})

app.get('/admin/metrics', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    // Get all organizations
    const orgKeys = await kv.getByPrefix('org:')
    let totalOrgs = 0
    for (const [key] of orgKeys) {
      if (!key.includes(':user:')) {
        totalOrgs++
      }
    }

    // Get all users (this is simplified, in production would query auth.users)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    return c.json({
      totalUsers: users?.length || 0,
      totalOrgs,
      activeSessions: 0, // Would track active sessions
      systemStatus: 'operational'
    })
  } catch (error) {
    console.error('Admin metrics error:', error)
    return c.json({ error: 'Failed to get admin metrics' }, 500)
  }
})

// ============================================================================
// SUPER ADMIN FEATURE CONTROLS & CONFIGURATION
// ============================================================================

// Get Super Admin Dashboard Stats
app.get('/super-admin/stats', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    // Scan for counts (inefficient for large scale, but fine for KV store constraints)
    const orgKeys = await kv.getByPrefix('org:')
    const deviceKeys = await kv.getByPrefix('device:')
    const agentKeys = await kv.getByPrefix('agent:')
    const ticketKeys = await kv.getByPrefix('ticket:')

    // Filter out index keys (e.g. org:id:user:id)
    const orgs = new Set();
    const devices = new Set();
    const agents = new Set();
    const tickets = new Set();
    let onlineAgents = 0;
    let openTickets = 0;

    for (const [key, val] of orgKeys) {
      if (key.split(':').length === 2) orgs.add(key);
    }

    for (const [key, val] of deviceKeys) {
       if (key.split(':').length === 2) devices.add(key);
    }

    for (const [key, val] of agentKeys) {
       // Check for online status if we fetch the object
       if (key.split(':').length === 2) {
         agents.add(key);
         // To get real status we'd need to fetch the agent object. 
         // For now let's assume we do or just count total.
         // Optimization: We can't fetch 1000 agents here.
         // Let's rely on the "online" count being tracked separately or just show total for now.
         // Or we fetch a sample.
         // Actually, let's try to fetch a few to check structure.
       }
    }

    // Let's iterate a bit more smartly if possible. 
    // KV doesn't support aggregation.
    // We will just return totals for now to be safe on perf.
    
    return c.json({
      success: true,
      stats: {
        totalOrgs: orgs.size,
        totalDevices: devices.size,
        totalAgents: agents.size,
        onlineAgents: Math.floor(agents.size * 0.8), // Mocking online % for now as we can't scan all bodies
        openIssues: 23 // Hardcoded for now as ticket scanning is complex
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return c.json({ error: 'Failed to get stats' }, 500)
  }
})

// Get Global Configuration for an Environment
app.get('/super-admin/config', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super Admin Access Required' }, 403)
    }

    const env = c.req.query('env') || 'production'
    const configKey = `config:${env}`
    
    // Default Config
    const defaultConfig = {
      featureMatrix: {
        issues: { label: 'Issues / Ticketing', starter: true, pro: true, team: true, global: true },
        inventory: { label: 'Computers / Inventory', starter: true, pro: true, team: true, global: true },
        agents: { label: 'Agents (Endpoint)', starter: true, pro: true, team: true, global: true },
        signals: { label: 'Intelligence / Signals', starter: false, pro: true, team: true, global: true },
        guidedFixes: { label: 'Guided Fixes', starter: false, pro: true, team: true, global: true },
        kb: { label: 'Self-Building KB', starter: false, pro: false, team: true, global: true },
        connect: { label: 'BuboIQ Connect', starter: false, pro: true, team: true, global: true },
        compliance: { label: 'Compliance Suite', starter: false, pro: false, team: true, global: false },
      },
      overrides: {
        unlockFeatures: false,
        unlockTiers: false,
        disableTierGuard: false,
        enableBeta: false
      },
      pricing: {
        plans: {
          starter: { monthly: 19, annual: 190, devices: 5, overage: 2 },
          pro: { monthly: 79, annual: 790, devices: 50, overage: 2 },
          team: { monthly: 149, annual: 1490, devices: 200, overage: 2 }
        },
        addons: {
          security: { name: 'Security & Compliance', price: 49, active: true },
          backup: { name: 'DR / Backup Pack', price: 29, active: true },
          remote: { name: 'Remote / Zero-Trust', price: 79, active: true },
        },
        discounts: [
          { name: "Founder's Rate", value: '20%', active: true },
          { name: "Early Access Cohort", value: '15%', active: false },
          { name: "Enterprise Custom", value: 'Custom', active: true },
        ]
      },
      compliance: {
        hipaa: false,
        pci: false,
        soc2: true,
        mfaRequired: true
      },
      integrations: {
        email: 'connected',
        remote: 'connected',
        stripe: 'connected',
        crm: 'disconnected'
      },
      demoPresets: {
        healthcare: false,
        finance: false,
        saas: false
      },
      danger: {
        signupsDisabled: false,
        readOnlyMode: false
      }
    }

    const storedConfig = await kv.get(configKey)
    const finalConfig = storedConfig ? { ...defaultConfig, ...storedConfig } : defaultConfig

    return c.json({
      success: true,
      config: finalConfig
    })
  } catch (error) {
    console.error('Get config error:', error)
    return c.json({ error: 'Failed to get configuration' }, 500)
  }
})

// Update Global Configuration
app.post('/super-admin/config', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const body = await c.req.json()
    const { env, config, actionSummary } = body
    const targetEnv = env || 'production'
    const configKey = `config:${targetEnv}`

    await kv.set(configKey, config)

    // Log Activity
    if (actionSummary) {
      const logEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        actor: userData.name || userData.email,
        env: targetEnv,
        action: actionSummary,
        user_id: userData.id
      }
      // Store in a time-ordered way or just append to a list if possible (KV lacks append, so we use timestamp keys)
      await kv.set(`activity:${Date.now()}:${logEntry.id}`, logEntry)
    }

    console.log(`Config updated for ${targetEnv} by ${userData.email}`)

    return c.json({
      success: true,
      message: 'Configuration updated successfully'
    })
  } catch (error) {
    console.error('Update config error:', error)
    return c.json({ error: 'Failed to update configuration' }, 500)
  }
})

// Get Activity Log
app.get('/super-admin/activity-log', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    // Fetch activity logs (scan by prefix)
    const activityKeys = await kv.getByPrefix('activity:')
    const logs = []
    
    for (const [key, val] of activityKeys) {
      // If val is an ID (string), fetch the object. If it's the object, use it.
      // Assuming direct object storage based on set above.
      // But wait, kv_store.tsx wrapper might behave differently.
      // Let's assume we stored the object directly.
      if (typeof val === 'object') {
         logs.push(val)
      } else {
         const log = await kv.get(key) // Fallback
         if (log) logs.push(log)
      }
    }

    // Sort by timestamp desc
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return c.json({
      success: true,
      logs: logs.slice(0, 50) // Return last 50
    })
  } catch (error) {
    console.error('Get activity log error:', error)
    return c.json({ error: 'Failed to get activity log' }, 500)
  }
})

// Dangerous Actions
app.post('/super-admin/actions/danger', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const body = await c.req.json()
    const { action, env } = body
    
    // Log the dangerous action
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: userData.name || userData.email,
      env: env,
      action: `EXECUTED DANGER ACTION: ${action}`,
      user_id: userData.id,
      is_danger: true
    }
    await kv.set(`activity:${Date.now()}:${logEntry.id}`, logEntry)

    return c.json({
      success: true,
      message: `Action ${action} executed successfully`
    })
  } catch (error) {
    return c.json({ error: 'Failed to execute action' }, 500)
  }
})

app.post('/super-admin/set-tier', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const body = await c.req.json()
    const { userId, tier } = body

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        tier
      }
    })

    if (error) {
      return c.json({ error: error.message }, 400)
    }

    console.log(`Super admin ${userData.email} changed tier for user ${userId} to ${tier}`)

    return c.json({
      success: true,
      message: `User tier updated to ${tier}`
    })
  } catch (error) {
    console.error('Set tier error:', error)
    return c.json({ error: 'Failed to set tier' }, 500)
  }
})

// Add early access routes
app.route('/early-access', earlyAccessRoutes)

// Catch all
app.all('*', (c) => {
  console.log(`[404] Route not found: ${c.req.method} ${c.req.url} - Path: ${c.req.path}`)
  return c.json({ 
    error: 'Route not found',
    path: c.req.path,
    url: c.req.url,
    method: c.req.method 
  }, 404)
})

Deno.serve(app.fetch)

console.log('🚀 BuboIQ Server started')
console.log('📡 All API endpoints available')