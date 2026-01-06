import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Eye, 
  Video, 
  Clock, 
  Database, 
  Globe, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Download,
  Webhook,
  Lock,
  Timer,
  UserCheck,
  FileText
} from 'lucide-react';

const RemotePoliciesSettings: React.FC = () => {
  const [policies, setPolicies] = useState({
    requireConsent: true,
    watermark: true,
    mandatoryRecording: true,
    redactionRules: true,
    maxDuration: 120, // minutes
    idleAutoEnd: 15, // minutes
    retentionDays: 90,
    legalHold: false,
    dataResidency: 'US',
    siemWebhook: '',
    exportEnabled: false
  });

  const handlePolicyChange = (key: string, value: any) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
  };

  const retentionOptions = [
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
    { value: 365, label: '1 year' },
    { value: 2555, label: '7 years (compliance)' }
  ];

  const dataResidencyOptions = [
    { value: 'US', label: 'United States' },
    { value: 'EU', label: 'European Union' },
    { value: 'APAC', label: 'Asia Pacific' },
    { value: 'CA', label: 'Canada' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-iq-neon-green" />
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
            Remote Session Policies
          </h1>
        </div>
        <p className="text-mist-gray">
          Set up security, compliance, and data rules for remote support sessions
        </p>
      </div>

      {/* Session Security */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-iq-neon-green" />
          Session Security
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-iq-neon-green" />
                <Label className="text-cloud-white font-medium">Require End-User Consent</Label>
              </div>
              <p className="text-sm text-mist-gray">
                End users must explicitly approve remote access before sessions can begin
              </p>
            </div>
            <Switch 
              checked={policies.requireConsent}
              onCheckedChange={(checked) => handlePolicyChange('requireConsent', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-cyan-accent" />
                <Label className="text-cloud-white font-medium">Session Watermarking</Label>
              </div>
              <p className="text-sm text-mist-gray">
                Show company name and time overlay during remote sessions
              </p>
            </div>
            <Switch 
              checked={policies.watermark}
              onCheckedChange={(checked) => handlePolicyChange('watermark', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-crimson-danger" />
                <Label className="text-cloud-white font-medium">Mandatory Recording</Label>
                <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30 text-xs">
                  Required
                </Badge>
              </div>
              <p className="text-sm text-mist-gray">
                All remote sessions must be recorded for compliance and training
              </p>
            </div>
            <Switch 
              checked={policies.mandatoryRecording}
              disabled
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-signal-yellow" />
                <Label className="text-cloud-white font-medium">Sensitive Data Redaction</Label>
              </div>
              <p className="text-sm text-mist-gray">
                Auto-detect and blur sensitive info (passwords, SSNs, etc.)
              </p>
            </div>
            <Switch 
              checked={policies.redactionRules}
              onCheckedChange={(checked) => handlePolicyChange('redactionRules', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Session Limits */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-6 flex items-center gap-2">
          <Timer className="w-5 h-5 text-iq-neon-green" />
          Session Limits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-cloud-white font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-accent" />
              Maximum Session Duration
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={policies.maxDuration}
                onChange={(e) => handlePolicyChange('maxDuration', parseInt(e.target.value))}
                className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                min="30"
                max="480"
              />
              <span className="text-mist-gray text-sm">minutes</span>
            </div>
            <p className="text-xs text-mist-gray mt-1">
              Sessions auto-end after this time
            </p>
          </div>

          <div>
            <Label className="text-cloud-white font-medium mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4 text-signal-yellow" />
              Idle Auto-End
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={policies.idleAutoEnd}
                onChange={(e) => handlePolicyChange('idleAutoEnd', parseInt(e.target.value))}
                className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
                min="5"
                max="60"
              />
              <span className="text-mist-gray text-sm">minutes</span>
            </div>
            <p className="text-xs text-mist-gray mt-1">
              End sessions when no activity is detected
            </p>
          </div>
        </div>
      </Card>

      {/* Data Retention */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-iq-neon-green" />
          Data Retention & Storage
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-cloud-white font-medium mb-2">Retention Period</Label>
              <Select 
                value={policies.retentionDays.toString()} 
                onValueChange={(value) => handlePolicyChange('retentionDays', parseInt(value))}
              >
                <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {retentionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-mist-gray mt-1">
                How long session data is stored before automatic deletion
              </p>
            </div>

            <div>
              <Label className="text-cloud-white font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-accent" />
                Data Residency
              </Label>
              <Select 
                value={policies.dataResidency} 
                onValueChange={(value) => handlePolicyChange('dataResidency', value)}
              >
                <SelectTrigger className="bg-surface-dark/50 border-slate-gray/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataResidencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-mist-gray mt-1">
                Geographic region where session data is stored
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-amber-warning" />
                <Label className="text-cloud-white font-medium">Legal Hold</Label>
                <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30 text-xs">
                  Override
                </Badge>
              </div>
              <p className="text-sm text-mist-gray">
                Prevent automatic deletion for legal or compliance requirements
              </p>
            </div>
            <Switch 
              checked={policies.legalHold}
              onCheckedChange={(checked) => handlePolicyChange('legalHold', checked)}
            />
          </div>
        </div>
      </Card>

      {/* SIEM Integration */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-6 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-iq-neon-green" />
          SIEM Integration & Export
        </h2>

        <div className="space-y-6">
          <div>
            <Label className="text-cloud-white font-medium mb-2">SIEM Webhook URL</Label>
            <Input
              placeholder="https://your-siem.company.com/webhooks/buboiq"
              value={policies.siemWebhook}
              onChange={(e) => handlePolicyChange('siemWebhook', e.target.value)}
              className="bg-surface-dark/50 border-slate-gray/30 text-pure-white"
            />
            <p className="text-xs text-mist-gray mt-1">
              Real-time session events will be forwarded to this endpoint
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-signal-yellow" />
                <Label className="text-cloud-white font-medium">Signed Log Export</Label>
              </div>
              <p className="text-sm text-mist-gray">
                Enable cryptographically signed audit log exports for compliance
              </p>
            </div>
            <Switch 
              checked={policies.exportEnabled}
              onCheckedChange={(checked) => handlePolicyChange('exportEnabled', checked)}
            />
          </div>

          {policies.exportEnabled && (
            <div className="p-4 bg-iq-green/10 border border-iq-green/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-iq-green" />
                <span className="text-sm font-medium text-iq-green">Export Configuration</span>
              </div>
              <p className="text-xs text-mist-gray mb-3">
                Audit logs will be signed with your organization's private key and exported daily
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cloud-white">Export Format:</span>
                  <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                    JSON-LD + JWS
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cloud-white">Schedule:</span>
                  <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
                    Daily at 02:00 UTC
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cloud-white">Delivery:</span>
                  <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                    SFTP + Email
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Compliance Summary */}
      <Card className="bubo-glass p-6 border-iq-green/30">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-iq-green" />
          Compliance Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-iq-green/10 rounded-lg">
            <CheckCircle className="w-8 h-8 text-iq-green mx-auto mb-2" />
            <p className="text-sm font-medium text-iq-green">GDPR Ready</p>
            <p className="text-xs text-mist-gray">EU data residency enabled</p>
          </div>

          <div className="text-center p-4 bg-iq-green/10 rounded-lg">
            <Shield className="w-8 h-8 text-iq-green mx-auto mb-2" />
            <p className="text-sm font-medium text-iq-green">SOC 2 Type II</p>
            <p className="text-xs text-mist-gray">Security controls verified</p>
          </div>

          <div className="text-center p-4 bg-iq-green/10 rounded-lg">
            <FileText className="w-8 h-8 text-iq-green mx-auto mb-2" />
            <p className="text-sm font-medium text-iq-green">HIPAA Compliant</p>
            <p className="text-xs text-mist-gray">Healthcare data protected</p>
          </div>
        </div>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-3">
        <Button className="bubo-btn-secondary">
          <Settings className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button className="bubo-btn-neon-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Policy Changes
        </Button>
      </div>
    </div>
  );
};

export { RemotePoliciesSettings };