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
  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
  return profile?.organization_id || null;
};

app.get('/', async (c) => {
  try {
    const orgId = await getOrgId(c.req.header('Authorization'));
    if (!orgId) return c.json({ signals: [] });
    const limit = parseInt(c.req.query('limit') || '50');
    const { data, error } = await supabase
      .from('signals').select('*').eq('organization_id', orgId)
      .order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return c.json({ signals: data || [] });
  } catch (e: any) { return c.json({ signals: [] }); }
});

app.post('/', async (c) => {
  try {
    const orgId = await getOrgId(c.req.header('Authorization'));
    if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const { data, error } = await supabase.from('signals').insert({
      ...body,
      organization_id: orgId,
      status: body.status || 'active',
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return c.json({ signal: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.get('/:id', async (c) => {
  try {
    const { data, error } = await supabase.from('signals').select('*').eq('id', c.req.param('id')).single();
    if (error || !data) return c.json({ error: 'Not found' }, 404);
    return c.json({ signal: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.put('/:id', async (c) => {
  try {
    const updates = await c.req.json();
    const { data, error } = await supabase.from('signals')
      .update(updates).eq('id', c.req.param('id')).select().single();
    if (error) throw error;
    return c.json({ signal: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.delete('/:id', async (c) => {
  try {
    const { error } = await supabase.from('signals').delete().eq('id', c.req.param('id'));
    if (error) throw error;
    return c.json({ success: true });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

export default app;
