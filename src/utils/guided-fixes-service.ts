/**
 * Guided Fixes API Service
 * Customer-facing label: "Guided Fixes"
 * Internal model name: "runbook"
 */

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2`;

export interface GuidedFixStep {
  id: string;
  title: string;
  command: string;
  os: 'windows' | 'macos' | 'linux';
  shell: string;
  safety: 'readOnly' | 'low' | 'risky' | 'destructive';
  whatItDoes: string;
  expectedOutput: string;
  prereqs: string[];
  requiresElevation: boolean;
  supportsDryRun: boolean;
}

export interface GuidedFix {
  id: string;
  title: string;
  description: string;
  os_types: Array<'windows' | 'macos' | 'linux'>;
  safety_level: 'readOnly' | 'low' | 'risky' | 'destructive';
  est_mins: string;
  tier_required: 'starter' | 'pro' | 'team';
  requires_approval: boolean;
  steps: GuidedFixStep[];
  status: 'draft' | 'published' | 'deprecated';
  categories?: string[];
  tags?: string[];
  is_global: boolean;
  created_at: string;
  updated_at: string;
  // Added by API
  canExecute?: boolean;
  userTier?: string;
  tierState?: 'starter' | 'starterLocked' | 'pro' | 'team';
}

export interface GuidedFixExecution {
  id: string;
  guided_fix_id: string;
  device_id?: string;
  computer_id?: string;
  issue_id?: string;
  org_id: string;
  user_id: string;
  execution_path: 'agent' | 'connect' | 'winrm';
  status: 'pending' | 'running' | 'success' | 'failed' | 'aborted';
  steps_total: number;
  steps_completed: number;
  current_step_id?: string;
  current_step_index?: number;
  kb_draft_id?: string;
  error_message?: string;
  error_step_id?: string;
  logs: ConsoleLogEntry[];
  elevated: boolean;
  dry_run: boolean;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  // Joined data
  guided_fixes?: {
    title: string;
    description: string;
    os_types: string[];
    safety_level: string;
  };
  steps?: StepExecution[];
}

export interface StepExecution {
  id: string;
  execution_id: string;
  step_id: string;
  step_index: number;
  step_title: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  command: string;
  shell?: string;
  os?: string;
  elevated: boolean;
  output?: string;
  error?: string;
  exit_code?: number;
  parser_signals?: string[];
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface ConsoleLogEntry {
  timestamp: string;
  text: string;
  type?: 'stdout' | 'stderr' | 'info' | 'error';
  stepId?: string;
}

export interface ExecuteOptions {
  deviceId?: string;
  computerId?: string;
  issueId?: string;
  executionPath?: 'agent' | 'connect' | 'winrm';
  elevated?: boolean;
  dryRun?: boolean;
}

export interface WebSocketMessage {
  type: 'connected' | 'execution_start' | 'step_start' | 'output' | 'step_complete' | 'execution_complete' | 'parser_signal';
  timestamp: string;
  executionId?: string;
  stepId?: string;
  stepIndex?: number;
  status?: string;
  text?: string;
  stream?: 'stdout' | 'stderr';
  signal?: string;
  severity?: string;
  totalSteps?: number;
  kbDraftId?: string;
  error?: string;
}

/**
 * Get access token for API requests
 */
async function getAccessToken(): Promise<string> {
  // In production, get from auth context
  // For now, use the public anon key
  return publicAnonKey;
}

/**
 * Fetch all available guided fixes
 */
export async function listGuidedFixes(filters?: {
  os?: 'windows' | 'macos' | 'linux';
  category?: string;
  safety?: 'readOnly' | 'low' | 'risky' | 'destructive';
}): Promise<GuidedFix[]> {
  const token = await getAccessToken();
  
  const params = new URLSearchParams();
  if (filters?.os) params.append('os', filters.os);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.safety) params.append('safety', filters.safety);
  
  const url = `${BASE_URL}/guided-fixes${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch guided fixes' }));
    throw new Error(error.error || 'Failed to fetch guided fixes');
  }

  const data = await response.json();
  return data.fixes || [];
}

/**
 * Get details of a specific guided fix
 */
export async function getGuidedFix(id: string): Promise<GuidedFix> {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_URL}/guided-fixes/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch guided fix' }));
    throw new Error(error.error || 'Failed to fetch guided fix');
  }

  const data = await response.json();
  return data.fix;
}

/**
 * Execute a guided fix
 */
export async function executeGuidedFix(
  id: string,
  options: ExecuteOptions = {}
): Promise<{ executionId: string; wsUrl: string }> {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_URL}/guided-fixes/${id}/execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to execute guided fix' }));
    throw new Error(error.error || error.message || 'Failed to execute guided fix');
  }

  return await response.json();
}

/**
 * Get execution details
 */
export async function getExecution(executionId: string): Promise<GuidedFixExecution> {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_URL}/guided-fixes/executions/${executionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch execution' }));
    throw new Error(error.error || 'Failed to fetch execution');
  }

  const data = await response.json();
  return data.execution;
}

/**
 * Connect to WebSocket for live console streaming
 */
export function connectToExecutionStream(
  executionId: string,
  callbacks: {
    onConnected?: () => void;
    onExecutionStart?: (data: WebSocketMessage) => void;
    onStepStart?: (data: WebSocketMessage) => void;
    onOutput?: (data: WebSocketMessage) => void;
    onStepComplete?: (data: WebSocketMessage) => void;
    onExecutionComplete?: (data: WebSocketMessage) => void;
    onParserSignal?: (data: WebSocketMessage) => void;
    onError?: (error: Error) => void;
    onClose?: () => void;
  }
): WebSocket {
  const wsUrl = `wss://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/guided-fixes/executions/${executionId}/stream`;
  
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected for execution:', executionId);
    callbacks.onConnected?.();
  };

  ws.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'connected':
          // Already handled in onopen
          break;
        case 'execution_start':
          callbacks.onExecutionStart?.(message);
          break;
        case 'step_start':
          callbacks.onStepStart?.(message);
          break;
        case 'output':
          callbacks.onOutput?.(message);
          break;
        case 'step_complete':
          callbacks.onStepComplete?.(message);
          break;
        case 'execution_complete':
          callbacks.onExecutionComplete?.(message);
          break;
        case 'parser_signal':
          callbacks.onParserSignal?.(message);
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      callbacks.onError?.(error as Error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    callbacks.onError?.(new Error('WebSocket error'));
  };

  ws.onclose = () => {
    console.log('WebSocket closed for execution:', executionId);
    callbacks.onClose?.();
  };

  return ws;
}

/**
 * Abort a running execution
 */
export async function abortExecution(executionId: string): Promise<void> {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_URL}/guided-fixes/executions/${executionId}/abort`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to abort execution' }));
    throw new Error(error.error || 'Failed to abort execution');
  }
}