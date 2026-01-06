import React, { useState } from 'react';
import { Shield, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../ui/alert-dialog";

interface FeatureControlCardProps {
  onViewAll: () => void;
  environment?: string;
  onOverrideChange?: (hasActiveOverrides: boolean) => void;
}

export const FeatureControlCard: React.FC<FeatureControlCardProps> = ({ 
  onViewAll, 
  environment = 'production',
  onOverrideChange 
}) => {
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({});
  const [pendingOverride, setPendingOverride] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const features = [
    { id: 'guided-fixes', label: 'Guided Fixes', enabled: true },
    { id: 'kb-auto', label: 'Self-Building KB', enabled: true },
    { id: 'remote', label: 'BuboIQ Connect', enabled: true, highlight: true },
    { id: 'compliance', label: 'Compliance Suite', enabled: false },
    { id: 'ai-signals', label: 'AI Predictions', enabled: true },
  ];

  const overrides = [
    { id: 'unlock-features', label: 'Unlock all features', danger: true, desc: 'Enables every feature flag regardless of plan.' },
    { id: 'unlock-tiers', label: 'Unlock all tiers', danger: false, desc: 'Simulates Enterprise tier for all orgs.' },
    { id: 'disable-tierguard', label: 'Disable TierGuard checks', danger: true, desc: 'Bypasses all backend entitlement checks.' },
    { id: 'enable-beta', label: 'Enable beta features', danger: false, desc: 'Activates experimental features globally.' },
  ];

  const handleOverrideToggle = (id: string, isDanger: boolean) => {
    const willEnable = !activeOverrides[id];
    
    if (willEnable && isDanger && environment === 'production') {
      setPendingOverride(id);
      setShowConfirmDialog(true);
    } else {
      toggleOverride(id, willEnable);
    }
  };

  const toggleOverride = (id: string, enabled: boolean) => {
    const newOverrides = { ...activeOverrides, [id]: enabled };
    setActiveOverrides(newOverrides);
    
    // Check if any danger overrides are active
    const hasDangerActive = Object.entries(newOverrides).some(([key, value]) => {
      const override = overrides.find(o => o.id === key);
      return value && override?.danger;
    });
    
    if (onOverrideChange) {
      onOverrideChange(hasDangerActive);
    }
  };

  const confirmOverride = () => {
    if (pendingOverride) {
      toggleOverride(pendingOverride, true);
      setPendingOverride(null);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Card className="bubo-glass border-slate-gray/30 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-gray/30 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-iq-neon-green" />
            <h3 className="text-lg font-space-grotesk font-bold text-white">Feature Controls</h3>
          </div>
          <p className="text-sm text-mist-gray">
            Turn major product capabilities on/off at a global level.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-mist-gray hover:text-white"
          onClick={onViewAll}
        >
          Manage All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 flex-1">
        {/* Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-3 bg-dark-midnight/50 rounded-lg border border-slate-gray/20">
              <span className={`text-sm font-medium ${feature.highlight ? 'text-iq-neon-green' : 'text-white'}`}>
                {feature.label}
              </span>
              <Switch checked={feature.enabled} />
            </div>
          ))}
        </div>

        {/* Override Mode */}
        <div className={`bg-crimson-danger/5 border transition-colors duration-300 rounded-xl p-4 ${
          Object.values(activeOverrides).some(v => v) ? 'border-crimson-danger bg-crimson-danger/10' : 'border-crimson-danger/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${Object.values(activeOverrides).some(v => v) ? 'text-crimson-danger animate-pulse' : 'text-crimson-danger'}`} />
              <span className="text-sm font-bold text-crimson-danger uppercase tracking-wider">Override Mode</span>
            </div>
            <span className="text-[10px] text-crimson-danger bg-crimson-danger/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              {environment === 'production' && <AlertTriangle className="w-3 h-3" />}
              Affects All Orgs
            </span>
          </div>
          
          <div className="space-y-3">
            <TooltipProvider>
              {overrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${override.danger ? 'text-white font-medium' : 'text-mist-gray'}`}>
                      {override.label}
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-slate-gray hover:text-white transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-midnight border-slate-gray text-white text-xs">
                        <p>{override.desc}</p>
                        {override.danger && (
                          <p className="text-crimson-danger mt-1 font-bold">Dangerous action in {environment}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch 
                    checked={!!activeOverrides[override.id]}
                    onCheckedChange={() => handleOverrideToggle(override.id, override.danger)}
                    className="data-[state=checked]:bg-crimson-danger"
                  />
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-midnight border-slate-gray text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-crimson-danger flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirm global override in Production
            </AlertDialogTitle>
            <AlertDialogDescription className="text-mist-gray">
              You are about to enable <strong>{overrides.find(o => o.id === pendingOverride)?.label}</strong> in the <strong>Production</strong> environment.
              <br /><br />
              This will immediately affect <strong>all organizations</strong> and bypass standard restrictions. This action will be logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-gray text-white hover:bg-slate-gray/20">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmOverride}
              className="bg-crimson-danger text-white hover:bg-crimson-danger/90 border-none"
            >
              Confirm Override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
