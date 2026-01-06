import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2`;

export interface Integration {
  id: string;
  name: string;
  category: 'popular' | 'monitoring' | 'cloud' | 'security';
  status: 'active' | 'beta';
  connected: boolean;
  webhookEvents: string[];
  apiEndpoints: string[];
  connectedAt?: string;
  lastActivity?: string;
  config?: {
    apiUrl?: string;
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    webhookSecret?: string;
    additionalConfig?: any;
  };
}

export interface WebhookEvent {
  id: string;
  providerId: string;
  eventType: string;
  data: any;
  timestamp: string;
  processedAt?: string;
}

export interface WebhookConfiguration {
  name: string;
  description: string;
  endpoint: string;
  events: string[];
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  active: boolean;
}

export class IntegrationsService {
  private authHeaders() {
    return {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}/integrations${endpoint}`, {
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

  // Integration Management
  async getIntegrations(): Promise<Integration[]> {
    const result = await this.makeRequest('/providers');
    return result.integrations;
  }

  async getIntegration(providerId: string): Promise<Integration> {
    const result = await this.makeRequest(`/providers/${providerId}`);
    return result.integration;
  }

  async configureIntegration(
    providerId: string,
    config: {
      apiUrl: string;
      apiKey: string;
      clientId?: string;
      clientSecret?: string;
      webhookSecret?: string;
      additionalConfig?: any;
    }
  ): Promise<{ success: boolean; message: string; webhookUrl: string }> {
    return this.makeRequest(`/providers/${providerId}/configure`, {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async testIntegration(providerId: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    return this.makeRequest(`/providers/${providerId}/test`, {
      method: 'POST'
    });
  }

  async disconnectIntegration(providerId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/providers/${providerId}/disconnect`, {
      method: 'DELETE'
    });
  }

  // Webhook Management
  async sendWebhook(
    event: string,
    data: any,
    targetUrl: string,
    retryAttempts: number = 3
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/send-webhook', {
      method: 'POST',
      body: JSON.stringify({
        event,
        data,
        targetUrl,
        retryAttempts
      })
    });
  }

  async getIntegrationEvents(
    providerId?: string,
    eventType?: string,
    limit: number = 50
  ): Promise<WebhookEvent[]> {
    const params = new URLSearchParams();
    if (providerId) params.append('provider', providerId);
    if (eventType) params.append('event_type', eventType);
    params.append('limit', limit.toString());

    const result = await this.makeRequest(`/events?${params.toString()}`);
    return result.events;
  }

  // Webhook URL generation
  generateWebhookUrl(providerId: string): string {
    return `${API_BASE}/integrations/webhooks/${providerId}`;
  }

  // Event simulation for testing
  async simulateWebhookEvent(
    providerId: string,
    eventType: string,
    sampleData?: any
  ): Promise<{ success: boolean; message: string }> {
    const webhookUrl = this.generateWebhookUrl(providerId);
    
    const eventData = sampleData || this.getSampleEventData(eventType);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BuboIQ-Signature': 'test-signature'
        },
        body: JSON.stringify({
          event: eventType,
          ...eventData
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Webhook event simulated successfully'
        };
      } else {
        return {
          success: false,
          message: 'Webhook simulation failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Webhook simulation error: ${error.message}`
      };
    }
  }

  // Integration categories and metadata
  getIntegrationCategories(): { [key: string]: { name: string; icon: string; description: string } } {
    return {
      popular: {
        name: 'Popular Tools',
        icon: '🔥',
        description: 'Most commonly used integrations'
      },
      monitoring: {
        name: 'Monitoring & Observability',
        icon: '📊',
        description: 'APM, logging, and monitoring platforms'
      },
      cloud: {
        name: 'Cloud Platforms',
        icon: '☁️',
        description: 'AWS, Azure, GCP, and containerization'
      },
      security: {
        name: 'Security & Identity',
        icon: '🔒',
        description: 'Security tools and identity providers'
      }
    };
  }

  // Sample webhook configurations from Features page
  getWebhookExamples(): WebhookConfiguration[] {
    return [
      {
        name: 'Incident Alerts',
        description: 'Real-time notifications when incidents are created or escalated',
        endpoint: 'https://api.yourcompany.com/incidents',
        events: ['incident.created', 'incident.escalated', 'incident.resolved'],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BuboIQ-Signature': 'sha256=...'
        },
        active: true
      },
      {
        name: 'SLA Breaches',
        description: 'Proactive alerts before SLA deadlines are missed',
        endpoint: 'https://api.yourcompany.com/sla-alerts',
        events: ['sla.risk_detected', 'sla.breach_imminent', 'sla.breached'],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BuboIQ-Signature': 'sha256=...'
        },
        active: true
      },
      {
        name: 'Intelligence Updates',
        description: 'Smart problem grouping updates and pattern discoveries',
        endpoint: 'https://api.yourcompany.com/intelligence',
        events: ['correlation.detected', 'pattern.discovered', 'prediction.made'],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BuboIQ-Signature': 'sha256=...'
        },
        active: true
      }
    ];
  }

  // API documentation examples
  getAPIExamples(): { [key: string]: { description: string; code: string; response: string } } {
    return {
      'get-incidents': {
        description: 'Retrieve all incidents with optional filtering',
        code: `curl -X GET "https://api.buboiq.com/v1/incidents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        response: `{
  "incidents": [
    {
      "id": "inc_12345",
      "title": "Database Connection Timeout",
      "severity": "high",
      "status": "open",
      "created_at": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 1,
  "page": 1
}`
      },
      'create-incident': {
        description: 'Create a new incident',
        code: `curl -X POST "https://api.buboiq.com/v1/incidents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Application Error",
    "description": "500 error on checkout page",
    "severity": "high",
    "source": "monitoring"
  }'`,
        response: `{
  "id": "inc_12346",
  "title": "Application Error",
  "severity": "high",
  "status": "open",
  "created_at": "2024-01-15T14:35:00Z",
  "webhook_sent": true
}`
      }
    };
  }

  // Sample event data for testing
  private getSampleEventData(eventType: string): any {
    const sampleData: { [key: string]: any } = {
      'incident.created': {
        id: 'inc_' + Date.now(),
        title: 'Sample Incident - Database Connection Timeout',
        description: 'High number of database connection timeouts detected',
        severity: 'high',
        source: 'monitoring',
        affected_services: ['database', 'api'],
        created_at: new Date().toISOString()
      },
      'incident.escalated': {
        id: 'inc_' + Date.now(),
        title: 'Sample Escalation - Critical Service Down',
        severity: 'critical',
        escalated_from: 'high',
        escalated_by: 'auto_escalation',
        escalated_at: new Date().toISOString()
      },
      'sla.breach_imminent': {
        incident_id: 'inc_' + Date.now(),
        sla_type: 'response_time',
        time_remaining: '00:15:00',
        breach_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        severity: 'high'
      },
      'correlation.detected': {
        correlation_id: 'corr_' + Date.now(),
        pattern_type: 'cascading_failure',
        confidence_score: 0.92,
        affected_services: ['api', 'database', 'cache'],
        root_cause_probability: {
          'database_overload': 0.78,
          'network_latency': 0.15,
          'cache_miss': 0.07
        }
      },
      'alert.triggered': {
        alert_id: 'alert_' + Date.now(),
        metric: 'cpu_usage',
        threshold: 80,
        current_value: 95,
        host: 'web-server-01',
        timestamp: new Date().toISOString()
      }
    };

    return sampleData[eventType] || {
      event_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: 'Sample event data'
    };
  }

  // Utility methods
  formatEventType(eventType: string): string {
    return eventType.split('.').map(part => 
      part.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(' - ');
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: { [key: string]: string } = {
      'incident': '🚨',
      'alert': '⚠️',
      'sla': '⏱️',
      'correlation': '🔗',
      'pattern': '🧠',
      'prediction': '🔮',
      'webhook': '🪝',
      'integration': '🔌'
    };

    const category = eventType.split('.')[0];
    return iconMap[category] || '📡';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'text-iq-green',
      'beta': 'text-signal-yellow',
      'connected': 'text-iq-green',
      'disconnected': 'text-mist-gray',
      'error': 'text-crimson-danger',
      'pending': 'text-signal-yellow'
    };

    return colorMap[status] || 'text-mist-gray';
  }
}

// Export singleton instance
export const integrationsService = new IntegrationsService();