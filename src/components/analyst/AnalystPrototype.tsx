import React, { useState } from 'react';
import { AnalystComponentLibrary } from './AnalystComponentLibrary';
import { AgentConsole, AgentConsoleLoading, AgentConsoleEmpty } from './screens/AgentConsole';
import { IssueDetail } from './screens/IssueDetail';
import { KBDraftEditor } from './screens/KBDraftEditor';
import { 
  ApprovalDialog, 
  PolicySettings, 
  DeviceActionJobs, 
  AlertsTelemetry,
  TracesLineage 
} from './screens/AllScreens';
import {
  RolesAccess,
  OrgOnboarding,
  RunbookKillSwitch
} from './screens/RemainingScreens';
import { HandoffPage } from './HandoffPage';

/**
 * BuboIQ Analyst v1 - Interactive Prototype
 * Complete navigation system linking all 11 screens + component library + handoff
 */

type Screen = 
  | 'library'
  | 'console'
  | 'console-loading'
  | 'console-empty'
  | 'issue'
  | 'kb-editor'
  | 'approval'
  | 'policy'
  | 'jobs'
  | 'alerts'
  | 'traces'
  | 'roles'
  | 'onboarding'
  | 'killswitch'
  | 'handoff';

export function AnalystPrototype() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('library');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const navigate = (screen: Screen | string) => {
    if (screen === 'approval') {
      setShowApprovalDialog(true);
    } else {
      setCurrentScreen(screen as Screen);
      window.scrollTo(0, 0);
    }
  };

  const handleApprove = () => {
    setShowApprovalDialog(false);
    navigate('jobs');
  };

  return (
    <div className="min-h-screen bg-[#050607]">
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0A0B0D]/95 backdrop-blur-xl border-b border-[#1F242D] z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-space-grotesk font-bold text-white">BUBO</span>
              <span className="font-space-grotesk font-bold text-[#00FF85]">IQ</span>
              <span className="text-[#7A8694] text-sm ml-2">Analyst v1 Prototype</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <NavButton 
                active={currentScreen === 'library'} 
                onClick={() => navigate('library')}
              >
                Library
              </NavButton>
              <NavButton 
                active={currentScreen === 'console'} 
                onClick={() => navigate('console')}
              >
                Console
              </NavButton>
              <NavButton 
                active={currentScreen === 'issue'} 
                onClick={() => navigate('issue')}
              >
                Issue
              </NavButton>
              <NavButton 
                active={currentScreen === 'kb-editor'} 
                onClick={() => navigate('kb-editor')}
              >
                KB Editor
              </NavButton>
              <NavButton 
                active={currentScreen === 'policy'} 
                onClick={() => navigate('policy')}
              >
                Policy
              </NavButton>
              <NavButton 
                active={currentScreen === 'jobs'} 
                onClick={() => navigate('jobs')}
              >
                Jobs
              </NavButton>
              <NavButton 
                active={currentScreen === 'alerts'} 
                onClick={() => navigate('alerts')}
              >
                Alerts
              </NavButton>
              <NavButton 
                active={currentScreen === 'traces'} 
                onClick={() => navigate('traces')}
              >
                Traces
              </NavButton>
              <NavButton 
                active={currentScreen === 'roles'} 
                onClick={() => navigate('roles')}
              >
                Roles
              </NavButton>
              <NavButton 
                active={currentScreen === 'onboarding'} 
                onClick={() => navigate('onboarding')}
              >
                Onboarding
              </NavButton>
              <NavButton 
                active={currentScreen === 'killswitch'} 
                onClick={() => navigate('killswitch')}
              >
                Kill Switch
              </NavButton>
              <NavButton 
                active={currentScreen === 'handoff'} 
                onClick={() => navigate('handoff')}
                variant="accent"
              >
                Handoff
              </NavButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Screen Content */}
      <div className="pt-16">
        {currentScreen === 'library' && <AnalystComponentLibrary />}
        {currentScreen === 'console' && <AgentConsole onNavigate={navigate} />}
        {currentScreen === 'console-loading' && <AgentConsoleLoading />}
        {currentScreen === 'console-empty' && <AgentConsoleEmpty />}
        {currentScreen === 'issue' && <IssueDetail onNavigate={navigate} />}
        {currentScreen === 'kb-editor' && <KBDraftEditor onNavigate={navigate} />}
        {currentScreen === 'policy' && <PolicySettings onNavigate={navigate} />}
        {currentScreen === 'jobs' && <DeviceActionJobs onNavigate={navigate} />}
        {currentScreen === 'alerts' && <AlertsTelemetry onNavigate={navigate} />}
        {currentScreen === 'traces' && <TracesLineage onNavigate={navigate} />}
        {currentScreen === 'roles' && <RolesAccess onNavigate={navigate} />}
        {currentScreen === 'onboarding' && <OrgOnboarding onNavigate={navigate} />}
        {currentScreen === 'killswitch' && <RunbookKillSwitch onNavigate={navigate} />}
        {currentScreen === 'handoff' && <HandoffPage />}
      </div>

      {/* Approval Dialog Modal */}
      <ApprovalDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        onApprove={handleApprove}
      />
    </div>
  );
}

function NavButton({ 
  children, 
  active, 
  onClick,
  variant = 'default'
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  variant?: 'default' | 'accent';
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
        ${active
          ? variant === 'accent'
            ? 'bg-[#00FF85] text-[#0A0B0D]'
            : 'bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30'
          : variant === 'accent'
          ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/40 hover:bg-[#00FF85]/30'
          : 'text-[#AAB4C0] hover:text-white hover:bg-[#1F242D]/50'
        }
      `}
    >
      {children}
    </button>
  );
}

export default AnalystPrototype;
