import React, { useState } from 'react';
import { 
  Brain, Shield, FileText, Settings, Activity, AlertTriangle, 
  Users, Package, PlayCircle, CheckCircle, XCircle, Clock,
  Eye, Zap, Database, Lock, Webhook, BarChart3, Download,
  Search, Filter, ChevronRight, Copy, ExternalLink, Play, Pause
} from 'lucide-react';
import { ConfidenceOrb } from '../production/ConfidenceOrb';
import { ActionItem } from '../production/ActionItem';
import { ReasoningTraceCard } from '../production/ReasoningTraceCard';
import { KillSwitchBanner } from '../production/KillSwitchBanner';
import { TierGuardBanner } from '../production/TierGuardBanner';
import { InlineDiff } from '../production/InlineDiff';

// Utility Components
function StatusPill({ status }: { status: 'observing' | 'approval-required' | 'auto-approve' }) {
  const config = {
    observing: { label: 'Observing', className: 'bg-info/20 text-info border-info/30' },
    'approval-required': { label: 'Approval Required', className: 'bg-warn/20 text-warn border-warn/30' },
    'auto-approve': { label: 'Auto-Approve Active', className: 'bg-success/20 text-success border-success/30' },
  };
  const { label, className } = config[status];
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${className}`}>
      {label}
    </span>
  );
}

function PolicyChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))]">
      <span className="text-xs text-text-400">{label}:</span>
      <span className="text-xs text-accent font-jetbrains-mono">{value}</span>
    </div>
  );
}

function RiskHint({ type, message }: { type: 'rollback' | 'blast-radius' | 'low-confidence'; message: string }) {
  const icons = {
    rollback: <Shield className="w-4 h-4" />,
    'blast-radius': <AlertTriangle className="w-4 h-4" />,
    'low-confidence': <Eye className="w-4 h-4" />,
  };
  
  return (
    <div className="flex items-center gap-2 text-xs text-warn">
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

function JobStatusBadge({ status }: { status: 'queued' | 'running' | 'succeeded' | 'failed' }) {
  const config = {
    queued: { icon: <Clock className="w-3 h-3" />, className: 'bg-text-600/20 text-text-400 border-text-600/30' },
    running: { icon: <PlayCircle className="w-3 h-3" />, className: 'bg-info/20 text-info border-info/30' },
    succeeded: { icon: <CheckCircle className="w-3 h-3" />, className: 'bg-success/20 text-success border-success/30' },
    failed: { icon: <XCircle className="w-3 h-3" />, className: 'bg-danger/20 text-danger border-danger/30' },
  };
  const { icon, className } = config[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${className}`}>
      {icon}
      {status}
    </span>
  );
}

function MetricCard({ label, value, delta, trend }: { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'neutral' }) {
  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-text-400',
  };
  
  return (
    <div className="panel p-4">
      <p className="text-xs text-text-400 mb-2">{label}</p>
      <p className="text-2xl font-space-grotesk text-white mb-1">{value}</p>
      {delta && trend && (
        <p className={`text-xs ${trendColors[trend]}`}>{delta}</p>
      )}
    </div>
  );
}

