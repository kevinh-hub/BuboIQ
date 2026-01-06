import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle2, FileText, Send, Users, Clock, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceIncidentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: IncidentData) => Promise<void>;
  type: 'breach' | 'phi_exposure' | 'cardholder_data' | 'security_event';
}

interface IncidentData {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_systems: string[];
  affected_users_count: number;
  discovery_method: string;
  discovery_timestamp: string;
  containment_status: 'uncontained' | 'partial' | 'contained';
  notification_required: boolean;
  regulatory_frameworks: string[];
  initial_assessment: string;
}

const STEPS = [
  { id: 'detection', title: 'Detection', icon: AlertTriangle },
  { id: 'assessment', title: 'Assessment', icon: FileText },
  { id: 'containment', title: 'Containment', icon: CheckCircle2 },
  { id: 'notification', title: 'Notification', icon: Users },
];

export const ComplianceIncidentWizard: React.FC<ComplianceIncidentWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<IncidentData>>({
    type,
    severity: 'medium',
    affected_systems: [],
    affected_users_count: 0,
    containment_status: 'uncontained',
    notification_required: false,
    regulatory_frameworks: [],
    discovery_timestamp: new Date().toISOString(),
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(formData as IncidentData);
      toast.success('Incident created', {
        description: 'All actions logged to audit trail'
      });
      onClose();
      setCurrentStep(0);
      setFormData({
        type,
        severity: 'medium',
        affected_systems: [],
        affected_users_count: 0,
        containment_status: 'uncontained',
        notification_required: false,
        regulatory_frameworks: [],
        discovery_timestamp: new Date().toISOString(),
      });
    } catch (error) {
      toast.error('Failed to create incident', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Detection
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Incident Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the incident"
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={formData.severity}
                onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minimal Impact</SelectItem>
                  <SelectItem value="medium">Medium - Moderate Impact</SelectItem>
                  <SelectItem value="high">High - Significant Impact</SelectItem>
                  <SelectItem value="critical">Critical - Severe Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discovery_method">Discovery Method</Label>
              <Select
                value={formData.discovery_method || ''}
                onValueChange={(value) => setFormData({ ...formData, discovery_method: value })}
              >
                <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                  <SelectValue placeholder="How was this discovered?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automated_scan">Automated Security Scan</SelectItem>
                  <SelectItem value="user_report">User Report</SelectItem>
                  <SelectItem value="audit_review">Audit Review</SelectItem>
                  <SelectItem value="external_notification">External Notification</SelectItem>
                  <SelectItem value="anomaly_detection">AI Anomaly Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the incident..."
                rows={4}
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
              />
            </div>
          </div>
        );

      case 1: // Assessment
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="affected_users">Affected Users Count</Label>
              <Input
                id="affected_users"
                type="number"
                value={formData.affected_users_count || 0}
                onChange={(e) => setFormData({ ...formData, affected_users_count: parseInt(e.target.value) || 0 })}
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
              />
            </div>

            <div>
              <Label>Regulatory Frameworks</Label>
              <div className="space-y-2 mt-2">
                {['HIPAA', 'PCI-DSS', 'SOC 2', 'GDPR', 'CCPA'].map((framework) => (
                  <label key={framework} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.regulatory_frameworks?.includes(framework)}
                      onChange={(e) => {
                        const frameworks = formData.regulatory_frameworks || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, regulatory_frameworks: [...frameworks, framework] });
                        } else {
                          setFormData({ ...formData, regulatory_frameworks: frameworks.filter(f => f !== framework) });
                        }
                      }}
                      className="rounded border-slate-gray/30"
                    />
                    <span className="text-sm text-cloud-white">{framework}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="initial_assessment">Initial Assessment</Label>
              <Textarea
                id="initial_assessment"
                value={formData.initial_assessment || ''}
                onChange={(e) => setFormData({ ...formData, initial_assessment: e.target.value })}
                placeholder="Initial impact assessment and scope..."
                rows={4}
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
              />
            </div>
          </div>
        );

      case 2: // Containment
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="containment_status">Containment Status</Label>
              <Select
                value={formData.containment_status}
                onValueChange={(value: any) => setFormData({ ...formData, containment_status: value })}
              >
                <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uncontained">Uncontained - Active Threat</SelectItem>
                  <SelectItem value="partial">Partial - Mitigation in Progress</SelectItem>
                  <SelectItem value="contained">Contained - Threat Neutralized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bubo-glass rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-warning mt-1" />
                <div>
                  <h4 className="font-['Space_Grotesk'] text-pure-white mb-1">Timeline Tracking</h4>
                  <p className="text-sm text-mist-gray">
                    Time since discovery: {Math.floor((Date.now() - new Date(formData.discovery_timestamp || Date.now()).getTime()) / 1000 / 60)} minutes
                  </p>
                  <p className="text-xs text-mist-gray mt-1">
                    HIPAA requires breach notification within 60 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Notification
        return (
          <div className="space-y-4">
            <div>
              <Label>Notification Required</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.notification_required}
                    onChange={(e) => setFormData({ ...formData, notification_required: e.target.checked })}
                    className="rounded border-slate-gray/30"
                  />
                  <span className="text-sm text-cloud-white">Regulatory notification required</span>
                </label>
              </div>
            </div>

            {formData.notification_required && (
              <div className="bubo-glass-bright rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-iq-neon-green mt-1" />
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-pure-white mb-2">Notification Requirements</h4>
                    <ul className="text-sm text-cloud-white space-y-1">
                      {formData.regulatory_frameworks?.includes('HIPAA') && (
                        <li>• HIPAA: Notify HHS within 60 days if 500+ affected</li>
                      )}
                      {formData.regulatory_frameworks?.includes('PCI-DSS') && (
                        <li>• PCI-DSS: Notify card brands immediately</li>
                      )}
                      {formData.regulatory_frameworks?.includes('GDPR') && (
                        <li>• GDPR: Notify DPA within 72 hours</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bubo-glass rounded-xl p-4">
              <h4 className="font-['Space_Grotesk'] text-pure-white mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist-gray">Severity:</span>
                  <Badge className={
                    formData.severity === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
                    formData.severity === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
                    'bg-signal-blue/20 text-signal-blue'
                  }>
                    {formData.severity?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Affected Users:</span>
                  <span className="text-pure-white">{formData.affected_users_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Frameworks:</span>
                  <span className="text-pure-white">{formData.regulatory_frameworks?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-dark-midnight border-slate-gray/30">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
            Compliance Incident Wizard
          </DialogTitle>
          <DialogDescription className="text-mist-gray">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${index <= currentStep 
                      ? 'bg-iq-neon-green/20 border-iq-neon-green text-iq-neon-green' 
                      : 'bg-surface-dark border-slate-gray/30 text-mist-gray'}
                  `}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-mist-gray mt-1">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-iq-neon-green' : 'bg-slate-gray/30'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-gray/30">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outline"
            className="bubo-btn-ghost"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.title}
              className="bubo-btn-neon-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Incident
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!formData.title}
              className="bubo-btn-neon-primary"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
