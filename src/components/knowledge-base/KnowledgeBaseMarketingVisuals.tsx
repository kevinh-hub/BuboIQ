import React, { useState, useEffect } from 'react';
import { Search, Eye, Lock, PlayCircle, CheckCircle, Target, BarChart3, ArrowRight, Zap, Edit, MessageSquare, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';

// Export-ready marketing visuals for the Knowledge Base
export const KnowledgeBaseMarketingVisuals: React.FC = () => {
  const [animatedMetric, setAnimatedMetric] = useState(0);
  const [orbConfidence, setOrbConfidence] = useState(45);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    // Animate the metric counter
    const interval = setInterval(() => {
      setAnimatedMetric(prev => prev < 87 ? prev + 2 : 87);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate the learning orb transition
    const learningInterval = setInterval(() => {
      setIsLearning(true);
      setTimeout(() => {
        setOrbConfidence(prev => Math.min(95, prev + 10));
        setIsLearning(false);
      }, 1500);
    }, 4000);

    return () => clearInterval(learningInterval);
  }, []);

  const ConfidenceOrb: React.FC<{ confidence: number; size?: string; animated?: boolean }> = ({ 
    confidence, 
    size = 'w-6 h-6',
    animated = true 
  }) => {
    const getOrbColor = (conf: number) => {
      if (conf >= 80) return 'text-iq-neon-green shadow-[0_0_20px_rgba(0,255,133,0.6)]';
      if (conf >= 60) return 'text-signal-yellow shadow-[0_0_20px_rgba(255,212,0,0.6)]';
      return 'text-crimson-danger shadow-[0_0_20px_rgba(239,68,68,0.6)]';
    };

    return (
      <div className={`${size} relative`}>
        <div 
          className={`
            ${size} rounded-full ${getOrbColor(confidence)}
            ${animated ? 'bubo-animate-breathe' : ''}
            border-2 border-current/30 bg-current/20 backdrop-blur-sm
            flex items-center justify-center
          `}
        >
          <div className={`w-2 h-2 rounded-full bg-current ${animated ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark-midnight bubo-neural-bg p-8 space-y-12">
      {/* 1. Hero Dashboard - Big Knowledge Base search bar with glowing orbs */}
      <Card className="bubo-glass p-12 relative overflow-hidden border-prediction-purple/30">
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/15 to-iq-neon-green/15" />
        <div className="absolute top-6 right-6 flex space-x-3">
          <ConfidenceOrb confidence={92} size="w-8 h-8" />
          <ConfidenceOrb confidence={78} size="w-6 h-6" />
          <ConfidenceOrb confidence={85} size="w-4 h-4" />
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="font-space-grotesk text-5xl font-bold text-pure-white mb-6">
            Smart Knowledge Base
          </h1>
          <p className="text-xl text-mist-gray mb-12 max-w-3xl mx-auto">
            Ask questions in plain English. Get step-by-step solutions instantly.
          </p>
          
          {/* Large cinematic search bar */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/30 to-iq-neon-green/30 rounded-3xl blur-2xl" />
            <div className="relative flex items-center">
              <Search className="absolute left-8 w-8 h-8 text-prediction-purple z-10" />
              <Input
                type="text"
                placeholder="Fix Windows printing when jobs are stuck..."
                value="Fix Windows printing when jobs are stuck"
                readOnly
                className="pl-20 pr-40 py-8 text-xl bg-surface-dark/90 border-prediction-purple/50 
                         focus:border-iq-neon-green/80 focus:shadow-[0_0_40px_rgba(0,255,133,0.3)]
                         rounded-3xl font-medium backdrop-blur-sm text-pure-white"
              />
              <Button className="absolute right-3 bubo-btn-neon-primary px-8 py-4 text-lg">
                <Zap className="w-6 h-6 mr-3" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Fix Card in Action - Issue page showing locked One-Click Fix with Upgrade CTA */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bubo-glass p-8 border-prediction-purple/30">
          <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-6">
            Instant Fix Cards
          </h2>
          <Card className="bubo-glass p-6 border-prediction-purple/20 hover:border-prediction-purple/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ConfidenceOrb confidence={92} />
                <div>
                  <h3 className="font-space-grotesk font-semibold text-pure-white">
                    Fix Windows printing when jobs are stuck
                  </h3>
                  <p className="text-sm text-prediction-purple">Built from 47 solved issues</p>
                </div>
              </div>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                Easy
              </Badge>
            </div>

            <div className="space-y-3">
              <Button className="w-full bubo-btn-secondary">
                <Eye className="w-4 h-4 mr-2" />
                View Steps
              </Button>
              
              <Button className="w-full bubo-btn-ghost">
                <Zap className="w-4 h-4 mr-2" />
                Run Checks
                <Badge className="ml-2 bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                  Pro
                </Badge>
              </Button>

              {/* Locked One-Click Fix */}
              <div className="relative group">
                <Button className="w-full bubo-btn-ghost relative overflow-hidden opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/20 to-iq-neon-green/20 blur-sm" />
                  <div className="relative z-10 flex items-center justify-center w-full">
                    <div className="blur-sm flex items-center">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      One-Click Fix
                    </div>
                    <Lock className="absolute w-5 h-5 text-iq-neon-green animate-pulse" />
                  </div>
                </Button>
                
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bubo-glass px-4 py-3 rounded-xl border border-iq-neon-green/30 text-center min-w-48">
                    <p className="text-sm text-pure-white font-medium mb-2">
                      Upgrade to Team to unlock
                    </p>
                    <Button className="bubo-btn-neon-primary text-xs px-3 py-1">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Card>

        {/* 3. Reviewer Console - Draft article being approved */}
        <Card className="bubo-glass p-8 border-prediction-purple/30">
          <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-6">
            Reviewer Console
          </h2>
          <Card className="bubo-glass p-6 border-signal-yellow/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ConfidenceOrb confidence={73} />
                <div>
                  <h3 className="font-space-grotesk font-semibold text-pure-white">
                    Stop Outlook asking for password
                  </h3>
                  <p className="text-sm text-signal-yellow">Draft • Awaiting review</p>
                </div>
              </div>
              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                AI Generated
              </Badge>
            </div>

            <div className="mb-4">
              <div className="text-sm text-mist-gray mb-2">Confidence Level</div>
              <div className="flex items-center space-x-3">
                <Progress value={73} className="flex-1 h-2" />
                <span className="text-sm text-pure-white">73%</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="bubo-btn-neon-primary flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Publish
              </Button>
              <Button className="bubo-btn-ghost">
                <Edit className="w-4 h-4 mr-2" />
                Edit First
              </Button>
            </div>
          </Card>
        </Card>
      </div>

      {/* 4. Metrics Spotlight */}
      <Card className="bubo-glass p-12 relative overflow-hidden border-prediction-purple/30">
        <div className="absolute inset-0 bg-gradient-to-br from-prediction-purple/10 to-iq-neon-green/10" />
        <div className="relative z-10">
          <h2 className="font-space-grotesk text-3xl font-bold text-pure-white mb-8 text-center">
            Knowledge Base Impact
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bubo-glass p-8 text-center border-iq-neon-green/30">
              <div className="w-16 h-16 bg-iq-neon-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div className="text-4xl font-bold text-iq-neon-green mb-2 font-space-grotesk">
                {animatedMetric}%
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Deflection Rate</h3>
              <p className="text-sm text-mist-gray">Issues resolved without escalation</p>
            </Card>

            <Card className="bubo-glass p-8 text-center border-electric-blue/30">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-electric-blue" />
              </div>
              <div className="text-4xl font-bold text-electric-blue mb-2 font-space-grotesk">
                33min
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Time Saved</h3>
              <p className="text-sm text-mist-gray">Average per resolved issue</p>
            </Card>

            <Card className="bubo-glass p-8 text-center border-prediction-purple/30">
              <div className="w-16 h-16 bg-prediction-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-prediction-purple" />
              </div>
              <div className="text-4xl font-bold text-prediction-purple mb-2 font-space-grotesk">
                94%
              </div>
              <h3 className="font-semibold text-pure-white mb-2">Success Rate</h3>
              <p className="text-sm text-mist-gray">Solutions that work first time</p>
            </Card>
          </div>
        </div>
      </Card>

      {/* 5. Animated Learning Orb */}
      <Card className="bubo-glass p-12 relative overflow-hidden border-prediction-purple/30">
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/10 to-iq-neon-green/10" />
        <div className="relative z-10 text-center">
          <h2 className="font-space-grotesk text-3xl font-bold text-pure-white mb-8">
            Continuous Learning
          </h2>
          
          <div className="flex items-center justify-center space-x-12 mb-8">
            {/* Issue happens */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-crimson-danger/20 rounded-full flex items-center justify-center border-2 border-crimson-danger/30">
                <MessageSquare className="w-8 h-8 text-crimson-danger" />
              </div>
              <span className="text-sm text-mist-gray">Issue Reported</span>
            </div>

            <ArrowRight className="w-6 h-6 text-mist-gray" />

            {/* Learning happens */}
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${
                isLearning 
                  ? 'bg-electric-blue/30 border-electric-blue animate-pulse' 
                  : 'bg-electric-blue/20 border-electric-blue/30'
              }`}>
                <Edit className="w-8 h-8 text-electric-blue" />
              </div>
              <span className="text-sm text-mist-gray">AI Learns</span>
            </div>

            <ArrowRight className="w-6 h-6 text-mist-gray" />

            {/* Confidence improves */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <ConfidenceOrb confidence={orbConfidence} size="w-16 h-16" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-pure-white">{orbConfidence}%</span>
                </div>
              </div>
              <span className="text-sm text-mist-gray">Confidence Grows</span>
            </div>
          </div>

          <p className="text-lg text-mist-gray max-w-2xl mx-auto">
            Every problem solved automatically becomes searchable knowledge. 
            Watch confidence levels improve as the system learns from real solutions.
          </p>
        </div>
      </Card>

      {/* Visual Flow Diagram */}
      <Card className="bubo-glass p-12 relative overflow-hidden border-prediction-purple/30">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-midnight to-prediction-purple/5" />
        <div className="relative z-10">
          <h2 className="font-space-grotesk text-3xl font-bold text-pure-white mb-12 text-center">
            From Chaos to Clarity
          </h2>

          <div className="flex justify-between items-center">
            {[
              { icon: MessageSquare, label: 'Issues', color: 'crimson-danger' },
              { icon: Eye, label: 'Evidence', color: 'electric-blue' },
              { icon: Edit, label: 'Draft', color: 'signal-yellow' },
              { icon: CheckCircle, label: 'Review', color: 'cyan-accent' },
              { icon: BarChart3, label: 'Published', color: 'iq-neon-green' },
              { icon: RotateCcw, label: 'Feedback', color: 'prediction-purple' },
              { icon: Target, label: 'Metrics', color: 'amber-warning' }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center space-y-3">
                <div className={`w-12 h-12 rounded-full bg-${step.color}/20 border-2 border-${step.color}/30 flex items-center justify-center text-${step.color}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-mist-gray font-medium">{step.label}</span>
                {index < 6 && (
                  <ArrowRight className="w-4 h-4 text-mist-gray/50 absolute" style={{ 
                    left: `${((index + 1) * 100 / 7) + 6}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};