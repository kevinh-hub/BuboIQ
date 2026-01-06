import React, { useState } from 'react';
import { 
  Home, Brain, FileText, Settings, Activity, AlertTriangle, 
  Shield, Users, Package, Webhook, BarChart3, Book, ChevronLeft
} from 'lucide-react';
import { ProductionScreens } from './screens/ProductionScreens';
import { AdditionalScreens } from './screens/AdditionalScreens';
import { FinalScreens } from './screens/FinalScreens';

type ScreenType =
  | 'agent-console'
  | 'issue-detail'
  | 'kb-draft-editor'
  | 'approval-dialog'
  | 'policy-settings'
  | 'device-jobs'
  | 'traces-lineage'
  | 'alerts-telemetry'
  | 'audit-log'
  | 'rate-limits'
  | 'org-onboarding'
  | 'webhooks-secrets'
  | 'runbook-kill-switch';

export function InteractivePrototype() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('agent-console');
  const [showMenu, setShowMenu] = useState(true);

  const menuItems: { id: ScreenType; label: string; icon: React.ReactNode; category: string }[] = [
    { id: 'agent-console', label: 'Agent Console', icon: <Brain className="w-4 h-4" />, category: 'Core' },
    { id: 'issue-detail', label: 'Issue Detail', icon: <FileText className="w-4 h-4" />, category: 'Core' },
    { id: 'kb-draft-editor', label: 'KB Draft Editor', icon: <Book className="w-4 h-4" />, category: 'Core' },
    { id: 'approval-dialog', label: 'Approval Dialog', icon: <Shield className="w-4 h-4" />, category: 'Core' },
    
    { id: 'policy-settings', label: 'Policy Settings', icon: <Settings className="w-4 h-4" />, category: 'Configuration' },
    { id: 'device-jobs', label: 'Device Jobs', icon: <Activity className="w-4 h-4" />, category: 'Configuration' },
    { id: 'webhooks-secrets', label: 'Webhooks & Secrets', icon: <Webhook className="w-4 h-4" />, category: 'Configuration' },
    
    { id: 'traces-lineage', label: 'Traces & Lineage', icon: <BarChart3 className="w-4 h-4" />, category: 'Monitoring' },
    { id: 'alerts-telemetry', label: 'Alerts & Telemetry', icon: <AlertTriangle className="w-4 h-4" />, category: 'Monitoring' },
    { id: 'audit-log', label: 'Audit Log', icon: <Shield className="w-4 h-4" />, category: 'Monitoring' },
    { id: 'rate-limits', label: 'Rate Limits', icon: <Package className="w-4 h-4" />, category: 'Monitoring' },
    
    { id: 'org-onboarding', label: 'Org Onboarding', icon: <Users className="w-4 h-4" />, category: 'Admin' },
    { id: 'runbook-kill-switch', label: 'Runbooks & Kill Switch', icon: <Book className="w-4 h-4" />, category: 'Admin' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'agent-console':
        return <ProductionScreens.AgentConsole />;
      case 'issue-detail':
        return <ProductionScreens.IssueDetail />;
      case 'kb-draft-editor':
        return <ProductionScreens.KBDraftEditor />;
      case 'approval-dialog':
        return <AdditionalScreens.ApprovalDialog />;
      case 'policy-settings':
        return <AdditionalScreens.PolicySettings />;
      case 'device-jobs':
        return <AdditionalScreens.DeviceJobs />;
      case 'traces-lineage':
        return <AdditionalScreens.TracesLineage />;
      case 'alerts-telemetry':
        return <AdditionalScreens.AlertsTelemetry />;
      case 'audit-log':
        return <FinalScreens.AuditLog />;
      case 'rate-limits':
        return <FinalScreens.RateLimits />;
      case 'org-onboarding':
        return <FinalScreens.OrgOnboarding />;
      case 'webhooks-secrets':
        return <FinalScreens.WebhooksSecrets />;
      case 'runbook-kill-switch':
        return <FinalScreens.RunbookKillSwitch />;
      default:
        return <ProductionScreens.AgentConsole />;
    }
  };

  const categories = ['Core', 'Configuration', 'Monitoring', 'Admin'];

  return (
    <div className="min-h-screen bg-bg-900 text-text-100">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-bg-850 border-b border-[color:rgb(var(--border-analyst))] z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-bg-900 rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${showMenu ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          <h1 className="text-lg font-space-grotesk">
            <span className="text-white">BUBO</span>
            <span className="text-accent">IQ</span>
            <span className="text-text-400 ml-2">Analyst v1 Prototype</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs bg-accent/20 text-accent border border-accent/30">
            Interactive Demo
          </span>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar Menu */}
        {showMenu && (
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-bg-850 border-r border-[color:rgb(var(--border-analyst))] overflow-y-auto z-40">
            <div className="p-4">
              <p className="text-xs text-text-400 mb-4">Navigate between screens</p>
              
              {categories.map((category) => (
                <div key={category} className="mb-6">
                  <p className="text-xs text-text-600 uppercase tracking-wide mb-2">{category}</p>
                  <div className="space-y-1">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCurrentScreen(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                            currentScreen === item.id
                              ? 'bg-accent/20 text-accent'
                              : 'text-text-300 hover:bg-bg-900'
                          }`}
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${showMenu ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="min-h-[calc(100vh-4rem)]">
            {renderScreen()}
          </div>
        </div>
      </div>

      {/* Prototype Info Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-bg-850/90 backdrop-blur-sm border-t border-[color:rgb(var(--border-analyst))] flex items-center justify-center z-40">
        <p className="text-xs text-text-400">
          Production-ready prototype • All interactions wired • 13 screens • Full state management
        </p>
      </div>
    </div>
  );
}
