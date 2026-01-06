-- BuboIQ Agent Database Schema
-- Production-ready schema for agent device management and ticket integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Device Management Tables

-- Organizations (existing)
ALTER TABLE IF EXISTS orgs ADD COLUMN IF NOT EXISTS 
  agent_settings JSONB DEFAULT '{"auto_enroll": true, "require_approval": false}';

-- Enhanced devices table for agent integration
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Basic device information
  hostname TEXT NOT NULL,
  display_name TEXT,
  device_type TEXT CHECK (device_type IN ('workstation','server','laptop','tablet','mobile','network','iot')) DEFAULT 'workstation',
  
  -- Operating system
  platform TEXT NOT NULL CHECK (platform IN ('windows','macos','linux','ios','android')),
  os_name TEXT,
  os_version TEXT,
  os_build TEXT,
  architecture TEXT,
  kernel_version TEXT,
  
  -- Hardware identifiers
  serial_number TEXT,
  uuid TEXT,
  machine_id TEXT,
  primary_mac TEXT,
  mac_addresses TEXT[],
  
  -- Network information
  primary_ip INET,
  hostname_fqdn TEXT,
  network_domain TEXT,
  last_ip INET,
  
  -- Hardware specifications
  cpu_model TEXT,
  cpu_cores INTEGER,
  cpu_threads INTEGER,
  memory_total_mb BIGINT,
  storage_total_gb BIGINT,
  
  -- Location and ownership
  physical_location TEXT,
  department TEXT,
  owner_email TEXT,
  cost_center TEXT,
  asset_tag TEXT,
  
  -- Agent information
  agent_version TEXT,
  agent_installed_at TIMESTAMPTZ,
  agent_config JSONB DEFAULT '{}',
  
  -- Status and health
  status TEXT DEFAULT 'offline' CHECK (status IN ('online','offline','stale','maintenance','decommissioned')),
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  is_managed BOOLEAN DEFAULT true,
  is_compliant BOOLEAN DEFAULT true,
  
  -- Discovery information
  discovered_at TIMESTAMPTZ,
  discovery_method TEXT CHECK (discovery_method IN ('agent','network_scan','manual','import')),
  
  -- Metadata
  tags TEXT[],
  labels JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  last_inventory_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(org_id, hostname),
  UNIQUE(org_id, serial_number) WHERE serial_number IS NOT NULL,
  UNIQUE(org_id, uuid) WHERE uuid IS NOT NULL
);

