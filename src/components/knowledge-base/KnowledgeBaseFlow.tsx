import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Eye, Edit, CheckCircle, BarChart3, MessageSquare } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface KnowledgeBaseFlowProps {
  onBack: () => void;
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  details: string[];
}

interface FlowOrbProps {
  step: FlowStep;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const FlowOrb: React.FC<FlowOrbProps> = ({ step, isActive, isCompleted, onClick }) => {
  return (
    <div 
      className={`
        relative cursor-pointer transition-all duration-500 transform
        ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'}
      `}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-full blur-xl transition-all duration-500
        ${isActive ? `${step.glowColor} opacity-60` : 'opacity-0'}
      `} />
      
      {/* Main orb */}
      <div className={`
        relative w-20 h-20 rounded-full border-2 backdrop-blur-sm
        flex items-center justify-center transition-all duration-500
        ${isCompleted 
          ? 'bg-iq-neon-green/20 border-iq-neon-green text-iq-neon-green' 
          : isActive 
          ? `bg-${step.color}/20 border-${step.color} text-${step.color}` 
          : 'bg-surface-dark/50 border-mist-gray/30 text-mist-gray'
        }
        ${isActive ? 'bubo-animate-breathe' : ''}
      `}>
        {isCompleted ? <CheckCircle className="w-8 h-8" /> : step.icon}
      </div>

      {/* Pulse rings for active state */}
      {isActive && (
        <>
          <div className={`absolute inset-0 rounded-full border border-${step.color}/30 animate-ping`} />
          <div className={`absolute inset-0 rounded-full border border-${step.color}/20 animate-ping`} style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
};

export const KnowledgeBaseFlow: React.FC<KnowledgeBaseFlowProps> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const flowSteps: FlowStep[] = [
    {
      id: 'issues',
      title: 'Issues Happen',
      description: 'Problems occur and get reported by users or detected automatically',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'crimson-danger',
      glowColor: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]',
      details: [
        'Users report problems through tickets',
        'System monitors detect issues automatically',
        'Problems are captured with full context',
        'Each issue includes logs and environment data'
      ]
    },
    {
      id: 'evidence',
      title: 'Evidence Collected',
      description: 'System gathers all relevant information about the problem',
      icon: <Eye className="w-8 h-8" />,
      color: 'electric-blue',
      glowColor: 'shadow-[0_0_40px_rgba(30,144,255,0.4)]',
      details: [
        'Logs are automatically collected',
        'System configuration is captured',
        'Error messages are preserved',
        'User actions are recorded for context'
      ]
    },
    {
      id: 'draft',
      title: 'Draft Created',
      description: 'AI analyzes the evidence and creates a solution draft',
      icon: <Edit className="w-8 h-8" />,
      color: 'signal-yellow',
      glowColor: 'shadow-[0_0_40px_rgba(255,212,0,0.4)]',
      details: [
        'AI examines all collected evidence',
        'Similar past issues are identified',
        'Step-by-step solution is generated',
        'Confidence level is calculated'
      ]
    },
    {
      id: 'review',
      title: 'Human Review',
      description: 'Technical experts review and approve the solution',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'cyan-accent',
      glowColor: 'shadow-[0_0_40px_rgba(0,255,198,0.4)]',
      details: [
        'Experts review AI-generated solution',
        'Steps are verified for accuracy',
        'Risk levels are confirmed',
        'Solution is approved or rejected'
      ]
    },
    {
      id: 'published',
      title: 'Published Article',
      description: 'Approved solution becomes available to everyone',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'iq-neon-green',
      glowColor: 'shadow-[0_0_40px_rgba(0,255,133,0.4)]',
      details: [
        'Solution is added to knowledge base',
        'Article becomes searchable',
        'Users can access step-by-step fix',
        'Success tracking begins'
      ]
    },
    {
      id: 'feedback',
      title: 'Feedback Loop',
      description: 'Users provide feedback to continuously improve solutions',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'prediction-purple',
      glowColor: 'shadow-[0_0_40px_rgba(139,92,246,0.4)]',
      details: [
        'Users rate solution effectiveness',
        'Success rates are tracked',
        'Failed attempts are analyzed',
        'Articles are updated based on feedback'
      ]
    },
    {
      id: 'metrics',
      title: 'Smart Insights',
      description: 'System learns and provides insights on IT operations',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'amber-warning',
      glowColor: 'shadow-[0_0_40px_rgba(245,158,11,0.4)]',
      details: [
        'Problem patterns are identified',
        'Prevention opportunities are surfaced',
        'Team performance is measured',
        'Continuous improvement recommendations'
      ]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % flowSteps.length;
          setCompletedSteps(cs => new Set([...cs, prev]));
          return next;
        });
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, flowSteps.length]);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} className="bubo-btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button onClick={handlePlayPause} className="bubo-btn-secondary">
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Animation
          </Button>
          <Button onClick={handleReset} className="bubo-btn-ghost">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Flow Visualization */}
      <Card className="bubo-glass p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/10 to-iq-neon-green/10" />
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-space-grotesk text-4xl font-bold text-pure-white mb-4">
              How Smart Knowledge Base Works
            </h1>
            <p className="text-xl text-mist-gray max-w-3xl mx-auto leading-relaxed">
              Watch how every IT problem automatically becomes searchable knowledge that helps your entire team.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mist-gray/30 to-transparent" />
            
            {/* Flow Steps */}
            <div className="flex justify-between items-center mb-12 relative z-10">
              {flowSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-4">
                  <FlowOrb
                    step={step}
                    isActive={activeStep === index}
                    isCompleted={completedSteps.has(index)}
                    onClick={() => handleStepClick(index)}
                  />
                  
                  {/* Connecting Arrows */}
                  {index < flowSteps.length - 1 && (
                    <div className={`
                      absolute top-10 transition-all duration-500
                      ${completedSteps.has(index) || activeStep > index 
                        ? 'text-iq-neon-green' 
                        : 'text-mist-gray/30'
                      }
                    `} style={{ left: `${((index + 1) * 100 / flowSteps.length) - 4}%` }}>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                  
                  <div className="text-center max-w-32">
                    <h3 className="font-space-grotesk font-semibold text-pure-white text-sm mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-mist-gray line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Step Details */}
      <Card className="bubo-glass p-8 border-prediction-purple/30">
        <div className="flex items-start space-x-6">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            bg-${flowSteps[activeStep].color}/20 border border-${flowSteps[activeStep].color}/30
            text-${flowSteps[activeStep].color}
          `}>
            {flowSteps[activeStep].icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="font-space-grotesk text-2xl font-bold text-pure-white">
                {flowSteps[activeStep].title}
              </h2>
              <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30">
                Step {activeStep + 1} of {flowSteps.length}
              </Badge>
            </div>
            
            <p className="text-lg text-mist-gray mb-6 leading-relaxed">
              {flowSteps[activeStep].description}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {flowSteps[activeStep].details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full mt-2 flex-shrink-0" />
                  <p className="text-cloud-white leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bubo-glass p-6 border-iq-neon-green/20">
          <div className="w-12 h-12 bg-iq-neon-green/20 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-iq-neon-green" />
          </div>
          <h3 className="font-space-grotesk font-semibold text-pure-white mb-2">
            Continuous Learning
          </h3>
          <p className="text-mist-gray">
            Every problem solved automatically becomes searchable knowledge for the entire team.
          </p>
        </Card>

        <Card className="bubo-glass p-6 border-electric-blue/20">
          <div className="w-12 h-12 bg-electric-blue/20 rounded-2xl flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-electric-blue" />
          </div>
          <h3 className="font-space-grotesk font-semibold text-pure-white mb-2">
            Quality Assurance
          </h3>
          <p className="text-mist-gray">
            Human experts review AI-generated solutions to ensure accuracy and safety.
          </p>
        </Card>

        <Card className="bubo-glass p-6 border-prediction-purple/20">
          <div className="w-12 h-12 bg-prediction-purple/20 rounded-2xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-prediction-purple" />
          </div>
          <h3 className="font-space-grotesk font-semibold text-pure-white mb-2">
            Performance Tracking
          </h3>
          <p className="text-mist-gray">
            Success rates and user feedback continuously improve solution quality.
          </p>
        </Card>
      </div>
    </div>
  );
};