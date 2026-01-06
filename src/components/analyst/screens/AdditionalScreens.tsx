import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, Settings,
  Download, ExternalLink, Activity, Database, Webhook, Lock,
  BarChart3, Users, Zap, PlayCircle, Pause, Eye, Filter, Search
} from 'lucide-react';
import { ConfidenceOrb } from '../production/ConfidenceOrb';
import { KillSwitchBanner } from '../production/KillSwitchBanner';

// Screen 4: Approval Dialog
export function ApprovalDialogScreen() {
  const [showModal, setShowModal] = useState(true);
  const killSwitch = false;
  
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-bg-850 rounded-2xl p-6 max-w-2xl w-full border border-[color:rgb(var(--border-analyst))] shadow-modal">
        <h2 className="text-xl font-space-grotesk text-white mb-6">Approve Action</h2>
        
        {/* Action JSON */}
        <div className="panel p-4 mb-4">
          <pre className="text-xs font-jetbrains-mono text-text-300 overflow-auto max-h-48">
{`{
  "action_type": "restart_service",
  "device_id": "DEV-5678",
  "service": "print_spooler",
  "rollback": "snapshot_2025-10-22_14:00"
}`}
          </pre>
        </div>
        
        {/* Risk Hints */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-warn">
            <Shield className="w-4 h-4" />
            <span>Rollback required by policy.</span>
          </div>
        </div>
        
        {/* Policy Summary */}
        <div className="panel p-3 mb-6">
          <p className="text-xs text-text-300">
            <span className="text-accent">Meets Team auto-approve:</span> confidence 0.91 ≥ 0.85; rollback present.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <button className="text-sm text-info hover:underline">
            View lineage
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-bg-900 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-850 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={killSwitch}
              className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              title={killSwitch ? "Observe-Only is enabled. Executable actions are paused." : ""}
            >
              Approve & Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 5: Policy Settings
export function PolicySettingsScreen() {
  const [tier, setTier] = useState<'starter' | 'pro' | 'team'>('pro');
  const [threshold, setThreshold] = useState(85);
  const [requireRollback, setRequireRollback] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Policy Settings (TierGuard)</h1>
        
        {/* Tier Selection */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Tier Configuration</h2>
          <div className="grid grid-cols-3 gap-4">
            {['starter', 'pro', 'team'].map((t) => (
              <button
                key={t}
                onClick={() => setTier(t as typeof tier)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tier === t
                    ? 'border-accent bg-accent/10'
                    : 'border-[color:rgb(var(--border-analyst))] bg-bg-850 hover:border-accent/50'
                }`}
              >
                <p className="text-sm font-space-grotesk text-white capitalize mb-1">{t}</p>
                <p className="text-xs text-text-400">
                  {t === 'starter' && 'Observe-only'}
                  {t === 'pro' && 'Approval required'}
                  {t === 'team' && 'Policy auto-approve'}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Confidence Threshold */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Confidence Threshold</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="99"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="flex-1 h-2 bg-bg-850 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span className="text-2xl font-space-grotesk text-accent w-20">{threshold}%</span>
          </div>
          <p className="text-xs text-text-400 mt-2">
            Actions below this confidence require manual approval
          </p>
        </div>
        
        {/* Safelist */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Action Safelist</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['update_ticket', 'create_kb_draft', 'restart', 'push_driver', 'run_script'].map((action) => (
              <span
                key={action}
                className="px-3 py-1.5 rounded-lg bg-success/20 text-success border border-success/30 text-xs"
              >
                {action}
              </span>
            ))}
          </div>
          <button className="text-sm text-accent hover:underline">
            + Add action type
          </button>
        </div>
        
        {/* Rollback */}
        <div className="panel p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-space-grotesk text-white mb-1">Require Rollback</h2>
              <p className="text-xs text-text-400">
                Device actions must include rollback mechanism
              </p>
            </div>
            <button
              onClick={() => setRequireRollback(!requireRollback)}
              className={`w-12 h-6 rounded-full transition-colors ${
                requireRollback ? 'bg-accent' : 'bg-bg-850'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  requireRollback ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Kill Switch */}
        <div className="panel p-6 mb-6 border-2 border-danger/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-space-grotesk text-white mb-1 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger" />
                Kill Switch (Observe-Only)
              </h2>
              <p className="text-xs text-text-400">
                Agent will not queue executable actions while Observe-Only is on.
              </p>
            </div>
            <button
              onClick={() => setKillSwitch(!killSwitch)}
              className={`w-12 h-6 rounded-full transition-colors ${
                killSwitch ? 'bg-danger' : 'bg-bg-850'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  killSwitch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Current Policy Summary */}
        <div className="panel p-6 mb-6 bg-bg-850/50">
          <h2 className="text-sm font-space-grotesk text-white mb-3">Current Policy</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))] text-xs">
              <span className="text-text-400">Tier:</span>{' '}
              <span className="text-accent">{tier}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))] text-xs">
              <span className="text-text-400">Threshold:</span>{' '}
              <span className="text-accent">{threshold}%</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))] text-xs">
              <span className="text-text-400">Rollback:</span>{' '}
              <span className="text-accent">{requireRollback ? 'Required' : 'Optional'}</span>
            </span>
            {killSwitch && (
              <span className="px-3 py-1.5 rounded-lg bg-danger/20 border border-danger/30 text-xs text-danger">
                Observe-Only Active
              </span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-400">All changes are logged.</p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
              Reset
            </button>
            <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
              Save Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 6: Device Action Jobs
export function DeviceJobsScreen() {
  const jobs = [
    { id: 'JOB-1234', device: 'DEV-5678', action: 'restart_service', status: 'succeeded' as const, started: '14:32', ended: '14:33', logs: '/logs/job-1234' },
    { id: 'JOB-1235', device: 'DEV-5679', action: 'push_driver', status: 'running' as const, started: '14:35', ended: null, logs: null },
    { id: 'JOB-1236', device: 'DEV-5680', action: 'run_script', status: 'failed' as const, started: '14:28', ended: '14:29', logs: '/logs/job-1236' },
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-space-grotesk text-white">Device Action Jobs</h1>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
              <option>All statuses</option>
              <option>Running</option>
              <option>Succeeded</option>
              <option>Failed</option>
            </select>
            <select className="px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="panel overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-850 border-b border-[color:rgb(var(--divider))]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Device</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Action Type</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Started</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Ended</th>
                <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:rgb(var(--divider))]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-bg-850/50 cursor-pointer transition-colors">
                  <td className="px-6 py-4 text-sm font-jetbrains-mono text-accent">{job.id}</td>
                  <td className="px-6 py-4 text-sm text-text-300">{job.device}</td>
                  <td className="px-6 py-4 text-sm text-text-300">{job.action}</td>
                  <td className="px-6 py-4">
                    {job.status === 'succeeded' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/30">
                        <CheckCircle className="w-3 h-3" />
                        succeeded
                      </span>
                    )}
                    {job.status === 'running' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-info/20 text-info border border-info/30">
                        <PlayCircle className="w-3 h-3" />
                        running
                      </span>
                    )}
                    {job.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-danger/20 text-danger border border-danger/30">
                        <XCircle className="w-3 h-3" />
                        failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-400 font-jetbrains-mono">{job.started}</td>
                  <td className="px-6 py-4 text-sm text-text-400 font-jetbrains-mono">{job.ended || '—'}</td>
                  <td className="px-6 py-4">
                    {job.logs && (
                      <button className="text-info hover:underline text-sm">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Screen 7: Traces & Lineage
export function TracesLineageScreen() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Traces & Lineage</h1>
        
        {/* Lineage Graph */}
        <div className="panel p-8 mb-6">
          <div className="flex items-center justify-center gap-8">
            {/* Reason Node */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-bg-850 border-2 border-info flex items-center justify-center mb-2">
                <ConfidenceOrb value={0.87} size={64} />
              </div>
              <p className="text-xs text-text-400">Reason</p>
            </div>
            
            <div className="flex-1 h-px bg-gradient-to-r from-info via-accent to-success" />
            
            {/* Action Node */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-bg-850 border-2 border-accent flex items-center justify-center mb-2">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <p className="text-xs text-text-400">Action</p>
            </div>
            
            <div className="flex-1 h-px bg-gradient-to-r from-accent to-success" />
            
            {/* Callback Node */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-bg-850 border-2 border-success flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <p className="text-xs text-text-400">Callback</p>
            </div>
          </div>
        </div>
        
        {/* Trace Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="panel p-6">
            <h3 className="text-sm font-space-grotesk text-white mb-3">Reasoning Input</h3>
            <pre className="text-xs font-jetbrains-mono text-text-300 overflow-auto max-h-64">
{`{
  "issues": [...],
  "signals": [...],
  "knowledgeBase": [...]
}`}
            </pre>
          </div>
          
          <div className="panel p-6">
            <h3 className="text-sm font-space-grotesk text-white mb-3">Reasoning Output</h3>
            <pre className="text-xs font-jetbrains-mono text-text-300 overflow-auto max-h-64">
{`{
  "predicted_issue": "Driver corruption",
  "confidence": 0.87,
  "recommended_fix": "Reinstall driver"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 8: Alerts & Telemetry
export function AlertsTelemetryScreen() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Alerts & Telemetry</h1>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-2">Agent Runs (24h)</p>
            <p className="text-2xl font-space-grotesk text-white mb-1">142</p>
            <p className="text-xs text-success">+12%</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-2">Agent Errors (24h)</p>
            <p className="text-2xl font-space-grotesk text-white mb-1">3</p>
            <p className="text-xs text-danger">+50%</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-2">Actions Failed (24h)</p>
            <p className="text-2xl font-space-grotesk text-white mb-1">1</p>
            <p className="text-xs text-text-400">No change</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-2">Callback Delay P95</p>
            <p className="text-2xl font-space-grotesk text-white mb-1">2.3s</p>
            <p className="text-xs text-success">-15%</p>
          </div>
        </div>
        
        {/* Alerts List */}
        <div className="panel">
          <div className="p-4 border-b border-[color:rgb(var(--divider))]">
            <h2 className="text-lg font-space-grotesk text-white">Recent Alerts</h2>
          </div>
          <div className="divide-y divide-[color:rgb(var(--divider))]">
            {[
              { type: 'error', message: 'Agent run failed: timeout connecting to knowledge base', time: '5 mins ago' },
              { type: 'warning', message: 'Execution rate limit approaching (85% of limit)', time: '1 hour ago' },
              { type: 'info', message: 'New KB article published: "Fixing Print Spooler"', time: '3 hours ago' },
            ].map((alert, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-bg-850/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${alert.type === 'error' ? 'bg-danger' : alert.type === 'warning' ? 'bg-warn' : 'bg-info'}`} />
                <div className="flex-1">
                  <p className="text-sm text-text-300">{alert.message}</p>
                  <p className="text-xs text-text-400 mt-1">{alert.time}</p>
                </div>
                <button className="text-info hover:underline text-sm">
                  View trace
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const AdditionalScreens = {
  ApprovalDialog: ApprovalDialogScreen,
  PolicySettings: PolicySettingsScreen,
  DeviceJobs: DeviceJobsScreen,
  TracesLineage: TracesLineageScreen,
  AlertsTelemetry: AlertsTelemetryScreen,
};
