import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ProofPointsSectionProps {
  onTryItNow?: () => void;
}

export const ProofPointsSection: React.FC<ProofPointsSectionProps> = ({ onTryItNow }) => {

  const proofPoints = [
    {
      value: 'Auto-fix',
      label: 'Common issues fixed automatically',
      description: 'System handles routine problems without intervention',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'iq-neon-green',
      trend: 'Continuously improving'
    },
    {
      value: 'Instant Detection',
      label: 'Fast problem identification',
      description: 'Issues spotted and reported immediately',
      icon: <Clock className="w-8 h-8" />,
      color: 'electric-blue',
      trend: 'Real-time monitoring'
    },
    {
      value: 'Smart Protection',
      label: 'Risky updates prevented',
      description: 'Problematic changes safely blocked or reverted',
      icon: <Shield className="w-8 h-8" />,
      color: 'cyan-accent',
      trend: 'Proactive safeguards'
    },
    {
      value: 'Expert Routing',
      label: 'Intelligent ticket assignment',
      description: 'Complex issues sent to right person with context',
      icon: <Zap className="w-8 h-8" />,
      color: 'signal-yellow',
      trend: 'Improved workflows'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface-dark/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
            How BuboIQ Makes a Difference
          </h2>
          <p className="text-lg text-mist-gray max-w-3xl mx-auto">
            Experience intelligent IT operations that help your team work smarter, not harder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {proofPoints.map((point, index) => (
            <Card 
              key={index} 
              className="bubo-glass p-6 text-center hover:scale-105 transition-all duration-300 border border-opacity-30"
              style={{ borderColor: `var(--color-${point.color})` }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-${point.color}/20 rounded-2xl flex items-center justify-center`}>
                <div className={`text-${point.color}`}>
                  {point.icon}
                </div>
              </div>
              
              <div className={`text-2xl md:text-3xl font-bold text-${point.color} mb-2 font-['Space_Grotesk']`}>
                {point.value}
              </div>
              
              <h3 className="font-semibold text-pure-white mb-2">
                {point.label}
              </h3>
              
              <p className="text-sm text-mist-gray mb-3 leading-relaxed">
                {point.description}
              </p>
              
              <div className={`text-xs text-${point.color} font-medium flex items-center justify-center space-x-1`}>
                <TrendingUp className="w-3 h-3" />
                <span>{point.trend}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Context */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bubo-glass p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
              How We Measure Success
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-cloud-white font-medium">Real-time data collection</p>
                  <p className="text-sm text-mist-gray">Every interaction, resolution, and outcome tracked automatically</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-cloud-white font-medium">Cross-customer benchmarking</p>
                  <p className="text-sm text-mist-gray">Anonymous performance data helps improve everyone's results</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-cloud-white font-medium">Continuous improvement</p>
                  <p className="text-sm text-mist-gray">AI models get smarter with every problem solved</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bubo-glass p-8">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
              What This Means for You
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-electric-blue/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                </div>
                <div>
                  <p className="text-cloud-white font-medium">Less firefighting, more strategy</p>
                  <p className="text-sm text-mist-gray">Your team focuses on improvements, not constant repairs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-electric-blue/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                </div>
                <div>
                  <p className="text-cloud-white font-medium">Predictable IT operations</p>
                  <p className="text-sm text-mist-gray">Fewer surprises, better planning, more reliable systems</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-electric-blue/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                </div>
                <div>
                  <p className="text-cloud-white font-medium">Happier users and customers</p>
                  <p className="text-sm text-mist-gray">Problems solved before users even notice them</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-4">
            Ready to See These Results in Your Environment?
          </h3>
          <p className="text-lg text-mist-gray mb-8">
            Join hundreds of organizations already experiencing dramatically improved IT operations.
          </p>
          <Button onClick={onTryItNow} className="bubo-btn-neon-primary text-lg px-8 py-4">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};