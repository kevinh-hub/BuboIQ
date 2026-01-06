import type { UserRole } from '../types';

export interface Permissions {
  canViewAllSignals: boolean;
  canViewOwnSignals: boolean;
  canCreateSignals: boolean;
  canAssignSignals: boolean;
  canViewInternalNotes: boolean;
  canAddInternalNotes: boolean;
  canManageTeam: boolean;
  canViewReports: boolean;
  canAccessSettings: boolean;
  canViewPricing: boolean;
  canManageUsers: boolean;
  // Legacy compatibility
  canViewAllTickets: boolean;
  canViewOwnTickets: boolean;
  canCreateTickets: boolean;
  canAssignTickets: boolean;
}

// BuboIQ Role-based permissions configuration
const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  admin: {
    canViewAllSignals: true,
    canViewOwnSignals: true,
    canCreateSignals: true,
    canAssignSignals: true,
    canViewInternalNotes: true,
    canAddInternalNotes: true,
    canManageTeam: true,
    canViewReports: true,
    canAccessSettings: true,
    canViewPricing: true,
    canManageUsers: true,
    // Legacy compatibility
    canViewAllTickets: true,
    canViewOwnTickets: true,
    canCreateTickets: true,
    canAssignTickets: true
  },
  analyst: {
    canViewAllSignals: true,
    canViewOwnSignals: true,
    canCreateSignals: true,
    canAssignSignals: true,
    canViewInternalNotes: true,
    canAddInternalNotes: true,
    canManageTeam: false,
    canViewReports: true,
    canAccessSettings: false,
    canViewPricing: true,
    canManageUsers: false,
    // Legacy compatibility
    canViewAllTickets: true,
    canViewOwnTickets: true,
    canCreateTickets: true,
    canAssignTickets: true
  },
  engineer: {
    canViewAllSignals: true,
    canViewOwnSignals: true,
    canCreateSignals: true,
    canAssignSignals: false,
    canViewInternalNotes: true,
    canAddInternalNotes: true,
    canManageTeam: false,
    canViewReports: false,
    canAccessSettings: false,
    canViewPricing: false,
    canManageUsers: false,
    // Legacy compatibility
    canViewAllTickets: true,
    canViewOwnTickets: true,
    canCreateTickets: true,
    canAssignTickets: false
  },
  manager: {
    canViewAllSignals: true,
    canViewOwnSignals: true,
    canCreateSignals: true,
    canAssignSignals: true,
    canViewInternalNotes: false,
    canAddInternalNotes: false,
    canManageTeam: true,
    canViewReports: true,
    canAccessSettings: false,
    canViewPricing: true,
    canManageUsers: false,
    // Legacy compatibility
    canViewAllTickets: true,
    canViewOwnTickets: true,
    canCreateTickets: true,
    canAssignTickets: true
  },
  observer: {
    canViewAllSignals: false,
    canViewOwnSignals: true,
    canCreateSignals: false,
    canAssignSignals: false,
    canViewInternalNotes: false,
    canAddInternalNotes: false,
    canManageTeam: false,
    canViewReports: false,
    canAccessSettings: false,
    canViewPricing: false,
    canManageUsers: false,
    // Legacy compatibility
    canViewAllTickets: false,
    canViewOwnTickets: true,
    canCreateTickets: false,
    canAssignTickets: false
  }
};

/**
 * Get permissions for a given user role
 */
export const getRolePermissions = (role: UserRole): Permissions => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.observer;
};