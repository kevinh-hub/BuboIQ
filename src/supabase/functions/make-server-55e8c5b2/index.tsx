/**
 * BuboIQ Make Server - Main Backend API
 * Handles all backend operations including agent management, auth, devices, tickets, etc.
 */

import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from '../server/kv_store.tsx'

const app = new Hono()

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
// ROUTES - /make-server-55e8c5b2/*
// ============================================================================

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'buboiq-make-server'
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
// AUTH ENDPOINTS (existing from your auth system)
// ============================================================================

app.post('/auth/signup', async (c) => {
  try {
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
// MOCK DATA ENDPOINTS (for development)
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
// SUPER ADMIN FEATURE CONTROLS
// ============================================================================

app.get('/super-admin/feature-overrides', async (c) => {
  try {
    const { error: authError, user } = await getAuthUser(c.req.header('Authorization'))
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = getUserMetadata(user)
    
    if (userData.db_role !== 'super_admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }

    const overrides = await kv.get('feature_overrides') || {}

    return c.json({
      success: true,
      overrides
    })
  } catch (error) {
    console.error('Get feature overrides error:', error)
    return c.json({ error: 'Failed to get feature overrides' }, 500)
  }
})

app.post('/super-admin/feature-overrides', async (c) => {
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
    
    await kv.set('feature_overrides', body.overrides)

    console.log('Feature overrides updated by super admin:', userData.email)

    return c.json({
      success: true,
      message: 'Feature overrides updated'
    })
  } catch (error) {
    console.error('Update feature overrides error:', error)
    return c.json({ error: 'Failed to update feature overrides' }, 500)
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

// Catch all
app.all('*', (c) => {
  console.log(`[404] Route not found: ${c.req.method} ${c.req.url}`)
  return c.json({ 
    error: 'Route not found',
    path: c.req.url,
    method: c.req.method 
  }, 404)
})

Deno.serve(app.fetch)

console.log('🚀 BuboIQ Make Server started')
console.log('📡 Agent endpoints available at /make-server-55e8c5b2/agents/*')