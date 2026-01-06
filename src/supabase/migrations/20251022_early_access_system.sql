-- Early Access System Migration
-- Implements invite-only, time-gated Early Access with cohort controls

-- ============================================================================
-- Early Access Cohort Configuration
-- ============================================================================
CREATE TABLE IF NOT EXISTS early_access_cohort (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_cap INTEGER NOT NULL DEFAULT 50,
  device_cap INTEGER NOT NULL DEFAULT 5000,
  closes_at TIMESTAMP WITH TIME ZONE,
  emergency_closed BOOLEAN NOT NULL DEFAULT FALSE,
  auto_expire_invites BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default cohort configuration
INSERT INTO early_access_cohort (org_cap, device_cap, closes_at, emergency_closed, auto_expire_invites)
VALUES (50, 5000, NOW() + INTERVAL '90 days', FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Early Access Invites
-- ============================================================================
CREATE TABLE IF NOT EXISTS early_access_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  plan_name TEXT NOT NULL DEFAULT 'EA-Pro',
  devices_included INTEGER NOT NULL DEFAULT 100,
  overage_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.90,
  days_valid INTEGER NOT NULL DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'redeemed', 'expired', 'revoked')),
  notes TEXT,
  
  -- Redemption tracking
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by_user_id UUID,
  redeemed_by_org_id UUID,
  redeemed_ip TEXT,
  
  -- Audit trail
  created_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by_user_id UUID,
  revoke_reason TEXT,
  
  -- Email tracking
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_opened_at TIMESTAMP WITH TIME ZONE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ea_invites_token ON early_access_invites(token);
CREATE INDEX IF NOT EXISTS idx_ea_invites_email ON early_access_invites(email);
CREATE INDEX IF NOT EXISTS idx_ea_invites_status ON early_access_invites(status);
CREATE INDEX IF NOT EXISTS idx_ea_invites_expires_at ON early_access_invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_ea_invites_created_at ON early_access_invites(created_at);

-- ============================================================================
-- Early Access Audit Log
-- ============================================================================
CREATE TABLE IF NOT EXISTS early_access_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID REFERENCES early_access_invites(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_user_id UUID,
  actor_email TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_ea_audit_invite_id ON early_access_audit_log(invite_id);
CREATE INDEX IF NOT EXISTS idx_ea_audit_created_at ON early_access_audit_log(created_at);

-- ============================================================================
-- Early Access Organizations Tracking
-- ============================================================================
-- Extends the organizations table with EA tracking
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_early_access BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ea_invite_id UUID REFERENCES early_access_invites(id);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ea_founders_rate DECIMAL(10, 2) DEFAULT 99.00;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ea_founders_rate_expires_at TIMESTAMP WITH TIME ZONE;

-- ============================================================================
-- Functions
-- ============================================================================

-- Function to auto-expire invites
CREATE OR REPLACE FUNCTION expire_early_access_invites()
RETURNS void AS $$
BEGIN
  UPDATE early_access_invites
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'unused'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check cohort capacity
CREATE OR REPLACE FUNCTION check_early_access_cohort_capacity()
RETURNS TABLE(
  org_count BIGINT,
  org_cap INTEGER,
  device_count BIGINT,
  device_cap INTEGER,
  cohort_closed BOOLEAN,
  can_redeem BOOLEAN
) AS $$
DECLARE
  cohort_config RECORD;
  current_org_count BIGINT;
  current_device_count BIGINT;
BEGIN
  -- Get cohort configuration
  SELECT * INTO cohort_config FROM early_access_cohort LIMIT 1;
  
  -- Count current EA orgs
  SELECT COUNT(*) INTO current_org_count 
  FROM organizations 
  WHERE is_early_access = TRUE;
  
  -- Count current EA devices
  SELECT COALESCE(SUM(device_limit), 0) INTO current_device_count
  FROM organizations 
  WHERE is_early_access = TRUE;
  
  RETURN QUERY SELECT
    current_org_count,
    cohort_config.org_cap,
    current_device_count,
    cohort_config.device_cap,
    (cohort_config.emergency_closed OR cohort_config.closes_at < NOW())::BOOLEAN,
    (
      current_org_count < cohort_config.org_cap AND
      current_device_count < cohort_config.device_cap AND
      NOT cohort_config.emergency_closed AND
      (cohort_config.closes_at IS NULL OR cohort_config.closes_at > NOW())
    )::BOOLEAN;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique invite token
CREATE OR REPLACE FUNCTION generate_ea_invite_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  token_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random token (20 characters)
    token := encode(gen_random_bytes(15), 'base64');
    token := replace(replace(replace(token, '/', '_'), '+', '-'), '=', '');
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM early_access_invites WHERE token = token) INTO token_exists;
    
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE early_access_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_access_cohort ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_access_audit_log ENABLE ROW LEVEL SECURITY;

-- Super admins can do everything
CREATE POLICY "Super admins full access to EA invites"
  ON early_access_invites FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
  ));

CREATE POLICY "Super admins full access to EA cohort"
  ON early_access_cohort FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
  ));

CREATE POLICY "Super admins full access to EA audit log"
  ON early_access_audit_log FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
  ));

-- Public can validate their own invite tokens (via service role in backend)
-- All other operations are handled through backend API with service role

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_early_access_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ea_invites_timestamp
  BEFORE UPDATE ON early_access_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_early_access_timestamp();

CREATE TRIGGER update_ea_cohort_timestamp
  BEFORE UPDATE ON early_access_cohort
  FOR EACH ROW
  EXECUTE FUNCTION update_early_access_timestamp();

-- ============================================================================
-- Sample Data (for development)
-- ============================================================================

-- Create a sample invite (commented out for production)
-- INSERT INTO early_access_invites (
--   token,
--   email,
--   plan_name,
--   devices_included,
--   overage_rate,
--   days_valid,
--   expires_at,
--   notes
-- ) VALUES (
--   'sample-invite-token-123',
--   'test@example.com',
--   'EA-Pro',
--   100,
--   0.90,
--   10,
--   NOW() + INTERVAL '10 days',
--   'Sample invite for testing'
-- );

COMMENT ON TABLE early_access_invites IS 'Single-use invite tokens for Early Access program';
COMMENT ON TABLE early_access_cohort IS 'Cohort configuration and capacity limits';
COMMENT ON TABLE early_access_audit_log IS 'Audit trail for all EA invite operations';
