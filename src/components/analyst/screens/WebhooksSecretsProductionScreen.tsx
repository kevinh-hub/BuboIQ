import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Loader2, ExternalLink, Info } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

export function WebhooksSecretsProductionScreen() {
  const [outboundUrl, setOutboundUrl] = useState('https://connect.example.com');
  const [outboundSecret, setOutboundSecret] = useState('supersecret123');
  const [inboundSecret, setInboundSecret] = useState('supersecret123');
  const [showOutboundSecret, setShowOutboundSecret] = useState(false);
  const [showInboundSecret, setShowInboundSecret] = useState(false);
  
  const [outboundTesting, setOutboundTesting] = useState(false);
  const [inboundTesting, setInboundTesting] = useState(false);
  const [outboundResult, setOutboundResult] = useState<TestResult | null>(null);
  const [inboundResult, setInboundResult] = useState<TestResult | null>(null);
  
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showInvalidSignature, setShowInvalidSignature] = useState(false);

  // Canonical test payloads
  const outboundCanonicalBody = '{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}';
  const outboundExpectedHMAC = '0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28';
  
  const inboundCanonicalBody = '{"action_id":"aaaa-bbbb-cccc-dddd","job_id":"job_demo_1","status":"succeeded","started_at":"2025-10-22T15:01:00Z","ended_at":"2025-10-22T15:03:12Z","logs_url":"https://logs.example.com/job_demo_1"}';
  const inboundExpectedHMAC = '0c08098f423a9b8311d5e8131df36e603a14c468389914be285342efb8c561d4';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSendTestAction = async (negative: boolean = false) => {
    setOutboundTesting(true);
    setOutboundResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (negative) {
      setOutboundResult({
        success: false,
        message: 'Invalid signature',
        details: 'Signature mismatch. Expected valid HMAC-SHA256.'
      });
    } else {
      // Random success/failure for demo
      const success = Math.random() > 0.3;
      if (success) {
        setOutboundResult({
          success: true,
          message: 'Connect accepted signed action.'
        });
      } else {
        const errors = ['Invalid signature', 'Invalid payload', 'Connect unavailable'];
        const error = errors[Math.floor(Math.random() * errors.length)];
        setOutboundResult({
          success: false,
          message: error,
          details: error === 'Connect unavailable' ? 'Check DNS, TLS, and firewall.' : undefined
        });
      }
    }
    
    setOutboundTesting(false);
  };

  const handleSendTestCallback = async (negative: boolean = false) => {
    setInboundTesting(true);
    setInboundResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (negative) {
      setInboundResult({
        success: false,
        message: 'Invalid signature',
        details: 'See "How to compute HMAC" for guidance.'
      });
    } else {
      // Random success/failure for demo
      const success = Math.random() > 0.3;
      if (success) {
        setInboundResult({
          success: true,
          message: 'Callback verified and recorded.'
        });
      } else {
        const errors = ['Invalid signature', 'Callback processing error', 'Unrecognized action_id'];
        const error = errors[Math.floor(Math.random() * errors.length)];
        setInboundResult({
          success: false,
          message: error,
          details: error === 'Invalid signature' ? 'See "How to compute HMAC" for guidance.' : undefined
        });
      }
    }
    
    setInboundTesting(false);
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

  const ResultBanner = ({ result }: { result: TestResult }) => (
    <div className={`panel p-4 ${result.success ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
      <div className="flex items-start gap-3">
        {result.success ? (
          <CheckCircle className="w-5 h-5 text-success mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-danger mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm ${result.success ? 'text-success' : 'text-danger'}`}>
            {result.message}
          </p>
          {result.details && (
            <p className="text-xs text-text-400 mt-1">{result.details}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      {/* Desktop: 1440px, Tablet: 1024px, Mobile: 768px */}
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk text-white mb-2">Webhooks & Secrets</h1>
          <p className="text-text-400">
            Verify signed webhooks with real clients. Configure HMAC-SHA256 signatures for secure communication.
          </p>
        </div>

        {/* Two-Panel Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* PANEL A - Outbound to Connect */}
          <div className="panel p-6">
            <h2 className="text-xl font-space-grotesk text-white mb-4">Outbound to Connect</h2>
            
            {/* Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-text-400 mb-2">Connect Base URL</label>
                <input
                  type="text"
                  value={outboundUrl}
                  onChange={(e) => setOutboundUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="https://connect.example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm text-text-400 mb-2">Outbound Secret</label>
                <div className="relative">
                  <input
                    type={showOutboundSecret ? 'text' : 'password'}
                    value={outboundSecret}
                    onChange={(e) => setOutboundSecret(e.target.value)}
                    className="w-full px-4 py-2 pr-12 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 font-jetbrains-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    onClick={() => setShowOutboundSecret(!showOutboundSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-400 hover:text-accent transition-colors"
                    aria-label="Toggle secret visibility"
                  >
                    {showOutboundSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Helper */}
            <div className="panel p-4 bg-info/10 border-info/30 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-300">
                  We compute <span className="font-jetbrains-mono text-accent">X-Bubo-Signature = HMAC_SHA256(secret, raw_body)</span>. 
                  Signature covers the exact bytes sent—no pretty printing.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => handleSendTestAction(false)}
                disabled={outboundTesting}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {outboundTesting && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Test Action
              </button>
              <button
                onClick={() => handleSendTestAction(true)}
                disabled={outboundTesting}
                className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Negative Test (bad signature)
              </button>
            </div>

            {/* Result Area */}
            {outboundResult && (
              <div className="mb-6">
                <ResultBanner result={outboundResult} />
              </div>
            )}

            {/* Canonical Payload Section */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Canonical body (minified; sign these exact bytes)</label>
                  <CopyButton text={outboundCanonicalBody} label="outbound-body" />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300 max-h-32">
{outboundCanonicalBody}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Expected HMAC (hex) using secret 'supersecret123'</label>
                  <CopyButton text={outboundExpectedHMAC} label="outbound-hmac" />
                </div>
                <div className="panel p-3 bg-bg-850">
                  <code className="text-xs font-jetbrains-mono text-accent break-all">
                    {outboundExpectedHMAC}
                  </code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Example headers (copyable)</label>
                  <CopyButton 
                    text={`Content-Type: application/json\nX-Bubo-Signature: ${outboundExpectedHMAC}`} 
                    label="outbound-headers" 
                  />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`Content-Type: application/json
X-Bubo-Signature: ${outboundExpectedHMAC}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">cURL (copyable)</label>
                  <CopyButton 
                    text={`curl -X POST "${outboundUrl}/v1/device-actions" -H "Content-Type: application/json" -H "X-Bubo-Signature: ${outboundExpectedHMAC}" --data '${outboundCanonicalBody}'`}
                    label="outbound-curl" 
                  />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`curl -X POST "${outboundUrl}/v1/device-actions" \\
  -H "Content-Type: application/json" \\
  -H "X-Bubo-Signature: ${outboundExpectedHMAC}" \\
  --data '${outboundCanonicalBody}'`}
                </pre>
              </div>
            </div>
          </div>

          {/* PANEL B - Inbound from Connect */}
          <div className="panel p-6">
            <h2 className="text-xl font-space-grotesk text-white mb-4">Inbound from Connect</h2>
            
            {/* Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-text-400 mb-2">Inbound Secret</label>
                <div className="relative">
                  <input
                    type={showInboundSecret ? 'text' : 'password'}
                    value={inboundSecret}
                    onChange={(e) => setInboundSecret(e.target.value)}
                    className="w-full px-4 py-2 pr-12 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-300 font-jetbrains-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    onClick={() => setShowInboundSecret(!showInboundSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-400 hover:text-accent transition-colors"
                    aria-label="Toggle secret visibility"
                  >
                    {showInboundSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-text-400 mb-2">App Callback URL (read-only)</label>
                <div className="px-4 py-2 bg-bg-850/50 border border-[color:rgb(var(--border-analyst))]/50 rounded-xl text-text-400 font-jetbrains-mono text-sm">
                  /api/connect/status
                </div>
              </div>
            </div>

            {/* Helper */}
            <div className="panel p-4 bg-info/10 border-info/30 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-300">
                  Callbacks must include <span className="font-jetbrains-mono text-accent">X-Bubo-Signature</span> header. 
                  We verify HMAC over the raw request body (no reformatting).
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => handleSendTestCallback(false)}
                disabled={inboundTesting}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {inboundTesting && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Test Callback
              </button>
              <button
                onClick={() => handleSendTestCallback(true)}
                disabled={inboundTesting}
                className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Negative Test (bad signature)
              </button>
            </div>

            {/* Result Area */}
            {inboundResult && (
              <div className="mb-6">
                <ResultBanner result={inboundResult} />
              </div>
            )}

            {/* Canonical Payload Section */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Canonical body (minified; sign these exact bytes)</label>
                  <CopyButton text={inboundCanonicalBody} label="inbound-body" />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300 max-h-32">
{inboundCanonicalBody}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Expected HMAC (hex) using secret 'supersecret123'</label>
                  <CopyButton text={inboundExpectedHMAC} label="inbound-hmac" />
                </div>
                <div className="panel p-3 bg-bg-850">
                  <code className="text-xs font-jetbrains-mono text-accent break-all">
                    {inboundExpectedHMAC}
                  </code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Example headers (copyable)</label>
                  <CopyButton 
                    text={`Content-Type: application/json\nX-Bubo-Signature: ${inboundExpectedHMAC}`} 
                    label="inbound-headers" 
                  />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`Content-Type: application/json
X-Bubo-Signature: ${inboundExpectedHMAC}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">cURL (copyable)</label>
                  <CopyButton 
                    text={`curl -X POST "<APP_BASE>/api/connect/status" -H "Content-Type: application/json" -H "X-Bubo-Signature: ${inboundExpectedHMAC}" --data '${inboundCanonicalBody}'`}
                    label="inbound-curl" 
                  />
                </div>
                <pre className="panel p-3 bg-bg-850 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`curl -X POST "<APP_BASE>/api/connect/status" \\
  -H "Content-Type: application/json" \\
  -H "X-Bubo-Signature: ${inboundExpectedHMAC}" \\
  --data '${inboundCanonicalBody}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* HMAC Tooltip Section */}
        <div className="panel p-6 mb-6 bg-bg-850/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warn mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-space-grotesk text-white mb-2">How to compute HMAC</h3>
              <p className="text-xs text-text-400 mb-3">
                Use constant-time comparison to prevent timing attacks. Sign the exact bytes of the raw body—avoid reformatting or whitespace changes.
              </p>
              <pre className="panel p-3 bg-bg-900 overflow-x-auto text-xs font-jetbrains-mono text-text-300">
{`// Pseudocode
sig = hex(HMAC_SHA256(secret, raw_body_bytes))
header "X-Bubo-Signature: {sig}"

// Example (Node.js)
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', secret);
hmac.update(rawBody);
const signature = hmac.digest('hex');`}
              </pre>
            </div>
          </div>
        </div>

        {/* Invalid Signature Example Toggle */}
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-space-grotesk text-white">Show invalid signature example</h3>
            <button
              onClick={() => setShowInvalidSignature(!showInvalidSignature)}
              className={`w-12 h-6 rounded-full transition-colors ${showInvalidSignature ? 'bg-warn' : 'bg-bg-850'}`}
              aria-label="Toggle invalid signature example"
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${showInvalidSignature ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          {showInvalidSignature && (
            <div className="space-y-4">
              <div className="panel p-4 bg-danger/10 border-danger/30">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger mt-0.5" />
                  <div>
                    <p className="text-sm text-danger mb-2">Invalid Signature (Expected 401)</p>
                    <p className="text-xs text-text-400">
                      Using all-zero HMAC will result in signature verification failure.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-400">Invalid HMAC (all zeros)</label>
                  <CopyButton text="0000000000000000000000000000000000000000000000000000000000000000" label="invalid-hmac" />
                </div>
                <div className="panel p-3 bg-bg-850">
                  <code className="text-xs font-jetbrains-mono text-danger break-all">
                    0000000000000000000000000000000000000000000000000000000000000000
                  </code>
                </div>
              </div>
              
              <div className="panel p-3 bg-bg-850">
                <p className="text-xs text-text-400">
                  <span className="text-danger">Expected Response:</span> HTTP 401 Unauthorized with body: 
                  <code className="ml-2 font-jetbrains-mono">{"{"}"error": "Invalid signature"{"}"}</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