-- Device hardware details
CREATE TABLE IF NOT EXISTS device_hardware (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  
  -- CPU details
  cpu_vendor TEXT,
  cpu_model TEXT,
  cpu_cores INTEGER,
  cpu_threads INTEGER,
  cpu_base_speed_ghz DECIMAL(4,2),
  cpu_max_speed_ghz DECIMAL(4,2),
  cpu_architecture TEXT,
  cpu_features TEXT[],
  
  -- Memory details
  memory_total_mb BIGINT,
  memory_modules JSONB DEFAULT '[]',
  
  -- GPU details
  gpus JSONB DEFAULT '[]',
  
  -- Motherboard
  board_manufacturer TEXT,
  board_product TEXT,
  board_version TEXT,
  board_serial TEXT,
  
  -- BIOS/UEFI
  bios_vendor TEXT,
  bios_version TEXT,
  bios_date TEXT,
  is_uefi BOOLEAN DEFAULT false,
  
  -- Battery (for laptops/mobile)
  has_battery BOOLEAN DEFAULT false,
  battery_info JSONB,
  
  -- Thermal sensors
  temperature_sensors JSONB DEFAULT '[]',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device network configuration
CREATE TABLE IF NOT EXISTS device_network (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Primary network info
  primary_ip INET,
  hostname TEXT,
  domain TEXT,
  
  -- Network adapters
  adapters JSONB DEFAULT '[]',
  
  -- WiFi information
  wifi_info JSONB,
  
  -- Network routes
  routes JSONB DEFAULT '[]',
  
  -- DNS configuration
  dns_servers TEXT[],
  dns_search_domains TEXT[],
  
  -- Proxy settings
  proxy_config JSONB,
  
  -- VPN connections
  vpn_connections JSONB DEFAULT '[]',
  
  -- Network performance
  bandwidth_up_mbps INTEGER,
  bandwidth_down_mbps INTEGER,
  latency_ms INTEGER,
  
  last_change_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Installed software inventory
CREATE TABLE IF NOT EXISTS device_software (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Software identification
  name TEXT NOT NULL,
  version TEXT,
  publisher TEXT,
  description TEXT,
  category TEXT,
  
  -- Installation details
  install_location TEXT,
  install_date TIMESTAMPTZ,
  install_source TEXT CHECK (install_source IN ('msi','exe','dmg','pkg','deb','rpm','snap','brew','chocolatey','winget','manual')),
  
  -- File details
  size_bytes BIGINT,
  file_version TEXT,
  product_version TEXT,
  
  -- Security information
  is_signed BOOLEAN,
  certificate_publisher TEXT,
  certificate_thumbprint TEXT,
  
  -- License information
  license_key TEXT,
  license_type TEXT CHECK (license_type IN ('commercial','open_source','freeware','trial','unknown')),
  
  -- Vulnerability information
  vulnerability_score INTEGER,
  cve_count INTEGER DEFAULT 0,
  last_vulnerability_scan TIMESTAMPTZ,
  
  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  usage_frequency TEXT CHECK (usage_frequency IN ('daily','weekly','monthly','rarely','never')),
  
  -- Metadata
  custom_fields JSONB DEFAULT '{}',
  
  -- Timestamps
  first_detected_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(device_id, name, version, install_location)
);

-- Device events and activities
CREATE TABLE IF NOT EXISTS device_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Event classification
  event_type TEXT NOT NULL CHECK (event_type IN ('system','security','performance','software','hardware','network')),
  event_subtype TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('debug','info','warning','error','critical')),
  
  -- Event details
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  event_id TEXT,
  
  -- Event data
  details JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  
  -- Correlation
  correlation_id TEXT,
  parent_event_id UUID REFERENCES device_events(id),
  
  -- Resolution
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  resolution_notes TEXT,
  
  -- Timestamps
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_device_events_device_occurred (device_id, occurred_at DESC),
  INDEX idx_device_events_type_severity (event_type, severity),
  INDEX idx_device_events_correlation (correlation_id) WHERE correlation_id IS NOT NULL
);

-- Real-time device health metrics
CREATE TABLE IF NOT EXISTS device_health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- CPU metrics
  cpu_usage_percent DECIMAL(5,2),
  cpu_user_percent DECIMAL(5,2),
  cpu_system_percent DECIMAL(5,2),
  cpu_idle_percent DECIMAL(5,2),
  cpu_iowait_percent DECIMAL(5,2),
  cpu_frequency_mhz INTEGER,
  cpu_temperature_celsius DECIMAL(4,1),
  
  -- Memory metrics
  memory_total_mb BIGINT,
  memory_used_mb BIGINT,
  memory_free_mb BIGINT,
  memory_available_mb BIGINT,
  memory_cached_mb BIGINT,
  memory_buffers_mb BIGINT,
  memory_usage_percent DECIMAL(5,2),
  
  -- Swap metrics
  swap_total_mb BIGINT,
  swap_used_mb BIGINT,
  swap_usage_percent DECIMAL(5,2),
  
  -- Disk metrics
  disk_usage JSONB DEFAULT '[]', -- Array of disk usage objects
  disk_io_read_bytes_per_sec BIGINT,
  disk_io_write_bytes_per_sec BIGINT,
  disk_io_read_ops_per_sec INTEGER,
  disk_io_write_ops_per_sec INTEGER,
  
  -- Network metrics
  network_bytes_sent_per_sec BIGINT,
  network_bytes_received_per_sec BIGINT,
  network_packets_sent_per_sec INTEGER,
  network_packets_received_per_sec INTEGER,
  network_errors_per_sec INTEGER,
  network_latency_ms INTEGER,
  
  -- System metrics
  uptime_seconds BIGINT,
  load_average_1m DECIMAL(4,2),
  load_average_5m DECIMAL(4,2),
  load_average_15m DECIMAL(4,2),
  process_count INTEGER,
  thread_count INTEGER,
  
  -- Battery metrics (for mobile devices)
  battery_present BOOLEAN DEFAULT false,
  battery_percentage DECIMAL(5,2),
  battery_status TEXT,
  battery_time_remaining_minutes INTEGER,
  battery_health TEXT,
  
  -- Temperature sensors
  temperature_sensors JSONB DEFAULT '[]',
  
  -- Overall health
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  
  -- Timestamp
  collected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Partitioning by time for performance
  PARTITION BY RANGE (collected_at)
);

