import React, { useState } from 'react';
import { Play, Shield, Zap, Lock, Clock, CheckCircle } from 'lucide-react';

interface DemoLauncherProps {
  onStartDemo: () => void;
  onClose: () => void;
}

export function DemoLauncher({ onStartDemo, onClose }: DemoLauncherProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    // Simulate demo org creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    onStartDemo();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeInUp">
      <div className="bubo-glass max-w-2xl w-full p-8 rounded-2xl border border-accent/20 shadow-modal">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 mb-6">
            <Play className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-space-grotesk mb-3">
            <span className="text-white">Start the </span>
            <span className="text-accent">Live Demo</span>
          </h1>
          <p className="text-text-400 text-lg">
            Experience BuboIQ Analyst in a sandboxed, time-limited environment
          </p>
        </div>

        {/* Info Panel */}
        <div className="panel p-6 mb-8 bg-info/5 border-info/20">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-5 h-5 text-info mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-space-grotesk text-white mb-2">
                This is a sandboxed demo. Realistic behavior, zero risk to your environment.
              </h3>
              <p className="text-xs text-text-400">
                Your demo org uses synthetic data and simulated integrations. All actions are safe to execute.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div>
              <h4 className="text-sm font-space-grotesk text-white mb-1">Observe-Only Fallback</h4>
              <p className="text-xs text-text-400">
                Any unexpected error flips to safe mode automatically
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-info/20 border border-info/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-info" />
            </div>
            <div>
              <h4 className="text-sm font-space-grotesk text-white mb-1">Signed Webhooks Simulator</h4>
              <p className="text-xs text-text-400">
                See real HMAC-signed callbacks in action
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-warn/20 border border-warn/30 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-warn" />
            </div>
            <div>
              <h4 className="text-sm font-space-grotesk text-white mb-1">Rate Limits</h4>
              <p className="text-xs text-text-400">
                1 reasoning run/min, ≤10 actions/hour
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-space-grotesk text-white mb-1">Time-Limited Session</h4>
              <p className="text-xs text-text-400">
                Demo org expires automatically after 30-60 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Legal Note */}
        <div className="text-center mb-8">
          <p className="text-xs text-text-600">
            30–60 min TTL • Synthetic data only • No credit card required
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors font-space-grotesk"
          >
            Maybe Later
          </button>
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="flex-1 bubo-btn-neon-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Starting Demo...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Demo
              </>
            )}
          </button>
        </div>

        {/* Production Recommendations Callout */}
        <div className="mt-8 panel p-4 bg-bg-850/50">
          <h4 className="text-xs font-space-grotesk text-white mb-2">
            Production Recommendations
          </h4>
          <ul className="space-y-1 text-xs text-text-400">
            <li>• Put Connect behind HTTPS and IP allowlists</li>
            <li>• Run Redis managed (AWS ElastiCache, Azure Cache)</li>
            <li>• Log every request id + action_id to your log sink</li>
            <li>• Set resource limits and liveness probes (/healthz)</li>
            <li>• Rotate CONNECT_SECRET on schedule with dual-secret support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
