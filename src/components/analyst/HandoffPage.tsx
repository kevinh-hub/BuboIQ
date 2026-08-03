import React, { useState } from 'react';
import { Copy, Check, Download, Code, Palette, FileCode } from 'lucide-react';
import { AnalystButton, ConfidenceOrb, CodeBlock } from './AnalystComponentLibrary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { toast } from 'sonner';

/**
 * BuboIQ Analyst v1 - Developer Handoff Page
 * Complete tokens, redlines, JSX examples, and implementation guide
 */

export function HandoffPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (code: string, section: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      {/* Header */}
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold mb-2">
                <span className="text-white">Developer Handoff</span>
              </h1>
              <p className="text-[#AAB4C0]">
                Complete design tokens, component examples, and implementation guide
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AnalystButton variant="ghost" onClick={() => toast.info('Downloading assets...')}>
                <Download className="w-4 h-4 mr-2" />
                Download Assets
              </AnalystButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <Tabs defaultValue="tokens" className="space-y-8">
          <TabsList className="bg-[#0A0B0D] border border-[#1F242D] p-1">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-[#00FF85]/10 data-[state=active]:text-[#00FF85]">
              <Palette className="w-4 h-4 mr-2" />
              Design Tokens
            </TabsTrigger>
            <TabsTrigger value="components" className="data-[state=active]:bg-[#00FF85]/10 data-[state=active]:text-[#00FF85]">
              <Code className="w-4 h-4 mr-2" />
              Component Examples
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-[#00FF85]/10 data-[state=active]:text-[#00FF85]">
              <FileCode className="w-4 h-4 mr-2" />
              Pattern Library
            </TabsTrigger>
          </TabsList>

          {/* Design Tokens */}
          <TabsContent value="tokens" className="space-y-8">
            <Section title="Tailwind Configuration">
              <p className="text-[#AAB4C0] mb-6">
                Import these tokens into your <code className="font-jetbrains-mono text-[#00FF85]">tailwind.config.js</code>
              </p>
              <CodeSection
                title="tailwind.config.js"
                code={tailwindConfig}
                onCopy={() => copyToClipboard(tailwindConfig, 'tailwind')}
                copied={copiedSection === 'tailwind'}
              />
            </Section>

            <Section title="CSS Variables">
              <p className="text-[#AAB4C0] mb-6">
                Add these CSS custom properties to your global stylesheet
              </p>
              <CodeSection
                title="globals.css"
                code={cssVariables}
                onCopy={() => copyToClipboard(cssVariables, 'css')}
                copied={copiedSection === 'css'}
              />
            </Section>

            <Section title="Redlines & Specifications">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RedlineCard
                  title="Typography Scale"
                  specs={[
                    { label: 'H1', value: '36px / 44px / Space Grotesk Bold' },
                    { label: 'H2', value: '28px / 36px / Space Grotesk Bold' },
                    { label: 'H3', value: '22px / 30px / Space Grotesk SemiBold' },
                    { label: 'Body', value: '16px / 24px / Inter Regular' },
                    { label: 'Small', value: '14px / 20px / Inter Regular' },
                    { label: 'Mono', value: '13px / 18px / JetBrains Mono' },
                  ]}
                />
                <RedlineCard
                  title="Spacing System"
                  specs={[
                    { label: 'XS', value: '4px' },
                    { label: 'SM', value: '8px' },
                    { label: 'MD', value: '12px' },
                    { label: 'Base', value: '16px' },
                    { label: 'LG', value: '24px' },
                    { label: 'XL', value: '32px' },
                    { label: '2XL', value: '48px' },
                  ]}
                />
                <RedlineCard
                  title="Border Radius"
                  specs={[
                    { label: 'XS', value: '6px' },
                    { label: 'SM', value: '10px' },
                    { label: 'MD', value: '16px' },
                    { label: 'XL', value: '20px (default)' },
                    { label: 'Modal', value: '32px' },
                  ]}
                />
                <RedlineCard
                  title="Elevation (Shadows)"
                  specs={[
                    { label: 'Tiny', value: '0 1px 2px rgba(0,0,0,0.5)' },
                    { label: 'Card', value: '0 8px 24px rgba(0,0,0,0.5)' },
                    { label: 'Modal', value: '0 16px 48px rgba(0,0,0,0.5)' },
                  ]}
                />
              </div>
            </Section>
          </TabsContent>

          {/* Component Examples */}
          <TabsContent value="components" className="space-y-8">
            <Section title="ConfidenceOrb Component">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-space-grotesk font-semibold text-white mb-4">Live Example</h3>
                  <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-8 flex items-center justify-center">
                    <ConfidenceOrb value={87} />
                  </div>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-semibold text-white mb-4">JSX Implementation</h3>
                  <CodeSection
                    code={confidenceOrbExample}
                    onCopy={() => copyToClipboard(confidenceOrbExample, 'orb')}
                    copied={copiedSection === 'orb'}
                  />
                  <div className="mt-4 bg-[#0A0B0D] border border-[#1F242D] rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Props Contract</h4>
                    <div className="text-sm font-jetbrains-mono text-[#C7D0DA] space-y-1">
                      <div><span className="text-[#00FF85]">value</span>: number (0-100)</div>
                      <div className="text-xs text-[#7A8694] mt-2">
                        Aura intensity scales with value. Color changes based on threshold (≥80: green, ≥60: yellow, <60: red)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="ReasoningTraceCard Component">
              <CodeSection
                title="Usage Example"
                code={reasoningTraceExample}
                onCopy={() => copyToClipboard(reasoningTraceExample, 'trace')}
                copied={copiedSection === 'trace'}
              />
              <div className="mt-4 bg-[#0A0B0D] border border-[#1F242D] rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Props Contract</h4>
                <div className="text-sm font-jetbrains-mono text-[#C7D0DA] space-y-2">
                  <div><span className="text-[#00FF85]">timestamp</span>: string</div>
                  <div><span className="text-[#00FF85]">confidence</span>: number (0-100)</div>
                  <div><span className="text-[#00FF85]">summary</span>: Record<string, string></div>
                  <div><span className="text-[#00FF85]">traceId</span>: string</div>
                </div>
              </div>
            </Section>

            <Section title="ActionItem Component">
              <CodeSection
                title="Usage Example"
                code={actionItemExample}
                onCopy={() => copyToClipboard(actionItemExample, 'action')}
                copied={copiedSection === 'action'}
              />
              <div className="mt-4 bg-[#0A0B0D] border border-[#1F242D] rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Props Contract</h4>
                <div className="text-sm font-jetbrains-mono text-[#C7D0DA] space-y-2">
                  <div><span className="text-[#00FF85]">actionType</span>: string</div>
                  <div><span className="text-[#00FF85]">params</span>: Record<string, string></div>
                  <div><span className="text-[#00FF85]">risks</span>: string[] (rollback | blast | low-confidence)</div>
                  <div><span className="text-[#00FF85]">confidence</span>: number</div>
                  <div><span className="text-[#00FF85]">onApprove</span>: () => void</div>
                  <div><span className="text-[#00FF85]">onReject</span>: () => void</div>
                </div>
              </div>
            </Section>

            <Section title="TierGuardBanner Component">
              <CodeSection
                title="Usage Example"
                code={tierGuardExample}
                onCopy={() => copyToClipboard(tierGuardExample, 'tier')}
                copied={copiedSection === 'tier'}
              />
            </Section>
          </TabsContent>

          {/* Pattern Library */}
          <TabsContent value="patterns" className="space-y-8">
            <Section title="State Management Patterns">
              <CodeSection
                title="Agent Status State"
                code={stateManagementExample}
                onCopy={() => copyToClipboard(stateManagementExample, 'state')}
                copied={copiedSection === 'state'}
              />
            </Section>

            <Section title="Policy Configuration Pattern">
              <CodeSection
                title="Policy Settings Form"
                code={policyPatternExample}
                onCopy={() => copyToClipboard(policyPatternExample, 'policy')}
                copied={copiedSection === 'policy'}
              />
            </Section>

            <Section title="Microcopy Reference">
              <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
                <h3 className="font-space-grotesk font-semibold text-white mb-4">Exact Strings to Use</h3>
                <div className="space-y-4">
                  <MicrocopySection
                    title="Status Pills"
                    items={[
                      'Observing',
                      'Approval Required',
                      'Auto-Approve Active',
                    ]}
                  />
                  <MicrocopySection
                    title="Guardrails"
                    items={[
                      'AI suggestions require review.',
                    ]}
                  />
                  <MicrocopySection
                    title="Risk Hints"
                    items={[
                      'Rollback required by policy.',
                      'High blast radius: affects multiple devices.',
                      'Low confidence: consider manual review.',
                    ]}
                  />
                  <MicrocopySection
                    title="Kill Switch"
                    items={[
                      'Observe-Only is enabled. Executable actions are paused.',
                    ]}
                  />
                  <MicrocopySection
                    title="Toasts"
                    items={[
                      'Action approved & dispatched.',
                      'Ticket updated.',
                      'Draft saved.',
                      'Embedding generated.',
                      'Policy saved.',
                    ]}
                  />
                </div>
              </div>
            </Section>

            <Section title="Responsive Breakpoints">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BreakpointCard name="Desktop XL" width="1440px" />
                <BreakpointCard name="Desktop" width="1280px" />
                <BreakpointCard name="Laptop" width="1024px" />
                <BreakpointCard name="Tablet" width="768px" />
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-space-grotesk text-2xl font-bold text-white mb-6 pb-3 border-b border-[#1F242D]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CodeSection({ 
  title, 
  code, 
  onCopy, 
  copied 
}: { 
  title?: string; 
  code: string; 
  onCopy: () => void; 
  copied: boolean;
}) {
  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1F242D] bg-[#050607]">
        {title && <span className="font-jetbrains-mono text-sm text-[#7A8694]">{title}</span>}
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#AAB4C0] hover:text-[#00FF85] transition-colors rounded-lg hover:bg-[#1F242D]/50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto">
        <code className="font-jetbrains-mono text-sm text-[#C7D0DA]">{code}</code>
      </pre>
    </div>
  );
}

function RedlineCard({ title, specs }: { title: string; specs: Array<{ label: string; value: string }> }) {
  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
      <h3 className="font-space-grotesk font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-[#AAB4C0]">{spec.label}</span>
            <span className="font-jetbrains-mono text-sm text-[#C7D0DA]">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MicrocopySection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-b border-[#1F242D] pb-4 last:border-0 last:pb-0">
      <h4 className="text-sm font-semibold text-[#7A8694] mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-[#C7D0DA] font-jetbrains-mono">
            &quot;{item}&quot;
          </li>
        ))}
      </ul>
    </div>
  );
}

