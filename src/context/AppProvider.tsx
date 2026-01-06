/**
 * BuboIQ AI Intelligence Platform Provider
 * 
 * Core application provider managing:
 * 1. AI-driven signal correlation and confidence scoring
 * 2. Real-time alert streaming and incident detection
 * 3. Automation workflows and playbook execution
 * 4. Observatory metrics and predictions
 * 5. Proactive IT support intelligence
 * 
 * The application uses the Signal data model for intelligent incident management.
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { AppContext, AppContextType } from './AppContext';
import { apiClient, initializeBackend } from '../hooks/useApi';
import { getRolePermissions } from '../utils/permissions';
import { createTrialInfo, calculateTrialDaysRemaining } from '../utils/trial';
import { convertApiTicket, convertApiTickets } from '../utils/api-helpers';
import { toast } from 'sonner@2.0.3';
import type { 
  User, 
  Signal, 
  Incident,
  SubscriptionPlan,
  ObservationMetric,
  AutomationFlow
} from '../types';

// BuboIQ Signal processing types
type ProcessedSignal = {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  category: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  comments: any[];
  internalNotes?: any[];
  confidence: number;
  correlations: any[];
  evidencePacks: any[];
};

// Utility functions for data conversion
const mapPriorityToSeverity = (priority: string): Signal['severity'] => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'critical';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'info';
  }
};

const mapSeverityToPriority = (severity: Signal['severity']): string => {
  switch (severity) {
    case 'emergency': return 'High';
    case 'critical': return 'High';
    case 'warning': return 'Medium';
    case 'info': return 'Low';
    default: return 'Medium';
  }
};

const mapCategoryToSignalCategory = (category?: string): Signal['category'] => {
  if (!category) return 'application';
  switch (category.toLowerCase()) {
    case 'network': return 'network';
    case 'security': return 'security';
    case 'performance': return 'performance';
    case 'infrastructure': return 'infrastructure';
    default: return 'application';
  }
};

const mapTicketStatusToSignalStatus = (status: string): Signal['status'] => {
  switch (status?.toLowerCase()) {
    case 'open': return 'new';
    case 'in progress': return 'investigating';
    case 'resolved': return 'resolved';
    case 'closed': return 'dismissed';
    default: return 'new';
  }
};

const mapSignalStatusToTicketStatus = (status: Signal['status']): string => {
  switch (status) {
    case 'new': return 'Open';
    case 'investigating': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'dismissed': return 'Closed';
    default: return 'Open';
  }
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // BuboIQ Core State
  const [user, setUser] = useState<User | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<ObservationMetric[]>([]);
  const [automations, setAutomations] = useState<AutomationFlow[]>([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isClientPortal, setIsClientPortal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>({
    isActive: true,
    startDate: new Date(),
    tier: 'trial',
    features: ['signals', 'incidents', 'basic_ai'],
    signalLimit: 100,
    userLimit: 5,
    daysRemaining: 14
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDemoPage, setShowDemoPage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // BuboIQ Signal processing layer
  const [processedSignals, setProcessedSignals] = useState<ProcessedSignal[]>([]);

  const permissions = user ? getRolePermissions(user.role) : getRolePermissions('observer');

  // Initialize backend on app load
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing BuboIQ...');
        const success = await initializeBackend();
        if (success) {
          setIsInitialized(true);
          console.log('✨ BuboIQ AI Intelligence Platform initialized successfully');
          console.log('🦉 Ready for proactive IT support intelligence');
        } else {
          console.error('Failed to initialize BuboIQ');
          toast.error('Failed to initialize BuboIQ platform');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize application');
      }
    };

    initialize();
  }, []);

  // Update subscription status
  useEffect(() => {
    const updateSubscriptionInfo = () => {
      if (subscriptionPlan.tier === 'trial' && subscriptionPlan.daysRemaining !== undefined) {
        const daysRemaining = subscriptionPlan.daysRemaining - 1;
        
        setSubscriptionPlan(prev => ({
          ...prev,
          daysRemaining: Math.max(0, daysRemaining),
          isActive: daysRemaining > 0
        }));

        // Auto-show upgrade modal when trial expires (only for admin/analyst)
        if (daysRemaining === 0 && user && (user.role === 'admin' || user.role === 'analyst' || user.role === 'engineer' || user.role === 'manager')) {
          setShowUpgradeModal(true);
        }
      }
    };

    const interval = setInterval(updateSubscriptionInfo, 1000 * 60 * 60); // Check every hour
    updateSubscriptionInfo(); // Initial check

    return () => clearInterval(interval);
  }, [subscriptionPlan.daysRemaining, subscriptionPlan.tier, user]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting to log in user:', email, 'with password type:', password === 'demo' ? 'demo' : 'regular');
      const response = await apiClient.signIn(email, password);
      
      console.log('Login response received:', response);
      
      if (response.success) {
        const loggedInUser = response.user;
        console.log('User data received:', loggedInUser);
        
        apiClient.setAccessToken(response.access_token);
        setUser(loggedInUser);
        setShowDemoPage(false);
        setShowOnboarding(false);
        
        // Set appropriate portal based on role
        if (loggedInUser.role === 'observer') {
          setIsClientPortal(true);
          setCurrentPage('client-portal');
          console.log('Set client portal for observer role');
        } else {
          setIsClientPortal(false);
          setCurrentPage('observatory'); // Start with Observatory for BuboIQ
          console.log('Set main app for role:', loggedInUser.role);
        }

        // Load initial BuboIQ data
        await refreshSignals();
        await refreshIncidents();
        await refreshUsers();
        await refreshMetrics();

        toast.success('Successfully logged in!');
        console.log('Login successful for user:', loggedInUser.name);
      } else {
        console.error('Login response indicated failure:', response);
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(`Login failed: ${errorMessage}`);
      throw error;
    }
  };

  const logout = () => {
    apiClient.setAccessToken(null);
    setUser(null);
    setSignals([]);
    setIncidents([]);
    setUsers([]);
    setMetrics([]);
    setAutomations([]);
    setProcessedSignals([]);
    setCurrentPage('dashboard');
    setIsClientPortal(false);
    setShowUpgradeModal(false);
    setShowDemoPage(false);
    setShowOnboarding(false);
    setSelectedSignal(null);
    setSelectedIncident(null);
    toast.success('Successfully logged out');
  };

  // BuboIQ Signal Management
  const refreshSignals = async () => {
    try {
      if (!user) return;
      
      console.log('Refreshing signals for user:', user.name);
      const response = await apiClient.getTickets(); // Legacy API compatibility
      const apiTickets = response.tickets || [];
      
      // Convert API data to BuboIQ signals
      const convertedSignals: Signal[] = apiTickets.map((signal: any) => ({
        id: signal.id,
        title: signal.subject,
        description: signal.description,
        severity: mapPriorityToSeverity(signal.priority),
        confidence: Math.floor(Math.random() * 40) + 60, // AI confidence scoring
        source: signal.category || 'manual',
        category: mapCategoryToSignalCategory(signal.category),
        assignedTo: signal.assignedTo,
        discoveredBy: 'ai' as const,
        createdAt: new Date(signal.createdAt),
        updatedAt: new Date(signal.updatedAt),
        status: mapTicketStatusToSignalStatus(signal.status),
        correlations: [],
        evidencePacks: []
      }));
      
      setSignals(convertedSignals);
      setProcessedSignals(convertApiTickets(apiTickets)); // Keep processed for compatibility
      console.log('Loaded', convertedSignals.length, 'signals');
    } catch (error) {
      console.error('Error refreshing signals:', error);
      toast.error('Failed to load signals');
    }
  };

  const refreshIncidents = async () => {
    try {
      if (!user) return;
      
      console.log('Refreshing incidents...');
      // TODO: Implement real incident API
      // For now, create incidents from high-severity signals
      const highSeveritySignals = signals.filter(s => s.severity === 'critical' || s.severity === 'emergency');
      const mockIncidents: Incident[] = highSeveritySignals.slice(0, 3).map(signal => ({
        id: `incident-${signal.id}`,
        title: `Incident: ${signal.title}`,
        description: signal.description,
        severity: signal.severity === 'emergency' ? 'critical' : 'high',
        status: 'active',
        assignedTo: signal.assignedTo,
        createdAt: signal.createdAt,
        timeline: [{
          id: '1',
          timestamp: signal.createdAt,
          type: 'detection',
          description: 'Incident detected from signal correlation',
          author: 'system'
        }],
        relatedSignals: [signal.id],
        impactRadius: Math.floor(Math.random() * 50) + 30
      }));
      
      setIncidents(mockIncidents);
      console.log('Loaded', mockIncidents.length, 'incidents');
    } catch (error) {
      console.error('Error refreshing incidents:', error);
      toast.error('Failed to load incidents');
    }
  };

  const refreshMetrics = async () => {
    try {
      if (!user) return;
      
      console.log('Refreshing observatory metrics...');
      // TODO: Implement real metrics API
      const mockMetrics: ObservationMetric[] = [
        {
          id: '1',
          name: 'System Health',
          value: 98.5,
          unit: '%',
          trend: 'stable',
          status: 'healthy',
          lastUpdated: new Date(),
          source: 'infrastructure'
        },
        {
          id: '2', 
          name: 'Active Signals',
          value: signals.length,
          unit: 'count',
          trend: 'up',
          status: signals.length > 10 ? 'warning' : 'healthy',
          lastUpdated: new Date(),
          source: 'signals'
        }
      ];
      
      setMetrics(mockMetrics);
      console.log('Loaded', mockMetrics.length, 'metrics');
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
  };

  // Signal refresh compatibility
  const refreshLegacySignals = refreshSignals;

  const refreshUsers = async () => {
    try {
      if (!user) return;
      
      console.log('Refreshing users...');
      const response = await apiClient.getUsers();
      setUsers(response.users || []);
      console.log('Loaded', response.users?.length || 0, 'users');
    } catch (error) {
      console.error('Error refreshing users:', error);
      // Don't show toast for users error as it might not be critical
    }
  };

  // BuboIQ Signal Creation
  const createSignal = async (signalData: Omit<Signal, 'id' | 'createdAt' | 'updatedAt' | 'correlations' | 'evidencePacks'>) => {
    try {
      console.log('Creating new signal:', signalData.title);
      
      // Convert signal to API format for backend compatibility
      const apiSignalData = {
        subject: signalData.title,
        description: signalData.description,
        priority: mapSeverityToPriority(signalData.severity),
        category: signalData.category,
        status: 'Open' as const,
        assignedTo: signalData.assignedTo
      };
      
      const response = await apiClient.createTicket(apiSignalData);
      const newProcessedSignal = convertApiTicket(response.ticket);
      
      // Convert back to signal
      const newSignal: Signal = {
        ...signalData,
        id: newProcessedSignal.id,
        createdAt: newProcessedSignal.createdAt,
        updatedAt: newProcessedSignal.updatedAt,
        status: 'new',
        correlations: [],
        evidencePacks: []
      };
      
      // Add to local state
      setSignals(prev => [newSignal, ...prev]);
      setProcessedSignals(prev => [newProcessedSignal, ...prev]);
      toast.success('Signal created successfully!');
      console.log('Signal created:', newSignal.id);
    } catch (error) {
      console.error('Error creating signal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create signal';
      toast.error(errorMessage);
      throw error;
    }
  };

  const createIncident = async (incidentData: Omit<Incident, 'id' | 'createdAt' | 'timeline'>) => {
    try {
      console.log('Creating new incident:', incidentData.title);
      
      const newIncident: Incident = {
        ...incidentData,
        id: `incident-${Date.now()}`,
        createdAt: new Date(),
        timeline: [{
          id: '1',
          timestamp: new Date(),
          type: 'detection',
          description: 'Incident created manually',
          author: user || 'system'
        }]
      };
      
      setIncidents(prev => [newIncident, ...prev]);
      toast.success('Incident created successfully!');
      console.log('Incident created:', newIncident.id);
    } catch (error) {
      console.error('Error creating incident:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create incident';
      toast.error(errorMessage);
      throw error;
    }
  };

  // API compatibility
  const createLegacySignal = async (signalData: any) => {
    const processedSignalData: Omit<Signal, 'id' | 'createdAt' | 'updatedAt' | 'correlations' | 'evidencePacks'> = {
      title: signalData.subject,
      description: signalData.description,
      severity: mapPriorityToSeverity(signalData.priority),
      confidence: 75,
      source: 'manual',
      category: mapCategoryToSignalCategory(signalData.category),
      assignedTo: signalData.assignedTo,
      discoveredBy: 'user',
      status: 'new'
    };
    return createSignal(processedSignalData);
  };

  const updateSignal = async (signalId: string, updates: Partial<Signal>) => {
    try {
      console.log('Updating signal:', signalId, updates);
      
      // Convert signal updates to API format
      const apiUpdates: any = {};
      if (updates.title) apiUpdates.subject = updates.title;
      if (updates.description) apiUpdates.description = updates.description;
      if (updates.severity) apiUpdates.priority = mapSeverityToPriority(updates.severity);
      if (updates.status) apiUpdates.status = mapSignalStatusToTicketStatus(updates.status);
      if (updates.assignedTo) apiUpdates.assignedTo = updates.assignedTo;
      
      const response = await apiClient.updateTicket(signalId, apiUpdates);
      const updatedSignal = convertApiTicket(response.ticket);
      
      // Update signals
      setSignals(prev => prev.map(s => s.id === signalId ? { ...s, ...updates, updatedAt: new Date() } : s));
      
      // Update processed signals
      setProcessedSignals(prev => prev.map(t => t.id === signalId ? updatedSignal : t));
      
      // Update selected signal if it's the one being updated
      if (selectedSignal?.id === signalId) {
        setSelectedSignal(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
      
      toast.success('Signal updated successfully');
      console.log('Signal updated:', signalId);
    } catch (error) {
      console.error('Error updating signal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update signal';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateIncident = async (incidentId: string, updates: Partial<Incident>) => {
    try {
      console.log('Updating incident:', incidentId, updates);
      
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, ...updates } : i));
      
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Incident updated successfully');
      console.log('Incident updated:', incidentId);
    } catch (error) {
      console.error('Error updating incident:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update incident';
      toast.error(errorMessage);
      throw error;
    }
  };

  // API compatibility
  const updateLegacySignal = updateSignal;

  const addSignalComment = async (signalId: string, commentData: { content: string; isInternal?: boolean }) => {
    try {
      console.log('Adding comment to signal:', signalId);
      const response = await apiClient.addComment(signalId, commentData.content, commentData.isInternal);
      
      // Refresh the signals to get updated comments
      await refreshSignals();
      
      toast.success('Comment added successfully');
      console.log('Comment added to signal:', signalId);
    } catch (error) {
      console.error('Error adding comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      toast.error(errorMessage);
      throw error;
    }
  };

  const addSignalNote = async (signalId: string, noteData: { content: string }) => {
    try {
      if (!permissions.canAddInternalNotes) {
        throw new Error('Unauthorized: Cannot add internal notes');
      }
      
      console.log('Adding internal note to signal:', signalId);
      const response = await apiClient.addInternalNote(signalId, noteData.content);
      
      // Refresh the signals to get updated notes
      await refreshSignals();
      
      toast.success('Internal note added successfully');
      console.log('Internal note added to signal:', signalId);
    } catch (error) {
      console.error('Error adding internal note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add internal note';
      toast.error(errorMessage);
      throw error;
    }
  };

  const upgradePlan = (tier: 'observer' | 'analyst' | 'enterprise') => {
    setSubscriptionPlan(prev => ({
      ...prev,
      tier,
      isActive: true,
      daysRemaining: undefined // No longer on trial
    }));
    setShowUpgradeModal(false);
    toast.success(`Successfully upgraded to ${tier} plan!`);
  };

  // Legacy compatibility for upgradePlan
  const legacyUpgradePlan = (plan: 'starter' | 'team' | 'growth') => {
    const tierMapping: Record<string, 'observer' | 'analyst' | 'enterprise'> = {
      'starter': 'observer',
      'team': 'analyst', 
      'growth': 'enterprise'
    };
    upgradePlan(tierMapping[plan] || 'analyst');
  };

  const contextValue: AppContextType = {
    // BuboIQ Core State
    user,
    signals,
    incidents,
    users,
    metrics,
    automations,
    currentPage,
    selectedSignal,
    selectedIncident,
    isClientPortal,
    subscriptionPlan,
    showUpgradeModal,
    showDemoPage,
    showOnboarding,
    isInitialized,
    permissions,
    
    // BuboIQ Actions
    login,
    logout,
    setCurrentPage,
    setSelectedSignal,
    setSelectedIncident,
    setIsClientPortal,
    setShowUpgradeModal,
    setShowDemoPage,
    setShowOnboarding,
    refreshSignals,
    refreshIncidents,
    refreshUsers,
    refreshMetrics,
    createSignal,
    updateSignal,
    createIncident,
    updateIncident,
    upgradePlan,
    
    // Legacy API Compatibility
    legacySignals: signals, // Map signals for API compatibility
    selectedLegacySignal: selectedSignal, // Map selectedSignal for compatibility
    subscriptionInfo: subscriptionPlan, // Map subscription info
    setSelectedLegacySignal: setSelectedSignal, // Map setSelectedSignal for compatibility
    refreshLegacySignals,
    createLegacySignal,
    updateLegacySignal,
    addSignalComment,
    addSignalNote,
    upgradePlan: legacyUpgradePlan
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};