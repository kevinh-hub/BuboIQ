import React, { useState, useEffect } from 'react';
import { Eye, Brain, CheckCircle, Zap, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 'observe',
    icon: <Eye className="w-8 h-8" />,
    title: 'Observe',
    description: 'Agent monitors your ticket queue and device telemetry',
    color: 'info'
  },
  {
    id: 'reason',
    icon: <Brain className="w-8 h-8" />,
    title: 'Reason',
    description: 'AI analyzes patterns and predicts root causes with confidence scores',
    color: 'accent'
  },
  {
    id: 'approve',
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Approve',
    description: 'Review AI recommendations and approve safe actions',
    color: 'warn'
  },
  {
    id: 'execute',
    icon: <Zap className="w-8 h-8" />,
    title: 'Execute',
    description: 'Signed webhooks trigger device actions with rollback protection',
    color: 'success'
  }
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const colorMap = {
    info: 'bg-info/20 border-info/30 text-info',
    accent: 'bg-accent/20 border-accent/30 text-accent',
    warn: 'bg-warn/20 border-warn/30 text-warn',
    success: 'bg-success/20 border-success/30 text-success'
  };

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-space-grotesk text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-text-400 max-w-2xl mx-auto">
            From chaos to clarity in four steps. Watch the analyst loop in action.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <div key={step.id} className="relative">
                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-accent' : 'text-text-600'
                    }`} />
                  </div>
                )}

                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-full panel p-6 transition-all duration-300 ${
                    isActive 
                      ? 'border-accent shadow-[0_0_30px_rgba(0,255,133,0.2)] scale-105' 
                      : 'border-[color:rgb(var(--border-analyst))] hover:border-accent/50'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2 transition-all ${
                    isActive 
                      ? colorMap[step.color] + ' scale-110'
                      : isCompleted
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-bg-850 border-[color:rgb(var(--border-analyst))] text-text-600'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-lg font-space-grotesk text-white mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-text-400">
                    {step.description}
                  </p>
                </button>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
