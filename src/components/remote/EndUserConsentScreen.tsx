import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Monitor, 
  Eye, 
  FileDown, 
  Shield, 
  Clock, 
  User, 
  Video,
  MousePointer,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface ConsentScreenProps {
  onGrant?: () => void;
  onDeny?: () => void;
  technician?: {
    name: string;
    company: string;
  };
  device?: {
    hostname: string;
  };
  permissions?: {
    viewScreen: boolean;
    controlInput: boolean;
    transferFiles: boolean;
  };
}

const EndUserConsentScreen: React.FC<ConsentScreenProps> = ({
  onGrant,
  onDeny,
  technician = { name: "Kevin from BuboIQ", company: "BuboIQ Support" },
  device = { hostname: "WS-JENNIFER-PC" },
  permissions = { viewScreen: true, controlInput: true, transferFiles: false }
}) => {
  const [userPermissions, setUserPermissions] = useState(permissions);
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const handlePermissionChange = (permission: keyof typeof userPermissions, value: boolean) => {
    setUserPermissions(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  const isValidSelection = userPermissions.viewScreen; // At minimum, view screen must be allowed

  return (
    <div className="min-h-screen bg-dark-midnight flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-iq-neon-green" />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-2">
            Remote Support Request
          </h1>
          <p className="text-mist-gray">
            A technician is requesting access to provide remote assistance
          </p>
        </div>

        {/* Main Consent Card */}
        <Card className="bubo-glass p-8 mb-6">
          {/* Request Details */}
          <div className="mb-8">
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-pure-white mb-4">
              Support Request Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-surface-dark/30 rounded-lg">
                <User className="w-5 h-5 text-iq-neon-green" />
                <div>
                  <p className="font-medium text-cloud-white">{technician.name}</p>
                  <p className="text-sm text-mist-gray">{technician.company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-surface-dark/30 rounded-lg">
                <Monitor className="w-5 h-5 text-cyan-accent" />
                <div>
                  <p className="font-medium text-cloud-white">Target Device</p>
                  <p className="text-sm text-mist-gray">{device.hostname}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-surface-dark/30 rounded-lg">
                <Clock className="w-5 h-5 text-signal-yellow" />
                <div>
                  <p className="font-medium text-cloud-white">Session Duration</p>
                  <p className="text-sm text-mist-gray">Estimated: 15-30 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-pure-white mb-4">
              Requested Permissions
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-iq-neon-green" />
                  <div>
                    <Label className="text-cloud-white font-medium">View Screen</Label>
                    <p className="text-sm text-mist-gray">Technician can see your desktop</p>
                  </div>
                </div>
                <Switch 
                  checked={userPermissions.viewScreen}
                  onCheckedChange={(checked) => handlePermissionChange('viewScreen', checked)}
                  disabled // This is typically required
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <MousePointer className="w-5 h-5 text-cyan-accent" />
                  <div>
                    <Label className="text-cloud-white font-medium">Control Input</Label>
                    <p className="text-sm text-mist-gray">Technician can control mouse and keyboard</p>
                  </div>
                </div>
                <Switch 
                  checked={userPermissions.controlInput}
                  onCheckedChange={(checked) => handlePermissionChange('controlInput', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-dark/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5 text-signal-yellow" />
                  <div>
                    <Label className="text-cloud-white font-medium">Transfer Files</Label>
                    <p className="text-sm text-mist-gray">Technician can upload/download files</p>
                  </div>
                </div>
                <Switch 
                  checked={userPermissions.transferFiles}
                  onCheckedChange={(checked) => handlePermissionChange('transferFiles', checked)}
                />
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="mb-8 p-4 bg-iq-green/10 border border-iq-green/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-iq-green mt-0.5" />
              <div>
                <h4 className="font-medium text-iq-green mb-2">Security & Privacy</h4>
                <ul className="text-sm text-cloud-white space-y-1">
                  <li className="flex items-center gap-2">
                    <Video className="w-3 h-3 text-iq-green" />
                    Session will be recorded for quality and security purposes
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-iq-green" />
                    Watermark with timestamp will be visible during session
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-iq-green" />
                    Sensitive information will be automatically masked
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Watermark Preview */}
          <div className="mb-8">
            <h4 className="font-['Space_Grotesk'] font-medium text-pure-white mb-3">
              Watermark Preview
            </h4>
            <div className="bg-dark-midnight/50 rounded-lg p-6 border-2 border-dashed border-slate-gray/30 relative">
              <p className="text-center text-mist-gray text-sm mb-4">
                This watermark will appear on your screen during the session:
              </p>
              <div className="absolute top-2 right-2 opacity-60">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  BuboIQ • {new Date().toLocaleString()}
                </Badge>
              </div>
              <div className="h-20 bg-gradient-to-br from-surface-dark/30 to-slate-gray/20 rounded-lg flex items-center justify-center">
                <Monitor className="w-8 h-8 text-mist-gray" />
              </div>
            </div>
          </div>

          {/* Legal Agreement */}
          <div className="mb-8 p-4 bg-surface-dark/20 rounded-lg">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={hasReadTerms}
                onChange={(e) => setHasReadTerms(e.target.checked)}
                className="mt-1 accent-iq-neon-green"
              />
              <Label htmlFor="terms" className="text-sm text-cloud-white cursor-pointer">
                I have read and agree to the{' '}
                <button className="text-iq-neon-green hover:underline inline-flex items-center gap-1">
                  Remote Support Terms
                  <ExternalLink className="w-3 h-3" />
                </button>
                {' '}and understand that this session will be recorded.
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onGrant}
              disabled={!isValidSelection || !hasReadTerms}
              className="bubo-btn-neon-primary flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
            
            <Button 
              onClick={onDeny}
              className="bubo-btn-secondary flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Deny Access
            </Button>
          </div>

          {!isValidSelection && (
            <div className="mt-4 p-3 bg-amber-warning/10 border border-amber-warning/30 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-warning" />
                <p className="text-sm text-amber-warning">
                  Screen viewing permission is required for remote support
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-mist-gray">
          <p>
            This session is secured by BuboIQ Remote Support • 
            <button className="text-iq-neon-green hover:underline ml-1">
              Learn more about our security practices
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { EndUserConsentScreen };