-- Create partitions for health metrics (monthly partitions)
-- This would be handled by a partition management job in production

-- Network discovery data
CREATE TABLE IF NOT EXISTS network_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Discovery job information
  job_id UUID NOT NULL,
  scan_profile TEXT NOT NULL,
  
  -- Network target
  target_network CIDR,
  target_host INET,
  
  -- Discovery results
  ip_address INET NOT NULL,
  mac_address TEXT,
  hostname TEXT,
  os_guess TEXT,
  vendor TEXT,
  device_type_guess TEXT,
  
  -- Port scan results
  open_ports INTEGER[],
  services JSONB DEFAULT '{}',
  
  -- SNMP data (if available)
  snmp_data JSONB,
  
  -- Confidence and classification
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  classification_tags TEXT[],
  
  -- Association with known devices
  device_id UUID REFERENCES devices(id),
  is_new_device BOOLEAN DEFAULT true,
  merge_status TEXT DEFAULT 'pending' CHECK (merge_status IN ('pending','merged','ignored','manual_review')),
  
  -- Discovery metadata
  discovery_method TEXT[],
  evidence JSONB DEFAULT '{}',
  
  -- Timestamps
  discovered_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_network_discoveries_job (job_id),
  INDEX idx_network_discoveries_ip (ip_address),
  INDEX idx_network_discoveries_status (merge_status, is_new_device)
);

-- Agent enrollment and management
CREATE TABLE IF NOT EXISTS agent_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Enrollment information
  enrollment_code TEXT NOT NULL,
  device_id UUID REFERENCES devices(id),
  
  -- Device information at enrollment
  device_info JSONB NOT NULL,
  
  -- Enrollment status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired')),
  
  -- Agent configuration
  agent_config JSONB DEFAULT '{}',
  
  -- Security
  api_key_hash TEXT,
  certificate_fingerprint TEXT,
  
  -- Approval workflow
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Timestamps
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(enrollment_code, device_id)
);

-- Agent commands and remote actions
CREATE TABLE IF NOT EXISTS agent_commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Command details
  command_type TEXT NOT NULL CHECK (command_type IN ('rescan_inventory','collect_logs','restart_agent','update_config','run_discovery','connect_remote','disconnect_remote','reboot_device','shutdown_device')),
  command_name TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  
  -- Execution
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','acknowledged','running','completed','failed','timeout','cancelled')),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  
  -- Timing
  created_by UUID NOT NULL REFERENCES users(id),
  scheduled_at TIMESTAMPTZ,
  timeout_seconds INTEGER DEFAULT 300,
  
  -- Results
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  output TEXT,
  error_message TEXT,
  exit_code INTEGER,
  result_data JSONB,
  
  -- Tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_agent_commands_device_status (device_id, status),
  INDEX idx_agent_commands_scheduled (scheduled_at) WHERE status = 'pending'
);

-- Enhanced tickets table for device context integration
ALTER TABLE IF EXISTS tickets ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES devices(id);
ALTER TABLE IF EXISTS tickets ADD COLUMN IF NOT EXISTS device_context JSONB;
ALTER TABLE IF EXISTS tickets ADD COLUMN IF NOT EXISTS auto_populated BOOLEAN DEFAULT false;

-- Ticket-device relationships (many-to-many for complex scenarios)
CREATE TABLE IF NOT EXISTS ticket_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Relationship details
  relationship_type TEXT DEFAULT 'affected' CHECK (relationship_type IN ('affected','related','referenced')),
  context_data JSONB DEFAULT '{}',
  
  -- Auto-population metadata
  auto_populated BOOLEAN DEFAULT false,
  populated_fields TEXT[],
  population_source TEXT CHECK (population_source IN ('agent','discovery','manual','import')),
  
  -- Timestamps
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  linked_by UUID REFERENCES users(id),
  
  -- Constraints
  UNIQUE(ticket_id, device_id, relationship_type)
);

