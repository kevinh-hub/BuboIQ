import { supabase, getJWTClaims } from './client';

// Super Admin API functions
export class SuperAdminAPI {
  
  // Check if current user is super admin
  static async isSuperAdmin(): Promise<boolean> {
    try {
      const claims = await getJWTClaims();
      return claims?.role === 'super_admin';
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  }

  // Get all organizations (super admin only)
  static async getAllOrganizations() {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      // This bypasses RLS by using a service role function
      const { data, error } = await supabase.rpc('get_all_organizations_super_admin');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all organizations:', error);
      throw error;
    }
  }

  // Get organization details by ID (super admin only)
  static async getOrganizationDetails(orgId: string) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('get_organization_details_super_admin', {
        target_org_id: orgId
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching organization details:', error);
      throw error;
    }
  }

  // Get system-wide metrics (super admin only)
  static async getSystemMetrics() {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('get_system_metrics_super_admin');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  }

  // Get compliance alerts across all organizations
  static async getComplianceAlerts() {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('get_compliance_alerts_super_admin');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching compliance alerts:', error);
      throw error;
    }
  }

  // Suspend organization (super admin only)
  static async suspendOrganization(orgId: string, reason: string) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('suspend_organization_super_admin', {
        target_org_id: orgId,
        suspension_reason: reason
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error suspending organization:', error);
      throw error;
    }
  }

  // Reactivate organization (super admin only)
  static async reactivateOrganization(orgId: string) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('reactivate_organization_super_admin', {
        target_org_id: orgId
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error reactivating organization:', error);
      throw error;
    }
  }

  // Export organization data (super admin only)
  static async exportOrganizationData(orgId: string, dataTypes: string[]) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('export_organization_data_super_admin', {
        target_org_id: orgId,
        data_types: dataTypes
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error exporting organization data:', error);
      throw error;
    }
  }

  // Get audit trail for organization (super admin only)
  static async getOrganizationAuditTrail(orgId: string, limit = 100) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('get_organization_audit_trail_super_admin', {
        target_org_id: orgId,
        record_limit: limit
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      throw error;
    }
  }

  // Update organization tier (super admin only)
  static async updateOrganizationTier(orgId: string, newTier: 'starter' | 'pro' | 'team') {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('update_organization_tier_super_admin', {
        target_org_id: orgId,
        new_tier: newTier
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating organization tier:', error);
      throw error;
    }
  }

  // Resolve compliance alert (super admin only)
  static async resolveComplianceAlert(alertId: string, resolution: string) {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('resolve_compliance_alert_super_admin', {
        alert_id: alertId,
        resolution_notes: resolution
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error resolving compliance alert:', error);
      throw error;
    }
  }

  // Create system-wide announcement (super admin only)
  static async createSystemAnnouncement(title: string, message: string, severity: 'info' | 'warning' | 'critical') {
    const isSuperAdmin = await this.isSuperAdmin();
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Super admin access required');
    }

    try {
      const { data, error } = await supabase.rpc('create_system_announcement_super_admin', {
        announcement_title: title,
        announcement_message: message,
        announcement_severity: severity
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating system announcement:', error);
      throw error;
    }
  }
}

// Enhanced RLS policy helpers
export const SuperAdminRLSPolicies = {
  // Generate RLS policy that allows super_admin bypass
  generateBypassPolicy: (tableName: string, operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE') => {
    return `
      CREATE POLICY "${tableName}_${operation.toLowerCase()}_policy" 
      ON ${tableName} 
      FOR ${operation} 
      USING (
        org_id = auth.jwt() ->> 'org_id'
        OR auth.jwt() ->> 'role' = 'super_admin'
      );
    `;
  },

  // Generate all standard policies for a table
  generateAllPolicies: (tableName: string) => {
    const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    return operations.map(op => SuperAdminRLSPolicies.generateBypassPolicy(tableName, op as any)).join('\n\n');
  }
};

// Super admin audit logging
export const SuperAdminAudit = {
  // Log super admin action
  async logAction(action: string, targetOrgId: string | null, details: any = {}) {
    try {
      const claims = await getJWTClaims();
      if (claims?.role !== 'super_admin') {
        return; // Only log super admin actions
      }

      const { error } = await supabase.from('super_admin_audit_log').insert({
        super_admin_id: claims.user_id,
        action,
        target_org_id: targetOrgId,
        details,
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error('Error logging super admin action:', error);
      }
    } catch (error) {
      console.error('Error in super admin audit logging:', error);
    }
  }
};