function AuditLine({ timestamp, actor, action, target }: { timestamp: string; actor: string; action: string; target: string }) {
  return (
    <div className="flex items-center gap-3 py-2 text-sm border-b border-[color:rgb(var(--divider))] last:border-0">
      <span className="text-xs text-text-400 font-jetbrains-mono w-32">{timestamp}</span>
      <span className="text-xs text-accent w-24">{actor}</span>
      <span className="text-xs text-text-300 flex-1">{action}</span>
      <span className="text-xs text-info">{target}</span>
      <button className="text-text-400 hover:text-accent transition-colors">
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}

function RateGauge({ label, count, limit }: { label: string; count: number; limit: number }) {
  const percentage = (count / limit) * 100;
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;
  
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white">{label}</span>
        <span className="text-xs text-text-400 font-jetbrains-mono">
          {count} / {limit}
        </span>
      </div>
      <div className="h-2 bg-bg-850 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isDanger ? 'bg-danger' : isWarning ? 'bg-warn' : 'bg-success'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Screen 1: Agent Console (Enhanced)
export function AgentConsoleScreen() {
  const [killSwitch, setKillSwitch] = useState(false);
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-space-grotesk">
              <span className="text-white">BUBO</span>
              <span className="text-accent">IQ</span>
              <span className="text-text-400 ml-3">Analyst v1</span>
            </h1>
            <StatusPill status="approval-required" />
          </div>
          <select className="px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
            <option>Acme MSP</option>
            <option>TechCorp IT</option>
          </select>
        </div>
        
        <KillSwitchBanner enabled={killSwitch} />
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Recent Reasoning Traces */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-space-grotesk text-white">Recent Reasoning Traces</h2>
            <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
              Re-run reasoning now
            </button>
          </div>
          
          {loading ? (
            <div className="panel p-6 text-center">
              <div className="animate-pulse">Loading traces...</div>
            </div>
          ) : (
            <>
              <ReasoningTraceCard
                createdAt="2025-10-22T14:32:15Z"
                confidence={0.87}
                output={{
                  predicted_issue: "Driver corruption causing print spooler crashes",
                  recommended_fix: "Reinstall printer driver and restart print spooler service",
                  priority_level: "high",
                }}
                onLineage={() => alert('Navigate to lineage view')}
              />
              <ReasoningTraceCard
                createdAt="2025-10-22T14:15:08Z"
                confidence={0.72}
                output={{
                  predicted_issue: "High CPU usage due to Windows Update service",
                  recommended_fix: "Defer updates and schedule during off-hours",
                  priority_level: "medium",
                }}
                onLineage={() => alert('Navigate to lineage view')}
              />
            </>
          )}
        </section>
        
        {/* Pending Actions */}
        <section className="space-y-4">
          <h2 className="text-xl font-space-grotesk text-white">Pending Actions</h2>
          
          <ActionItem
            actionType="update_ticket"
            payload={{
              issue_id: "ISS-1234",
              predicted_issue: "Driver corruption",
              confidence: 0.87,
              recommendation: "Reinstall printer driver",
            }}
            hints={[]}
            onApprove={() => alert('Action approved')}
            onReject={() => alert('Action rejected')}
            disabled={killSwitch}
          />
          
          <ActionItem
            actionType="restart_service"
            payload={{
              device_id: "DEV-5678",
              service: "print_spooler",
              rollback: "snapshot_2025-10-22",
            }}
            hints={["Rollback required by policy."]}
            onApprove={() => alert('Action approved')}
            onReject={() => alert('Action rejected')}
            disabled={killSwitch}
          />
        </section>
      </div>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 panel p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-400 font-jetbrains-mono">
            Last run: trace_run_7f3e8a2c • 2 mins ago
          </div>
          <button
            onClick={() => setKillSwitch(!killSwitch)}
            className="px-3 py-1.5 bg-danger/20 text-danger border border-danger/30 rounded-lg text-xs hover:bg-danger/30 transition-colors"
          >
            {killSwitch ? 'Disable' : 'Enable'} Kill Switch
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 2: Issue Detail with Agent Injection
export function IssueDetailScreen() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-sm text-text-400">
          <span>Tickets</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">ISS-1234</span>
        </div>
      </div>
      
      {/* Ticket Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-space-grotesk text-white">
            Printer not working on multiple devices
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-danger/20 text-danger border border-danger/30">
              High Priority
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-info/20 text-info border border-info/30">
              Open
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-400">
          <span>Device: WS-ACCT-012</span>
          <span>•</span>
          <span>Created: Oct 22, 2025</span>
          <span>•</span>
          <span>Reporter: Sarah Chen</span>
        </div>
      </div>
      
      {/* Analyst Recommendation Panel */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-space-grotesk text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Analyst Recommendation
            </h2>
            <ConfidenceOrb value={0.87} size={64} />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-400 mb-1">Predicted Root Cause</p>
              <p className="text-sm text-white">
                Driver corruption causing print spooler crashes across Windows 10 workstations
              </p>
            </div>
            
            <div>
              <p className="text-xs text-text-400 mb-1">Recommended Next Step</p>
              <p className="text-sm text-white">
                Reinstall HP Universal Print Driver v8.1.2 and restart print spooler service
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-[color:rgb(var(--divider))]">
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Apply to Ticket
              </button>
              <span className="text-xs text-text-400">AI suggestions require review.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticket Description */}
      <div className="max-w-5xl mx-auto">
        <div className="panel p-6">
          <h3 className="text-sm font-space-grotesk text-white mb-3">Description</h3>
          <p className="text-sm text-text-300 mb-4">
            Multiple users in accounting department reporting they cannot print. Print jobs appear to queue but never complete. Print spooler service keeps crashing.
          </p>
          
          <h3 className="text-sm font-space-grotesk text-white mb-3">Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-text-400">Sarah Chen</span>
              <span className="text-text-600 mx-2">•</span>
              <span className="text-text-600">2 hours ago</span>
              <p className="text-text-300 mt-1">Created ticket</p>
            </div>
            <div className="text-sm">
              <span className="text-accent">Agent</span>
              <span className="text-text-600 mx-2">•</span>
              <span className="text-text-600">10 mins ago</span>
              <p className="text-text-300 mt-1">Analyzed issue (confidence: 87%)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Apply to Ticket Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-bg-850 rounded-2xl p-6 max-w-3xl w-full border border-[color:rgb(var(--border-analyst))]">
            <h2 className="text-xl font-space-grotesk text-white mb-4">Apply AI Suggestion to Ticket</h2>
            
            <InlineDiff
              before="Multiple users in accounting department reporting they cannot print. Print jobs appear to queue but never complete. Print spooler service keeps crashing."
              after="[AI Suggestion]: Reinstall HP Universal Print Driver v8.1.2 and restart print spooler service

Root Cause: Driver corruption causing print spooler crashes across Windows 10 workstations (conf 0.87)

Multiple users in accounting department reporting they cannot print. Print jobs appear to queue but never complete. Print spooler service keeps crashing."
            />
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-bg-900 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-850 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  alert('Ticket updated');
                }}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Screen 3: KB Draft Editor
export function KBDraftEditorScreen() {
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>('draft');
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-space-grotesk text-white mb-2">
                Fixing Print Spooler Driver Corruption
              </h1>
              <div className="flex items-center gap-3 text-sm text-text-400">
                <span className={`px-2 py-1 rounded text-xs ${status === 'published' ? 'bg-success/20 text-success border border-success/30' : 'bg-warn/20 text-warn border border-warn/30'}`}>
                  {status}
                </span>
                <span>Created by Agent • Oct 22, 2025</span>
                <span>Last updated: 5 mins ago</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
                Publish
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-2 space-y-4">
            {/* Prechecks */}
            <div className="panel p-6">
              <h3 className="text-sm font-space-grotesk text-white mb-3">Prechecks</h3>
              <textarea
                className="w-full h-32 bg-bg-900 border border-[color:rgb(var(--border-analyst))] rounded-xl p-3 text-sm text-text-300 font-inter resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                defaultValue="1. Verify print spooler service is running&#10;2. Check if issue affects all users or specific devices&#10;3. Review Event Viewer for driver crash logs&#10;4. Confirm HP printer model and current driver version"
              />
            </div>
            
            {/* Fix */}
            <div className="panel p-6">
              <h3 className="text-sm font-space-grotesk text-white mb-3">Fix</h3>
              <textarea
                className="w-full h-48 bg-bg-900 border border-[color:rgb(var(--border-analyst))] rounded-xl p-3 text-sm text-text-300 font-jetbrains-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                defaultValue="1. Stop print spooler service:&#10;   net stop spooler&#10;&#10;2. Uninstall corrupted driver:&#10;   - Control Panel → Devices and Printers&#10;   - Right-click printer → Remove device&#10;   - Print server properties → Drivers → Delete HP driver&#10;&#10;3. Download HP Universal Print Driver v8.1.2&#10;&#10;4. Install new driver&#10;&#10;5. Restart print spooler:&#10;   net start spooler"
              />
            </div>
            
            {/* Verify */}
            <div className="panel p-6">
              <h3 className="text-sm font-space-grotesk text-white mb-3">Verify</h3>
              <textarea
                className="w-full h-24 bg-bg-900 border border-[color:rgb(var(--border-analyst))] rounded-xl p-3 text-sm text-text-300 font-inter resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                defaultValue="1. Test print from affected workstations&#10;2. Monitor Event Viewer for 24 hours&#10;3. Confirm no spooler crashes in print server logs"
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Confidence Trend */}
            <div className="panel p-4">
              <h3 className="text-sm font-space-grotesk text-white mb-3">Confidence Trend</h3>
              <div className="flex items-center justify-center">
                <ConfidenceOrb value={0.87} size={96} />
              </div>
            </div>
            
            {/* Version History */}
            <div className="panel p-4">
              <h3 className="text-sm font-space-grotesk text-white mb-3">Version History</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[color:rgb(var(--divider))]">
                  <span className="text-text-300">v1.2</span>
                  <span className="text-text-400">Current</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[color:rgb(var(--divider))]">
                  <span className="text-text-300">v1.1</span>
                  <span className="text-text-400">2 days ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-text-300">v1.0</span>
                  <span className="text-text-400">1 week ago</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="panel p-4 space-y-2">
              <button className="w-full px-3 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-lg hover:bg-bg-900 transition-colors text-sm">
                Generate Embeddings
              </button>
              <button className="w-full px-3 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-lg hover:bg-bg-900 transition-colors text-sm">
                View Lineage
              </button>
              <button className="w-full px-3 py-2 bg-danger/20 text-danger border border-danger/30 rounded-lg hover:bg-danger/30 transition-colors text-sm">
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export all screens
export const ProductionScreens = {
  AgentConsole: AgentConsoleScreen,
  IssueDetail: IssueDetailScreen,
  KBDraftEditor: KBDraftEditorScreen,
};
