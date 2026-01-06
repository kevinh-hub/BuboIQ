import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.58.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const body = await req.json().catch(() => ({}));
  const orgId = body.org_id ?? null;
  if (!orgId) return new Response("Missing org_id", { status: 400 });

  // Kill switch / policy
  const { data: policy } = await supabase.from("tier_policies").select("*").eq("org_id", orgId).maybeSingle();

  // Pull context
  const { data: issues } = await supabase.from("issues").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(50);
  const { data: signals } = await supabase.from("signals").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(200);
  const { data: kb } = await supabase.from("kb_articles").select("id,title,prechecks,fix,verify,status").eq("org_id", orgId).order("updated_at", { ascending: false }).limit(25);

  const system =
    `You are BuboIQ Analyst v1, a calm senior IT analyst. 
Return STRICT JSON with keys:
predicted_issue (string), confidence (0..1), recommended_fix (string), next_action (string),
priority_level (low|medium|high|urgent),
kb_draft (object with title, prechecks, fix, verify) when next_action == "create_kb_draft".`;

  const user = { issues, signals, knowledgeBase: kb };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(user) },
    ],
  });

  const content = completion.choices[0].message?.content ?? "{}";
  const result = JSON.parse(content);
  const runId = crypto.randomUUID();

  await supabase.from("agent_traces").insert({
    org_id: orgId, run_id: runId, stage: "reason",
    input: user, output: result, confidence: result.confidence ?? null
  });

  // Prepare actions (respect kill switch + team policy)
  const actions: any[] = [];
  const kill = policy?.kill_switch === true;

  const maybeApprove = (action_type: string, confidence: number, payload: any) => {
    if (kill) return "queued";
    if (policy?.tier === "team") {
      const th = policy.confidence_threshold ?? 0.85;
      const safe = (policy.safelist ?? []).includes(action_type) ||
                   (policy.device_safelist ?? []).includes(action_type);
      if (safe && confidence >= th && (!payload.device || policy.require_rollback === false || payload.rollback)) {
        return "approved";
      }
    }
    return "queued";
  };

  if (result.next_action === "update_ticket" && issues?.[0]) {
    const payload = {
      issue_id: issues[0].id,
      predicted_issue: result.predicted_issue,
      confidence: result.confidence,
      recommendation: result.recommended_fix,
      priority: result.priority_level
    };
    actions.push({
      org_id: orgId, run_id: runId, action_type: "update_ticket",
      payload, status: maybeApprove("update_ticket", result.confidence ?? 0, payload)
    });
  }

  if (result.next_action === "create_kb_draft" && result.kb_draft) {
    const payload = { draft: result.kb_draft };
    actions.push({
      org_id: orgId, run_id: runId, action_type: "create_kb_draft",
      payload, status: maybeApprove("create_kb_draft", result.confidence ?? 0, payload)
    });
  }

  if (actions.length) await supabase.from("action_queue").insert(actions);

  return new Response(JSON.stringify({ ok: true, run_id: runId, actions: actions.length }), { status: 200 });
});
