import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Unlock, 
  Lock, 
  AlertTriangle, 
  Check,
  Brain,
  Activity,
  Zap,
  Search,
  Download,
  Globe,
  Network,
  Bell,
  FileText,
  BarChart3,
  Users,
  Ticket,
  Monitor,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { projectId } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { LoadingSpinner, ErrorState } from '../SystemStates';

interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'intelligence' | 'monitoring' | 'automation' | 'integrations' | 'analytics' | 'system';
  enabled: boolean;
  tierRequired?: 'starter' | 'pro' | 'team';
  betaStatus?: boolean;
}

interface FeatureOverride {
  // Global Overrides
  unlockAllFeatures: boolean;
  unlockAllTiers: boolean;
  disableTierChecks: boolean;
  enableBetaFeatures: boolean;
  
  // Individual Feature Controls
  features: Record<string, boolean>;
}

const BUBOIQ_FEATURES: Omit<FeatureConfig, 'enabled'>[] = [
  // Intelligence Features
  {
    id: 'bubo-intelligence',
    name: 'BuboIQ Intelligence',
    description: 'AI-powered neural network analysis and predictive insights',
    icon: Brain,
    category: 'intelligence',
    tierRequired: 'pro'
  },
  {
    id: 'signal-stream',
    name: 'Signal Stream',
    description: 'Real-time anomaly detection and threat intelligence',
    icon: Activity,
    category: 'intelligence',
    tierRequired: 'pro'
  },
  {
    id: 'iq-meter',
    name: 'IQ Meter',
    description: 'System intelligence scoring and health metrics',
    icon: Zap,
    category: 'intelligence',
    tierRequired: 'pro'
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    description: 'ML-based issue prediction and prevention',
    icon: BarChart3,
    category: 'analytics',
    tierRequired: 'team'
  },
  
  // Monitoring Features
  {
    id: 'device-discovery',
    name: 'Network Discovery',
    description: 'Automated device scanning and network mapping',
    icon: Search,
    category: 'monitoring',
    tierRequired: 'pro'
  },
  {
    id: 'device-monitoring',
    name: 'Device Monitoring',
    description: 'Real-time computer health and status tracking',
    icon: Monitor,
    category: 'monitoring'
  },
  {
    id: 'remote-access',
    name: 'Remote Access',
    description: 'Zero-trust remote access with MFA and session recording',
    icon: Network,
    category: 'monitoring',
    tierRequired: 'pro'
  },
  {
    id: 'network-topology',
    name: 'Network Topology',
    description: 'Visual network mapping and infrastructure visualization',
    icon: Network,
    category: 'monitoring',
    tierRequired: 'team'
  },
  {
    id: 'health-scoring',
    name: 'Health Scoring',
    description: 'Advanced device health analysis and risk assessment',
    icon: Activity,
    category: 'monitoring',
    tierRequired: 'pro'
  },
  
  // Automation Features
  {
    id: 'agent-deployment',
    name: 'Agent Deployment',
    description: 'Automated BuboIQ agent installation and management',
    icon: Download,
    category: 'automation',
    tierRequired: 'pro'
  },
  {
    id: 'auto-remediation',
    name: 'Auto-Remediation',
    description: 'Automated issue resolution and self-healing',
    icon: Zap,
    category: 'automation',
    tierRequired: 'team',
    betaStatus: true
  },
  {
    id: 'smart-ticketing',
    name: 'Smart Ticketing',
    description: 'AI-powered ticket creation and routing',
    icon: Ticket,
    category: 'automation',
    tierRequired: 'pro'
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Custom automation rules and triggers',
    icon: Settings,
    category: 'automation',
    tierRequired: 'team'
  },
  
  // Integration Features
  {
    id: 'integrations',
    name: 'External Integrations',
    description: 'Connect with 200+ external platforms and tools',
    icon: Globe,
    category: 'integrations',
    tierRequired: 'pro'
  },
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Full REST API access and webhooks',
    icon: Network,
    category: 'integrations',
    tierRequired: 'pro'
  },
  {
    id: 'sso',
    name: 'Single Sign-On (SSO)',
    description: 'Enterprise SSO and SAML authentication',
    icon: Shield,
    category: 'integrations',
    tierRequired: 'team'
  },
  
  // Analytics Features
  {
    id: 'advanced-reporting',
    name: 'Advanced Reporting',
    description: 'Customizable reports and data exports',
    icon: FileText,
    category: 'analytics',
    tierRequired: 'pro'
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive metrics and performance tracking',
    icon: BarChart3,
    category: 'analytics',
    tierRequired: 'pro'
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'AI-enhanced documentation and search',
    icon: FileText,
    category: 'analytics'
  },
  
  // System Features
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Multi-user access and role management',
    icon: Users,
    category: 'system',
    tierRequired: 'team'
  },
  {
    id: 'audit-logs',
    name: 'Audit Logs',
    description: 'Complete activity tracking and compliance logs',
    icon: FileText,
    category: 'system',
    tierRequired: 'team'
  },
  {
    id: 'notifications',
    name: 'Advanced Notifications',
    description: 'Multi-channel alerts and escalation policies',
    icon: Bell,
    category: 'system',
    tierRequired: 'pro'
  }
];

