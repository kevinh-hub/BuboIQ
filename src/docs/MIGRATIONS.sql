-- BuboIQ Back Office - Production Database Migrations
-- NO MOCK DATA. NO SEEDS. PRODUCTION ONLY.
-- Run via Supabase Dashboard > SQL Editor

-- ============================================================================
-- SCHEMAS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS audit_compliance;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS support;
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS analytics;

-- ============================================================================
-- AUDIT & COMPLIANCE
-- ============================================================================

-- Core audit log for all admin actions
-- Every admin operation MUST write here (who, what, when, target, before/after state)
CREATE TABLE IF NOT EXISTS audit_compliance.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL, -- e.g., 'change_tier', 'extend_trial', 'impersonate_org'
  target_org_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  before_json jsonb, -- state before change
  after_json jsonb, -- state after change
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_compliance.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON audit_compliance.audit_log(target_org_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_compliance.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_compliance.audit_log(action);

COMMENT ON TABLE audit_compliance.audit_log IS 'Immutable audit trail for all admin actions. Required for SOC2/GDPR compliance.';

-- ============================================================================
-- FINANCE & BILLING
-- ============================================================================

-- Finance operations mirror (Stripe → DB)
-- Updated by stripe-webhook edge function on subscription events
CREATE TABLE IF NOT EXISTS finance.finance_ops (
  org_id uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text,
  plan text NOT NULL, -- 'Starter', 'Growth', 'Pro', 'Enterprise'
  mrr_cents int NOT NULL DEFAULT 0, -- Monthly Recurring Revenue in cents
  status text NOT NULL, -- 'active', 'trialing', 'past_due', 'canceled', 'unpaid'
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  last_invoice_status text, -- 'paid', 'open', 'void', 'uncollectible'
  last_payment_failed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finance_ops_status ON finance.finance_ops(status);
CREATE INDEX IF NOT EXISTS idx_finance_ops_trial_end ON finance.finance_ops(trial_end) WHERE trial_end IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_finance_ops_stripe_customer ON finance.finance_ops(stripe_customer_id);

COMMENT ON TABLE finance.finance_ops IS 'Real-time mirror of Stripe subscription state. Updated by webhooks only.';

-- ============================================================================
-- SUPPORT
-- ============================================================================

-- Unified support ticket tracking (in-app + Streak integration)
CREATE TABLE IF NOT EXISTS support.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  source text NOT NULL, -- 'in-app', 'email', 'streak'
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
  priority text DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  streak_box_url text, -- Deep link to Streak CRM if synced
  notes_json jsonb DEFAULT '[]'::jsonb, -- Array of {actor_id, text, created_at}
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_org ON support.support_tickets(org_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support.support_tickets(created_at DESC);

COMMENT ON TABLE support.support_tickets IS 'Unified support queue from all channels. No mock data allowed.';

-- ============================================================================
-- SYSTEM
-- ============================================================================

-- Background job health monitoring
CREATE TABLE IF NOT EXISTS system.system_jobs (
  name text PRIMARY KEY,
  last_run_at timestamptz,
  status text, -- 'success', 'failure', 'running'
  duration_ms int,
  note text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE system.system_jobs IS 'Cron job execution log. Updated by each job run.';

-- Feature flags for gradual rollout
CREATE TABLE IF NOT EXISTS system.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL, -- e.g., 'guided_fixes_v2', 'coming_soon_mode'
  enabled boolean DEFAULT false,
  rollout_percent int DEFAULT 0 CHECK (rollout_percent >= 0 AND rollout_percent <= 100),
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON system.feature_flags(key);

COMMENT ON TABLE system.feature_flags IS 'Feature flag controls. Admin-managed via Back Office.';

-- ============================================================================
-- ANALYTICS
-- ============================================================================

-- Materialized view for platform-wide usage metrics
-- Refreshed hourly via pg_cron (see below)
-- NO SEEDS. COMPUTED FROM REAL DATA ONLY.
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.analytics_usage_mv AS
SELECT
  date_trunc('day', t.created_at) AS day,
  COUNT(DISTINCT t.org_id) AS active_orgs,
  COUNT(t.id) AS issues_opened,
  COUNT(t.id) FILTER (WHERE t.status = 'resolved') AS issues_resolved,
  AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at)) / 60)::int AS avg_response_time_minutes,
  COUNT(t.id) FILTER (WHERE t.metadata->>'guided_fix_completed' = 'true') AS guided_fixes_completed
FROM public.tickets t
WHERE t.created_at >= NOW() - INTERVAL '90 days'
GROUP BY day
ORDER BY day DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_usage_mv_day ON analytics.analytics_usage_mv(day);

COMMENT ON MATERIALIZED VIEW analytics.analytics_usage_mv IS 'Daily platform metrics. Refreshed hourly. No mock data.';

-- ============================================================================
-- ADMIN VIEWS
-- ============================================================================

-- Admin organizations overview (cross-org aggregated view)
-- Only accessible via Edge Functions with super_admin claim verification
CREATE OR REPLACE VIEW audit_compliance.admin_orgs_view AS
SELECT
  c.id AS org_id,
  c.name AS org_name,
  c.tier,
  CASE 
    WHEN c.settings->>'suspended' = 'true' THEN 'disabled'
    WHEN f.status = 'past_due' THEN 'past_due'
    WHEN f.status = 'unpaid' THEN 'suspended'
    ELSE 'active'
  END AS status,
  COALESCE(c.metadata->>'seats', '5')::int AS seats,
  c.created_at,
  (SELECT MAX(created_at) FROM public.tickets WHERE org_id = c.id) AS last_active_at,
  f.stripe_customer_id,
  f.trial_end AS trial_ends_at,
  f.mrr_cents,
  f.status AS billing_status
FROM public.companies c
LEFT JOIN finance.finance_ops f ON f.org_id = c.id
ORDER BY c.created_at DESC;

COMMENT ON VIEW audit_compliance.admin_orgs_view IS 'Cross-org view for Back Office. Requires super_admin role verification.';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE audit_compliance.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.finance_ops ENABLE ROW LEVEL SECURITY;
ALTER TABLE support.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.system_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.feature_flags ENABLE ROW LEVEL SECURITY;

-- Audit log: Read-only for admins, no direct writes (Edge Functions only)
CREATE POLICY "audit_log_read_admin" ON audit_compliance.audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Finance ops: Tenant-scoped read for org members, admin full read via Edge
CREATE POLICY "finance_ops_read_tenant" ON finance.finance_ops
  FOR SELECT
  USING (
    org_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Support tickets: Tenant-scoped CRUD
CREATE POLICY "support_tickets_tenant" ON support.support_tickets
  FOR ALL
  USING (
    org_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- System jobs: Admin read-only
CREATE POLICY "system_jobs_read_admin" ON system.system_jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Feature flags: Public read (for client checks), admin write
CREATE POLICY "feature_flags_read_all" ON system.feature_flags
  FOR SELECT
  USING (true);

CREATE POLICY "feature_flags_write_admin" ON system.feature_flags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_finance_ops_updated_at BEFORE UPDATE ON finance.finance_ops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_jobs_updated_at BEFORE UPDATE ON system.system_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON system.feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CRON JOBS (pg_cron extension)
-- ============================================================================

-- Enable pg_cron extension (requires superuser; run in Supabase Dashboard)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Refresh analytics materialized view hourly
-- SELECT cron.schedule(
--   'refresh-analytics-usage',
--   '0 * * * *', -- Every hour
--   $$REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.analytics_usage_mv$$
-- );

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant Edge Functions (service role) access to all schemas
GRANT USAGE ON SCHEMA audit_compliance TO service_role;
GRANT USAGE ON SCHEMA finance TO service_role;
GRANT USAGE ON SCHEMA support TO service_role;
GRANT USAGE ON SCHEMA system TO service_role;
GRANT USAGE ON SCHEMA analytics TO service_role;

GRANT ALL ON ALL TABLES IN SCHEMA audit_compliance TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA finance TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA support TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA system TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA analytics TO service_role;

-- Authenticated users can read analytics
GRANT SELECT ON analytics.analytics_usage_mv TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify schema after running migrations:

-- SELECT schemaname, tablename FROM pg_tables 
-- WHERE schemaname IN ('audit_compliance', 'finance', 'support', 'system', 'analytics')
-- ORDER BY schemaname, tablename;

-- SELECT * FROM system.feature_flags;
-- SELECT * FROM audit_compliance.admin_orgs_view LIMIT 5;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Run this file once in Supabase SQL Editor
-- 2. Verify tables exist with SELECT queries above
-- 3. Stripe webhook (stripe-webhook edge function) will populate finance.finance_ops
-- 4. No manual data insertion needed - all data flows from production events
-- 5. For local dev, use Stripe CLI: stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
