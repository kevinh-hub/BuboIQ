/**
 * Partner Routing & SMB Containment Logic
 * Handles redirects to KevinHaskins.com when SMBs outgrow self-serve
 */

import { SMB_THRESHOLDS, KEVIN_HASKINS_CONSULT_URL } from './pricing';

export type PartnerLeadReason = 
  | 'device_limit_exceeded'
  | 'ticket_volume_high'
  | 'compliance_requested'
  | 'dr_backup_requested'
  | 'msp_feature_requested';

export interface PartnerLeadData {
  org_id: string;
  reason: PartnerLeadReason;
  context?: {
    deviceCount?: number;
    ticketCount?: number;
    requestedFeature?: string;
  };
}

/**
 * Check if SMB should be routed to partner consultation
 */
export const shouldRouteToPartner = (
  isDirectSMB: boolean,
  deviceCount: number,
  ticketsThisMonth: number
): { shouldRoute: boolean; reason?: PartnerLeadReason } => {
  if (!isDirectSMB) {
    return { shouldRoute: false };
  }

  if (deviceCount >= SMB_THRESHOLDS.maxDevices) {
    return { shouldRoute: true, reason: 'device_limit_exceeded' };
  }

  if (ticketsThisMonth >= SMB_THRESHOLDS.maxTicketsPerMonth) {
    return { shouldRoute: true, reason: 'ticket_volume_high' };
  }

  return { shouldRoute: false };
};

/**
 * Create partner lead record
 */
export const createPartnerLead = async (data: PartnerLeadData): Promise<void> => {
  try {
    const projectId = await import('./supabase/info').then(m => m.projectId);
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/partner-leads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      console.error('Failed to create partner lead:', await response.text());
    }
  } catch (error) {
    console.error('Error creating partner lead:', error);
  }
};

/**
 * Redirect to Kevin Haskins consultation with context
 */
export const redirectToPartnerConsult = (
  reason: PartnerLeadReason,
  orgId?: string
): void => {
  const params = new URLSearchParams({
    reason,
    source: 'buboiq',
    ...(orgId && { org_id: orgId })
  });

  window.location.href = `${KEVIN_HASKINS_CONSULT_URL}?${params.toString()}`;
};

/**
 * Get user-friendly message for partner routing
 */
export const getPartnerRoutingMessage = (reason: PartnerLeadReason): {
  title: string;
  message: string;
} => {
  const messages = {
    device_limit_exceeded: {
      title: "You've Outgrown Self-Serve",
      message: "Your organization manages 25+ devices. Let's talk about MSP-level support that scales with you."
    },
    ticket_volume_high: {
      title: "Ready for Dedicated Support?",
      message: "You're handling significant IT volume. An MSP partnership could help you scale more efficiently."
    },
    compliance_requested: {
      title: "Compliance Requires MSP Partnership",
      message: "Security & Compliance features are available through Verified MSP partners. Let's connect you with the right support."
    },
    dr_backup_requested: {
      title: "DR/Backup Requires MSP Partnership",
      message: "Disaster Recovery and Backup solutions are available through Verified MSP partners. Let's find the right fit."
    },
    msp_feature_requested: {
      title: "MSP-Level Features Available",
      message: "This feature is part of our MSP partnership program. Let's discuss how we can support your growth."
    }
  };

  return messages[reason];
};