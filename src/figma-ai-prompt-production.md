# BuboIQ Production-Ready SaaS — Complete Figma AI Prompt

**Objective**: Build the complete BuboIQ SaaS application for real clients. Deliver a production-grade design system and all app screens/flows plus a precise backend contract (SQL schema, RLS policies, API endpoints, webhooks, and event shapes). Ensure device context auto-population in tickets, tier enforcement, and org isolation. Create reusable, responsive components. No simulations—design the full asset set developers will implement.

---

## 0) Brand & UI System

### Colors
- **Primary**: `#00FF85` (Neon Green)
- **Background**: `#0E0E0E` (Dark Midnight) 
- **Surface**: `#1C1C1E` (Surface Dark)
- **Electric Blue**: `#1E90FF` (Accent)
- **Text Primary**: `#E6E6E6`
- **Text Muted**: `#9AA0A6`
- **Danger**: `#E64848`
- **Warning**: `#FFB020`
- **Success**: `#38E27D`

### Typography
- **Headers**: Space Grotesk (Bold 700, Medium 600)
- **UI Text**: Inter (Regular 400, Medium 500)
- **Technical/Code**: JetBrains Mono (Regular 400, Medium 500)

### Effects
- **Glassmorphism**: `backdrop-blur(24px)` on dark surfaces
- **Elevations**: 8px/16px/24px soft shadows
- **Neon Highlights**: Glow effects on primary actions
- **Animations**: Subtle hover states, focus rings, loading states

### Components
- **TierGuard**: Overlay component with upgrade prompts
- **DevicePanel**: Read-only device info sidebar in tickets
- **TicketForm**: Create/edit with device picker integration
- **DevicePicker**: Search & select devices with filters
- **LogStream**: Live output for discovery jobs
- **CredentialsVault**: Secure credential management
- **StatusPill**: Online/offline with health indicators
- **RiskPill**: Low/medium/high/critical risk levels
- **DataTable**: Sortable, filterable, with bulk actions
- **KeyValueList**: Metadata display with copy-on-hover

### Layout
- **Grid**: 12-column responsive grid
- **Breakpoints**: 1440px/1200px/992px/768px/480px
- **Keyboard**: Visible focus states, command palette (⌘K)

---

## 1) Application Structure (Screens/Flows)

### Authentication Flow
- **Login**: Email/password with "Remember me", forgot password link
- **Signup**: Name, company, email, password → auto-creates Starter trial
- **MFA**: Optional 2FA code input with resend/backup options
- **Forgot/Reset**: Email verification flow
- **Route Guards**: Redirect unauthenticated users to login
- **Session**: JWT tokens with `{org_id, role, tier}` claims

### Dashboard
- **KPIs**: Devices online/offline/stale, new discoveries, open tickets, last scan status
- **Quick Actions**: Create ticket, run discovery, view devices
- **Recent Activity**: Live feed of tickets, devices, discovery jobs
- **System Health**: AI status, network coverage, SLA compliance

### Devices (CMDB)
- **DevicesPage**: 
  - Table with filters (OS, site, status, risk, managed/unmanaged)
  - Columns: Status, Hostname, OS & Version, Owner/Site, Primary IP, MAC, Last Seen, Risk, Linked Tickets
  - Bulk actions (Pro+): Start remote session, rescan, export CSV
- **DeviceDetailPage**:
  - Tabs: Overview, Hardware, Network, Software, Events, Tickets
  - Overview shows hostname, serial/UUID, OS, uptime, primary IP, last seen, risk level
  - **Create Ticket CTA**: Pre-fills device context when clicked
  - Tickets tab lists linked tickets with create button

### Discovery Suite (Pro+ Feature)
- **Subnets & Sites**: Grid of sites → subnet rows with CIDR, last scan, quick actions
- **Scan Profiles**: Types (ping, nmap_light, snmp, wmi, ssh, mdns) with parameter editors
- **Credentials Vault**: Add/rotate/revoke credentials with encrypted storage
- **Jobs & Live Output**: List + detail with LogStream showing live scan progress
- **New Finds**: Cards with IP, MAC (OUI vendor), OS guess, ports; actions to merge or create asset

