import type { TrialInfo } from '../types';

/**
 * Create trial info for new users
 * In production, this would come from the backend
 */
export const createTrialInfo = (): TrialInfo => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 3); // Trial started 3 days ago
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14); // 14-day trial
  
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  return {
    isActive: daysRemaining > 0,
    startDate,
    endDate,
    daysRemaining,
    plan: 'trial'
  };
};

/**
 * Calculate remaining days in trial
 */
export const calculateTrialDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  return Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
};

/**
 * Check if trial has expired
 */
export const isTrialExpired = (trialInfo: TrialInfo): boolean => {
  return trialInfo.plan === 'trial' && trialInfo.daysRemaining <= 0;
};