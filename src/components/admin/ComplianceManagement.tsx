import React from 'react';
import { FileText, ShieldCheck, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';

export const ComplianceManagement = () => {
  return (
     <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Compliance & Security</h2>
        <p className="text-mist-gray">Manage global security policies and compliance frameworks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-iq-neon-green" />
                <h3 className="text-lg font-bold text-white">Security Baselines</h3>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Enforce MFA Globally</div>
                      <div className="text-xs text-mist-gray">Require 2FA for all tenant admins</div>
                   </div>
                   <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Session Timeout</div>
                      <div className="text-xs text-mist-gray">Force logout after 15 minutes of inactivity</div>
                   </div>
                   <Switch checked={true} />
                </div>
                 <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">Strong Password Policy</div>
                      <div className="text-xs text-mist-gray">Min 12 chars, complexity requirements</div>
                   </div>
                   <Switch checked={true} />
                </div>
             </div>
          </Card>

          <Card className="bg-dark-midnight/40 border-slate-gray/30 p-6">
             <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-amber-warning" />
                <h3 className="text-lg font-bold text-white">Compliance Frameworks</h3>
             </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">HIPAA Mode</div>
                      <div className="text-xs text-mist-gray">Enable PHI scanning and masking</div>
                   </div>
                   <Switch />
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">PCI-DSS Compliance</div>
                      <div className="text-xs text-mist-gray">Credit card data detection and alerting</div>
                   </div>
                   <Switch />
                </div>
                 <div className="flex items-center justify-between">
                   <div>
                      <div className="text-white font-medium">GDPR Controls</div>
                      <div className="text-xs text-mist-gray">Cookie consent and data portability tools</div>
                   </div>
                   <Switch checked={true} />
                </div>
             </div>
          </Card>
      </div>
     </div>
  );
};