### Tickets System
- **TicketsPage**: 
  - Filters: Status, priority, assignee, device presence (yes/no)
  - Columns: #, Title, Requester, Status, Priority, Assignee, Device (hostname), Updated
- **TicketDetailPage**:
  - Header: Title, ticket #, status, priority, assignee
  - Left: Description, comments/activity timeline
  - Right sidebar: **DevicePanel** (if linked), requester card, SLA widget, tags
  - Actions: Change device, add comment, close/resolve
- **TicketForm**:
  - Fields: Title, Description, Priority, Category, Assignee, **Affected Device** (picker)
  - Device Context Auto-Population: When opened from device detail, shows banner "Linked to {hostname}" and pre-fills description

### Settings
- **Data & Privacy**:
  - Toggles: Collect installed software (on/off), BYOD redaction (none/limited/strict)
  - Retention: 90/180/365 days
  - Actions: Export CMDB, purge device (requires hostname confirmation)
  - Links: Privacy policy, DPIA template

### Admin Panel (Admin Role)
- **Metrics**: System health, user counts, organization stats
- **Feature Flags**: Toggle features per organization
- **Organization Management**: View all orgs, tiers, usage
- **System Status**: Service health monitors

### Global Navigation
- **Command Palette**: ⌘K shortcut for global search and navigation
- **Org Switcher**: Multi-tenant organization selection
- **TierGuard**: Enforcement overlays on restricted features
- **User Menu**: Profile, settings, logout

---

## 2) Pricing & TierGuard (UI + Backend Contract)

### Tier Structure
- **Starter ($39/month - 25 devices)**:
  - Basic device inventory (manual check-ins)
  - Manual device→ticket linking
  - Devices list (read-only discovery)
  - Basic ticketing

- **Pro ($149/month - 100 devices)**:
  - Scheduled agent check-ins with delta events
  - Agentless discovery (ping/ARP/mDNS/Nmap-light, SNMP v2/v3 light)
  - Credentials Vault with secure storage
  - Scan profiles and live job streaming
  - BuboIQ Connect remote access
  - **Auto device context in ticket creation**
  - Device posture validation
  - Network segmentation

- **Team ($349/month - 300 devices)**:
  - Full SNMP enrichment & network topology mapping
  - AD/LDAP owner mapping
  - Cloud inventory connectors
  - Advanced WMI/SSH collectors
  - Compliance exports (CSV/JSON)
  - Webhooks integration
  - SSO (SAML/OIDC)
  - Multi-site dashboards
  - PHI detection & redaction
  - Breach notification workflows
  - Full compliance dashboard

### Feature Flags (Server-Side Truth)
```json
{
  "discovery": "starter|pro|team",
  "vault": "pro+",
  "connect": "pro+", 
  "topology": "team",
  "sso": "team",
  "exports": "team",
  "webhooks": "team"
}
```

### TierGuard UI Implementation
- Mirrors backend feature flags
- Blocks gated actions with upgrade overlays
- Shows feature availability in navigation
- Contextual upgrade prompts with pricing

---

## 3) Backend Contract — SQL Schema (Supabase/Postgres)

