-- Demo Leads Capture System
-- Stores leads captured from the Live Demo System

CREATE TABLE IF NOT EXISTS demo_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  
  -- Lead Tracking
  source TEXT NOT NULL DEFAULT 'unknown', -- 'demo_conversion', 'demo_launcher', etc.
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'disqualified'
  lead_quality TEXT NOT NULL DEFAULT 'cold', -- 'hot', 'warm', 'cold'
  lead_score INTEGER NOT NULL DEFAULT 50, -- 0-100
  
  -- Demo Engagement Data
  demo_engagement JSONB, -- { actions_approved, time_in_demo, features_explored }
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  qualified_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes
  CONSTRAINT demo_leads_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_demo_leads_email ON demo_leads(email);
CREATE INDEX IF NOT EXISTS idx_demo_leads_status ON demo_leads(status);
CREATE INDEX IF NOT EXISTS idx_demo_leads_quality ON demo_leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_demo_leads_created ON demo_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_leads_score ON demo_leads(lead_score DESC);

-- Enable Row Level Security
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (for demo lead capture)
CREATE POLICY "Public can insert demo leads"
ON demo_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only super admins can read all leads
CREATE POLICY "Super admins can read all demo leads"
ON demo_leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'super_admin'
  )
);

-- Policy: Only super admins can update leads
CREATE POLICY "Super admins can update demo leads"
ON demo_leads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'super_admin'
  )
);

-- Create a view for lead analytics (super admin only)
CREATE OR REPLACE VIEW demo_leads_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE lead_quality = 'hot') as hot_leads,
  COUNT(*) FILTER (WHERE lead_quality = 'warm') as warm_leads,
  COUNT(*) FILTER (WHERE lead_quality = 'cold') as cold_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions,
  AVG(lead_score) as avg_score,
  AVG(EXTRACT(EPOCH FROM (converted_at - created_at))/3600) as avg_hours_to_conversion
FROM demo_leads
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON demo_leads_analytics TO authenticated;

-- Create function to get lead conversion funnel
CREATE OR REPLACE FUNCTION get_demo_lead_funnel()
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH funnel AS (
    SELECT
      'Total Leads' as stage,
      COUNT(*)::BIGINT as count,
      100.0 as conversion_rate,
      1 as sort_order
    FROM demo_leads
    
    UNION ALL
    
    SELECT
      'Contacted' as stage,
      COUNT(*)::BIGINT as count,
      (COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM demo_leads), 0) * 100) as conversion_rate,
      2 as sort_order
    FROM demo_leads
    WHERE status IN ('contacted', 'qualified', 'converted')
    
    UNION ALL
    
    SELECT
      'Qualified' as stage,
      COUNT(*)::BIGINT as count,
      (COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM demo_leads), 0) * 100) as conversion_rate,
      3 as sort_order
    FROM demo_leads
    WHERE status IN ('qualified', 'converted')
    
    UNION ALL
    
    SELECT
      'Converted' as stage,
      COUNT(*)::BIGINT as count,
      (COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM demo_leads), 0) * 100) as conversion_rate,
      4 as sort_order
    FROM demo_leads
    WHERE status = 'converted'
  )
  SELECT
    funnel.stage,
    funnel.count,
    ROUND(funnel.conversion_rate, 2) as conversion_rate
  FROM funnel
  ORDER BY sort_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION get_demo_lead_funnel() TO authenticated;

-- Add comment
COMMENT ON TABLE demo_leads IS 'Leads captured from the Live Demo System with engagement tracking and scoring';
