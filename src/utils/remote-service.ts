import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2`;

export interface RemoteProvider {
  id: string;
  name: string;
  apiBaseUrl: string;
  requiresAuth: boolean;
  authType: string;
  capabilities: string[];
  status: 'connected' | 'disconnected';
  config?: {
    apiUrl?: string;
    apiKey?: string;
    accountId?: string;
    webhookUrl?: string;
    scopes?: string[];
  };
}

export interface RemoteSession {
  sessionId: string;
  ticketId: string;
  assetId?: string;
  mode: 'known' | 'adhoc';
  providerId: string;
  status: 'starting' | 'active' | 'ended';
  createdAt: string;
  endedAt?: string;
  duration?: string;
  outcome?: string;
  providerSessionUrl?: string;
  joinCode?: string;
  expiresAt?: string;
  participants?: string[];
  artifacts?: SessionArtifact[];
}

export interface SessionArtifact {
  id: string;
  sessionId: string;
  type: 'recording' | 'transcript' | 'actions' | 'files' | 'snapshot';
  name: string;
  size: string;
  url?: string;
  blob?: string;
  checksum?: string;
  meta?: any;
  preview?: string;
}

export interface SessionOptions {
  consent: boolean;
  mask: boolean;
  record: boolean;
  watermark: boolean;
}

export class RemoteService {
  private authHeaders() {
    return {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}/remote${endpoint}`, {
      ...options,
      headers: {
        ...this.authHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Provider Management
  async getProviders(): Promise<RemoteProvider[]> {
    const result = await this.makeRequest('/providers');
    return result.providers;
  }

  async getProvider(providerId: string): Promise<RemoteProvider> {
    const result = await this.makeRequest(`/providers/${providerId}`);
    return result.provider;
  }

  async configureProvider(
    providerId: string, 
    config: {
      apiUrl: string;
      apiKey: string;
      accountId?: string;
      scopes?: string[];
    }
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/providers/${providerId}/configure`, {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async testProviderConnection(providerId: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    return this.makeRequest(`/providers/${providerId}/test`, {
      method: 'POST'
    });
  }

  // Session Management
  async startSession(
    providerId: string,
    sessionData: {
      ticketId: string;
      assetId?: string;
      mode: 'known' | 'adhoc';
      requester: {
        id: string;
        email: string;
        name: string;
      };
      options: SessionOptions;
    }
  ): Promise<{
    success: boolean;
    sessionId: string;
    providerSessionUrl: string;
    joinCode?: string;
    expiresAt: string;
  }> {
    return this.makeRequest(`/providers/${providerId}/sessions/start`, {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  async endSession(
    providerId: string,
    sessionId: string,
    data: {
      endedBy: string;
      outcome: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/providers/${providerId}/sessions/${sessionId}/end`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async attachSessionToTicket(
    providerId: string,
    sessionId: string,
    ticketId: string
  ): Promise<{
    success: boolean;
    message: string;
    artifactsCount: number;
  }> {
    return this.makeRequest(`/providers/${providerId}/sessions/${sessionId}/attach`, {
      method: 'POST',
      body: JSON.stringify({ ticketId })
    });
  }

  // Session Data Management
  async getSessionData(sessionId: string): Promise<RemoteSession | null> {
    try {
      // This would typically come from your main API that has access to the KV store
      const response = await fetch(`${API_BASE}/sessions/${sessionId}`, {
        headers: this.authHeaders()
      });
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  }

  async getSessionArtifacts(sessionId: string): Promise<SessionArtifact[]> {
    try {
      const response = await fetch(`${API_BASE}/sessions/${sessionId}/artifacts`, {
        headers: this.authHeaders()
      });
      
      if (!response.ok) {
        return [];
      }
      
      const result = await response.json();
      return result.artifacts || [];
    } catch (error) {
      console.error('Error fetching session artifacts:', error);
      return [];
    }
  }

  // Real-time Events (WebSocket simulation with polling)
  private eventListeners: Map<string, Function[]> = new Map();

  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Polling for session updates (simulates real-time events)
  private pollingIntervals: Map<string, number> = new Map();

  startSessionPolling(sessionId: string, interval: number = 5000) {
    if (this.pollingIntervals.has(sessionId)) {
      this.stopSessionPolling(sessionId);
    }

    const intervalId = setInterval(async () => {
      try {
        const sessionData = await this.getSessionData(sessionId);
        if (sessionData) {
          this.emit('session:update', sessionData);
          
          if (sessionData.status === 'ended') {
            this.stopSessionPolling(sessionId);
            this.emit('session:ended', sessionData);
          }
        }
      } catch (error) {
        console.error('Session polling error:', error);
      }
    }, interval);

    this.pollingIntervals.set(sessionId, intervalId);
  }

  stopSessionPolling(sessionId: string) {
    const intervalId = this.pollingIntervals.get(sessionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(sessionId);
    }
  }

  // Utility methods
  generateWebhookUrl(providerId: string): string {
    return `${API_BASE}/remote/webhooks/${providerId}`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  generateSessionId(): string {
    return `RW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateJoinCode(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // Mock data for development
  getMockProviders(): RemoteProvider[] {
    return [
      {
        id: 'splashtop',
        name: 'Splashtop',
        apiBaseUrl: 'https://api.splashtop.com/v2',
        requiresAuth: true,
        authType: 'api_key',
        capabilities: ['adhoc', 'managed', 'recording', 'file_transfer'],
        status: 'connected'
      },
      {
        id: 'screenconnect',
        name: 'ScreenConnect',
        apiBaseUrl: 'https://instance.screenconnect.com/Services',
        requiresAuth: true,
        authType: 'basic',
        capabilities: ['session_control', 'audit_logs', 'recording', 'chat'],
        status: 'disconnected'
      },
      {
        id: 'beyondtrust',
        name: 'BeyondTrust',
        apiBaseUrl: 'https://access.beyondtrust.com/api',
        requiresAuth: true,
        authType: 'oauth2',
        capabilities: ['privileged_access', 'session_reports', 'compliance'],
        status: 'disconnected'
      }
    ];
  }

  getMockSession(): RemoteSession {
    return {
      sessionId: 'RW-9827',
      ticketId: '4321',
      assetId: 'AST-001287',
      mode: 'known',
      providerId: 'splashtop',
      status: 'ended',
      createdAt: '2024-01-15T14:32:15Z',
      endedAt: '2024-01-15T14:56:00Z',
      duration: '23m 45s',
      outcome: 'resolved',
      providerSessionUrl: 'https://api.splashtop.com/session/RW-9827',
      participants: ['Kevin H.', 'Sarah M.', 'Jennifer K.']
    };
  }

  getMockArtifacts(): SessionArtifact[] {
    return [
      {
        id: '1',
        sessionId: 'RW-9827',
        type: 'recording',
        name: 'session-recording.mp4',
        size: '142.3 MB',
        url: '/recordings/rw-9827.mp4',
        preview: 'Video recording of the session'
      },
      {
        id: '2',
        sessionId: 'RW-9827',
        type: 'transcript',
        name: 'session-transcript.vtt',
        size: '8.2 KB',
        preview: 'Chat transcript with 47 messages'
      },
      {
        id: '3',
        sessionId: 'RW-9827',
        type: 'actions',
        name: 'session-actions.json',
        size: '4.1 KB',
        preview: '12 system actions recorded'
      }
    ];
  }
}

// Export singleton instance
export const remoteService = new RemoteService();