// BuboIQ AI Intelligence Platform Types

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'engineer' | 'manager' | 'observer';
  avatar?: string;
  department?: string;
  specialization?: string;
  clearanceLevel?: 'standard' | 'elevated' | 'classified';
  isDemo?: boolean;
}

export interface Signal {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  confidence: number; // 0-100
  source: string;
  category: 'infrastructure' | 'security' | 'performance' | 'application' | 'network';
  assignedTo?: User;
  discoveredBy: 'ai' | 'user' | 'automated';
  createdAt: Date;
  updatedAt: Date;
  correlations?: Correlation[];
  evidencePacks?: EvidencePack[];
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
}

export interface Correlation {
  id: string;
  relatedSignalId: string;
  strength: number; // 0-100
  type: 'causal' | 'temporal' | 'pattern' | 'behavioral';
  description: string;
  aiGenerated: boolean;
}

export interface EvidencePack {
  id: string;
  name: string;
  type: 'logs' | 'metrics' | 'traces' | 'artifacts' | 'screenshots';
  url: string;
  size: number;
  collectedAt: Date;
  aiSummary?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'mitigating' | 'resolved';
  assignedTo?: User;
  createdAt: Date;
  resolvedAt?: Date;
  timeline: IncidentTimelineEntry[];
  relatedSignals: string[];
  impactRadius: number; // 0-100
  prediction?: IncidentPrediction;
}

export interface IncidentTimelineEntry {
  id: string;
  timestamp: Date;
  type: 'detection' | 'escalation' | 'action' | 'resolution' | 'note';
  description: string;
  author: User | 'system';
  metadata?: Record<string, any>;
}

export interface IncidentPrediction {
  likelihood: number; // 0-100
  timeToResolution: number; // minutes
  impactScore: number; // 0-100
  recommendedActions: string[];
  aiModel: string;
  generatedAt: Date;
}

export interface ObservationMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
  source: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  createdBy: User;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

export interface AutomationTrigger {
  id: string;
  type: 'signal' | 'metric' | 'time' | 'manual';
  conditions: Record<string, any>;
  enabled: boolean;
}

export interface AutomationAction {
  id: string;
  type: 'notification' | 'escalation' | 'remediation' | 'data_collection';
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface SubscriptionPlan {
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  daysRemaining?: number;
  tier: 'trial' | 'observer' | 'analyst' | 'enterprise';
  features: string[];
  signalLimit: number;
  userLimit: number;
}

// Type unions and utilities
export type UserRole = User['role'];
export type SignalSeverity = Signal['severity'];
export type SignalStatus = Signal['status'];
export type IncidentSeverity = Incident['severity'];
export type IncidentStatus = Incident['status'];
export type PlanTier = SubscriptionPlan['tier'];



// BuboIQ Intelligence Assessment
export interface IntelligenceAssessment {
  id: string;
  incidentId: string;
  content: string;
  analystId: string;
  createdAt: string;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  aiAssisted: boolean;
}

// Trial System Types
export interface TrialInfo {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  plan: 'trial' | 'starter' | 'pro' | 'team';
}