```sql
-- Organizations & Users
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('starter','pro','team')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','tech','viewer')),
  department TEXT,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices CMDB
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  hostname TEXT,
  display_name TEXT,
  device_type TEXT CHECK (device_type IN ('workstation','server','laptop','mobile','network')),
  os TEXT,
  os_version TEXT,
  serial_number TEXT,
  uuid TEXT,
  primary_ip INET,
  mac_address TEXT,
  location TEXT,
  department TEXT,
  owner_email TEXT,
  tags TEXT[],
  is_online BOOLEAN DEFAULT FALSE,
  health_score INTEGER DEFAULT 100,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low','medium','high','critical')),
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE device_hardware (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  cpu TEXT,
  cpu_cores INTEGER,
  memory_gb INTEGER,
  storage_gb INTEGER,
  gpu TEXT,
  bios_version TEXT,
  motherboard TEXT,
  battery_info JSONB
);

CREATE TABLE device_network (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  adapters JSONB,
  domain TEXT,
  wifi_info JSONB,
  gateway INET,
  dns_servers TEXT[],
  dhcp_enabled BOOLEAN DEFAULT TRUE,
  last_change_at TIMESTAMPTZ
);

CREATE TABLE installed_software (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version TEXT,
  vendor TEXT,
  category TEXT,
  is_signed BOOLEAN,
  install_date TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE device_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','error','critical')),
  title TEXT NOT NULL,
  description TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovery Suite (Pro+ Features)
CREATE TABLE networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  site TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subnets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
  cidr CIDR NOT NULL,
  name TEXT,
  scan_profile_id UUID,
  last_scan_at TIMESTAMPTZ,
  next_scan_at TIMESTAMPTZ,
  scan_status TEXT DEFAULT 'idle' CHECK (scan_status IN ('idle','running','completed','failed')),
  devices_found INTEGER DEFAULT 0,
  discovery_mode TEXT DEFAULT 'safe'
);

CREATE TABLE scan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('ping','nmap_light','snmp','wmi','ssh','mdns')),
  description TEXT,
  parameters JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('snmp_v3','windows_wmi','ssh_key','ssh_password')),
  label TEXT NOT NULL,
  encrypted_data BYTEA NOT NULL, -- Encrypted credential data
  scope JSONB, -- Which subnets/devices this applies to
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_rotated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE TABLE discovery_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subnet_id UUID REFERENCES subnets(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES scan_profiles(id),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed','cancelled')),
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  devices_found INTEGER DEFAULT 0,
  new_devices INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  summary JSONB,
  log_entries TEXT[]
);

CREATE TABLE discovery_finds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES discovery_jobs(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  mac_address TEXT,
  hostname TEXT,
  os_guess TEXT,
  vendor TEXT,
  ports INTEGER[],
  services JSONB,
  confidence INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','merged','ignored')),
  device_id UUID REFERENCES devices(id), -- Set when merged
  discovered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets System
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  category TEXT,
  requester_name TEXT,
  requester_email TEXT,
  assignee_id UUID REFERENCES users(id),
  device_id UUID REFERENCES devices(id), -- Linked device
  tags TEXT[],
  risk_score INTEGER,
  sla_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remote Access (Pro+ Feature)
CREATE TABLE remote_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id),
  technician_id UUID NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL CHECK (provider IN ('rustdesk','teamviewer','vnc','ssh','chrome_remote')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','ended','failed')),
  consent_granted BOOLEAN DEFAULT FALSE,
  session_data JSONB,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  end_reason TEXT,
  recording_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Enable RLS on all tables)
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE installed_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_finds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy Pattern (apply to all tables):
-- SELECT/INSERT/UPDATE/DELETE WHERE org_id = (auth.jwt() ->> 'org_id')::UUID
-- Additional role checks for admin operations: WHERE (auth.jwt() ->> 'role') IN ('owner','admin')

-- Example policy for devices table:
CREATE POLICY "Users can access org devices" ON devices
  FOR ALL USING (org_id = (auth.jwt() ->> 'org_id')::UUID);

CREATE POLICY "Admins can manage org devices" ON devices
  FOR ALL USING (
    org_id = (auth.jwt() ->> 'org_id')::UUID 
    AND (auth.jwt() ->> 'role') IN ('owner','admin','tech')
  );
```

---

## 4) Backend Contract — REST API Endpoints

**Base URL**: `https://api.buboiq.com`  
**Headers**: `Authorization: Bearer <JWT>`, `X-Org-ID: <org_id>`

### Authentication
```
POST /auth/login
Body: { email, password }
Response: { token, user: {id, email, role}, org: {id, name, tier} }

POST /auth/signup  
Body: { email, password, name, company_name, role? }
Response: { token, user, org }

POST /auth/mfa/verify
Body: { token, code }
Response: { token }

POST /auth/forgot-password
Body: { email }
Response: { ok: true }

POST /auth/reset-password
Body: { token, password }
Response: { ok: true }
```

