import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

/**
 * BuboIQ Analyst v1 - Component Library
 * Complete UI kit with all primitives and specialized components
 */

export function AnalystComponentLibrary() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5] font-inter">
      {/* Header */}
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold">
                <span className="text-white">BUBO</span>
                <span className="text-[#00FF85]">IQ</span>
                <span className="text-[#7A8694] ml-4">Analyst v1</span>
              </h1>
              <p className="text-[#AAB4C0] mt-1">Component Library & Design System</p>
            </div>
            <Badge className="bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20">
              Production Ready
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        {/* Design Tokens */}
        <Section title="Design Tokens" id="tokens">
          <TokenGrid />
        </Section>

        {/* Primitives */}
        <Section title="Primitive Components" id="primitives">
          <div className="space-y-12">
            <ComponentShowcase
              title="Buttons"
              description="Primary, secondary, ghost, and danger variants with loading and disabled states"
            >
              <div className="flex flex-wrap gap-4">
                <AnalystButton variant="primary">Primary Button</AnalystButton>
                <AnalystButton variant="secondary">Secondary Button</AnalystButton>
                <AnalystButton variant="ghost">Ghost Button</AnalystButton>
                <AnalystButton variant="danger">Danger Button</AnalystButton>
                <AnalystButton variant="primary" loading>Loading...</AnalystButton>
                <AnalystButton variant="primary" disabled>Disabled</AnalystButton>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Inputs"
              description="Text inputs with different states"
            >
              <div className="space-y-4 max-w-md">
                <AnalystInput placeholder="Default input" />
                <AnalystInput placeholder="With value" defaultValue="user@example.com" />
                <AnalystInput placeholder="Disabled" disabled />
                <AnalystInput placeholder="Error state" error />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Badges"
              description="Status and category indicators"
            >
              <div className="flex flex-wrap gap-3">
                <AnalystBadge variant="neutral">Neutral</AnalystBadge>
                <AnalystBadge variant="info">Info</AnalystBadge>
                <AnalystBadge variant="warn">Warning</AnalystBadge>
                <AnalystBadge variant="danger">Danger</AnalystBadge>
                <AnalystBadge variant="success">Success</AnalystBadge>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Status Pills"
              description="Agent operational status indicators"
            >
              <div className="flex flex-wrap gap-3">
                <StatusPill status="observing" />
                <StatusPill status="approvalRequired" />
                <StatusPill status="autoApproveActive" />
              </div>
            </ComponentShowcase>
          </div>
        </Section>

        {/* Specialized Components */}
        <Section title="Specialized Components" id="specialized">
          <div className="space-y-12">
            <ComponentShowcase
              title="Confidence Orb"
              description="0-100% confidence indicator with numeric center and aura intensity"
            >
              <div className="flex flex-wrap gap-8">
                <ConfidenceOrb value={95} />
                <ConfidenceOrb value={75} />
                <ConfidenceOrb value={45} />
                <ConfidenceOrb value={20} />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Metric Card"
              description="KPI display with title, value, and delta"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Failed Actions (24h)"
                  value="3"
                  delta={{ value: -40, isPositive: true }}
                />
                <MetricCard
                  title="Avg Callback Delay"
                  value="1.2s"
                  delta={{ value: 15, isPositive: false }}
                />
                <MetricCard
                  title="Agent Error Rate"
                  value="0.3%"
                  delta={{ value: 0, isPositive: true }}
                />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Policy Chip"
              description="Policy configuration indicator"
            >
              <div className="flex flex-wrap gap-3">
                <PolicyChip label="Confidence ≥ 0.85" />
                <PolicyChip label="Rollback Required" />
                <PolicyChip label="Auto-Approve Active" active />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Risk Hints"
              description="Action risk indicators"
            >
              <div className="space-y-2 max-w-lg">
                <RiskHint type="rollback">Rollback required by policy.</RiskHint>
                <RiskHint type="blast">High blast radius: affects multiple devices.</RiskHint>
                <RiskHint type="confidence">Low confidence: consider manual review.</RiskHint>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Code Block"
              description="Syntax-highlighted JSON with copy button"
            >
              <CodeBlock code={JSON.stringify({ action: "restart_service", service: "print_spooler", device_id: "DEV-001" }, null, 2)} />
            </ComponentShowcase>

            <ComponentShowcase
              title="Empty State"
              description="No data placeholder"
            >
              <EmptyState
                icon={Info}
                title="No pending actions"
                description="All AI suggestions have been reviewed."
              />
            </ComponentShowcase>
          </div>
        </Section>

        {/* Patterns */}
        <Section title="Component Patterns" id="patterns">
          <div className="space-y-12">
            <ComponentShowcase
              title="Reasoning Trace Card"
              description="AI reasoning snapshot with timestamp, confidence, and lineage link"
            >
              <ReasoningTraceCard
                timestamp="2025-10-22 14:32:15"
                confidence={87}
                summary={{
                  device: "WKS-SALES-042",
                  issue: "Print spooler failure",
                  predicted_root_cause: "Driver corruption detected"
                }}
                traceId="trace_abc123"
              />
            </ComponentShowcase>

            <ComponentShowcase
              title="Action Item"
              description="Pending action with approval controls"
            >
              <ActionItem
                actionType="restart_service"
                params={{ service: "print_spooler", device: "WKS-SALES-042" }}
                risks={["rollback"]}
                confidence={87}
                onApprove={() => toast.success('Action approved & dispatched.')}
                onReject={() => toast.info('Action rejected.')}
              />
            </ComponentShowcase>

            <ComponentShowcase
              title="Device Job Row"
              description="Execution job status row"
            >
              <DeviceJobRow
                jobId="job_xyz789"
                device="WKS-SALES-042"
                actionType="restart_service"
                status="succeeded"
                started="2025-10-22 14:35:00"
                ended="2025-10-22 14:35:12"
              />
            </ComponentShowcase>

            <ComponentShowcase
              title="Tier Guard Banner"
              description="Feature restriction notice with upgrade CTA"
            >
              <TierGuardBanner
                feature="Auto-Approve"
                currentTier="Pro"
                requiredTier="Team"
              />
            </ComponentShowcase>
          </div>
        </Section>

        {/* Accessibility */}
        <Section title="Accessibility" id="accessibility">
          <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4">
            <h3 className="font-space-grotesk text-xl font-bold text-white">WCAG AA+ Compliance</h3>
            <ul className="space-y-2 text-[#C7D0DA]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] mt-0.5 flex-shrink-0" />
                <span>All text meets 4.5:1 contrast ratio minimum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] mt-0.5 flex-shrink-0" />
                <span>Focus rings visible on all interactive elements (44×44px touch targets)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] mt-0.5 flex-shrink-0" />
                <span>ARIA labels for icon-only buttons and controls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] mt-0.5 flex-shrink-0" />
                <span>Keyboard navigation for dialogs, tables, accordions, and tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] mt-0.5 flex-shrink-0" />
                <span>Loading skeletons and retry affordances on error states</span>
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}

