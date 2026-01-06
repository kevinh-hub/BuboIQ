import React from 'react';
import { Play, Shield, Zap, CheckCircle } from 'lucide-react';

interface DemoHeroSectionProps {
  onStartDemo: () => void;
}

export function DemoHeroSection({ onStartDemo }: DemoHeroSectionProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bubo-neural-bg opacity-50" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-headline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-space-grotesk">
              AI-Driven IT Support Intelligence
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-space-grotesk mb-6">
            <span className="text-white">Your </span>
            <span className="text-accent bubo-neon-text-green">AI support analyst</span>
            <span className="text-white">.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-text-300 mb-4 max-w-3xl mx-auto">
            See it resolve an incident in 60 seconds
          </p>

          <p className="text-lg text-text-400 mb-12 max-w-2xl mx-auto">
            Watch BuboIQ Analyst observe tickets, reason through solutions, and queue 
            safe actions—all in a live, sandboxed demo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartDemo}
              className="bubo-btn-neon-primary text-lg px-8 py-4 flex items-center gap-3 w-full sm:w-auto justify-center group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start the Live Demo
            </button>
            
            <a
              href="#how-it-works"
              className="bubo-btn-secondary text-lg px-8 py-4 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Shield className="w-5 h-5" />
              See How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>30-60 min sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Synthetic data only</span>
            </div>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-20 panel p-6 max-w-5xl mx-auto">
          <p className="text-sm text-text-600 text-center mb-6">TRUSTED BY FORWARD-THINKING IT TEAMS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {['MSP Partner 1', 'Enterprise Corp', 'Tech Startup', 'Healthcare Org'].map((name, i) => (
              <div key={i} className="text-text-600 font-space-grotesk text-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
