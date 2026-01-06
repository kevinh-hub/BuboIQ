import { createContext, useContext } from 'react';
import type { 
  User, 
  Signal, 
  Incident,
  SubscriptionPlan,
  ObservationMetric,
  AutomationFlow
} from '../types';
import type { Permissions } from '../utils/permissions';

export interface AppContextType {
  user: User | null;
  signals: Signal[];
  incidents: Incident[];
  users: User[];
  metrics: ObservationMetric[];
  automations: AutomationFlow[];
  currentPage: string;
  selectedSignal: Signal | null;
  selectedIncident: Incident | null;
  isClientPortal: boolean;
  subscriptionPlan: SubscriptionPlan;
  showUpgradeModal: boolean;
  permissions: Permissions;
  showDemoPage: boolean;
  showOnboarding: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  setSelectedSignal: (signal: Signal | null) => void;
  setSelectedIncident: (incident: Incident | null) => void;
  setIsClientPortal: (isClient: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
  setShowDemoPage: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  refreshSignals: () => Promise<void>;
  refreshIncidents: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  createSignal: (signal: Omit<Signal, 'id' | 'createdAt' | 'updatedAt' | 'correlations' | 'evidencePacks'>) => Promise<void>;
  updateSignal: (signalId: string, updates: Partial<Signal>) => Promise<void>;
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'timeline'>) => Promise<void>;
  updateIncident: (incidentId: string, updates: Partial<Incident>) => Promise<void>;
  upgradePlan: (tier: 'observer' | 'analyst' | 'enterprise') => void;
  // Legacy API compatibility (for gradual migration)
  legacySignals: Signal[]; // Temporary mapping for API transition
  selectedLegacySignal: Signal | null;
  subscriptionInfo: SubscriptionPlan; // Subscription details
  setSelectedLegacySignal: (signal: Signal | null) => void;
  refreshLegacySignals: () => Promise<void>;
  createLegacySignal: (signal: any) => Promise<void>;
  updateLegacySignal: (signalId: string, updates: any) => Promise<void>;
  addSignalComment: (signalId: string, commentData: { content: string; isInternal?: boolean }) => Promise<void>;
  addSignalNote: (signalId: string, noteData: { content: string }) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};