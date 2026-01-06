import React from 'react';
import { ArrowRight, Home, CreditCard, Zap, Brain, BarChart3, CheckCircle, MousePointer, Eye } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export const UpgradeJourneyFlowMap: React.FC = () => {
  const FlowNode: React.FC<{
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    type: 'page' | 'modal' | 'action' | 'success';
    color?: 'green' | 'blue' | 'amber' | 'purple';
  }> = ({ icon: Icon, title, subtitle, type, color = 'green' }) => {
    const getColorClasses = () => {
      switch (color) {
        case 'blue':
          return 'border-electric-blue/30 bg-electric-blue/10 text-electric-blue';
        case 'amber':
          return 'border-amber-warning/30 bg-amber-warning/10 text-amber-warning';
        case 'purple':
          return 'border-prediction-purple/30 bg-prediction-purple/10 text-prediction-purple';
        default:
          return 'border-iq-neon-green/30 bg-iq-neon-green/10 text-iq-neon-green';
      }
    };

    const getTypeIndicator = () => {
      switch (type) {
        case 'modal':
          return 'Modal';
        case 'action':
          return 'Action';
        case 'success':
          return 'Success';
        default:
          return 'Page';
      }
    };

    return (
      <div className="flex flex-col items-center">
        <div className={`w-20 h-20 rounded-2xl border-2 ${getColorClasses()} flex items-center justify-center mb-2 transition-all duration-300 hover:scale-105`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h4 className="font-['Space_Grotesk'] font-bold text-pure-white text-sm">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-mist-gray mt-1">{subtitle}</p>
          )}
          <Badge className={`mt-1 text-xs ${getColorClasses()}`}>
            {getTypeIndicator()}
          </Badge>
        </div>
      </div>
    );
  };

  const FlowArrow: React.FC<{ label?: string; color?: string }> = ({ 
    label, 
    color = 'text-iq-neon-green' 
  }) => (
    <div className="flex flex-col items-center mx-4">
      <ArrowRight className={`w-6 h-6 ${color}`} />
      {label && (
        <span className="text-xs text-mist-gray mt-1 text-center whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <Card className="bubo-glass p-8">
      <div className="mb-8">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
          Upgrade Journey Flow Map
        </h2>
        <p className="text-mist-gray">
          Three conversion paths from Basic to Pro
        </p>
      </div>

      <div className="space-y-12">
        {/* Flow A: Marketing → Upgrade */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
              <span className="text-iq-neon-green font-bold text-sm">A</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
              Marketing → Upgrade
            </h3>
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              Direct Conversion
            </Badge>
          </div>

          <div className="flex items-center justify-start overflow-x-auto pb-4">
            <FlowNode 
              icon={Home} 
              title="Home Page" 
              subtitle="Hero CTAs"
              type="page"
            />
            <FlowArrow label="CTA Click" />
            <FlowNode 
              icon={CreditCard} 
              title="Pricing Page" 
              subtitle="Compare plans"
              type="page"
              color="blue"
            />
            <FlowArrow label="Pro CTA" />
            <FlowNode 
              icon={CheckCircle} 
              title="BookDemo Modal" 
              subtitle="Preselect=pro"
              type="modal"
              color="amber"
            />
            <FlowArrow label="Confirm" />
            <FlowNode 
              icon={CheckCircle} 
              title="Upgrade Success" 
              subtitle="Pro unlocked"
              type="success"
              color="purple"
            />
          </div>
        </div>

        {/* Flow B: In-App → Upgrade */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-electric-blue/20 rounded-lg flex items-center justify-center">
              <span className="text-electric-blue font-bold text-sm">B</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
              In-App → Upgrade
            </h3>
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
              Feature-Triggered
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-center justify-start overflow-x-auto pb-4">
              <FlowNode 
                icon={BarChart3} 
                title="Dashboard" 
                subtitle="Basic user"
                type="page"
                color="blue"
              />
              <FlowArrow label="Click Pro feature" />
              <FlowNode 
                icon={Zap} 
                title="UpgradeModal" 
                subtitle="Contextual: automation"
                type="modal"
                color="amber"
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-start overflow-x-auto pb-4 ml-8">
              <FlowNode 
                icon={CreditCard} 
                title="Pricing Page" 
                subtitle="Pro preselected"
                type="page"
              />
              <FlowArrow label="Pricing CTA" />
              <FlowNode 
                icon={CheckCircle} 
                title="BookDemo Modal" 
                subtitle="Upgrade flow"
                type="modal"
                color="amber"
              />
              <FlowArrow label="Confirm" />
              <FlowNode 
                icon={CheckCircle} 
                title="Upgrade Success" 
                subtitle="Features unlocked"
                type="success"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Flow C: Frictionless Nudge */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-amber-warning/20 rounded-lg flex items-center justify-center">
              <span className="text-amber-warning font-bold text-sm">C</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
              Frictionless Nudge
            </h3>
            <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
              Soft Conversion
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-center justify-start overflow-x-auto pb-4">
              <FlowNode 
                icon={BarChart3} 
                title="Dashboard" 
                subtitle="Basic user"
                type="page"
                color="blue"
              />
              <FlowArrow label="Hover Pro feature" />
              <FlowNode 
                icon={Eye} 
                title="Tooltip" 
                subtitle="Explains value"
                type="action"
                color="amber"
              />
              <FlowArrow label="Soft CTA" />
              <FlowNode 
                icon={CreditCard} 
                title="Pricing Page" 
                subtitle="Pro highlighted"
                type="page"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Events Legend */}
      <div className="mt-12 pt-8 border-t border-iq-neon-green/20">
        <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-4">
          Analytics Events Tracked
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <h5 className="text-iq-neon-green font-medium">Feature Interaction</h5>
            <p className="text-mist-gray text-xs">feature_blocked_pro</p>
            <p className="text-mist-gray text-xs">tooltip_pro_feature_view</p>
          </div>
          <div className="space-y-1">
            <h5 className="text-electric-blue font-medium">Upgrade Intent</h5>
            <p className="text-mist-gray text-xs">begin_upgrade_flow</p>
            <p className="text-mist-gray text-xs">tooltip_upgrade_click</p>
          </div>
          <div className="space-y-1">
            <h5 className="text-amber-warning font-medium">Pricing View</h5>
            <p className="text-mist-gray text-xs">view_pricing_from_modal</p>
            <p className="text-mist-gray text-xs">select_plan</p>
          </div>
          <div className="space-y-1">
            <h5 className="text-prediction-purple font-medium">Conversion</h5>
            <p className="text-mist-gray text-xs">upgrade_success</p>
            <p className="text-mist-gray text-xs">upgrade_completed</p>
          </div>
        </div>
      </div>
    </Card>
  );
};