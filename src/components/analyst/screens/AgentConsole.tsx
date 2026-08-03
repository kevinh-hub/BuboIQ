import React, { useState } from 'react';
import { Activity, AlertCircle, PlayCircle, Settings } from 'lucide-react';
import { 
  AnalystButton, 
  StatusPill, 
  ReasoningTraceCard, 
  ActionItem,
  EmptyState 
} from '../AnalystComponentLibrary';
import { toast } from 'sonner';

/**
 * Screen 1: Agent Console
 * Main dashboard showing recent reasoning traces and pending actions
 */

export function AgentConsole({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [killSwitch, setKillSwitch] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'observing' | 'approvalRequired' | 'autoApproveActive'>('approvalRequired');

  const recentTraces = [
    {
      timestamp: '2025-10-22 14:32:15',
      confidence: 87,
      summary: {
        device: 'WKS-SALES-042',
        issue: 'Print spooler failure',
        predicted_root_cause: 'Driver corruption detected',
      },
      traceId: 'trace_abc123',
    },
    {
      timestamp: '2025-10-22 14:15:08',
      confidence: 92,
      summary: {
        device: 'WKS-FINANCE-019',
        issue: 'Outlook crashes on startup',
        predicted_root_cause: 'PST file corruption',
      },
      traceId: 'trace_def456',
    },
    {
      timestamp: '2025-10-22 13:58:42',
      confidence: 78,
      summary: {
        device: 'WKS-LEGAL-007',
        issue: 'Network connectivity intermittent',
        predicted_root_cause: 'DNS cache poisoning',
      },
      traceId: 'trace_ghi789',
    },
  ];

  const pendingActions = [
    {
      actionType: 'restart_service',
      params: { service: 'print_spooler', device: 'WKS-SALES-042' },
      risks: ['rollback'],
      confidence: 87,
    },
    {
      actionType: 'push_driver',
      params: { driver: 'HP_Universal_Print_v7.2', device: 'WKS-SALES-042' },
      risks: ['rollback', 'blast'],
      confidence: 85,
    },
    {
      actionType: 'run_script',
      params: { script: 'fix_pst_corruption.ps1', device: 'WKS-FINANCE-019' },
      risks: ['low-confidence'],
      confidence: 68,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      {/* Kill Switch Banner */}
      {killSwitch && (
        <div className="bg-[#FF6B6B]/10 border-b border-[#FF6B6B]/30 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF6B6B]" />
              <span className="font-semibold text-[#FF6B6B]">
                Observe-Only is enabled. Executable actions are paused.
              </span>
            </div>
            <button
              onClick={() => setKillSwitch(false)}
              className="text-sm text-[#FF6B6B] hover:text-[#FF8A8A] underline"
            >
              Disable
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold mb-2">
                <span className="text-white">BUBO</span>
                <span className="text-[#00FF85]">IQ</span>
                <span className="text-[#7A8694] ml-4">Analyst v1</span>
              </h1>
              <p className="text-[#AAB4C0]">AI Support Intelligence Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusPill status={agentStatus} />
              <button
                onClick={() => onNavigate?.('killswitch')}
                className="p-3 rounded-xl bg-[#0A0B0D] border border-[#1F242D] hover:border-[#00FF85]/30 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-[#AAB4C0]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Recent Reasoning Traces */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-space-grotesk text-xl font-bold text-white">
                Recent Reasoning Traces
              </h2>
              <button
                onClick={() => onNavigate?.('traces')}
                className="text-sm text-[#00FF85] hover:text-[#00E676] transition-colors"
              >
                View all →
              </button>
            </div>

            <div className="space-y-4">
              {recentTraces.map((trace) => (
                <div
                  key={trace.traceId}
                  onClick={() => onNavigate?.('traces')}
                  className="cursor-pointer"
                >
                  <ReasoningTraceCard {...trace} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pending Actions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-space-grotesk text-xl font-bold text-white">
                Pending Actions
              </h2>
              {pendingActions.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#F6C14A]/10 text-[#F6C14A] text-sm font-semibold">
                  {pendingActions.length} waiting
                </span>
              )}
            </div>

            {pendingActions.length > 0 ? (
              <div className="space-y-4">
                {pendingActions.map((action, idx) => (
                  <ActionItem
                    key={idx}
                    {...action}
                    onApprove={() => {
                      toast.success('Action approved & dispatched.');
                      onNavigate?.('jobs');
                    }}
                    onReject={() => {
                      toast.info('Action rejected.');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl">
                <EmptyState
                  icon={Activity}
                  title="No pending actions"
                  description="All AI suggestions have been reviewed."
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-12 pt-8 border-t border-[#1F242D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-[#7A8694] mb-1">Organization</div>
                <select className="bg-[#0A0B0D] border border-[#1F242D] rounded-xl px-4 py-2 text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50">
                  <option>Acme Corp (Primary)</option>
                  <option>Beta Industries</option>
                  <option>Gamma Solutions</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-[#7A8694] mb-1">Latest Trace ID</div>
                <div className="font-jetbrains-mono text-sm text-[#C7D0DA] bg-[#0A0B0D] border border-[#1F242D] rounded-xl px-4 py-2">
                  trace_abc123
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AnalystButton
                variant="ghost"
                onClick={() => {
                  toast.info('Re-running reasoning engine...');
                  setTimeout(() => toast.success('Reasoning complete. 2 new traces generated.'), 2000);
                }}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Re-run Reasoning Now
              </AnalystButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading State
export function AgentConsoleLoading() {
  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-64 bg-[#1F242D]/30 rounded-xl animate-pulse" />
            <div className="h-10 w-48 bg-[#1F242D]/30 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((col) => (
            <div key={col} className="space-y-4">
              <div className="h-8 w-48 bg-[#1F242D]/30 rounded-xl animate-pulse mb-6" />
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4"
                >
                  <div className="h-24 bg-[#1F242D]/20 rounded-xl animate-pulse" />
                  <div className="h-16 bg-[#1F242D]/20 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty State
export function AgentConsoleEmpty() {
  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5] flex items-center justify-center">
      <EmptyState
        icon={Activity}
        title="No agent activity"
        description="The AI analyst has not processed any tickets yet. Start by enabling auto-reasoning."
      />
    </div>
  );
}
