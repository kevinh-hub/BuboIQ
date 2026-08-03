import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getOrgId = async (authHeader: string | undefined) => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const metaOrgId = user?.app_metadata?.org_id || user?.user_metadata?.org_id;
  if (metaOrgId) return metaOrgId;
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
  return profile?.organization_id || null;
};

app.get('/', async (c) => {
  try {
    const orgId = await getOrgId(c.req.header('Authorization'));
    if (!orgId) return c.json({ devices: [] });
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('organization_id', orgId)
      .order('last_seen', { ascending: false });
    if (error) throw error;
    const mapped = (data || []).map((d: any) => ({
      ...d,
      is_online: d.status === 'online',
      last_seen_at: d.last_seen,
      operating_system: d.os,
    }));
    return c.json({ devices: mapped });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return c.json({ devices: [] });
  }
});

app.get('/:id', async (c) => {
  try {
    const orgId = await getOrgId(c.req.header('Authorization'));
    if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
    const id = c.req.param('id');
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();
    if (error || !data) return c.json({ error: 'Device not found' }, 404);
    return c.json({ device: {
      ...data,
      operating_system: data.os,
      is_online: data.status === 'online',
      last_seen_at: data.last_seen,
      ...data.metadata
    }});
  } catch (error) {
    console.error('Error fetching device:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
