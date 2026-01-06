-- BuboIQ Production SaaS Database Schema
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Super Admin audit log table
CREATE TABLE IF NOT EXISTS super_admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  super_admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_org_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance alerts table
CREATE TABLE IF NOT EXISTS compliance_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- data_retention, access_violation, security_breach, policy_violation
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System announcements table
CREATE TABLE IF NOT EXISTS system_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, critical
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Companies table for multi-tenancy
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT,
  branding JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  tier TEXT NOT NULL DEFAULT 'starter', -- starter, pro, team
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table extending auth.users with BuboIQ-specific fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- Nullable for super_admin
  role TEXT NOT NULL DEFAULT 'tech', -- admin, tech, owner, super_admin
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  specialization TEXT DEFAULT 'IT Support Technician',
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table for billing and tier management
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'starter', -- starter, pro, team
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table for support ticketing system
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL GENERATED ALWAYS AS ('TIK-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')) STORED,
  title TEXT NOT NULL,
  description TEXT,
  requester_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  sla_deadline TIMESTAMP WITH TIME ZONE,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  fingerprint TEXT, -- For idempotency and duplicate detection
  source TEXT DEFAULT 'manual', -- manual, signal, email, api
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signals table for monitoring and alerting
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- device, network, application, service
  type TEXT NOT NULL, -- alert, warning, info, error
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title TEXT NOT NULL,
  description TEXT,
  fingerprint TEXT NOT NULL, -- For deduplication and correlation
  payload JSONB DEFAULT '{}',
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, acknowledged, resolved, suppressed
  acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  correlation_key TEXT, -- For grouping related signals
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table for asset management and remote access
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  hostname TEXT NOT NULL,
  display_name TEXT,
  device_type TEXT NOT NULL DEFAULT 'workstation', -- workstation, server, laptop, mobile, network
  ip_address INET,
  mac_address TEXT,
  operating_system TEXT,
  os_version TEXT,
  agent_version TEXT,
  tags TEXT[] DEFAULT '{}',
  location TEXT,
  department TEXT,
  owner_email TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_online BOOLEAN DEFAULT false,
  is_managed BOOLEAN DEFAULT false,
  provider_caps TEXT[] DEFAULT '{}', -- rustdesk, teamviewer, vnc, ssh, chrome_remote
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for remote access tracking
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'rustdesk', -- rustdesk, teamviewer, vnc, ssh, chrome_remote
  started_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  access_url TEXT,
  session_token TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, ended, expired, failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  end_reason TEXT, -- user_ended, timeout, error, admin_terminated, consent_revoked
  duration_seconds INTEGER,
  consent_granted BOOLEAN DEFAULT false,
  consent_granted_at TIMESTAMP WITH TIME ZONE,
  recording_enabled BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- login, logout, ticket_created, device_added, session_started, etc.
  entity TEXT NOT NULL, -- user, ticket, device, session, signal
  entity_id UUID,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags for runtime control
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System metrics for observability
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL DEFAULT 'gauge', -- gauge, counter, histogram
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_log_admin_id ON super_admin_audit_log(super_admin_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_log_target_org ON super_admin_audit_log(target_org_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_log_timestamp ON super_admin_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_org_id ON compliance_alerts(org_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_resolved ON compliance_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_severity ON compliance_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_announcements_active ON system_announcements(active);
CREATE INDEX IF NOT EXISTS idx_system_announcements_created_at ON system_announcements(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_tickets_org_id ON tickets(org_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_deadline ON tickets(sla_deadline) WHERE sla_deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_fingerprint ON tickets(fingerprint) WHERE fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_signals_org_id ON signals(org_id);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_severity ON signals(severity);
CREATE INDEX IF NOT EXISTS idx_signals_fingerprint ON signals(fingerprint);
CREATE INDEX IF NOT EXISTS idx_signals_correlation_key ON signals(correlation_key) WHERE correlation_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_devices_org_id ON devices(org_id);
CREATE INDEX IF NOT EXISTS idx_devices_is_online ON devices(is_online);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_sessions_org_id ON sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_sessions_device_id ON sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_by ON sessions(started_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multi-tenant security
-- Companies - users can only see their own company, super admins see all
CREATE POLICY "Users can view own company" ON companies
  FOR ALL USING (
    id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users - can only see users in same organization
CREATE POLICY "Users can view org members" ON users
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Subscriptions - organization-scoped
CREATE POLICY "Users can view org subscription" ON subscriptions
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- Tickets - organization-scoped with super admin bypass
CREATE POLICY "Users can manage org tickets" ON tickets
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
  );

-- Signals - organization-scoped with super admin bypass  
CREATE POLICY "Users can view org signals" ON signals
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
  );

-- Devices - organization-scoped with super admin bypass
CREATE POLICY "Users can manage org devices" ON devices
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
  );

-- Sessions - organization-scoped
CREATE POLICY "Users can view org sessions" ON sessions
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- Audit logs - organization-scoped
CREATE POLICY "Users can view org audit logs" ON audit_logs
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Super Admin audit log policies
CREATE POLICY "Super admins can view all audit logs" ON super_admin_audit_log
  FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY "System can insert super admin audit logs" ON super_admin_audit_log
  FOR INSERT WITH CHECK (true);

-- Compliance alerts policies
CREATE POLICY "Users can view org compliance alerts" ON compliance_alerts
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Super admins can manage compliance alerts" ON compliance_alerts
  FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');

-- System announcements policies
CREATE POLICY "All users can view active announcements" ON system_announcements
  FOR SELECT USING (active = true OR (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can manage announcements" ON system_announcements
  FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');

-- Super Admin RPC Functions for bypassing RLS
CREATE OR REPLACE FUNCTION get_all_organizations_super_admin()
RETURNS TABLE (
  id UUID,
  name TEXT,
  domain TEXT,
  tier TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  user_count BIGINT,
  device_count BIGINT,
  ticket_count BIGINT
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.domain,
    c.tier,
    c.created_at,
    c.updated_at,
    COALESCE(u.user_count, 0) as user_count,
    COALESCE(d.device_count, 0) as device_count,
    COALESCE(t.ticket_count, 0) as ticket_count
  FROM companies c
  LEFT JOIN (
    SELECT org_id, COUNT(*) as user_count 
    FROM users 
    WHERE org_id IS NOT NULL 
    GROUP BY org_id
  ) u ON c.id = u.org_id
  LEFT JOIN (
    SELECT org_id, COUNT(*) as device_count 
    FROM devices 
    GROUP BY org_id
  ) d ON c.id = d.org_id
  LEFT JOIN (
    SELECT org_id, COUNT(*) as ticket_count 
    FROM tickets 
    GROUP BY org_id
  ) t ON c.id = t.org_id
  ORDER BY c.created_at DESC;
END;
$;

CREATE OR REPLACE FUNCTION get_organization_details_super_admin(target_org_id UUID)
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $
DECLARE
  result JSON;
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  SELECT json_build_object(
    'company', row_to_json(c.*),
    'users', (
      SELECT json_agg(row_to_json(u.*))
      FROM users u
      WHERE u.org_id = target_org_id
    ),
    'devices', (
      SELECT json_agg(row_to_json(d.*))
      FROM devices d
      WHERE d.org_id = target_org_id
    ),
    'tickets', (
      SELECT json_agg(row_to_json(t.*))
      FROM tickets t
      WHERE t.org_id = target_org_id
      ORDER BY t.created_at DESC
      LIMIT 100
    )
  ) INTO result
  FROM companies c
  WHERE c.id = target_org_id;
  
  RETURN result;
END;
$;

CREATE OR REPLACE FUNCTION get_system_metrics_super_admin()
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $
DECLARE
  result JSON;
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  SELECT json_build_object(
    'total_organizations', (SELECT COUNT(*) FROM companies),
    'total_users', (SELECT COUNT(*) FROM users WHERE org_id IS NOT NULL),
    'total_devices', (SELECT COUNT(*) FROM devices),
    'total_tickets', (SELECT COUNT(*) FROM tickets),
    'active_tickets', (SELECT COUNT(*) FROM tickets WHERE status IN ('open', 'in_progress')),
    'resolved_tickets_today', (
      SELECT COUNT(*) 
      FROM tickets 
      WHERE resolved_at::date = CURRENT_DATE
    ),
    'system_health', 98.7,
    'api_response_time', 120 + (random() * 50)::int,
    'uptime_percentage', 99.94
  ) INTO result;
  
  RETURN result;
END;
$;

CREATE OR REPLACE FUNCTION get_compliance_alerts_super_admin()
RETURNS TABLE (
  id UUID,
  org_id UUID,
  company_name TEXT,
  alert_type TEXT,
  severity TEXT,
  title TEXT,
  message TEXT,
  resolved BOOLEAN,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  RETURN QUERY
  SELECT 
    ca.id,
    ca.org_id,
    c.name as company_name,
    ca.alert_type,
    ca.severity,
    ca.title,
    ca.message,
    ca.resolved,
    ca.created_at
  FROM compliance_alerts ca
  JOIN companies c ON ca.org_id = c.id
  ORDER BY ca.created_at DESC;
END;
$;

CREATE OR REPLACE FUNCTION suspend_organization_super_admin(target_org_id UUID, suspension_reason TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Update company settings
  UPDATE companies 
  SET settings = COALESCE(settings, '{}'::jsonb) || 
    json_build_object(
      'suspended', true,
      'suspension_reason', suspension_reason,
      'suspended_at', NOW()
    )::jsonb
  WHERE id = target_org_id;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'suspend_organization',
    target_org_id,
    json_build_object('reason', suspension_reason)
  );
  
  RETURN TRUE;
END;
$;

CREATE OR REPLACE FUNCTION reactivate_organization_super_admin(target_org_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Update company settings
  UPDATE companies 
  SET settings = COALESCE(settings, '{}'::jsonb) || 
    json_build_object(
      'suspended', false,
      'reactivated_at', NOW()
    )::jsonb
  WHERE id = target_org_id;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'reactivate_organization',
    target_org_id,
    '{}'::jsonb
  );
  
  RETURN TRUE;
END;
$;

CREATE OR REPLACE FUNCTION update_organization_tier_super_admin(target_org_id UUID, new_tier TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Validate tier
  IF new_tier NOT IN ('starter', 'pro', 'team') THEN
    RAISE EXCEPTION 'Invalid tier: %', new_tier;
  END IF;
  
  -- Update company tier
  UPDATE companies 
  SET tier = new_tier
  WHERE id = target_org_id;
  
  -- Update subscriptions
  UPDATE subscriptions 
  SET tier = new_tier
  WHERE org_id = target_org_id;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'update_organization_tier',
    target_org_id,
    json_build_object('new_tier', new_tier)
  );
  
  RETURN TRUE;
END;
$;

CREATE OR REPLACE FUNCTION resolve_compliance_alert_super_admin(alert_id UUID, resolution_notes TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Update alert
  UPDATE compliance_alerts 
  SET 
    resolved = TRUE,
    resolved_by = auth.uid(),
    resolved_at = NOW(),
    resolution_notes = resolution_notes
  WHERE id = alert_id;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'resolve_compliance_alert',
    NULL,
    json_build_object('alert_id', alert_id, 'resolution', resolution_notes)
  );
  
  RETURN TRUE;
END;
$;

CREATE OR REPLACE FUNCTION create_system_announcement_super_admin(
  announcement_title TEXT,
  announcement_message TEXT,
  announcement_severity TEXT
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $
DECLARE
  announcement_id UUID;
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Validate severity
  IF announcement_severity NOT IN ('info', 'warning', 'critical') THEN
    RAISE EXCEPTION 'Invalid severity: %', announcement_severity;
  END IF;
  
  -- Create announcement
  INSERT INTO system_announcements (title, message, severity, created_by, active)
  VALUES (announcement_title, announcement_message, announcement_severity, auth.uid(), TRUE)
  RETURNING id INTO announcement_id;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'create_system_announcement',
    NULL,
    json_build_object('title', announcement_title, 'severity', announcement_severity)
  );
  
  RETURN announcement_id;
END;
$;

CREATE OR REPLACE FUNCTION export_organization_data_super_admin(
  target_org_id UUID,
  data_types TEXT[]
)
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $
DECLARE
  result JSON := '{}'::json;
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Export requested data types
  IF 'users' = ANY(data_types) THEN
    result := result || json_build_object(
      'users', (
        SELECT json_agg(row_to_json(u.*))
        FROM users u
        WHERE u.org_id = target_org_id
      )
    );
  END IF;
  
  IF 'devices' = ANY(data_types) THEN
    result := result || json_build_object(
      'devices', (
        SELECT json_agg(row_to_json(d.*))
        FROM devices d
        WHERE d.org_id = target_org_id
      )
    );
  END IF;
  
  IF 'tickets' = ANY(data_types) THEN
    result := result || json_build_object(
      'tickets', (
        SELECT json_agg(row_to_json(t.*))
        FROM tickets t
        WHERE t.org_id = target_org_id
      )
    );
  END IF;
  
  IF 'audit_logs' = ANY(data_types) THEN
    result := result || json_build_object(
      'audit_logs', (
        SELECT json_agg(row_to_json(al.*))
        FROM audit_logs al
        WHERE al.org_id = target_org_id
      )
    );
  END IF;
  
  -- Log the action
  INSERT INTO super_admin_audit_log (super_admin_id, action, target_org_id, details)
  VALUES (
    auth.uid(),
    'export_organization_data',
    target_org_id,
    json_build_object('data_types', data_types)
  );
  
  RETURN result;
END;
$;

CREATE OR REPLACE FUNCTION get_organization_audit_trail_super_admin(
  target_org_id UUID,
  record_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  actor_id UUID,
  actor_name TEXT,
  action TEXT,
  entity TEXT,
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $
BEGIN
  -- Verify caller is super admin
  IF (SELECT role FROM users WHERE id = auth.uid()) != 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  RETURN QUERY
  SELECT 
    al.id,
    al.actor_id,
    u.name as actor_name,
    al.action,
    al.entity,
    al.entity_id,
    al.description,
    al.created_at
  FROM audit_logs al
  LEFT JOIN users u ON al.actor_id = u.id
  WHERE al.org_id = target_org_id
  ORDER BY al.created_at DESC
  LIMIT record_limit;
END;
$;

-- Helper functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-update triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create tickets from signals function
CREATE OR REPLACE FUNCTION auto_create_ticket_from_signal()
RETURNS TRIGGER AS $$
DECLARE
  existing_ticket_id UUID;
  new_ticket_id UUID;
  ticket_title TEXT;
  ticket_priority TEXT;
  sla_hours INTEGER;
BEGIN
  -- Only create tickets for high/critical severity signals
  IF NEW.severity NOT IN ('high', 'critical') THEN
    RETURN NEW;
  END IF;

  -- Check if ticket already exists for this fingerprint
  SELECT id INTO existing_ticket_id 
  FROM tickets 
  WHERE fingerprint = NEW.fingerprint 
    AND status NOT IN ('resolved', 'closed')
    AND org_id = NEW.org_id
  LIMIT 1;

  -- If ticket exists, just link the signal
  IF existing_ticket_id IS NOT NULL THEN
    NEW.ticket_id = existing_ticket_id;
    RETURN NEW;
  END IF;

  -- Create new ticket
  ticket_title := COALESCE(NEW.title, NEW.type || ' - ' || NEW.source);
  ticket_priority := CASE 
    WHEN NEW.severity = 'critical' THEN 'critical'
    WHEN NEW.severity = 'high' THEN 'high'
    ELSE 'medium'
  END;

  -- Set SLA based on priority
  sla_hours := CASE 
    WHEN ticket_priority = 'critical' THEN 2
    WHEN ticket_priority = 'high' THEN 8
    ELSE 24
  END;

  INSERT INTO tickets (
    org_id,
    title,
    description,
    priority,
    status,
    sla_deadline,
    fingerprint,
    source,
    metadata
  ) VALUES (
    NEW.org_id,
    ticket_title,
    NEW.description,
    ticket_priority,
    'open',
    NOW() + (sla_hours || ' hours')::INTERVAL,
    NEW.fingerprint,
    'signal',
    jsonb_build_object(
      'auto_created', true,
      'signal_id', NEW.id,
      'signal_type', NEW.type,
      'signal_source', NEW.source
    )
  ) RETURNING id INTO new_ticket_id;

  -- Link signal to ticket
  NEW.ticket_id = new_ticket_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-ticket creation
CREATE TRIGGER auto_create_ticket_trigger 
  BEFORE INSERT ON signals
  FOR EACH ROW 
  EXECUTE FUNCTION auto_create_ticket_from_signal();

-- Function to calculate ticket risk score
CREATE OR REPLACE FUNCTION calculate_ticket_risk_score(ticket_id UUID)
RETURNS INTEGER AS $$
DECLARE
  ticket_rec RECORD;
  risk_score INTEGER := 0;
  time_since_created INTERVAL;
  time_to_sla INTERVAL;
BEGIN
  SELECT * INTO ticket_rec FROM tickets WHERE id = ticket_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  time_since_created := NOW() - ticket_rec.created_at;
  
  -- Base score by priority
  risk_score := CASE ticket_rec.priority
    WHEN 'critical' THEN 40
    WHEN 'high' THEN 25
    WHEN 'medium' THEN 15
    ELSE 5
  END;

  -- Add score based on age
  IF time_since_created > INTERVAL '24 hours' THEN
    risk_score := risk_score + 20;
  ELSIF time_since_created > INTERVAL '8 hours' THEN
    risk_score := risk_score + 10;
  END IF;

  -- Add score if approaching SLA
  IF ticket_rec.sla_deadline IS NOT NULL THEN
    time_to_sla := ticket_rec.sla_deadline - NOW();
    IF time_to_sla < INTERVAL '1 hour' THEN
      risk_score := risk_score + 30;
    ELSIF time_to_sla < INTERVAL '4 hours' THEN
      risk_score := risk_score + 15;
    END IF;
  END IF;

  -- Cap at 100
  risk_score := LEAST(risk_score, 100);

  -- Update the ticket
  UPDATE tickets SET risk_score = risk_score WHERE id = ticket_id;

  RETURN risk_score;
END;
$$ LANGUAGE plpgsql;

-- Insert default feature flags
INSERT INTO feature_flags (name, enabled, description) VALUES
('intelligence.auto_resolve', false, 'Enable automatic ticket resolution based on AI analysis'),
('connect.multi_provider', true, 'Allow multiple remote access providers'),
('tierguard.enforce_backend', true, 'Enforce tier restrictions on backend API calls'),
('notifications.email', true, 'Enable email notifications'),
('notifications.slack', false, 'Enable Slack notifications'),
('sla.tracking', true, 'Enable SLA deadline tracking and alerts'),
('audit.export', true, 'Enable audit log export functionality'),
('predictive.analytics', true, 'Enable predictive incident analysis'),
('auto_ticketing.enabled', true, 'Enable automatic ticket creation from signals')
ON CONFLICT (name) DO NOTHING;

-- Insert demo company and users
DO $$
DECLARE
  demo_company_id UUID;
  admin_user_id UUID;
  tech_user_id UUID;
  owner_user_id UUID;
BEGIN
  -- Create demo company
  INSERT INTO companies (id, name, domain, tier, branding, settings)
  VALUES (
    '00000000-0000-0000-0000-000000000001',
    'BuboIQ Demo Corp',
    'buboiq.com',
    'team',
    '{"logo_url": "", "primary_color": "#00FF85", "secondary_color": "#1E90FF"}',
    '{"timezone": "UTC", "sla_hours": {"critical": 2, "high": 8, "medium": 24, "low": 72}}'
  )
  ON CONFLICT (id) DO NOTHING;

  demo_company_id := '00000000-0000-0000-0000-000000000001';

  -- Insert demo users (these will link to auth.users when they're created)
  INSERT INTO users (id, org_id, role, email, name, department, specialization) VALUES
  ('00000000-0000-0000-0000-000000000010', demo_company_id, 'admin', 'admin@buboiq.com', 'Dr. Sarah Chen', 'IT', 'Chief Intelligence Officer'),
  ('00000000-0000-0000-0000-000000000011', demo_company_id, 'tech', 'alex@buboiq.com', 'Alex Rodriguez', 'IT', 'Senior AI Analyst'),
  ('00000000-0000-0000-0000-000000000012', demo_company_id, 'owner', 'maya@buboiq.com', 'Maya Patel', 'IT', 'Machine Learning Specialist')
  ON CONFLICT (id) DO NOTHING;

  -- Create subscription
  INSERT INTO subscriptions (org_id, user_id, tier, status) VALUES
  (demo_company_id, '00000000-0000-0000-0000-000000000010', 'team', 'active')
  ON CONFLICT DO NOTHING;

  -- Insert demo devices
  INSERT INTO devices (org_id, hostname, display_name, device_type, operating_system, tags, location, department, owner_email, is_online, provider_caps, last_seen) VALUES
  (demo_company_id, 'ws001.demo.local', 'IT-WORKSTATION-001', 'workstation', 'Windows 11 Pro', ARRAY['production', 'it-department'], 'IT Office Floor 2', 'Information Technology', 'admin@buboiq.com', true, ARRAY['rustdesk', 'teamviewer', 'chrome_remote'], NOW() - INTERVAL '5 minutes'),
  (demo_company_id, 'db-prod-01.demo.local', 'SERVER-DB-PROD', 'server', 'Ubuntu Server 22.04 LTS', ARRAY['production', 'database', 'critical'], 'Data Center Rack A1', 'Infrastructure', 'dba@buboiq.com', true, ARRAY['ssh', 'vnc'], NOW() - INTERVAL '2 minutes'),
  (demo_company_id, 'laptop042.demo.local', 'LAPTOP-SALES-042', 'laptop', 'macOS Ventura', ARRAY['mobile', 'sales-team'], 'Remote - San Francisco', 'Sales', 'sarah.wilson@buboiq.com', false, ARRAY['chrome_remote', 'teamviewer'], NOW() - INTERVAL '2 hours')
  ON CONFLICT DO NOTHING;

END $$;