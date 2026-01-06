// BuboIQ Demo Intelligence Analysts
export const DEMO_ACCOUNTS = [
  {
    id: 'user_admin_001',
    email: 'admin@buboiq.com',
    name: 'Dr. Sarah Chen',
    role: 'admin',
    department: 'AI Intelligence',
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'Chief Intelligence Officer'
  },
  {
    id: 'user_analyst_002',
    email: 'alex@buboiq.com', 
    name: 'Alex Rodriguez',
    role: 'analyst',
    department: 'Threat Detection',
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'Senior AI Analyst'
  },
  {
    id: 'user_analyst_003',
    email: 'maya@buboiq.com',
    name: 'Maya Patel', 
    role: 'analyst',
    department: 'Neural Networks',
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'Machine Learning Specialist'
  },
  {
    id: 'user_engineer_004',
    email: 'jordan@company.com',
    name: 'Jordan Kim',
    role: 'engineer', 
    department: 'Infrastructure',
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'DevOps Engineer'
  },
  {
    id: 'user_manager_005',
    email: 'taylor@company.com',
    name: 'Taylor Brooks',
    role: 'manager',
    department: 'Operations', 
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'IT Operations Manager'
  },
  {
    id: 'user_observer_006',
    email: 'client@partner.com',
    name: 'External Observer',
    role: 'observer',
    department: 'External',
    avatar: null,
    createdAt: new Date().toISOString(),
    isDemo: true,
    specialization: 'Security Partner'
  }
];

export const STORAGE_BUCKETS = [
  'make-55e8c5b2-evidence-packs',
  'make-55e8c5b2-incident-files', 
  'make-55e8c5b2-neural-models',
  'make-55e8c5b2-system-logs'
];

export const SAMPLE_INCIDENTS = [
  {
    id: 'incident_001',
    title: 'Anomalous Network Traffic Detected',
    description: 'AI models detected unusual traffic patterns suggesting potential security breach. Neural analysis indicates 94.2% confidence of unauthorized access attempt.',
    status: 'Active',
    severity: 'Critical', 
    category: 'Security Threat',
    assignedAnalystId: 'user_analyst_002',
    discoveredById: 'system_ai_001',
    createdAt: new Date('2024-01-15T08:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T14:22:00Z').toISOString(),
    confidenceScore: 94.2,
    aiPrediction: 'Potential APT-style attack vector',
    evidencePacks: ['evidence_001', 'evidence_002'],
    riskLevel: 'High'
  },
  {
    id: 'incident_002', 
    title: 'Performance Degradation Alert',
    description: 'Machine learning algorithms detected significant performance degradation across multiple system components. Predictive models suggest hardware failure imminent.',
    status: 'Investigating',
    severity: 'High', 
    category: 'System Performance',
    assignedAnalystId: 'user_analyst_003',
    discoveredById: 'system_ai_002',
    createdAt: new Date('2024-01-14T16:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T09:15:00Z').toISOString(),
    confidenceScore: 87.5,
    aiPrediction: 'Storage subsystem failure predicted within 72h',
    evidencePacks: ['evidence_003'],
    riskLevel: 'Medium'
  },
  {
    id: 'incident_003',
    title: 'Automated Response Success', 
    description: 'AI-driven automated response successfully mitigated DDoS attack. Neural networks adapted defense patterns in real-time.',
    status: 'Resolved',
    severity: 'Medium',
    category: 'Automated Defense',
    assignedAnalystId: 'user_analyst_002',
    discoveredById: 'system_ai_003',
    createdAt: new Date('2024-01-13T12:20:00Z').toISOString(), 
    updatedAt: new Date('2024-01-13T13:45:00Z').toISOString(),
    confidenceScore: 99.1,
    aiPrediction: 'Threat neutralized, no further action required',
    evidencePacks: ['evidence_004'],
    riskLevel: 'Low'
  }
];

export const SAMPLE_ASSESSMENTS = [
  {
    id: 'assessment_001',
    incidentId: 'incident_001',
    content: 'Neural pattern analysis confirms this matches known APT group signatures. Recommend immediate containment protocols.',
    analystId: 'user_analyst_002',
    createdAt: new Date('2024-01-15T10:15:00Z').toISOString(),
    confidenceLevel: 'High',
    aiAssisted: true
  },
  {
    id: 'assessment_002', 
    incidentId: 'incident_002',
    content: 'Predictive models show cascading failure probability increasing. Hardware replacement scheduled.',
    analystId: 'user_analyst_003',
    createdAt: new Date('2024-01-14T18:30:00Z').toISOString(),
    confidenceLevel: 'Medium',
    aiAssisted: true
  }
];

export const AI_LEARNING_METRICS = {
  totalProcessedEvents: 152847,
  threatsDetected: 23,
  falsePositiveRate: 2.1,
  neuralAccuracy: 94.7,
  predictionSuccess: 89.2,
  lastModelUpdate: new Date().toISOString()
};

// CORS headers for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Helper functions for API responses
export const createErrorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

export const createSuccessResponse = (data: any, status = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

// Helper function to get user from request headers
export const getUserFromHeaders = async (req: Request, supabase: any) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return null;
    }

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user from headers:', error);
    return null;
  }
};
