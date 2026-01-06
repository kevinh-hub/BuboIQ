/**
 * Early Access System API
 * 
 * Handles invite-only, time-gated Early Access program
 * - Admin: create/revoke invites, manage cohort
 * - Public: validate/redeem invite tokens
 * - Email notifications via Resend
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// ============================================================================
// Helpers
// ============================================================================

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
}

async function sendInviteEmail(email: string, token: string, expiresAt: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    console.log('[EA] Resend API key not configured, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  const inviteUrl = `${Deno.env.get('SUPABASE_URL')}/invite/ea?token=${token}`;
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, -apple-system, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1C1C1E 0%, #0E1726 100%); border: 1px solid rgba(0, 255, 133, 0.2); border-radius: 16px; padding: 40px; }
    .logo { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 30px; }
    .logo .bubo { color: #fff; }
    .logo .iq { color: #00FF85; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: #00FF85; margin-bottom: 20px; }
    p { color: #A0A0A0; line-height: 1.6; margin-bottom: 16px; }
    .highlight { color: #fff; font-weight: 600; }
    .cta-button { display: inline-block; background: #00FF85; color: #0A0A0A; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0; transition: all 0.3s; }
    .cta-button:hover { background: #fff; }
    .details { background: rgba(0, 255, 133, 0.1); border-left: 3px solid #00FF85; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); color: #666; font-size: 14px; }
    .fallback { background: #1C1C1E; padding: 12px; border-radius: 4px; margin-top: 20px; word-break: break-all; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="bubo">BUBO</span><span class="iq">IQ</span>
    </div>
    
    <h1>You're invited to BuboIQ Early Access</h1>
    
    <p>You've been invited to join the exclusive <span class="highlight">BuboIQ Early Access</span> program. Experience the future of AI-driven IT support intelligence before anyone else.</p>
    
    <div class="details">
      <p style="margin: 0 0 12px 0;"><strong style="color: #00FF85;">What's Included:</strong></p>
      <ul style="margin: 0; padding-left: 20px; color: #A0A0A0;">
        <li><strong>EA-Pro Plan:</strong> $99/month founders rate (12 months)</li>
        <li><strong>100 devices included</strong>, $0.90/device overage</li>
        <li><strong>14-day trial</strong>, no card required</li>
        <li><strong>Single-use invite</strong> — claim it before it expires</li>
      </ul>
    </div>
    
    <p><strong>⏰ This invite expires on ${expiryDate}</strong></p>
    
    <div style="text-align: center;">
      <a href="${inviteUrl}" class="cta-button">Activate Your Invite</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">This is a single-use link. Once activated, it cannot be used again. If you did not request this invite, you can safely ignore this email.</p>
    
    <div class="fallback">
      <p style="margin: 0 0 8px 0; color: #888; font-size: 12px;">If the button doesn't work, copy and paste this link:</p>
      <p style="margin: 0; color: #00FF85;">${inviteUrl}</p>
    </div>
    
    <div class="footer">
      <p>Questions? Email us at <a href="mailto:help@buboiq.com" style="color: #00FF85; text-decoration: none;">help@buboiq.com</a></p>
      <p style="margin-top: 20px;">
        <span style="color: #fff;">BUBO</span><span style="color: #00FF85;">IQ</span> — The Brain of Modern IT Operations
      </p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BuboIQ <onboarding@buboiq.com>',
        to: [email],
        subject: 'Your BuboIQ Early Access Invite',
        html: htmlContent,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('[EA] Email send failed:', result);
      return { success: false, error: result };
    }

    console.log('[EA] Invite email sent successfully to', email);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('[EA] Email send error:', error);
    return { success: false, error: String(error) };
  }
}

async function sendAcceptanceEmail(email: string, orgName: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) return { success: false };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, -apple-system, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1C1C1E 0%, #0E1726 100%); border: 1px solid rgba(0, 255, 133, 0.2); border-radius: 16px; padding: 40px; }
    .logo { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 30px; }
    .logo .bubo { color: #fff; }
    .logo .iq { color: #00FF85; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: #00FF85; margin-bottom: 20px; }
    p { color: #A0A0A0; line-height: 1.6; margin-bottom: 16px; }
    .badge { display: inline-block; background: rgba(0, 255, 133, 0.2); color: #00FF85; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .details { background: rgba(0, 255, 133, 0.1); border-left: 3px solid #00FF85; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="bubo">BUBO</span><span class="iq">IQ</span>
    </div>
    
    <h1>Welcome to BuboIQ Early Access!</h1>
    
    <div class="badge">EA-PRO (Founders Rate)</div>
    
    <p>Congratulations! You've successfully activated your Early Access invite for <strong style="color: #fff;">${orgName}</strong>.</p>
    
    <div class="details">
      <p style="margin: 0 0 12px 0;"><strong style="color: #00FF85;">Your Plan Details:</strong></p>
      <ul style="margin: 0; padding-left: 20px; color: #A0A0A0;">
        <li><strong>Founders Rate:</strong> $99/month (locked for 12 months)</li>
        <li><strong>100 devices included</strong>, $0.90/device overage</li>
        <li><strong>14-day trial</strong> — explore all features risk-free</li>
        <li><strong>Early Access:</strong> Shape the future of BuboIQ with your feedback</li>
      </ul>
    </div>
    
    <p><strong>What happens next?</strong></p>
    <ul style="color: #A0A0A0; padding-left: 20px;">
      <li>Your 14-day trial starts now (no card required)</li>
      <li>You'll receive billing activation details before trial ends</li>
      <li>Your founders rate is reserved and guaranteed</li>
      <li>Our team is here to help — reach out anytime</li>
    </ul>
    
    <p style="margin-top: 30px;">Have questions? We're here to help at <a href="mailto:help@buboiq.com" style="color: #00FF85; text-decoration: none;">help@buboiq.com</a></p>
    
    <div class="footer">
      <p style="margin-top: 20px;">
        <span style="color: #fff;">BUBO</span><span style="color: #00FF85;">IQ</span> — The Brain of Modern IT Operations
      </p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BuboIQ <onboarding@buboiq.com>',
        to: [email],
        subject: 'Welcome to BuboIQ Early Access (EA-Pro)',
        html: htmlContent,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error('[EA] Acceptance email error:', error);
    return { success: false };
  }
}

// ============================================================================
// Admin Routes
// ============================================================================

// Get cohort stats and configuration
app.get('/admin/stats', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Verify super admin
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Check if super admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (userData?.role !== 'super_admin') {
    return c.json({ error: 'Forbidden - Super admin only' }, 403);
  }

  try {
    // Get cohort config
    const { data: cohort } = await supabase
      .from('early_access_cohort')
      .select('*')
      .limit(1)
      .single();

    // Get invite stats
    const { data: invites } = await supabase
      .from('early_access_invites')
      .select('status, created_at, redeemed_at');

    const stats = {
      invitesAvailable: invites?.filter(i => i.status === 'unused').length || 0,
      invitesRedeemed: invites?.filter(i => i.status === 'redeemed').length || 0,
      invitesExpired: invites?.filter(i => i.status === 'expired').length || 0,
      invitesRevoked: invites?.filter(i => i.status === 'revoked').length || 0,
      totalInvites: invites?.length || 0,
    };

    // Get EA org count
    const { count: eaOrgCount } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .eq('is_early_access', true);

    // Get total EA devices
    const { data: eaOrgs } = await supabase
      .from('organizations')
      .select('device_limit')
      .eq('is_early_access', true);

    const totalDevices = eaOrgs?.reduce((sum, org) => sum + (org.device_limit || 0), 0) || 0;

    return c.json({
      stats,
      cohort: {
        orgCap: cohort?.org_cap || 0,
        deviceCap: cohort?.device_cap || 0,
        closesAt: cohort?.closes_at,
        emergencyClosed: cohort?.emergency_closed || false,
        autoExpireInvites: cohort?.auto_expire_invites || true,
        currentOrgs: eaOrgCount || 0,
        currentDevices: totalDevices,
      }
    });
  } catch (error) {
    console.error('[EA] Stats error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// List all invites
app.get('/admin/invites', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Auth check (same as above)
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  
  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403);

  try {
    const { data: invites, error } = await supabase
      .from('early_access_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json({ invites });
  } catch (error) {
    console.error('[EA] List invites error:', error);
    return c.json({ error: 'Failed to fetch invites' }, 500);
  }
});

// Create new invite
app.post('/admin/create', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Auth check
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  
  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403);

  try {
    const body = await c.req.json();
    const {
      email,
      daysValid = 10,
      planName = 'EA-Pro',
      devicesIncluded = 100,
      overageRate = 0.90,
      notes,
      sendEmail = true
    } = body;

    // Check cohort status
    const { data: cohort } = await supabase
      .from('early_access_cohort')
      .select('*')
      .limit(1)
      .single();

    if (cohort?.emergency_closed) {
      return c.json({ error: 'Cohort is closed. Reopen cohort to create invites.' }, 400);
    }

    if (cohort?.closes_at && new Date(cohort.closes_at) < new Date()) {
      return c.json({ error: 'Cohort has closed. Update closing date to create invites.' }, 400);
    }

    // Generate token
    const { data: tokenResult } = await supabase.rpc('generate_ea_invite_token');
    const inviteToken = tokenResult || crypto.randomUUID().replace(/-/g, '').substring(0, 20);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);

    // Create invite
    const { data: invite, error: insertError } = await supabase
      .from('early_access_invites')
      .insert({
        token: inviteToken,
        email: email || null,
        plan_name: planName,
        devices_included: devicesIncluded,
        overage_rate: overageRate,
        days_valid: daysValid,
        expires_at: expiresAt.toISOString(),
        notes,
        created_by_user_id: user.id,
        email_sent_at: sendEmail && email ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create audit log
    await supabase.from('early_access_audit_log').insert({
      invite_id: invite.id,
      action: 'created',
      actor_user_id: user.id,
      actor_email: user.email,
      details: { email, planName, devicesIncluded, daysValid }
    });

    // Send email if requested
    let emailResult = null;
    if (sendEmail && email) {
      emailResult = await sendInviteEmail(email, inviteToken, expiresAt.toISOString());
    }

    return c.json({
      success: true,
      invite,
      inviteUrl: `/invite/ea?token=${inviteToken}`,
      emailSent: emailResult?.success || false
    });
  } catch (error) {
    console.error('[EA] Create invite error:', error);
    return c.json({ error: 'Failed to create invite' }, 500);
  }
});

// Revoke invite
app.post('/admin/revoke/:id', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Auth check
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  
  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403);

  try {
    const inviteId = c.req.param('id');
    const body = await c.req.json();
    const { reason } = body;

    const { error } = await supabase
      .from('early_access_invites')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by_user_id: user.id,
        revoke_reason: reason
      })
      .eq('id', inviteId);

    if (error) throw error;

    // Audit log
    await supabase.from('early_access_audit_log').insert({
      invite_id: inviteId,
      action: 'revoked',
      actor_user_id: user.id,
      actor_email: user.email,
      details: { reason }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('[EA] Revoke invite error:', error);
    return c.json({ error: 'Failed to revoke invite' }, 500);
  }
});

// Update cohort settings
app.put('/admin/cohort', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Auth check
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  
  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'super_admin') return c.json({ error: 'Forbidden' }, 403);

  try {
    const body = await c.req.json();
    const { orgCap, deviceCap, closesAt, emergencyClosed, autoExpireInvites } = body;

    // Get existing cohort
    const { data: existing } = await supabase
      .from('early_access_cohort')
      .select('id')
      .limit(1)
      .single();

    const updateData: any = {};
    if (orgCap !== undefined) updateData.org_cap = orgCap;
    if (deviceCap !== undefined) updateData.device_cap = deviceCap;
    if (closesAt !== undefined) updateData.closes_at = closesAt;
    if (emergencyClosed !== undefined) updateData.emergency_closed = emergencyClosed;
    if (autoExpireInvites !== undefined) updateData.auto_expire_invites = autoExpireInvites;

    if (existing) {
      await supabase
        .from('early_access_cohort')
        .update(updateData)
        .eq('id', existing.id);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('[EA] Update cohort error:', error);
    return c.json({ error: 'Failed to update cohort' }, 500);
  }
});

// ============================================================================
// Public Routes (Invite Validation & Redemption)
// ============================================================================

// Validate invite token
app.get('/validate/:token', async (c) => {
  const supabase = getSupabaseAdmin();
  const inviteToken = c.req.param('token');

  try {
    // First expire old invites
    await supabase.rpc('expire_early_access_invites');

    // Get invite
    const { data: invite, error } = await supabase
      .from('early_access_invites')
      .select('*')
      .eq('token', inviteToken)
      .single();

    if (error || !invite) {
      return c.json({ valid: false, error: 'Invite not found' }, 404);
    }

    // Check status
    if (invite.status === 'redeemed') {
      return c.json({ valid: false, error: 'Invite already used', status: 'redeemed' });
    }

    if (invite.status === 'expired') {
      return c.json({ valid: false, error: 'Invite expired', status: 'expired' });
    }

    if (invite.status === 'revoked') {
      return c.json({ valid: false, error: 'Invite revoked', status: 'revoked' });
    }

    // Check cohort capacity
    const { data: capacity } = await supabase.rpc('check_early_access_cohort_capacity');
    const canRedeem = capacity?.[0]?.can_redeem || false;

    if (!canRedeem) {
      return c.json({ 
        valid: false, 
        error: 'Early Access cohort is currently closed',
        status: 'cohort_closed'
      });
    }

    return c.json({
      valid: true,
      invite: {
        email: invite.email,
        planName: invite.plan_name,
        devicesIncluded: invite.devices_included,
        overageRate: invite.overage_rate,
        expiresAt: invite.expires_at,
      }
    });
  } catch (error) {
    console.error('[EA] Validate token error:', error);
    return c.json({ error: 'Validation failed' }, 500);
  }
});

// Redeem invite
app.post('/redeem', async (c) => {
  const supabase = getSupabaseAdmin();
  
  // Must be authenticated
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Must be signed in to redeem invite' }, 401);
  
  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const body = await c.req.json();
    const { inviteToken, orgName } = body;

    if (!inviteToken || !orgName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate invite
    const { data: invite } = await supabase
      .from('early_access_invites')
      .select('*')
      .eq('token', inviteToken)
      .single();

    if (!invite || invite.status !== 'unused') {
      return c.json({ error: 'Invalid or already used invite' }, 400);
    }

    // Check if user already has an org
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .single();

    if (existingOrg) {
      return c.json({ error: 'User already has an organization' }, 400);
    }

    // Create organization with EA settings
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const foundersExpiry = new Date();
    foundersExpiry.setMonth(foundersExpiry.getMonth() + 12);

    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        owner_id: user.id,
        tier: 'pro',
        device_limit: invite.devices_included,
        is_trial: true,
        trial_ends_at: trialEnd.toISOString(),
        is_early_access: true,
        ea_invite_id: invite.id,
        ea_founders_rate: 99.00,
        ea_founders_rate_expires_at: foundersExpiry.toISOString(),
      })
      .select()
      .single();

    if (orgError) throw orgError;

    // Update user's organization
    await supabase
      .from('users')
      .update({ organization_id: newOrg.id })
      .eq('id', user.id);

    // Mark invite as redeemed
    await supabase
      .from('early_access_invites')
      .update({
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
        redeemed_by_user_id: user.id,
        redeemed_by_org_id: newOrg.id,
      })
      .eq('id', invite.id);

    // Audit log
    await supabase.from('early_access_audit_log').insert({
      invite_id: invite.id,
      action: 'redeemed',
      actor_user_id: user.id,
      actor_email: user.email,
      details: { orgName, orgId: newOrg.id }
    });

    // Send acceptance email
    await sendAcceptanceEmail(user.email || '', orgName);

    return c.json({
      success: true,
      organization: newOrg
    });
  } catch (error) {
    console.error('[EA] Redeem error:', error);
    return c.json({ error: 'Failed to redeem invite' }, 500);
  }
});

export default app;
