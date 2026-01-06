import React, { useState, useEffect } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Play, Pause, 
  CheckCircle, AlertCircle, Zap, FileText, 
  Brain, Shield, Clock, TrendingUp
} from 'lucide-react';
import { LeadCaptureModal } from './LeadCaptureModal';

/**
 * Full-Journey Demo - Complete BuboIQ Workflow
 * 
 * Shows the entire process:
 * 1. Ticket Inception (alert arrives)
 * 2. AI Analysis (reasoning & correlation)
 * 3. Recommended Actions (approve/reject)
 * 4. Execution (actions applied)
 * 5. KB Article Creation (automated draft)
 * 6. Ticket Closure (resolution confirmed)
 * 
 * This is NOT an overlay - it's a full-page immersive experience.
 */

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  screen: 'ticket-inbox' | 'ai-analysis' | 'actions' | 'execution' | 'kb-draft' | 'closure';
  duration: number; // Auto-advance after X seconds (0 = manual)
  metrics?: {
    label: string;
    value: string;
    change?: string;
  }[];
}

const DEMO_STEPS: Step[] = [
  {
    id: 1,
    title: 'Ticket Inception',
    subtitle: 'Alert Arrives from Monitoring',
    description: 'A critical printer driver issue is detected. Instead of waiting in a queue, BuboIQ\'s AI agent immediately picks it up for analysis.',
    screen: 'ticket-inbox',
    duration: 3,
    metrics: [
      { label: 'Response Time', value: '<1 sec', change: '95% faster' },
      { label: 'Queue Wait', value: '0 min', change: 'vs 45 min avg' }
    ]
  },
  {
    id: 2,
    title: 'AI Analysis',
    subtitle: 'Deep Reasoning & Pattern Recognition',
    description: 'The AI agent analyzes the ticket, correlates with similar past issues, and identifies the root cause with 87% confidence.',
    screen: 'ai-analysis',
    duration: 4,
    metrics: [
      { label: 'Confidence', value: '87%', change: 'High' },
      { label: 'Similar Issues', value: '23 found', change: 'Pattern match' },
      { label: 'Analysis Time', value: '2.3 sec', change: 'Instant' }
    ]
  },
  {
    id: 3,
    title: 'Recommended Actions',
    subtitle: 'AI Proposes Solution Steps',
    description: 'Based on analysis, the AI recommends specific actions: update ticket, install driver patch, restart print spooler. Your team can approve or reject each action.',
    screen: 'actions',
    duration: 5,
    metrics: [
      { label: 'Actions Proposed', value: '3 steps', change: 'Automated' },
      { label: 'Risk Level', value: 'Low', change: 'Safe to approve' },
      { label: 'Est. Resolution', value: '5 min', change: 'Fast fix' }
    ]
  },
  {
    id: 4,
    title: 'Execution',
    subtitle: 'Actions Applied Automatically',
    description: 'After approval, BuboIQ executes the actions: ticket updated, driver installed, service restarted. All changes are logged and auditable.',
    screen: 'execution',
    duration: 4,
    metrics: [
      { label: 'Actions Completed', value: '3/3', change: '100% success' },
      { label: 'Execution Time', value: '47 sec', change: 'Automated' },
      { label: 'Status', value: 'Resolved', change: 'Success' }
    ]
  },
  {
    id: 5,
    title: 'KB Article Draft',
    subtitle: 'Automated Knowledge Capture',
    description: 'Here\'s the magic: BuboIQ automatically generates a KB article documenting the issue, root cause, solution, and steps. Your team reviews and publishes.',
    screen: 'kb-draft',
    duration: 6,
    metrics: [
      { label: 'Draft Quality', value: '92%', change: 'Review-ready' },
      { label: 'Time Saved', value: '25 min', change: 'vs manual write' },
      { label: 'Reusability', value: 'High', change: 'Future tickets' }
    ]
  },
  {
    id: 6,
    title: 'Ticket Closure',
    subtitle: 'Resolution Confirmed',
    description: 'The ticket is closed with full documentation. Total resolution time: 6 minutes. Traditional IT support? 45+ minutes. And you now have a KB article for future incidents.',
    screen: 'closure',
    duration: 0, // Manual advance to lead capture
    metrics: [
      { label: 'Total Time', value: '6 min', change: '87% faster' },
      { label: 'Manual Work', value: '30 sec', change: 'Just approve' },
      { label: 'KB Articles', value: '+1', change: 'Compound value' }
    ]
  }
];

