import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
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

// Global initialization flag
let isInitialized = false

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
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
