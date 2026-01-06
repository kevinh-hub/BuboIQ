import { useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';

export type AdminConfig = {
  featureMatrix: {
    [key: string]: { label: string, starter: boolean, pro: boolean, team: boolean, global: boolean }
  };
  overrides: {
    unlockFeatures: boolean;
    unlockTiers: boolean;
    disableTierGuard: boolean;
    enableBeta: boolean;
  };
  pricing: {
    plans: {
      [key: string]: { monthly: number, annual: number, devices: number, overage: number }
    };
    addons: {
      [key: string]: { name: string, price: number, active: boolean }
    };
    discounts: Array<{ name: string, value: string, active: boolean }>;
  };
  compliance: {
    hipaa: boolean;
    pci: boolean;
    soc2: boolean;
    mfaRequired: boolean;
  };
  integrations: {
    email: string;
    remote: string;
    stripe: string;
    crm: string;
  };
  demoPresets: {
    healthcare: boolean;
    finance: boolean;
    saas: boolean;
  };
  danger: {
    signupsDisabled: boolean;
    readOnlyMode: boolean;
  };
};

export const useSuperAdminConfig = (environment: string) => {
  const { session } = useAuth();
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/config?env=${environment}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }

      const data = await response.json();
      setConfig(data.config);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin config:', err);
      setError(err.message);
      toast.error('Failed to load console configuration');
    } finally {
      setLoading(false);
    }
  }, [environment, session?.access_token]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = async (newConfig: Partial<AdminConfig>, actionSummary?: string) => {
    if (!config || !session?.access_token) return;

    // Optimistic update
    const previousConfig = config;
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          env: environment,
          config: updatedConfig,
          actionSummary: actionSummary || 'Updated configuration'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      toast.success('Configuration saved');
    } catch (err) {
      console.error('Error updating config:', err);
      setConfig(previousConfig); // Revert on error
      toast.error('Failed to save changes');
    }
  };

  const executeDangerAction = async (action: string) => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/actions/danger`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          env: environment,
          action
        }),
      });

      if (!response.ok) throw new Error('Action failed');
      
      toast.success(`${action} executed successfully`);
      fetchConfig(); // Refresh config
    } catch (err) {
      toast.error(`Failed to execute ${action}`);
    }
  };

  return {
    config,
    loading,
    error,
    updateConfig,
    executeDangerAction,
    refresh: fetchConfig
  };
};
