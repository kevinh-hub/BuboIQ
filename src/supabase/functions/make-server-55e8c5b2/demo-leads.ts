import { Hono } from 'npm:hono@4';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { notifyNewLead, notifyLeadStatusChange } from './notifications.ts';

const app = new Hono();

/**
 * Demo Lead Capture Endpoint
 * 
 * Captures leads from the Live Demo System when visitors
 * submit the lead capture form after successful demo actions.
 * 
 * POST /demo-leads
 * Body: {
 *   name: string;
 *   email: string;
 *   company: string;
 *   source: string; // e.g., 'demo_conversion', 'demo_launcher'
 *   notes?: string;
 *   demo_engagement?: {
 *     actions_approved?: number;
 *     time_in_demo?: number;
 *     features_explored?: string[];
 *   }
 * }
 */

// Create demo lead (unauthenticated - public endpoint)
app.post('/demo-leads', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, company, source, notes, demo_engagement } = body;

    // Validation
    if (!name || !email || !company) {
      return c.json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'company']
      }, 400);
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check for duplicate (same email submitted in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existingLead } = await supabase
      .from('demo_leads')
      .select('id, created_at')
      .eq('email', email.toLowerCase())
      .gte('created_at', oneDayAgo)
      .maybeSingle();

    if (existingLead) {
      console.log(`Duplicate lead attempt from ${email} (created ${existingLead.created_at})`);
      // Return success to user but don't create duplicate
      return c.json({ 
        success: true, 
        message: 'Thank you! We already have your information and will be in touch soon.',
        duplicate: true 
      });
    }

    // Calculate lead score based on engagement
    let lead_score = 50; // Base score
    
    if (demo_engagement) {
      // +10 points per action approved (max 30)
      if (demo_engagement.actions_approved) {
        lead_score += Math.min(demo_engagement.actions_approved * 10, 30);
      }
      
      // +5 points per minute in demo (max 20)
      if (demo_engagement.time_in_demo) {
        const minutes = Math.floor(demo_engagement.time_in_demo / 60);
        lead_score += Math.min(minutes * 5, 20);
      }
      
      // +5 points per feature explored (max 15)
      if (demo_engagement.features_explored) {
        lead_score += Math.min(demo_engagement.features_explored.length * 5, 15);
      }
    }

    // Cap at 100
    lead_score = Math.min(lead_score, 100);

    // Determine lead quality
    let lead_quality: 'hot' | 'warm' | 'cold' = 'cold';
    if (lead_score >= 80) lead_quality = 'hot';
    else if (lead_score >= 60) lead_quality = 'warm';

    // Insert demo lead
    const { data, error } = await supabase
      .from('demo_leads')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        company: company.trim(),
        source: source || 'unknown',
        notes: notes || null,
        demo_engagement: demo_engagement || null,
        lead_score,
        lead_quality,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating demo lead:', error);
      return c.json({ error: 'Failed to save lead. Please try again.' }, 500);
    }

    console.log(`✅ Demo lead captured: ${email} (${company}) - Score: ${lead_score} (${lead_quality})`);

    // Send notifications (email + Slack for hot leads)
    try {
      await notifyNewLead(data);
      console.log(`📧 Notifications sent for lead: ${data.id}`);
    } catch (error) {
      // Don't fail the request if notifications fail
      console.error('⚠️ Failed to send notifications:', error);
    }

    return c.json({ 
      success: true,
      message: 'Thank you! We\'ll reach out within 24 hours.',
      lead_id: data.id 
    });
    
  } catch (error) {
    console.error('Error in demo lead creation:', error);
    return c.json({ error: 'An unexpected error occurred' }, 500);
  }
});

// Get all demo leads (authenticated - super admin only)
app.get('/demo-leads', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is super admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super admin access required' }, 403);
    }

    // Get query params for filtering
    const status = c.req.query('status');
    const quality = c.req.query('quality');
    const limit = parseInt(c.req.query('limit') || '100');

    let query = supabase
      .from('demo_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (quality) {
      query = query.eq('lead_quality', quality);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching demo leads:', error);
      return c.json({ error: error.message }, 500);
    }

    // Calculate summary stats
    const stats = {
      total: data?.length || 0,
      hot: data?.filter(l => l.lead_quality === 'hot').length || 0,
      warm: data?.filter(l => l.lead_quality === 'warm').length || 0,
      cold: data?.filter(l => l.lead_quality === 'cold').length || 0,
      new: data?.filter(l => l.status === 'new').length || 0,
      contacted: data?.filter(l => l.status === 'contacted').length || 0,
      qualified: data?.filter(l => l.status === 'qualified').length || 0,
      converted: data?.filter(l => l.status === 'converted').length || 0,
    };

    return c.json({ 
      leads: data || [],
      stats
    });
    
  } catch (error) {
    console.error('Error fetching demo leads:', error);
    return c.json({ error: 'Failed to fetch demo leads' }, 500);
  }
});

// Update demo lead status (authenticated - super admin only)
app.patch('/demo-leads/:id', async (c) => {
  try {
    const leadId = c.req.param('id');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { status, notes } = body;

    if (!status || !['new', 'contacted', 'qualified', 'converted', 'disqualified'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify super admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super_admin') {
      return c.json({ error: 'Forbidden: Super admin access required' }, 403);
    }

    // Get current lead data first
    const { data: currentLead } = await supabase
      .from('demo_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!currentLead) {
      return c.json({ error: 'Lead not found' }, 404);
    }

    const oldStatus = currentLead.status;

    // Update lead
    const updateData: any = { status };
    if (notes) {
      updateData.notes = notes;
    }
    if (status === 'contacted' || status === 'qualified' || status === 'converted') {
      updateData[`${status}_at`] = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('demo_leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error updating demo lead:', error);
      return c.json({ error: error.message }, 500);
    }

    // Send notification about status change
    if (oldStatus !== status) {
      try {
        await notifyLeadStatusChange(data, oldStatus, status);
        console.log(`📧 Status change notification sent: ${oldStatus} → ${status}`);
      } catch (error) {
        console.error('⚠️ Failed to send status change notification:', error);
      }
    }

    return c.json({ success: true, lead: data });
    
  } catch (error) {
    console.error('Error updating demo lead:', error);
    return c.json({ error: 'Failed to update demo lead' }, 500);
  }
});

export default app;
