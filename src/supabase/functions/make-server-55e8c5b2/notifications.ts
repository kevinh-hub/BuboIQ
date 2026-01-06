// Notifications module stubs
export async function notifyNewLead(lead: any) {
  console.log('Notification stub: New lead', lead);
}

export async function notifyLeadStatusChange(lead: any, oldStatus: string, newStatus: string) {
  console.log('Notification stub: Lead status change', { lead, oldStatus, newStatus });
}

export default {
  notifyNewLead,
  notifyLeadStatusChange
};
