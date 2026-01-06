-- Partner Routing & SMB Containment Schema
-- Adds support for partner lead tracking and MSP features

-- Extend orgs table with new MSP/SMB fields
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS is_direct_smb BOOLEAN DEFAULT false;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS included_computers INTEGER DEFAULT 25;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS overage_rate DECIMAL(10,2) DEFAULT 1.20;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS requested_partner_match_at TIMESTAMPTZ;

-- Create partner_leads table for SMB routing
CREATE TABLE IF NOT EXISTS partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  contacted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create partner_applications table (stub for future MSP partners)
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  service_areas TEXT[],
  certifications TEXT[],
  client_count INTEGER,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  applied_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partner_leads_org_id ON partner_leads(org_id);
CREATE INDEX IF NOT EXISTS idx_partner_leads_created_at ON partner_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_orgs_is_direct_smb ON orgs(is_direct_smb);

-- Enable RLS
ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_leads
CREATE POLICY "Users can view their org's partner leads"
  ON partner_leads FOR SELECT
  USING (org_id IN (SELECT id FROM orgs WHERE id = auth.jwt()->>'org_id'::uuid));

CREATE POLICY "System can insert partner leads"
  ON partner_leads FOR INSERT
  WITH CHECK (true);

-- RLS Policies for partner_applications (admin-only for now)
CREATE POLICY "Super admins can view all partner applications"
  ON partner_applications FOR SELECT
  USING (auth.jwt()->>'role' = 'super_admin');

CREATE POLICY "Anyone can submit partner application"
  ON partner_applications FOR INSERT
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partner_leads_updated_at BEFORE UPDATE ON partner_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_applications_updated_at BEFORE UPDATE ON partner_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE partner_leads IS 'Tracks SMB organizations that need MSP partner matching';
COMMENT ON TABLE partner_applications IS 'MSP partners applying to join the BuboIQ network';
COMMENT ON COLUMN orgs.is_direct_smb IS 'True if organization is a direct SMB (not managed by MSP)';
COMMENT ON COLUMN orgs.included_computers IS 'Number of devices included in base plan';
COMMENT ON COLUMN orgs.overage_rate IS 'Cost per device over included limit';
COMMENT ON COLUMN orgs.addons IS 'JSON array of enabled add-on packs';
COMMENT ON COLUMN orgs.requested_partner_match_at IS 'Timestamp when SMB requested MSP partner match';