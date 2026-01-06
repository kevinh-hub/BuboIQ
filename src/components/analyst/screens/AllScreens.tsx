import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Settings as SettingsIcon, AlertTriangle,
  Shield, Users, PlayCircle, Download, Power, Activity, TrendingUp, Clock
} from 'lucide-react';
import { 
  AnalystButton, AnalystBadge, StatusPill, ConfidenceOrb, CodeBlock,
  DeviceJobRow, MetricCard, PolicyChip, RiskHint, TierGuardBanner, EmptyState
} from '../AnalystComponentLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { toast } from 'sonner@2.0.3';

/**
 * Screen 4: Approval Dialog (Modal)
 */
export function ApprovalDialog({ 
  isOpen, 
  onClose, 
  onApprove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onApprove: () => void;
}) {
  const action = {
    type: 'restart_service',
    params: {
      service: 'print_spooler',
      device: 'WKS-SALES-042',
      rollback_enabled: true
    },
    confidence: 87,
    policy: 'Team auto-approve if confidence ≥ 0.85 and rollback present',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0B0D] border-[#1F242D] text-[#EAEFF5] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk text-xl text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F6C14A]/10 border border-[#F6C14A]/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#F6C14A]" />
            </div>
            Approve Action
          </DialogTitle>
          <DialogDescription className="text-[#AAB4C0]">
            Review this AI-suggested action before execution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-6">
          {/* Action Details */}
          <div>
            <div className="text-xs text-[#7A8694] mb-2">Action Details</div>
            <CodeBlock code={JSON.stringify(action.params, null, 2)} />
          </div>

          {/* Risk Hints */}
          <div className="space-y-2">
            <RiskHint type="rollback">Rollback required by policy.</RiskHint>
            <RiskHint type="confidence">This action will be logged for audit review.</RiskHint>
          </div>

          {/* Policy Summary */}
          <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
            <div className="text-xs text-[#7A8694] mb-2">Active Policy</div>
            <div className="text-sm text-[#C7D0DA]">{action.policy}</div>
            <div className="flex items-center gap-2 mt-3">
              <PolicyChip label="Confidence ≥ 0.85" active />
              <PolicyChip label="Rollback Present" active />
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center justify-between bg-[#050607] border border-[#1F242D] rounded-xl p-4">
            <div>
              <div className="text-xs text-[#7A8694] mb-1">AI Confidence</div>
              <div className="text-2xl font-space-grotesk font-bold text-[#00FF85]">{action.confidence}%</div>
            </div>
            <ConfidenceOrb value={action.confidence} />
          </div>
        </div>

        <div className="flex gap-3">
          <AnalystButton variant="primary" onClick={onApprove}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve & Execute
          </AnalystButton>
          <AnalystButton variant="ghost" onClick={onClose}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </AnalystButton>
          <AnalystButton 
            variant="secondary"
            onClick={() => toast.info('Viewing lineage...')}
          >
            View Lineage
          </AnalystButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Screen 5: Policy Settings (TierGuard)
 */
export function PolicySettings({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [tier, setTier] = useState<'starter' | 'pro' | 'team'>('pro');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [requireRollback, setRequireRollback] = useState(true);
  const [safelistActions, setSafelistActions] = useState({
    update_ticket: true,
    create_kb_draft: true,
    restart: true,
    push_driver: false,
    run_script: false,
  });

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => onNavigate?.('console')}
            className="flex items-center gap-2 text-[#AAB4C0] hover:text-[#00FF85] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Console
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-space-grotesk text-2xl font-bold text-white">
                Policy Settings
              </h1>
              <p className="text-[#AAB4C0] mt-1">Configure AI agent guardrails and approval workflows</p>
            </div>
            <AnalystBadge variant="success">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
            </AnalystBadge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        {/* Tier Selection */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <h3 className="font-space-grotesk font-semibold text-white mb-4">Organization Tier</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['starter', 'pro', 'team'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${tier === t 
                    ? 'border-[#00FF85] bg-[#00FF85]/10' 
                    : 'border-[#1F242D] hover:border-[#1F242D]/80'
                  }
                `}
              >
                <div className="font-space-grotesk font-semibold text-white capitalize">{t}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Confidence Threshold */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space-grotesk font-semibold text-white">Confidence Threshold</h3>
            <span className="text-2xl font-space-grotesk font-bold text-[#00FF85]">
              {confidenceThreshold}%
            </span>
          </div>
          <Slider
            value={[confidenceThreshold]}
            onValueChange={(v) => setConfidenceThreshold(v[0])}
            min={50}
            max={95}
            step={5}
            className="mb-2"
          />
          <p className="text-sm text-[#AAB4C0]">
            Auto-approve actions only if AI confidence meets or exceeds this threshold
          </p>
        </div>

        {/* Safelist Actions */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <h3 className="font-space-grotesk font-semibold text-white mb-4">Safelisted Actions</h3>
          <div className="space-y-3">
            {Object.entries(safelistActions).map(([action, enabled]) => (
              <div key={action} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-semibold text-white font-jetbrains-mono">{action}</div>
                  <div className="text-xs text-[#7A8694]">
                    {action === 'run_script' ? 'Execute PowerShell scripts' : `Allow ${action.replace('_', ' ')}`}
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => setSafelistActions({ ...safelistActions, [action]: checked })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rollback Requirement */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-space-grotesk font-semibold text-white mb-1">
                Require Rollback Plan
              </h3>
              <p className="text-sm text-[#AAB4C0]">
                Only approve actions that include automated rollback capability
              </p>
            </div>
            <Switch
              checked={requireRollback}
              onCheckedChange={setRequireRollback}
            />
          </div>
        </div>

        {/* Policy Chips */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <h3 className="font-space-grotesk font-semibold text-white mb-4">Active Policies</h3>
          <div className="flex flex-wrap gap-2">
            <PolicyChip label={`Confidence ≥ ${confidenceThreshold}%`} active />
            {requireRollback && <PolicyChip label="Rollback Required" active />}
            {Object.entries(safelistActions).filter(([, v]) => v).map(([k]) => (
              <PolicyChip key={k} label={k} active />
            ))}
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex gap-3">
          <AnalystButton
            variant="primary"
            onClick={() => toast.success('Policy saved.')}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Policy
          </AnalystButton>
          <AnalystButton variant="ghost">
            Reset to Defaults
          </AnalystButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 6: Device Action Jobs (Connect Status Viewer)
 */
export function DeviceActionJobs({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobs = [
    {
      jobId: 'job_abc123',
      device: 'WKS-SALES-042',
      actionType: 'restart_service',
      status: 'succeeded' as const,
      started: '2025-10-22 14:35:00',
      ended: '2025-10-22 14:35:12',
    },
    {
      jobId: 'job_def456',
      device: 'WKS-FINANCE-019',
      actionType: 'run_script',
      status: 'running' as const,
      started: '2025-10-22 14:42:15',
    },
    {
      jobId: 'job_ghi789',
      device: 'WKS-LEGAL-007',
      actionType: 'push_driver',
      status: 'failed' as const,
      started: '2025-10-22 14:28:30',
      ended: '2025-10-22 14:30:45',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => onNavigate?.('console')}
            className="flex items-center gap-2 text-[#AAB4C0] hover:text-[#00FF85] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Console
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-space-grotesk text-2xl font-bold text-white">
                Device Action Jobs
              </h1>
              <p className="text-[#AAB4C0] mt-1">Monitor execution status and logs</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00FF85] animate-pulse" />
              <span className="text-sm text-[#00FF85]">1 Running</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.jobId}
              onClick={() => setSelectedJob(job.jobId)}
              className="cursor-pointer"
            >
              <DeviceJobRow {...job} />
            </div>
          ))}
        </div>

        {/* Detail Drawer */}
        {selectedJob && (
          <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
            <DialogContent className="bg-[#0A0B0D] border-[#1F242D] text-[#EAEFF5] max-w-3xl">
              <DialogHeader>
                <DialogTitle className="font-space-grotesk text-xl text-white">
                  Job Details: {selectedJob}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 my-6">
                <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
                  <h3 className="font-space-grotesk font-semibold text-white mb-3">Execution Timeline</h3>
                  <div className="space-y-2">
                    {[
                      { time: '14:35:00', event: 'Job queued', status: 'complete' },
                      { time: '14:35:03', event: 'Connecting to device', status: 'complete' },
                      { time: '14:35:05', event: 'Executing action', status: 'complete' },
                      { time: '14:35:12', event: 'Verification passed', status: 'complete' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#55D187]" />
                        <span className="font-jetbrains-mono text-xs text-[#7A8694]">{step.time}</span>
                        <span className="text-sm text-[#C7D0DA]">{step.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
                  <h3 className="font-space-grotesk font-semibold text-white mb-3">Parameters</h3>
                  <CodeBlock code={JSON.stringify({ service: 'print_spooler', rollback: true }, null, 2)} />
                </div>
              </div>

              <div className="flex gap-3">
                <AnalystButton variant="danger">
                  Rollback
                </AnalystButton>
                <AnalystButton variant="ghost">
                  Download Logs
                </AnalystButton>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

/**
 * Screen 7: Alerts & Telemetry
 */
export function AlertsTelemetry({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => onNavigate?.('console')}
            className="flex items-center gap-2 text-[#AAB4C0] hover:text-[#00FF85] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Console
          </button>
          <h1 className="font-space-grotesk text-2xl font-bold text-white">
            Alerts & Telemetry
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Metrics */}
        <div>
          <h2 className="font-space-grotesk text-xl font-bold text-white mb-6">Key Metrics (24h)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Failed Actions"
              value="3"
              delta={{ value: -40, isPositive: true }}
            />
            <MetricCard
              title="Avg Callback Delay"
              value="1.2s"
              delta={{ value: 15, isPositive: false }}
            />
            <MetricCard
              title="Agent Error Rate"
              value="0.3%"
              delta={{ value: 0, isPositive: true }}
            />
            <MetricCard
              title="Runs Per Org"
              value="48"
              delta={{ value: 12, isPositive: true }}
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <h2 className="font-space-grotesk text-xl font-bold text-white mb-6">Recent Alerts</h2>
          <div className="space-y-3">
            {[
              { type: 'error', message: 'Action failed: push_driver on WKS-LEGAL-007', time: '14:30:45', link: 'trace_ghi789' },
              { type: 'warn', message: 'Low confidence action approved manually', time: '14:15:20', link: 'trace_def456' },
              { type: 'info', message: 'Policy updated: confidence threshold raised to 85%', time: '13:45:00', link: null },
            ].map((alert, idx) => (
              <div key={idx} className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AnalystBadge variant={alert.type as any}>
                        {alert.type.toUpperCase()}
                      </AnalystBadge>
                      <span className="font-jetbrains-mono text-xs text-[#7A8694]">{alert.time}</span>
                    </div>
                    <p className="text-sm text-[#C7D0DA]">{alert.message}</p>
                  </div>
                  {alert.link && (
                    <button className="text-sm text-[#3EA0FF] hover:text-[#5BB0FF]">
                      View →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 8: Traces & Lineage
 */
export function TracesLineage({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => onNavigate?.('console')}
            className="flex items-center gap-2 text-[#AAB4C0] hover:text-[#00FF85] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Console
          </button>
          <h1 className="font-space-grotesk text-2xl font-bold text-white">
            Traces & Lineage
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="w-24 h-24 bg-[#00FF85]/10 border border-[#00FF85]/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-[#00FF85]" />
              </div>
              <h2 className="font-space-grotesk text-2xl font-bold text-white mb-4">
                Trace Lineage Graph
              </h2>
              <p className="text-[#AAB4C0] mb-8">
                Visual representation of reasoning → actions → callbacks flow with embedded JSON and confidence orbs on nodes
              </p>
              <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-8">
                <div className="space-y-6">
                  {/* Mock lineage visualization */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <ConfidenceOrb value={87} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white mb-1">Reasoning Trace</div>
                      <div className="text-xs font-jetbrains-mono text-[#7A8694]">trace_abc123</div>
                    </div>
                  </div>
                  <div className="border-l-2 border-[#00FF85]/30 ml-12 pl-8 space-y-4">
                    <div className="text-sm text-[#C7D0DA]">
                      <div className="text-xs text-[#7A8694] mb-1">Action 1</div>
                      <div className="font-jetbrains-mono">restart_service</div>
                    </div>
                    <div className="text-sm text-[#C7D0DA]">
                      <div className="text-xs text-[#7A8694] mb-1">Action 2</div>
                      <div className="font-jetbrains-mono">push_driver</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
