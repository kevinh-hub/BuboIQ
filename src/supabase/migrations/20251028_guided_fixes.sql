-- Guided Fixes Backend Schema
-- Customer-facing label: "Guided Fixes"
-- Internal model name: "runbook"

-- ============================================================================
-- TABLES
-- ============================================================================

-- Guided Fixes (Runbooks) - The fix definitions
CREATE TABLE IF NOT EXISTS guided_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Multi-OS Support
  os_types TEXT[] NOT NULL DEFAULT '{}', -- ['windows', 'macos', 'linux']
  
  -- Safety Classification
  safety_level TEXT NOT NULL CHECK (safety_level IN ('readOnly', 'low', 'risky', 'destructive')),
  
  -- Time Estimate
  est_mins TEXT, -- e.g., "2–4 min"
  
  -- Tier Access Control
  tier_required TEXT NOT NULL DEFAULT 'pro' CHECK (tier_required IN ('starter', 'pro', 'team')),
  requires_approval BOOLEAN DEFAULT false, -- Team approval for destructive
  
  -- Steps (JSONB array of step definitions)
  steps JSONB NOT NULL DEFAULT '[]',
  -- Step structure:
  -- {
  --   "id": "step-1",
  --   "title": "Check DNS configuration",
  --   "command": "ipconfig /all | findstr /i \"DNS\"",
  --   "os": "windows",
  --   "shell": "PowerShell",
  --   "safety": "readOnly",
  --   "whatItDoes": "Displays current DNS server configuration",
  --   "expectedOutput": "DNS Servers . . . . . . . . . . . : 8.8.8.8",
  --   "prereqs": ["Network adapter present"],
  --   "requiresElevation": false,
  --   "supportsDryRun": false
  -- }
  
  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'deprecated')),
  version INTEGER DEFAULT 1,
  
  -- Organization (for custom org-specific fixes)
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT true, -- Built-in vs org-specific
  
  -- Categories/Tags
  categories TEXT[] DEFAULT '{}', -- ['network', 'performance', 'security']
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_reviewed_at TIMESTAMPTZ
);

-- Guided Fix Executions - Execution history and live state
CREATE TABLE IF NOT EXISTS guided_fix_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  guided_fix_id UUID NOT NULL REFERENCES guided_fixes(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Optional Context
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL, -- If run from an issue/ticket
  computer_id UUID, -- Device identifier
  
  -- Execution Path
  execution_path TEXT NOT NULL CHECK (execution_path IN ('agent', 'connect', 'winrm')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('pending', 'running', 'success', 'failed', 'aborted')),
  
  -- Progress
  steps_total INTEGER NOT NULL,
  steps_completed INTEGER DEFAULT 0,
  current_step_id TEXT,
  current_step_index INTEGER,
  
  -- Results
  kb_draft_id UUID, -- Auto-created KB article if successful
  error_message TEXT,
  error_step_id TEXT,
  
  -- Logs (full console output)
  logs JSONB DEFAULT '[]',
  -- Log entry structure:
  -- {
  --   "timestamp": "2024-10-28T...",
  --   "text": "Running: ipconfig /flushdns",
  --   "type": "stdout" | "stderr" | "info" | "error",
  --   "stepId": "step-1"
  -- }
  
  -- Security
  elevated BOOLEAN DEFAULT false,
  dry_run BOOLEAN DEFAULT false,
  
  -- Audit Trail
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER, -- Total execution time
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step Execution Details - Individual step tracking
CREATE TABLE IF NOT EXISTS guided_fix_step_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  execution_id UUID NOT NULL REFERENCES guided_fix_executions(id) ON DELETE CASCADE,
  
  step_id TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'failed', 'skipped')),
  
  -- Command Details
  command TEXT NOT NULL,
  shell TEXT,
  os TEXT,
  elevated BOOLEAN DEFAULT false,
  
  -- Results
  output TEXT,
  error TEXT,
  exit_code INTEGER,
  
  -- Parser Signals (e.g., DNS_TIMEOUT, HIGH_LATENCY)
  parser_signals TEXT[] DEFAULT '{}',
  
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_guided_fixes_status ON guided_fixes(status);
CREATE INDEX IF NOT EXISTS idx_guided_fixes_org ON guided_fixes(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guided_fixes_global ON guided_fixes(is_global) WHERE is_global = true;
CREATE INDEX IF NOT EXISTS idx_guided_fixes_tier ON guided_fixes(tier_required);
CREATE INDEX IF NOT EXISTS idx_guided_fixes_os ON guided_fixes USING GIN(os_types);

CREATE INDEX IF NOT EXISTS idx_executions_fix ON guided_fix_executions(guided_fix_id);
CREATE INDEX IF NOT EXISTS idx_executions_device ON guided_fix_executions(device_id);
CREATE INDEX IF NOT EXISTS idx_executions_org ON guided_fix_executions(org_id);
CREATE INDEX IF NOT EXISTS idx_executions_user ON guided_fix_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_issue ON guided_fix_executions(issue_id) WHERE issue_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_executions_status ON guided_fix_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_created ON guided_fix_executions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_step_executions_execution ON guided_fix_step_executions(execution_id);
CREATE INDEX IF NOT EXISTS idx_step_executions_status ON guided_fix_step_executions(status);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE guided_fixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_fix_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_fix_step_executions ENABLE ROW LEVEL SECURITY;

-- Guided Fixes Policies
CREATE POLICY "Users can view global guided fixes"
  ON guided_fixes FOR SELECT
  USING (is_global = true);

CREATE POLICY "Users can view org guided fixes"
  ON guided_fixes FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pro+ can create org guided fixes"
  ON guided_fixes FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT om.org_id FROM organization_members om
      JOIN organizations o ON o.id = om.org_id
      WHERE om.user_id = auth.uid()
        AND o.subscription_tier IN ('pro', 'team')
    )
  );

