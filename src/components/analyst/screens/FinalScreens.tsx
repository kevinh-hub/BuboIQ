import React, { useState } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Users, Webhook, Lock,
  Download, Settings, Eye, Zap, PlayCircle, XCircle, ChevronRight, Book
} from 'lucide-react';

// Screen 9: Audit Log
export function AuditLogScreen() {
  const auditEntries = [
    { time: '14:35:12', actor: 'admin@acme.com', action: 'approve_action', target: 'ACT-1234', meta: { confidence: 0.87 } },
    { time: '14:32:08', actor: 'agent', action: 'execute', target: 'ACT-1234', meta: { device: 'DEV-5678' } },
    { time: '14:30:45', actor: 'admin@acme.com', action: 'policy_change', target: 'ORG-ACME', meta: { threshold: 85 } },
    { time: '14:28:15', actor: 'admin@acme.com', action: 'run_killswitch', target: 'ORG-ACME', meta: { enabled: false } },
    { time: '14:25:30', actor: 'tech@acme.com', action: 'reject_action', target: 'ACT-1233', meta: { reason: 'manual_review' } },
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-space-grotesk text-white">Audit Log</h1>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
              <option>All actors</option>
              <option>Users</option>
              <option>Agent</option>
              <option>System</option>
            </select>
            <select className="px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
            <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="panel">
          <div className="p-4 border-b border-[color:rgb(var(--divider))]">
            <div className="grid grid-cols-12 gap-4 text-xs font-space-grotesk text-text-400">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Actor</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-2">Target</div>
              <div className="col-span-2">Metadata</div>
              <div className="col-span-1">Link</div>
            </div>
          </div>
          
          <div className="divide-y divide-[color:rgb(var(--divider))]">
            {auditEntries.map((entry, i) => (
              <div key={i} className="p-4 hover:bg-bg-850/50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 text-xs text-text-400 font-jetbrains-mono">{entry.time}</div>
                  <div className="col-span-2 text-xs">
                    <span className={entry.actor === 'agent' ? 'text-accent' : entry.actor === 'system' ? 'text-info' : 'text-text-300'}>
                      {entry.actor}
                    </span>
                  </div>
                  <div className="col-span-3 text-xs text-text-300">{entry.action}</div>
                  <div className="col-span-2 text-xs text-info">{entry.target}</div>
                  <div className="col-span-2 text-xs text-text-400 font-jetbrains-mono">
                    <button className="hover:text-accent transition-colors">
                      {Object.keys(entry.meta).length} fields
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button className="text-info hover:underline text-xs">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 10: Rate Limits
export function RateLimitsScreen() {
  const buckets = [
    { name: 'agent_runs', count: 142, limit: 200, window: '24h' },
    { name: 'device_exec', count: 48, limit: 50, window: '60m' },
    { name: 'callbacks', count: 385, limit: 500, window: '24h' },
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Rate Limits</h1>
        
        <div className="space-y-6">
          {buckets.map((bucket) => {
            const percentage = (bucket.count / bucket.limit) * 100;
            const isWarning = percentage > 80;
            const isDanger = percentage > 95;
            
            return (
              <div key={bucket.name} className="panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-space-grotesk text-white mb-1">{bucket.name}</h2>
                    <p className="text-xs text-text-400">Time window: {bucket.window}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-space-grotesk text-white">
                      {bucket.count} <span className="text-text-400">/ {bucket.limit}</span>
                    </p>
                    <p className={`text-xs ${isDanger ? 'text-danger' : isWarning ? 'text-warn' : 'text-success'}`}>
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>
                
                <div className="h-3 bg-bg-850 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isDanger ? 'bg-danger' : isWarning ? 'bg-warn' : 'bg-success'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                {isDanger && (
                  <div className="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
                    <p className="text-sm text-danger mb-2">Execution rate limit reached.</p>
                    <button className="text-sm text-accent hover:underline">
                      Adjust policy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="panel p-6 mt-6 bg-bg-850/50">
          <h3 className="text-sm font-space-grotesk text-white mb-3">Rate Limit Policies</h3>
          <p className="text-xs text-text-400 mb-4">
            Rate limits prevent system overload and ensure fair usage across organizations. Limits are applied per time window and reset automatically.
          </p>
          <button className="text-sm text-accent hover:underline">
            View documentation
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 11: Org Onboarding
export function OrgOnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(2);
  
  const steps = [
    { id: 1, label: 'Create org', completed: true },
    { id: 2, label: 'Invite users & assign roles', completed: false },
    { id: 3, label: 'Configure policies', completed: false },
    { id: 4, label: 'Connect webhook URLs & secrets', completed: false },
    { id: 5, label: 'Verify callback signature', completed: false },
    { id: 6, label: 'Start observing', completed: false },
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Organization Onboarding</h1>
        
        {/* Stepper */}
        <div className="panel p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${
                      step.completed
                        ? 'bg-success/20 border-success'
                        : step.id === currentStep
                        ? 'bg-accent/20 border-accent'
                        : 'bg-bg-850 border-[color:rgb(var(--border-analyst))]'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <span className={step.id === currentStep ? 'text-accent' : 'text-text-400'}>{step.id}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-400 text-center max-w-24">{step.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step.completed ? 'bg-success' : 'bg-[color:rgb(var(--divider))]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Current Step Content */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-space-grotesk text-white">Invite Users & Assign Roles</h2>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <select className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300">
                  <option>owner</option>
                  <option>admin</option>
                  <option>analyst</option>
                  <option>agent_viewer</option>
                </select>
                <button className="w-full px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
                  Send Invitation
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-space-grotesk text-white mb-3">Current Team</h3>
                <div className="space-y-2">
                  {[
                    { email: 'admin@acme.com', role: 'owner' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg-850 rounded-lg">
                      <span className="text-sm text-text-300">{user.email}</span>
                      <span className="px-2 py-1 rounded text-xs bg-accent/20 text-accent border border-accent/30">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Webhook Verification */}
        {currentStep >= 4 && (
          <div className="panel p-6 mb-6">
            <h2 className="text-lg font-space-grotesk text-white mb-4">Verify Webhooks</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-text-300">Functions reachable</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-text-300">HMAC signature valid</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-text-300">Callback endpoint reachable</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            {currentStep === 6 ? 'Complete Onboarding' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 12: Admin Settings → Webhooks & Secrets
export function WebhooksSecretsScreen() {
  const [showTestResult, setShowTestResult] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  
  const runTest = (success: boolean) => {
    setTestSuccess(success);
    setShowTestResult(true);
    setTimeout(() => setShowTestResult(false), 5000);
  };
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Webhooks & Secrets</h1>
        
        {/* Connect Base URL */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Connect Base URL</h2>
          <input
            type="url"
            placeholder="https://connect.example.com"
            className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <p className="text-xs text-text-400 mt-2">
            Base URL for your Connect service that will receive device action requests
          </p>
        </div>
        
        {/* Outbound HMAC Secret */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Outbound HMAC Secret (X-Bubo-Signature)</h2>
          <div className="flex items-center gap-3">
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="flex-1 px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
              Rotate
            </button>
          </div>
          <p className="text-xs text-text-400 mt-2">
            Used to sign outbound webhooks to Connect service
          </p>
        </div>
        
        {/* Inbound HMAC Secret */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Inbound HMAC Secret Validation</h2>
          <div className="flex items-center gap-3">
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="flex-1 px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
              Rotate
            </button>
          </div>
          <p className="text-xs text-text-400 mt-2">
            Used to verify signatures on incoming callbacks from Connect service
          </p>
        </div>
        
        {/* Test Actions */}
        <div className="panel p-6 mb-6">
          <h2 className="text-lg font-space-grotesk text-white mb-4">Test Integration</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => runTest(true)}
              className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Send Test Action
            </button>
            <button
              onClick={() => runTest(false)}
              className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Send Test Callback
            </button>
          </div>
        </div>
        
        {/* Test Result */}
        {showTestResult && (
          <div className={`panel p-4 mb-6 ${testSuccess ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
            <div className="flex items-center gap-3">
              {testSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm text-success">Test successful! Webhook delivered and signature verified.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-danger" />
                  <div>
                    <p className="text-sm text-danger">Invalid signature</p>
                    <button className="text-xs text-accent hover:underline mt-1">
                      View debugging guide
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Security Note */}
        <div className="panel p-6 bg-bg-850/50">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-warn mt-1" />
            <div>
              <h3 className="text-sm font-space-grotesk text-white mb-2">Security Best Practices</h3>
              <ul className="text-xs text-text-400 space-y-1">
                <li>• Rotate secrets every 90 days</li>
                <li>• Use environment-specific secrets (dev, staging, prod)</li>
                <li>• Monitor for signature validation failures</li>
                <li>• Never commit secrets to version control</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 13: Runbook & Kill Switch
export function RunbookKillSwitchScreen() {
  const [killSwitch, setKillSwitch] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const playbooks = [
    { id: 1, title: 'Re-run Agent Reasoning', steps: ['Navigate to Agent Console', 'Click "Re-run reasoning now"', 'Wait for results', 'Review traces'], icon: <PlayCircle className="w-5 h-5" /> },
    { id: 2, title: 'Approve/Reject Action', steps: ['Review action details', 'Check policy compliance', 'Verify rollback present', 'Click Approve or Reject'], icon: <CheckCircle className="w-5 h-5" /> },
    { id: 3, title: 'Investigate Failed Action', steps: ['Open Device Jobs page', 'Filter by "failed" status', 'Review error logs', 'Check callback signature'], icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 4, title: 'Rollback Device Action', steps: ['Navigate to job detail', 'Verify rollback present', 'Click "Rollback" button', 'Confirm in modal'], icon: <Shield className="w-5 h-5" /> },
    { id: 5, title: 'Suspend Auto-Approve', steps: ['Go to Policy Settings', 'Change tier from Team to Pro', 'Save policy', 'All new actions will require manual approval'], icon: <Zap className="w-5 h-5" /> },
    { id: 6, title: 'Export Traces for Analysis', steps: ['Navigate to Traces & Lineage', 'Select date range', 'Click "Export CSV"', 'Open in analytics tool'], icon: <Download className="w-5 h-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-space-grotesk text-white mb-8">Runbooks & Kill Switch</h1>
        
        {/* Global Kill Switch */}
        <div className="panel p-6 mb-8 border-2 border-danger/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-space-grotesk text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-danger" />
                Global Kill Switch
              </h2>
              <p className="text-sm text-text-400 mb-4">
                Agent will not queue executable actions while Observe-Only is on. Reasoning will continue, but all actions will remain in "queued" status pending manual review.
              </p>
              <div className="panel p-3 bg-danger/10 border-danger/30">
                <p className="text-xs text-danger">
                  <strong>Consequence:</strong> No device actions, ticket updates, or KB drafts will execute automatically until this is disabled.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfirmation(true)}
              className={`ml-6 w-16 h-8 rounded-full transition-colors ${killSwitch ? 'bg-danger' : 'bg-bg-850'}`}
            >
              <div className={`w-7 h-7 rounded-full bg-white transition-transform ${killSwitch ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        {/* Playbooks Grid */}
        <h2 className="text-2xl font-space-grotesk text-white mb-6">Common Playbooks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <div key={playbook.id} className="panel p-6 hover:border-accent/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-bg-850 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                  {playbook.icon}
                </div>
                <h3 className="text-sm font-space-grotesk text-white">{playbook.title}</h3>
              </div>
              <ol className="space-y-2 text-xs text-text-400 list-decimal list-inside">
                {playbook.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        
        {/* Kill Switch Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-bg-850 rounded-2xl p-6 max-w-md w-full border border-danger/30 shadow-modal">
              <h2 className="text-xl font-space-grotesk text-white mb-4">
                {killSwitch ? 'Disable' : 'Enable'} Observe-Only Mode?
              </h2>
              <p className="text-sm text-text-300 mb-6">
                {killSwitch
                  ? 'The agent will resume automatic execution of approved actions.'
                  : 'Agent will not queue executable actions while Observe-Only is on. All actions will require manual review.'}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-bg-900 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-850 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setKillSwitch(!killSwitch);
                    setShowConfirmation(false);
                  }}
                  className="px-4 py-2 bg-danger text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {killSwitch ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const FinalScreens = {
  AuditLog: AuditLogScreen,
  RateLimits: RateLimitsScreen,
  OrgOnboarding: OrgOnboardingScreen,
  WebhooksSecrets: WebhooksSecretsScreen,
  RunbookKillSwitch: RunbookKillSwitchScreen,
};
