import React from 'react';
import { useApp } from '../context/AppContext';
import BuboObservatory from './BuboObservatory';
import BuboSignalStream from './BuboSignalStream';
import BuboOnboardingMission from './BuboOnboardingMission';
import IncidentRoom from './IncidentRoom';
import AssistPanel from './AssistPanel';
import BuboDashboard from './BuboDashboard';
import UserDashboard from './UserDashboard';
import TeamManagement from './TeamManagement';
import ClientPortal from './ClientPortal';
import SettingsPage from './SettingsPage';
import PricingPage from './PricingPage';
import UserProfile from './UserProfile';
import BuboMissionProgress from './BuboMissionProgress';
import BuboBrandKit from './BuboBrandKit';
import BuboIntelligenceFlow from './BuboIntelligenceFlow';

export const PageRouter: React.FC = () => {
  const { user, currentPage, permissions, isClientPortal, subscriptionInfo } = useApp();

  if (isClientPortal) {
    return <ClientPortal />;
  }

  // Render mission progress banner for trial users
  const MissionBanner = subscriptionInfo.isActive ? <BuboMissionProgress /> : null;

  // BuboIQ AI Intelligence Platform routing
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user?.role === 'observer' ? <UserDashboard /> : <BuboObservatory />;
      case 'observatory':
        return <BuboObservatory />;
      case 'mission':
      case 'onboarding-mission':
        return <BuboOnboardingMission />;
      case 'signals':
      case 'signal-stream':
        return <BuboSignalStream />;
      case 'incidents':
      case 'incident-room':
        return <IncidentRoom />;
      case 'incident-detail':
        return <IncidentRoom />;
      case 'assist':
        return <AssistPanel />;
      case 'automations':
        return <BuboObservatory />; // Future: Automation Studio
      case 'automation-studio':
        return <BuboObservatory />; // Future: Automation Studio
      case 'knowledge-graph':
        return <BuboObservatory />; // Future: Knowledge Graph
      case 'self-service':
        return <BuboObservatory />; // Future: Self-Service Hub
      case 'team':
        return permissions.canManageTeam ? <TeamManagement /> : <UserDashboard />;
      case 'pricing':
        return permissions.canViewPricing ? <PricingPage /> : <UserDashboard />;
      case 'settings':
      case 'governance':
        return permissions.canAccessSettings ? <SettingsPage /> : <UserProfile />;
      case 'profile':
        return <UserProfile />;
      case 'brand-kit':
      case 'design-system':
        return <BuboBrandKit />;
      case 'intelligence-flow':
      case 'workflow-demo':
        return <BuboIntelligenceFlow />;
      default:
        // BuboIQ defaults to Observatory for all users except observers
        return user?.role === 'observer' ? <UserDashboard /> : <BuboObservatory />;
    }
  };

  return (
    <>
      {MissionBanner}
      {renderPage()}
    </>
  );
};