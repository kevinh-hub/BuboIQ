import React from 'react';
import { AgentManagement } from '../../agent/AgentManagement';
import { useAuth } from '../../../context/AuthContext';

export function AgentManagementPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <AgentManagement
        organizationId={user.orgId}
        organizationName={user.orgName || 'Your Organization'}
        userRole={user.role}
      />
    </div>
  );
}