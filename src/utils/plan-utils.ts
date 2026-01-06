import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export type UserPlan = 'basic' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxAgents: number;
  maxIntegrations: number;
  hasAI: boolean;
  hasAutomation: boolean;
  hasSLA: boolean;
  hasConnect: boolean;
  hasAuditLog: boolean;
  hasPrioritySupport: boolean;
  hasCustomWebhooks: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  basic: {
    maxAgents: 3,
    maxIntegrations: 2,
    hasAI: false,
    hasAutomation: false,
    hasSLA: false,
    hasConnect: false,
    hasAuditLog: false,
    hasPrioritySupport: false,
    hasCustomWebhooks: false
  },
  pro: {
    maxAgents: -1, // unlimited
    maxIntegrations: -1, // unlimited
    hasAI: true,
    hasAutomation: true,
    hasSLA: true,
    hasConnect: true,
    hasAuditLog: true,
    hasPrioritySupport: true,
    hasCustomWebhooks: true
  },
  enterprise: {
    maxAgents: -1, // unlimited
    maxIntegrations: -1, // unlimited
    hasAI: true,
    hasAutomation: true,
    hasSLA: true,
    hasConnect: true,
    hasAuditLog: true,
    hasPrioritySupport: true,
    hasCustomWebhooks: true
  }
};

/**
 * Get the user's current plan from Supabase auth metadata
 */
export async function getUserPlan(): Promise<UserPlan> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 'basic'; // Default to basic for unauthenticated users
    }

    // Check app_metadata first, then user_metadata
    const plan = user.app_metadata?.plan || user.user_metadata?.plan || 'basic';
    
    // Validate plan value
    if (['basic', 'pro', 'enterprise'].includes(plan)) {
      return plan as UserPlan;
    }
    
    return 'basic';
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'basic';
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(feature: keyof PlanLimits): Promise<boolean> {
  const plan = await getUserPlan();
  const limits = PLAN_LIMITS[plan];
  
  if (typeof limits[feature] === 'boolean') {
    return limits[feature] as boolean;
  }
  
  return true; // For numeric limits, assume access (specific checks should be done separately)
}

/**
 * Check if user has Connect access specifically
 */
export async function hasConnectAccess(): Promise<boolean> {
  return hasFeatureAccess('hasConnect');
}

/**
 * Get plan limits for current user
 */
export async function getUserPlanLimits(): Promise<PlanLimits> {
  const plan = await getUserPlan();
  return PLAN_LIMITS[plan];
}

/**
 * Update user plan in Supabase auth metadata
 * This would typically be called from a server-side function after payment processing
 */
export async function updateUserPlan(userId: string, plan: UserPlan): Promise<boolean> {
  try {
    // This would need to be done server-side with service role key
    // For demo purposes, we'll update user_metadata
    const { error } = await supabase.auth.updateUser({
      data: { plan }
    });
    
    return !error;
  } catch (error) {
    console.error('Error updating user plan:', error);
    return false;
  }
}

/**
 * Simulate plan upgrade for demo purposes
 * In production, this would integrate with payment processing
 */
export async function simulateUpgrade(targetPlan: UserPlan): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { plan: targetPlan }
    });
    
    if (error) throw error;
    
    // Trigger page reload to reflect new plan
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('Error simulating upgrade:', error);
    return false;
  }
}

/**
 * Check if feature is available and return appropriate response
 */
export async function checkFeatureAvailability(feature: keyof PlanLimits): Promise<{
  available: boolean;
  plan: UserPlan;
  requiredPlan?: UserPlan;
  message?: string;
}> {
  const plan = await getUserPlan();
  const available = await hasFeatureAccess(feature);
  
  if (available) {
    return { available: true, plan };
  }
  
  // Determine required plan for this feature
  let requiredPlan: UserPlan = 'pro';
  for (const [planName, limits] of Object.entries(PLAN_LIMITS)) {
    if (limits[feature]) {
      requiredPlan = planName as UserPlan;
      break;
    }
  }
  
  const featureNames: Record<keyof PlanLimits, string> = {
    maxAgents: 'additional agents',
    maxIntegrations: 'unlimited integrations',
    hasAI: 'AI-powered features',
    hasAutomation: 'automation rules',
    hasSLA: 'SLA monitoring',
    hasConnect: 'BuboIQ Connect remote access',
    hasAuditLog: 'audit logging',
    hasPrioritySupport: 'priority support',
    hasCustomWebhooks: 'custom webhooks'
  };
  
  return {
    available: false,
    plan,
    requiredPlan,
    message: `${featureNames[feature]} requires ${requiredPlan === 'pro' ? 'Pro' : 'Enterprise'} plan`
  };
}

/**
 * Mock user data for demo purposes
 */
export function createMockUser(plan: UserPlan = 'basic') {
  return {
    id: 'demo-user-id',
    email: 'demo@buboiq.com',
    app_metadata: { plan },
    user_metadata: { plan },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}