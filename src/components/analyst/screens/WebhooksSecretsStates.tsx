import React from 'react';
import { Loader2, AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

// Loading State
export function WebhooksSecretsLoadingState() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <div className="h-9 bg-bg-850 rounded-xl w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-bg-850 rounded-xl w-96 animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="panel p-6">
              <div className="h-7 bg-bg-850 rounded-xl w-48 mb-4 animate-pulse" />
              <div className="space-y-4 mb-6">
                <div>
                  <div className="h-4 bg-bg-850 rounded w-32 mb-2 animate-pulse" />
                  <div className="h-10 bg-bg-850 rounded-xl animate-pulse" />
                </div>
                <div>
                  <div className="h-4 bg-bg-850 rounded w-32 mb-2 animate-pulse" />
                  <div className="h-10 bg-bg-850 rounded-xl animate-pulse" />
                </div>
              </div>
              <div className="h-20 bg-info/10 rounded-xl mb-6 animate-pulse" />
              <div className="flex gap-3 mb-6">
                <div className="h-10 bg-bg-850 rounded-xl w-40 animate-pulse" />
                <div className="h-10 bg-bg-850 rounded-xl w-52 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
          <p className="text-text-400">Loading webhook configuration...</p>
        </div>
      </div>
    </div>
  );
}

// Empty State (No Configuration)
export function WebhooksSecretsEmptyState() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk text-white mb-2">Webhooks & Secrets</h1>
          <p className="text-text-400">
            Verify signed webhooks with real clients. Configure HMAC-SHA256 signatures for secure communication.
          </p>
        </div>

        <div className="panel p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-bg-850 flex items-center justify-center mx-auto mb-6">
            <Wifi className="w-10 h-10 text-text-600" />
          </div>
          <h2 className="text-xl font-space-grotesk text-white mb-3">
            No Webhook Configuration Found
          </h2>
          <p className="text-text-400 max-w-md mx-auto mb-6">
            Configure your Connect base URL and secrets to start testing signed webhook integration.
          </p>
          <button className="px-6 py-3 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
            Set Up Webhooks
          </button>
        </div>
      </div>
    </div>
  );
}

// Error State (Connection Failed)
export function WebhooksSecretsErrorState() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk text-white mb-2">Webhooks & Secrets</h1>
          <p className="text-text-400">
            Verify signed webhooks with real clients. Configure HMAC-SHA256 signatures for secure communication.
          </p>
        </div>

        <div className="panel p-8 bg-danger/10 border-danger/30">
          <div className="flex items-start gap-4">
            <XCircle className="w-8 h-8 text-danger mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-space-grotesk text-danger mb-3">
                Failed to Load Configuration
              </h2>
              <p className="text-text-300 mb-4">
                Unable to retrieve webhook configuration. This may be due to:
              </p>
              <ul className="space-y-2 text-sm text-text-400 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                  Network connectivity issues
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                  Insufficient permissions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                  Database unavailable
                </li>
              </ul>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity">
                  Retry
                </button>
                <button className="px-4 py-2 bg-bg-850 text-text-300 border border-[color:rgb(var(--border-analyst))] rounded-xl hover:bg-bg-900 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Show skeleton of what would be there */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6 opacity-30">
          {[1, 2].map((i) => (
            <div key={i} className="panel p-6">
              <div className="h-7 bg-bg-850 rounded-xl w-48 mb-4" />
              <div className="space-y-4">
                <div className="h-10 bg-bg-850 rounded-xl" />
                <div className="h-10 bg-bg-850 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Offline State
export function WebhooksSecretsOfflineState() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk text-white mb-2">Webhooks & Secrets</h1>
          <p className="text-text-400">
            Verify signed webhooks with real clients. Configure HMAC-SHA256 signatures for secure communication.
          </p>
        </div>

        <div className="panel p-8 bg-warn/10 border-warn/30">
          <div className="flex items-start gap-4">
            <WifiOff className="w-8 h-8 text-warn mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-space-grotesk text-warn mb-3">
                You're Offline
              </h2>
              <p className="text-text-300 mb-4">
                Webhook testing requires an active internet connection. Features available offline:
              </p>
              <ul className="space-y-2 text-sm text-text-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  View canonical payload examples
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Copy HMAC computation snippets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Review cURL examples
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-text-600" />
                  Send test actions/callbacks (requires connection)
                </li>
              </ul>
              <p className="text-xs text-text-400">
                Reconnect to test webhook integration with Connect service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success State (All Tests Passed)
export function WebhooksSecretsSuccessState() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-space-grotesk text-white mb-2">Webhooks & Secrets</h1>
          <p className="text-text-400">
            Verify signed webhooks with real clients. Configure HMAC-SHA256 signatures for secure communication.
          </p>
        </div>

        {/* Success Banner */}
        <div className="panel p-6 bg-success/10 border-success/30 mb-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-success mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-space-grotesk text-success mb-2">
                All Webhook Tests Passed
              </h2>
              <p className="text-text-300 mb-4">
                Your webhook integration is properly configured and verified:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-text-300">Outbound signatures valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-text-300">Inbound callbacks verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-text-300">HMAC computation correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-text-300">Connect endpoint reachable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Simplified panels showing successful configuration */}
          <div className="panel p-6">
            <h2 className="text-xl font-space-grotesk text-white mb-4">Outbound to Connect</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Status</span>
                <span className="px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Last Test</span>
                <span className="text-sm text-text-300 font-jetbrains-mono">2 mins ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Signature Method</span>
                <span className="text-sm text-accent font-jetbrains-mono">HMAC-SHA256</span>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-space-grotesk text-white mb-4">Inbound from Connect</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Status</span>
                <span className="px-2 py-1 rounded text-xs bg-success/20 text-success border border-success/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Last Callback</span>
                <span className="text-sm text-text-300 font-jetbrains-mono">5 mins ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-850 rounded-xl">
                <span className="text-sm text-text-400">Callbacks Verified</span>
                <span className="text-sm text-success font-jetbrains-mono">3/3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export all states
export const WebhooksSecretsStates = {
  Loading: WebhooksSecretsLoadingState,
  Empty: WebhooksSecretsEmptyState,
  Error: WebhooksSecretsErrorState,
  Offline: WebhooksSecretsOfflineState,
  Success: WebhooksSecretsSuccessState,
};