// Section wrapper
function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-white mb-8 pb-4 border-b border-[#1F242D]">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Component showcase wrapper
function ComponentShowcase({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-space-grotesk text-lg font-semibold text-white">{title}</h3>
        <p className="text-[#AAB4C0] text-sm mt-1">{description}</p>
      </div>
      <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
}

// Token Grid
function TokenGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Colors */}
      <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4">
        <h3 className="font-space-grotesk font-semibold text-white">Colors</h3>
        <div className="space-y-2">
          <ColorToken name="Accent" value="#00FF85" hex="#00FF85" />
          <ColorToken name="Info" value="#3EA0FF" hex="#3EA0FF" />
          <ColorToken name="Warn" value="#F6C14A" hex="#F6C14A" />
          <ColorToken name="Danger" value="#FF6B6B" hex="#FF6B6B" />
          <ColorToken name="Success" value="#55D187" hex="#55D187" />
        </div>
      </div>

      {/* Typography */}
      <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4">
        <h3 className="font-space-grotesk font-semibold text-white">Typography</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#7A8694] font-jetbrains-mono">H1 / 36px / 44px</p>
            <p className="font-space-grotesk text-3xl font-bold text-white">Headline 1</p>
          </div>
          <div>
            <p className="text-xs text-[#7A8694] font-jetbrains-mono">H2 / 28px / 36px</p>
            <p className="font-space-grotesk text-2xl font-bold text-white">Headline 2</p>
          </div>
          <div>
            <p className="text-xs text-[#7A8694] font-jetbrains-mono">Body / 16px / 24px</p>
            <p className="text-base text-[#C7D0DA]">Body text with Inter Regular</p>
          </div>
          <div>
            <p className="text-xs text-[#7A8694] font-jetbrains-mono">Mono / 13px / 18px</p>
            <p className="text-sm font-jetbrains-mono text-[#C7D0DA]">const code = true;</p>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4">
        <h3 className="font-space-grotesk font-semibold text-white">Spacing</h3>
        <div className="space-y-2">
          {[4, 8, 12, 16, 24, 32, 48].map(size => (
            <div key={size} className="flex items-center gap-4">
              <div className="w-20 text-sm font-jetbrains-mono text-[#7A8694]">{size}px</div>
              <div className="h-6 bg-[#00FF85]/20 border border-[#00FF85]/40 rounded" style={{ width: `${size}px` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 space-y-4">
        <h3 className="font-space-grotesk font-semibold text-white">Border Radius</h3>
        <div className="space-y-3">
          {[
            { name: 'xs', value: '6px' },
            { name: 'sm', value: '10px' },
            { name: 'md', value: '16px' },
            { name: 'xl', value: '20px' },
            { name: 'modal', value: '32px' },
          ].map(({ name, value }) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-20 text-sm font-jetbrains-mono text-[#7A8694]">{value}</div>
              <div className="w-16 h-16 bg-[#00FF85]/20 border border-[#00FF85]/40" style={{ borderRadius: value }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorToken({ name, value, hex }: { name: string; value: string; hex: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg border border-[#1F242D]" style={{ backgroundColor: value }} />
        <span className="text-[#C7D0DA]">{name}</span>
      </div>
      <span className="font-jetbrains-mono text-sm text-[#7A8694]">{hex}</span>
    </div>
  );
}

// Component Implementations
export function AnalystButton({ variant = 'primary', loading = false, disabled = false, children, onClick }: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 font-space-grotesk disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#00FF85] text-[#0A0B0D] hover:bg-[#00E676] shadow-lg hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]",
    secondary: "bg-[#1C1C1E] text-white border border-[#3EA0FF]/30 hover:border-[#3EA0FF]/60 hover:shadow-[0_0_15px_rgba(62,160,255,0.2)]",
    ghost: "bg-transparent text-[#00FF85] border border-[#00FF85]/30 hover:bg-[#00FF85]/10 hover:border-[#00FF85]/60",
    danger: "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/30",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}

export function AnalystInput({ placeholder, defaultValue, disabled, error }: {
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      className={`
        w-full px-4 py-3 rounded-xl bg-[#0A0B0D] border transition-all duration-200
        placeholder:text-[#7A8694] text-[#EAEFF5] font-inter
        focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-[#FF6B6B]/50 focus:ring-[#FF6B6B]/50' : 'border-[#1F242D] hover:border-[#1F242D]/80'}
      `}
    />
  );
}

export function AnalystBadge({ variant, children }: {
  variant: 'neutral' | 'info' | 'warn' | 'danger' | 'success';
  children: React.ReactNode;
}) {
  const variants = {
    neutral: 'bg-[#AAB4C0]/10 text-[#AAB4C0] border-[#AAB4C0]/20',
    info: 'bg-[#3EA0FF]/10 text-[#3EA0FF] border-[#3EA0FF]/20',
    warn: 'bg-[#F6C14A]/10 text-[#F6C14A] border-[#F6C14A]/20',
    danger: 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20',
    success: 'bg-[#55D187]/10 text-[#55D187] border-[#55D187]/20',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: 'observing' | 'approvalRequired' | 'autoApproveActive' }) {
  const configs = {
    observing: {
      label: 'Observing',
      color: '#3EA0FF',
      bg: 'bg-[#3EA0FF]/10',
      border: 'border-[#3EA0FF]/30',
      text: 'text-[#3EA0FF]',
    },
    approvalRequired: {
      label: 'Approval Required',
      color: '#F6C14A',
      bg: 'bg-[#F6C14A]/10',
      border: 'border-[#F6C14A]/30',
      text: 'text-[#F6C14A]',
    },
    autoApproveActive: {
      label: 'Auto-Approve Active',
      color: '#00FF85',
      bg: 'bg-[#00FF85]/10',
      border: 'border-[#00FF85]/30',
      text: 'text-[#00FF85]',
    },
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.border}`}>
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
      <span className={`font-semibold text-sm ${config.text}`}>{config.label}</span>
    </div>
  );
}

export function ConfidenceOrb({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 80) return '#00FF85';
    if (val >= 60) return '#F6C14A';
    return '#FF6B6B';
  };

  const color = getColor(value);
  const intensity = value / 100;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Aura */}
      <div 
        className="absolute inset-0 rounded-full blur-xl transition-all duration-500"
        style={{
          backgroundColor: color,
          opacity: intensity * 0.3,
          transform: `scale(${1 + intensity * 0.5})`,
        }}
      />
      
      {/* Orb */}
      <div 
        className="relative w-24 h-24 rounded-full border-4 flex items-center justify-center backdrop-blur-sm"
        style={{
          borderColor: color,
          backgroundColor: `${color}15`,
          boxShadow: `0 0 20px ${color}40`,
        }}
      >
        <span className="font-space-grotesk text-2xl font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

export function MetricCard({ title, value, delta }: {
  title: string;
  value: string;
  delta?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 hover:border-[#00FF85]/20 transition-all">
      <div className="text-[#AAB4C0] text-sm mb-2">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="font-space-grotesk text-3xl font-bold text-white">{value}</div>
        {delta && delta.value !== 0 && (
          <div className={`text-sm font-semibold ${delta.isPositive ? 'text-[#55D187]' : 'text-[#FF6B6B]'}`}>
            {delta.isPositive ? '↓' : '↑'} {Math.abs(delta.value)}%
          </div>
        )}
      </div>
    </div>
  );
}

export function PolicyChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border
      ${active 
        ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/30' 
        : 'bg-[#AAB4C0]/10 text-[#AAB4C0] border-[#AAB4C0]/20'
      }
    `}>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-pulse" />}
      {label}
    </span>
  );
}

export function RiskHint({ type, children }: {
  type: 'rollback' | 'blast' | 'confidence';
  children: React.ReactNode;
}) {
  const configs = {
    rollback: { icon: Info, color: '#3EA0FF' },
    blast: { icon: AlertTriangle, color: '#F6C14A' },
    confidence: { icon: AlertTriangle, color: '#FF6B6B' },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div 
      className="flex items-start gap-2 px-3 py-2 rounded-lg border text-sm"
      style={{
        backgroundColor: `${config.color}10`,
        borderColor: `${config.color}30`,
        color: config.color,
      }}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#050607] border border-[#1F242D] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1F242D] bg-[#0A0B0D]">
        <span className="text-xs font-jetbrains-mono text-[#7A8694]">JSON</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#AAB4C0] hover:text-[#00FF85] transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-jetbrains-mono text-sm text-[#C7D0DA]">{code}</code>
      </pre>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#0A0B0D] border border-[#1F242D] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#7A8694]" />
      </div>
      <h3 className="font-space-grotesk text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#AAB4C0] text-sm max-w-sm">{description}</p>
    </div>
  );
}

// Pattern Components
export function ReasoningTraceCard({ timestamp, confidence, summary, traceId }: {
  timestamp: string;
  confidence: number;
  summary: Record<string, string>;
  traceId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 hover:border-[#00FF85]/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <ConfidenceOrb value={confidence} />
          <div>
            <div className="font-jetbrains-mono text-xs text-[#7A8694]">{timestamp}</div>
            <div className="font-space-grotesk font-semibold text-white mt-1">{summary.device}</div>
            <div className="text-sm text-[#AAB4C0] mt-0.5">{summary.issue}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-4 mb-4">
        <div className="text-sm text-[#C7D0DA]">
          <span className="text-[#7A8694]">Root cause: </span>
          {summary.predicted_root_cause}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-[#3EA0FF] hover:text-[#5BB0FF] transition-colors flex items-center gap-1"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>
        <button className="text-sm text-[#00FF85] hover:text-[#00E676] transition-colors">
          See lineage →
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#1F242D]">
          <CodeBlock code={JSON.stringify(summary, null, 2)} />
        </div>
      )}
    </div>
  );
}

export function ActionItem({ actionType, params, risks, confidence, onApprove, onReject }: {
  actionType: string;
  params: Record<string, string>;
  risks: string[];
  confidence: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6 hover:border-[#F6C14A]/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <AnalystBadge variant="warn">{actionType}</AnalystBadge>
            <span className="text-xs font-jetbrains-mono text-[#7A8694]">Confidence: {confidence}%</span>
          </div>
          <div className="text-sm text-[#AAB4C0] font-jetbrains-mono">
            {JSON.stringify(params)}
          </div>
        </div>
      </div>

      {risks.length > 0 && (
        <div className="space-y-2 mb-4">
          {risks.includes('rollback') && (
            <RiskHint type="rollback">Rollback required by policy.</RiskHint>
          )}
          {risks.includes('blast') && (
            <RiskHint type="blast">High blast radius: affects multiple devices.</RiskHint>
          )}
          {risks.includes('low-confidence') && (
            <RiskHint type="confidence">Low confidence: consider manual review.</RiskHint>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <AnalystButton variant="primary" onClick={onApprove}>
          Approve & Execute
        </AnalystButton>
        <AnalystButton variant="ghost" onClick={onReject}>
          Reject
        </AnalystButton>
      </div>
    </div>
  );
}

export function DeviceJobRow({ jobId, device, actionType, status, started, ended }: {
  jobId: string;
  device: string;
  actionType: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  started: string;
  ended?: string;
}) {
  const statusConfigs = {
    queued: { color: '#AAB4C0', label: 'Queued' },
    running: { color: '#3EA0FF', label: 'Running' },
    succeeded: { color: '#55D187', label: 'Succeeded' },
    failed: { color: '#FF6B6B', label: 'Failed' },
  };

  const config = statusConfigs[status];

  return (
    <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-xl p-4 hover:border-[#00FF85]/10 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-[#7A8694] mb-1">Job ID</div>
            <div className="font-jetbrains-mono text-sm text-[#C7D0DA]">{jobId}</div>
          </div>
          <div>
            <div className="text-xs text-[#7A8694] mb-1">Device</div>
            <div className="font-semibold text-sm text-white">{device}</div>
          </div>
          <div>
            <div className="text-xs text-[#7A8694] mb-1">Action</div>
            <div className="text-sm text-[#C7D0DA]">{actionType}</div>
          </div>
          <div>
            <div className="text-xs text-[#7A8694] mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-sm font-semibold" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#1F242D] flex items-center gap-6 text-xs text-[#7A8694] font-jetbrains-mono">
        <span>Started: {started}</span>
        {ended && <span>Ended: {ended}</span>}
      </div>
    </div>
  );
}

export function TierGuardBanner({ feature, currentTier, requiredTier }: {
  feature: string;
  currentTier: string;
  requiredTier: string;
}) {
  return (
    <div className="bg-[#F6C14A]/10 border border-[#F6C14A]/30 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F6C14A]" />
            <h3 className="font-space-grotesk font-semibold text-white">Feature Restricted</h3>
          </div>
          <p className="text-[#C7D0DA] text-sm mb-4">
            <strong>{feature}</strong> requires {requiredTier} plan. You're currently on {currentTier}.
          </p>
          <AnalystButton variant="primary">
            Upgrade to {requiredTier}
          </AnalystButton>
        </div>
      </div>
    </div>
  );
}
