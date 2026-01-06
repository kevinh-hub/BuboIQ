import React, { useState, useEffect, useRef } from 'react';
import { X, Play, StopCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { StepListItem, StepState } from './step-list-item';
import { CommandBlock } from './command-block';
import { ConsoleStream, ConsoleStatus } from './console-stream';
import { OSBadge, OSType } from './os-badge';
import { SafetyChip, SafetyLevel } from './safety-chip';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import * as GuidedFixesAPI from '../../utils/guided-fixes-service';

export type ExecutionPath = 'agent' | 'connect' | 'winrm';

interface GuidedFixStep {
  id: string;
  title: string;
  command: string;
  os: OSType;
  shell: string;
  safety: 'readOnly' | 'low' | 'risky' | 'destructive';
  whatItDoes: string;
  expectedOutput: string;
  prereqs: string[];
  requiresElevation: boolean;
  supportsDryRun: boolean;
}

interface GuidedFixRunnerDrawerProps {
  guidedFixId: string;
  title: string;
  issueId?: string;
  computerId?: string;
  defaultPath?: ExecutionPath;
  onClose: () => void;
}

export const GuidedFixRunnerDrawer: React.FC<GuidedFixRunnerDrawerProps> = ({
  guidedFixId,
  title,
  issueId,
  computerId,
  defaultPath = 'agent',
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [guidedFix, setGuidedFix] = useState<GuidedFixesAPI.GuidedFix | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [executionPath, setExecutionPath] = useState<ExecutionPath>(defaultPath);
  const [elevated, setElevated] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [consoleStatus, setConsoleStatus] = useState<ConsoleStatus>('idle');
  const [consoleLines, setConsoleLines] = useState<Array<{ timestamp: Date; text: string; type?: string }>>([]);
  const [stepStates, setStepStates] = useState<Record<string, StepState>>({});
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch guided fix details
  useEffect(() => {
    async function loadGuidedFix() {
      try {
        const fix = await GuidedFixesAPI.getGuidedFix(guidedFixId);
        setGuidedFix(fix);
        
        // Initialize step states
        const states: Record<string, StepState> = {};
        fix.steps.forEach((step, idx) => {
          states[step.id] = idx === 0 ? 'ready' : 'locked';
        });
        setStepStates(states);
      } catch (error) {
        console.error('Failed to load guided fix:', error);
        toast.error('Failed to load guided fix');
        onClose();
      } finally {
        setLoading(false);
      }
    }

    loadGuidedFix();
  }, [guidedFixId, onClose]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (loading || !guidedFix) {
    return (
      <>
        <div className="fixed inset-0 bg-dark-midnight/80 backdrop-blur-sm z-40" onClick={onClose} />
        <div className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bubo-glass border-l border-slate-gray/30 z-50 flex items-center justify-center">
          <div className="text-pure-white">Loading...</div>
        </div>
      </>
    );
  }

  const steps = guidedFix.steps;
  const activeStep = steps[activeStepIndex];
  const requiresConfirmation = activeStep.safety === 'risky' || activeStep.safety === 'destructive';
  const confirmationValid = !requiresConfirmation || confirmText.toLowerCase() === 'confirm';

  const handleRunStep = async () => {
    if (!confirmationValid || executionId) return;

    try {
      setConsoleStatus('running');
      
      // Start execution
      const result = await GuidedFixesAPI.executeGuidedFix(guidedFixId, {
        computerId,
        issueId,
        executionPath,
        elevated,
        dryRun
      });

      setExecutionId(result.executionId);

      // Connect to WebSocket for live updates
      const ws = GuidedFixesAPI.connectToExecutionStream(result.executionId, {
        onConnected: () => {
          console.log('Connected to execution stream');
        },
        onExecutionStart: (data) => {
          const line = {
            timestamp: new Date(data.timestamp),
            text: `Starting execution: ${data.totalSteps} steps`,
            type: 'info' as const
          };
          setConsoleLines(prev => [...prev, line]);
        },
        onStepStart: (data) => {
          if (data.stepId) {
            setStepStates(prev => ({ ...prev, [data.stepId!]: 'running' }));
          }
          if (typeof data.stepIndex === 'number') {
            setActiveStepIndex(data.stepIndex);
          }
          const line = {
            timestamp: new Date(data.timestamp),
            text: `Step ${(data.stepIndex || 0) + 1}: ${steps[data.stepIndex || 0]?.title || 'Running'}`,
            type: 'info' as const
          };
          setConsoleLines(prev => [...prev, line]);
        },
        onOutput: (data) => {
          const line = {
            timestamp: new Date(data.timestamp),
            text: data.text || '',
            type: (data.stream === 'stderr' ? 'error' : 'stdout') as const
          };
          setConsoleLines(prev => [...prev, line]);
        },
        onStepComplete: (data) => {
          if (data.stepId) {
            setStepStates(prev => ({ 
              ...prev, 
              [data.stepId!]: data.status === 'success' ? 'complete' : 'error' 
            }));
          }
          // Unlock next step
          if (typeof data.stepIndex === 'number' && data.stepIndex < steps.length - 1) {
            setStepStates(prev => ({ ...prev, [steps[data.stepIndex! + 1].id]: 'ready' }));
          }
          const line = {
            timestamp: new Date(data.timestamp),
            text: `Step ${(data.stepIndex || 0) + 1} ${data.status}`,
            type: 'info' as const
          };
          setConsoleLines(prev => [...prev, line]);
        },
        onExecutionComplete: (data) => {
          setConsoleStatus(data.status === 'success' ? 'success' : 'failed');
          
          if (data.status === 'success' && data.kbDraftId) {
            toast.success('Draft created in Knowledge Base', {
              description: 'Click to review and publish',
              action: {
                label: 'View',
                onClick: () => console.log('Navigate to KB draft:', data.kbDraftId)
              }
            });
          } else if (data.error) {
            toast.error('Execution failed', {
              description: data.error
            });
          }
        },
        onError: (error) => {
          console.error('WebSocket error:', error);
          setConsoleStatus('failed');
          toast.error('Connection error', {
            description: 'Lost connection to execution stream'
          });
        },
        onClose: () => {
          console.log('WebSocket closed');
        }
      });

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to start execution:', error);
      setConsoleStatus('failed');
      toast.error('Failed to start execution', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleAbort = async () => {
    if (!executionId) return;

    try {
      await GuidedFixesAPI.abortExecution(executionId);
      setConsoleStatus('aborted');
      const abortLine = {
        timestamp: new Date(),
        text: 'Execution aborted by user',
        type: 'error' as const
      };
      setConsoleLines(prev => [...prev, abortLine]);
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    } catch (error) {
      console.error('Failed to abort execution:', error);
      toast.error('Failed to abort execution');
    }
  };

  return (
    <>
      {/* Scrim */}
      <div 
        className="fixed inset-0 bg-dark-midnight/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bubo-glass border-l border-slate-gray/30 z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-midnight/95 backdrop-blur-sm border-b border-slate-gray/30 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-space-grotesk text-2xl text-pure-white mb-1">
                {title}
              </h2>
              <p className="text-sm text-mist-gray">
                {issueId && `Issue #${issueId} • `}
                {steps.filter(s => stepStates[s.id] === 'complete').length} of {steps.length} steps complete
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-mist-gray hover:text-pure-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-6 p-6">
          {/* Left: Step List */}
          <div className="w-80 space-y-2">
            <h3 className="font-space-grotesk text-sm text-pure-white mb-3">Steps</h3>
            {steps.map((step, idx) => (
              <StepListItem
                key={step.id}
                index={idx + 1}
                title={step.title}
                state={stepStates[step.id]}
                isActive={idx === activeStepIndex}
                onClick={() => {
                  if (stepStates[step.id] !== 'locked') {
                    setActiveStepIndex(idx);
                  }
                }}
              />
            ))}
          </div>

          {/* Right: Active Step Panel */}
          <div className="flex-1 space-y-6">
            {/* Step Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <OSBadge os={activeStep.os} />
                <Badge className="bg-surface-dark/50 text-mist-gray border-slate-gray/30 text-xs">
                  {activeStep.shell}
                </Badge>
                <SafetyChip level={activeStep.safety} />
              </div>
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">
                {activeStep.title}
              </h3>
              <p className="text-sm text-cloud-white mb-4">
                <span className="text-mist-gray">What this does:</span> {activeStep.whatItDoes}
              </p>
            </div>

            {/* Command */}
            <CommandBlock
              command={activeStep.command}
              os={activeStep.os}
              shell={activeStep.shell}
              elevated={elevated}
              dryRun={dryRun}
            />

            {/* Expected Output */}
            <div className="bubo-glass rounded-lg p-4">
              <h4 className="text-xs font-jetbrains text-mist-gray mb-2">Expected output:</h4>
              <p className="text-sm text-cloud-white font-jetbrains">{activeStep.expectedOutput}</p>
            </div>

            {/* Prerequisites */}
            {activeStep.prereqs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeStep.prereqs.map((prereq, idx) => (
                  <Badge key={idx} className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                    {prereq}
                  </Badge>
                ))}
              </div>
            )}

            {/* Safety Warning */}
            {requiresConfirmation && (
              <Alert className="border-signal-yellow/30 bg-signal-yellow/10">
                <AlertTriangle className="w-4 h-4 text-signal-yellow" />
                <AlertDescription className="text-signal-yellow">
                  {activeStep.safety === 'destructive' 
                    ? 'This action is DESTRUCTIVE and may cause data loss. Type "confirm" to proceed.'
                    : 'This action is RISKY and may require a system restart. Type "confirm" to proceed.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Confirmation Input */}
            {requiresConfirmation && (
              <div>
                <Label htmlFor="confirm-input" className="text-sm text-cloud-white mb-2 block">
                  Type "confirm" to proceed
                </Label>
                <Input
                  id="confirm-input"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="confirm"
                  className="bg-surface-dark border-slate-gray/30"
                />
              </div>
            )}

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="target-select" className="text-sm text-mist-gray mb-2 block">
                    Target
                  </Label>
                  <Select value={executionPath} onValueChange={(value) => setExecutionPath(value as ExecutionPath)}>
                    <SelectTrigger id="target-select" className="bg-surface-dark border-slate-gray/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent (Local)</SelectItem>
                      <SelectItem value="connect">Connect (Remote)</SelectItem>
                      <SelectItem value="winrm" disabled>WinRM (Coming Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeStep.requiresElevation && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="elevate-toggle"
                      checked={elevated}
                      onCheckedChange={setElevated}
                    />
                    <Label htmlFor="elevate-toggle" className="text-sm text-cloud-white cursor-pointer">
                      Elevate
                    </Label>
                  </div>
                )}

                {activeStep.supportsDryRun && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="dryrun-toggle"
                      checked={dryRun}
                      onCheckedChange={setDryRun}
                    />
                    <Label htmlFor="dryrun-toggle" className="text-sm text-cloud-white cursor-pointer">
                      Dry Run
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRunStep}
                  disabled={!confirmationValid || stepStates[activeStep.id] === 'running'}
                  className="flex-1 bubo-btn-neon-primary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Step
                </Button>
                
                <Button
                  onClick={handleAbort}
                  disabled={stepStates[activeStep.id] !== 'running'}
                  variant="outline"
                  className="border-crimson-danger/30 text-crimson-danger hover:bg-crimson-danger/10"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Abort
                </Button>
              </div>
            </div>

            {/* Console Stream */}
            <ConsoleStream
              lines={consoleLines}
              status={consoleStatus}
              redactOnCopy={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};
