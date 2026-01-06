-- BuboIQ All-in-One Production Migration
-- This migration extends the existing schema with compliance, backup, remote session, and enhanced features

-- Core org billing fields (extend companies table)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS included_computers INT DEFAULT 10;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS overage_rate NUMERIC DEFAULT 1.20;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Compliance & Evidence
CREATE TABLE IF NOT EXISTS compliance_policies(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  policy_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_exports(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES compliance_policies(id) ON DELETE SET NULL,
  export_url TEXT,
  signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backup & Disaster Recovery
CREATE TABLE IF NOT EXISTS backup_jobs(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  device_id UUID,
  schedule TEXT,
  storage_backend TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backup_snapshots(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES backup_jobs(id) ON DELETE CASCADE,
  hash TEXT,
  storage_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remote session policies & logs
CREATE TABLE IF NOT EXISTS remote_session_policies(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  max_duration INT DEFAULT 60,
  require_mfa BOOLEAN DEFAULT TRUE,
  require_patch_level BOOLEAN DEFAULT TRUE,
  record_sessions BOOLEAN DEFAULT TRUE,
  require_consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_logs(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  device_id UUID,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  posture JSONB DEFAULT '{}'::JSONB,
  consent_captured BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  actions JSONB DEFAULT '[]'::JSONB,
  recording_url TEXT,
  recording_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets & KB enhancements
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS contains_phi BOOLEAN DEFAULT FALSE;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::JSONB;

-- Device OT support (if devices table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'devices') THEN
    ALTER TABLE devices ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('IT','OT'));
    ALTER TABLE devices ADD COLUMN IF NOT EXISTS vendor TEXT;
    ALTER TABLE devices ADD COLUMN IF NOT EXISTS firmware_version TEXT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS device_relationships(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  device_id UUID,
  peer_id UUID,
  protocol TEXT,
  port INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immutable audit log
CREATE TABLE IF NOT EXISTS audit_events(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity TEXT,
  entity_id UUID,
  action TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent mutations on audit_events (append-only)
CREATE OR REPLACE FUNCTION forbid_mutations_audit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events are append-only';
END $$;

DROP TRIGGER IF EXISTS audit_events_block_mut ON audit_events;
CREATE TRIGGER audit_events_block_mut
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION forbid_mutations_audit();

-- Stripe webhook idempotency
CREATE TABLE IF NOT EXISTS billing_events(
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Private Storage bucket for session recordings (handled via Supabase Storage API)
-- This would be created via: supabase storage buckets create recordings --private

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_session_logs_org_time ON session_logs(org_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_org_time ON audit_events(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backup_snapshots_job ON backup_snapshots(job_id);
CREATE INDEX IF NOT EXISTS idx_compliance_policies_org ON compliance_policies(org_id);
CREATE INDEX IF NOT EXISTS idx_evidence_exports_org ON evidence_exports(org_id);
CREATE INDEX IF NOT EXISTS idx_remote_session_policies_org ON remote_session_policies(org_id);

-- Update existing companies to have default billing values
UPDATE companies 
SET 
  included_computers = COALESCE(included_computers, 
    CASE tier
      WHEN 'starter' THEN 10
      WHEN 'pro' THEN 50
      WHEN 'team' THEN 150
      ELSE 10
    END
  ),
  overage_rate = COALESCE(overage_rate,
    CASE tier
      WHEN 'starter' THEN 1.20
      WHEN 'pro' THEN 1.00
      WHEN 'team' THEN 0.80
      ELSE 1.20
    END
  )
WHERE included_computers IS NULL OR overage_rate IS NULL;

-- Create default remote session policy for existing orgs
INSERT INTO remote_session_policies (org_id, max_duration, require_mfa, record_sessions, require_consent)
SELECT id, 60, TRUE, TRUE, TRUE
FROM companies
WHERE NOT EXISTS (
  SELECT 1 FROM remote_session_policies WHERE remote_session_policies.org_id = companies.id
);