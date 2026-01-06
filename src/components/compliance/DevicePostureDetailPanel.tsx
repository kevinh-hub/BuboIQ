import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DevicePostureDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  device: {
    id: string;
    name: string;
    type: string;
    os: string;
    posture_score: number;
    last_check: string;
    compliance_status: 'compliant' | 'non_compliant' | 'warning';
    checks: PostureCheck[];
  };
  onRescan?: (deviceId: string) => Promise<void>;
  onCreateIssue?: (deviceId: string, check: PostureCheck) => Promise<void>;
}

interface PostureCheck {
  id: string;
  category: 'antivirus' | 'firewall' | 'encryption' | 'patches' | 'password';
  name: string;
  status: 'pass' | 'fail' | 'warning';
  value: string;
  expected: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  last_checked: string;
}

const CATEGORY_ICONS = {
  antivirus: Shield,
  firewall: Shield,
  encryption: Shield,
  patches: RefreshCw,
  password: Shield,
};

const CATEGORY_LABELS = {
  antivirus: 'Antivirus Protection',
  firewall: 'Firewall Status',
  encryption: 'Disk Encryption',
  patches: 'Security Patches',
  password: 'Password Policy',
};

export const DevicePostureDetailPanel: React.FC<DevicePostureDetailPanelProps> = ({
  isOpen,
  onClose,
  device,
  onRescan,
  onCreateIssue
}) => {
  const [rescanning, setRescanning] = React.useState(false);

  const handleRescan = async () => {
    if (!onRescan) return;
    
    try {
      setRescanning(true);
      await onRescan(device.id);
      toast.success('Device rescanned', {
        description: 'Posture checks updated successfully'
      });
    } catch (error) {
      toast.error('Rescan failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setRescanning(false);
    }
  };

  const handleCreateIssue = async (check: PostureCheck) => {
    if (!onCreateIssue) return;

    try {
      await onCreateIssue(device.id, check);
      toast.success('Issue created', {
        description: `Tracking remediation for ${check.name}`
      });
    } catch (error) {
      toast.error('Failed to create issue', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const failedChecks = device.checks.filter(c => c.status === 'fail');
  const warningChecks = device.checks.filter(c => c.status === 'warning');
  const passedChecks = device.checks.filter(c => c.status === 'pass');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-iq-neon-green';
      case 'non_compliant': return 'text-crimson-danger';
      case 'warning': return 'text-amber-warning';
      default: return 'text-mist-gray';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Compliant</Badge>;
      case 'non_compliant':
        return <Badge className="bg-crimson-danger/20 text-crimson-danger">Non-Compliant</Badge>;
      case 'warning':
        return <Badge className="bg-amber-warning/20 text-amber-warning">Warning</Badge>;
      default:
        return <Badge className="bg-slate-gray/20 text-mist-gray">Unknown</Badge>;
    }
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-iq-neon-green" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-crimson-danger" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-warning" />;
      default:
        return <Clock className="w-5 h-5 text-mist-gray" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-dark-midnight border-l border-slate-gray/30 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
            Device Posture Details
          </SheetTitle>
          <SheetDescription className="text-mist-gray">
            Security compliance status for {device.name}
          </SheetDescription>
        </SheetHeader>

        {/* Device Info */}
        <div className="bubo-glass rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg text-pure-white mb-1">
                {device.name}
              </h3>
              <p className="text-sm text-mist-gray">{device.type} • {device.os}</p>
            </div>
            {getStatusBadge(device.compliance_status)}
          </div>

          {/* Posture Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Posture Score</span>
              <span className={`font-medium ${getStatusColor(device.compliance_status)}`}>
                {device.posture_score}%
              </span>
            </div>
            <Progress value={device.posture_score} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-gray/30">
            <div className="text-center">
              <div className="text-2xl font-['Space_Grotesk'] text-iq-neon-green mb-1">
                {passedChecks.length}
              </div>
              <div className="text-xs text-mist-gray">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-['Space_Grotesk'] text-amber-warning mb-1">
                {warningChecks.length}
              </div>
              <div className="text-xs text-mist-gray">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-['Space_Grotesk'] text-crimson-danger mb-1">
                {failedChecks.length}
              </div>
              <div className="text-xs text-mist-gray">Failed</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-gray/30 text-sm">
            <div className="flex items-center space-x-2 text-mist-gray">
              <Clock className="w-4 h-4" />
              <span>Last checked: {new Date(device.last_check).toLocaleString()}</span>
            </div>
            <Button
              onClick={handleRescan}
              disabled={rescanning}
              size="sm"
              variant="outline"
              className="bubo-btn-ghost"
            >
              {rescanning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rescan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Posture Checks */}
        <div className="space-y-4">
          <h4 className="font-['Space_Grotesk'] text-lg text-pure-white">Security Checks</h4>

          {/* Failed Checks First */}
          {failedChecks.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm text-crimson-danger font-medium">Failed Checks ({failedChecks.length})</h5>
              {failedChecks.map((check) => (
                <CheckCard
                  key={check.id}
                  check={check}
                  onCreateIssue={() => handleCreateIssue(check)}
                  getCheckIcon={getCheckIcon}
                />
              ))}
            </div>
          )}

          {/* Warning Checks */}
          {warningChecks.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm text-amber-warning font-medium">Warnings ({warningChecks.length})</h5>
              {warningChecks.map((check) => (
                <CheckCard
                  key={check.id}
                  check={check}
                  onCreateIssue={() => handleCreateIssue(check)}
                  getCheckIcon={getCheckIcon}
                />
              ))}
            </div>
          )}

          {/* Passed Checks */}
          {passedChecks.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm text-iq-neon-green font-medium">Passed Checks ({passedChecks.length})</h5>
              {passedChecks.map((check) => (
                <CheckCard
                  key={check.id}
                  check={check}
                  getCheckIcon={getCheckIcon}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface CheckCardProps {
  check: PostureCheck;
  onCreateIssue?: () => void;
  getCheckIcon: (status: string) => React.ReactNode;
}

const CheckCard: React.FC<CheckCardProps> = ({ check, onCreateIssue, getCheckIcon }) => {
  const CategoryIcon = CATEGORY_ICONS[check.category];

  return (
    <div className={`
      bubo-glass rounded-lg p-4 border
      ${check.status === 'fail' ? 'border-crimson-danger/30 bg-crimson-danger/5' : ''}
      ${check.status === 'warning' ? 'border-amber-warning/30 bg-amber-warning/5' : ''}
      ${check.status === 'pass' ? 'border-iq-neon-green/30 bg-iq-neon-green/5' : ''}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <CategoryIcon className="w-5 h-5 text-mist-gray mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h5 className="font-['Space_Grotesk'] text-pure-white">{check.name}</h5>
              {getCheckIcon(check.status)}
            </div>
            <p className="text-xs text-mist-gray">{CATEGORY_LABELS[check.category]}</p>
          </div>
        </div>
        {check.status !== 'pass' && (
          <Badge className={
            check.severity === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
            check.severity === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
            'bg-signal-blue/20 text-signal-blue'
          }>
            {check.severity}
          </Badge>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-mist-gray">Current:</span>
          <span className="text-cloud-white font-['JetBrains_Mono']">{check.value}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mist-gray">Expected:</span>
          <span className="text-cloud-white font-['JetBrains_Mono']">{check.expected}</span>
        </div>
      </div>

      {check.status !== 'pass' && check.remediation && (
        <div className="mt-3 pt-3 border-t border-slate-gray/30">
          <p className="text-xs text-mist-gray mb-2">Remediation:</p>
          <p className="text-sm text-cloud-white">{check.remediation}</p>
          {onCreateIssue && (
            <Button
              onClick={onCreateIssue}
              size="sm"
              variant="outline"
              className="mt-3 bubo-btn-ghost w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Create Issue
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
