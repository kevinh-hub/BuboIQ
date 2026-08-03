import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import JSZip from 'npm:jszip'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.ts'
import { DEMO_ACCOUNTS, STORAGE_BUCKETS } from './constants.ts'
import { 
  findDemoAccount, 
  getAuthenticatedUser, 
  processDemoLogin, 
  processRegularAuth 
} from './auth.ts'
import { 
  initializeStorageBuckets, 
  initializeIntelligenceData 
} from './init.ts'
import {
  getIncidents,
  getIncidentById,
  addIncidentAssessment,
  getAIMetrics,
  getNeuralStatus,
  getAnalysts
} from './intelligence.ts'
import remote from './remote.ts'
import integrations from './integrations.ts'
import demoLeads from './demo-leads.ts'
import leadExport from './lead-export.ts'
import earlyAccess from './early-access.ts'
import guidedFixes from './guided-fixes.ts'
import admin from './admin.ts'
import * as compliance from './compliance.ts'
import superAdminRoutes from './super-admin-routes.ts'

// Import fixed modules
import tickets from './tickets.ts'
import devices from './devices.ts'
import signals from './signals.ts'
import stats from './stats.ts'
import intelligence from './intelligence.ts'
import users from './users.ts'

const app = new Hono()

// Create Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// --- Agent Memory: org-scoped episodic memory ---

async function buildMemoryContext(orgId: string): Promise<string> {
  const { data: memories, error } = await supabase
    .from('agent_memory')
    .select('category, fact')
    .eq('org_id', orgId)
    .eq('active', true)
    .order('last_referenced_at', { ascending: false })
    .limit(15)

  if (error) {
    console.error('[Memory] fetch error:', error)
    return ''
  }
  if (!memories || memories.length === 0) return ''

  const grouped: Record<string, string[]> = {}
  for (const m of memories) {
    if (!grouped[m.category]) grouped[m.category] = []
    grouped[m.category].push(m.fact)
  }

  let ctx = '\n\nWhat you remember about this customer:\n'
  for (const [category, facts] of Object.entries(grouped)) {
    ctx += `${category}: ${facts.join('; ')}\n`
  }
  return ctx
}

async function extractAndStoreMemory(orgId: string, ticketId: string | null, ticketSummary: string, resolution: string): Promise<any[]> {
  const system = `You are extracting durable facts about an MSP customer's environment from a resolved support ticket. Extract 1-3 short, reusable facts worth remembering for future tickets at this same organization (specific software/hardware in use, recurring issue patterns, environment quirks, resolution steps that worked). Skip anything ticket-specific or one-off.
Respond ONLY with a JSON array, no markdown, no explanation.
Schema: [{ "category": "environment|recurring_issue|resolution|preference|contact", "fact": "string" }]
If nothing durable is worth storing, respond with []`

  const user = `Ticket summary: ${ticketSummary}
Resolution: ${resolution}`

  const raw = await callClaude(system, user)

  let facts: any[] = []
  try { facts = JSON.parse(stripJSON(raw)) } catch { facts = [] }
  if (!Array.isArray(facts) || facts.length === 0) return []

  const rows = facts.map((f: any) => ({
    org_id: orgId,
    category: f.category,
    fact: f.fact,
    source_ticket_id: ticketId
  }))

  const { data: inserted, error } = await supabase.from('agent_memory').insert(rows).select()
  if (error) {
    console.error('[Memory] insert error:', error)
    return []
  }
  console.log(`[Memory] stored ${inserted?.length ?? 0} facts for org ${orgId}`)
  return inserted ?? []
}

// POST /memory/extract-from-ticket
app.post('/make-server-55e8c5b2/memory/extract-from-ticket', async (c) => {
  try {
    const { org_id, ticket_id, ticket_summary, resolution } = await c.req.json()
    if (!org_id || !ticket_summary || !resolution) {
      return c.json({ error: 'org_id, ticket_summary, and resolution required' }, 400)
    }
    const stored = await extractAndStoreMemory(org_id, ticket_id ?? null, ticket_summary, resolution)
    return c.json({ success: true, stored })
  } catch (e: any) {
    console.error('[Memory] extract error:', e)
    return c.json({ error: e.message }, 500)
  }
})

// GET /memory/:orgId
app.get('/make-server-55e8c5b2/memory/:orgId', async (c) => {
  try {
    const orgId = c.req.param('orgId')
    const { data, error } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('org_id', orgId)
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (error) return c.json({ error: error.message }, 500)
    return c.json({ success: true, memories: data })
  } catch (e: any) {
    console.error('[Memory] list error:', e)
    return c.json({ error: e.message }, 500)
  }
})

// Global initialization flag
let isInitialized = false

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'apikey'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
app.use('*', logger(console.log))

// Health Check Endpoint - Production Monitoring
app.get('/make-server-55e8c5b2/health', async (c) => {
  try {
    // Check database connectivity
    const { data: dbCheck, error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single()
    
    // Check email service (Resend API key present)
    const emailConfigured = !!Deno.env.get('RESEND_API_KEY')
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      services: {
        database: dbError ? 'error' : 'ok',
        email: emailConfigured ? 'ok' : 'warning',
        storage: 'ok'
      },
      initialized: isInitialized
    }
    
    // Return 200 if all critical services OK
    const statusCode = health.services.database === 'ok' ? 200 : 503
    
    return c.json(health, statusCode)
  } catch (error) {
    return c.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    }, 500)
  }
})

// Initialize BuboIQ AI Intelligence Platform
app.get('/init', async (c) => {
  try {
    console.log('Initializing BuboIQ AI Intelligence Platform...')
    
    // Create storage buckets for intelligence data
    await initializeStorageBuckets()
    
    // Initialize AI intelligence data
    await initializeIntelligenceData()
    
    isInitialized = true
    
    return c.json({ 
      success: true, 
      message: 'BuboIQ Intelligence Platform initialized successfully',
      timestamp: new Date().toISOString(),
      platform: 'BuboIQ AI Intelligence',
      version: '2.0.0',
      intelligenceAnalysts: DEMO_ACCOUNTS.length
    })
  } catch (error) {
    console.error('Initialization error:', error)
    return c.json({ 
      success: false, 
      error: 'Failed to initialize intelligence platform: ' + error.message 
    }, 500)
  }
})

// Authentication endpoints
app.post('/make-server-55e8c5b2/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'user' } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    console.log(`Creating user: ${email} with role: ${role}`)

    // Check if user already exists
    const existingUserId = await kv.get(`user_email:${email}`)
    if (existingUserId) {
      console.log(`User already exists: ${email}`)
      return c.json({ error: 'User already exists' }, 409)
    }

    // Prepare user metadata based on role
    const userMetadata = { name, role }
    const appMetadata: any = {}
    
    // For super admin, set special metadata
    if (role === 'super_admin') {
      appMetadata.role = 'super_admin'
      appMetadata.tier = 'team'
      appMetadata.org_id = null // Super admins don't belong to an org
    }

    // Create auth user with admin.createUser (uses service role key)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
      email_confirm: true // Auto-confirm since no email server is configured
    })

    if (error) {
      console.error('Auth user creation error:', error)
      return c.json({ error: 'Failed to create user: ' + error.message }, 500)
    }

    console.log(`Auth user created successfully: ${data.user.id}`)

    // Create user profile
    const userId = data.user.id
    const userProfile = {
      id: userId,
      email,
      name,
      role,
      department: null,
      avatar: null,
      createdAt: new Date().toISOString(),
      isDemo: false
    }

    await kv.set(`user:${userId}`, userProfile)
    await kv.set(`user_email:${email}`, userId)

    console.log(`User profile stored in KV: ${userId}`)

    return c.json({ 
      success: true, 
      user: userProfile,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Internal server error: ' + error.message }, 500)
  }
})

// Handler function for signin logic (reusable)
async function handleSignIn(c: any) {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    console.log(`Login attempt for email: ${email} with password type: ${password === 'demo' ? 'demo' : 'regular'}`)

    // Check if this is a demo account first (regardless of password)
    let user = null
    
    // First try to get from KV store
    try {
      const userId = await kv.get(`user_email:${email}`)
      if (userId) {
        user = await kv.get(`user:${userId}`)
        console.log('Found user in KV store:', user?.name)
      }
    } catch (kvError) {
      console.error('KV store error:', kvError)
    }
    
    // Fallback to in-memory demo accounts
    if (!user) {
      console.log('User not found in KV store, checking fallback demo accounts...')
      user = findDemoAccount(email)
      if (user) {
        console.log('Found demo user in fallback:', user.name)
        // Store in KV for future requests
        try {
          await kv.set(`user:${user.id}`, user)
          await kv.set(`user_email:${email}`, user.id)
          console.log('Stored demo user in KV store for future use')
        } catch (storeError) {
          console.error('Error storing demo user in KV:', storeError)
          // Continue anyway - we have the user data
        }
      }
    }
    
    // If we found a demo user, authenticate with demo password
    if (user && user.isDemo) {
      console.log('Processing demo account login...')
      const result = await processDemoLogin(user, password)
      return c.json(result, result.success ? 200 : 401)
    }

    // Regular auth for real users (non-demo accounts)
    const result = await processRegularAuth(email, password)
    return c.json(result, result.success ? 200 : (result.error === 'User profile not found' ? 404 : 401))
  } catch (error) {
    console.error('Signin error:', error)
    return c.json({ error: 'Internal server error: ' + error.message }, 500)
  }
}

// Register signin on BOTH paths for compatibility
app.post('/make-server-55e8c5b2/auth/signin', handleSignIn)
app.post('/auth/signin', handleSignIn)

// Intelligence Analyst Management
app.get('/analysts', getAnalysts)

app.get('/make-server-55e8c5b2/profile', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    return c.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    return c.json({ error: 'Failed to fetch profile: ' + error.message }, 500)
  }
})

// Auth /me endpoint for getting current user
app.get('/make-server-55e8c5b2/auth/me', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    return c.json({ success: true, user })
  } catch (error) {
    console.error('Get current user error:', error)
    return c.json({ error: 'Failed to fetch current user: ' + error.message }, 500)
  }
})

// Intelligence Incident Management
app.get('/incidents', getIncidents)
app.get('/incidents/:id', getIncidentById)
app.post('/incidents/:id/assessments', addIncidentAssessment)

// AI Intelligence Metrics
app.get('/ai-metrics', getAIMetrics)

// Neural Network Status
app.get('/neural-status', getNeuralStatus)

// Remote Support Routes
app.route('/remote', remote)

// Integrations & Webhooks Routes
app.route('/integrations', integrations)

// Partner Routing & Lead Management
import partnerLeads from './partner-leads.ts'
app.route('/', partnerLeads)

// =================================================================
// FIXED MODULE ROUTING - REPLACED PROXIES WITH DIRECT IMPORTS
// =================================================================

// Tickets API
// Supports /tickets and /make-server-55e8c5b2/tickets
app.route('/tickets', tickets)
app.route('/make-server-55e8c5b2/tickets', tickets)

// Signals API
app.route('/signals', signals)
app.route('/make-server-55e8c5b2/signals', signals)

// Devices API
app.route('/devices', devices)
app.route('/make-server-55e8c5b2/devices', devices)

// Stats API
app.route('/stats', stats)
app.route('/make-server-55e8c5b2/stats', stats)

// Users API
app.route('/users', users)
app.route('/make-server-55e8c5b2/users', users)

// Intelligence API (if it's a Hono app, otherwise we use endpoints above)
// app.route('/intelligence', intelligence) 
// Note: intelligence.ts seems to export functions, not a Hono app. 
// But the original code tried to route to it. Let's check intelligence.ts content if needed.
// For now, we keep the explicit endpoints for intelligence above.
// If there are other routes under /intelligence/* they need to be handled.