export const FeatureControls: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<FeatureOverride>({
    unlockAllFeatures: false,
    unlockAllTiers: false,
    disableTierChecks: false,
    enableBetaFeatures: false,
    features: {}
  });

  // Initialize feature states
  useEffect(() => {
    const initialFeatures: Record<string, boolean> = {};
    BUBOIQ_FEATURES.forEach(feature => {
      initialFeatures[feature.id] = false;
    });
    setOverrides(prev => ({
      ...prev,
      features: initialFeatures
    }));
  }, []);

  useEffect(() => {
    loadOverrides();
  }, []);

  const loadOverrides = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/feature-overrides`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        console.log('🔄 Backend offline - using local feature state');
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.overrides) {
        setOverrides(prev => ({
          ...prev,
          ...data.overrides
        }));
      }
    } catch (error) {
      console.error('Failed to load feature overrides:', error);
      console.log('🔄 Backend offline - using local feature state');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/super-admin/feature-overrides`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ overrides })
        }
      );

      if (!response.ok) {
        toast.warning('Backend offline - settings saved locally only');
        return;
      }

      toast.success('Feature overrides saved successfully');
    } catch (error) {
      console.error('Failed to save feature overrides:', error);
      toast.warning('Backend offline - settings saved locally only');
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalToggle = (key: keyof Omit<FeatureOverride, 'features'>) => {
    setOverrides(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setOverrides(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: !prev.features[featureId]
      }
    }));
  };

  const handleEnableAllInCategory = (category: string) => {
    const categoryFeatures = BUBOIQ_FEATURES.filter(f => f.category === category);
    setOverrides(prev => ({
      ...prev,
      features: {
        ...prev.features,
        ...Object.fromEntries(categoryFeatures.map(f => [f.id, true]))
      }
    }));
    toast.success(`All ${category} features enabled`);
  };

  const handleDisableAllInCategory = (category: string) => {
    const categoryFeatures = BUBOIQ_FEATURES.filter(f => f.category === category);
    setOverrides(prev => ({
      ...prev,
      features: {
        ...prev.features,
        ...Object.fromEntries(categoryFeatures.map(f => [f.id, false]))
      }
    }));
    toast.success(`All ${category} features disabled`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" message="Loading feature controls..." />
      </div>
    );
  }

  const anyGlobalEnabled = overrides.unlockAllFeatures || overrides.unlockAllTiers || 
                           overrides.disableTierChecks || overrides.enableBetaFeatures;
  const anyFeatureEnabled = Object.values(overrides.features).some(v => v);

  const categories = [
    { id: 'intelligence', name: 'Intelligence & AI', icon: Brain, color: 'iq-neon-green' },
    { id: 'monitoring', name: 'Monitoring & Discovery', icon: Monitor, color: 'electric-blue' },
    { id: 'automation', name: 'Automation', icon: Zap, color: 'amber-warning' },
    { id: 'integrations', name: 'Integrations', icon: Globe, color: 'prediction-purple' },
    { id: 'analytics', name: 'Analytics & Reporting', icon: BarChart3, color: 'electric-blue' },
    { id: 'system', name: 'System & Administration', icon: Settings, color: 'slate-gray' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Super Admin Feature Controls
        </h2>
        <p className="text-mist-gray">
          Complete control over all BuboIQ features, tier restrictions, and beta access
        </p>
      </div>

      {/* Warning Banner */}
      {(anyGlobalEnabled || anyFeatureEnabled) && (
        <Card className="bubo-glass border-amber-warning/50 bg-amber-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-warning" />
              <div>
                <p className="text-amber-warning font-medium">Feature overrides are active</p>
                <p className="text-sm text-amber-warning/70">
                  {anyGlobalEnabled ? 'Global overrides enabled' : `${Object.values(overrides.features).filter(v => v).length} individual features enabled`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Overrides */}
      <Card className="bubo-glass border-slate-gray/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-iq-neon-green" />
            Global Overrides
          </CardTitle>
          <CardDescription className="text-mist-gray">
            Master controls that affect all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unlock All Features */}
            <div className="flex items-center justify-between p-4 bg-dark-midnight/50 border border-slate-gray/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="unlock-features" className="text-white font-medium cursor-pointer">
                    Unlock All Features
                  </Label>
                  <Badge 
                    variant="outline" 
                    className={overrides.unlockAllFeatures 
                      ? "text-iq-neon-green border-iq-neon-green/30" 
                      : "text-slate-gray border-slate-gray/30"
                    }
                  >
                    {overrides.unlockAllFeatures ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-xs text-mist-gray mt-1">
                  Enable all features regardless of tier
                </p>
              </div>
              <Switch
                id="unlock-features"
                checked={overrides.unlockAllFeatures}
                onCheckedChange={() => handleGlobalToggle('unlockAllFeatures')}
                className="ml-4"
              />
            </div>

            {/* Unlock All Tiers */}
            <div className="flex items-center justify-between p-4 bg-dark-midnight/50 border border-slate-gray/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="unlock-tiers" className="text-white font-medium cursor-pointer">
                    Unlock All Tiers
                  </Label>
                  <Badge 
                    variant="outline" 
                    className={overrides.unlockAllTiers 
                      ? "text-iq-neon-green border-iq-neon-green/30" 
                      : "text-slate-gray border-slate-gray/30"
                    }
                  >
                    {overrides.unlockAllTiers ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-xs text-mist-gray mt-1">
                  Grant Pro & Team tier access
                </p>
              </div>
              <Switch
                id="unlock-tiers"
                checked={overrides.unlockAllTiers}
                onCheckedChange={() => handleGlobalToggle('unlockAllTiers')}
                className="ml-4"
              />
            </div>

            {/* Disable Tier Checks */}
            <div className="flex items-center justify-between p-4 bg-dark-midnight/50 border border-slate-gray/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="disable-tier-checks" className="text-white font-medium cursor-pointer">
                    Disable Tier Checks
                  </Label>
                  <Badge 
                    variant="outline" 
                    className={overrides.disableTierChecks 
                      ? "text-iq-neon-green border-iq-neon-green/30" 
                      : "text-slate-gray border-slate-gray/30"
                    }
                  >
                    {overrides.disableTierChecks ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-xs text-mist-gray mt-1">
                  Bypass TierGuard validation
                </p>
              </div>
              <Switch
                id="disable-tier-checks"
                checked={overrides.disableTierChecks}
                onCheckedChange={() => handleGlobalToggle('disableTierChecks')}
                className="ml-4"
              />
            </div>

            {/* Enable Beta Features */}
            <div className="flex items-center justify-between p-4 bg-dark-midnight/50 border border-slate-gray/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="enable-beta" className="text-white font-medium cursor-pointer">
                    Enable Beta Features
                  </Label>
                  <Badge 
                    variant="outline" 
                    className={overrides.enableBetaFeatures 
                      ? "text-iq-neon-green border-iq-neon-green/30" 
                      : "text-slate-gray border-slate-gray/30"
                    }
                  >
                    {overrides.enableBetaFeatures ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-xs text-mist-gray mt-1">
                  Access experimental features
                </p>
              </div>
              <Switch
                id="enable-beta"
                checked={overrides.enableBetaFeatures}
                onCheckedChange={() => handleGlobalToggle('enableBetaFeatures')}
                className="ml-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Feature Controls by Category */}
      {categories.map(category => {
        const categoryFeatures = BUBOIQ_FEATURES.filter(f => f.category === category.id);
        const enabledCount = categoryFeatures.filter(f => overrides.features[f.id]).length;
        const CategoryIcon = category.icon;

        return (
          <Card key={category.id} className="bubo-glass border-slate-gray/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${category.color}/10 rounded-lg`}>
                    <CategoryIcon className={`w-5 h-5 text-${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-white">{category.name}</CardTitle>
                    <CardDescription className="text-mist-gray">
                      {enabledCount} of {categoryFeatures.length} enabled
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnableAllInCategory(category.id)}
                    className="text-xs border-iq-neon-green/30 text-iq-neon-green hover:bg-iq-neon-green/10"
                  >
                    Enable All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisableAllInCategory(category.id)}
                    className="text-xs border-slate-gray/30 text-slate-gray hover:bg-slate-gray/10"
                  >
                    Disable All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryFeatures.map(feature => {
                  const FeatureIcon = feature.icon;
                  const isEnabled = overrides.features[feature.id];

                  return (
                    <div
                      key={feature.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isEnabled
                          ? 'bg-iq-neon-green/10 border-iq-neon-green/30'
                          : 'bg-dark-midnight/30 border-slate-gray/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <FeatureIcon className={`w-4 h-4 ${isEnabled ? 'text-iq-neon-green' : 'text-mist-gray'}`} />
                            <Label
                              htmlFor={feature.id}
                              className={`font-medium cursor-pointer ${isEnabled ? 'text-white' : 'text-mist-gray'}`}
                            >
                              {feature.name}
                            </Label>
                          </div>
                          <p className="text-xs text-mist-gray mb-2">{feature.description}</p>
                          <div className="flex items-center space-x-2">
                            {feature.tierRequired && (
                              <Badge variant="outline" className="text-xs border-electric-blue/30 text-electric-blue">
                                {feature.tierRequired}
                              </Badge>
                            )}
                            {feature.betaStatus && (
                              <Badge variant="outline" className="text-xs border-amber-warning/30 text-amber-warning">
                                Beta
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Switch
                          id={feature.id}
                          checked={isEnabled}
                          onCheckedChange={() => handleFeatureToggle(feature.id)}
                          className="ml-3"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-mist-gray">
          {Object.values(overrides.features).filter(v => v).length} features enabled
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bubo-btn-neon-primary"
        >
          {saving ? 'Saving...' : 'Save Feature Configuration'}
        </Button>
      </div>
    </div>
  );
};
