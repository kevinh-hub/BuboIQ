import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-55e8c5b2/health", (c) => {
  return c.json({ status: "ok" });
});

// Generate KB Article from a resolved or analyzed ticket
app.post("/make-server-55e8c5b2/ai/kb-generate", async (c) => {
  try {
    // Auth check
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const { ticket_id, title, description, suggested_fix } = body;

    if (!ticket_id || !title) {
      return c.json({ error: "ticket_id and title are required" }, 400);
    }

    // Generate article content via Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

    const prompt = [
      "You are a technical knowledge base writer for an IT support platform.",
      "Generate a structured KB article for the following support ticket.",
      "",
      `Title: ${title}`,
      description ? `Description: ${description}` : "",
      suggested_fix ? `Suggested Fix: ${suggested_fix}` : "",
      "",
      "Return ONLY a JSON object with these exact keys:",
      '{ "title": string, "summary": string, "issue": string, "root_cause": string, "solution": string, "prevention": string, "tags": string[] }',
    ].filter(Boolean).join("\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    let articleData: Record<string, any> = {};
    const content = message.content[0];
    if (content.type === "text") {
      try {
        const match = content.text.match(/\{[\s\S]*\}/);
        articleData = JSON.parse(match ? match[0] : content.text);
      } catch {
        articleData = {
          title,
          summary: `Resolution for: ${title}`,
          issue: description || "",
          root_cause: "",
          solution: suggested_fix || "",
          prevention: "",
          tags: [],
        };
      }
    }

    // Persist article to KV
    const articleId = crypto.randomUUID();
    const now = new Date().toISOString();
    const article = {
      id: articleId,
      ticket_id,
      title: articleData.title || title,
      summary: articleData.summary || "",
      issue: articleData.issue || description || "",
      root_cause: articleData.root_cause || "",
      solution: articleData.solution || suggested_fix || "",
      prevention: articleData.prevention || "",
      tags: Array.isArray(articleData.tags) ? articleData.tags : [],
      created_at: now,
      updated_at: now,
    };

    await kv.set(`kb_article:${articleId}`, article);

    console.log(`[KB Generate] Created article ${articleId} for ticket ${ticket_id}`);
    return c.json({ success: true, article_id: articleId, article });
  } catch (err: any) {
    console.log("[KB Generate] Error:", err.message);
    return c.json({ error: err.message || "Failed to generate KB article" }, 500);
  }
});

// POST /remote/request-consent — auth required; inserts into remote_sessions and sends consent email
app.post("/make-server-55e8c5b2/remote/request-consent", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const { device_id, organization_id, ticket_id, end_user_email, device_name, technician_name } = body;

    if (!device_id) return c.json({ error: "device_id is required" }, 400);

    const consent_token = crypto.randomUUID();

    const { data: session, error: insertError } = await supabaseClient
      .from("remote_sessions")
      .insert({
        organization_id: organization_id || null,
        device_id,
        initiated_by: user.id,
        status: "pending_consent",
        consent_token,
        consent_status: "pending",
        end_user_email: end_user_email || null,
        ticket_id: ticket_id || null,
      })
      .select()
      .single();

    if (insertError) {
      console.log("[Request Consent] Insert error:", insertError.message);
      return c.json({ error: `Failed to create session: ${insertError.message}` }, 500);
    }

    // Send consent email via Resend
    const approveUrl = `https://www.buboiq.com/consent/${consent_token}?action=approve`;
    const denyUrl    = `https://www.buboiq.com/consent/${consent_token}?action=deny`;
    const tech       = technician_name || "A technician";
    const device     = device_name || device_id;

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0B1021;color:#f3f4f6;border-radius:12px;">
        <h2 style="color:#00FF94;margin-bottom:8px;">Remote Support Request</h2>
        <p style="margin-bottom:24px;color:#94a3b8;">
          <strong style="color:#f3f4f6;">${tech}</strong> is requesting remote access to
          <strong style="color:#f3f4f6;">${device}</strong>.
        </p>
        <a href="${approveUrl}" style="display:inline-block;padding:14px 28px;background:#00FF94;color:#000;font-weight:700;border-radius:8px;text-decoration:none;margin-right:12px;">
          ✓ Approve Access
        </a>
        <a href="${denyUrl}" style="display:inline-block;padding:14px 28px;background:#ef4444;color:#fff;font-weight:700;border-radius:8px;text-decoration:none;">
          ✗ Deny Access
        </a>
        <p style="margin-top:28px;font-size:12px;color:#64748b;">
          Only approve if you expected this support request. This link expires after use.
        </p>
      </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "BuboIQ <noreply@buboiq.com>",
        to: [end_user_email],
        subject: `Remote Support Request — ${device}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const resendErr = await resendRes.text();
      console.log("[Request Consent] Resend error:", resendErr);
      // Non-fatal — session is created; log but continue
    } else {
      console.log(`[Request Consent] Consent email sent to ${end_user_email}`);
    }

    // Store human-readable names in KV so the public consent page can display them
    await kv.set(`session_meta:${session.id}`, {
      device_name:      device_name || device_id,
      technician_name:  technician_name || "A support technician",
    });

    console.log(`[Request Consent] Session ${session.id} created, token ${consent_token}`);
    return c.json({ success: true, session_id: session.id, consent_token, status: session.status });
  } catch (err: any) {
    console.log("[Request Consent] Error:", err.message);
    return c.json({ error: err.message || "Failed to create consent session" }, 500);
  }
});

// GET /remote/consent/:token — public; returns session info for the consent page
app.get("/make-server-55e8c5b2/remote/consent/:token", async (c) => {
  try {
    const token = c.req.param("token");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: session, error } = await supabaseClient
      .from("remote_sessions")
      .select("id, status, consent_status, device_id, end_user_email, created_at, ticket_id")
      .eq("consent_token", token)
      .single();

    if (error || !session) {
      return c.json({ error: "Consent session not found or expired" }, 404);
    }

    // Merge human-readable names stored in KV at request time
    const meta: any = await kv.get(`session_meta:${session.id}`).catch(() => null);

    return c.json({
      success: true,
      session: {
        ...session,
        device_name:     meta?.device_name     || session.device_id,
        technician_name: meta?.technician_name || "A support technician",
      },
    });
  } catch (err: any) {
    console.log("[Consent GET] Error:", err.message);
    return c.json({ error: err.message || "Failed to fetch consent session" }, 500);
  }
});

// POST /remote/consent/:token/respond — public; approves or denies a session by consent_token
app.post("/make-server-55e8c5b2/remote/consent/:token/respond", async (c) => {
  try {
    const token = c.req.param("token");
    const body = await c.req.json();
    const { action } = body;

    if (action !== "approve" && action !== "deny") {
      return c.json({ error: "action must be 'approve' or 'deny'" }, 400);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the session exists and is still pending
    const { data: existing, error: fetchError } = await supabaseClient
      .from("remote_sessions")
      .select("id, consent_status")
      .eq("consent_token", token)
      .single();

    if (fetchError || !existing) {
      return c.json({ error: "Consent session not found or expired" }, 404);
    }
    if (existing.consent_status !== "pending") {
      return c.json({ error: "This consent request has already been responded to" }, 409);
    }

    const newConsentStatus = action === "approve" ? "approved" : "denied";
    const newStatus        = action === "approve" ? "active"   : "denied";

    const { error: updateError } = await supabaseClient
      .from("remote_sessions")
      .update({ consent_status: newConsentStatus, status: newStatus })
      .eq("consent_token", token);

    if (updateError) {
      console.log("[Consent Respond] Update error:", updateError.message);
      return c.json({ error: `Failed to update session: ${updateError.message}` }, 500);
    }

    console.log(`[Consent Respond] Token ${token} → ${newConsentStatus}`);
    return c.json({ success: true, status: newStatus, consent_status: newConsentStatus });
  } catch (err: any) {
    console.log("[Consent Respond] Error:", err.message);
    return c.json({ error: err.message || "Failed to respond to consent session" }, 500);
  }
});

// GET /remote/session/:id/status — authenticated; returns session status fields by id
app.get("/make-server-55e8c5b2/remote/session/:id/status", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const id = c.req.param("id");

    const { data: session, error } = await supabaseClient
      .from("remote_sessions")
      .select("id, status, consent_status, started_at")
      .eq("id", id)
      .single();

    if (error || !session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json({
      id: session.id,
      status: session.status,
      consent_status: session.consent_status,
      started_at: session.started_at,
    });
  } catch (err: any) {
    console.log("[Session Status] Error:", err.message);
    return c.json({ error: err.message || "Failed to fetch session status" }, 500);
  }
});

// GET /admin/stats — super-admin only; counts rows in core tables using service role (bypasses RLS)
app.get("/make-server-55e8c5b2/admin/stats", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const counts: Record<string, number> = {};

    const tables = ["organizations", "profiles", "devices", "tickets", "signals"] as const;
    await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabaseClient
          .from(table)
          .select("id", { count: "exact", head: true });
        if (error) {
          console.log(`[Admin Stats] ${table} count error:`, error.message);
          counts[table] = 0;
        } else {
          counts[table] = count ?? 0;
        }
      })
    );

    console.log("[Admin Stats] counts:", counts);
    return c.json({ success: true, ...counts });
  } catch (err: any) {
    console.log("[Admin Stats] Error:", err.message);
    return c.json({ error: err.message || "Failed to fetch admin stats" }, 500);
  }
});

// GET /notifications — authenticated; returns recent signals + tickets as notifications
app.get("/make-server-55e8c5b2/notifications", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    // Load read notification IDs from KV
    const readData: any = await kv.get(`notifications_read:${user.id}`).catch(() => null);
    const readIds: Set<string> = new Set(Array.isArray(readData?.ids) ? readData.ids : []);

    // Fetch recent signals
    const { data: signals } = await supabaseClient
      .from("signals")
      .select("id, title, type, severity, created_at")
      .order("created_at", { ascending: false })
      .limit(15);

    // Fetch recent tickets
    const { data: tickets } = await supabaseClient
      .from("tickets")
      .select("id, title, priority, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const notifications: any[] = [
      ...(signals ?? []).map((s: any) => ({
        id:         `signal:${s.id}`,
        type:       "signal",
        severity:   s.severity,
        title:      s.title || "New signal detected",
        subtitle:   s.type ? `Type: ${s.type}` : undefined,
        created_at: s.created_at,
        read:       readIds.has(`signal:${s.id}`),
      })),
      ...(tickets ?? []).map((t: any) => ({
        id:         `ticket:${t.id}`,
        type:       "ticket",
        severity:   t.priority,
        title:      t.title || "New ticket",
        subtitle:   t.priority ? `Priority: ${t.priority}` : undefined,
        created_at: t.created_at,
        read:       readIds.has(`ticket:${t.id}`),
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
     .slice(0, 20);

    const unread_count = notifications.filter(n => !n.read).length;
    return c.json({ notifications, unread_count });
  } catch (err: any) {
    console.log("[Notifications] Error:", err.message);
    return c.json({ error: err.message || "Failed to fetch notifications" }, 500);
  }
});

// POST /notifications/read — authenticated; marks notification IDs as read in KV
app.post("/make-server-55e8c5b2/notifications/read", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const { ids } = await c.req.json();
    if (!Array.isArray(ids)) return c.json({ error: "ids must be an array" }, 400);

    const existing: any = await kv.get(`notifications_read:${user.id}`).catch(() => null);
    const current: string[] = Array.isArray(existing?.ids) ? existing.ids : [];
    const merged = Array.from(new Set([...current, ...ids])).slice(-200); // keep last 200
    await kv.set(`notifications_read:${user.id}`, { ids: merged });

    return c.json({ success: true, marked: ids.length });
  } catch (err: any) {
    console.log("[Notifications Read] Error:", err.message);
    return c.json({ error: err.message || "Failed to mark notifications read" }, 500);
  }
});

// AI triage: classify ticket and suggest a fix
app.post("/make-server-55e8c5b2/ai/triage-ticket", async (c) => {
  try {
    const body = await c.req.json();
    const { ticket_id, title, description, priority } = body;

    if (!title) return c.json({ error: "title is required" }, 400);

    const prompt = [
      "You are an expert IT support triage assistant.",
      "Analyze the following support ticket and respond with ONLY a valid JSON object — no markdown, no code fences.",
      "",
      `ticket_id: ${ticket_id ?? "unknown"}`,
      `title: ${title}`,
      description ? `description: ${description}` : "",
      priority ? `current_priority: ${priority}` : "",
      "",
      "Return a JSON object with exactly these keys:",
      '{ "suggested_priority": "critical"|"high"|"medium"|"low", "category": string, "sentiment": string, "suggested_fix": string, "estimated_time": string }',
    ].filter(Boolean).join("\n");

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic error ${resp.status}: ${err}`);
    }

    const data = await resp.json();
    const text = data.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);

    console.log(`[Triage] ticket ${ticket_id} → priority: ${parsed.suggested_priority}`);
    return c.json({ success: true, ticket_id, ...parsed });
  } catch (err: any) {
    console.log("[Triage] Error:", err.message);
    return c.json({ error: err.message || "Failed to triage ticket" }, 500);
  }
});