### Devices CMDB
```
GET /devices?query=&os=&site=&status=&risk=&page=&limit=
Response: { devices: [...], pagination: {page, total, pages} }

GET /devices/:id
Response: { 
  device: {...}, 
  hardware: {...}, 
  network: {...}, 
  software: [...], 
  events: [...],
  linked_tickets: [...]
}

POST /devices
Body: { hostname, device_type, ip_address, mac_address, ... }
Response: { device: {...} }

PUT /devices/:id
Body: { ...updates }
Response: { device: {...} }

DELETE /devices/:id
Response: { ok: true }

POST /devices/:id/health-score
Body: { health_score: number }
Response: { ok: true }
```

### Discovery Suite (Pro+ Required)
```
GET /discovery/subnets
Response: { subnets: [...] }

POST /discovery/jobs
Body: { subnet_id, profile_id, name? }
Response: { job: { id, status: "queued" } }

GET /discovery/jobs/:id
Response: { 
  job: {...}, 
  log_stream_url: "wss://...",
  progress: number,
  status: "running|completed|failed"
}

GET /discovery/finds?status=new
Response: { finds: [...] }

POST /discovery/finds/:id/merge
Body: { device_id? } // Create new device if not provided
Response: { device: {...} }

POST /discovery/finds/:id/ignore
Response: { ok: true }
```

### Credentials Vault (Pro+ Required)
```
GET /vault/credentials
Response: { credentials: [{ id, label, type, created_at, expires_at }] }

POST /vault/credentials
Body: { type, label, credentials: {...}, scope: {...} }
Response: { credential: { id, label, type } }

POST /vault/credentials/:id/rotate
Body: { credentials: {...} }
Response: { ok: true }

DELETE /vault/credentials/:id
Response: { ok: true }
```

### Tickets System
```
GET /tickets?status=&priority=&assignee=&device_id=&page=&limit=
Response: { tickets: [...], pagination: {...} }

GET /tickets/:id
Response: { 
  ticket: {...}, 
  device: {...}, // If linked
  comments: [...],
  activity: [...] // Audit trail
}

POST /tickets
Body: { 
  title, 
  description, 
  priority, 
  assignee_id?, 
  device_id?,  // Auto-link device
  requester_name?,
  requester_email?
}
Response: { ticket: {...} }

PUT /tickets/:id
Body: { ...updates }
Response: { ticket: {...} }

POST /tickets/:id/link-device
Body: { device_id }
Response: { ok: true }

POST /tickets/:id/comments
Body: { content, is_internal? }
Response: { comment: {...} }

POST /tickets/:id/status
Body: { status: "open|in_progress|resolved|closed" }
Response: { ticket: {...} }
```

### Remote Access (Pro+ Required)
```
POST /remote/sessions
Body: { device_id, ticket_id?, provider, recording_enabled? }
Response: { session: { id, status: "pending" } }

GET /remote/sessions/:id
Response: { session: {...} }

POST /remote/sessions/:id/consent
Response: { session: { status: "active", connection_info: {...} } }

POST /remote/sessions/:id/end
Body: { end_reason? }
Response: { ok: true }
```

### Admin & Settings
```
GET /admin/metrics
Response: { 
  total_users, total_orgs, total_devices, total_tickets,
  system_health: {...}
}

GET /admin/organizations
Response: { organizations: [...] }

GET /feature-flags
Response: { flags: {...} }

POST /feature-flags/:name
Body: { enabled: boolean }
Response: { ok: true }

POST /settings/privacy
Body: { 
  software_inventory: boolean, 
  byod_redaction: "none|limited|strict", 
  retention_days: number 
}
Response: { ok: true }

POST /export/cmdb
Response: { job_id, download_url? }

POST /devices/:id/purge
Body: { confirmation: hostname }
Response: { ok: true }
```

