/**
 * BuboIQ Analyst v1 - Webhooks & Secrets Screen
 * 
 * Production-ready admin screen for verifying signed webhook integration
 * with BuboIQ Connect device-actions service.
 * 
 * @module webhooks-secrets
 * @version 1.0.0
 * @status Production Ready
 */

// Main production screen
export { WebhooksSecretsProductionScreen } from './screens/WebhooksSecretsProductionScreen';

// All state variants
export { 
  WebhooksSecretsStates,
  WebhooksSecretsLoadingState,
  WebhooksSecretsEmptyState,
  WebhooksSecretsErrorState,
  WebhooksSecretsOfflineState,
  WebhooksSecretsSuccessState
} from './screens/WebhooksSecretsStates';

// Complete demo page with viewport switcher
export { WebhooksSecretsCompletePage } from './WebhooksSecretsCompletePage';

// Developer handoff materials
export { WebhooksSecretsHandoff } from './WebhooksSecretsHandoff';

/**
 * Quick Start
 * 
 * 1. Basic Usage:
 * ```tsx
 * import { WebhooksSecretsProductionScreen } from './components/analyst/webhooks-secrets-index';
 * <WebhooksSecretsProductionScreen />
 * ```
 * 
 * 2. View All States:
 * ```tsx
 * import { WebhooksSecretsStates } from './components/analyst/webhooks-secrets-index';
 * <WebhooksSecretsStates.Loading />
 * <WebhooksSecretsStates.Error />
 * <WebhooksSecretsStates.Success />
 * ```
 * 
 * 3. Interactive Demo:
 * ```tsx
 * import { WebhooksSecretsCompletePage } from './components/analyst/webhooks-secrets-index';
 * <WebhooksSecretsCompletePage />
 * ```
 * 
 * 4. Developer Handoff:
 * ```tsx
 * import { WebhooksSecretsHandoff } from './components/analyst/webhooks-secrets-index';
 * <WebhooksSecretsHandoff />
 * ```
 */

// Type definitions for external use
export interface WebhookConfig {
  outboundUrl: string;
  outboundSecret: string;
  inboundSecret: string;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

export interface WebhooksSecretsProps {
  initialConfig?: Partial<WebhookConfig>;
  onSave?: (config: WebhookConfig) => Promise<void>;
  onTestOutbound?: (url: string, secret: string) => Promise<TestResult>;
  onTestInbound?: (secret: string) => Promise<TestResult>;
}

/**
 * Canonical Payloads
 * 
 * These are the exact payloads used in the production screen.
 * Sign these exact bytes with HMAC-SHA256.
 */
export const CANONICAL_PAYLOADS = {
  outbound: {
    body: '{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}',
    expectedHMAC: '0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28',
    secret: 'supersecret123'
  },
  inbound: {
    body: '{"action_id":"aaaa-bbbb-cccc-dddd","job_id":"job_demo_1","status":"succeeded","started_at":"2025-10-22T15:01:00Z","ended_at":"2025-10-22T15:03:12Z","logs_url":"https://logs.example.com/job_demo_1"}',
    expectedHMAC: '0c08098f423a9b8311d5e8131df36e603a14c468389914be285342efb8c561d4',
    secret: 'supersecret123'
  }
} as const;

/**
 * Helper function to compute HMAC signature (for testing purposes)
 * In production, use server-side implementation.
 */
export function computeHMACSignature(secret: string, rawBody: string): string {
  // This is a browser-compatible implementation for demo purposes only
  // In production, ALWAYS compute signatures server-side
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(rawBody);
  
  return crypto.subtle
    .importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then(key => crypto.subtle.sign('HMAC', key, messageData))
    .then(signature => {
      const hashArray = Array.from(new Uint8Array(signature));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    })
    .then(hex => hex)
    .catch(() => {
      throw new Error('Failed to compute HMAC signature. Use server-side implementation.');
    });
}

/**
 * Responsive Breakpoints
 */
export const RESPONSIVE_BREAKPOINTS = {
  desktop_xl: 1440,
  desktop: 1280,
  tablet: 1024,
  mobile: 768
} as const;

/**
 * Design Tokens
 */
export const DESIGN_TOKENS = {
  colors: {
    accent: 'rgb(0, 255, 133)',
    success: 'rgb(85, 209, 135)',
    danger: 'rgb(255, 107, 107)',
    warn: 'rgb(246, 193, 74)',
    info: 'rgb(62, 160, 255)'
  },
  radius: {
    xl: '20px',
    modal: '32px'
  },
  shadow: {
    card: '0 8px 24px rgba(0,0,0,0.35)',
    modal: '0 16px 48px rgba(0,0,0,0.5)'
  }
} as const;