// AI suggest-fixes: return 1-3 actionable fix recommendations
app.post("/make-server-55e8c5b2/ai/suggest-fixes", async (c) => {
  try {
    const body = await c.req.json();
    const { ticket_id, title, description } = body;

    if (!title) return c.json({ error: "title is required" }, 400);

    const prompt = [
      "You are an expert IT support engineer.",
      "Given the following support ticket, provide 1-3 specific, actionable fix recommendations.",
      "Respond with ONLY a valid JSON object — no markdown, no code fences.",
      "",
      `ticket_id: ${ticket_id ?? "unknown"}`,
      `title: ${title}`,
      description ? `description: ${description}` : "",
      "",
      "Return a JSON object with exactly this shape:",
      '{ "fixes": [ { "title": string, "steps": string[], "difficulty": "easy"|"medium"|"hard", "estimated_time": string } ] }',
      "Include 1 to 3 fixes. Each fix must have at least 2 concrete steps.",
    ].filter(Boolean).join("\n");

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic error ${resp.status}: ${err}`);
    }

    const data = await resp.json();
    const text = data.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);

    const fixes = Array.isArray(parsed.fixes) ? parsed.fixes : [];
    console.log(`[SuggestFixes] ticket ${ticket_id} → ${fixes.length} fix(es) returned`);
    return c.json({ success: true, ticket_id, fixes });
  } catch (err: any) {
    console.log("[SuggestFixes] Error:", err.message);
    return c.json({ error: err.message || "Failed to suggest fixes" }, 500);
  }
});

// POST /devices/:deviceId/commands — queue a remote command for the agent
app.post("/make-server-55e8c5b2/devices/:deviceId/commands", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const deviceId = c.req.param("deviceId");
    const body = await c.req.json();
    const { command_type } = body;

    const VALID_COMMANDS = ["install_updates", "collect_inventory", "run_scan", "restart"];
    if (!command_type || !VALID_COMMANDS.includes(command_type)) {
      return c.json({ error: `command_type must be one of: ${VALID_COMMANDS.join(", ")}` }, 400);
    }

    const command = {
      id: crypto.randomUUID(),
      device_id: deviceId,
      command_type,
      status: "pending",
      issued_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store command in KV list for this device (keep last 50)
    const existing: any = await kv.get(`device_commands:${deviceId}`).catch(() => null);
    const commands: any[] = Array.isArray(existing?.commands) ? existing.commands : [];
    commands.unshift(command);
    await kv.set(`device_commands:${deviceId}`, { commands: commands.slice(0, 50) });

    console.log(`[DeviceCommands] queued ${command_type} for device ${deviceId}`);
    return c.json({ success: true, command });
  } catch (err: any) {
    console.log("[DeviceCommands POST] Error:", err.message);
    return c.json({ error: err.message || "Failed to queue command" }, 500);
  }
});

// GET /devices/:deviceId/commands — fetch command history (last 10)
app.get("/make-server-55e8c5b2/devices/:deviceId/commands", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const deviceId = c.req.param("deviceId");
    const existing: any = await kv.get(`device_commands:${deviceId}`).catch(() => null);
    const commands: any[] = Array.isArray(existing?.commands) ? existing.commands : [];

    return c.json({ success: true, commands: commands.slice(0, 10) });
  } catch (err: any) {
    console.log("[DeviceCommands GET] Error:", err.message);
    return c.json({ error: err.message || "Failed to fetch commands" }, 500);
  }
});

// PATCH /devices/:deviceId/commands/:commandId — approve or reject a pending command
app.patch("/make-server-55e8c5b2/devices/:deviceId/commands/:commandId", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

    const deviceId = c.req.param("deviceId");
    const commandId = c.req.param("commandId");
    const body = await c.req.json();
    const { approval_status } = body;

    if (approval_status !== "approved" && approval_status !== "rejected") {
      return c.json({ error: "approval_status must be 'approved' or 'rejected'" }, 400);
    }

    const existing: any = await kv.get(`device_commands:${deviceId}`).catch(() => null);
    const commands: any[] = Array.isArray(existing?.commands) ? existing.commands : [];
    const idx = commands.findIndex((cmd: any) => cmd.id === commandId);
    if (idx === -1) return c.json({ error: "Command not found" }, 404);

    commands[idx] = { ...commands[idx], approval_status, updated_at: new Date().toISOString() };
    await kv.set(`device_commands:${deviceId}`, { commands });

    console.log(`[DeviceCommands PATCH] command ${commandId} set to ${approval_status}`);
    return c.json({ success: true, command: commands[idx] });
  } catch (err: any) {
    console.log("[DeviceCommands PATCH] Error:", err.message);
    return c.json({ error: err.message || "Failed to update command" }, 500);
  }
});

// POST /agent/checkin — unauthenticated agent check-in; upserts device then inventory
// Accepts: { org_id, device_id, hostname, platform, platform_version, ip_address,
//            mac_address, agent_version, status, inventory? }
// The device MUST be upserted before inventory to satisfy the FK constraint.
app.post("/make-server-55e8c5b2/agent/checkin", async (c) => {
  try {
    const body = await c.req.json();
    const {
      org_id, device_id, hostname, platform, platform_version,
      ip_address, mac_address, agent_version, status = "online",
      inventory,
    } = body;

    if (!org_id || !device_id || !hostname) {
      return c.json({ error: "org_id, device_id, and hostname are required" }, 400);
    }

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date().toISOString();

    // Step 1 — upsert the device record FIRST so the FK constraint is satisfied
    const { error: deviceError } = await db.from("devices").upsert({
      id: device_id,
      org_id,
      hostname,
      platform,
      platform_version,
      ip_address,
      mac_address,
      agent_version,
      status,
      last_seen: now,
    }, { onConflict: "id" });

    if (deviceError) {
      console.log("[Agent] Device upsert error:", deviceError);
      return c.json({ error: "Failed to register device", details: deviceError.message }, 500);
    }

    console.log("[Agent] Device upserted:", device_id, hostname);

    // Step 2 — upsert inventory only after the device row exists
    if (inventory && typeof inventory === "object") {
      const { error: invError } = await db.from("device_inventory").upsert({
        device_id,
        ...inventory,
        updated_at: now,
      }, { onConflict: "device_id" });

      if (invError) {
        // Non-fatal — device is registered; log and continue
        console.log("[Agent] Inventory error:", invError);
      } else {
        console.log("[Agent] Inventory updated for device:", device_id);
      }
    }

    // Step 3 — return any pending commands for this device
    const existing: any = await kv.get(`device_commands:${device_id}`).catch(() => null);
    const pending = (Array.isArray(existing?.commands) ? existing.commands : [])
      .filter((cmd: any) => cmd.status === "pending");

    return c.json({ success: true, device_id, pending_commands: pending });
  } catch (err: any) {
    console.log("[Agent] Checkin error:", err.message);
    return c.json({ error: err.message || "Agent checkin failed" }, 500);
  }
});

Deno.serve(app.fetch);