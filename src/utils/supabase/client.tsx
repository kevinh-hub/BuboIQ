import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL for our custom server functions
// The function is deployed as 'server' and routes are accessible at /functions/v1/server/*
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2`;

// Helper function to extract JWT claims
export const getJWTClaims = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.access_token) {
    return null;
  }

  try {
    // Decode JWT payload (base64 decode the middle part)
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    
    // Check for claims in app_metadata first (where our server puts them)
    const appMetadata = payload.app_metadata || {};
    
    return {
      user_id: payload.sub,
      org_id: appMetadata.org_id || payload.org_id,
      role: appMetadata.role || payload.role || 'tech',
      tier: appMetadata.tier || payload.tier || 'team', // Default to team
      email: payload.email
    };
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

// Mock Data Generators
const mockStats = {
  activeTickets: 12,
  resolvedToday: 45,
  aiAutomations: 8,
  avgResponseTime: '1.2h',
  systemUptime: 99.9,
  predictiveAlerts: 3,
  networkHealth: 98,
  devicesOnline: 142,
  devicesTotal: 156,
  criticalDevices: 2,
  discoveryFinds: 5,
  slaCompliance: 98
};

const mockTickets = [
  { id: 'T-101', title: 'Server CPU High', status: 'open', priority: 'critical', created_at: new Date().toISOString() },
  { id: 'T-102', title: 'Printer Offline', status: 'in_progress', priority: 'medium', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'T-103', title: 'VPN Connection Failed', status: 'resolved', priority: 'high', created_at: new Date(Date.now() - 7200000).toISOString() }
];

const mockDevices = Array.from({ length: 10 }).map((_, i) => ({
  id: `dev-${i}`,
  hostname: `workstation-${i}`,
  is_online: i % 5 !== 0,
  health_score: 85 + (i % 15),
  updated_at: new Date().toISOString()
}));

const mockSignals = [
  { id: 'sig-1', type: 'security', severity: 'high', title: 'Failed Login Attempt', status: 'active', created_at: new Date().toISOString() },
  { id: 'sig-2', type: 'performance', severity: 'medium', title: 'Memory Usage > 80%', status: 'active', created_at: new Date().toISOString() }
];

// Helper function to make authenticated API calls with tier checking
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('[API Call] Session error:', sessionError);
    throw new Error(`Session error: ${sessionError.message}`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`[API Call] ${options.method || 'GET'} ${fullUrl}`);
  console.log(`[API Call] Headers:`, { ...headers, Authorization: headers.Authorization?.slice(0, 20) + '...' });

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log(`[API Response] ${response.status} ${response.statusText} - ${fullUrl}`);

    if (response.status === 402) {
      const errorData = await response.json().catch(() => ({ error: 'Payment Required' }));
      throw new TierRestrictedError(errorData.error || 'This feature requires a higher tier subscription', errorData.requiredTier);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error(`[API Error] ${fullUrl}`, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Call Failed] ${fullUrl}`, error);
    console.error('[API Call] Full error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

// Custom error class for tier restrictions
export class TierRestrictedError extends Error {
  requiredTier: string;
  
  constructor(message: string, requiredTier: string) {
    super(message);
    this.name = 'TierRestrictedError';
    this.requiredTier = requiredTier;
  }
}

// Authentication helpers
export const authApi = {
  signUp: async (email: string, password: string, name: string, role = 'tech', department?: string, companyName?: string) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, department, companyName }),
    });
  },

  signIn: async (email: string, password: string) => {
    console.log('authApi.signIn: Starting sign in for:', email);
    console.log('authApi.signIn: API endpoint:', `${API_BASE_URL}/auth/signin`);
    console.log('authApi.signIn: Full URL will be:', `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/auth/signin`);
    
    // For super admin (Kevin), try direct Supabase auth first
    if (email.toLowerCase() === 'kevinh@buboiq.com') {
      console.log('authApi.signIn: Super admin (Kevin) detected, trying direct Supabase auth');
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (authError) {
          console.error('authApi.signIn: Super admin direct auth failed:', authError);
          
          // If the user doesn't exist, we need to create it via the backend API
          if (authError.message.includes('Invalid login credentials')) {
            console.log('authApi.signIn: Super admin user does not exist, creating via backend API...');
            
            // Use the backend signup API which has proper permissions
            try {
              const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                  email,
                  password,
                  name: 'Kevin H',
                  role: 'super_admin'
                })
              });
              
              if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                throw new Error(`Failed to create super admin: ${errorData.error || 'Unknown error'}`);
              }
              
              const signupData = await signupResponse.json();
              console.log('authApi.signIn: Super admin created successfully via backend');
              
              // Now try to sign in again
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (signInError) {
                console.error('authApi.signIn: Failed to sign in after creating user:', signInError);
                throw signInError;
              }
              
              if (signInData.session && signInData.user) {
                console.log('authApi.signIn: Successfully signed in newly created super admin');
                localStorage.setItem('buboiq_session', signInData.session.access_token);
                
                return {
                  success: true,
                  access_token: signInData.session.access_token,
                  refresh_token: signInData.session.refresh_token,
                  user: {
                    id: signInData.user.id,
                    email: signInData.user.email,
                    name: 'Kevin H',
                    role: 'super_admin',
                    tier: 'team',
                    org_id: 'buboiq-admin',
                    company_name: 'BuboIQ',
                    permissions: ['*'],
                  }
                };
              }
            } catch (createError) {
              console.error('authApi.signIn: Failed to create super admin via backend:', createError);
              throw createError;
            }
          }
          
          throw authError;
        }
        
        if (data.session && data.user) {
          console.log('authApi.signIn: Direct auth successful for super admin');
          localStorage.setItem('buboiq_session', data.session.access_token);
          
          // Return super admin user profile
          return {
            success: true,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: 'Kevin H',
              role: 'super_admin',
              tier: 'team',
              org_id: 'buboiq-admin',
              company_name: 'BuboIQ',
              permissions: ['*'],
            }
          };
        }
      } catch (error) {
        console.error('authApi.signIn: Super admin auth error:', error);
        throw error;
      }
    }
    
    try {
      const response = await apiCall('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('authApi.signIn: API response received:', { 
        success: response.success, 
        hasAccessToken: !!response.access_token,
        hasUser: !!response.user 
      });
      
      // Store the access token immediately for subsequent calls
      if (response.success && response.access_token) {
        localStorage.setItem('buboiq_session', response.access_token);
        console.log('authApi.signIn: Access token stored in localStorage');
        
        // Update Supabase session
        try {
          await supabase.auth.setSession({
            access_token: response.access_token,
            refresh_token: response.refresh_token
          });
          console.log('authApi.signIn: Supabase session set successfully');
        } catch (sessionError) {
          console.warn('authApi.signIn: Failed to set Supabase session:', sessionError);
        }
      } else {
        console.error('authApi.signIn: Response missing expected data:', response);
      }
      
      return response;
    } catch (error) {
      console.error('authApi.signIn: API call failed:', error);
      
      // If the API call fails completely (network error), try direct Supabase auth as fallback
      console.log('authApi.signIn: Attempting fallback Supabase auth...');
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (authError) {
          console.error('authApi.signIn: Fallback auth also failed:', authError);
          throw error; // Throw original error
        }
        
        if (data.session && data.user) {
          console.log('authApi.signIn: Fallback auth successful');
          localStorage.setItem('buboiq_session', data.session.access_token);
          
          // Get or create user profile
          const userProfile = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || email,
            role: data.user.user_metadata?.role || 'tech',
            tier: data.user.user_metadata?.tier || 'starter',
            org_id: data.user.user_metadata?.org_id || 'default',
            company_name: data.user.user_metadata?.company_name || 'My Company',
            permissions: [],
          };
          
          return {
            success: true,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: userProfile
          };
        }
      } catch (fallbackError) {
        console.error('authApi.signIn: Fallback auth error:', fallbackError);
        throw error; // Throw original error
      }
      
      throw error;
    }
  },

  signOut: async () => {
    // Clear local storage
    localStorage.removeItem('buboiq_session');
    localStorage.removeItem('bubo_user');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Get user's current tier and role
  getUserContext: async () => {
    const claims = await getJWTClaims();
    if (!claims) return null;
    
    try {
      const user = await apiCall('/auth/me');
      return {
        ...user,
        org_id: claims.org_id,
        role: claims.role,
        tier: claims.tier
      };
    } catch (error) {
      console.error('Failed to get user context:', error);
      return null;
    }
  }
};