CREATE POLICY "Admins can update org guided fixes"
  ON guided_fixes FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Execution Policies
CREATE POLICY "Users can view own org executions"
  ON guided_fix_executions FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create executions"
  ON guided_fix_executions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own executions"
  ON guided_fix_executions FOR UPDATE
  USING (user_id = auth.uid());

-- Step Execution Policies
CREATE POLICY "Users can view step executions"
  ON guided_fix_step_executions FOR SELECT
  USING (
    execution_id IN (
      SELECT id FROM guided_fix_executions
      WHERE org_id IN (
        SELECT org_id FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "System can manage step executions"
  ON guided_fix_step_executions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_guided_fix_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guided_fixes_timestamp
  BEFORE UPDATE ON guided_fixes
  FOR EACH ROW
  EXECUTE FUNCTION update_guided_fix_updated_at();

CREATE TRIGGER update_guided_fix_executions_timestamp
  BEFORE UPDATE ON guided_fix_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_guided_fix_updated_at();

-- Calculate execution duration on completion
CREATE OR REPLACE FUNCTION calculate_execution_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('success', 'failed', 'aborted') AND OLD.status = 'running' THEN
    NEW.completed_at = NOW();
    NEW.duration_ms = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) * 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_guided_fix_execution_duration
  BEFORE UPDATE ON guided_fix_executions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_execution_duration();

-- Calculate step duration on completion
CREATE OR REPLACE FUNCTION calculate_step_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('success', 'failed', 'skipped') AND NEW.started_at IS NOT NULL THEN
    NEW.completed_at = NOW();
    NEW.duration_ms = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) * 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_step_execution_duration
  BEFORE UPDATE ON guided_fix_step_executions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_step_duration();

-- ============================================================================
-- SEED DATA - Global Guided Fixes
-- ============================================================================

-- Network: No Internet Connection
INSERT INTO guided_fixes (
  id,
  title,
  description,
  os_types,
  safety_level,
  est_mins,
  tier_required,
  requires_approval,
  is_global,
  status,
  categories,
  steps
) VALUES (
  'c9a1b2c3-d4e5-6f78-90ab-cdef12345678',
  'Network: No Internet Connection',
  'Diagnose and fix DNS issues, flush cache, reset Winsock catalog',
  ARRAY['windows', 'macos', 'linux'],
  'risky',
  '2–4 min',
  'pro',
  false,
  true,
  'published',
  ARRAY['network', 'connectivity'],
  '[
    {
      "id": "step-1",
      "title": "Check DNS configuration",
      "command": "ipconfig /all | findstr /i \"DNS\"",
      "os": "windows",
      "shell": "PowerShell",
      "safety": "readOnly",
      "whatItDoes": "Displays current DNS server configuration without making changes",
      "expectedOutput": "DNS Servers . . . . . . . . . . . : 8.8.8.8, 8.8.4.4",
      "prereqs": ["Network adapter present"],
      "requiresElevation": false,
      "supportsDryRun": false
    },
    {
      "id": "step-2",
      "title": "Flush DNS cache",
      "command": "ipconfig /flushdns",
      "os": "windows",
      "shell": "cmd",
      "safety": "low",
      "whatItDoes": "Clears the DNS resolver cache to fix name resolution issues",
      "expectedOutput": "Successfully flushed the DNS Resolver Cache.",
      "prereqs": ["Admin privileges"],
      "requiresElevation": true,
      "supportsDryRun": false
    },
    {
      "id": "step-3",
      "title": "Reset network adapter",
      "command": "netsh winsock reset",
      "os": "windows",
      "shell": "cmd",
      "safety": "risky",
      "whatItDoes": "Resets the Winsock catalog to fix network connectivity issues. Requires restart.",
      "expectedOutput": "Successfully reset the Winsock Catalog. You must restart the computer.",
      "prereqs": ["Admin privileges"],
      "requiresElevation": true,
      "supportsDryRun": false
    }
  ]'::jsonb
);

