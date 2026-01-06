import React, { useState } from 'react';
import { Play, ArrowLeft, ExternalLink, Clock, Users, Target, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OwlEyeOrb } from './OwlEyeOrb';
import { SignalStreamDemo } from './demos/SignalStreamDemo';
import { SLARiskDemo } from './demos/SLARiskDemo';
import { IncidentRoomDemo } from './demos/IncidentRoomDemo';
import { SmartTicketingDemo } from './demos/SmartTicketingDemo';

interface DemoPageProps {
  onNavigate: (page: string) => void;
}

type DemoType = 'overview' | 'signal-stream' | 'sla-risk' | 'incident-room' | 'smart-ticketing';

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('overview');
  const [completedDemos, setCompletedDemos] = useState<Set<DemoType>>(new Set());

  const demoSteps = [
    {
      id: 'signal-stream' as DemoType,
      title: 'Alert Stream & Problem Detection',
      description: 'See how BuboIQ turns messy alerts into organized incidents',
      icon: <Zap className="w-6 h-6" />,
      duration: '3 min',
      difficulty: 'Beginner',
      component: SignalStreamDemo
    },
    {
      id: 'sla-risk' as DemoType,
      title: 'SLA risk prediction',
      description: 'See how we predict and prevent SLA breaches before they happen',
      icon: <Target className="w-6 h-6" />,
      duration: '2 min',
      difficulty: 'Intermediate',
      component: SLARiskDemo
    },
    {
      id: 'incident-room' as DemoType,
      title: 'Incident room collaboration',
      description: 'See real-time team work during critical incidents',
      icon: <Users className="w-6 h-6" />,
      duration: '4 min',
      difficulty: 'Expert',
      component: IncidentRoomDemo
    },
    {
      id: 'smart-ticketing' as DemoType,
      title: 'Smart issue routing',
      description: 'Watch AI routing assign issues to the best team member',
      icon: <ArrowRight className="w-6 h-6" />,
      duration: '2 min',
      difficulty: 'Intermediate',
      component: SmartTicketingDemo
    }
  ];

  const handleDemoComplete = (demoId: DemoType) => {
    setCompletedDemos(prev => new Set(prev).add(demoId));
  };

  const getNextRecommendedDemo = () => {
    const uncompletedDemos = demoSteps.filter(demo => !completedDemos.has(demo.id));
    return uncompletedDemos[0]?.id || 'signal-stream';
  };

  const renderCurrentDemo = () => {
    if (currentDemo === 'overview') {
      return (
        <div className="space-y-12">
          {/* Demo Journey Progress */}
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
                Your Demo Journey
              </h3>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                {completedDemos.size} of {demoSteps.length} completed
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {demoSteps.map((demo, index) => {
                const isCompleted = completedDemos.has(demo.id);
                const isRecommended = demo.id === getNextRecommendedDemo();
                
                return (
                  <div
                    key={demo.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isCompleted 
                        ? 'bg-iq-neon-green/10 border-iq-neon-green/30' 
                        : isRecommended
                        ? 'bg-cyan-accent/10 border-cyan-accent/30 bubo-animate-pulse-glow'
                        : 'bg-slate-gray/10 border-slate-gray/30 hover:border-cyan-accent/20'
                    }`}
                    onClick={() => setCurrentDemo(demo.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-iq-neon-green/20 text-iq-neon-green' 
                          : isRecommended
                          ? 'bg-cyan-accent/20 text-cyan-accent'
                          : 'bg-slate-gray/20 text-mist-gray'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : demo.icon}
                      </div>
                      
                      <div>
                        <h4 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                          {demo.title}
                        </h4>
                        <p className="text-sm text-mist-gray">{demo.description}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-cyan-accent">⏱ {demo.duration}</span>
                          <span className="text-xs text-signal-yellow">● {demo.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isRecommended && (
                        <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30 text-xs">
                          Recommended
                        </Badge>
                      )}
                      <ArrowRight className="w-5 h-5 text-mist-gray" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Quick Start Guide */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
              How to Get the Most from These Demos
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-iq-neon-green font-bold">1</span>
                </div>
                <h4 className="font-medium text-pure-white mb-2">Start Simple</h4>
                <p className="text-sm text-mist-gray">Begin with Alert Stream to understand core concepts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-cyan-accent font-bold">2</span>
                </div>
                <h4 className="font-medium text-pure-white mb-2">Interact Freely</h4>
                <p className="text-sm text-mist-gray">Click, select, and experiment with all controls</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-signal-yellow/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-signal-yellow font-bold">3</span>
                </div>
                <h4 className="font-medium text-pure-white mb-2">Think Real-World</h4>
                <p className="text-sm text-mist-gray">Consider how each feature applies to your IT challenges</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    const currentDemoStep = demoSteps.find(demo => demo.id === currentDemo);
    if (!currentDemoStep) return null;

    const DemoComponent = currentDemoStep.component;
    
    return (
      <div className="space-y-6">
        {/* Demo Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
              {currentDemoStep.title}
            </h2>
            <p className="text-mist-gray">{currentDemoStep.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
              {currentDemoStep.duration}
            </Badge>
            <Button
              onClick={() => {
                handleDemoComplete(currentDemo);
                setCurrentDemo('overview');
              }}
              className="bubo-btn-ghost"
            >
              Mark Complete
            </Button>
          </div>
        </div>
        
        {/* Demo Content */}
        <Card className="bubo-glass p-0 overflow-hidden">
          <DemoComponent />
        </Card>
        
        {/* Demo Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentDemo('overview')}
            className="bubo-btn-ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="flex space-x-3">
            {demoSteps.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setCurrentDemo(demo.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  demo.id === currentDemo
                    ? 'bg-iq-neon-green'
                    : completedDemos.has(demo.id)
                    ? 'bg-cyan-accent'
                    : 'bg-slate-gray/50 hover:bg-mist-gray'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            onClick={() => onNavigate('home')}
            className="bubo-btn-ghost mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <OwlEyeOrb size={80} className="bubo-animate-float" />
            </div>
            
            <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-6">
              Experience BuboIQ
              <span className="text-iq-neon-green bubo-neon-text-green"> Live</span>
            </h1>
            
            <p className="text-xl text-mist-gray mb-8 max-w-3xl mx-auto">
              Get hands-on with interactive demos that show exactly how BuboIQ transforms IT operations. 
              No setup required—just click and explore.
            </p>
            
            {currentDemo === 'overview' && (
              <Button
                onClick={() => setCurrentDemo(getNextRecommendedDemo())}
                className="bubo-btn-neon-primary text-lg px-8 py-4"
              >
                Start Your Demo Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Demo Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {renderCurrentDemo()}
        </div>
      </section>

      {/* Next Steps CTA */}
      {completedDemos.size >= 2 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-iq-neon-green/10 to-cyan-accent/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-iq-neon-green/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-iq-neon-green" />
              </div>
            </div>
            
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
              Great Progress! Ready for the Real Thing?
            </h2>
            <p className="text-xl text-mist-gray mb-8">
              You've explored the core features. Now see BuboIQ configured for your specific environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bubo-btn-neon-primary text-lg px-8 py-4">
                Book Personalized Demo
                <Users className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={() => onNavigate('pricing')} className="bubo-btn-secondary text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Demo Insights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bubo-glass p-8">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-6 text-center">
              What You've Discovered
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-iq-neon-green" />
                </div>
                <div className="text-xl font-bold text-iq-neon-green">Faster Resolution</div>
                <p className="text-mist-gray">Intelligent alert grouping reduces problem-solving time</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-cyan-accent/20 rounded-xl flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-cyan-accent" />
                </div>
                <div className="text-xl font-bold text-cyan-accent">Predictive Insights</div>
                <p className="text-mist-gray">Smart analytics help prevent SLA breaches</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-signal-yellow/20 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-signal-yellow" />
                </div>
                <div className="text-xl font-bold text-signal-yellow">Better Collaboration</div>
                <p className="text-mist-gray">Streamlined team coordination during incidents</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};