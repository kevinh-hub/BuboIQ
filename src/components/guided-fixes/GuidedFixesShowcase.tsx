import React, { useState } from 'react';
import { ArrowLeft, Monitor, Network, HardDrive, RefreshCw, Terminal, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { GuidedFixCard } from './guided-fix-card';
import { QuickActionTile } from './quick-action-tile';
import { GuidedFixRunnerDrawer } from './guided-fix-runner-drawer';

interface GuidedFixesShowcaseProps {
  onBack: () => void;
}

export const GuidedFixesShowcase: React.FC<GuidedFixesShowcaseProps> = ({ onBack }) => {
  const [showRunner, setShowRunner] = useState(false);
  const [selectedFix, setSelectedFix] = useState<{ id: string; title: string } | null>(null);

  const guidedFixes = [
    {
      id: 'network-dns',
      title: 'Network: No internet',
      description: 'Find and fix DNS problems, clear cache, reset network settings',
      os: ['windows' as const, 'macos' as const, 'linux' as const],
      safety: 'low' as const,
      estMins: '2–4 min',
      tierState: 'pro' as const,
      requiresApproval: false
    },
    {
      id: 'cpu-investigate',
      title: 'Check high CPU use',
      description: 'Find what\'s using CPU, collect system info, create report',
      os: ['windows' as const, 'macos' as const, 'linux' as const],
      safety: 'readOnly' as const,
      estMins: '1–3 min',
      tierState: 'pro' as const,
      requiresApproval: false
    },
    {
      id: 'logs-collect',
      title: 'Collect logs',
      description: 'Gather system logs, event logs, and diagnostic info',
      os: ['windows' as const],
      safety: 'readOnly' as const,
      estMins: '1–2 min',
      tierState: 'pro' as const,
      requiresApproval: false
    },
    {
      id: 'disk-sweep',
      title: 'Free up disk space',
      description: 'Find big files, clean temp folders, make room',
      os: ['windows' as const, 'linux' as const],
      safety: 'risky' as const,
      estMins: '2–6 min',
      tierState: 'team' as const,
      requiresApproval: true
    }
  ];

  const quickActions = [
    {
      id: 'flush-dns',
      icon: Network,
      title: 'Flush DNS Cache',
      os: 'windows' as const,
      safety: 'low' as const
    },
    {
      id: 'restart-service',
      icon: RefreshCw,
      title: 'Restart Print Spooler',
      os: 'windows' as const,
      safety: 'low' as const
    },
    {
      id: 'disk-check',
      icon: HardDrive,
      title: 'Check Disk Health',
      os: 'windows' as const,
      safety: 'readOnly' as const
    },
    {
      id: 'clear-cache',
      icon: Terminal,
      title: 'Clear System Cache',
      os: 'macos' as const,
      safety: 'low' as const
    }
  ];

  const handleRunFix = (id: string, title: string) => {
    setSelectedFix({ id, title });
    setShowRunner(true);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-dark-midnight to-surface-dark">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-mist-gray hover:text-cloud-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 px-4 py-2">
              Feature Showcase
            </Badge>
            <Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/30 px-3 py-1 text-xs">
              Pro $127 • Team $297
            </Badge>
          </div>

          <h1 className="font-space-grotesk text-5xl md:text-6xl text-pure-white mb-4">
            <span className="text-pure-white">Guided Fixes</span>
          </h1>
          
          <p className="text-xl text-cloud-white max-w-3xl mb-8">
            Step-by-step actions for common fixes—flush DNS, reset network, collect logs, and more—across{' '}
            <span className="text-electric-blue">Windows</span>,{' '}
            <span className="text-slate-gray">macOS</span>, and{' '}
            <span className="text-signal-yellow">Linux</span>, powered by the BuboIQ Agent or Connect.
          </p>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bubo-glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-success-green/20 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-success-green" />
                </div>
                <h3 className="font-space-grotesk text-pure-white">Multi-OS</h3>
              </div>
              <p className="text-sm text-mist-gray">
                Run the same fix on Windows, macOS, or Linux with OS-specific commands
              </p>
            </Card>

            <Card className="bubo-glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-signal-yellow/20 flex items-center justify-center">
                  <Badge className="w-4 h-4 text-signal-yellow" />
                </div>
                <h3 className="font-space-grotesk text-pure-white">Safety First</h3>
              </div>
              <p className="text-sm text-mist-gray">
                Every step labeled with safety grade; destructive actions require confirmation
              </p>
            </Card>

            <Card className="bubo-glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-iq-neon-green/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-iq-neon-green" />
                </div>
                <h3 className="font-space-grotesk text-pure-white">Auto-KB</h3>
              </div>
              <p className="text-sm text-mist-gray">
                Successful fixes automatically create Knowledge Base articles
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="full-fixes" className="space-y-6">
            <TabsList className="bubo-glass p-1">
              <TabsTrigger value="full-fixes" className="data-[state=active]:bg-iq-neon-green/20">
                Full Guided Fixes
              </TabsTrigger>
              <TabsTrigger value="quick-actions" className="data-[state=active]:bg-electric-blue/20">
                Quick Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="full-fixes" className="space-y-4">
              <div className="mb-6">
                <h2 className="font-space-grotesk text-2xl text-pure-white mb-2">
                  Full Guided Fixes
                </h2>
                <p className="text-mist-gray">
                  Multi-step actions with live console output, safety confirmations, and Knowledge Base integration
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {guidedFixes.map((fix) => (
                  <GuidedFixCard
                    key={fix.id}
                    {...fix}
                    onRun={() => handleRunFix(fix.id, fix.title)}
                    onPreview={() => console.log('Preview', fix.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quick-actions" className="space-y-4">
              <div className="mb-6">
                <h2 className="font-space-grotesk text-2xl text-pure-white mb-2">
                  Quick Actions
                </h2>
                <p className="text-mist-gray">
                  Single-step fixes available on all plans. Safe operations execute immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <QuickActionTile
                    key={action.id}
                    {...action}
                    onClick={(id) => handleRunFix(id, action.title)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Ribbon */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface-dark/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-mist-gray mb-4">
            Available on Pro ($127/mo) and Team ($297/mo). Safe Quick Actions included in Starter ($33/mo).
          </p>
          <div className="flex justify-center gap-3">
            <Button className="bubo-btn-neon-primary">
              See it in action
            </Button>
            <Button variant="outline" className="bubo-btn-secondary">
              View pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Runner Drawer */}
      {showRunner && selectedFix && (
        <GuidedFixRunnerDrawer
          guidedFixId={selectedFix.id}
          title={selectedFix.title}
          onClose={() => {
            setShowRunner(false);
            setSelectedFix(null);
          }}
        />
      )}
    </div>
  );
};
