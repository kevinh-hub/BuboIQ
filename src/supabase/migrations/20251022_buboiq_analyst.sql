-- Vector extension
create extension if not exists vector;

-- Issues (tickets)
create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  device_id uuid,
  title text not null,
  description text,
  priority text check (priority in ('low','medium','high','urgent')) default 'medium',
  status text check (status in ('open','in_progress','resolved','closed')) default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Signals (telemetry)
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  device_id uuid not null,
  metric text not null,
  value numeric,
  context jsonb,
  created_at timestamptz default now()
);

-- KB + embeddings
create table if not exists kb_articles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  title text not null,
  prechecks text,
  fix text,
  verify text,
  status text check (status in ('draft','review','published')) default 'draft',
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists kb_embeddings (
  id uuid primary key default gen_random_uuid(),
  kb_id uuid references kb_articles(id) on delete cascade,
  content text not null,
  embedding vector(3072)
);

-- Agent traces
create table if not exists agent_traces (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  run_id uuid not null,
  stage text not null, -- fetch|reason|act|error
  input jsonb,
  output jsonb,
  confidence numeric,
  created_at timestamptz default now()
);

-- Action queue
create table if not exists action_queue (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  run_id uuid not null,
  action_type text not null, -- update_ticket|create_kb_draft|restart|push_driver|run_script
  payload jsonb not null,
  status text check (status in ('queued','approved','executed','rejected','failed')) default 'queued',
  requested_by uuid,
  approved_by uuid,
  executed_at timestamptz,
  created_at timestamptz default now()
);

-- Tier policies (TierGuard)
create table if not exists tier_policies (
  org_id uuid primary key,
  tier text check (tier in ('starter','pro','team')) not null default 'pro',
  confidence_threshold numeric default 0.85,
  safelist text[] default array['update_ticket','create_kb_draft'],
  device_safelist text[] default array['restart'],
  require_rollback boolean default true,
  kill_switch boolean default false,
  updated_at timestamptz default now()
);

-- Device jobs (Connect mirror)
create table if not exists device_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  action_id uuid not null,
  device_id uuid,
  job_id text,
  action_type text not null,
  status text check (status in ('queued','running','succeeded','failed')) default 'queued',
  started_at timestamptz,
  ended_at timestamptz,
  logs_url text,
  error text,
  created_at timestamptz default now()
);

-- RLS
alter table issues enable row level security;
alter table signals enable row level security;
alter table kb_articles enable row level security;
alter table kb_embeddings enable row level security;
alter table agent_traces enable row level security;
alter table action_queue enable row level security;
alter table tier_policies enable row level security;
alter table device_jobs enable row level security;

-- Same-org policies
create policy if not exists p_issues_org on issues using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_signals_org on signals using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_kb_org on kb_articles using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_kbe_org on kb_embeddings
  using (exists (select 1 from kb_articles k where k.id = kb_id and k.org_id::text = auth.jwt() ->> 'org_id'));
create policy if not exists p_traces_org on agent_traces using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_actions_org on action_queue using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_tierpol_org on tier_policies using (auth.jwt() ->> 'org_id' = org_id::text);
create policy if not exists p_devjobs_org on device_jobs using (auth.jwt() ->> 'org_id' = org_id::text);
