// Super Admin API - Production-Ready Supabase Integration
import { supabase } from './client';

export interface Organization {
  id: string;
  company_name: string;
  tier: 'starter' | 'pro' | 'team';
  status: 'active' | 'suspended' | 'trial';
  created_at: string;
  trial_end_date?: string;
  user_count?: number;
  device_count?: number;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'tech' | 'viewer';
  org_id: string;
  created_at: string;
  last_sign_in_at?: string;
}

export interface SystemMetrics {
  total_orgs: number;
  total_users: number;
  active_sessions: number;
  system_uptime: string;
}

// Fetch all organizations
export async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return [];
  }
}

// Fetch organization by ID
export async function fetchOrganizationById(orgId: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return null;
  }
}

// Update organization status
export async function updateOrganizationStatus(
  orgId: string, 
  status: 'active' | 'suspended' | 'trial'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('organizations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orgId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update organization status:', error);
    return false;
  }
}

// Fetch all users
export async function fetchAllUsers(): Promise<AppUser[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

// Fetch users by organization
export async function fetchUsersByOrg(orgId: string): Promise<AppUser[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch users by org:', error);
    return [];
  }
}

// Update user role
export async function updateUserRole(
  userId: string, 
  role: 'admin' | 'tech' | 'viewer'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update user role:', error);
    return false;
  }
}

// Fetch system metrics
export async function fetchSystemMetrics(): Promise<SystemMetrics> {
  try {
    // Fetch total organizations
    const { count: orgCount } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true });

    // Fetch total users
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Calculate uptime (this would come from a backend health endpoint in production)
    const uptime = '99.9%';

    return {
      total_orgs: orgCount || 0,
      total_users: userCount || 0,
      active_sessions: 0, // Would come from session tracking
      system_uptime: uptime
    };
  } catch (error) {
    console.error('Failed to fetch system metrics:', error);
    return {
      total_orgs: 0,
      total_users: 0,
      active_sessions: 0,
      system_uptime: 'N/A'
    };
  }
}

// Count devices for an organization
export async function countOrgDevices(orgId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId);

    return count || 0;
  } catch (error) {
    console.error('Failed to count devices:', error);
    return 0;
  }
}

// Count users for an organization
export async function countOrgUsers(orgId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId);

    return count || 0;
  } catch (error) {
    console.error('Failed to count users:', error);
    return 0;
  }
}