import React, { useState } from 'react';
import { 
  ArrowLeft, UserPlus, Users, Shield, CheckCircle2, AlertTriangle, 
  Power, PlayCircle, Download, FileText, XCircle
} from 'lucide-react';
import { AnalystButton, AnalystBadge, EmptyState } from '../AnalystComponentLibrary';
import { Switch } from '../../ui/switch';
import { toast } from 'sonner';

/**
 * Screen 9: Roles & Access
 */
export function RolesAccess({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@acme.com', role: 'owner', lastActive: '2 min ago', org: 'Acme Corp' },
    { id: 2, name: 'Bob Smith', email: 'bob@acme.com', role: 'admin', lastActive: '1 hour ago', org: 'Acme Corp' },
    { id: 3, name: 'Carol Williams', email: 'carol@acme.com', role: 'analyst', lastActive: '3 hours ago', org: 'Acme Corp' },
    { id: 4, name: 'David Brown', email: 'david@acme.com', role: 'agent_viewer', lastActive: '1 day ago', org: 'Acme Corp' },
  ];

  const rolePermissions = {
    owner: ['Full access', 'Billing', 'User management', 'Policy editing', 'Approve/reject actions'],
    admin: ['User management', 'Policy editing', 'Approve/reject actions', 'View traces'],
    analyst: ['Approve/reject actions', 'View traces', 'Edit KB drafts'],
    agent_viewer: ['View traces', 'View KB articles'],
  };

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
                Roles & Access
              </h1>
              <p className="text-[#AAB4C0] mt-1">Manage team permissions and access control</p>
            </div>
            <AnalystButton
              variant="primary"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </AnalystButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Users Table */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#050607] border-b border-[#1F242D]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A8694] uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A8694] uppercase">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A8694] uppercase">Organization</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A8694] uppercase">Last Active</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A8694] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F242D]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#050607]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-[#7A8694]">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AnalystBadge variant={user.role === 'owner' ? 'success' : 'neutral'}>
                      {user.role.replace('_', ' ')}
                    </AnalystBadge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#C7D0DA]">{user.org}</td>
                  <td className="px-6 py-4 text-sm font-jetbrains-mono text-[#7A8694]">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-[#3EA0FF] hover:text-[#5BB0FF]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permission Matrix */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
          <h2 className="font-space-grotesk text-xl font-bold text-white mb-6">Permission Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <div key={role} className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
                <div className="font-space-grotesk font-semibold text-white mb-3 capitalize">
                  {role.replace('_', ' ')}
                </div>
                <ul className="space-y-2">
                  {perms.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#C7D0DA]">
                      <CheckCircle2 className="w-3 h-3 text-[#00FF85]" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 10: Org Onboarding (Beta)
 */
export function OrgOnboarding({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'create', label: 'Create Organization', complete: false },
    { id: 'roles', label: 'Assign Roles', complete: false },
    { id: 'devices', label: 'Enroll Devices', complete: false },
    { id: 'policies', label: 'Set Policies', complete: false },
    { id: 'legal', label: 'Review Legal', complete: false },
    { id: 'start', label: 'Start Observing', complete: false },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      {/* Beta Notice */}
      <div className="bg-[#3EA0FF]/10 border-b border-[#3EA0FF]/30 px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#3EA0FF]" />
          <span className="text-sm text-[#3EA0FF] font-semibold">
            Beta Feature: Multi-org onboarding
          </span>
          <a href="#" className="text-sm text-[#3EA0FF] underline ml-auto">Terms & Privacy</a>
        </div>
      </div>

      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="font-space-grotesk text-2xl font-bold text-white">
            Organization Onboarding
          </h1>
          <p className="text-[#AAB4C0] mt-1">Set up your AI analyst in 6 steps</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold
                      transition-all duration-300
                      ${idx === currentStep 
                        ? 'border-[#00FF85] bg-[#00FF85]/10 text-[#00FF85]' 
                        : idx < currentStep
                        ? 'border-[#00FF85] bg-[#00FF85] text-[#0A0B0D]'
                        : 'border-[#1F242D] text-[#7A8694]'
                      }
                    `}
                  >
                    {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="text-xs text-center mt-2 text-[#AAB4C0]">{step.label}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      idx < currentStep ? 'bg-[#00FF85]' : 'bg-[#1F242D]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-8 min-h-[400px]">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="font-space-grotesk text-xl font-bold text-white">Create Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Organization Name</label>
                  <input
                    type="text"
                    placeholder="Acme Corporation"
                    className="w-full px-4 py-3 rounded-xl bg-[#050607] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Industry</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[#050607] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50">
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Manufacturing</option>
                    <option>Legal</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#00FF85]/10 border border-[#00FF85]/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#00FF85]" />
              </div>
              <h2 className="font-space-grotesk text-2xl font-bold text-white">
                You're All Set!
              </h2>
              <p className="text-[#AAB4C0]">
                Your AI analyst is now in observe mode. It will start learning from your environment.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep < steps.length - 1 ? (
            <>
              {currentStep > 0 && (
                <AnalystButton variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </AnalystButton>
              )}
              <AnalystButton variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                {currentStep === steps.length - 2 ? 'Start Observing' : 'Continue'}
              </AnalystButton>
            </>
          ) : (
            <AnalystButton variant="primary" onClick={() => onNavigate?.('console')}>
              Go to Console
            </AnalystButton>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 11: Runbook & Kill Switch
 */
export function RunbookKillSwitch({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [killSwitch, setKillSwitch] = useState(false);
  const [showKillSwitchModal, setShowKillSwitchModal] = useState(false);

  const playbooks = [
    { id: 1, title: 'Re-run Agent Reasoning', description: 'Manually trigger AI analysis on pending tickets', icon: PlayCircle },
    { id: 2, title: 'Bulk Approve Actions', description: 'Review and approve multiple pending actions', icon: CheckCircle2 },
    { id: 3, title: 'Bulk Reject Actions', description: 'Reject multiple pending actions at once', icon: XCircle },
    { id: 4, title: 'Investigate Failed Action', description: 'Deep-dive into execution failures', icon: AlertTriangle },
    { id: 5, title: 'Rollback Recent Action', description: 'Undo the last executed action', icon: Shield },
    { id: 6, title: 'Suspend Auto-Approve', description: 'Temporarily disable automated execution', icon: Power },
    { id: 7, title: 'Export Trace Data', description: 'Download lineage and reasoning logs', icon: Download },
    { id: 8, title: 'Generate Audit Report', description: 'Create compliance audit trail', icon: FileText },
  ];

  const toggleKillSwitch = () => {
    if (!killSwitch) {
      setShowKillSwitchModal(true);
    } else {
      setKillSwitch(false);
      toast.success('Observe-Only mode disabled. Actions can be executed.');
    }
  };

  const confirmKillSwitch = () => {
    setKillSwitch(true);
    setShowKillSwitchModal(false);
    toast.warning('Observe-Only mode enabled. All executable actions are paused.');
  };

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
                Runbook & Kill Switch
              </h1>
              <p className="text-[#AAB4C0] mt-1">Operational playbooks and emergency controls</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Kill Switch Control */}
        <div className={`
          border-2 rounded-2xl p-8 transition-all duration-300
          ${killSwitch 
            ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30' 
            : 'bg-[#0A0B0D] border-[#1F242D]'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Power className={`w-8 h-8 ${killSwitch ? 'text-[#FF6B6B]' : 'text-[#AAB4C0]'}`} />
                <h2 className="font-space-grotesk text-2xl font-bold text-white">
                  Global Kill Switch
                </h2>
              </div>
              <p className="text-[#AAB4C0] mb-4 max-w-2xl">
                {killSwitch 
                  ? 'Observe-Only mode is ACTIVE. The AI analyst will continue monitoring but will not execute any actions. All pending actions are paused.'
                  : 'Enable Observe-Only mode to pause all executable actions. The AI analyst will continue reasoning but actions will require manual approval.'}
              </p>
              {killSwitch && (
                <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl p-4 max-w-2xl">
                  <div className="text-sm text-[#FF6B6B]">
                    <strong>Consequences:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>All auto-approve workflows are suspended</li>
                      <li>Pending actions remain queued</li>
                      <li>Manual approval is required for all actions</li>
                      <li>Reasoning engine continues to operate</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 ml-8">
              <div className="flex flex-col items-center gap-3">
                <Switch
                  checked={killSwitch}
                  onCheckedChange={toggleKillSwitch}
                  className="data-[state=checked]:bg-[#FF6B6B]"
                />
                <span className={`text-sm font-semibold ${killSwitch ? 'text-[#FF6B6B]' : 'text-[#AAB4C0]'}`}>
                  {killSwitch ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Playbooks */}
        <div>
          <h2 className="font-space-grotesk text-xl font-bold text-white mb-6">Operational Playbooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playbooks.map((playbook) => {
              const Icon = playbook.icon;
              return (
                <button
                  key={playbook.id}
                  className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 hover:border-[#00FF85]/30 hover:bg-[#00FF85]/5 transition-all text-left group"
                  onClick={() => toast.info(`Running: ${playbook.title}`)}
                >
                  <Icon className="w-8 h-8 text-[#00FF85] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-space-grotesk font-semibold text-white mb-2">
                    {playbook.title}
                  </h3>
                  <p className="text-sm text-[#AAB4C0]">
                    {playbook.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kill Switch Confirmation Modal */}
      {showKillSwitchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-[#0A0B0D] border-2 border-[#FF6B6B]/30 rounded-3xl p-8 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#FF6B6B]" />
              </div>
              <h2 className="font-space-grotesk text-xl font-bold text-white">
                Enable Observe-Only Mode?
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-[#C7D0DA]">
                This will immediately pause all executable actions across all organizations. The AI analyst will continue monitoring and reasoning.
              </p>
              <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl p-4">
                <div className="text-sm text-[#FF6B6B]">
                  <strong>Impact:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Pending actions will be paused</li>
                    <li>Auto-approve workflows suspended</li>
                    <li>Manual intervention required</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <AnalystButton variant="danger" onClick={confirmKillSwitch}>
                <Power className="w-4 h-4 mr-2" />
                Enable Observe-Only
              </AnalystButton>
              <AnalystButton variant="ghost" onClick={() => setShowKillSwitchModal(false)}>
                Cancel
              </AnalystButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