// Users API
export const usersApi = {
  getAll: async () => {
    return apiCall('/users');
  },

  getByOrganization: async () => {
    return apiCall('/users/organization');
  },

  updateProfile: async (updates: any) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
};

// Tickets API with full CRUD
export const ticketsApi = {
  getAll: async (filters?: { status?: string; priority?: string; assignee_id?: string }) => {
    const query = filters ? '?' + new URLSearchParams(filters).toString() : '';
    return apiCall(`/tickets${query}`);
  },

  getById: async (id: string) => {
    return apiCall(`/tickets/${id}`);
  },

  create: async (ticketData: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    assignee_id?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }) => {
    return apiCall('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  assign: async (id: string, assignee_id: string) => {
    return apiCall(`/tickets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assignee_id }),
    });
  },

  updateStatus: async (id: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    return apiCall(`/tickets/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  addComment: async (ticketId: string, content: string, isInternal = false) => {
    return apiCall(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, is_internal: isInternal }),
    });
  },

  calculateRiskScore: async (id: string) => {
    return apiCall(`/tickets/${id}/risk-score`, {
      method: 'POST',
    });
  }
};

// Signals API for monitoring data
export const signalsApi = {
  getAll: async (filters?: { status?: string; severity?: string; source?: string }) => {
    const query = filters ? '?' + new URLSearchParams(filters).toString() : '';
    return apiCall(`/signals${query}`);
  },

  getById: async (id: string) => {
    return apiCall(`/signals/${id}`);
  },

  create: async (signalData: {
    source: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description?: string;
    fingerprint: string;
    payload?: Record<string, any>;
    device_id?: string;
  }) => {
    return apiCall('/signals', {
      method: 'POST',
      body: JSON.stringify(signalData),
    });
  },

  acknowledge: async (id: string) => {
    return apiCall(`/signals/${id}/acknowledge`, {
      method: 'POST',
    });
  },

  resolve: async (id: string) => {
    return apiCall(`/signals/${id}/resolve`, {
      method: 'POST',
    });
  },

  getCorrelated: async (correlationKey: string) => {
    return apiCall(`/signals/correlated/${correlationKey}`);
  }
};