interface FullJourneyDemoProps {
  onClose: () => void;
}

export function FullJourneyDemo({ onClose }: FullJourneyDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [demoStartTime] = useState(Date.now());

  const step = DEMO_STEPS[currentStep];

  // Auto-advance to next step
  useEffect(() => {
    if (!isPlaying || step.duration === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // End of demo - show lead capture
        setIsPlaying(false);
        setShowLeadCapture(true);
      }
    }, step.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, step.duration]);

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowLeadCapture(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLeadSubmit = (data: { name: string; email: string; company: string }) => {
    console.log('Lead captured from Full Journey Demo:', data);
    
    // Calculate engagement
    const timeInDemo = Math.floor((Date.now() - demoStartTime) / 1000);
    const stepsCompleted = currentStep + 1;
    
    // Track in analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'lead_captured', {
        source: 'full_journey_demo',
        steps_completed: stepsCompleted,
        time_in_demo: timeInDemo,
        company: data.company
      });
    }
    
    // Close demo after successful submission
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#0E0E0E] z-50 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#1C1C1E]/95 backdrop-blur-xl border-b border-[#00FF85]/20 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00E676] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#0E0E0E]" />
              </div>
              <div>
                <h1 className="font-space-grotesk text-lg text-white">
                  <span className="text-white">BUBO</span>
                  <span className="text-[#00FF85]">IQ</span>
                </h1>
                <p className="text-xs text-text-400">Full Journey Demo</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-[#00FF85]/20" />
            
            <div>
              <p className="text-sm font-space-grotesk text-white">
                {step.title}
              </p>
              <p className="text-xs text-text-400">{step.subtitle}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-[#00FF85]/10 rounded-lg transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-[#00FF85]" />
              ) : (
                <Play className="w-5 h-5 text-[#00FF85]" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
              aria-label="Close demo"
            >
              <X className="w-5 h-5 text-text-400 hover:text-danger" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 h-full overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {DEMO_STEPS.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${idx === currentStep 
                          ? 'bg-[#00FF85] border-[#00FF85] text-[#0E0E0E] scale-110' 
                          : idx < currentStep
                          ? 'bg-[#00FF85]/20 border-[#00FF85] text-[#00FF85]'
                          : 'bg-[#1C1C1E] border-[#00FF85]/20 text-text-600'
                        }
                      `}
                    >
                      {idx < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-space-grotesk">{s.id}</span>
                      )}
                    </div>
                    <span className={`text-xs font-space-grotesk ${idx === currentStep ? 'text-[#00FF85]' : 'text-text-600'}`}>
                      {s.title.split(' ')[0]}
                    </span>
                  </div>
                  {idx < DEMO_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${idx < currentStep ? 'bg-[#00FF85]' : 'bg-[#00FF85]/20'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Narrative */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-space-grotesk text-white mb-4">
                  {step.title}
                </h2>
                <p className="text-xl text-[#00FF85] mb-6">
                  {step.subtitle}
                </p>
                <p className="text-lg text-text-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Metrics */}
              {step.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  {step.metrics.map((metric, idx) => (
                    <div key={idx} className="panel p-4">
                      <p className="text-xs text-text-600 mb-1">{metric.label}</p>
                      <p className="text-2xl font-space-grotesk text-white mb-1">
                        {metric.value}
                      </p>
                      {metric.change && (
                        <p className="text-xs text-[#00FF85]">{metric.change}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Key Insight */}
              <div className="panel p-6 bg-[#00FF85]/5 border-[#00FF85]/30">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-space-grotesk text-white mb-2">Why This Matters</p>
                    <p className="text-sm text-text-400">
                      {currentStep === 0 && 'Traditional IT support leaves tickets in a queue for 45+ minutes. BuboIQ starts analysis instantly.'}
                      {currentStep === 1 && 'Human analysts spend 15-20 minutes researching. AI does this in 2 seconds with higher accuracy.'}
                      {currentStep === 2 && 'Instead of blindly applying fixes, your team maintains control with approve/reject actions.'}
                      {currentStep === 3 && 'Automation executes faster and more consistently than manual intervention, with full audit logs.'}
                      {currentStep === 4 && 'This is what separates BuboIQ: automatic KB article creation means every ticket compounds your team\'s knowledge.'}
                      {currentStep === 5 && '6 minutes total vs 45+ minutes traditional. And you gained a KB article. That\'s the BuboIQ difference.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Screen */}
            <div className="sticky top-24">
              <DemoScreen screen={step.screen} isActive={isPlaying} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 h-28 bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-[#00FF85]/20 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between">
          {/* Progress */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-400">
              Step {currentStep + 1} of {DEMO_STEPS.length}
            </span>
            <div className="w-64 h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00FF85] to-[#00E676] transition-all duration-500"
                style={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="bubo-btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
            
            {currentStep < DEMO_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="bubo-btn-neon-primary"
              >
                Next Step
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setShowLeadCapture(true)}
                className="bubo-btn-neon-primary animate-pulse"
              >
                See It On Your Devices
                <Zap className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          onSubmit={handleLeadSubmit}
          demoEngagement={{
            actions_approved: currentStep + 1,
            time_in_demo: Math.floor((Date.now() - demoStartTime) / 1000),
            features_explored: ['full_journey_demo']
          }}
        />
      )}
    </div>
  );
}

/**
 * Demo Screen Component
 * Renders the appropriate UI for each step
 */
interface DemoScreenProps {
  screen: Step['screen'];
  isActive: boolean;
}

function DemoScreen({ screen, isActive }: DemoScreenProps) {
  switch (screen) {
    case 'ticket-inbox':
      return <TicketInboxScreen isActive={isActive} />;
    case 'ai-analysis':
      return <AIAnalysisScreen isActive={isActive} />;
    case 'actions':
      return <ActionsScreen isActive={isActive} />;
    case 'execution':
      return <ExecutionScreen isActive={isActive} />;
    case 'kb-draft':
      return <KBDraftScreen isActive={isActive} />;
    case 'closure':
      return <ClosureScreen isActive={isActive} />;
    default:
      return null;
  }
}

// Screen Components
function TicketInboxScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-white">Ticket Inbox</h3>
        <span className="text-xs text-text-600">Real-time</span>
      </div>
      
      {/* New Ticket Alert */}
      <div className={`panel p-4 border-l-4 border-l-danger ${isActive ? 'animate-pulse' : ''}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-space-grotesk text-white">TKT-2847</span>
              <span className="text-xs px-2 py-1 bg-danger/20 text-danger rounded">Critical</span>
            </div>
            <p className="text-sm text-text-300 mb-2">
              Printer driver causing blue screen errors on Windows 11 workstations
            </p>
            <div className="flex items-center gap-4 text-xs text-text-600">
              <span>• Reported by: IT Admin</span>
              <span>• Affected: 12 devices</span>
              <span>• Just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Picking Up */}
      {isActive && (
        <div className="panel p-4 bg-[#00FF85]/5 border-[#00FF85]/30 animate-fadeInUp">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00FF85]/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#00FF85] animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">AI Agent analyzing...</p>
              <p className="text-xs text-text-400">Checking historical patterns</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AIAnalysisScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-white">AI Analysis</h3>
        <span className="text-xs px-2 py-1 bg-[#00FF85]/20 text-[#00FF85] rounded">87% Confidence</span>
      </div>
      
      {/* Reasoning Trace */}
      <div className="space-y-3">
        <div className="panel p-4 bg-info/5 border-info/30">
          <p className="text-xs text-text-600 mb-2">ROOT CAUSE ANALYSIS</p>
          <p className="text-sm text-white mb-2">
            Driver version 10.2.4 incompatible with Windows 11 22H2 update
          </p>
          <p className="text-xs text-text-400">
            Correlation: 23 similar tickets resolved with driver rollback
          </p>
        </div>

        <div className="panel p-4">
          <p className="text-xs text-text-600 mb-2">SIMILAR INCIDENTS</p>
          <div className="space-y-2">
            <div className="text-xs text-text-400">
              • TKT-2601 - Printer BSOD (Resolved: driver update)
            </div>
            <div className="text-xs text-text-400">
              • TKT-2512 - Print spooler crash (Resolved: service restart)
            </div>
            <div className="text-xs text-text-400">
              • TKT-2389 - Driver conflict (Resolved: rollback + patch)
            </div>
          </div>
        </div>

        {isActive && (
          <div className="panel p-4 bg-[#00FF85]/5 border-[#00FF85]/30 animate-fadeInUp">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00FF85]" />
              <p className="text-sm text-white">Analysis complete - generating action plan...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionsScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-white">Recommended Actions</h3>
        <span className="text-xs text-text-600">3 steps proposed</span>
      </div>
      
      <div className="space-y-3">
        {/* Action 1 */}
        <div className="panel p-4 border-l-4 border-l-[#00FF85]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-1">1. Update Ticket Status</p>
              <p className="text-xs text-text-400">Set status to "In Progress" and assign to AI</p>
            </div>
            <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">Safe</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-[#00FF85] text-[#0E0E0E] text-xs rounded hover:bg-[#00E676]">
              Approve
            </button>
            <button className="px-3 py-1 bg-[#1C1C1E] text-text-400 text-xs rounded hover:bg-[#2C2C2E]">
              Reject
            </button>
          </div>
        </div>

        {/* Action 2 */}
        <div className="panel p-4 border-l-4 border-l-[#00FF85]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-1">2. Install Driver Patch</p>
              <p className="text-xs text-text-400">Deploy HP Universal Print Driver v10.3.1 to affected devices</p>
            </div>
            <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">Safe</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-[#00FF85] text-[#0E0E0E] text-xs rounded hover:bg-[#00E676]">
              Approve
            </button>
            <button className="px-3 py-1 bg-[#1C1C1E] text-text-400 text-xs rounded hover:bg-[#2C2C2E]">
              Reject
            </button>
          </div>
        </div>

        {/* Action 3 */}
        <div className="panel p-4 border-l-4 border-l-[#00FF85]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-1">3. Restart Print Spooler</p>
              <p className="text-xs text-text-400">Restart Windows Print Spooler service on all affected devices</p>
            </div>
            <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">Safe</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-[#00FF85] text-[#0E0E0E] text-xs rounded hover:bg-[#00E676]">
              Approve
            </button>
            <button className="px-3 py-1 bg-[#1C1C1E] text-text-400 text-xs rounded hover:bg-[#2C2C2E]">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutionScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-white">Execution Log</h3>
        <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">In Progress</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-success mt-1" />
          <div className="flex-1">
            <p className="text-sm text-white mb-1">Ticket status updated</p>
            <p className="text-xs text-text-600">Completed in 0.3s</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-success mt-1" />
          <div className="flex-1">
            <p className="text-sm text-white mb-1">Driver patch deployed</p>
            <p className="text-xs text-text-600">12 devices updated - Completed in 28s</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {isActive ? (
            <div className="w-5 h-5 border-2 border-[#00FF85] border-t-transparent rounded-full animate-spin mt-1" />
          ) : (
            <CheckCircle className="w-5 h-5 text-success mt-1" />
          )}
          <div className="flex-1">
            <p className="text-sm text-white mb-1">Print spooler restarted</p>
            <p className="text-xs text-text-600">
              {isActive ? 'In progress...' : 'Completed in 19s'}
            </p>
          </div>
        </div>
      </div>

      {!isActive && (
        <div className="panel p-4 bg-success/5 border-success/30 mt-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-white font-medium">All actions completed successfully</p>
              <p className="text-xs text-text-400">Total execution time: 47 seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KBDraftScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-4 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#1C1C1E]/95 backdrop-blur-xl pb-4">
        <h3 className="font-space-grotesk text-white">KB Article Draft</h3>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 bg-[#00FF85]/20 text-[#00FF85] rounded">Auto-generated</span>
          <span className="text-xs px-2 py-1 bg-info/20 text-info rounded">Ready for review</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-text-600 mb-2">TITLE</p>
          <p className="text-lg text-white font-space-grotesk">
            Resolving HP Printer Driver BSOD Errors on Windows 11 22H2
          </p>
        </div>

        <div>
          <p className="text-xs text-text-600 mb-2">ISSUE DESCRIPTION</p>
          <p className="text-sm text-text-300">
            After updating to Windows 11 22H2, workstations with HP printers experience blue screen errors (BSOD) related to the HP Universal Print Driver v10.2.4. The issue affects multiple devices across the organization.
          </p>
        </div>

        <div>
          <p className="text-xs text-text-600 mb-2">ROOT CAUSE</p>
          <p className="text-sm text-text-300">
            The HP Universal Print Driver version 10.2.4 is incompatible with Windows 11 build 22621 (22H2 update). The driver causes a kernel-level conflict resulting in system crashes.
          </p>
        </div>

        <div>
          <p className="text-xs text-text-600 mb-2">SOLUTION STEPS</p>
          <ol className="text-sm text-text-300 space-y-2 list-decimal list-inside">
            <li>Deploy HP Universal Print Driver v10.3.1 to affected devices</li>
            <li>Restart Windows Print Spooler service</li>
            <li>Verify printer functionality</li>
            <li>Monitor for 24 hours to confirm resolution</li>
          </ol>
        </div>

        <div>
          <p className="text-xs text-text-600 mb-2">PREVENTION</p>
          <p className="text-sm text-text-300">
            Configure automatic driver updates through Windows Update or deploy driver updates centrally before major Windows updates. Test printer drivers in a staging environment before production deployment.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#00FF85]/20">
          <button className="bubo-btn-neon-primary flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Publish Article
          </button>
          <button className="bubo-btn-ghost">
            Edit Draft
          </button>
        </div>
      </div>
    </div>
  );
}

function ClosureScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="panel p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-white">Ticket Closure</h3>
        <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">Resolved</span>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel p-4 bg-success/5 border-success/30">
          <Clock className="w-5 h-5 text-success mb-2" />
          <p className="text-2xl font-space-grotesk text-white mb-1">6 min</p>
          <p className="text-xs text-text-400">Total resolution time</p>
        </div>

        <div className="panel p-4 bg-[#00FF85]/5 border-[#00FF85]/30">
          <TrendingUp className="w-5 h-5 text-[#00FF85] mb-2" />
          <p className="text-2xl font-space-grotesk text-white mb-1">87%</p>
          <p className="text-xs text-text-400">Faster than manual</p>
        </div>

        <div className="panel p-4 bg-info/5 border-info/30">
          <Shield className="w-5 h-5 text-info mb-2" />
          <p className="text-2xl font-space-grotesk text-white mb-1">100%</p>
          <p className="text-xs text-text-400">Success rate</p>
        </div>

        <div className="panel p-4 bg-[#00FF85]/5 border-[#00FF85]/30">
          <FileText className="w-5 h-5 text-[#00FF85] mb-2" />
          <p className="text-2xl font-space-grotesk text-white mb-1">+1</p>
          <p className="text-xs text-text-400">KB articles created</p>
        </div>
      </div>

      {/* Comparison */}
      <div className="panel p-6 bg-[#00FF85]/5 border-[#00FF85]/30">
        <h4 className="font-space-grotesk text-white mb-4">The BuboIQ Difference</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-400">Traditional IT Support</span>
            <span className="text-sm text-danger">45+ minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-400">BuboIQ AI Agent</span>
            <span className="text-sm text-[#00FF85] font-semibold">6 minutes</span>
          </div>
          <div className="h-px bg-[#00FF85]/20 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-white font-medium">Plus: KB Article Bonus</span>
            <span className="text-sm text-[#00FF85]">Compound value ✨</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-lg text-white font-space-grotesk mb-2">
          Want this on <span className="text-[#00FF85]">your devices</span>?
        </p>
        <p className="text-sm text-text-400">
          We'll wire a pilot in 24 hours. No commitment, no credit card required.
        </p>
      </div>
    </div>
  );
}