### Error Responses (Uniform Format)
```
400 { code: "bad_request", message: "..." }
401 { code: "unauthorized", message: "..." }
403 { code: "forbidden", message: "..." }
404 { code: "not_found", message: "..." }
409 { code: "conflict", message: "..." }
422 { code: "validation_error", fields: {...} }
429 { code: "rate_limited", retry_after: seconds }
500 { code: "server_error", request_id: "..." }
```

---

## 5) Webhooks & Events (Team Tier)

### Webhook Topics & Payloads
```javascript
// Ticket Events
{
  topic: "ticket.created",
  payload: {
    id: "uuid",
    org_id: "uuid", 
    title: "string",
    priority: "low|medium|high|critical",
    device_id: "uuid?",
    created_at: "iso8601",
    created_by: "uuid"
  }
}

{
  topic: "ticket.device_linked", 
  payload: {
    ticket_id: "uuid",
    device_id: "uuid", 
    linked_by: "uuid",
    linked_at: "iso8601"
  }
}

{
  topic: "ticket.status_changed",
  payload: {
    ticket_id: "uuid",
    old_status: "string",
    new_status: "string", 
    changed_by: "uuid",
    changed_at: "iso8601"
  }
}

// Device Events  
{
  topic: "device.discovered",
  payload: {
    device_id: "uuid",
    hostname: "string",
    ip_address: "string",
    discovery_job_id: "uuid",
    discovered_at: "iso8601"
  }
}

{
  topic: "device.status_changed",
  payload: {
    device_id: "uuid", 
    old_status: "online|offline",
    new_status: "online|offline",
    last_seen_at: "iso8601"
  }
}

// Discovery Events
{
  topic: "discovery.job_completed",
  payload: {
    job_id: "uuid",
    subnet_id: "uuid",
    devices_found: number,
    new_devices: number,
    duration_seconds: number,
    completed_at: "iso8601"
  }
}

// Remote Session Events
{
  topic: "remote_session.started", 
  payload: {
    session_id: "uuid",
    device_id: "uuid",
    technician_id: "uuid", 
    ticket_id: "uuid?",
    provider: "string",
    started_at: "iso8601"
  }
}
```

### Webhook Delivery
- **Method**: `POST` with JSON payload
- **Headers**: 
  - `X-BuboIQ-Signature`: HMAC-SHA256 signature
  - `X-BuboIQ-Topic`: Event topic
  - `User-Agent`: "BuboIQ-Webhooks/1.0"
- **Retry**: Exponential backoff (1s, 2s, 4s, 8s, 16s)
- **Timeout**: 30 seconds
- **Security**: Verify HMAC signature using webhook secret

---

## 6) Security & Privacy Controls

### Row Level Security (RLS)
- **Deny-by-default**: All tables require explicit org_id match
- **Multi-tenant isolation**: `WHERE org_id = (auth.jwt() ->> 'org_id')::UUID`
- **Role-based access**: Additional role checks for admin operations
- **Audit trail**: All mutations logged to `audit_log` table

### Credential Security
- **Encryption**: All credentials stored as encrypted bytea using KMS
- **Never plaintext**: Credentials never returned in API responses
- **Scope-limited**: Each credential has defined scope (subnets/devices)
- **Rotation**: Built-in rotation with expiration tracking

### Privacy Controls
- **Software inventory toggle**: Can be disabled per organization
- **BYOD redaction levels**:
  - None: Full data collection
  - Limited: Redact personal files/documents
  - Strict: Minimal system data only
- **Data retention**: Configurable 90/180/365 day retention
- **Export controls**: Admin-only CSV/JSON exports
- **Purge capability**: Permanent device data deletion

### Audit Logging
- **Login events**: All authentication attempts
- **Credential usage**: When credentials are accessed for discovery
- **Device operations**: Create, update, delete, purge
- **Ticket lifecycle**: Create, link device, status changes, resolution
- **Discovery jobs**: Start, complete, find processing
- **Admin actions**: Feature flag changes, organization management

