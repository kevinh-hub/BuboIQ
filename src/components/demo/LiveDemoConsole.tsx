import React, { useState, useEffect } from 'react';
import { 
  Brain, Play, Settings, Activity, FileText, X, AlertTriangle,
  CheckCircle, Clock, Zap, Shield, Eye
} from 'lucide-react';
import { ConfidenceOrb } from '../analyst/production/ConfidenceOrb';
import { ActionItem } from '../analyst/production/ActionItem';
import { ReasoningTraceCard } from '../analyst/production/ReasoningTraceCard';
import { KillSwitchBanner } from '../analyst/production/KillSwitchBanner';
import { toast } from 'sonner';

interface LiveDemoConsoleProps {
  onClose: () => void;
  onConversion: () => void;
}

type DemoState = 'initializing' | 'ready' | 'running' | 'error';
type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export function LiveDemoConsole({ onClose, onConversion }: LiveDemoConsoleProps) {
  const [demoState, setDemoState] = useState<DemoState>('initializing');
  const [killSwitch, setKillSwitch] = useState(false);
  const [currentView, setCurrentView] = useState<'console' | 'policies' | 'jobs'>('console');
  const [traces, setTraces] = useState<any[]>([]);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hasApprovedAction, setHasApprovedAction] = useState(false);

  // Initialize demo
  useEffect(() => {
    const initDemo = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add initial trace
      setTraces([
        {
          id: 'trace_001',
          createdAt: new Date().toISOString(),
          confidence: 0.87,
          output: {
            predicted_issue: "Print spooler service crashed due to driver conflict",
            recommended_fix: "Reinstall HP printer driver and restart service",
            priority_level: "high",
            device_id: "WS-ACCT-012"
          }
        }
      ]);

      // Add pending actions
      setPendingActions([
        {
          id: 'action_001',
          actionType: 'update_ticket',
          payload: {
            issue_id: "ISS-1234",
            predicted_issue: "Print spooler service crashed",
            confidence: 0.87,
            recommendation: "Reinstall printer driver"
          },
          hints: []
        },
        {
          id: 'action_002',
          actionType: 'restart',
          payload: {
            device_id: "WS-ACCT-012",
            service: "print_spooler",
            rollback: "snapshot_2025-10-22"
          },
          hints: ["Rollback required by policy."]
        }
      ]);

      setDemoState('ready');
    };

    initDemo();
  }, []);

  const handleApprove = async (actionId: string, actionType: string) => {
    if (killSwitch) return;

    // Remove action from pending
    setPendingActions(prev => prev.filter(a => a.id !== actionId));

    // Show appropriate toast
    if (actionType === 'update_ticket') {
      toast.success('Ticket updated.');
      
      // Trigger conversion modal after first successful action
      if (!hasApprovedAction) {
        setHasApprovedAction(true);
        setTimeout(() => {
          onConversion();
        }, 1500);
      }
    } else if (actionType === 'restart') {
      toast.success('Action approved & dispatched.');
      
      // Create job
      const newJob = {
        id: `job_${Date.now()}`,
        device_id: "WS-ACCT-012",
        action_type: "restart_service",
        status: 'queued' as JobStatus,
        started: new Date().toISOString(),
        ended: null,
        logs_url: null
      };
      
      setJobs(prev => [newJob, ...prev]);

      // Simulate job progression
      setTimeout(() => {
        setJobs(prev => prev.map(j => 
          j.id === newJob.id ? { ...j, status: 'running' as JobStatus } : j
        ));
      }, 1000);

      setTimeout(() => {
        setJobs(prev => prev.map(j => 
          j.id === newJob.id ? { 
            ...j, 
            status: 'succeeded' as JobStatus,
            ended: new Date().toISOString(),
            logs_url: 'https://logs.example.com/job_demo_1'
          } : j
        ));
        
        // Trigger conversion on successful job
        if (!hasApprovedAction) {
          setHasApprovedAction(true);
          setTimeout(() => {
            onConversion();
          }, 1000);
        }
      }, 3000);
    }
  };

  const handleReject = (actionId: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== actionId));
    toast.error('Action rejected');
  };

  const handleRerun = async () => {
    toast.info('Re-running agent reasoning...');
    
    setDemoState('running');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new trace
    const newTrace = {
      id: `trace_${Date.now()}`,
      createdAt: new Date().toISOString(),
      confidence: 0.72,
      output: {
        predicted_issue: "High CPU usage from Windows Update service",
        recommended_fix: "Defer updates and schedule during off-hours",
        priority_level: "medium",
        device_id: "WS-IT-045"
      }
    };
    
    setTraces(prev => [newTrace, ...prev]);
    setDemoState('ready');
  };

  const JobStatusBadge = ({ status }: { status: JobStatus }) => {
    const config = {
      queued: { icon: <Clock className="w-3 h-3" />, className: 'bg-text-600/20 text-text-400 border-text-600/30' },
      running: { icon: <Zap className="w-3 h-3" />, className: 'bg-info/20 text-info border-info/30' },
      succeeded: { icon: <CheckCircle className="w-3 h-3" />, className: 'bg-success/20 text-success border-success/30' },
      failed: { icon: <X className="w-3 h-3" />, className: 'bg-danger/20 text-danger border-danger/30' },
    };
    const { icon, className } = config[status];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${className}`}>
        {icon}
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-bg-900 z-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-bg-850 border-b border-[color:rgb(var(--border-analyst))] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-space-grotesk">
              <span className="text-white">BUBO</span>
              <span className="text-accent">IQ</span>
              <span className="text-text-400 ml-3">Analyst v1</span>
              <span className="ml-3 px-2 py-1 rounded text-xs bg-accent/20 text-accent border border-accent/30">
                Demo
              </span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs bg-warn/20 text-warn border border-warn/30">
              Approval Required
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-400" />
          </button>
        </div>
      </div>

      {/* Kill Switch Banner */}
      {killSwitch && <KillSwitchBanner enabled={true} />}

      {/* Navigation Tabs */}
      <div className="bg-bg-850 border-b border-[color:rgb(var(--border-analyst))]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'console' as const, label: 'Console', icon: <Brain className="w-4 h-4" /> },
              { id: 'policies' as const, label: 'Policies', icon: <Settings className="w-4 h-4" /> },
              { id: 'jobs' as const, label: 'Device Jobs', icon: <Activity className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  currentView === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-400 hover:text-text-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Console View */}
          {currentView === 'console' && (
            <>
              {demoState === 'initializing' && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-400">Initializing demo environment...</p>
                </div>
              )}

              {demoState !== 'initializing' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Recent Reasoning Traces */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-space-grotesk text-white">Recent Reasoning Traces</h2>
                      <button
                        onClick={handleRerun}
                        disabled={demoState === 'running'}
                        className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {demoState === 'running' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Re-run reasoning now
                          </>
                        )}
                      </button>
                    </div>

                    {traces.length === 0 ? (
                      <div className="panel p-12 text-center">
                        <FileText className="w-12 h-12 text-text-600 mx-auto mb-3" />
                        <p className="text-text-400">No traces yet. Click "Re-run reasoning now"</p>
                      </div>
                    ) : (
                      traces.map((trace) => (
                        <ReasoningTraceCard
                          key={trace.id}
                          createdAt={trace.createdAt}
                          confidence={trace.confidence}
                          output={trace.output}
                          onLineage={() => toast.info('Lineage view coming soon')}
                        />
                      ))
                    )}
                  </section>

                  {/* Right: Pending Actions */}
                  <section className="space-y-4">
                    <h2 className="text-xl font-space-grotesk text-white">Pending Actions</h2>

                    {pendingActions.length === 0 ? (
                      <div className="panel p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                        <p className="text-text-400">No pending actions</p>
                      </div>
                    ) : (
                      pendingActions.map((action) => (
                        <ActionItem
                          key={action.id}
                          actionType={action.actionType}
                          payload={action.payload}
                          hints={action.hints}
                          onApprove={() => handleApprove(action.id, action.actionType)}
                          onReject={() => handleReject(action.id)}
                          disabled={killSwitch}
                        />
                      ))
                    )}

                    {killSwitch && pendingActions.length > 0 && (
                      <div className="panel p-4 bg-warn/10 border-warn/30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-warn mt-0.5" />
                          <div>
                            <p className="text-sm text-warn mb-1">Approvals disabled</p>
                            <p className="text-xs text-text-400">
                              Observe-Only mode is active. Disable kill switch to approve actions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </>
          )}

          {/* Policies View */}
          {currentView === 'policies' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-space-grotesk text-white">Policy Settings</h2>

              {/* Kill Switch */}
              <div className="panel p-6 border-2 border-danger/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-space-grotesk text-white mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-danger" />
                      Kill Switch (Observe-Only)
                    </h3>
                    <p className="text-sm text-text-400 mb-4">
                      Agent will not queue executable actions while Observe-Only is on.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setKillSwitch(!killSwitch);
                      toast.success(killSwitch ? 'Kill switch disabled' : 'Kill switch enabled');
                    }}
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

              {/* Other Policies */}
              <div className="panel p-6">
                <h3 className="text-lg font-space-grotesk text-white mb-4">Confidence Threshold</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="99"
                    defaultValue="85"
                    className="flex-1 h-2 bg-bg-850 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <span className="text-2xl font-space-grotesk text-accent w-20">85%</span>
                </div>
              </div>

              <div className="panel p-6">
                <h3 className="text-lg font-space-grotesk text-white mb-4">Action Safelist</h3>
                <div className="flex flex-wrap gap-2">
                  {['update_ticket', 'create_kb_draft', 'restart'].map((action) => (
                    <span
                      key={action}
                      className="px-3 py-1.5 rounded-lg bg-success/20 text-success border border-success/30 text-xs"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Device Jobs View */}
          {currentView === 'jobs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-space-grotesk text-white">Device Action Jobs</h2>

              {jobs.length === 0 ? (
                <div className="panel p-12 text-center">
                  <Activity className="w-12 h-12 text-text-600 mx-auto mb-3" />
                  <p className="text-text-400">No jobs in last 24h</p>
                  <p className="text-xs text-text-600 mt-2">Approve an action to see jobs appear here</p>
                </div>
              ) : (
                <div className="panel overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-bg-850 border-b border-[color:rgb(var(--divider))]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Job ID</th>
                        <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Device</th>
                        <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Started</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:rgb(var(--divider))]">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-bg-850/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-jetbrains-mono text-accent">{job.id}</td>
                          <td className="px-6 py-4 text-sm text-text-300">{job.device_id}</td>
                          <td className="px-6 py-4 text-sm text-text-300">{job.action_type}</td>
                          <td className="px-6 py-4">
                            <JobStatusBadge status={job.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-text-400 font-jetbrains-mono">
                            {new Date(job.started).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
