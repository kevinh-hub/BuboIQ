import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Zap, 
  Brain, 
  BarChart3, 
  Users, 
  AlertTriangle,
  Lock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { PlanBadge } from './PlanBadge';
import { UpgradeModal } from './UpgradeModal';

interface DashboardPreviewProps {
  userPlan: 'basic' | 'pro';
  userId?: string;
  onUpgrade?: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  userPlan = 'basic',
  userId,
  onUpgrade 
}) => {
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    feature: 'automation' | 'ai-triage' | 'analytics' | 'integrations' | null;
  }>({
    isOpen: false,
    feature: null
  });

  const openUpgradeModal = (feature: 'automation' | 'ai-triage' | 'analytics' | 'integrations') => {
    // Track feature blocked event
    if ((window as any).gtag) {
      (window as any).gtag('event', 'feature_blocked_pro', {
        feature,
        user_id: userId
      });
    }

    setUpgradeModal({ isOpen: true, feature });
  };

  const closeUpgradeModal = () => {
    setUpgradeModal({ isOpen: false, feature: null });
  };

  const ProLockedCard: React.FC<{
    title: string;
    description: string;
    feature: 'automation' | 'ai-triage' | 'analytics' | 'integrations';
    icon: React.ElementType;
    children?: React.ReactNode;
  }> = ({ title, description, feature, icon: Icon, children }) => {
    const isLocked = userPlan === 'basic';

    return (
      <Card className={`p-6 relative transition-all duration-300 ${
        isLocked 
          ? 'bubo-glass border-mist-gray/30 opacity-75' 
          : 'bubo-glass border-iq-neon-green/20 hover:border-iq-neon-green/40'
      }`}>
        {isLocked && (
          <>
            {/* Pro Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                Pro unlocks this
              </Badge>
            </div>
            
            {/* Lock Overlay */}
            <div className="absolute inset-0 bg-neural-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="text-center">
                <Lock className="w-8 h-8 text-iq-neon-green mx-auto mb-2" />
                <p className="text-sm text-pure-white mb-3">Available in Pro</p>
                <Button
                  onClick={() => openUpgradeModal(feature)}
                  className="bubo-btn-neon-primary text-sm px-4 py-2"
                  size="sm"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLocked 
              ? 'bg-mist-gray/20' 
              : 'bg-iq-neon-green/20'
          }`}>
            <Icon className={`w-5 h-5 ${
              isLocked ? 'text-mist-gray' : 'text-iq-neon-green'
            }`} />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">{title}</h3>
            <p className="text-sm text-mist-gray">{description}</p>
          </div>
        </div>

        {children}

        {isLocked && (
          <div className="mt-4 p-3 bg-iq-neon-green/10 border border-iq-neon-green/20 rounded-xl">
            <div className="flex items-center space-x-2 text-iq-neon-green text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Unlock foresight & speed</span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Account Plan Indicator */}
      <div className="flex items-center justify-between">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
          Dashboard Overview
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-mist-gray">Plan:</span>
          <PlanBadge variant={userPlan} />
          {userPlan === 'basic' && (
            <Button
              onClick={onUpgrade}
              className="bubo-btn-ghost text-sm px-3 py-1"
              size="sm"
            >
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Tickets - Always Available */}
        <Card className="bubo-glass border-iq-neon-green/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Active Tickets</h3>
              <p className="text-sm text-mist-gray">Current open issues</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-pure-white mb-2">24</div>
          <div className="flex items-center space-x-2 text-sm text-iq-neon-green">
            <TrendingUp className="w-4 h-4" />
            <span>3 resolved today</span>
          </div>
        </Card>

        {/* SLA Analytics - Pro Feature */}
        <ProLockedCard
          title="SLA Analytics"
          description="Real-time compliance tracking"
          feature="analytics"
          icon={BarChart3}
        >
          {userPlan === 'pro' ? (
            <>
              <div className="text-3xl font-bold text-pure-white mb-2">94%</div>
              <div className="flex items-center space-x-2 text-sm text-iq-neon-green">
                <Clock className="w-4 h-4" />
                <span>On-time resolution</span>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-8 bg-mist-gray/20 rounded animate-pulse"></div>
              <div className="h-4 bg-mist-gray/20 rounded animate-pulse w-2/3"></div>
            </div>
          )}
        </ProLockedCard>

        {/* Automation Rules - Pro Feature */}
        <ProLockedCard
          title="Automation Rules"
          description="Active workflow automations"
          feature="automation"
          icon={Zap}
        >
          {userPlan === 'pro' ? (
            <>
              <div className="text-3xl font-bold text-pure-white mb-2">12</div>
              <div className="flex items-center space-x-2 text-sm text-iq-neon-green">
                <Zap className="w-4 h-4" />
                <span>Rules active</span>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-8 bg-mist-gray/20 rounded animate-pulse"></div>
              <div className="h-4 bg-mist-gray/20 rounded animate-pulse w-1/2"></div>
            </div>
          )}
        </ProLockedCard>

        {/* AI Triage Queue - Pro Feature */}
        <ProLockedCard
          title="AI Triage Queue"
          description="Intelligent ticket prioritization"
          feature="ai-triage"
          icon={Brain}
        >
          {userPlan === 'pro' ? (
            <>
              <div className="text-3xl font-bold text-pure-white mb-2">8</div>
              <div className="flex items-center space-x-2 text-sm text-amber-warning">
                <AlertTriangle className="w-4 h-4" />
                <span>High priority</span>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-8 bg-mist-gray/20 rounded animate-pulse"></div>
              <div className="h-4 bg-mist-gray/20 rounded animate-pulse w-3/4"></div>
            </div>
          )}
        </ProLockedCard>
      </div>

      {/* Larger Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team Performance - Pro Feature */}
        <ProLockedCard
          title="Team Performance"
          description="Deep analytics and insights"
          feature="analytics"
          icon={Users}
        >
          {userPlan === 'pro' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Avg Resolution Time</span>
                <span className="text-sm font-medium text-iq-neon-green">2.4h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Customer Satisfaction</span>
                <span className="text-sm font-medium text-iq-neon-green">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mist-gray">Fixed on first contact</span>
                <span className="text-sm font-medium text-iq-neon-green">76%</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-mist-gray/20 rounded w-1/2"></div>
                <div className="h-4 bg-mist-gray/20 rounded w-1/4"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-mist-gray/20 rounded w-2/3"></div>
                <div className="h-4 bg-mist-gray/20 rounded w-1/4"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-mist-gray/20 rounded w-1/2"></div>
                <div className="h-4 bg-mist-gray/20 rounded w-1/4"></div>
              </div>
            </div>
          )}
        </ProLockedCard>

        {/* Integrations Hub - Pro Feature */}
        <ProLockedCard
          title="Integrations Hub"
          description="Connected tools and services"
          feature="integrations"
          icon={Activity}
        >
          {userPlan === 'pro' ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-iq-neon-green/20 rounded"></div>
                <span className="text-sm text-cloud-white">Slack</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-electric-blue/20 rounded"></div>
                <span className="text-sm text-cloud-white">Jira</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-amber-warning/20 rounded"></div>
                <span className="text-sm text-cloud-white">Datadog</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  Active
                </Badge>
              </div>
              <div className="text-center pt-2">
                <span className="text-xs text-mist-gray">+197 more available</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-mist-gray/20 rounded"></div>
                <span className="text-sm text-mist-gray">Slack</span>
                <Badge className="bg-mist-gray/20 text-mist-gray border-mist-gray/30 text-xs">
                  Available
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-mist-gray/20 rounded"></div>
                <span className="text-sm text-mist-gray">Email</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  Active
                </Badge>
              </div>
              <div className="text-center pt-2">
                <span className="text-xs text-mist-gray">2 integrations included</span>
              </div>
            </div>
          )}
        </ProLockedCard>
      </div>

      {/* Upgrade Modal */}
      {upgradeModal.feature && (
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={closeUpgradeModal}
          feature={upgradeModal.feature}
          userId={userId}
        />
      )}
    </div>
  );
};