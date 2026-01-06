import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Zap, Plus, Trash2, Save, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowTrigger {
  id: string;
  type: 'phi_detected' | 'posture_fail' | 'anomaly_high' | 'breach_detected' | 'session_unauthorized';
  enabled: boolean;
  conditions: Record<string, any>;
}

interface WorkflowAction {
  id: string;
  type: 'notify' | 'create_incident' | 'block_session' | 'escalate' | 'auto_remediate';
  config: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
}

interface WorkflowConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: Workflow[];
  onSaveWorkflow: (workflow: Workflow) => Promise<void>;
  onDeleteWorkflow: (workflowId: string) => Promise<void>;
  tierLevel: 'starter' | 'pro' | 'team';
}

const TRIGGER_TYPES = [
  { value: 'phi_detected', label: 'PHI detected', description: 'When PHI is found in content' },
  { value: 'posture_fail', label: 'Posture check failure', description: 'When computer posture check fails' },
  { value: 'anomaly_high', label: 'High severity problem', description: 'When high/critical problem detected' },
  { value: 'breach_detected', label: 'Breach detected', description: 'When potential breach is found' },
  { value: 'session_unauthorized', label: 'Unauthorized session', description: 'When session breaks policy' }
];

const ACTION_TYPES = [
  { value: 'notify', label: 'Send notification', description: 'Email/Slack alert' },
  { value: 'create_incident', label: 'Create incident', description: 'Auto-create compliance incident' },
  { value: 'block_session', label: 'Block session', description: 'End remote session' },
  { value: 'escalate', label: 'Escalate', description: 'Escalate to manager/admin' },
  { value: 'auto_remediate', label: 'Auto-fix', description: 'Try automatic fix' }
];

