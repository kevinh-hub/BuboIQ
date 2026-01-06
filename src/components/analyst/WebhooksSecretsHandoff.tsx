import React, { useState } from 'react';
import { Copy, Check, Code, FileText, Layout, Settings } from 'lucide-react';

export function WebhooksSecretsHandoff() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className="p-2 hover:bg-bg-850 rounded-lg transition-colors"
      aria-label={`Copy ${label}`}
    >
      {copiedItem === label ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4 text-text-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-space-grotesk mb-4">
            <span className="text-white">BUBO</span>
            <span className="text-accent">IQ</span>
            <span className="text-text-400 ml-3">Webhooks & Secrets — Handoff</span>
          </h1>
          <p className="text-text-400">
            Developer handoff materials for the production Webhooks & Secrets admin screen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-1">Responsive Variants</p>
            <p className="text-2xl font-space-grotesk text-white">4</p>
            <p className="text-xs text-text-600">1440/1280/1024/768</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-1">States</p>
            <p className="text-2xl font-space-grotesk text-white">6</p>
            <p className="text-xs text-text-600">Default/Loading/Empty/Error/Offline/Success</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-1">Copyable Blocks</p>
            <p className="text-2xl font-space-grotesk text-white">8</p>
            <p className="text-xs text-text-600">Per panel</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-text-400 mb-1">Interactive Elements</p>
            <p className="text-2xl font-space-grotesk text-white">44×44</p>
            <p className="text-xs text-text-600">WCAG AA compliant</p>
          </div>
        </div>

        {/* Section 1: Field Names & Data Contracts */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-space-grotesk text-white">Field Names & Data Contracts</h2>
          </div>

          <div className="panel p-6 mb-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Outbound Panel Fields</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-text-400">Field</div>
                <div className="text-text-400">Type</div>
                <div className="text-text-400">Validation</div>
              </div>
              {[
                { field: 'connectBaseUrl', type: 'string (URL)', validation: 'Required, must be HTTPS' },
                { field: 'outboundSecret', type: 'string (password)', validation: 'Min 16 chars, alphanumeric' },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 text-sm p-3 bg-bg-850 rounded-lg">
                  <code className="text-accent font-jetbrains-mono">{item.field}</code>
                  <span className="text-text-300">{item.type}</span>
                  <span className="text-text-400">{item.validation}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">Inbound Panel Fields</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-text-400">Field</div>
                <div className="text-text-400">Type</div>
                <div className="text-text-400">Validation</div>
              </div>
              {[
                { field: 'inboundSecret', type: 'string (password)', validation: 'Min 16 chars, alphanumeric' },
                { field: 'callbackUrl', type: 'string (read-only)', validation: '/api/connect/status' },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 text-sm p-3 bg-bg-850 rounded-lg">
                  <code className="text-accent font-jetbrains-mono">{item.field}</code>
                  <span className="text-text-300">{item.type}</span>
                  <span className="text-text-400">{item.validation}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Canonical Payloads */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-space-grotesk text-white">Canonical JSON Payloads</h2>
          </div>

          <div className="panel p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-space-grotesk text-white">Outbound to Connect</h3>
              <CopyButton 
                text='{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}'
                label="outbound-canonical"
              />
            </div>
            <div className="panel p-4 bg-bg-850 mb-4">
              <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto">
{`{
  "org_id": "1111-2222-3333-4444",
  "action_id": "aaaa-bbbb-cccc-dddd",
  "device_id": "zzzz-yyyy-xxxx-wwww",
  "action_type": "restart",
  "params": {
    "window": "now"
  },
  "rollback": {
    "script_id": "rb1"
  }
}`}
              </pre>
            </div>
            <div className="panel p-3 bg-info/10 border-info/30">
              <p className="text-xs text-text-300">
                <strong className="text-accent">Minified (sign these exact bytes):</strong>
              </p>
              <code className="text-xs font-jetbrains-mono text-text-300 break-all">
                {`{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}`}
              </code>
              <p className="text-xs text-text-300 mt-3">
                <strong className="text-accent">Expected HMAC-SHA256 (hex) with secret 'supersecret123':</strong>
              </p>
              <code className="text-xs font-jetbrains-mono text-success">
                0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28
              </code>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-space-grotesk text-white">Inbound from Connect</h3>
              <CopyButton 
                text='{"action_id":"aaaa-bbbb-cccc-dddd","job_id":"job_demo_1","status":"succeeded","started_at":"2025-10-22T15:01:00Z","ended_at":"2025-10-22T15:03:12Z","logs_url":"https://logs.example.com/job_demo_1"}'
                label="inbound-canonical"
              />
            </div>
            <div className="panel p-4 bg-bg-850 mb-4">
              <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto">
{`{
  "action_id": "aaaa-bbbb-cccc-dddd",
  "job_id": "job_demo_1",
  "status": "succeeded",
  "started_at": "2025-10-22T15:01:00Z",
  "ended_at": "2025-10-22T15:03:12Z",
  "logs_url": "https://logs.example.com/job_demo_1"
}`}
              </pre>
            </div>
            <div className="panel p-3 bg-info/10 border-info/30">
              <p className="text-xs text-text-300">
                <strong className="text-accent">Minified (sign these exact bytes):</strong>
              </p>
              <code className="text-xs font-jetbrains-mono text-text-300 break-all">
                {`{"action_id":"aaaa-bbbb-cccc-dddd","job_id":"job_demo_1","status":"succeeded","started_at":"2025-10-22T15:01:00Z","ended_at":"2025-10-22T15:03:12Z","logs_url":"https://logs.example.com/job_demo_1"}`}
              </code>
              <p className="text-xs text-text-300 mt-3">
                <strong className="text-accent">Expected HMAC-SHA256 (hex) with secret 'supersecret123':</strong>
              </p>
              <code className="text-xs font-jetbrains-mono text-success">
                0c08098f423a9b8311d5e8131df36e603a14c468389914be285342efb8c561d4
              </code>
            </div>
          </div>
        </section>

        {/* Section 3: HMAC Computation Guidance */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-space-grotesk text-white">HMAC Computation Guidance</h2>
          </div>

          <div className="panel p-6">
            <p className="text-sm text-text-300 mb-4">
              Compute <code className="text-accent font-jetbrains-mono">X-Bubo-Signature = HMAC_SHA256(secret, raw_body_bytes)</code>. 
              Use constant-time compare. Avoid reformatting body.
            </p>

            <div className="space-y-6">
              {/* Node.js Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-space-grotesk text-white">Node.js Implementation</h4>
                  <CopyButton 
                    text={`const crypto = require('crypto');

function computeSignature(secret, rawBody) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  return hmac.digest('hex');
}

// Usage
const signature = computeSignature('supersecret123', rawBodyString);
console.log(signature);
// Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                    label="node-example"
                  />
                </div>
                <pre className="panel p-4 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`const crypto = require('crypto');

function computeSignature(secret, rawBody) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  return hmac.digest('hex');
}

// Usage
const signature = computeSignature('supersecret123', rawBodyString);
console.log(signature);
// Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                </pre>
              </div>

              {/* Python Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-space-grotesk text-white">Python Implementation</h4>
                  <CopyButton 
                    text={`import hmac
import hashlib

def compute_signature(secret: str, raw_body: str) -> str:
    h = hmac.new(secret.encode(), raw_body.encode(), hashlib.sha256)
    return h.hexdigest()

# Usage
signature = compute_signature('supersecret123', raw_body_string)
print(signature)
# Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                    label="python-example"
                  />
                </div>
                <pre className="panel p-4 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`import hmac
import hashlib

def compute_signature(secret: str, raw_body: str) -> str:
    h = hmac.new(secret.encode(), raw_body.encode(), hashlib.sha256)
    return h.hexdigest()

# Usage
signature = compute_signature('supersecret123', raw_body_string)
print(signature)
# Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                </pre>
              </div>

              {/* Go Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-space-grotesk text-white">Go Implementation</h4>
                  <CopyButton 
                    text={`package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func computeSignature(secret, rawBody string) string {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write([]byte(rawBody))
    return hex.EncodeToString(h.Sum(nil))
}

// Usage
signature := computeSignature("supersecret123", rawBodyString)
fmt.Println(signature)
// Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                    label="go-example"
                  />
                </div>
                <pre className="panel p-4 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func computeSignature(secret, rawBody string) string {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write([]byte(rawBody))
    return hex.EncodeToString(h.Sum(nil))
}

// Usage
signature := computeSignature("supersecret123", rawBodyString)
fmt.Println(signature)
// Expected: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Component Props & Contracts */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-space-grotesk text-white">Component Props & Contracts</h2>
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-space-grotesk text-white mb-4">WebhooksSecretsProductionScreen</h3>
            <pre className="panel p-4 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300 mb-4">
{`interface WebhooksSecretsProps {
  // Optional: Pre-fill configuration
  initialConfig?: {
    outboundUrl?: string;
    outboundSecret?: string;
    inboundSecret?: string;
  };
  
  // Callbacks
  onSave?: (config: WebhookConfig) => Promise<void>;
  onTestOutbound?: (url: string, secret: string) => Promise<TestResult>;
  onTestInbound?: (secret: string) => Promise<TestResult>;
}

interface WebhookConfig {
  outboundUrl: string;
  outboundSecret: string;
  inboundSecret: string;
}

interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

// Usage
<WebhooksSecretsProductionScreen
  initialConfig={{
    outboundUrl: 'https://connect.example.com',
    outboundSecret: '***',
    inboundSecret: '***'
  }}
  onSave={async (config) => {
    // Save to backend
  }}
  onTestOutbound={async (url, secret) => {
    // Test outbound webhook
    return { success: true, message: 'Connect accepted signed action.' };
  }}
/>`}
            </pre>
          </div>
        </section>

        {/* Section 5: Accessibility Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Accessibility Checklist</h2>
          
          <div className="panel p-6">
            <div className="space-y-3">
              {[
                'All interactive elements have 44×44px touch targets',
                'Focus states visible with 2px accent-colored rings',
                'ARIA labels on icon-only buttons',
                'Keyboard navigation fully supported (Tab, Enter, Esc)',
                'Color contrast meets WCAG AA (4.5:1 for text)',
                'Form inputs have associated labels',
                'Error messages programmatically associated with inputs',
                'Loading states announced to screen readers',
                'Copy buttons provide feedback (visual + programmatic)',
                'Code blocks are selectable and copyable',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Responsive Breakpoints */}
        <section>
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Responsive Breakpoints</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="panel p-6">
              <h3 className="text-sm font-space-grotesk text-white mb-4">Layout Changes</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">1440px (Desktop XL)</p>
                  <p className="text-text-400">Two-column grid, full features</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">1280px (Desktop)</p>
                  <p className="text-text-400">Two-column grid, compact spacing</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">1024px (Tablet)</p>
                  <p className="text-text-400">Single column stack, increased padding</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">768px (Mobile)</p>
                  <p className="text-text-400">Single column, full-width buttons</p>
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <h3 className="text-sm font-space-grotesk text-white mb-4">Typography Scale</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">H1 (Page Title)</p>
                  <p className="text-text-400 font-jetbrains-mono">36px / 44px (Desktop) → 28px / 36px (Mobile)</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">H2 (Panel Title)</p>
                  <p className="text-text-400 font-jetbrains-mono">24px / 32px (Desktop) → 20px / 28px (Mobile)</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">Body Text</p>
                  <p className="text-text-400 font-jetbrains-mono">16px / 24px (All viewports)</p>
                </div>
                <div className="p-3 bg-bg-850 rounded-lg">
                  <p className="text-accent mb-1">Code Blocks</p>
                  <p className="text-text-400 font-jetbrains-mono">13px / 18px (All viewports)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
