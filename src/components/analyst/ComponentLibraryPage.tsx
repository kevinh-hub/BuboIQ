import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, Info, CheckCircle, XCircle, Clock, Eye, Shield, Zap } from 'lucide-react';
import { ConfidenceOrb } from './production/ConfidenceOrb';
import { ActionItem } from './production/ActionItem';
import { ReasoningTraceCard } from './production/ReasoningTraceCard';
import { KillSwitchBanner } from './production/KillSwitchBanner';
import { TierGuardBanner } from './production/TierGuardBanner';
import { InlineDiff } from './production/InlineDiff';

export function ComponentLibraryPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-space-grotesk mb-4">
            <span className="text-white">BUBO</span>
            <span className="text-accent">IQ</span>
            <span className="text-text-400 ml-3">Component Library</span>
          </h1>
          <p className="text-text-400">
            Production-ready React components for AI-driven IT support intelligence
          </p>
        </div>

        {/* Primitives */}
        <section className="mb-16">
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Primitives</h2>
          
          {/* Buttons */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
                Primary
              </button>
              <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
                Secondary
              </button>
              <button className="px-4 py-2 bg-transparent text-accent border border-accent/30 rounded-xl hover:bg-accent/10 transition-colors">
                Ghost
              </button>
              <button className="px-4 py-2 bg-danger text-white rounded-xl hover:opacity-90 transition-opacity">
                Danger
              </button>
              <button className="px-4 py-2 bg-accent text-black rounded-xl opacity-50 cursor-not-allowed">
                Disabled
              </button>
              <button className="px-4 py-2 bg-accent text-black rounded-xl flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Loading
              </button>
            </div>
            <div className="panel p-3 bg-bg-850/50">
              <pre className="text-xs font-jetbrains-mono text-text-300">
{`<button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90">
  Primary
</button>`}
              </pre>
            </div>
          </div>

          {/* Inputs */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Inputs</h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Text input"
                className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <textarea
                placeholder="Textarea"
                className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none h-24"
              />
              <select className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
                <option>Select option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>

          {/* Badges */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))]">
                Neutral
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-info/20 text-info border border-info/30">
                Info
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-warn/20 text-warn border border-warn/30">
                Warning
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-danger/20 text-danger border border-danger/30">
                Danger
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-success/20 text-success border border-success/30">
                Success
              </span>
            </div>
          </div>

          {/* Toggles & Checkboxes */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Toggles & Checkboxes</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button className="w-12 h-6 rounded-full bg-accent">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-6 transition-transform" />
                </button>
                <span className="text-sm text-text-300">Toggle ON</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-12 h-6 rounded-full bg-bg-850">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-1 transition-transform" />
                </button>
                <span className="text-sm text-text-300">Toggle OFF</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded accent-accent" checked readOnly />
                <span className="text-sm text-text-300">Checkbox</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" className="w-4 h-4 accent-accent" checked readOnly />
                <span className="text-sm text-text-300">Radio button</span>
              </div>
            </div>
          </div>

          {/* Toast Messages */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Toast Messages</h3>
            <div className="space-y-3">
              <div className="panel p-3 bg-success/10 border-success/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-success">Action approved & dispatched.</span>
              </div>
              <div className="panel p-3 bg-info/10 border-info/30 flex items-center gap-3">
                <Info className="w-5 h-5 text-info" />
                <span className="text-sm text-info">Ticket updated.</span>
              </div>
              <div className="panel p-3 bg-warn/10 border-warn/30 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warn" />
                <span className="text-sm text-warn">Execution rate limit reached.</span>
              </div>
              <div className="panel p-3 bg-danger/10 border-danger/30 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-danger" />
                <span className="text-sm text-danger">Invalid signature.</span>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="panel p-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Table</h3>
            <table className="w-full">
              <thead className="bg-bg-850 border-b border-[color:rgb(var(--divider))]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-space-grotesk text-text-400">Column 1</th>
                  <th className="px-4 py-3 text-left text-xs font-space-grotesk text-text-400">Column 2</th>
                  <th className="px-4 py-3 text-left text-xs font-space-grotesk text-text-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:rgb(var(--divider))]">
                <tr className="hover:bg-bg-850/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-text-300">Row 1</td>
                  <td className="px-4 py-3 text-sm text-text-300">Data</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/30">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-bg-850/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-text-300">Row 2</td>
                  <td className="px-4 py-3 text-sm text-text-300">Data</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs bg-text-600/20 text-text-400 border border-text-600/30">
                      Inactive
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Specialized Components */}
        <section className="mb-16">
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Specialized Components</h2>

          {/* ConfidenceOrb */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">ConfidenceOrb</h3>
            <div className="flex items-center gap-6 mb-4">
              <ConfidenceOrb value={0.35} size={96} />
              <ConfidenceOrb value={0.67} size={96} />
              <ConfidenceOrb value={0.91} size={96} />
            </div>
            <div className="panel p-3 bg-bg-850/50">
              <pre className="text-xs font-jetbrains-mono text-text-300">
{`<ConfidenceOrb value={0.87} size={96} />`}
              </pre>
            </div>
          </div>

          {/* StatusPill */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">StatusPill</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs bg-info/20 text-info border border-info/30">
                Observing
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-warn/20 text-warn border border-warn/30">
                Approval Required
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-success/20 text-success border border-success/30">
                Auto-Approve Active
              </span>
            </div>
          </div>

          {/* TierGuardBanner */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">TierGuardBanner</h3>
            <TierGuardBanner
              tier="pro"
              summary="Auto-approve requires Team tier"
              onUpgrade={() => alert('Navigate to pricing')}
            />
          </div>

          {/* PolicyChip */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">PolicyChip</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))]">
                <span className="text-xs text-text-400">Threshold:</span>
                <span className="text-xs text-accent font-jetbrains-mono">85%</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-850 border border-[color:rgb(var(--border-analyst))]">
                <span className="text-xs text-text-400">Rollback:</span>
                <span className="text-xs text-accent font-jetbrains-mono">Required</span>
              </div>
            </div>
          </div>

          {/* InlineDiff */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">InlineDiff</h3>
            <InlineDiff
              before="Original ticket description"
              after="[AI Suggestion]: Root cause identified\n\nOriginal ticket description"
            />
          </div>

          {/* MetricCard */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">MetricCard</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="panel p-4">
                <p className="text-xs text-text-400 mb-2">Agent Runs (24h)</p>
                <p className="text-2xl font-space-grotesk text-white mb-1">142</p>
                <p className="text-xs text-success">+12%</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs text-text-400 mb-2">Actions Failed</p>
                <p className="text-2xl font-space-grotesk text-white mb-1">3</p>
                <p className="text-xs text-danger">+50%</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs text-text-400 mb-2">Avg Confidence</p>
                <p className="text-2xl font-space-grotesk text-white mb-1">0.84</p>
                <p className="text-xs text-text-400">No change</p>
              </div>
            </div>
          </div>

          {/* RiskHint */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">RiskHint</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-warn">
                <Shield className="w-4 h-4" />
                <span>Rollback required by policy.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warn">
                <AlertTriangle className="w-4 h-4" />
                <span>High blast radius: affects multiple devices.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warn">
                <Eye className="w-4 h-4" />
                <span>Low confidence: consider manual review.</span>
              </div>
            </div>
          </div>

          {/* KillSwitchBanner */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">KillSwitchBanner</h3>
            <KillSwitchBanner enabled={true} />
          </div>

          {/* AuditLine */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">AuditLine</h3>
            <div className="panel p-4 bg-bg-850/50">
              <div className="flex items-center gap-3 py-2 text-sm">
                <span className="text-xs text-text-400 font-jetbrains-mono w-32">14:35:12</span>
                <span className="text-xs text-accent w-24">admin</span>
                <span className="text-xs text-text-300 flex-1">approve_action</span>
                <span className="text-xs text-info">ACT-1234</span>
              </div>
            </div>
          </div>

          {/* RateGauge */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">RateGauge</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="panel p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Normal</span>
                  <span className="text-xs text-text-400 font-jetbrains-mono">45 / 100</span>
                </div>
                <div className="h-2 bg-bg-850 rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[45%]" />
                </div>
              </div>
              <div className="panel p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Warning</span>
                  <span className="text-xs text-text-400 font-jetbrains-mono">85 / 100</span>
                </div>
                <div className="h-2 bg-bg-850 rounded-full overflow-hidden">
                  <div className="h-full bg-warn w-[85%]" />
                </div>
              </div>
              <div className="panel p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Danger</span>
                  <span className="text-xs text-text-400 font-jetbrains-mono">97 / 100</span>
                </div>
                <div className="h-2 bg-bg-850 rounded-full overflow-hidden">
                  <div className="h-full bg-danger w-[97%]" />
                </div>
              </div>
            </div>
          </div>

          {/* JobStatusBadge */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">JobStatusBadge</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-text-600/20 text-text-400 border border-text-600/30">
                <Clock className="w-3 h-3" />
                queued
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-info/20 text-info border border-info/30">
                <Zap className="w-3 h-3" />
                running
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/30">
                <CheckCircle className="w-3 h-3" />
                succeeded
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-danger/20 text-danger border border-danger/30">
                <XCircle className="w-3 h-3" />
                failed
              </span>
            </div>
          </div>

          {/* ReasoningTraceCard */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">ReasoningTraceCard</h3>
            <ReasoningTraceCard
              createdAt="2025-10-22T14:32:15Z"
              confidence={0.87}
              output={{
                predicted_issue: "Driver corruption",
                recommended_fix: "Reinstall driver",
                priority_level: "high",
              }}
              onLineage={() => alert('Navigate to lineage')}
            />
          </div>

          {/* ActionItem */}
          <div className="panel p-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">ActionItem</h3>
            <ActionItem
              actionType="restart_service"
              payload={{
                device_id: "DEV-5678",
                service: "print_spooler",
                rollback: "snapshot_2025-10-22",
              }}
              hints={["Rollback required by policy."]}
              onApprove={() => alert('Approved')}
              onReject={() => alert('Rejected')}
            />
          </div>
        </section>

        {/* Patterns */}
        <section>
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Patterns</h2>
          
          {/* Loading States */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Loading States</h3>
            <div className="space-y-4">
              <div className="panel p-6 text-center">
                <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-text-400">Loading data...</p>
              </div>
              <div className="panel p-4 space-y-3">
                <div className="h-4 bg-bg-850 rounded animate-pulse" />
                <div className="h-4 bg-bg-850 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-bg-850 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>

          {/* Empty States */}
          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Empty States</h3>
            <div className="panel p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-850 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-text-600" />
              </div>
              <h4 className="text-lg font-space-grotesk text-white mb-2">No traces yet</h4>
              <p className="text-sm text-text-400 mb-4">
                Run your first agent reasoning to see traces appear here
              </p>
              <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
                Re-run reasoning now
              </button>
            </div>
          </div>

          {/* Error States */}
          <div className="panel p-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Error States</h3>
            <div className="panel p-6 bg-danger/10 border-danger/30">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-danger mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-space-grotesk text-danger mb-1">Failed to load data</h4>
                  <p className="text-xs text-danger/80 mb-3">
                    Connection timeout while fetching agent traces
                  </p>
                  <button className="text-sm text-accent hover:underline">
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
