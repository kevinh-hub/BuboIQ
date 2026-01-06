import { Hono } from 'npm:hono@4';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Create partner lead
app.post('/partner-leads', async (c) => {
  try {
    const body = await c.req.json();
    const { org_id, reason, context } = body;

    if (!org_id || !reason) {
      return c.json({ error: 'org_id and reason are required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert partner lead
    const { data, error } = await supabase
      .from('partner_leads')
      .insert({
        org_id,
        reason,
        context: context || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating partner lead:', error);
      return c.json({ error: error.message }, 500);
    }

    // Update org requested_partner_match_at if not already set
    await supabase
      .from('orgs')
      .update({ requested_partner_match_at: new Date().toISOString() })
      .eq('id', org_id)
      .is('requested_partner_match_at', null);

    console.log('Partner lead created:', data);
    return c.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error in partner lead creation:', error);
    return c.json({ error: 'Failed to create partner lead' }, 500);
  }
});

// Get partner leads for an org (authenticated)
app.get('/partner-leads/:org_id', async (c) => {
  try {
    const org_id = c.req.param('org_id');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );

    const { data, error } = await supabase
      .from('partner_leads')
      .select('*')
      .eq('org_id', org_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner leads:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ leads: data || [] });
  } catch (error) {
    console.error('Error fetching partner leads:', error);
    return c.json({ error: 'Failed to fetch partner leads' }, 500);
  }
});

export default app;
