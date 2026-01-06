import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';
import { SEO } from '../SEO';
import { HowItWorksSection, ValuePropositionSection } from '../demo';
import { ComingSoonModal } from './ComingSoonModal';
import { isBillingEnabled } from '../../utils/feature-flags';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onTryItNow: (planId?: string) => void;
  onStartLiveDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onTryItNow, onStartLiveDemo }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showComingSoon, setShowComingSoon] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Cursor-follow orb glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (e.clientY < rect.bottom) {
          setMousePosition({
            x: e.clientX,
            y: e.clientY
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEO 
        title="BuboIQ - See Problems Sooner. Solve Them Faster."
        description="Spot IT issues early, follow guided fixes, and save what worked for next time. Built for small IT teams and MSPs."
        url="https://buboiq.com"
      />

      {/* Hero Section - Attention-Grabbing Entry Point */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-12 md:pt-20">
        {/* Background Grid - Deepest Layer */}
        <div className="absolute inset-0 bubo-circuit-pattern opacity-5 z-[1]" />

        {/* Morphic Intelligence System - Background Enhancement Orbs */}
        <OrbSystem
          variantType="HaloRing"
          sizeToken="S"
          placement="MidLeft"
          zLayer="Behind"
          tint="Base"
          motionProfile="Idle"
          glow={1}
          className="opacity-30"
        />
        <OrbSystem
          variantType="RibbonWave"
          sizeToken="M"
          placement="BottomRight"
          zLayer="Behind"
          tint="Base"
          motionProfile="Scroll"
          glow={1}
          className="opacity-20"
        />

        {/* Subtle Glass Tint (no blur to preserve orbs) */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-midnight/40 via-transparent to-dark-midnight/60 z-[5] pointer-events-none" />

        {/* ORIGINAL HERO ORB - DeviceNetworkOrb Centerpiece - AT THE TOP */}
        <div className="relative z-[25] pointer-events-none mb-8 md:mb-12">
          <DeviceNetworkOrb 
            size={400} 
            className="bubo-animate-float" 
            isHomePage={true}
          />
        </div>

        {/* TITLE AND CONTENT - BELOW THE ORB */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-12">

            {/* Main Headline - Bold Stagger */}
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <div className="bubo-animate-fadeInUp inline-flex items-center px-6 py-3 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-full backdrop-blur-sm" style={{ animationDelay: '0.4s' }}>
                <span className="text-mist-gray text-sm">For small IT teams & MSPs</span>
              </div>

              {/* H1 - Two lines with manual break */}
              <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold leading-tight">
                <div className="bubo-animate-fadeInUp relative" style={{ animationDelay: '0.6s' }}>
                  <span className="text-pure-white">See More. </span>
                  <span className="text-iq-neon-green bubo-neon-text-green">Solve Faster.</span>
                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent opacity-50 blur-sm" />
                </div>
              </h1>
              
              {/* Body - ~160 chars max */}
              <p className="bubo-animate-fadeInUp font-inter text-xl md:text-2xl text-cloud-white leading-relaxed max-w-3xl mx-auto" style={{ animationDelay: '1s' }}>
                One place to spot problems, show how to fix them, and save what worked. That's how you stop repeat issues.
              </p>
              
              {/* CTA Buttons */}
              <div className="bubo-animate-fadeInUp flex flex-col sm:flex-row gap-6 justify-center items-center pt-8" style={{ animationDelay: '1.2s' }}>
                <Button 
                  onClick={() => {
                    if (isBillingEnabled()) {
                      onNavigate('pricing');
                    } else {
                      setShowComingSoon(true);
                    }
                  }}
                  className="bubo-btn-neon-primary text-lg px-10 py-6 group"
                  size="lg"
                >
                  <span className="relative z-10 flex items-center">
                    Start free 14-day trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                {onStartLiveDemo && (
                  <Button 
                    onClick={onStartLiveDemo}
                    className="bubo-btn-secondary text-lg px-10 py-6"
                    size="lg"
                  >
                    Watch 90-second tour
                  </Button>
                )}
              </div>

              {/* Proof Strip - tiny feature chips */}
              <div className="bubo-animate-fadeInUp flex flex-wrap items-center justify-center gap-3 pt-4 text-xs text-mist-gray" style={{ animationDelay: '1.4s' }}>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-gray/10 border border-slate-gray/20">
                  Works on Windows/Mac/Linux
                </span>
                <span className="text-slate-gray/40">•</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-gray/10 border border-slate-gray/20">
                  Step-by-step fixes included
                </span>
                <span className="text-slate-gray/40">•</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-gray/10 border border-slate-gray/20">
                  Audit proof built-in
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-iq-neon-green/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-iq-neon-green rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Value Proposition Section - From Live Demo System */}
      {onStartLiveDemo && <ValuePropositionSection />}

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* How It Works Section - From Live Demo System */}
      {onStartLiveDemo && <HowItWorksSection />}

      {/* Section Divider */}
      <div className="bubo-orbital-divider" />

      {/* Directional CTA Rail - Guide Users Deeper */}
      <section className="bubo-cta-rail">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-4">
            <span className="font-['Space_Grotesk'] text-xl md:text-2xl text-iq-neon-green font-bold">
              See problems sooner. Solve them faster.
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
            Want to learn more?
          </h2>
          <p className="font-inter text-lg text-cloud-white mb-12 max-w-2xl mx-auto">
            See how BuboIQ helps IT teams spot issues early and fix them faster.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { page: 'why', icon: <TrendingUp className="w-5 h-5" />, label: 'Why BuboIQ?', desc: 'See what makes us different' },
              { page: 'how-it-works', icon: <Zap className="w-5 h-5" />, label: 'How it works', desc: 'See the full workflow' },
              { page: 'features', icon: <Sparkles className="w-5 h-5" />, label: 'Features', desc: 'See what you can do' }
            ].map((link, index) => (
              <button
                key={index}
                onClick={() => onNavigate(link.page)}
                className="bubo-glass p-6 rounded-2xl border border-electric-blue/20 hover:border-electric-blue/40 transition-all duration-300 group text-left hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-electric-blue/20 flex items-center justify-center text-electric-blue group-hover:bg-electric-blue/30 transition-colors">
                    {link.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-mist-gray group-hover:text-electric-blue group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white mb-1">
                  {link.label}
                </h3>
                <p className="text-sm text-mist-gray">
                  {link.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-slate-gray/20">
            <p className="text-sm text-mist-gray mb-4">
              Or see pricing
            </p>
            <Button 
              onClick={() => {
                if (isBillingEnabled()) {
                  onNavigate('pricing');
                } else {
                  setShowComingSoon(true);
                }
              }}
              className="bubo-btn-ghost"
            >
              Compare plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final Section Divider */}
      <div className="bubo-section-divider" />

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
};