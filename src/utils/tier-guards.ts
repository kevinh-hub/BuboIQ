// BuboIQ Tier Guard Utilities
// Enforce tier-based feature restrictions

import { PLAN_LIMITS } from './pricing';

export type TierType = 'Starter' | 'Pro' | 'Team';

/**
 * Check if user can access Connect feature based on session count
 */
export function guardConnect(tier: TierType, sessionsThisMonth: number): boolean {
  const limit = PLAN_LIMITS[tier];
  return sessionsThisMonth < limit.connectSessions;
}

/**
 * Get maximum session duration for tier (in minutes)
 */
export function guardDuration(tier: TierType): number {
  return PLAN_LIMITS[tier].connectMinutes;
}

/**
 * Check if user can access AI features based on usage
 */
export function guardAI(tier: TierType, aiRequestsThisMonth: number): boolean {
  const limit = PLAN_LIMITS[tier];
  return aiRequestsThisMonth < limit.aiCap;
}

/**
 * Get device limit for tier
 */
export function getDeviceLimit(tier: TierType): number {
  return PLAN_LIMITS[tier].included;
}

/**
 * Calculate overage cost
 */
export function calculateOverage(tier: TierType, deviceCount: number): number {
  const limits = PLAN_LIMITS[tier];
  const overage = Math.max(0, deviceCount - limits.included);
  return overage * limits.overage;
}

/**
 * Check if tier has access to specific feature
 */
export function hasFeatureAccess(
  currentTier: 'starter' | 'pro' | 'team',
  requiredTier: 'starter' | 'pro' | 'team'
): boolean {
  const tierHierarchy = { starter: 1, pro: 2, team: 3 };
  return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
}

/**
 * Get tier name from lowercase tier string
 */
export function normalizeTier(tier: string): TierType {
  const normalized = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  if (normalized === 'Starter' || normalized === 'Pro' || normalized === 'Team') {
    return normalized as TierType;
  }
  return 'Starter'; // Default fallback
}

/**
 * Feature gates by tier (MSP Pricing: Starter $39, Pro $149, Team $349)
 */
export const FEATURE_GATES = {
  // Starter features ($39/mo - 25 devices)
  basicMonitoring: ['starter', 'pro', 'team'],
  basicTicketing: ['starter', 'pro', 'team'],
  agentDeployment: ['starter', 'pro', 'team'],
  autoTicketing: ['starter', 'pro', 'team'],
  encryptedStorage: ['starter', 'pro', 'team'],
  auditLogsReadOnly: ['starter', 'pro', 'team'],
  emailSupport: ['starter', 'pro', 'team'],
  
  // Pro features ($149/mo - 100 devices)
  aiUnlimited: ['pro', 'team'],
  aiCorrelation: ['pro', 'team'],
  incidentRoom: ['pro', 'team'],
  connectSessions: ['pro', 'team'],
  prioritySupport: ['pro', 'team'],
  devicePosture: ['pro', 'team'], // Compliance: Device posture validation
  networkSegmentation: ['pro', 'team'], // Compliance: Network segmentation
  mfaSessions: ['pro', 'team'], // Compliance: MFA-required sessions
  sessionRecording: ['pro', 'team'], // Compliance: Session recording
  consentCapture: ['pro', 'team'], // Compliance: Consent capture
  evidenceExports: ['pro', 'team'], // Compliance: Evidence exports
  
  // Team features ($349/mo - 300 devices)
  advancedAnalytics: ['team'],
  whiteLabel: ['team'],
  dedicatedSuccess: ['team'],
  customIntegrations: ['team'],
  ssoSaml: ['team'],
  multiSite: ['team'],
  
  // Compliance features - Team only
  phiDetection: ['team'], // PHI detection & redaction
  phiRedaction: ['team'],
  breachWorkflows: ['team'], // Breach notification workflows
  breachNotifications: ['team'],
  cardholderMonitoring: ['team'], // Cardholder data monitoring (PCI-DSS)
  cdeMonitoring: ['team'],
  anomalyDetection: ['team'], // Automated breach detection
  regulatoryAutomation: ['team'], // Regulatory notification automation
  securityAutomation: ['team'], // Security control automation
  continuousCompliance: ['team'], // Continuous compliance monitoring
  complianceDashboard: ['team'], // Full compliance dashboard
  complianceScoring: ['team'],
  workflowConfig: ['team'], // Workflow configuration
  complianceTimeline: ['team'],
  frameworkScoring: ['team'], // HIPAA/PCI/SOC2 scoring
  
  // Add-on features (require addon purchase + tier)
  securityCompliance: 'addon:security_compliance', // $129/mo + $0.60/device
  advancedMonitoring: 'addon:security_compliance',
  hipaaReporting: 'addon:security_compliance',
  soc2Reporting: 'addon:security_compliance',
  auditTrailMgmt: 'addon:security_compliance',
  
  drBackup: 'addon:dr_backup', // $99/mo
  backupMonitoring: 'addon:dr_backup',
  disasterRecovery: 'addon:dr_backup',
  businessContinuity: 'addon:dr_backup',
  
  remoteZeroTrust: 'addon:remote_zt', // $79/mo
  extendedSessions: 'addon:remote_zt',
  zeroTrustPolicies: 'addon:remote_zt',
  advancedSessionControls: 'addon:remote_zt'
} as const;

/**
 * Check if tier has access to a specific feature
 */
export function canAccessFeature(
  tier: 'starter' | 'pro' | 'team',
  feature: keyof typeof FEATURE_GATES,
  addons?: Record<string, boolean>
): boolean {
  const gate = FEATURE_GATES[feature];
  
  // Check if it's an addon feature
  if (typeof gate === 'string' && gate.startsWith('addon:')) {
    const addonKey = gate.replace('addon:', '');
    return addons?.[addonKey] === true;
  }
  
  // Check if it's a tier-based feature
  if (Array.isArray(gate)) {
    return gate.includes(tier);
  }
  
  return false;
}

/**
 * Get upgrade tier recommendation for a feature
 */
export function getUpgradeTier(
  currentTier: 'starter' | 'pro' | 'team',
  feature: keyof typeof FEATURE_GATES
): 'pro' | 'team' | null {
  const gate = FEATURE_GATES[feature];
  
  if (typeof gate === 'string') {
    return null; // Addon feature, not tier-based
  }
  
  if (Array.isArray(gate)) {
    if (gate.includes('pro') && currentTier === 'starter') {
      return 'pro';
    }
    if (gate.includes('team') && (currentTier === 'starter' || currentTier === 'pro')) {
      return 'team';
    }
  }
  
  return null;
}