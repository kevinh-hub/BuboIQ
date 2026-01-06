import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Wrench, FileText, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CaseStudyBlockProps {
  onNavigate?: (page: string) => void;
}

export const CaseStudyBlock: React.FC<CaseStudyBlockProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const timelineSteps = [
    {
      time: '10:02 AM',
      action: 'Ticket #214 auto-created',
      description: 'Windows Update KB5029351 detected',
      status: 'created',
      icon: <FileText className="w-4 h-4" />
    },
    {
      time: '10:03 AM',
      action: 'Rolled back update',
      description: 'Safe rollback initiated automatically',
      status: 'fixing',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      time: '10:05 AM',
      action: 'Printing restored',
      description: 'All printer services operational',
      status: 'resolved',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      time: '10:06 AM',
      action: 'Playbook updated',
      description: 'KB5029351 added to known issues',
      status: 'learned',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timelineSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineSteps.length]);

  const handlePlayDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-nocturne-indigo/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Real-World Example: Windows Update Crisis
          </h2>
          <p className="text-lg text-mist-gray max-w-3xl mx-auto">
            See how BuboIQ handles a common IT nightmare automatically
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story Block */}
          <div className="bubo-glass rounded-3xl p-8">
            <div className="mb-8">
              <div className="w-16 h-16 bg-crimson-danger/20 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                <AlertTriangle className="w-8 h-8 text-crimson-danger" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-4">
                The Problem
              </h3>
              <p className="text-mist-gray leading-relaxed mb-6">
                When a Windows Update breaks printers or slows systems, BuboIQ auto-creates a ticket, 
                rolls it back safely, and restores service. If outside help is needed, it routes a 
                structured vendor ticket with logs.
              </p>
              <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl p-4">
                <p className="text-iq-neon-green font-medium">
                  Next time, BuboIQ resolves instantly—no repeat headaches.
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <Button 
                onClick={() => onNavigate?.('features')}
                className="bubo-btn-neon-primary mr-4 mb-4"
              >
                See More Examples
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={handlePlayDemo}
                className="bubo-btn-secondary"
                disabled={isPlaying}
              >
                {isPlaying ? 'Playing...' : 'Play Demo'}
              </Button>
            </div>
          </div>

          {/* Timeline UI */}
          <div className="space-y-4">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-6 text-center lg:text-left">
              Timeline: 4 minutes to fix
            </h3>
            
            {timelineSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-iq-neon-green/10 border border-iq-neon-green/30' 
                    : 'bg-surface-dark/50 border border-mist-gray/20'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep 
                      ? 'bg-iq-neon-green/20 text-iq-neon-green' 
                      : 'bg-mist-gray/20 text-mist-gray'
                  }`}>
                    {step.icon}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${
                      index <= currentStep ? 'text-pure-white' : 'text-mist-gray'
                    }`}>
                      {step.action}
                    </h4>
                    <span className={`text-sm font-mono ${
                      index <= currentStep ? 'text-iq-neon-green' : 'text-mist-gray'
                    }`}>
                      {step.time}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    index <= currentStep ? 'text-cloud-white' : 'text-mist-gray'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {index <= currentStep && (
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                  </div>
                )}
              </div>
            ))}

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-mist-gray mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / timelineSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-surface-dark rounded-full h-2">
                <div 
                  className="bg-iq-neon-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / timelineSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};