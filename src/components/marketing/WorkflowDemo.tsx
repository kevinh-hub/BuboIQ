import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Brain, Zap, Ticket, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const workflowSteps = [
  {
    id: 'signal',
    icon: <Eye className="w-8 h-8" />,
    title: 'Problem Detection',
    description: 'BuboIQ watches all your computers for any problems',
    color: 'text-signal-blue',
    bgColor: 'bg-signal-blue/10',
    borderColor: 'border-signal-blue/30'
  },
  {
    id: 'incident',
    icon: <Zap className="w-8 h-8" />,
    title: 'Problem Grouping',
    description: 'Groups related problems together so you see the big picture',
    color: 'text-amber-warning',
    bgColor: 'bg-amber-warning/10',
    borderColor: 'border-amber-warning/30'
  },
  {
    id: 'analysis',
    icon: <Brain className="w-8 h-8" />,
    title: 'Smart Analysis',
    description: 'Figures out what happened, who it affects, and how to fix it',
    color: 'text-prediction-purple',
    bgColor: 'bg-prediction-purple/10',
    borderColor: 'border-prediction-purple/30'
  },
  {
    id: 'ticket',
    icon: <Ticket className="w-8 h-8" />,
    title: 'Smart Ticketing',
    description: 'Real problems get sent to the right person with all the details',
    color: 'text-cyan-accent',
    bgColor: 'bg-cyan-accent/10',
    borderColor: 'border-cyan-accent/30'
  },
  {
    id: 'resolution',
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Resolution',
    description: 'Problems get solved faster with clear information and deadlines',
    color: 'text-iq-neon-green',
    bgColor: 'bg-iq-neon-green/10',
    borderColor: 'border-iq-neon-green/30'
  },
  {
    id: 'learning',
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Continuous Learning',
    description: 'Gets smarter by remembering what worked for similar problems',
    color: 'text-glow-cyan',
    bgColor: 'bg-glow-cyan/10',
    borderColor: 'border-glow-cyan/30'
  }
];

export const WorkflowDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length);
  };

  const handleStepClick = (stepId: string) => {
    setSelectedStep(selectedStep === stepId ? null : stepId);
  };

  return (
    <div className="space-y-8">
      {/* Workflow Visualization */}
      <div className="relative">
        {/* Flow Line */}
        <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-signal-blue via-iq-neon-green to-glow-cyan opacity-50" />
        
        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {workflowSteps.map((step, index) => (
            <Card
              key={step.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                index === currentStep 
                  ? `${step.bgColor} ${step.borderColor} bubo-glow-green` 
                  : 'bubo-glass border-slate-gray/30 hover:border-slate-gray/50'
              }`}
              onClick={() => handleStepClick(step.id)}
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-dark-midnight border-2 border-slate-gray rounded-full flex items-center justify-center text-xs font-bold text-pure-white">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`${step.color} mb-3`}>
                {step.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-pure-white mb-2 text-sm">{step.title}</h3>
              <p className="text-mist-gray text-xs">{step.description}</p>
              
              {/* Active indicator */}
              {index === currentStep && (
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      <div className="flex justify-center space-x-4">
        <Button onClick={prevStep} className="bubo-btn-ghost">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button onClick={nextStep} className="bubo-btn-neon-primary">
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Step Details Popover */}
      {selectedStep && (
        <Card className="bubo-glass p-6 border-iq-neon-green/30">
          {(() => {
            const step = workflowSteps.find(s => s.id === selectedStep)!;
            return (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`${step.color}`}>{step.icon}</div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">{step.title}</h3>
                </div>
                <p className="text-mist-gray">{step.description}</p>
                <div className="mt-4 p-4 bg-nocturne-indigo/50 rounded-xl">
                  <p className="text-cloud-white text-sm">
                    {step.id === 'signal' && "Monitors servers, applications, networks, and user reports in real-time through integrations with monitoring tools, ticketing systems, and direct notifications."}
                    {step.id === 'incident' && "Groups related problems by time, affected systems, error patterns, and user impact to prevent duplicate tickets and identify broader issues."}
                    {step.id === 'analysis' && "Applies machine learning to assess severity, predict impact, suggest solutions, and estimate resolution time based on historical data."}
                    {step.id === 'ticket' && "Creates properly structured tickets with complete context, correct priority, and intelligent routing to the most qualified available team member."}
                    {step.id === 'resolution' && "Provides engineers with full incident context, suggested solutions, affected user counts, and proactive SLA monitoring to ensure timely resolution."}
                    {step.id === 'learning' && "Captures fix patterns, successful solutions, and team performance to continuously improve prediction accuracy and automation capabilities."}
                  </p>
                </div>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};