-- Investigate High CPU
INSERT INTO guided_fixes (
  id,
  title,
  description,
  os_types,
  safety_level,
  est_mins,
  tier_required,
  requires_approval,
  is_global,
  status,
  categories,
  steps
) VALUES (
  'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Investigate High CPU Usage',
  'Identify processes, collect system info, generate performance report',
  ARRAY['windows', 'macos', 'linux'],
  'readOnly',
  '1–3 min',
  'pro',
  false,
  true,
  'published',
  ARRAY['performance', 'diagnostics'],
  '[
    {
      "id": "step-1",
      "title": "List top CPU processes",
      "command": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,CPU,Id",
      "os": "windows",
      "shell": "PowerShell",
      "safety": "readOnly",
      "whatItDoes": "Lists the top 10 processes by CPU usage",
      "expectedOutput": "Name                       CPU         Id\n----                       ---         --\nchrome                   45.23       1234",
      "prereqs": [],
      "requiresElevation": false,
      "supportsDryRun": false
    },
    {
      "id": "step-2",
      "title": "Collect system information",
      "command": "Get-ComputerInfo | Select-Object CsName,OsName,OsVersion,CsNumberOfProcessors,CsTotalPhysicalMemory",
      "os": "windows",
      "shell": "PowerShell",
      "safety": "readOnly",
      "whatItDoes": "Gathers key system specifications",
      "expectedOutput": "CsName            : DESKTOP-ABC123\nOsName            : Microsoft Windows 11 Pro",
      "prereqs": [],
      "requiresElevation": false,
      "supportsDryRun": false
    }
  ]'::jsonb
);

-- Collect Logs Bundle
INSERT INTO guided_fixes (
  id,
  title,
  description,
  os_types,
  safety_level,
  est_mins,
  tier_required,
  requires_approval,
  is_global,
  status,
  categories,
  steps
) VALUES (
  'e2c3d4e5-f678-90ab-cdef-123456789012',
  'Collect Logs Bundle',
  'Gather system logs, event logs, and diagnostics for support',
  ARRAY['windows'],
  'readOnly',
  '1–2 min',
  'pro',
  false,
  true,
  'published',
  ARRAY['diagnostics', 'support'],
  '[
    {
      "id": "step-1",
      "title": "Export system event log",
      "command": "wevtutil epl System C:\\Temp\\System.evtx",
      "os": "windows",
      "shell": "cmd",
      "safety": "readOnly",
      "whatItDoes": "Exports the System event log to a file",
      "expectedOutput": "Exported successfully",
      "prereqs": ["Admin privileges", "C:\\Temp directory exists"],
      "requiresElevation": true,
      "supportsDryRun": false
    },
    {
      "id": "step-2",
      "title": "Export application event log",
      "command": "wevtutil epl Application C:\\Temp\\Application.evtx",
      "os": "windows",
      "shell": "cmd",
      "safety": "readOnly",
      "whatItDoes": "Exports the Application event log to a file",
      "expectedOutput": "Exported successfully",
      "prereqs": ["Admin privileges", "C:\\Temp directory exists"],
      "requiresElevation": true,
      "supportsDryRun": false
    }
  ]'::jsonb
);