-- Remote access sessions
CREATE TABLE IF NOT EXISTS remote_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id),
  
  -- Session details
  session_type TEXT NOT NULL CHECK (session_type IN ('rustdesk','teamviewer','vnc','ssh','rdp','chrome_remote')),
  technician_id UUID NOT NULL REFERENCES users(id),
  
  -- Access control
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested','approved','denied','active','completed','terminated','error')),
  consent_granted BOOLEAN DEFAULT false,
  consent_granted_at TIMESTAMPTZ,
  
  -- Session configuration
  session_config JSONB DEFAULT '{}',
  connection_info JSONB,
  
  -- Security and audit
  recording_enabled BOOLEAN DEFAULT false,
  recording_path TEXT,
  access_logs JSONB DEFAULT '[]',
  
  -- Session lifecycle
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  end_reason TEXT,
  
  -- User experience
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  
  -- Indexes
  INDEX idx_remote_sessions_device_status (device_id, status),
  INDEX idx_remote_sessions_technician (technician_id, started_at DESC),
  INDEX idx_remote_sessions_ticket (ticket_id) WHERE ticket_id IS NOT NULL
);

-- Agent update management
CREATE TABLE IF NOT EXISTS agent_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Update details
  version TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('stable','beta','alpha')),
  platform TEXT NOT NULL,
  architecture TEXT NOT NULL,
  
  -- Update package
  download_url TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  
  -- Release information
  release_notes TEXT,
  is_critical BOOLEAN DEFAULT false,
  requires_restart BOOLEAN DEFAULT true,
  
  -- Rollout control
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  rollout_started_at TIMESTAMPTZ,
  rollout_completed_at TIMESTAMPTZ,
  
  -- Timestamps
  released_at TIMESTAMPTZ DEFAULT NOW(),
  deprecated_at TIMESTAMPTZ,
  
  -- Constraints
  UNIQUE(version, platform, architecture, channel)
);

-- Agent update deployments
CREATE TABLE IF NOT EXISTS agent_update_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  update_id UUID NOT NULL REFERENCES agent_updates(id) ON DELETE CASCADE,
  
  -- Deployment status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','downloading','installing','completed','failed','rolled_back')),
  
  -- Version tracking
  previous_version TEXT,
  target_version TEXT NOT NULL,
  
  -- Timing
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Results
  success BOOLEAN,
  error_message TEXT,
  install_log TEXT,
  
  -- Rollback
  rollback_available BOOLEAN DEFAULT true,
  rolled_back_at TIMESTAMPTZ,
  rollback_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(device_id, update_id)
);

-- Device compliance and policies
CREATE TABLE IF NOT EXISTS device_compliance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  
  -- Compliance status
  is_compliant BOOLEAN DEFAULT true,
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  
  -- Policy violations
  violations JSONB DEFAULT '[]',
  critical_violations_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  
  -- Specific compliance areas
  antivirus_compliant BOOLEAN DEFAULT true,
  firewall_compliant BOOLEAN DEFAULT true,
  updates_compliant BOOLEAN DEFAULT true,
  encryption_compliant BOOLEAN DEFAULT true,
  password_policy_compliant BOOLEAN DEFAULT true,
  
  -- Assessment details
  last_assessment_at TIMESTAMPTZ DEFAULT NOW(),
  assessment_method TEXT CHECK (assessment_method IN ('agent','scan','manual')),
  assessment_data JSONB DEFAULT '{}',
  
  -- Remediation
  remediation_required BOOLEAN DEFAULT false,
  remediation_actions JSONB DEFAULT '[]',
  remediation_deadline TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(device_id, DATE(last_assessment_at))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_org_status ON devices(org_id, status);
CREATE INDEX IF NOT EXISTS idx_devices_hostname ON devices USING gin(hostname gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen_at DESC) WHERE status != 'decommissioned';
CREATE INDEX IF NOT EXISTS idx_devices_agent_version ON devices(agent_version) WHERE agent_version IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_device_software_name ON device_software USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_device_software_publisher ON device_software(publisher);
CREATE INDEX IF NOT EXISTS idx_device_software_category ON device_software(category);

CREATE INDEX IF NOT EXISTS idx_device_events_recent ON device_events(org_id, occurred_at DESC) WHERE occurred_at > NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_device_events_unresolved ON device_events(device_id, severity) WHERE NOT is_resolved;