export const WorkflowConfigDrawer: React.FC<WorkflowConfigDrawerProps> = ({
  isOpen,
  onClose,
  workflows,
  onSaveWorkflow,
  onDeleteWorkflow,
  tierLevel
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Team tier only
  if (tierLevel !== 'team') {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl bg-dark-midnight border-l border-slate-gray/30">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
              Workflow Configuration
            </SheetTitle>
          </SheetHeader>
          
          <div className="bubo-glass-bright rounded-xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-warning mx-auto mb-4" />
            <h3 className="font-['Space_Grotesk'] text-xl text-pure-white mb-2">
              Team tier required
            </h3>
            <p className="text-mist-gray mb-6">
              Workflow configuration is available on Team tier only
            </p>
            <Button className="bubo-btn-neon-primary">
              Upgrade to Team
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      enabled: false,
      triggers: [],
      actions: []
    };
    setSelectedWorkflow(newWorkflow);
  };

  const handleAddTrigger = () => {
    if (!selectedWorkflow) return;
    
    const newTrigger: WorkflowTrigger = {
      id: `trigger-${Date.now()}`,
      type: 'phi_detected',
      enabled: true,
      conditions: {}
    };
    
    setSelectedWorkflow({
      ...selectedWorkflow,
      triggers: [...selectedWorkflow.triggers, newTrigger]
    });
  };

  const handleAddAction = () => {
    if (!selectedWorkflow) return;
    
    const newAction: WorkflowAction = {
      id: `action-${Date.now()}`,
      type: 'notify',
      config: {}
    };
    
    setSelectedWorkflow({
      ...selectedWorkflow,
      actions: [...selectedWorkflow.actions, newAction]
    });
  };

  const handleRemoveTrigger = (triggerId: string) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow({
      ...selectedWorkflow,
      triggers: selectedWorkflow.triggers.filter(t => t.id !== triggerId)
    });
  };

  const handleRemoveAction = (actionId: string) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow({
      ...selectedWorkflow,
      actions: selectedWorkflow.actions.filter(a => a.id !== actionId)
    });
  };

  const handleSave = async () => {
    if (!selectedWorkflow) return;

    if (!selectedWorkflow.name.trim()) {
      toast.error('Workflow name required');
      return;
    }

    if (selectedWorkflow.triggers.length === 0) {
      toast.error('At least one trigger required');
      return;
    }

    if (selectedWorkflow.actions.length === 0) {
      toast.error('At least one action required');
      return;
    }

    try {
      setSaving(true);
      await onSaveWorkflow(selectedWorkflow);
      
      toast.success('Workflow saved', {
        description: `${selectedWorkflow.name} has been saved`
      });
      
      setSelectedWorkflow(null);
    } catch (error) {
      toast.error('Failed to save workflow', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (workflowId: string) => {
    try {
      setDeleting(true);
      await onDeleteWorkflow(workflowId);
      
      toast.success('Workflow deleted');
      setSelectedWorkflow(null);
    } catch (error) {
      toast.error('Failed to delete workflow');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl bg-dark-midnight border-l border-slate-gray/30 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-['Space_Grotesk'] text-2xl text-pure-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-iq-neon-green" />
            Workflow Configuration
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              Team Only
            </Badge>
          </SheetTitle>
          <SheetDescription className="text-mist-gray">
            Automate compliance responses with triggers and actions
          </SheetDescription>
        </SheetHeader>

        {!selectedWorkflow ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-mist-gray text-sm">{workflows.length} workflow{workflows.length !== 1 ? 's' : ''} configured</p>
              <Button
                onClick={handleCreateWorkflow}
                className="bubo-btn-neon-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>

            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="bubo-glass rounded-lg p-4 cursor-pointer hover:border-electric-blue/40 transition-all border"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-['Space_Grotesk'] text-pure-white">{workflow.name}</h4>
                        <Badge className={workflow.enabled ? 'bg-iq-neon-green/20 text-iq-neon-green' : 'bg-mist-gray/20 text-mist-gray'}>
                          {workflow.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-mist-gray mb-2">{workflow.description || 'No description'}</p>
                      <div className="flex items-center gap-4 text-xs text-mist-gray">
                        <span>{workflow.triggers.length} trigger{workflow.triggers.length !== 1 ? 's' : ''}</span>
                        <span>{workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {workflows.length === 0 && (
                <div className="bubo-glass rounded-xl p-12 text-center">
                  <Zap className="w-16 h-16 text-mist-gray mx-auto mb-4 opacity-50" />
                  <h3 className="font-['Space_Grotesk'] text-lg text-pure-white mb-2">
                    No Workflows Yet
                  </h3>
                  <p className="text-mist-gray text-sm">
                    Create your first automated workflow
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workflow Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={selectedWorkflow.name}
                  onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, name: e.target.value })}
                  className="bg-surface-dark border-slate-gray/30 text-cloud-white"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={selectedWorkflow.description}
                  onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, description: e.target.value })}
                  placeholder="Optional description..."
                  className="bg-surface-dark border-slate-gray/30 text-cloud-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Workflow Status</Label>
                  <p className="text-xs text-mist-gray">Enable or disable this workflow</p>
                </div>
                <Switch
                  checked={selectedWorkflow.enabled}
                  onCheckedChange={(enabled) => setSelectedWorkflow({ ...selectedWorkflow, enabled })}
                />
              </div>
            </div>

            {/* Triggers */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Triggers ({selectedWorkflow.triggers.length})</Label>
                <Button
                  onClick={handleAddTrigger}
                  size="sm"
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trigger
                </Button>
              </div>

              <div className="space-y-2">
                {selectedWorkflow.triggers.map((trigger, index) => (
                  <div key={trigger.id} className="bubo-glass rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-mist-gray">#{index + 1}</span>
                      <Select
                        value={trigger.type}
                        onValueChange={(value: any) => {
                          const updatedTriggers = [...selectedWorkflow.triggers];
                          updatedTriggers[index].type = value;
                          setSelectedWorkflow({ ...selectedWorkflow, triggers: updatedTriggers });
                        }}
                      >
                        <SelectTrigger className="flex-1 bg-surface-dark border-slate-gray/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIGGER_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleRemoveTrigger(trigger.id)}
                        size="sm"
                        variant="ghost"
                        className="text-crimson-danger hover:bg-crimson-danger/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Actions ({selectedWorkflow.actions.length})</Label>
                <Button
                  onClick={handleAddAction}
                  size="sm"
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
              </div>

              <div className="space-y-2">
                {selectedWorkflow.actions.map((action, index) => (
                  <div key={action.id} className="bubo-glass rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-mist-gray">#{index + 1}</span>
                      <Select
                        value={action.type}
                        onValueChange={(value: any) => {
                          const updatedActions = [...selectedWorkflow.actions];
                          updatedActions[index].type = value;
                          setSelectedWorkflow({ ...selectedWorkflow, actions: updatedActions });
                        }}
                      >
                        <SelectTrigger className="flex-1 bg-surface-dark border-slate-gray/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTION_TYPES.map(a => (
                            <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleRemoveAction(action.id)}
                        size="sm"
                        variant="ghost"
                        className="text-crimson-danger hover:bg-crimson-danger/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-slate-gray/30">
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedWorkflow(null)}
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  Back
                </Button>
                {selectedWorkflow.id.startsWith('wf-') === false && (
                  <Button
                    onClick={() => handleDelete(selectedWorkflow.id)}
                    disabled={deleting}
                    variant="outline"
                    className="text-crimson-danger border-crimson-danger/30 hover:bg-crimson-danger/10"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                )}
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bubo-btn-neon-primary"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};