function BreakpointCard({ name, width }: { name: string; width: string }) {
  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-xl p-4">
      <div className="text-sm text-[#AAB4C0] mb-1">{name}</div>
      <div className="font-jetbrains-mono text-xl font-bold text-[#00FF85]">{width}</div>
    </div>
  );
}

// Code Examples
const tailwindConfig = `module.exports = {
  theme: {
    extend: {
      colors: {
        analyst: {
          bg: {
            950: '#050607',
            900: '#0A0B0D',
            850: '#0E1014',
          },
          border: '#1F242D',
          divider: '#14181F',
          text: {
            100: '#EAEFF5',
            300: '#C7D0DA',
            400: '#AAB4C0',
            600: '#7A8694',
          },
          accent: '#00FF85',
          info: '#3EA0FF',
          warn: '#F6C14A',
          danger: '#FF6B6B',
          success: '#55D187',
        },
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'analyst-xs': '6px',
        'analyst-sm': '10px',
        'analyst-md': '16px',
        'analyst-xl': '20px',
        'analyst-modal': '32px',
      },
      boxShadow: {
        'analyst-tiny': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'analyst-card': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'analyst-modal': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
    },
  },
};`;

const cssVariables = `:root {
  /* BuboIQ Analyst Tokens */
  --analyst-bg-950: #050607;
  --analyst-bg-900: #0A0B0D;
  --analyst-bg-850: #0E1014;
  --analyst-panel-glass: rgba(15, 18, 22, 0.82);
  --analyst-border: #1F242D;
  --analyst-text-100: #EAEFF5;
  --analyst-accent: #00FF85;
  --analyst-info: #3EA0FF;
  --analyst-warn: #F6C14A;
  --analyst-danger: #FF6B6B;
  --analyst-success: #55D187;
}`;