---

## 7) Frontend Interaction Contracts

### Device→Ticket Auto-Population Flow
1. **DeviceDetailPage**: "Create Ticket" button calls `onCreateTicketFromDevice(deviceContext)`
2. **TicketForm**: Receives `deviceContext` prop, shows context banner
3. **Pre-population**: 
   - `device_id` → Hidden field set to device ID
   - `title` → "Issue with {hostname}"
   - `description` → Pre-filled with device metadata
4. **Submit**: `POST /tickets` with device_id
5. **TicketDetail**: Shows DevicePanel with linked device info
6. **Activity log**: Records "ticket.device_linked" event

### TierGuard Enforcement
- **Feature flags**: Fetched at login, cached in context
- **Component wrapping**: `<TierGuard requiredTier="pro">` around gated features
- **API enforcement**: Server returns 402 for tier violations
- **Upgrade prompts**: Contextual modals with pricing info

### Discovery Job States
- **Status transitions**: `queued → running → completed/failed`
- **Live updates**: WebSocket connection for real-time progress
- **Log streaming**: Server-sent events for job output
- **Find processing**: New finds appear in queue for merge/ignore

### Real-time Updates
- **WebSocket events**: Device status changes, job progress, new tickets
- **Optimistic updates**: UI updates immediately, syncs with server
- **Error handling**: Rollback on failure, retry mechanisms
- **Offline support**: Queue actions when disconnected

---

## 8) Deliverables in Figma

### Design System Page
- **Color tokens**: All brand colors with usage guidelines
- **Typography scale**: Header/body/mono fonts with sizes
- **Component library**: All reusable components with variants
- **Icon system**: Consistent iconography with states
- **Layout grid**: 12-column responsive grid examples

### Application Pages
1. **Authentication**: Login, signup, MFA, forgot password screens
2. **Dashboard**: KPI cards, activity feed, quick actions
3. **Devices**: List view with filters, device detail with tabs
4. **Discovery**: Subnets, profiles, vault, jobs, finds management
5. **Tickets**: List with filters, detail view, create form
6. **Settings**: Privacy controls, company settings, user profile
7. **Admin**: Metrics, feature flags, organization management

### Interaction Flows
- **Device→Ticket**: Complete flow from device detail to ticket creation
- **Discovery Job**: Start job → live progress → process finds
- **TierGuard**: Feature restriction → upgrade flow
- **Remote Session**: Request → consent → active session

### Backend Contract Documentation
- **SQL Schema**: Complete database schema with relationships
- **API Reference**: All endpoints with request/response examples  
- **Webhook Events**: Event payloads and delivery mechanisms
- **Security Model**: RLS policies and authentication flow

### Prototype Interactions
- **Navigation**: All page transitions and route guards
- **Form submissions**: Validation states and error handling
- **Real-time updates**: Simulated live data feeds
- **Responsive behavior**: Mobile and desktop layouts
- **Keyboard navigation**: Focus states and shortcuts

### Seed Data
- **12 devices**: Mix of workstations, servers, laptops with varying status
- **20 tickets**: Various priorities and statuses, 10 with linked devices  
- **3 discovery jobs**: Queued, running, completed states
- **Activity entries**: Recent actions and audit trail
- **Organizations**: Different tiers and feature access levels

---

## Build Instructions for Figma AI

1. **Create Design System**: Build comprehensive token system and component library
2. **Generate all screens**: Auth flow, dashboard, devices, discovery, tickets, settings, admin
3. **Wire interactions**: Device→ticket flow, TierGuard restrictions, real-time updates
4. **Add seed data**: Realistic content across all screens and states
5. **Create prototypes**: Navigation flows and key user journeys  
6. **Document contracts**: Include complete backend specification as copyable text
7. **Ensure accessibility**: WCAG AA compliance with keyboard navigation
8. **Responsive design**: Mobile-first approach with desktop enhancements

**Deliver**: Single Figma file with complete design system, all application screens, interactive prototypes, and comprehensive backend contract documentation ready for development implementation.