// ============= COMPLIANCE API ROUTES =============

// PHI Detection & Healthcare Compliance
app.post('/compliance/phi/scan', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const { entityType, entityId, content } = await c.req.json()
    const result = await compliance.scanAndLogPHI(supabase, user.orgId, entityType, entityId, content)
    
    return c.json(result)
  } catch (error) {
    console.error('PHI scan error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.get('/compliance/phi/logs', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const { data, error } = await supabase
      .from('phi_detection_logs')
      .select('*')
      .eq('org_id', user.orgId)
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    return c.json({ logs: data })
  } catch (error) {
    console.error('PHI logs error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.put('/compliance/phi/redact/:logId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const logId = c.req.param('logId')
    const { action } = await c.req.json() // 'approve', 'redact', 'false_positive'
    
    const { data, error } = await supabase
      .from('phi_detection_logs')
      .update({
        redaction_status: action,
        redacted_by: user.id,
        updated_at: new Date(),
      })
      .eq('id', logId)
      .eq('org_id', user.orgId)
      .select()
      .single()
    
    if (error) throw error
    return c.json({ log: data })
  } catch (error) {
    console.error('PHI redaction error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Device Posture Validation
app.post('/compliance/posture/update', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const postureData = await c.req.json()
    const result = await compliance.updateDevicePosture(supabase, {
      ...postureData,
      orgId: user.orgId,
    })
    
    return c.json({ posture: result })
  } catch (error) {
    console.error('Posture update error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.get('/compliance/posture/device/:deviceId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const deviceId = c.req.param('deviceId')
    const posture = await compliance.getDevicePosture(supabase, deviceId)
    
    return c.json({ posture })
  } catch (error) {
    console.error('Posture fetch error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.get('/compliance/posture/non-compliant', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const devices = await compliance.getNonCompliantDevices(supabase, user.orgId)
    
    return c.json({ devices })
  } catch (error) {
    console.error('Non-compliant devices error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Breach Incident Management
app.post('/compliance/breach/create', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const incidentData = await c.req.json()
    const incident = await compliance.createBreachIncident(supabase, user.orgId, {
      ...incidentData,
      createdBy: user.id,
    })
    
    return c.json({ incident })
  } catch (error) {
    console.error('Breach creation error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.get('/compliance/breach/incidents', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const status = c.req.query('status')
    const severity = c.req.query('severity')
    
    const incidents = await compliance.getBreachIncidents(supabase, user.orgId, {
      status,
      severity,
    })
    
    return c.json({ incidents })
  } catch (error) {
    console.error('Breach incidents error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.put('/compliance/breach/workflow/:stepId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const stepId = c.req.param('stepId')
    const updates = await c.req.json()
    
    const step = await compliance.updateBreachWorkflowStep(supabase, stepId, updates)
    
    return c.json({ step })
  } catch (error) {
    console.error('Workflow step error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Network Segmentation (Finance/PCI)
app.post('/compliance/zones/create', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const zoneData = await c.req.json()
    const zone = await compliance.createNetworkZone(supabase, user.orgId, zoneData)
    
    return c.json({ zone })
  } catch (error) {
    console.error('Zone creation error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.post('/compliance/zones/assign', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const { deviceId, zoneId } = await c.req.json()
    const assignment = await compliance.assignDeviceToZone(supabase, deviceId, zoneId, user.id)
    
    return c.json({ assignment })
  } catch (error) {
    console.error('Zone assignment error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.get('/compliance/zones/check/:fromZoneId/:toZoneId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const fromZoneId = c.req.param('fromZoneId')
    const toZoneId = c.req.param('toZoneId')
    
    const authorized = await compliance.checkZoneAccessAuthorization(supabase, fromZoneId, toZoneId)
    
    return c.json({ authorized })
  } catch (error) {
    console.error('Zone check error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Cardholder Data Monitoring (PCI-DSS)
app.post('/compliance/cardholder/log', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const accessData = await c.req.json()
    const log = await compliance.logCardholderAccess(supabase, user.orgId, {
      ...accessData,
      userId: user.id,
    })
    
    return c.json({ log })
  } catch (error) {
    console.error('Cardholder log error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.post('/compliance/pci/scan', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const { scanType } = await c.req.json()
    const scanId = await compliance.runPCIComplianceScan(supabase, user.orgId, scanType)
    
    return c.json({ scanId })
  } catch (error) {
    console.error('PCI scan error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Anomaly Detection
app.post('/compliance/anomalies/detect', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const anomalies = await compliance.detectAnomalies(supabase, user.orgId)
    
    return c.json({ anomalies })
  } catch (error) {
    console.error('Anomaly detection error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Compliance Dashboard
app.get('/compliance/dashboard', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const dashboard = await compliance.getComplianceDashboard(supabase, user.orgId)
    
    return c.json(dashboard)
  } catch (error) {
    console.error('Compliance dashboard error:', error)
    return c.json({ error: error.message }, 500)
  }
})

app.post('/compliance/score/calculate', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const { metricType } = await c.req.json()
    const score = await compliance.calculateComplianceScore(supabase, user.orgId, metricType)
    
    return c.json({ score })
  } catch (error) {
    console.error('Compliance score error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Mount demo leads routes (for Live Demo System)
app.route('/make-server-55e8c5b2', demoLeads)

// Mount lead export routes
app.route('/make-server-55e8c5b2', leadExport)

// Mount early access routes
app.route('/make-server-55e8c5b2/early-access', earlyAccess)

// Mount guided fixes routes
app.route('/make-server-55e8c5b2/guided-fixes', guidedFixes)

// Mount admin routes
app.route('/make-server-55e8c5b2/admin', admin)

// Mount super admin routes
app.route('/make-server-55e8c5b2/super-admin', superAdminRoutes)

// Auto-initialize BuboIQ Intelligence Platform on server start
console.log('🦉 BuboIQ AI Intelligence Platform starting...')
console.log('🧠 Initializing neural networks and intelligence systems...')

initializeIntelligenceData().then(() => {
  isInitialized = true
  console.log('✅ BuboIQ Intelligence Platform initialized successfully')
  console.log('🎯 AI models loaded and ready for threat detection')
  console.log('📊 Real-time intelligence monitoring active')
}).catch(error => {
  console.error('❌ Failed to initialize intelligence platform:', error)
  // Server will still start with fallback capabilities
  isInitialized = true
  console.log('🔄 Running with fallback intelligence capabilities')
})

Deno.serve(app.fetch)

// Onboarding save endpoint
app.post('/make-server-55e8c5b2/onboarding/save', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { company_name, business_type, device_count, primary_challenge, team_size } = await c.req.json()

    if (!company_name || !business_type) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Save to KV store
    await kv.set(`onboarding:${user.id}`, JSON.stringify({
      company_name, business_type, device_count, primary_challenge, team_size,
      completed: true, timestamp: new Date().toISOString()
    }))

    // Check if org already exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    let orgId = existingOrg?.id

    if (!orgId) {
      // Create new organization
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: company_name,
          business_type: business_type,
          owner_id: user.id,


        })
        .select('id')
        .single()

      if (orgError) {
        console.error('[onboarding] Org creation failed:', orgError)
      } else {
        orgId = newOrg.id
      }
    }

    // Link profile to org
    if (orgId) {
      await supabase
        .from('profiles')
        .update({ organization_id: orgId })
        .eq('id', user.id)

      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { company_name, business_type, onboarding_complete: true },
        app_metadata: { org_id: orgId }
      })
    }

    console.log(`[onboarding] Saved for user ${user.id}, org ${orgId}`)
    return c.json({ success: true, organization_id: orgId })

  } catch (e) {
    console.error('[onboarding] Error:', e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Agent registration endpoint
app.post('/make-server-55e8c5b2/agent/register', async (c) => {
  try {
    const orgId = c.req.header('x-org-id')
    const apiKey = c.req.header('apikey')
    if (!orgId || !apiKey) return c.json({ error: 'Missing org-id or apikey' }, 401)

    const { device } = await c.req.json()
    if (!device) return c.json({ error: 'Missing device data' }, 400)

    const now = new Date().toISOString()

    // Check if device already exists for this org+hostname
    const { data: existing } = await supabase
      .from('devices')
      .select('id')
      .eq('organization_id', orgId)
      .eq('hostname', device.hostname)
      .maybeSingle()

    const deviceId = existing?.id || crypto.randomUUID()

    const { data, error } = await supabase
      .from('devices')
      .upsert({
        id: deviceId,
        organization_id: orgId,
        name: device.hostname,
        hostname: device.hostname,
        os: device.platform,
        os_version: device.os_version,
        ip_address: device.ip_address,
        status: 'online',
        last_seen: now,
        metadata: device.metadata || {}
      }, { onConflict: 'id' })
      .select('id')
      .single()

    if (error) {
      console.error('[Agent] Registration failed:', error)
      return c.json({ error: 'Registration failed: ' + error.message }, 500)
    }

    console.log(`[Agent] Registered device ${deviceId} for org ${orgId}`)
    return c.json({ success: true, device_id: deviceId })
  } catch (e) {
    console.error('[Agent] Register error:', e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Agent heartbeat endpoint
app.post('/make-server-55e8c5b2/agent/heartbeat', async (c) => {
  try {
    const orgId = c.req.header('x-org-id')
    const apiKey = c.req.header('apikey')
    if (!orgId || !apiKey) return c.json({ error: 'Missing org-id or apikey' }, 401)

    const { device_id, device } = await c.req.json()
    if (!device_id) return c.json({ error: 'Missing device_id' }, 400)

    const now = new Date().toISOString()
    const diskPct = device?.disk_usage_percent ?? 0

    const { error } = await supabase
      .from('devices')
      .update({
        status: 'online',
        last_seen: now,
        metadata: device?.metadata || {}
      })
      .eq('id', device_id)

    if (error) {
      console.error('[Agent] Heartbeat failed:', error)
      return c.json({ error: 'Heartbeat failed' }, 500)
    }

    console.log(`[Agent] Heartbeat from device ${device_id} (disk ${diskPct}%)`)
    return c.json({ success: true })
  } catch (e) {
    console.error('[Agent] Heartbeat error:', e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Agent inventory endpoint
app.post('/make-server-55e8c5b2/agent/inventory', async (c) => {
  try {
    const orgId = c.req.header('x-org-id')
    const apiKey = c.req.header('apikey')
    if (!orgId || !apiKey) return c.json({ error: 'Missing org-id or apikey' }, 401)

    const { device_id, organization_id, hostname, installed_software, pending_updates, av_status, firewall_status } = await c.req.json()
    if (!device_id || !organization_id) return c.json({ error: 'Missing device_id or organization_id' }, 400)

    // Resolve real device_id — agent local UUID may differ from DB UUID
    let resolvedId = device_id
    const { data: devCheck } = await supabase.from('devices').select('id').eq('id', device_id).maybeSingle()
    if (!devCheck && hostname) {
      const { data: devByHost } = await supabase.from('devices').select('id')
        .eq('hostname', hostname).eq('organization_id', organization_id).maybeSingle()
      if (devByHost) resolvedId = devByHost.id
    }

    const { data: existing } = await supabase
      .from('device_inventory')
      .select('id')
      .eq('device_id', resolvedId)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('device_inventory')
        .update({
          installed_software: installed_software ?? [],
          pending_updates:    pending_updates    ?? [],
          av_status:          av_status          ?? {},
          firewall_status:    firewall_status    ?? {},
          collected_at:       new Date().toISOString()
        })
        .eq('device_id', resolvedId)
      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('device_inventory')
        .insert({
          device_id: resolvedId,
          organization_id,
          installed_software: installed_software ?? [],
          pending_updates:    pending_updates    ?? [],
          av_status:          av_status          ?? {},
          firewall_status:    firewall_status    ?? {},
          collected_at:       new Date().toISOString()
        })
      if (insertError) throw insertError
    }

    console.log(`[Agent] Inventory updated for device ${device_id}`)
    return c.json({ success: true })
  } catch (e) {
    console.error('[Agent] Inventory error:', e)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /agent/download — generate per-org Windows agent installer
app.get('/make-server-55e8c5b2/agent/download', async (c) => {
  try {
    const orgId   = c.req.query('org_id') || c.req.header('x-org-id')
    if (!orgId) return c.json({ error: 'org_id required' }, 400)

    const { data: org } = await supabase.from('organizations').select('name').eq('id', orgId).single()
    if (!org) return c.json({ error: 'Organization not found' }, 404)
    const orgName = (org.name || 'Your Organization').replace(/[^a-zA-Z0-9 ]/g, '')

    // Decode PS1 template, bake in org_id, re-encode for bat embedding
    const TMPL = 'cGFyYW0oW3N3aXRjaF0kUnVuT25jZSkKIyBCdWJvSVEgQWdlbnQgdjEuMgokT1JHX0lEID0gJ19fT1JHX0lEX18nCiRBTk9OX0tFWSA9ICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUp6ZFhCaFltRnpaU0lzSW5KbFppSTZJbVZ3YUdsNWJYUmxiMjE0Y0doeGJtdGpjM1p6SWl3aWNtOXNaU0k2SW1GdWIyNGlMQ0pwWVhRaU9qRTNOVGN3TVRZMk9Ea3NJbVY0Y0NJNk1qQTNNalU1TWpZNE9YMC5UUDMxWERjZVNvWnpSdlJYNTIxZGtUcnR1ZnVSN3pVamtxemQzeGplTUo4JwokQVBJX1VSTCA9ICdodHRwczovL2VwaGl5bXRlb214cGhxbmtjc3ZzLnN1cGFiYXNlLmNvL2Z1bmN0aW9ucy92MS9tYWtlLXNlcnZlci01NWU4YzViMicKJElEX0ZJTEUgPSAnQzpcQnVib0lRXGRldmljZV9pZC50eHQnCiRIRUFERVJTID0gQHsnQ29udGVudC1UeXBlJz0nYXBwbGljYXRpb24vanNvbic7J0F1dGhvcml6YXRpb24nPSJCZWFyZXIgJEFOT05fS0VZIjsnYXBpa2V5Jz0kQU5PTl9LRVk7J3gtb3JnLWlkJz0kT1JHX0lEfQoKaWYgKC1ub3QgKFRlc3QtUGF0aCAnQzpcQnVib0lRJykpIHsgTmV3LUl0ZW0gLUl0ZW1UeXBlIERpcmVjdG9yeSAtUGF0aCAnQzpcQnVib0lRJyB8IE91dC1OdWxsIH0KCmZ1bmN0aW9uIEdldC1JZCB7CiAgICBpZiAoVGVzdC1QYXRoICRJRF9GSUxFKSB7IHJldHVybiAoR2V0LUNvbnRlbnQgJElEX0ZJTEUgLVJhdykuVHJpbSgpIH0KICAgICR4ID0gW0d1aWRdOjpOZXdHdWlkKCkuVG9TdHJpbmcoKQogICAgJHggfCBTZXQtQ29udGVudCAkSURfRklMRSAtRW5jb2RpbmcgVVRGOAogICAgcmV0dXJuICR4Cn0KZnVuY3Rpb24gUmVxKCRlcCwgJGIpIHsKICAgIEludm9rZS1SZXN0TWV0aG9kIC1VcmkgIiRBUElfVVJMLyRlcCIgLU1ldGhvZCBQT1NUIC1FcnJvckFjdGlvbiBTdG9wIC1IZWFkZXJzICRIRUFERVJTIC1Cb2R5ICgkYiB8IENvbnZlcnRUby1Kc29uIC1EZXB0aCAxMCAtQ29tcHJlc3MpCn0KZnVuY3Rpb24gUmVxR2V0KCRlcCkgewogICAgSW52b2tlLVJlc3RNZXRob2QgLVVyaSAiJEFQSV9VUkwvJGVwIiAtTWV0aG9kIEdFVCAtRXJyb3JBY3Rpb24gU3RvcCAtSGVhZGVycyAkSEVBREVSUwp9CgokaWQgPSBHZXQtSWQKJGhuID0gJGVudjpDT01QVVRFUk5BTUUKJGlwID0gKEdldC1OZXRJUEFkZHJlc3MgLUFkZHJlc3NGYW1pbHkgSVB2NCB8IFdoZXJlLU9iamVjdCB7ICRfLklQQWRkcmVzcyAtbm90bWF0Y2ggJ14oMTI3fDE2OSknIH0gfCBTZWxlY3QtT2JqZWN0IC1GaXJzdCAxKS5JUEFkZHJlc3MKJG9zID0gKEdldC1XbWlPYmplY3QgV2luMzJfT3BlcmF0aW5nU3lzdGVtKS5DYXB0aW9uCiRvdiA9IChHZXQtV21pT2JqZWN0IFdpbjMyX09wZXJhdGluZ1N5c3RlbSkuVmVyc2lvbgoKdHJ5IHsgJHJlZyA9IFJlcSAnYWdlbnQvcmVnaXN0ZXInIEB7b3JnX2lkPSRPUkdfSUQ7ZGV2aWNlPUB7aWQ9JGlkO2hvc3RuYW1lPSRobjtwbGF0Zm9ybT0kb3M7b3NfdmVyc2lvbj0kb3Y7aXBfYWRkcmVzcz0kaXA7bWV0YWRhdGE9QHt9fX07IGlmICgkcmVnIC1hbmQgJHJlZy5kZXZpY2VfaWQpIHsgJGlkID0gJHJlZy5kZXZpY2VfaWQ7ICRpZCB8IFNldC1Db250ZW50ICRJRF9GSUxFIC1FbmNvZGluZyBVVEY4IH07IFdyaXRlLUhvc3QgJ1tCdWJvSVFdIFJlZ2lzdGVyZWQuJyB9IGNhdGNoIHsgV3JpdGUtSG9zdCAiW0J1Ym9JUV0gUmVnaXN0cmF0aW9uIGVycm9yOiAkXyIgfQoKZnVuY3Rpb24gQ29sbGVjdC1JbnZlbnRvcnkgewogICAgdHJ5IHsKICAgICAgICAkcGtncyA9IEAoJ0hLTE06XFNvZnR3YXJlXE1pY3Jvc29mdFxXaW5kb3dzXEN1cnJlbnRWZXJzaW9uXFVuaW5zdGFsbFwqJywnSEtMTTpcU29mdHdhcmVcV293NjQzMk5vZGVcTWljcm9zb2Z0XFdpbmRvd3NcQ3VycmVudFZlcnNpb25cVW5pbnN0YWxsXConKQogICAgICAgICRhbGxTdyA9IEAoKQogICAgICAgIGZvcmVhY2ggKCRwIGluICRwa2dzKSB7ICRhbGxTdyArPSBHZXQtSXRlbVByb3BlcnR5ICRwIC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIHwgV2hlcmUtT2JqZWN0IHsgJF8uRGlzcGxheU5hbWUgfSB8IFNlbGVjdC1PYmplY3QgQHtOPSduYW1lJztFPXskXy5EaXNwbGF5TmFtZX19LEB7Tj0ndmVyc2lvbic7RT17JF8uRGlzcGxheVZlcnNpb259fSxAe049J3B1Ymxpc2hlcic7RT17JF8uUHVibGlzaGVyfX0gfQogICAgICAgICRzdyA9ICRhbGxTdyB8IFNvcnQtT2JqZWN0IG5hbWUgLVVuaXF1ZQogICAgICAgICR1cGQgPSBAKCkKICAgICAgICB0cnkgeyAkc2VzcyA9IE5ldy1PYmplY3QgLUNvbU9iamVjdCBNaWNyb3NvZnQuVXBkYXRlLlNlc3Npb247ICR1cGQgPSBAKCRzZXNzLkNyZWF0ZVVwZGF0ZVNlYXJjaGVyKCkuU2VhcmNoKCJJc0luc3RhbGxlZD0wIGFuZCBUeXBlPSdTb2Z0d2FyZScgYW5kIElzSGlkZGVuPTAiKS5VcGRhdGVzIHwgRm9yRWFjaC1PYmplY3QgeyBAe3RpdGxlPSRfLlRpdGxlO3NldmVyaXR5PSRfLk1zcmNTZXZlcml0eX0gfSkgfSBjYXRjaCB7fQogICAgICAgICRhdiA9IEB7bmFtZT0nVW5rbm93bic7ZW5hYmxlZD0kZmFsc2V9CiAgICAgICAgdHJ5IHsgJGQgPSBHZXQtTXBDb21wdXRlclN0YXR1cyAtRXJyb3JBY3Rpb24gU3RvcDsgJGF2ID0gQHtuYW1lPSdXaW5kb3dzIERlZmVuZGVyJztlbmFibGVkPSR0cnVlO3JlYWxfdGltZV9wcm90ZWN0aW9uPVtib29sXSRkLlJlYWxUaW1lUHJvdGVjdGlvbkVuYWJsZWQ7c2lnbmF0dXJlX2FnZV9kYXlzPSRkLkFudGl2aXJ1c1NpZ25hdHVyZUFnZX0gfSBjYXRjaCB7fQogICAgICAgICRmdyA9IEAoKQogICAgICAgIHRyeSB7ICRmdyA9IEAoR2V0LU5ldEZpcmV3YWxsUHJvZmlsZSB8IFNlbGVjdC1PYmplY3QgQHtOPSdwcm9maWxlJztFPXskXy5OYW1lfX0sQHtOPSdlbmFibGVkJztFPXtbYm9vbF0kXy5FbmFibGVkfX0pIH0gY2F0Y2gge30KICAgICAgICBSZXEgJ2FnZW50L2ludmVudG9yeScgQHtkZXZpY2VfaWQ9JGlkO29yZ2FuaXphdGlvbl9pZD0kT1JHX0lEO2hvc3RuYW1lPSRobjtpbnN0YWxsZWRfc29mdHdhcmU9JHN3O3BlbmRpbmdfdXBkYXRlcz0kdXBkO2F2X3N0YXR1cz0kYXY7ZmlyZXdhbGxfc3RhdHVzPSRmd30gfCBPdXQtTnVsbAogICAgICAgIFdyaXRlLUhvc3QgJ1tCdWJvSVFdIEludmVudG9yeSBzZW50LicKICAgIH0gY2F0Y2ggeyBXcml0ZS1Ib3N0ICJbQnVib0lRXSBJbnZlbnRvcnkgZXJyb3I6ICRfIiB9Cn0KCmZ1bmN0aW9uIEludm9rZS1CdWJvQ29tbWFuZCgkY21kKSB7CiAgICAkY21kSWQgPSAkY21kLmlkCiAgICAkY21kVHlwZSA9ICRjbWQuY29tbWFuZF90eXBlCiAgICBXcml0ZS1Ib3N0ICJbQnVib0lRXSBFeGVjdXRpbmc6ICRjbWRUeXBlIgogICAgdHJ5IHsKICAgICAgICBzd2l0Y2ggKCRjbWRUeXBlKSB7CiAgICAgICAgICAgICdpbnN0YWxsX3VwZGF0ZXMnIHsKICAgICAgICAgICAgICAgICRzZXNzID0gTmV3LU9iamVjdCAtQ29tT2JqZWN0IE1pY3Jvc29mdC5VcGRhdGUuU2Vzc2lvbgogICAgICAgICAgICAgICAgJHVwZGF0ZXMgPSAkc2Vzcy5DcmVhdGVVcGRhdGVTZWFyY2hlcigpLlNlYXJjaCgiSXNJbnN0YWxsZWQ9MCBhbmQgVHlwZT0nU29mdHdhcmUnIGFuZCBJc0hpZGRlbj0wIikuVXBkYXRlcwogICAgICAgICAgICAgICAgaWYgKCR1cGRhdGVzLkNvdW50IC1lcSAwKSB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J05vIHVwZGF0ZXMgYXZhaWxhYmxlJztpbnN0YWxsZWQ9MH19IHwgT3V0LU51bGw7IHJldHVybiB9CiAgICAgICAgICAgICAgICAkZGwgPSAkc2Vzcy5DcmVhdGVVcGRhdGVEb3dubG9hZGVyKCk7ICRkbC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRkbC5Eb3dubG9hZCgpCiAgICAgICAgICAgICAgICAkaW5zdCA9ICRzZXNzLkNyZWF0ZVVwZGF0ZUluc3RhbGxlcigpOyAkaW5zdC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRyID0gJGluc3QuSW5zdGFsbCgpCiAgICAgICAgICAgICAgICBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kdHJ1ZTtyZXN1bHQ9QHttZXNzYWdlPSJJbnN0YWxsZWQgJCgkdXBkYXRlcy5Db3VudCkgdXBkYXRlcyI7cmVib290X3JlcXVpcmVkPVtib29sXSRyLlJlYm9vdFJlcXVpcmVkO2luc3RhbGxlZD0kdXBkYXRlcy5Db3VudH19IHwgT3V0LU51bGwKICAgICAgICAgICAgfQogICAgICAgICAgICAnY29sbGVjdF9pbnZlbnRvcnknIHsgQ29sbGVjdC1JbnZlbnRvcnk7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J0ludmVudG9yeSBjb2xsZWN0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgICdyZXN0YXJ0JyB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J1Jlc3RhcnRpbmcgaW4gMzBzJ319IHwgT3V0LU51bGw7IFN0YXJ0LVNsZWVwIDMwOyBSZXN0YXJ0LUNvbXB1dGVyIC1Gb3JjZSB9CiAgICAgICAgICAgICdydW5fc2NhbicgeyBTdGFydC1NcFNjYW4gLVNjYW5UeXBlIFF1aWNrU2NhbiAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZTsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JHRydWU7cmVzdWx0PUB7bWVzc2FnZT0nUXVpY2sgc2NhbiBpbml0aWF0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgIGRlZmF1bHQgeyBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kZmFsc2U7ZXJyb3JfbWVzc2FnZT0iVW5rbm93bjogJGNtZFR5cGUifSB8IE91dC1OdWxsIH0KICAgICAgICB9CiAgICB9IGNhdGNoIHsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JGZhbHNlO2Vycm9yX21lc3NhZ2U9JF8uVG9TdHJpbmcoKX0gfCBPdXQtTnVsbCB9Cn0KCkNvbGxlY3QtSW52ZW50b3J5CmlmICgkUnVuT25jZSkgeyBXcml0ZS1Ib3N0ICdbQnVib0lRXSBTZXR1cCBjb21wbGV0ZS4nOyBleGl0IDAgfQoKV3JpdGUtSG9zdCAnW0J1Ym9JUV0gQWdlbnQgcnVubmluZy4gSGVhcnRiZWF0IGV2ZXJ5IDUgbWluLicKJHQgPSBbRGlhZ25vc3RpY3MuU3RvcHdhdGNoXTo6U3RhcnROZXcoKQp3aGlsZSAoJHRydWUpIHsKICAgIFN0YXJ0LVNsZWVwIDMwMAogICAgdHJ5IHsgJGRpc2sgPSBbbWF0aF06OlJvdW5kKChHZXQtUFNEcml2ZSBDIHwgRm9yRWFjaC1PYmplY3QgeyAkXy5Vc2VkLygkXy5Vc2VkKyRfLkZyZWUpKjEwMCB9KSwxKTsgUmVxICdhZ2VudC9oZWFydGJlYXQnIEB7ZGV2aWNlX2lkPSRpZDtkZXZpY2U9QHtkaXNrX3VzYWdlX3BlcmNlbnQ9JGRpc2s7bWV0YWRhdGE9QHt9fX0gfCBPdXQtTnVsbCB9IGNhdGNoIHt9CiAgICB0cnkgeyAkcmVzcCA9IFJlcUdldCAiYWdlbnQvY29tbWFuZHM/ZGV2aWNlX2lkPSRpZCI7IGlmICgkcmVzcC5jb21tYW5kcyAtYW5kICRyZXNwLmNvbW1hbmRzLkNvdW50IC1ndCAwKSB7IGZvcmVhY2ggKCRjbWQgaW4gJHJlc3AuY29tbWFuZHMpIHsgSW52b2tlLUJ1Ym9Db21tYW5kICRjbWQgfSB9IH0gY2F0Y2gge30KICAgIGlmICgkdC5FbGFwc2VkLlRvdGFsTWludXRlcyAtZ2UgMzApIHsgQ29sbGVjdC1JbnZlbnRvcnk7ICR0LlJlc3RhcnQoKSB9Cn0K'
    const tplBytes = Uint8Array.from(atob(TMPL), (ch: string) => ch.charCodeAt(0))
    const ps1      = new TextDecoder().decode(tplBytes).replace("'__ORG_ID__'", "'" + orgId + "'")
    const ps1Bytes = new TextEncoder().encode(ps1)
    let   bin      = ''
    ps1Bytes.forEach((b: number) => { bin += String.fromCharCode(b) })
    const agentB64 = btoa(bin)

    const bat = `@echo off\r\ntitle BuboIQ Agent Installer\r\ncolor 0A\r\nnet session >nul 2>&1\r\nif %errorLevel% neq 0 (\r\n    powershell -Command "Start-Process '%~f0' -Verb RunAs"\r\n    exit /b\r\n)\r\necho.\r\necho  ============================================\r\necho   BuboIQ Agent Installer v1.0\r\necho   Organization: ${orgName}\r\necho  ============================================\r\necho.\r\necho  [1/4] Creating install directory...\r\nif not exist "C:\\BuboIQ" mkdir "C:\\BuboIQ"\r\necho        OK\r\necho.\r\necho  [2/4] Writing agent script...\r\npowershell -NoProfile -ExecutionPolicy Bypass -Command "$b='${agentB64}';[IO.File]::WriteAllText('C:\\BuboIQ\\agent.ps1',[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b)))"\r\necho        OK\r\necho.\r\necho  [3/4] Registering system service...\r\nschtasks /delete /tn "BuboIQ Agent" /f >nul 2>&1\r\nschtasks /create /tn "BuboIQ Agent" /tr "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\\BuboIQ\\agent.ps1" /sc onstart /ru SYSTEM /f >nul\r\necho        OK\r\necho.\r\necho  [4/4] Registering device with BuboIQ...\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "C:\\BuboIQ\\agent.ps1" -RunOnce\r\necho.\r\necho  ============================================\r\necho   SUCCESS: %COMPUTERNAME% is now reporting\r\necho   to your BuboIQ dashboard.\r\necho  ============================================\r\necho.\r\npause`

    const zip = new JSZip()
    zip.file('BuboIQ-Agent-Setup.bat', bat)
    const zipBytes = await zip.generateAsync({ type: 'uint8array' })
    return new Response(zipBytes, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="BuboIQ-Agent-Setup.zip"',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (e: any) {
    console.error('[Agent] Download error:', e)
    return c.json({ error: e.message }, 500)
  }
})



// Alias: /agents/download/:platform → frontend compatibility
app.get('/make-server-55e8c5b2/agents/download/:platform', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const { data: profile } = await supabase
      .from('profiles').select('organization_id').eq('id', user.id).single()
    const orgId = user?.app_metadata?.org_id || user?.user_metadata?.org_id || profile?.organization_id
    if (!orgId) return c.json({ error: 'Organization not found' }, 400)

    const { data: org } = await supabase.from('organizations').select('name').eq('id', orgId).single()
    const orgName = (org?.name || 'Your Organization').replace(/[^a-zA-Z0-9 ]/g, '')

    const TMPL = 'cGFyYW0oW3N3aXRjaF0kUnVuT25jZSkKIyBCdWJvSVEgQWdlbnQgdjEuMgokT1JHX0lEID0gJ19fT1JHX0lEX18nCiRBTk9OX0tFWSA9ICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUp6ZFhCaFltRnpaU0lzSW5KbFppSTZJbVZ3YUdsNWJYUmxiMjE0Y0doeGJtdGpjM1p6SWl3aWNtOXNaU0k2SW1GdWIyNGlMQ0pwWVhRaU9qRTNOVGN3TVRZMk9Ea3NJbVY0Y0NJNk1qQTNNalU1TWpZNE9YMC5UUDMxWERjZVNvWnpSdlJYNTIxZGtUcnR1ZnVSN3pVamtxemQzeGplTUo4JwokQVBJX1VSTCA9ICdodHRwczovL2VwaGl5bXRlb214cGhxbmtjc3ZzLnN1cGFiYXNlLmNvL2Z1bmN0aW9ucy92MS9tYWtlLXNlcnZlci01NWU4YzViMicKJElEX0ZJTEUgPSAnQzpcQnVib0lRXGRldmljZV9pZC50eHQnCiRIRUFERVJTID0gQHsnQ29udGVudC1UeXBlJz0nYXBwbGljYXRpb24vanNvbic7J0F1dGhvcml6YXRpb24nPSJCZWFyZXIgJEFOT05fS0VZIjsnYXBpa2V5Jz0kQU5PTl9LRVk7J3gtb3JnLWlkJz0kT1JHX0lEfQoKaWYgKC1ub3QgKFRlc3QtUGF0aCAnQzpcQnVib0lRJykpIHsgTmV3LUl0ZW0gLUl0ZW1UeXBlIERpcmVjdG9yeSAtUGF0aCAnQzpcQnVib0lRJyB8IE91dC1OdWxsIH0KCmZ1bmN0aW9uIEdldC1JZCB7CiAgICBpZiAoVGVzdC1QYXRoICRJRF9GSUxFKSB7IHJldHVybiAoR2V0LUNvbnRlbnQgJElEX0ZJTEUgLVJhdykuVHJpbSgpIH0KICAgICR4ID0gW0d1aWRdOjpOZXdHdWlkKCkuVG9TdHJpbmcoKQogICAgJHggfCBTZXQtQ29udGVudCAkSURfRklMRSAtRW5jb2RpbmcgVVRGOAogICAgcmV0dXJuICR4Cn0KZnVuY3Rpb24gUmVxKCRlcCwgJGIpIHsKICAgIEludm9rZS1SZXN0TWV0aG9kIC1VcmkgIiRBUElfVVJMLyRlcCIgLU1ldGhvZCBQT1NUIC1FcnJvckFjdGlvbiBTdG9wIC1IZWFkZXJzICRIRUFERVJTIC1Cb2R5ICgkYiB8IENvbnZlcnRUby1Kc29uIC1EZXB0aCAxMCAtQ29tcHJlc3MpCn0KZnVuY3Rpb24gUmVxR2V0KCRlcCkgewogICAgSW52b2tlLVJlc3RNZXRob2QgLVVyaSAiJEFQSV9VUkwvJGVwIiAtTWV0aG9kIEdFVCAtRXJyb3JBY3Rpb24gU3RvcCAtSGVhZGVycyAkSEVBREVSUwp9CgokaWQgPSBHZXQtSWQKJGhuID0gJGVudjpDT01QVVRFUk5BTUUKJGlwID0gKEdldC1OZXRJUEFkZHJlc3MgLUFkZHJlc3NGYW1pbHkgSVB2NCB8IFdoZXJlLU9iamVjdCB7ICRfLklQQWRkcmVzcyAtbm90bWF0Y2ggJ14oMTI3fDE2OSknIH0gfCBTZWxlY3QtT2JqZWN0IC1GaXJzdCAxKS5JUEFkZHJlc3MKJG9zID0gKEdldC1XbWlPYmplY3QgV2luMzJfT3BlcmF0aW5nU3lzdGVtKS5DYXB0aW9uCiRvdiA9IChHZXQtV21pT2JqZWN0IFdpbjMyX09wZXJhdGluZ1N5c3RlbSkuVmVyc2lvbgoKdHJ5IHsgJHJlZyA9IFJlcSAnYWdlbnQvcmVnaXN0ZXInIEB7b3JnX2lkPSRPUkdfSUQ7ZGV2aWNlPUB7aWQ9JGlkO2hvc3RuYW1lPSRobjtwbGF0Zm9ybT0kb3M7b3NfdmVyc2lvbj0kb3Y7aXBfYWRkcmVzcz0kaXA7bWV0YWRhdGE9QHt9fX07IGlmICgkcmVnIC1hbmQgJHJlZy5kZXZpY2VfaWQpIHsgJGlkID0gJHJlZy5kZXZpY2VfaWQ7ICRpZCB8IFNldC1Db250ZW50ICRJRF9GSUxFIC1FbmNvZGluZyBVVEY4IH07IFdyaXRlLUhvc3QgJ1tCdWJvSVFdIFJlZ2lzdGVyZWQuJyB9IGNhdGNoIHsgV3JpdGUtSG9zdCAiW0J1Ym9JUV0gUmVnaXN0cmF0aW9uIGVycm9yOiAkXyIgfQoKZnVuY3Rpb24gQ29sbGVjdC1JbnZlbnRvcnkgewogICAgdHJ5IHsKICAgICAgICAkcGtncyA9IEAoJ0hLTE06XFNvZnR3YXJlXE1pY3Jvc29mdFxXaW5kb3dzXEN1cnJlbnRWZXJzaW9uXFVuaW5zdGFsbFwqJywnSEtMTTpcU29mdHdhcmVcV293NjQzMk5vZGVcTWljcm9zb2Z0XFdpbmRvd3NcQ3VycmVudFZlcnNpb25cVW5pbnN0YWxsXConKQogICAgICAgICRhbGxTdyA9IEAoKQogICAgICAgIGZvcmVhY2ggKCRwIGluICRwa2dzKSB7ICRhbGxTdyArPSBHZXQtSXRlbVByb3BlcnR5ICRwIC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIHwgV2hlcmUtT2JqZWN0IHsgJF8uRGlzcGxheU5hbWUgfSB8IFNlbGVjdC1PYmplY3QgQHtOPSduYW1lJztFPXskXy5EaXNwbGF5TmFtZX19LEB7Tj0ndmVyc2lvbic7RT17JF8uRGlzcGxheVZlcnNpb259fSxAe049J3B1Ymxpc2hlcic7RT17JF8uUHVibGlzaGVyfX0gfQogICAgICAgICRzdyA9ICRhbGxTdyB8IFNvcnQtT2JqZWN0IG5hbWUgLVVuaXF1ZQogICAgICAgICR1cGQgPSBAKCkKICAgICAgICB0cnkgeyAkc2VzcyA9IE5ldy1PYmplY3QgLUNvbU9iamVjdCBNaWNyb3NvZnQuVXBkYXRlLlNlc3Npb247ICR1cGQgPSBAKCRzZXNzLkNyZWF0ZVVwZGF0ZVNlYXJjaGVyKCkuU2VhcmNoKCJJc0luc3RhbGxlZD0wIGFuZCBUeXBlPSdTb2Z0d2FyZScgYW5kIElzSGlkZGVuPTAiKS5VcGRhdGVzIHwgRm9yRWFjaC1PYmplY3QgeyBAe3RpdGxlPSRfLlRpdGxlO3NldmVyaXR5PSRfLk1zcmNTZXZlcml0eX0gfSkgfSBjYXRjaCB7fQogICAgICAgICRhdiA9IEB7bmFtZT0nVW5rbm93bic7ZW5hYmxlZD0kZmFsc2V9CiAgICAgICAgdHJ5IHsgJGQgPSBHZXQtTXBDb21wdXRlclN0YXR1cyAtRXJyb3JBY3Rpb24gU3RvcDsgJGF2ID0gQHtuYW1lPSdXaW5kb3dzIERlZmVuZGVyJztlbmFibGVkPSR0cnVlO3JlYWxfdGltZV9wcm90ZWN0aW9uPVtib29sXSRkLlJlYWxUaW1lUHJvdGVjdGlvbkVuYWJsZWQ7c2lnbmF0dXJlX2FnZV9kYXlzPSRkLkFudGl2aXJ1c1NpZ25hdHVyZUFnZX0gfSBjYXRjaCB7fQogICAgICAgICRmdyA9IEAoKQogICAgICAgIHRyeSB7ICRmdyA9IEAoR2V0LU5ldEZpcmV3YWxsUHJvZmlsZSB8IFNlbGVjdC1PYmplY3QgQHtOPSdwcm9maWxlJztFPXskXy5OYW1lfX0sQHtOPSdlbmFibGVkJztFPXtbYm9vbF0kXy5FbmFibGVkfX0pIH0gY2F0Y2gge30KICAgICAgICBSZXEgJ2FnZW50L2ludmVudG9yeScgQHtkZXZpY2VfaWQ9JGlkO29yZ2FuaXphdGlvbl9pZD0kT1JHX0lEO2hvc3RuYW1lPSRobjtpbnN0YWxsZWRfc29mdHdhcmU9JHN3O3BlbmRpbmdfdXBkYXRlcz0kdXBkO2F2X3N0YXR1cz0kYXY7ZmlyZXdhbGxfc3RhdHVzPSRmd30gfCBPdXQtTnVsbAogICAgICAgIFdyaXRlLUhvc3QgJ1tCdWJvSVFdIEludmVudG9yeSBzZW50LicKICAgIH0gY2F0Y2ggeyBXcml0ZS1Ib3N0ICJbQnVib0lRXSBJbnZlbnRvcnkgZXJyb3I6ICRfIiB9Cn0KCmZ1bmN0aW9uIEludm9rZS1CdWJvQ29tbWFuZCgkY21kKSB7CiAgICAkY21kSWQgPSAkY21kLmlkCiAgICAkY21kVHlwZSA9ICRjbWQuY29tbWFuZF90eXBlCiAgICBXcml0ZS1Ib3N0ICJbQnVib0lRXSBFeGVjdXRpbmc6ICRjbWRUeXBlIgogICAgdHJ5IHsKICAgICAgICBzd2l0Y2ggKCRjbWRUeXBlKSB7CiAgICAgICAgICAgICdpbnN0YWxsX3VwZGF0ZXMnIHsKICAgICAgICAgICAgICAgICRzZXNzID0gTmV3LU9iamVjdCAtQ29tT2JqZWN0IE1pY3Jvc29mdC5VcGRhdGUuU2Vzc2lvbgogICAgICAgICAgICAgICAgJHVwZGF0ZXMgPSAkc2Vzcy5DcmVhdGVVcGRhdGVTZWFyY2hlcigpLlNlYXJjaCgiSXNJbnN0YWxsZWQ9MCBhbmQgVHlwZT0nU29mdHdhcmUnIGFuZCBJc0hpZGRlbj0wIikuVXBkYXRlcwogICAgICAgICAgICAgICAgaWYgKCR1cGRhdGVzLkNvdW50IC1lcSAwKSB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J05vIHVwZGF0ZXMgYXZhaWxhYmxlJztpbnN0YWxsZWQ9MH19IHwgT3V0LU51bGw7IHJldHVybiB9CiAgICAgICAgICAgICAgICAkZGwgPSAkc2Vzcy5DcmVhdGVVcGRhdGVEb3dubG9hZGVyKCk7ICRkbC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRkbC5Eb3dubG9hZCgpCiAgICAgICAgICAgICAgICAkaW5zdCA9ICRzZXNzLkNyZWF0ZVVwZGF0ZUluc3RhbGxlcigpOyAkaW5zdC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRyID0gJGluc3QuSW5zdGFsbCgpCiAgICAgICAgICAgICAgICBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kdHJ1ZTtyZXN1bHQ9QHttZXNzYWdlPSJJbnN0YWxsZWQgJCgkdXBkYXRlcy5Db3VudCkgdXBkYXRlcyI7cmVib290X3JlcXVpcmVkPVtib29sXSRyLlJlYm9vdFJlcXVpcmVkO2luc3RhbGxlZD0kdXBkYXRlcy5Db3VudH19IHwgT3V0LU51bGwKICAgICAgICAgICAgfQogICAgICAgICAgICAnY29sbGVjdF9pbnZlbnRvcnknIHsgQ29sbGVjdC1JbnZlbnRvcnk7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J0ludmVudG9yeSBjb2xsZWN0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgICdyZXN0YXJ0JyB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J1Jlc3RhcnRpbmcgaW4gMzBzJ319IHwgT3V0LU51bGw7IFN0YXJ0LVNsZWVwIDMwOyBSZXN0YXJ0LUNvbXB1dGVyIC1Gb3JjZSB9CiAgICAgICAgICAgICdydW5fc2NhbicgeyBTdGFydC1NcFNjYW4gLVNjYW5UeXBlIFF1aWNrU2NhbiAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZTsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JHRydWU7cmVzdWx0PUB7bWVzc2FnZT0nUXVpY2sgc2NhbiBpbml0aWF0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgIGRlZmF1bHQgeyBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kZmFsc2U7ZXJyb3JfbWVzc2FnZT0iVW5rbm93bjogJGNtZFR5cGUifSB8IE91dC1OdWxsIH0KICAgICAgICB9CiAgICB9IGNhdGNoIHsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JGZhbHNlO2Vycm9yX21lc3NhZ2U9JF8uVG9TdHJpbmcoKX0gfCBPdXQtTnVsbCB9Cn0KCkNvbGxlY3QtSW52ZW50b3J5CmlmICgkUnVuT25jZSkgeyBXcml0ZS1Ib3N0ICdbQnVib0lRXSBTZXR1cCBjb21wbGV0ZS4nOyBleGl0IDAgfQoKV3JpdGUtSG9zdCAnW0J1Ym9JUV0gQWdlbnQgcnVubmluZy4gSGVhcnRiZWF0IGV2ZXJ5IDUgbWluLicKJHQgPSBbRGlhZ25vc3RpY3MuU3RvcHdhdGNoXTo6U3RhcnROZXcoKQp3aGlsZSAoJHRydWUpIHsKICAgIFN0YXJ0LVNsZWVwIDMwMAogICAgdHJ5IHsgJGRpc2sgPSBbbWF0aF06OlJvdW5kKChHZXQtUFNEcml2ZSBDIHwgRm9yRWFjaC1PYmplY3QgeyAkXy5Vc2VkLygkXy5Vc2VkKyRfLkZyZWUpKjEwMCB9KSwxKTsgUmVxICdhZ2VudC9oZWFydGJlYXQnIEB7ZGV2aWNlX2lkPSRpZDtkZXZpY2U9QHtkaXNrX3VzYWdlX3BlcmNlbnQ9JGRpc2s7bWV0YWRhdGE9QHt9fX0gfCBPdXQtTnVsbCB9IGNhdGNoIHt9CiAgICB0cnkgeyAkcmVzcCA9IFJlcUdldCAiYWdlbnQvY29tbWFuZHM/ZGV2aWNlX2lkPSRpZCI7IGlmICgkcmVzcC5jb21tYW5kcyAtYW5kICRyZXNwLmNvbW1hbmRzLkNvdW50IC1ndCAwKSB7IGZvcmVhY2ggKCRjbWQgaW4gJHJlc3AuY29tbWFuZHMpIHsgSW52b2tlLUJ1Ym9Db21tYW5kICRjbWQgfSB9IH0gY2F0Y2gge30KICAgIGlmICgkdC5FbGFwc2VkLlRvdGFsTWludXRlcyAtZ2UgMzApIHsgQ29sbGVjdC1JbnZlbnRvcnk7ICR0LlJlc3RhcnQoKSB9Cn0K'
    const tplBytes = Uint8Array.from(atob(TMPL), (ch: string) => ch.charCodeAt(0))
    const ps1 = new TextDecoder().decode(tplBytes).replace("'__ORG_ID__'", "'" + orgId + "'")
    const ps1Bytes = new TextEncoder().encode(ps1)
    let bin = ''
    ps1Bytes.forEach((b: number) => { bin += String.fromCharCode(b) })
    const agentB64 = btoa(bin)
    const bat = `@echo off\r\ntitle BuboIQ Agent Installer\r\ncolor 0A\r\nnet session >nul 2>&1\r\nif %errorLevel% neq 0 (\r\n    powershell -Command "Start-Process '%~f0' -Verb RunAs"\r\n    exit /b\r\n)\r\necho.\r\necho  ============================================\r\necho   BuboIQ Agent Installer v1.0\r\necho   Organization: ${orgName}\r\necho  ============================================\r\necho.\r\npowershell -NoProfile -ExecutionPolicy Bypass -Command "$b='${agentB64}';[IO.File]::WriteAllText('C:\\BuboIQ\\agent.ps1',[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b)))"\r\nschtasks /create /tn "BuboIQ Agent" /tr "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\\BuboIQ\\agent.ps1" /sc onstart /ru SYSTEM /f >nul\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "C:\\BuboIQ\\agent.ps1" -RunOnce\r\necho  SUCCESS: %COMPUTERNAME% is now reporting to your BuboIQ dashboard.\r\npause`
    const zip = new JSZip()
    zip.file('BuboIQ-Agent-Setup.bat', bat)
    const zipBytes = await zip.generateAsync({ type: 'uint8array' })
    return new Response(zipBytes, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="BuboIQ-Agent-Setup.zip"',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ── Device Command Routes ─────────────────────────────────────────────────────

// POST /devices/:id/commands — queue a command for a device
app.post('/make-server-55e8c5b2/devices/:id/commands', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const orgId = user?.app_metadata?.org_id || profile?.organization_id
    if (!orgId) return c.json({ error: 'Organization not found' }, 400)

    const deviceId = c.req.param('id')
    const { command_type, command_payload } = await c.req.json()

    const validCommands = ['install_updates', 'restart', 'run_scan', 'collect_inventory']
    if (!validCommands.includes(command_type)) {
      return c.json({ error: `Invalid command. Valid: ${validCommands.join(', ')}` }, 400)
    }

    const destructiveCommands = ['install_updates', 'restart']
    const requiresApproval = destructiveCommands.includes(command_type)

    const { data, error } = await supabase.from('device_commands').insert({
      device_id: deviceId,
      organization_id: orgId,
      command_type,
      command_payload: command_payload || {},
      status: 'pending',
      requires_approval: requiresApproval,
      approval_status: requiresApproval ? 'pending' : 'not_required',
      created_by: user.id,
    }).select().single()

    if (error) throw error
    console.log(`[Commands] Queued ${command_type} for device ${deviceId}`)
    return c.json({ success: true, command: data })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /devices/:id/commands — list commands for a device
app.get('/make-server-55e8c5b2/devices/:id/commands', async (c) => {
  try {
    const { data, error } = await supabase
      .from('device_commands')
      .select('*')
      .eq('device_id', c.req.param('id'))
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) throw error
    return c.json({ commands: data || [] })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /agent/commands — agent polls for pending commands
app.get('/make-server-55e8c5b2/agent/commands', async (c) => {
  try {
    const orgId = c.req.header('x-org-id')
    const deviceId = c.req.query('device_id')
    if (!orgId || !deviceId) return c.json({ commands: [] })

    const { data, error } = await supabase
      .from('device_commands')
      .select('*')
      .eq('device_id', deviceId)
      .eq('status', 'pending')
      .in('approval_status', ['not_required', 'approved'])
      .order('created_at', { ascending: true })
      .limit(5)

    if (error) throw error

    // Mark as executing
    if (data && data.length > 0) {
      const ids = data.map((c: any) => c.id)
      await supabase.from('device_commands').update({ status: 'executing', executed_at: new Date().toISOString() }).in('id', ids)
    }

    return c.json({ commands: data || [] })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST /agent/commands/:id/result — agent reports command result
app.post('/make-server-55e8c5b2/agent/commands/:id/result', async (c) => {
  try {
    const { success, result, error_message } = await c.req.json()
    const { error } = await supabase.from('device_commands').update({
      status: success ? 'completed' : 'failed',
      completed_at: new Date().toISOString(),
      result: result || {},
      error_message: error_message || null,
    }).eq('id', c.req.param('id'))

    if (error) throw error
    console.log(`[Commands] Command ${c.req.param('id')} ${success ? 'completed' : 'failed'}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST /commands/:id/approve — approve a pending destructive command
app.post('/make-server-55e8c5b2/commands/:id/approve', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const commandId = c.req.param('id')

    const { data: command, error: fetchError } = await supabase
      .from('device_commands')
      .select('*')
      .eq('id', commandId)
      .single()
    if (fetchError || !command) return c.json({ error: 'Command not found' }, 404)
    if (command.approval_status !== 'pending') {
      return c.json({ error: `Command is not pending approval (current: ${command.approval_status})` }, 400)
    }

    const { error } = await supabase.from('device_commands').update({
      approval_status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    }).eq('id', commandId)
    if (error) throw error

    try {
      await supabase.from('audit_logs').insert({
        organization_id: command.organization_id,
        user_id: user.id,
        action: 'device_command_approved',
        resource_type: 'device_commands',
        resource_id: commandId,
        metadata: { command_type: command.command_type, device_id: command.device_id },
      })
    } catch (auditErr: any) {
      console.log(`[Commands] Audit log insert failed (non-fatal): ${auditErr.message}`)
    }

    console.log(`[Commands] Command ${commandId} approved by ${user.id}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST /commands/:id/reject — reject a pending destructive command
app.post('/make-server-55e8c5b2/commands/:id/reject', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const commandId = c.req.param('id')
    const { reason } = await c.req.json().catch(() => ({ reason: null }))

    const { data: command, error: fetchError } = await supabase
      .from('device_commands')
      .select('*')
      .eq('id', commandId)
      .single()
    if (fetchError || !command) return c.json({ error: 'Command not found' }, 404)
    if (command.approval_status !== 'pending') {
      return c.json({ error: `Command is not pending approval (current: ${command.approval_status})` }, 400)
    }

    const { error } = await supabase.from('device_commands').update({
      approval_status: 'rejected',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      rejected_reason: reason || null,
      status: 'failed',
      error_message: 'Rejected during approval review',
    }).eq('id', commandId)
    if (error) throw error

    try {
      await supabase.from('audit_logs').insert({
        organization_id: command.organization_id,
        user_id: user.id,
        action: 'device_command_rejected',
        resource_type: 'device_commands',
        resource_id: commandId,
        metadata: { command_type: command.command_type, device_id: command.device_id, reason: reason || null },
      })
    } catch (auditErr: any) {
      console.log(`[Commands] Audit log insert failed (non-fatal): ${auditErr.message}`)
    }

    console.log(`[Commands] Command ${commandId} rejected by ${user.id}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// GET /agent/install.ps1 — returns raw PowerShell agent script for one-liner install
app.get('/make-server-55e8c5b2/agent/install.ps1', async (c) => {
  try {
    const orgId = c.req.query('org_id')
    if (!orgId) return c.json({ error: 'org_id required' }, 400)

    const TMPL = 'cGFyYW0oW3N3aXRjaF0kUnVuT25jZSkKIyBCdWJvSVEgQWdlbnQgdjEuMgokT1JHX0lEID0gJ19fT1JHX0lEX18nCiRBTk9OX0tFWSA9ICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUp6ZFhCaFltRnpaU0lzSW5KbFppSTZJbVZ3YUdsNWJYUmxiMjE0Y0doeGJtdGpjM1p6SWl3aWNtOXNaU0k2SW1GdWIyNGlMQ0pwWVhRaU9qRTNOVGN3TVRZMk9Ea3NJbVY0Y0NJNk1qQTNNalU1TWpZNE9YMC5UUDMxWERjZVNvWnpSdlJYNTIxZGtUcnR1ZnVSN3pVamtxemQzeGplTUo4JwokQVBJX1VSTCA9ICdodHRwczovL2VwaGl5bXRlb214cGhxbmtjc3ZzLnN1cGFiYXNlLmNvL2Z1bmN0aW9ucy92MS9tYWtlLXNlcnZlci01NWU4YzViMicKJElEX0ZJTEUgPSAnQzpcQnVib0lRXGRldmljZV9pZC50eHQnCiRIRUFERVJTID0gQHsnQ29udGVudC1UeXBlJz0nYXBwbGljYXRpb24vanNvbic7J0F1dGhvcml6YXRpb24nPSJCZWFyZXIgJEFOT05fS0VZIjsnYXBpa2V5Jz0kQU5PTl9LRVk7J3gtb3JnLWlkJz0kT1JHX0lEfQoKaWYgKC1ub3QgKFRlc3QtUGF0aCAnQzpcQnVib0lRJykpIHsgTmV3LUl0ZW0gLUl0ZW1UeXBlIERpcmVjdG9yeSAtUGF0aCAnQzpcQnVib0lRJyB8IE91dC1OdWxsIH0KCmZ1bmN0aW9uIEdldC1JZCB7CiAgICBpZiAoVGVzdC1QYXRoICRJRF9GSUxFKSB7IHJldHVybiAoR2V0LUNvbnRlbnQgJElEX0ZJTEUgLVJhdykuVHJpbSgpIH0KICAgICR4ID0gW0d1aWRdOjpOZXdHdWlkKCkuVG9TdHJpbmcoKQogICAgJHggfCBTZXQtQ29udGVudCAkSURfRklMRSAtRW5jb2RpbmcgVVRGOAogICAgcmV0dXJuICR4Cn0KZnVuY3Rpb24gUmVxKCRlcCwgJGIpIHsKICAgIEludm9rZS1SZXN0TWV0aG9kIC1VcmkgIiRBUElfVVJMLyRlcCIgLU1ldGhvZCBQT1NUIC1FcnJvckFjdGlvbiBTdG9wIC1IZWFkZXJzICRIRUFERVJTIC1Cb2R5ICgkYiB8IENvbnZlcnRUby1Kc29uIC1EZXB0aCAxMCAtQ29tcHJlc3MpCn0KZnVuY3Rpb24gUmVxR2V0KCRlcCkgewogICAgSW52b2tlLVJlc3RNZXRob2QgLVVyaSAiJEFQSV9VUkwvJGVwIiAtTWV0aG9kIEdFVCAtRXJyb3JBY3Rpb24gU3RvcCAtSGVhZGVycyAkSEVBREVSUwp9CgokaWQgPSBHZXQtSWQKJGhuID0gJGVudjpDT01QVVRFUk5BTUUKJGlwID0gKEdldC1OZXRJUEFkZHJlc3MgLUFkZHJlc3NGYW1pbHkgSVB2NCB8IFdoZXJlLU9iamVjdCB7ICRfLklQQWRkcmVzcyAtbm90bWF0Y2ggJ14oMTI3fDE2OSknIH0gfCBTZWxlY3QtT2JqZWN0IC1GaXJzdCAxKS5JUEFkZHJlc3MKJG9zID0gKEdldC1XbWlPYmplY3QgV2luMzJfT3BlcmF0aW5nU3lzdGVtKS5DYXB0aW9uCiRvdiA9IChHZXQtV21pT2JqZWN0IFdpbjMyX09wZXJhdGluZ1N5c3RlbSkuVmVyc2lvbgoKdHJ5IHsgJHJlZyA9IFJlcSAnYWdlbnQvcmVnaXN0ZXInIEB7b3JnX2lkPSRPUkdfSUQ7ZGV2aWNlPUB7aWQ9JGlkO2hvc3RuYW1lPSRobjtwbGF0Zm9ybT0kb3M7b3NfdmVyc2lvbj0kb3Y7aXBfYWRkcmVzcz0kaXA7bWV0YWRhdGE9QHt9fX07IGlmICgkcmVnIC1hbmQgJHJlZy5kZXZpY2VfaWQpIHsgJGlkID0gJHJlZy5kZXZpY2VfaWQ7ICRpZCB8IFNldC1Db250ZW50ICRJRF9GSUxFIC1FbmNvZGluZyBVVEY4IH07IFdyaXRlLUhvc3QgJ1tCdWJvSVFdIFJlZ2lzdGVyZWQuJyB9IGNhdGNoIHsgV3JpdGUtSG9zdCAiW0J1Ym9JUV0gUmVnaXN0cmF0aW9uIGVycm9yOiAkXyIgfQoKZnVuY3Rpb24gQ29sbGVjdC1JbnZlbnRvcnkgewogICAgdHJ5IHsKICAgICAgICAkcGtncyA9IEAoJ0hLTE06XFNvZnR3YXJlXE1pY3Jvc29mdFxXaW5kb3dzXEN1cnJlbnRWZXJzaW9uXFVuaW5zdGFsbFwqJywnSEtMTTpcU29mdHdhcmVcV293NjQzMk5vZGVcTWljcm9zb2Z0XFdpbmRvd3NcQ3VycmVudFZlcnNpb25cVW5pbnN0YWxsXConKQogICAgICAgICRhbGxTdyA9IEAoKQogICAgICAgIGZvcmVhY2ggKCRwIGluICRwa2dzKSB7ICRhbGxTdyArPSBHZXQtSXRlbVByb3BlcnR5ICRwIC1FcnJvckFjdGlvbiBTaWxlbnRseUNvbnRpbnVlIHwgV2hlcmUtT2JqZWN0IHsgJF8uRGlzcGxheU5hbWUgfSB8IFNlbGVjdC1PYmplY3QgQHtOPSduYW1lJztFPXskXy5EaXNwbGF5TmFtZX19LEB7Tj0ndmVyc2lvbic7RT17JF8uRGlzcGxheVZlcnNpb259fSxAe049J3B1Ymxpc2hlcic7RT17JF8uUHVibGlzaGVyfX0gfQogICAgICAgICRzdyA9ICRhbGxTdyB8IFNvcnQtT2JqZWN0IG5hbWUgLVVuaXF1ZQogICAgICAgICR1cGQgPSBAKCkKICAgICAgICB0cnkgeyAkc2VzcyA9IE5ldy1PYmplY3QgLUNvbU9iamVjdCBNaWNyb3NvZnQuVXBkYXRlLlNlc3Npb247ICR1cGQgPSBAKCRzZXNzLkNyZWF0ZVVwZGF0ZVNlYXJjaGVyKCkuU2VhcmNoKCJJc0luc3RhbGxlZD0wIGFuZCBUeXBlPSdTb2Z0d2FyZScgYW5kIElzSGlkZGVuPTAiKS5VcGRhdGVzIHwgRm9yRWFjaC1PYmplY3QgeyBAe3RpdGxlPSRfLlRpdGxlO3NldmVyaXR5PSRfLk1zcmNTZXZlcml0eX0gfSkgfSBjYXRjaCB7fQogICAgICAgICRhdiA9IEB7bmFtZT0nVW5rbm93bic7ZW5hYmxlZD0kZmFsc2V9CiAgICAgICAgdHJ5IHsgJGQgPSBHZXQtTXBDb21wdXRlclN0YXR1cyAtRXJyb3JBY3Rpb24gU3RvcDsgJGF2ID0gQHtuYW1lPSdXaW5kb3dzIERlZmVuZGVyJztlbmFibGVkPSR0cnVlO3JlYWxfdGltZV9wcm90ZWN0aW9uPVtib29sXSRkLlJlYWxUaW1lUHJvdGVjdGlvbkVuYWJsZWQ7c2lnbmF0dXJlX2FnZV9kYXlzPSRkLkFudGl2aXJ1c1NpZ25hdHVyZUFnZX0gfSBjYXRjaCB7fQogICAgICAgICRmdyA9IEAoKQogICAgICAgIHRyeSB7ICRmdyA9IEAoR2V0LU5ldEZpcmV3YWxsUHJvZmlsZSB8IFNlbGVjdC1PYmplY3QgQHtOPSdwcm9maWxlJztFPXskXy5OYW1lfX0sQHtOPSdlbmFibGVkJztFPXtbYm9vbF0kXy5FbmFibGVkfX0pIH0gY2F0Y2gge30KICAgICAgICBSZXEgJ2FnZW50L2ludmVudG9yeScgQHtkZXZpY2VfaWQ9JGlkO29yZ2FuaXphdGlvbl9pZD0kT1JHX0lEO2hvc3RuYW1lPSRobjtpbnN0YWxsZWRfc29mdHdhcmU9JHN3O3BlbmRpbmdfdXBkYXRlcz0kdXBkO2F2X3N0YXR1cz0kYXY7ZmlyZXdhbGxfc3RhdHVzPSRmd30gfCBPdXQtTnVsbAogICAgICAgIFdyaXRlLUhvc3QgJ1tCdWJvSVFdIEludmVudG9yeSBzZW50LicKICAgIH0gY2F0Y2ggeyBXcml0ZS1Ib3N0ICJbQnVib0lRXSBJbnZlbnRvcnkgZXJyb3I6ICRfIiB9Cn0KCmZ1bmN0aW9uIEludm9rZS1CdWJvQ29tbWFuZCgkY21kKSB7CiAgICAkY21kSWQgPSAkY21kLmlkCiAgICAkY21kVHlwZSA9ICRjbWQuY29tbWFuZF90eXBlCiAgICBXcml0ZS1Ib3N0ICJbQnVib0lRXSBFeGVjdXRpbmc6ICRjbWRUeXBlIgogICAgdHJ5IHsKICAgICAgICBzd2l0Y2ggKCRjbWRUeXBlKSB7CiAgICAgICAgICAgICdpbnN0YWxsX3VwZGF0ZXMnIHsKICAgICAgICAgICAgICAgICRzZXNzID0gTmV3LU9iamVjdCAtQ29tT2JqZWN0IE1pY3Jvc29mdC5VcGRhdGUuU2Vzc2lvbgogICAgICAgICAgICAgICAgJHVwZGF0ZXMgPSAkc2Vzcy5DcmVhdGVVcGRhdGVTZWFyY2hlcigpLlNlYXJjaCgiSXNJbnN0YWxsZWQ9MCBhbmQgVHlwZT0nU29mdHdhcmUnIGFuZCBJc0hpZGRlbj0wIikuVXBkYXRlcwogICAgICAgICAgICAgICAgaWYgKCR1cGRhdGVzLkNvdW50IC1lcSAwKSB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J05vIHVwZGF0ZXMgYXZhaWxhYmxlJztpbnN0YWxsZWQ9MH19IHwgT3V0LU51bGw7IHJldHVybiB9CiAgICAgICAgICAgICAgICAkZGwgPSAkc2Vzcy5DcmVhdGVVcGRhdGVEb3dubG9hZGVyKCk7ICRkbC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRkbC5Eb3dubG9hZCgpCiAgICAgICAgICAgICAgICAkaW5zdCA9ICRzZXNzLkNyZWF0ZVVwZGF0ZUluc3RhbGxlcigpOyAkaW5zdC5VcGRhdGVzID0gJHVwZGF0ZXM7ICRyID0gJGluc3QuSW5zdGFsbCgpCiAgICAgICAgICAgICAgICBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kdHJ1ZTtyZXN1bHQ9QHttZXNzYWdlPSJJbnN0YWxsZWQgJCgkdXBkYXRlcy5Db3VudCkgdXBkYXRlcyI7cmVib290X3JlcXVpcmVkPVtib29sXSRyLlJlYm9vdFJlcXVpcmVkO2luc3RhbGxlZD0kdXBkYXRlcy5Db3VudH19IHwgT3V0LU51bGwKICAgICAgICAgICAgfQogICAgICAgICAgICAnY29sbGVjdF9pbnZlbnRvcnknIHsgQ29sbGVjdC1JbnZlbnRvcnk7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J0ludmVudG9yeSBjb2xsZWN0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgICdyZXN0YXJ0JyB7IFJlcSAiYWdlbnQvY29tbWFuZHMvJGNtZElkL3Jlc3VsdCIgQHtzdWNjZXNzPSR0cnVlO3Jlc3VsdD1Ae21lc3NhZ2U9J1Jlc3RhcnRpbmcgaW4gMzBzJ319IHwgT3V0LU51bGw7IFN0YXJ0LVNsZWVwIDMwOyBSZXN0YXJ0LUNvbXB1dGVyIC1Gb3JjZSB9CiAgICAgICAgICAgICdydW5fc2NhbicgeyBTdGFydC1NcFNjYW4gLVNjYW5UeXBlIFF1aWNrU2NhbiAtRXJyb3JBY3Rpb24gU2lsZW50bHlDb250aW51ZTsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JHRydWU7cmVzdWx0PUB7bWVzc2FnZT0nUXVpY2sgc2NhbiBpbml0aWF0ZWQnfX0gfCBPdXQtTnVsbCB9CiAgICAgICAgICAgIGRlZmF1bHQgeyBSZXEgImFnZW50L2NvbW1hbmRzLyRjbWRJZC9yZXN1bHQiIEB7c3VjY2Vzcz0kZmFsc2U7ZXJyb3JfbWVzc2FnZT0iVW5rbm93bjogJGNtZFR5cGUifSB8IE91dC1OdWxsIH0KICAgICAgICB9CiAgICB9IGNhdGNoIHsgUmVxICJhZ2VudC9jb21tYW5kcy8kY21kSWQvcmVzdWx0IiBAe3N1Y2Nlc3M9JGZhbHNlO2Vycm9yX21lc3NhZ2U9JF8uVG9TdHJpbmcoKX0gfCBPdXQtTnVsbCB9Cn0KCkNvbGxlY3QtSW52ZW50b3J5CmlmICgkUnVuT25jZSkgeyBXcml0ZS1Ib3N0ICdbQnVib0lRXSBTZXR1cCBjb21wbGV0ZS4nOyBleGl0IDAgfQoKV3JpdGUtSG9zdCAnW0J1Ym9JUV0gQWdlbnQgcnVubmluZy4gSGVhcnRiZWF0IGV2ZXJ5IDUgbWluLicKJHQgPSBbRGlhZ25vc3RpY3MuU3RvcHdhdGNoXTo6U3RhcnROZXcoKQp3aGlsZSAoJHRydWUpIHsKICAgIFN0YXJ0LVNsZWVwIDMwMAogICAgdHJ5IHsgJGRpc2sgPSBbbWF0aF06OlJvdW5kKChHZXQtUFNEcml2ZSBDIHwgRm9yRWFjaC1PYmplY3QgeyAkXy5Vc2VkLygkXy5Vc2VkKyRfLkZyZWUpKjEwMCB9KSwxKTsgUmVxICdhZ2VudC9oZWFydGJlYXQnIEB7ZGV2aWNlX2lkPSRpZDtkZXZpY2U9QHtkaXNrX3VzYWdlX3BlcmNlbnQ9JGRpc2s7bWV0YWRhdGE9QHt9fX0gfCBPdXQtTnVsbCB9IGNhdGNoIHt9CiAgICB0cnkgeyAkcmVzcCA9IFJlcUdldCAiYWdlbnQvY29tbWFuZHM/ZGV2aWNlX2lkPSRpZCI7IGlmICgkcmVzcC5jb21tYW5kcyAtYW5kICRyZXNwLmNvbW1hbmRzLkNvdW50IC1ndCAwKSB7IGZvcmVhY2ggKCRjbWQgaW4gJHJlc3AuY29tbWFuZHMpIHsgSW52b2tlLUJ1Ym9Db21tYW5kICRjbWQgfSB9IH0gY2F0Y2gge30KICAgIGlmICgkdC5FbGFwc2VkLlRvdGFsTWludXRlcyAtZ2UgMzApIHsgQ29sbGVjdC1JbnZlbnRvcnk7ICR0LlJlc3RhcnQoKSB9Cn0K'
    const tplBytes = Uint8Array.from(atob(TMPL), (ch: string) => ch.charCodeAt(0))
    const ps1 = new TextDecoder().decode(tplBytes).replace("'__ORG_ID__'", "'" + orgId + "'")

    return new Response(ps1, {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ── AI Routes (Anthropic Claude) ─────────────────────────────────────────────


// ── Remote Session / Consent Routes ──────────────────────────────────────────

// POST /remote/request-consent
// Creates a session record, generates a consent token, emails the end user
app.post('/make-server-55e8c5b2/remote/request-consent', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const body = await c.req.json()
    const { device_id, organization_id, ticket_id, end_user_email, device_name, technician_name } = body

    if (!device_id || !organization_id || !end_user_email) {
      return c.json({ error: 'device_id, organization_id, and end_user_email are required' }, 400)
    }

    const consent_token = crypto.randomUUID()

    const { data: session, error } = await supabase
      .from('remote_sessions')
      .insert({
        organization_id,
        device_id,
        initiated_by: user.id,
        status: 'pending_consent',
        consent_token,
        consent_status: 'pending',
        end_user_email,
        ticket_id: ticket_id || null,
      })
      .select()
      .single()

    if (error) return c.json({ error: error.message }, 500)

    const consentUrl = `https://www.buboiq.com/consent/${consent_token}`
    const resendKey = Deno.env.get('RESEND_API_KEY')

    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: 'BuboIQ Connect <noreply@buboiq.com>',
          to: end_user_email,
          subject: `Remote Support Request — ${technician_name || 'A technician'} is requesting access`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <img src="https://www.buboiq.com/logo.png" alt="BuboIQ" style="height:32px;margin-bottom:24px"/>
              <h2 style="margin:0 0 8px">Remote Support Request</h2>
              <p style="color:#666;margin:0 0 24px"><strong>${technician_name || 'A technician'}</strong> is requesting remote access to <strong>${device_name || 'your device'}</strong> to provide IT support.</p>
              <p style="color:#666;margin:0 0 24px">If you requested support or are expecting this session, click <strong>Approve</strong> below. If you did not request this, click <strong>Deny</strong>.</p>
              <div style="display:flex;gap:12px;margin-bottom:32px">
                <a href="${consentUrl}?action=approve" style="background:#22c55e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">✓ Approve Access</a>
                <a href="${consentUrl}?action=deny" style="background:#ef4444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">✗ Deny Access</a>
              </div>
              <p style="color:#999;font-size:12px">This link expires in 15 minutes. Session ID: ${session.id}</p>
            </div>
          `
        })
      })
    }

    return c.json({ session_id: session.id, consent_token, status: 'pending_consent' })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /remote/consent/:token — public, returns session info for consent page
app.get('/make-server-55e8c5b2/remote/consent/:token', async (c) => {
  try {
    const token = c.req.param('token')
    const { data: session, error } = await supabase
      .from('remote_sessions')
      .select('id, status, consent_status, device_id, end_user_email, created_at, devices(name, os)')
      .eq('consent_token', token)
      .single()

    if (error || !session) return c.json({ error: 'Session not found' }, 404)
    return c.json(session)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST /remote/consent/:token/respond — end user approves or denies
app.post('/make-server-55e8c5b2/remote/consent/:token/respond', async (c) => {
  try {
    const token = c.req.param('token')
    const { action } = await c.req.json()

    if (!['approve', 'deny'].includes(action)) {
      return c.json({ error: 'action must be approve or deny' }, 400)
    }

    const { data: session, error: fetchError } = await supabase
      .from('remote_sessions')
      .select('id, consent_status')
      .eq('consent_token', token)
      .single()

    if (fetchError || !session) return c.json({ error: 'Session not found' }, 404)
    if (session.consent_status !== 'pending') {
      return c.json({ error: 'Session already responded to' }, 400)
    }

    const { error: updateError } = await supabase
      .from('remote_sessions')
      .update({
        consent_status: action === 'approve' ? 'approved' : 'denied',
        status: action === 'approve' ? 'active' : 'denied',
        started_at: action === 'approve' ? new Date().toISOString() : null,
      })
      .eq('id', session.id)

    if (updateError) return c.json({ error: updateError.message }, 500)
    return c.json({ success: true, consent_status: action === 'approve' ? 'approved' : 'denied' })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /remote/session/:id/status — technician polls for consent approval
app.get('/make-server-55e8c5b2/remote/session/:id/status', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    const { data: session, error } = await supabase
      .from('remote_sessions')
      .select('id, status, consent_status, started_at')
      .eq('id', c.req.param('id'))
      .single()

    if (error || !session) return c.json({ error: 'Session not found' }, 404)
    return c.json(session)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ── AI Route Aliases (frontend compatibility) ────────────────────────────────
// Alias: /ai/triage-ticket → same handler as /ai/ticket-triage
app.post('/make-server-55e8c5b2/ai/triage-ticket', async (c) => {
  try {
    const body = await c.req.json()
    const { ticket_id, title, description, priority } = body
    const prompt = `You are an IT support AI. Analyze this support ticket and provide triage.\nTitle: ${title || ''}\nDescription: ${description || ''}\nCurrent Priority: ${priority || 'unknown'}\n\nRespond with JSON: { "suggested_priority": "low|medium|high|critical", "category": "string", "sentiment": "positive|neutral|negative|frustrated", "suggested_fix": "string", "estimated_time": "string" }`
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
    })
    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : { error: 'No JSON in response' }
    return c.json(parsed)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Alias: /ai/suggest-fixes → AI-powered fix suggestions for a ticket
app.post('/make-server-55e8c5b2/ai/suggest-fixes', async (c) => {
  try {
    const body = await c.req.json()
    const { ticket_id, title, description } = body
    const prompt = `You are a senior IT support engineer. A technician needs actionable fix recommendations for the following support ticket.

Ticket Title: ${title || 'Untitled'}
Ticket Description: ${description || 'No description provided'}

Generate 1 to 3 specific, actionable fix recommendations tailored to this exact issue. Each fix must have a real descriptive title, real numbered steps a technician can follow, a difficulty level, and a realistic time estimate.

Respond ONLY with a valid JSON object, no markdown, no backticks, no extra text:
{"fixes":[{"title":"descriptive fix title","steps":["step 1","step 2","step 3"],"difficulty":"easy","estimated_time":"5-10 minutes"}]}`
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
    })
    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : { fixes: [] }
    return c.json(parsed)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


function stripJSON(raw: string): string {
  return raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error: ${response.status} ${err}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text ?? ''
}

// POST /ai/ticket-triage
app.post('/make-server-55e8c5b2/ai/ticket-triage', async (c) => {
  try {
    const { title, description, org_id } = await c.req.json()
    if (!title || !description) return c.json({ error: 'title and description required' }, 400)

    const memoryContext = org_id ? await buildMemoryContext(org_id) : ''

    const system = `You are an expert IT support triage assistant for an MSP platform.
Analyze the ticket and respond ONLY with a valid JSON object, no markdown, no explanation.
Schema: { "priority": "critical|high|medium|low", "category": "string", "suggested_resolution": "string", "estimated_minutes": number, "confidence": number }${memoryContext}`

    const user = `Ticket Title: ${title}
Description: ${description}`
    const raw = await callClaude(system, user)

    let result
    try { result = JSON.parse(stripJSON(raw)) }
    catch { result = { priority: 'medium', category: 'General', suggested_resolution: raw, confidence: 0.5 } }

    console.log('[AI] Ticket triage complete:', result.priority)
    return c.json({ success: true, ...result })
  } catch (e: any) {
    console.error('[AI] Triage error:', e)
    return c.json({ error: e.message }, 500)
  }
})

// POST /ai/chat
app.post('/make-server-55e8c5b2/ai/chat', async (c) => {
  try {
    const { message, context, org_id } = await c.req.json()
    if (!message) return c.json({ error: 'message required' }, 400)

    const memoryContext = org_id ? await buildMemoryContext(org_id) : ''

    const system = `You are Bubo, the AI assistant for BuboIQ — an IT support platform for Managed Service Providers.
You help IT technicians troubleshoot issues, understand alerts, manage tickets, and navigate the platform.
Be concise, technical, and helpful. If you don't know something, say so.
${context ? `Current context: ${JSON.stringify(context)}` : ''}${memoryContext}`

    const response = await callClaude(system, message)
    return c.json({ success: true, response })
  } catch (e: any) {
    console.error('[AI] Chat error:', e)
    return c.json({ error: e.message }, 500)
  }
})

// POST /ai/signal-analysis
app.post('/make-server-55e8c5b2/ai/signal-analysis', async (c) => {
  try {
    const { signal_type, description, device_hostname, metadata } = await c.req.json()
    if (!signal_type || !description) return c.json({ error: 'signal_type and description required' }, 400)

    const system = `You are an IT infrastructure monitoring expert.
Analyze the signal and respond ONLY with a valid JSON object, no markdown, no explanation.
Schema: { "severity": "critical|high|medium|low|info", "analysis": "string", "recommended_action": "string", "auto_resolvable": boolean }`

    const user = `Signal Type: ${signal_type}
Device: ${device_hostname ?? 'Unknown'}
Description: ${description}
Metadata: ${JSON.stringify(metadata ?? {})}`
    const raw = await callClaude(system, user)

    let result
    try { result = JSON.parse(stripJSON(raw)) }
    catch { result = { severity: 'medium', analysis: raw, recommended_action: 'Manual review required', auto_resolvable: false } }

    console.log('[AI] Signal analysis complete:', result.severity)
    return c.json({ success: true, ...result })
  } catch (e: any) {
    console.error('[AI] Signal analysis error:', e)
    return c.json({ error: e.message }, 500)
  }
})

// POST /ai/kb-generate
app.post('/make-server-55e8c5b2/ai/kb-generate', async (c) => {
  try {
    const { title, issue, resolution, tags } = await c.req.json()
    if (!title || !issue) return c.json({ error: 'title and issue required' }, 400)

    const system = `You are a technical writer for an MSP knowledge base.
Generate a clear, structured KB article and respond ONLY with a valid JSON object, no markdown wrapping, no explanation.
Schema: { "content": "markdown string with ## headings", "summary": "one sentence", "suggested_tags": ["tag1","tag2"] }`

    const user = `Title: ${title}
Issue: ${issue}
${resolution ? `Resolution: ${resolution}` : ''}
${tags ? `Suggested tags: ${tags}` : ''}`
    const raw = await callClaude(system, user)

    let result
    try { result = JSON.parse(stripJSON(raw)) }
    catch { result = { content: raw, summary: title, suggested_tags: [] } }

    console.log('[AI] KB article generated for:', title)
    return c.json({ success: true, ...result })
  } catch (e: any) {
    console.error('[AI] KB generate error:', e)
    return c.json({ error: e.message }, 500)
  }
})



