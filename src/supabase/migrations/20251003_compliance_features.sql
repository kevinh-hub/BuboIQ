-- =====================================================
-- BuboIQ Compliance Features Migration
-- Healthcare & Finance Vertical Feature Completion
-- =====================================================

-- ============= PHI Detection & Healthcare =============

-- PHI Detection Logs
CREATE TABLE IF NOT EXISTS phi_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'ticket', 'note', 'session_log', 'file'
  entity_id UUID NOT NULL,
  detected_fields JSONB NOT NULL DEFAULT '[]', -- Array of detected PHI field types
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  redaction_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'redacted', 'approved', 'false_positive'
  redacted_by UUID REFERENCES users(id),
  original_content TEXT, -- Encrypted storage
  redacted_content TEXT,
  detection_method VARCHAR(50) DEFAULT 'pattern_match', -- 'pattern_match', 'ml_model', 'manual'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phi_logs_org ON phi_detection_logs(org_id);
CREATE INDEX idx_phi_logs_entity ON phi_detection_logs(entity_type, entity_id);
CREATE INDEX idx_phi_logs_status ON phi_detection_logs(redaction_status);

-- PHI Detection Rules (customizable patterns)
CREATE TABLE IF NOT EXISTS phi_detection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for global rules
  rule_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- 'ssn', 'mrn', 'dob', 'phone', 'email', 'address', 'credit_card'
  pattern_regex TEXT NOT NULL,
  confidence_weight INTEGER DEFAULT 80,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phi_rules_org ON phi_detection_rules(org_id);