const confidenceOrbExample = `import { ConfidenceOrb } from './components/analyst/AnalystComponentLibrary';

function MyComponent() {
  return (
    <div>
      <ConfidenceOrb value={87} />
    </div>
  );
}`;

const reasoningTraceExample = `import { ReasoningTraceCard } from './components/analyst/AnalystComponentLibrary';

function MyComponent() {
  return (
    <ReasoningTraceCard
      timestamp="2025-10-22 14:32:15"
      confidence={87}
      summary={{
        device: 'WKS-SALES-042',
        issue: 'Print spooler failure',
        predicted_root_cause: 'Driver corruption detected',
      }}
      traceId="trace_abc123"
    />
  );
}`;

const actionItemExample = `import { ActionItem } from './components/analyst/AnalystComponentLibrary';

function MyComponent() {
  return (
    <ActionItem
      actionType="restart_service"
      params={{ service: 'print_spooler', device: 'WKS-SALES-042' }}
      risks={['rollback']}
      confidence={87}
      onApprove={() => console.log('Approved')}
      onReject={() => console.log('Rejected')}
    />
  );
}`;

const tierGuardExample = `import { TierGuardBanner } from './components/analyst/AnalystComponentLibrary';

function MyComponent() {
  return (
    <TierGuardBanner
      feature="Auto-Approve"
      currentTier="Pro"
      requiredTier="Team"
    />
  );
}`;

const stateManagementExample = `import { useState } from 'react';
import { StatusPill } from './components/analyst/AnalystComponentLibrary';

type AgentStatus = 'observing' | 'approvalRequired' | 'autoApproveActive';

function MyComponent() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('approvalRequired');

  return (
    <div>
      <StatusPill status={agentStatus} />
    </div>
  );
}`;

const policyPatternExample = `import { useState } from 'react';
import { PolicyChip } from './components/analyst/AnalystComponentLibrary';
import { Slider } from './components/ui/slider';

function PolicySettings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  return (
    <div>
      <h3>Confidence Threshold</h3>
      <Slider
        value={[confidenceThreshold]}
        onValueChange={(v) => setConfidenceThreshold(v[0])}
        min={50}
        max={95}
        step={5}
      />
      <PolicyChip label={\`Confidence ≥ \${confidenceThreshold}%\`} active />
    </div>
  );
}`;