-- Disk Space Sweep
INSERT INTO guided_fixes (
  id,
  title,
  description,
  os_types,
  safety_level,
  est_mins,
  tier_required,
  requires_approval,
  is_global,
  status,
  categories,
  steps
) VALUES (
  'f3d4e5f6-7890-abcd-ef12-34567890abcd',
  'Disk Space Sweep',
  'Identify large files, clean temp folders, free up space',
  ARRAY['windows', 'linux'],
  'risky',
  '2–6 min',
  'team',
  true,
  true,
  'published',
  ARRAY['storage', 'maintenance'],
  '[
    {
      "id": "step-1",
      "title": "Find large files",
      "command": "Get-ChildItem C:\\ -Recurse -ErrorAction SilentlyContinue | Where-Object {$_.Length -gt 1GB} | Sort-Object Length -Descending | Select-Object -First 20 FullName,@{Name=\"Size(GB)\";Expression={[math]::Round($_.Length/1GB,2)}}",
      "os": "windows",
      "shell": "PowerShell",
      "safety": "readOnly",
      "whatItDoes": "Finds the 20 largest files over 1GB on C: drive",
      "expectedOutput": "FullName                                   Size(GB)\n--------                                   --------\nC:\\pagefile.sys                            16.00",
      "prereqs": ["Admin privileges"],
      "requiresElevation": true,
      "supportsDryRun": false
    },
    {
      "id": "step-2",
      "title": "Clean temp folders",
      "command": "Remove-Item C:\\Windows\\Temp\\* -Recurse -Force -ErrorAction SilentlyContinue",
      "os": "windows",
      "shell": "PowerShell",
      "safety": "risky",
      "whatItDoes": "Deletes all files in Windows temp folder. Cannot be undone.",
      "expectedOutput": "Cleanup completed",
      "prereqs": ["Admin privileges"],
      "requiresElevation": true,
      "supportsDryRun": false
    }
  ]'::jsonb
);

-- Flush DNS (Quick Action)
INSERT INTO guided_fixes (
  id,
  title,
  description,
  os_types,
  safety_level,
  est_mins,
  tier_required,
  requires_approval,
  is_global,
  status,
  categories,
  steps
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Flush DNS Cache',
  'Quick action to clear DNS resolver cache',
  ARRAY['windows', 'macos', 'linux'],
  'low',
  '<1 min',
  'starter',
  false,
  true,
  'published',
  ARRAY['network', 'quick-action'],
  '[
    {
      "id": "step-1",
      "title": "Flush DNS cache",
      "command": "ipconfig /flushdns",
      "os": "windows",
      "shell": "cmd",
      "safety": "low",
      "whatItDoes": "Clears the DNS resolver cache",
      "expectedOutput": "Successfully flushed the DNS Resolver Cache.",
      "prereqs": ["Admin privileges"],
      "requiresElevation": true,
      "supportsDryRun": false
    }
  ]'::jsonb
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE guided_fixes IS 'Guided Fix definitions (customer-facing label; internal model = runbook)';
COMMENT ON TABLE guided_fix_executions IS 'Execution history and live state for Guided Fixes';
COMMENT ON TABLE guided_fix_step_executions IS 'Individual step tracking within executions';

COMMENT ON COLUMN guided_fixes.tier_required IS 'Minimum tier: starter ($33), pro ($127), team ($297)';
COMMENT ON COLUMN guided_fixes.requires_approval IS 'Team tier: require approval before execution';
COMMENT ON COLUMN guided_fix_executions.execution_path IS 'agent (local), connect (remote), winrm (future)';
COMMENT ON COLUMN guided_fix_executions.kb_draft_id IS 'Auto-created Knowledge Base article on success';