CREATE INDEX IF NOT EXISTS idx_ticket_devices_ticket ON ticket_devices(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_devices_device ON ticket_devices(device_id);

-- Enable Row Level Security (RLS) for multi-tenancy
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_update_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies (example for devices table)
CREATE POLICY "Users can access their org's devices" ON devices
  FOR ALL USING (org_id = (auth.jwt() ->> 'org_id')::UUID);

-- Views for common queries

-- Device summary view
CREATE OR REPLACE VIEW device_summary AS
SELECT 
  d.id,
  d.org_id,
  d.hostname,
  d.display_name,
  d.device_type,
  d.platform,
  d.os_name,
  d.os_version,
  d.status,
  d.health_score,
  d.primary_ip,
  d.primary_mac,
  d.agent_version,
  d.last_seen_at,
  d.owner_email,
  d.department,
  d.physical_location,
  d.tags,
  -- Hardware summary
  dh.cpu_model,
  dh.cpu_cores,
  dh.memory_total_mb,
  -- Compliance
  dc.is_compliant,
  dc.compliance_score,
  -- Ticket count
  (SELECT COUNT(*) FROM ticket_devices td WHERE td.device_id = d.id) as ticket_count,
  -- Last event
  (SELECT MAX(occurred_at) FROM device_events de WHERE de.device_id = d.id) as last_event_at
FROM devices d
LEFT JOIN device_hardware dh ON d.id = dh.device_id
LEFT JOIN device_compliance dc ON d.id = dc.device_id;

-- Health metrics aggregation view
CREATE OR REPLACE VIEW device_health_current AS
WITH latest_metrics AS (
  SELECT DISTINCT ON (device_id) 
    device_id,
    cpu_usage_percent,
    memory_usage_percent,
    health_score,
    collected_at
  FROM device_health_metrics 
  ORDER BY device_id, collected_at DESC
)
SELECT 
  d.id as device_id,
  d.hostname,
  d.status,
  lm.cpu_usage_percent,
  lm.memory_usage_percent,
  lm.health_score,
  lm.collected_at as last_metrics_at,
  CASE 
    WHEN lm.collected_at < NOW() - INTERVAL '10 minutes' THEN 'stale'
    WHEN lm.collected_at < NOW() - INTERVAL '5 minutes' THEN 'delayed'
    ELSE 'current'
  END as metrics_status
FROM devices d
LEFT JOIN latest_metrics lm ON d.id = lm.device_id;

-- Functions for automation

-- Function to update device last_seen timestamp
CREATE OR REPLACE FUNCTION update_device_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen_at = NOW();
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for device updates
CREATE TRIGGER device_update_timestamp
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_device_last_seen();

-- Function to calculate device health score
CREATE OR REPLACE FUNCTION calculate_device_health_score(
  p_device_id UUID
) RETURNS INTEGER AS $$
DECLARE
  cpu_score INTEGER := 100;
  memory_score INTEGER := 100;
  disk_score INTEGER := 100;
  compliance_score INTEGER := 100;
  final_score INTEGER;
BEGIN
  -- Get latest metrics
  SELECT 
    CASE 
      WHEN cpu_usage_percent > 90 THEN 20
      WHEN cpu_usage_percent > 80 THEN 60
      WHEN cpu_usage_percent > 60 THEN 80
      ELSE 100
    END,
    CASE 
      WHEN memory_usage_percent > 95 THEN 10
      WHEN memory_usage_percent > 85 THEN 50
      WHEN memory_usage_percent > 70 THEN 75
      ELSE 100
    END
  INTO cpu_score, memory_score
  FROM device_health_metrics 
  WHERE device_id = p_device_id 
  ORDER BY collected_at DESC 
  LIMIT 1;
  
  -- Get compliance score
  SELECT COALESCE(compliance_score, 100)
  INTO compliance_score
  FROM device_compliance
  WHERE device_id = p_device_id
  ORDER BY updated_at DESC
  LIMIT 1;
  
  -- Calculate weighted average
  final_score := (cpu_score * 0.3 + memory_score * 0.3 + disk_score * 0.2 + compliance_score * 0.2)::INTEGER;
  
  -- Update device health score
  UPDATE devices 
  SET health_score = final_score, updated_at = NOW()
  WHERE id = p_device_id;
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your user setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO buboiq_agent;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO buboiq_agent;