// Devices API for asset management
export const devicesApi = {
  getAll: async () => {
    return apiCall('/devices');
  },

  getById: async (id: string) => {
    return apiCall(`/devices/${id}`);
  },

  create: async (deviceData: {
    hostname: string;
    display_name?: string;
    device_type?: 'workstation' | 'server' | 'laptop' | 'mobile' | 'network';
    ip_address?: string;
    mac_address?: string;
    operating_system?: string;
    tags?: string[];
    location?: string;
    department?: string;
    owner_email?: string;
    provider_caps?: string[];
    metadata?: Record<string, any>;
  }) => {
    return apiCall('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  },

  update: async (id: string, updates: any) => {
    return apiCall(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/devices/${id}`, {
      method: 'DELETE',
    });
  },

  updateHealthScore: async (id: string, healthScore: number) => {
    return apiCall(`/devices/${id}/health`, {
      method: 'POST',
      body: JSON.stringify({ health_score: healthScore }),
    });
  }
};

// Sessions API for remote access
export const sessionsApi = {
  getAll: async () => {
    return apiCall('/sessions');
  },

  getById: async (id: string) => {
    return apiCall(`/sessions/${id}`);
  },

  create: async (sessionData: {
    device_id: string;
    provider: 'rustdesk' | 'teamviewer' | 'vnc' | 'ssh' | 'chrome_remote';
    ticket_id?: string;
    recording_enabled?: boolean;
  }) => {
    return apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  grantConsent: async (id: string) => {
    return apiCall(`/sessions/${id}/consent`, {
      method: 'POST',
    });
  },

  end: async (id: string, endReason?: string) => {
    return apiCall(`/sessions/${id}/end`, {
      method: 'POST',
      body: JSON.stringify({ end_reason: endReason }),
    });
  },

  getActive: async () => {
    return apiCall('/sessions?status=active');
  }
};

// Audit API for compliance and tracking
export const auditApi = {
  getLogs: async (filters?: { action?: string; entity?: string; limit?: number; offset?: number }) => {
    const query = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiCall(`/audit${query}`);
  },

  exportLogs: async (startDate: string, endDate: string, format: 'csv' | 'json' = 'csv') => {
    return apiCall('/audit/export', {
      method: 'POST',
      body: JSON.stringify({ start_date: startDate, end_date: endDate, format }),
    });
  }
};

// Intelligence API for AI features
export const intelligenceApi = {
  getPredictions: async () => {
    return apiCall('/intelligence/predictions');
  },

  getInsights: async () => {
    return apiCall('/intelligence/insights');
  },

  getAutoResolutionSuggestions: async (ticketId: string) => {
    return apiCall(`/intelligence/auto-resolve/${ticketId}`);
  },

  getCorrelationAnalysis: async (signalId: string) => {
    return apiCall(`/intelligence/correlate/${signalId}`);
  }
};

// Statistics API for dashboard metrics
export const statsApi = {
  getDashboard: async () => {
    return apiCall('/stats/dashboard');
  },

  getTicketMetrics: async (timeRange: '24h' | '7d' | '30d' = '24h') => {
    return apiCall(`/stats/tickets?range=${timeRange}`);
  },

  getDeviceMetrics: async () => {
    return apiCall('/stats/devices');
  },

  getSystemHealth: async () => {
    return apiCall('/stats/system');
  }
};

// Feature flags API
export const featureFlagsApi = {
  getAll: async () => {
    return apiCall('/feature-flags');
  },

  isEnabled: async (flagName: string) => {
    try {
      const response = await apiCall(`/feature-flags/${flagName}`);
      return response.enabled;
    } catch (error) {
      return false;
    }
  },

  toggle: async (flagName: string, enabled: boolean) => {
    return apiCall(`/feature-flags/${flagName}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  }
};

// Admin API (requires admin role)
export const adminApi = {
  getMetrics: async () => {
    return apiCall('/admin/metrics');
  },

  getSystemStatus: async () => {
    return apiCall('/admin/system-status');
  },

  getAllOrganizations: async () => {
    return apiCall('/admin/organizations');
  },

  updateFeatureFlag: async (name: string, enabled: boolean) => {
    return apiCall('/admin/feature-flags', {
      method: 'PUT',
      body: JSON.stringify({ name, enabled }),
    });
  }
};

// Subscription and billing API
export const subscriptionApi = {
  getCurrent: async () => {
    return apiCall('/subscription');
  },

  upgrade: async (tier: 'starter' | 'pro' | 'team') => {
    return apiCall('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  },

  cancel: async () => {
    return apiCall('/subscription/cancel', {
      method: 'POST',
    });
  },

  getBillingHistory: async () => {
    return apiCall('/subscription/billing-history');
  }
};

// BuboIQ Connect API (legacy alias for compatibility)
export const connectApi = {
  // Devices
  getDevices: devicesApi.getAll,
  addDevice: devicesApi.create,
  updateDevice: devicesApi.update,
  deleteDevice: devicesApi.delete,

  // Sessions
  createSession: sessionsApi.create,
  getSession: sessionsApi.getById,
  getSessions: sessionsApi.getAll,
  endSession: sessionsApi.end,
  grantConsent: sessionsApi.grantConsent,

  // Audit
  getAuditLogs: auditApi.getLogs,

  // Plan verification for backwards compatibility
  verifyProAccess: async () => {
    try {
      const user = await authApi.getCurrentUser();
      const tier = user?.tier || 'starter';
      return ['pro', 'team'].includes(tier);
    } catch (error) {
      console.warn('Could not verify Pro access:', error);
      return false;
    }
  }
};