import React, { createContext, useContext } from 'react';
import { useSuperAdminConfig, AdminConfig } from '../../../hooks/useSuperAdminConfig';

type SuperAdminContextType = {
  config: AdminConfig | null;
  loading: boolean;
  environment: string;
  updateConfig: (newConfig: Partial<AdminConfig>, actionSummary?: string) => Promise<void>;
  executeDangerAction: (action: string) => Promise<void>;
  refresh: () => void;
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ environment: string, children: React.ReactNode }> = ({ environment, children }) => {
  const configState = useSuperAdminConfig(environment);

  return (
    <SuperAdminContext.Provider value={{ ...configState, environment }}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};
