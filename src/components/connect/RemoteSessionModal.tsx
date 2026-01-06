import React, { useState, useEffect } from 'react';
import { X, Monitor, Clock, Shield, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { ConnectFeatureBadge } from '../marketing/ConnectFeatureBadge';
import { connectApi } from '../../utils/supabase/client';

interface RemoteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId?: string;
  deviceId?: string;
}

type SessionState = 'loading' | 'active' | 'error';

interface SessionData {
  id: string;
  provider: string;
  access_url: string;
  expires_at: string;
  session_token: string;
  device: {
    id: string;
    display_name: string;
    device_type: string;
    hostname?: string;
    ip_address?: string;
    operating_system?: string;
  };
  metadata?: {
    provider_config?: {
      name: string;
    };
  };
}

export const RemoteSessionModal: React.FC<RemoteSessionModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  deviceId
}) => {
  const [sessionState, setSessionState] = useState<SessionState>('loading');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && deviceId) {
      createRemoteSession();
    }
  }, [isOpen, deviceId]);

  const createRemoteSession = async () => {
    try {
      setSessionState('loading');
      setError(null);
      
      // Verify Pro access first
      const hasProAccess = await connectApi.verifyProAccess();
      if (!hasProAccess) {
        setError('Remote help needs Pro plan');
        setSessionState('error');
        return;
      }

      // Create session via Supabase API
      const response = await connectApi.createSession({
        device_id: deviceId!,
        ticket_id: ticketId,
        session_type: 'remote_desktop',
        provider: 'rustdesk'
      });

      if (response.session) {
        setSessionData(response.session);
        setSessionState('active');
      } else {
        throw new Error('Couldn\'t start session');
      }
    } catch (err: any) {
      console.error('Failed to create remote session:', err);
      setError(err.message || 'Couldn\'t start remote help');
      setSessionState('error');
    }
  };

  if (!isOpen) return null;

  const handleOpenRemoteSession = () => {
    if (sessionData?.access_url) {
      window.open(sessionData.access_url, '_blank');
    }
  };

  const handleRetry = () => {
    if (deviceId) {
      createRemoteSession();
    }
  };

  const formatExpiryTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString();
  };

  const renderLoadingState = () => (
    <div className="text-center py-12">
      <div className="relative mx-auto mb-6">
        <div className="w-20 h-20 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto">
          <Monitor className="w-10 h-10 text-iq-neon-green" />
        </div>
        <Loader2 className="w-6 h-6 text-iq-neon-green animate-spin absolute -top-1 -right-1" />
      </div>
      <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
        Preparing Secure Session
      </h3>
      <p className="text-mist-gray">
        Establishing encrypted connection and verifying permissions...
      </p>
      <div className="mt-6 bg-surface-dark/50 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-2 text-iq-neon-green text-sm">
          <div className="w-2 h-2 bg-iq-neon-green rounded-full animate-pulse" />
          <span>Authenticating with provider</span>
        </div>
      </div>
    </div>
  );

  const renderActiveState = () => (
    <div className="py-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Monitor className="w-8 h-8 text-iq-neon-green" />
        </div>
        <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
          Remote Session Ready
        </h3>
        <p className="text-mist-gray">
          Secure connection established to target device
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bubo-glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-mist-gray text-sm">Session ID</span>
            <span className="font-jetbrains-mono text-iq-neon-green text-sm">
              {sessionData?.session_token || sessionData?.id}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-mist-gray text-sm">Provider</span>
            <span className="text-pure-white text-sm font-medium">
              {sessionData?.metadata?.provider_config?.name || 'RustDesk'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-mist-gray text-sm">Computer</span>
            <span className="text-pure-white text-sm font-medium">
              {sessionData?.device?.display_name || deviceId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-mist-gray text-sm">Session Expires</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-warning" />
              <span className="text-amber-warning text-sm font-medium">
                {sessionData?.expires_at ? formatExpiryTime(sessionData.expires_at) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-iq-neon-green mt-0.5" />
            <div>
              <p className="text-iq-neon-green text-sm font-medium mb-1">
                Fully encrypted
              </p>
              <p className="text-mist-gray text-xs">
                All data sent in this session is encrypted and logged.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleOpenRemoteSession}
        className="bubo-btn-neon-primary w-full text-lg py-4"
      >
        <ExternalLink className="w-5 h-5 mr-3" />
        Open Remote Session
      </Button>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-crimson-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-10 h-10 text-crimson-danger" />
      </div>
      <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
        Couldn't connect
      </h3>
      <p className="text-mist-gray mb-8">
        {error || 'Couldn\'t start remote session. Check if the computer is online and try again.'}
      </p>
      <div className="space-y-3">
        <Button 
          onClick={handleRetry}
          className="bubo-btn-secondary w-full"
        >
          Try Again
        </Button>
        <Button 
          onClick={onClose}
          variant="ghost"
          className="w-full text-mist-gray hover:text-pure-white"
        >
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neural-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bubo-glass rounded-3xl border border-iq-neon-green/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-iq-neon-green/10">
            <div className="flex items-center space-x-3">
              <Monitor className="w-6 h-6 text-iq-neon-green" />
              <div>
                <h2 className="font-space-grotesk text-lg font-bold text-pure-white">
                  Bubo<span className="text-iq-neon-green">IQ</span> Connect
                </h2>
                <ConnectFeatureBadge size="sm" />
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-mist-gray hover:text-pure-white p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {sessionState === 'loading' && renderLoadingState()}
            {sessionState === 'active' && renderActiveState()}
            {sessionState === 'error' && renderErrorState()}
          </div>
        </div>
      </div>
    </div>
  );
};