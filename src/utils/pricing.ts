// BuboIQ Pricing Configuration and Utilities

// Safe environment variable access with fallbacks
const getEnv = (key: string, defaultValue: string): string => {
  try {
    return (import.meta?.env?.[key] as string) || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const PRICE_IDS = {
  core: {
    Starter: getEnv('VITE_STRIPE_PRICE_STARTER', 'price_msp_starter_39'),
    Pro: getEnv('VITE_STRIPE_PRICE_PRO', 'price_msp_pro_149'),
    Team: getEnv('VITE_STRIPE_PRICE_TEAM', 'price_msp_team_349')
  },
  addons: {
    Security: getEnv('VITE_STRIPE_PRICE_ADDON_SECURITY', 'price_addon_security_129'),
    DR: getEnv('VITE_STRIPE_PRICE_ADDON_DR', 'price_addon_dr_99'),
    Remote: getEnv('VITE_STRIPE_PRICE_ADDON_REMOTE', 'price_addon_remote_79')
  },
  annualFactor: (() => {
    try {
      const factor = import.meta?.env?.VITE_ANNUAL_FACTOR;
      return factor ? Number(factor) : 0.85;
    } catch {
      return 0.85;
    }
  })()
};

export const PLAN_LIMITS = {
  Starter: {
    included: 25,
    overage: 1.20,
    aiCap: 100,
    connectSessions: 10,
    connectMinutes: 15
  },
  Pro: {
    included: 100,
    overage: 1.00,
    aiCap: 9999,
    connectSessions: 50,
    connectMinutes: 60
  },
  Team: {
    included: 300,
    overage: 0.80,
    aiCap: 99999,
    connectSessions: 200,
    connectMinutes: 120
  }
};

export const PLAN_PRICING = {
  Starter: { monthly: 39, annual: 33 },
  Pro: { monthly: 149, annual: 127 },
  Team: { monthly: 349, annual: 297 }
};

export const ADDON_PRICING = {
  Security: { 
    monthly: 129, 
    perDevice: 0.60,
    description: 'Security & Compliance Pack',
    mspOnly: true 
  },
  DR: { 
    monthly: 99, 
    perDevice: 0,
    description: 'DR/Backup Pack',
    mspOnly: true 
  },
  Remote: { 
    monthly: 79, 
    perDevice: 0,
    description: 'Remote / Zero-Trust Pack',
    mspOnly: false 
  }
};

// SMB containment thresholds
export const SMB_THRESHOLDS = {
  maxDevices: 25,
  maxTicketsPerMonth: 10
};

// Kevin Haskins consultation URL
export const KEVIN_HASKINS_CONSULT_URL = 'https://kevinhaskins.com/consult';

// Utility functions
export const calculateAnnualPrice = (monthlyPrice: number): number => {
  return Math.round(monthlyPrice * PRICE_IDS.annualFactor);
};

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};

export const getTierLimits = (tier: 'Starter' | 'Pro' | 'Team') => {
  return PLAN_LIMITS[tier];
};

export const canAccessFeature = (
  currentTier: 'starter' | 'pro' | 'team',
  requiredTier: 'starter' | 'pro' | 'team'
): boolean => {
  const tierHierarchy = { starter: 1, pro: 2, team: 3 };
  return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
};