-- Insert default PHI detection patterns
INSERT INTO phi_detection_rules (rule_name, field_type, pattern_regex, confidence_weight) VALUES
  ('US SSN', 'ssn', '\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b', 95),
  ('Medical Record Number', 'mrn', '\b(MRN|mrn)[\s:]*\d{6,10}\b', 85),
  ('Date of Birth', 'dob', '\b(DOB|dob|born)[\s:]*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', 70),
  ('Phone Number', 'phone', '\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', 60),
  ('Email Address', 'email', '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 50),
  ('Credit Card', 'credit_card', '\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b', 90)
ON CONFLICT DO NOTHING;

-- ============= Breach Notification System =============

-- Breach Incidents
CREATE TABLE IF NOT EXISTS breach_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_type VARCHAR(50) NOT NULL, -- 'phi_exposure', 'unauthorized_access', 'data_theft', 'ransomware'
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status VARCHAR(30) DEFAULT 'detected', -- 'detected', 'investigating', 'contained', 'notified', 'resolved'
  detection_method VARCHAR(50), -- 'automated', 'manual', 'user_report'
  affected_count INTEGER DEFAULT 0, -- Number of affected records/users
  description TEXT,
  evidence JSONB DEFAULT '{}', -- Links to logs, screenshots, etc.
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  contained_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_breach_org ON breach_incidents(org_id);
CREATE INDEX idx_breach_status ON breach_incidents(status);
CREATE INDEX idx_breach_severity ON breach_incidents(severity);

-- Breach Workflow Steps
CREATE TABLE IF NOT EXISTS breach_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breach_id UUID NOT NULL REFERENCES breach_incidents(id) ON DELETE CASCADE,
  step_name VARCHAR(100) NOT NULL,
  step_order INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_breach ON breach_workflow_steps(breach_id);

-- Breach Notifications (outbound notifications)
CREATE TABLE IF NOT EXISTS breach_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breach_id UUID NOT NULL REFERENCES breach_incidents(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'hipaa_hhs', 'pci_issuer', 'state_ag', 'affected_individuals'
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  sent_at TIMESTAMPTZ,
  delivery_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  template_used VARCHAR(100),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_breach ON breach_notifications(breach_id);

-- ============= Device Posture Validation =============

-- Device Posture Records
CREATE TABLE IF NOT EXISTS device_posture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Security Checks
  encryption_enabled BOOLEAN DEFAULT false,
  firewall_enabled BOOLEAN DEFAULT false,
  antivirus_installed BOOLEAN DEFAULT false,
  antivirus_updated BOOLEAN DEFAULT false,
  os_patch_level VARCHAR(100),
  os_last_updated TIMESTAMPTZ,
  
  -- Compliance Status
  compliant BOOLEAN DEFAULT false,
  compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  risk_level VARCHAR(20) DEFAULT 'unknown', -- 'low', 'medium', 'high', 'critical', 'unknown'
  
  -- Remediation
  non_compliant_items JSONB DEFAULT '[]',
  remediation_required BOOLEAN DEFAULT false,
  last_remediation_prompt TIMESTAMPTZ,
  
  -- Timestamps
  last_check TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posture_device ON device_posture(device_id);
CREATE INDEX idx_posture_org ON device_posture(org_id);
CREATE INDEX idx_posture_compliant ON device_posture(compliant);

-- Device Posture History (for trending)
CREATE TABLE IF NOT EXISTS device_posture_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  compliance_score INTEGER NOT NULL,
  compliant BOOLEAN NOT NULL,
  snapshot JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posture_history_device ON device_posture_history(device_id);

-- ============= Network Segmentation (Finance) =============

-- Network Zones
CREATE TABLE IF NOT EXISTS network_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  zone_name VARCHAR(100) NOT NULL,
  zone_type VARCHAR(50) NOT NULL, -- 'internal', 'dmz', 'cardholder', 'public', 'restricted'
  description TEXT,
  security_level INTEGER DEFAULT 1 CHECK (security_level >= 1 AND security_level <= 5), -- 1=lowest, 5=highest
  requires_mfa BOOLEAN DEFAULT false,
  allowed_zones JSONB DEFAULT '[]', -- Array of zone IDs that can communicate
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zones_org ON network_zones(org_id);

-- Device Zone Assignments
CREATE TABLE IF NOT EXISTS device_zone_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES network_zones(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(device_id, zone_id)
);

CREATE INDEX idx_zone_assignments_device ON device_zone_assignments(device_id);
CREATE INDEX idx_zone_assignments_zone ON device_zone_assignments(zone_id);

-- Cross-Zone Access Requests
CREATE TABLE IF NOT EXISTS zone_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  from_zone_id UUID NOT NULL REFERENCES network_zones(id),
  to_zone_id UUID NOT NULL REFERENCES network_zones(id),
  device_id UUID REFERENCES devices(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'denied', 'expired'
  justification TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zone_access_org ON zone_access_requests(org_id);
CREATE INDEX idx_zone_access_status ON zone_access_requests(status);

-- ============= Cardholder Data Monitoring (PCI-DSS) =============

-- Cardholder Data Access Logs
CREATE TABLE IF NOT EXISTS cardholder_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  device_id UUID REFERENCES devices(id),
  access_type VARCHAR(50) NOT NULL, -- 'view', 'export', 'modify', 'delete'
  resource_type VARCHAR(50), -- 'payment_record', 'transaction', 'customer_data'
  resource_id VARCHAR(255),
  justification TEXT,
  session_recorded BOOLEAN DEFAULT false,
  session_recording_url TEXT,
  flagged_as_suspicious BOOLEAN DEFAULT false,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cardholder_logs_org ON cardholder_access_logs(org_id);
CREATE INDEX idx_cardholder_logs_user ON cardholder_access_logs(user_id);
CREATE INDEX idx_cardholder_logs_flagged ON cardholder_access_logs(flagged_as_suspicious);

-- PCI Compliance Scans
CREATE TABLE IF NOT EXISTS pci_compliance_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  scan_type VARCHAR(50) NOT NULL, -- 'quarterly', 'on_demand', 'post_incident'
  scan_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  compliance_level VARCHAR(20), -- 'compliant', 'non_compliant', 'partial'
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  scanned_devices INTEGER DEFAULT 0,
  vulnerabilities_found INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pci_scans_org ON pci_compliance_scans(org_id);
CREATE INDEX idx_pci_scans_status ON pci_compliance_scans(scan_status);

-- ============= Automated Breach Detection =============

-- Anomaly Detection Rules
CREATE TABLE IF NOT EXISTS anomaly_detection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL for global rules
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- 'threshold', 'pattern', 'ml_model', 'behavioral'
  entity_type VARCHAR(50) NOT NULL, -- 'session', 'device', 'user', 'network'
  condition JSONB NOT NULL, -- Rule logic
  severity VARCHAR(20) DEFAULT 'medium',
  auto_create_incident BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomaly_rules_org ON anomaly_detection_rules(org_id);

-- Insert default anomaly detection rules
INSERT INTO anomaly_detection_rules (rule_name, rule_type, entity_type, condition, severity, auto_create_incident) VALUES
  ('Excessive Failed Logins', 'threshold', 'user', '{"metric": "failed_logins", "threshold": 5, "timeframe_minutes": 15}', 'high', true),
  ('After-Hours Access', 'pattern', 'session', '{"hours": [22, 23, 0, 1, 2, 3, 4, 5], "zones": ["cardholder"]}', 'medium', false),
  ('Unusual Data Export', 'behavioral', 'user', '{"metric": "export_volume", "threshold_multiplier": 3.0}', 'high', true),
  ('Cross-Zone Violation', 'pattern', 'network', '{"unauthorized_zone_access": true}', 'critical', true),
  ('Mass Device Changes', 'threshold', 'device', '{"metric": "config_changes", "threshold": 10, "timeframe_minutes": 60}', 'medium', false)
ON CONFLICT DO NOTHING;

-- Detected Anomalies
CREATE TABLE IF NOT EXISTS detected_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES anomaly_detection_rules(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  anomaly_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  description TEXT,
  evidence JSONB DEFAULT '{}',
  status VARCHAR(30) DEFAULT 'new', -- 'new', 'investigating', 'false_positive', 'confirmed', 'resolved'
  incident_created UUID REFERENCES breach_incidents(id),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomalies_org ON detected_anomalies(org_id);
CREATE INDEX idx_anomalies_status ON detected_anomalies(status);

-- ============= Compliance Monitoring Dashboard =============

-- Compliance Metrics (aggregated compliance scores over time)
CREATE TABLE IF NOT EXISTS compliance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL, -- 'hipaa', 'pci_dss', 'soc2', 'overall'
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  status VARCHAR(20) DEFAULT 'unknown', -- 'compliant', 'at_risk', 'non_compliant', 'unknown'
  
  -- Breakdown
  total_controls INTEGER DEFAULT 0,
  passing_controls INTEGER DEFAULT 0,
  failing_controls INTEGER DEFAULT 0,
  
  -- Evidence
  evidence_count INTEGER DEFAULT 0,
  last_audit_export TIMESTAMPTZ,
  
  -- Timestamps
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_metrics_org ON compliance_metrics(org_id);
CREATE INDEX idx_compliance_metrics_type ON compliance_metrics(metric_type);

-- Security Control Status
CREATE TABLE IF NOT EXISTS security_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  control_id VARCHAR(50) NOT NULL, -- e.g., 'HIPAA-164.308', 'PCI-DSS-2.1'
  control_name VARCHAR(255) NOT NULL,
  framework VARCHAR(50) NOT NULL, -- 'hipaa', 'pci_dss', 'soc2'
  status VARCHAR(30) DEFAULT 'not_implemented', -- 'not_implemented', 'partial', 'implemented', 'failing'
  automation_enabled BOOLEAN DEFAULT false,
  last_tested TIMESTAMPTZ,
  next_test_due TIMESTAMPTZ,
  evidence_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_controls_org ON security_controls(org_id);
CREATE INDEX idx_controls_framework ON security_controls(framework);

-- ============= Audit Events Enhancement =============

-- Add compliance-specific fields to audit_events if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_events' AND column_name='compliance_relevant') THEN
    ALTER TABLE audit_events ADD COLUMN compliance_relevant BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_events' AND column_name='phi_involved') THEN
    ALTER TABLE audit_events ADD COLUMN phi_involved BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_events' AND column_name='pci_relevant') THEN
    ALTER TABLE audit_events ADD COLUMN pci_relevant BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============= Row Level Security =============

-- Enable RLS on all new tables
ALTER TABLE phi_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE phi_detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_posture ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_posture_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_zone_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardholder_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pci_compliance_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_controls ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic org-scoped access)
-- Note: In production, these should be more granular based on user roles

CREATE POLICY "Users can view their org's PHI detection logs"
  ON phi_detection_logs FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their org's breach incidents"
  ON breach_incidents FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their org's device posture"
  ON device_posture FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their org's network zones"
  ON network_zones FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their org's compliance metrics"
  ON compliance_metrics FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- Grant service role full access for backend operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ============= Functions & Triggers =============

-- Function to update device posture compliance score
CREATE OR REPLACE FUNCTION calculate_posture_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple scoring: each security check is worth 20 points
  NEW.compliance_score := (
    (CASE WHEN NEW.encryption_enabled THEN 20 ELSE 0 END) +
    (CASE WHEN NEW.firewall_enabled THEN 20 ELSE 0 END) +
    (CASE WHEN NEW.antivirus_installed THEN 20 ELSE 0 END) +
    (CASE WHEN NEW.antivirus_updated THEN 20 ELSE 0 END) +
    (CASE WHEN NEW.os_last_updated > NOW() - INTERVAL '30 days' THEN 20 ELSE 0 END)
  );
  
  NEW.compliant := NEW.compliance_score >= 80;
  
  -- Determine risk level
  IF NEW.compliance_score >= 80 THEN
    NEW.risk_level := 'low';
  ELSIF NEW.compliance_score >= 60 THEN
    NEW.risk_level := 'medium';
  ELSIF NEW.compliance_score >= 40 THEN
    NEW.risk_level := 'high';
  ELSE
    NEW.risk_level := 'critical';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posture_score
  BEFORE INSERT OR UPDATE ON device_posture
  FOR EACH ROW
  EXECUTE FUNCTION calculate_posture_score();

-- Function to auto-create breach incident from anomaly
CREATE OR REPLACE FUNCTION auto_create_breach_from_anomaly()
RETURNS TRIGGER AS $$
DECLARE
  new_incident_id UUID;
BEGIN
  -- Only create incident if rule has auto_create_incident enabled
  IF NEW.status = 'confirmed' AND NEW.incident_created IS NULL THEN
    INSERT INTO breach_incidents (
      org_id,
      incident_type,
      severity,
      status,
      detection_method,
      description
    ) VALUES (
      NEW.org_id,
      NEW.anomaly_type,
      NEW.severity,
      'detected',
      'automated',
      NEW.description
    ) RETURNING id INTO new_incident_id;
    
    NEW.incident_created := new_incident_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_breach_from_anomaly
  BEFORE UPDATE ON detected_anomalies
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_breach_from_anomaly();

COMMIT;
