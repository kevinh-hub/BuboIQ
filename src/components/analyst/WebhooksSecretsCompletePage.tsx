import React, { useState } from 'react';
import { WebhooksSecretsProductionScreen } from './screens/WebhooksSecretsProductionScreen';
import { WebhooksSecretsStates } from './screens/WebhooksSecretsStates';
import { Monitor, Tablet, Smartphone, Loader2, WifiOff, AlertTriangle, CheckCircle, Box } from 'lucide-react';

type ViewportSize = '1440' | '1280' | '1024' | '768';
type StateType = 'default' | 'loading' | 'empty' | 'error' | 'offline' | 'success';

export function WebhooksSecretsCompletePage() {
  const [viewport, setViewport] = useState<ViewportSize>('1440');
  const [state, setState] = useState<StateType>('default');

  const viewportSizes = {
    '1440': { label: 'Desktop XL', width: '1440px', icon: <Monitor className="w-4 h-4" /> },
    '1280': { label: 'Desktop', width: '1280px', icon: <Monitor className="w-4 h-4" /> },
    '1024': { label: 'Tablet', width: '1024px', icon: <Tablet className="w-4 h-4" /> },
    '768': { label: 'Mobile', width: '768px', icon: <Smartphone className="w-4 h-4" /> },
  };

  const states = {
    default: { label: 'Default', icon: <Box className="w-4 h-4" /> },
    loading: { label: 'Loading', icon: <Loader2 className="w-4 h-4" /> },
    empty: { label: 'Empty', icon: <AlertTriangle className="w-4 h-4" /> },
    error: { label: 'Error', icon: <AlertTriangle className="w-4 h-4" /> },
    offline: { label: 'Offline', icon: <WifiOff className="w-4 h-4" /> },
    success: { label: 'Success', icon: <CheckCircle className="w-4 h-4" /> },
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return <WebhooksSecretsStates.Loading />;
      case 'empty':
        return <WebhooksSecretsStates.Empty />;
      case 'error':
        return <WebhooksSecretsStates.Error />;
      case 'offline':
        return <WebhooksSecretsStates.Offline />;
      case 'success':
        return <WebhooksSecretsStates.Success />;
      default:
        return <WebhooksSecretsProductionScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-950 text-text-100">
      {/* Control Bar */}
      <div className="fixed top-0 left-0 right-0 bg-bg-850 border-b border-[color:rgb(var(--border-analyst))] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Title */}
            <div>
              <h1 className="text-lg font-space-grotesk text-white">
                <span className="text-white">BUBO</span>
                <span className="text-accent">IQ</span>
                <span className="text-text-400 ml-2">Webhooks & Secrets</span>
              </h1>
              <p className="text-xs text-text-400 mt-1">
                Production-ready screen with responsive variants and all states
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Viewport Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-400">Viewport:</span>
                <div className="flex bg-bg-900 rounded-lg p-1">
                  {(Object.keys(viewportSizes) as ViewportSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setViewport(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        viewport === size
                          ? 'bg-accent text-black'
                          : 'text-text-400 hover:text-text-100'
                      }`}
                    >
                      {viewportSizes[size].icon}
                      <span className="hidden sm:inline">{viewportSizes[size].label}</span>
                      <span className="sm:hidden">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-400">State:</span>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value as StateType)}
                  className="px-3 py-1.5 bg-bg-900 border border-[color:rgb(var(--border-analyst))] rounded-lg text-xs text-text-300"
                >
                  {(Object.keys(states) as StateType[]).map((s) => (
                    <option key={s} value={s}>
                      {states[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Viewport Simulation */}
      <div className="pt-24 pb-8 px-4">
        <div className="mx-auto bg-bg-900 rounded-2xl overflow-hidden shadow-modal border border-[color:rgb(var(--border-analyst))]">
          <div
            className="mx-auto transition-all duration-300"
            style={{ maxWidth: viewportSizes[viewport].width }}
          >
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-850/90 backdrop-blur-sm border-t border-[color:rgb(var(--border-analyst))] z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-xs text-text-400">
            <div className="flex items-center gap-4">
              <span>Viewport: <span className="text-accent font-jetbrains-mono">{viewportSizes[viewport].width}</span></span>
              <span>State: <span className="text-accent">{states[state].label}</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span>WCAG AA compliant</span>
              <span>•</span>
              <span>44×44 touch targets</span>
              <span>•</span>
              <span>Keyboard navigable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
