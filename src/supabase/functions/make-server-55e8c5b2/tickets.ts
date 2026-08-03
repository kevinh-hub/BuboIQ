import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getOrgAndUser = async (authHeader: string | undefined) => {
  if (!authHeader?.startsWith('Bearer ')) return { user: null, orgId: null };
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { user: null, orgId: null };
  const metaOrgId = user?.app_metadata?.org_id || user?.user_metadata?.org_id;
  if (metaOrgId) return { user, orgId: metaOrgId };
  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
  return { user, orgId: profile?.organization_id || null };
};

app.get('/', async (c) => {
  try {
    const { orgId } = await getOrgAndUser(c.req.header('Authorization'));
    if (!orgId) return c.json({ tickets: [] });
    const limit = parseInt(c.req.query('limit') || '50');
    const { data, error } = await supabase
      .from('tickets').select('*').eq('organization_id', orgId)
      .order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return c.json({ tickets: data || [] });
  } catch (e: any) { return c.json({ tickets: [] }); }
});

app.post('/', async (c) => {
  try {
    const { user, orgId } = await getOrgAndUser(c.req.header('Authorization'));
    if (!orgId || !user) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const { data, error } = await supabase.from('tickets').insert({
      ...body,
      organization_id: orgId,
      created_by: user.id,
      status: body.status || 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return c.json({ ticket: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.get('/:id', async (c) => {
  try {
    const { orgId } = await getOrgAndUser(c.req.header('Authorization'));
    const { data, error } = await supabase.from('tickets').select('*').eq('id', c.req.param('id')).single();
    if (error || !data) return c.json({ error: 'Not found' }, 404);
    return c.json({ ticket: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.put('/:id', async (c) => {
  try {
    const { orgId } = await getOrgAndUser(c.req.header('Authorization'));
    if (!orgId) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const allowed: Record<string, any> = {};
    const validFields = ['title','description','status','priority','device_id','assigned_to','resolved_at','kb_article_id'];
    for (const f of validFields) { if (body[f] !== undefined) allowed[f] = body[f]; }
    // Map frontend assignee_id → assigned_to
    if (body.assignee_id !== undefined) allowed.assigned_to = body.assignee_id;
    if (body.status === 'resolved' && !allowed.resolved_at) allowed.resolved_at = new Date().toISOString();
    allowed.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('tickets')
      .update(allowed).eq('id', c.req.param('id')).select().single();
    if (error) throw error;
    return c.json({ ticket: data });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.delete('/:id', async (c) => {
  try {
    const { error } = await supabase.from('tickets').delete().eq('id', c.req.param('id'));
    if (error) throw error;
    return c.json({ success: true });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

export default app;
