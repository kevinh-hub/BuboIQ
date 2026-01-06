import React from 'react';
import { Button } from '../../../ui/button';
import { AlertTriangle } from 'lucide-react';
import { useSuperAdmin } from '../SuperAdminContext';

export const DangerSystemStrip = () => {
  const { executeDangerAction, config } = useSuperAdmin();

  if (!config) return null;

  const handleDangerAction = (action: string) => {
    if (window.confirm(`Are you sure you want to ${action}? This action is logged and irreversible.`)) {
      executeDangerAction(action);
    }
  };

  return (
    <div className="mt-8 border-t border-crimson-danger/20 pt-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-crimson-danger" />
          <div>
            <h4 className="text-sm font-bold text-crimson-danger uppercase tracking-wider">Danger & System Actions</h4>
            <p className="text-xs text-crimson-danger/60">Irreversible system-wide controls</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="border-crimson-danger/30 text-crimson-danger hover:bg-crimson-danger/10 h-8 text-xs"
            onClick={() => handleDangerAction('Disable Signups')}
            disabled={config.danger.signupsDisabled}
          >
            {config.danger.signupsDisabled ? 'Signups Disabled' : 'Temporarily Disable Signups'}
          </Button>
          <Button 
            variant="outline" 
            className="border-crimson-danger/30 text-crimson-danger hover:bg-crimson-danger/10 h-8 text-xs"
            onClick={() => handleDangerAction('Read-Only Mode')}
            disabled={config.danger.readOnlyMode}
          >
             {config.danger.readOnlyMode ? 'Read-Only Mode Active' : 'Put Platform in Read-Only Mode'}
          </Button>
          <div className="w-px h-8 bg-crimson-danger/20 mx-2 hidden lg:block" />
          <button 
            className="text-xs text-crimson-danger/50 hover:text-crimson-danger underline"
            onClick={() => handleDangerAction('Delete Organization')}
          >
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  );
};
