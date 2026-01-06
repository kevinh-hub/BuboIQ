import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2`;

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }

    return headers;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(email: string, password: string, name: string, role: string = 'user') {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  async getProfile() {
    return this.request('/profile');
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  // Ticket methods
  async getTickets(filters: any = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    return this.request(`/tickets${queryString ? `?${queryString}` : ''}`);
  }

  async getTicket(id: string) {
    return this.request(`/tickets/${id}`);
  }

  async createTicket(ticketData: any) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(id: string, updates: any) {
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async addComment(ticketId: string, content: string, isInternal: boolean = false) {
    return this.request(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, isInternal }),
    });
  }

  async addInternalNote(ticketId: string, content: string) {
    return this.request(`/tickets/${ticketId}/internal-notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getTicketStats() {
    return this.request('/tickets/stats');
  }

  // File upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Initialize backend
  async initialize() {
    return this.request('/init');
  }

  // BuboIQ Intelligence API Methods
  async getIncidents(filters: any = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    return this.request(`/incidents${queryString ? `?${queryString}` : ''}`);
  }

  async getIncident(id: string) {
    return this.request(`/incidents/${id}`);
  }

  async addIncidentAssessment(incidentId: string, content: string, confidenceLevel: string = 'Medium') {
    return this.request(`/incidents/${incidentId}/assessments`, {
      method: 'POST',
      body: JSON.stringify({ content, confidenceLevel }),
    });
  }

  async getAIMetrics() {
    return this.request('/ai-metrics');
  }

  async getNeuralStatus() {
    return this.request('/neural-status');
  }

  async getAnalysts() {
    return this.request('/analysts');
  }

  async uploadEvidencePack(file: File, incidentId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('incidentId', incidentId);

    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/evidence-upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Evidence upload failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// Custom hooks for API operations
export function useApi<T = any>(endpoint: string, dependencies: any[] = []): ApiResponse<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const result = await apiClient.request<T>(endpoint);
        
        if (!isCancelled) {
          setData(result);
          setError(undefined);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(`API Error for ${endpoint}:`, err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(undefined);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  return { data, error, loading };
}

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const execute = async <T = any>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(undefined);
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Async operation error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

// Initialize the BuboIQ backend on app load
export async function initializeBackend() {
  try {
    console.log('🦉 Initializing BuboIQ AI Intelligence Platform...');
    const result = await apiClient.initialize();
    console.log('✅ BuboIQ Intelligence Platform initialized:', result.message);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize BuboIQ platform:', error);
    return false;
  }
}