import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CONNECT_URL = Deno.env.get("CONNECT_URL") || "";

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const body = await req.json().catch(() => ({}));
  const { action_id, approve, approver_id } = body;

  const { data: action } = await supabase.from("action_queue").select("*").eq("id", action_id).single();
  if (!action) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });

  if (!approve) {
    await supabase.from("action_queue").update({ status: "rejected", approved_by: approver_id }).eq("id", action_id);
    return new Response(JSON.stringify({ ok: true, status: "rejected" }));
  }

  try {
    if (action.action_type === "update_ticket") {
      const p = action.payload;
      await supabase.from("issues").update({
        description: `${p.recommendation ? `[AI Suggestion]: ${p.recommendation}\n\n` : ""}${p.predicted_issue ? `Root Cause: ${p.predicted_issue} (conf ${p.confidence})\n` : ""}`,
        priority: p.priority ?? "medium",
        updated_at: new Date().toISOString()
      }).eq("id", p.issue_id);
    }

    if (action.action_type === "create_kb_draft") {
      const { draft } = action.payload;
      const { data: kb } = await supabase.from("kb_articles").insert({
        org_id: action.org_id,
        title: draft.title ?? "Draft from Analyst",
        prechecks: draft.prechecks, fix: draft.fix, verify: draft.verify,
        status: "draft"
      }).select().single();

      // optional: queue embeddings
      await fetch(Deno.env.get("SUPABASE_FUNCTIONS_URL") + "/embed_kb", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kb_id: kb?.id })
      }).catch(() => null);
    }

    // Device actions (restart/push_driver/run_script) — call Connect webhook
    if (["restart", "push_driver", "run_script"].includes(action.action_type)) {
      const payload = JSON.stringify({
        org_id: action.org_id,
        action_id: action.id,
        device_id: action.payload?.device_id,
        action_type: action.action_type,
        params: action.payload?.params,
        rollback: action.payload?.rollback
      });
      await fetch(`${CONNECT_URL}/v1/device-actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      });
    }

    await supabase.from("action_queue").update({
      status: ["restart","push_driver","run_script"].includes(action.action_type) ? "approved" : "executed",
      approved_by: approver_id,
      executed_at: new Date().toISOString()
    }).eq("id", action_id);

    return new Response(JSON.stringify({ ok: true, status: "executed" }));
  } catch (e) {
    await supabase.from("action_queue").update({ status: "failed" }).eq("id", action_id);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
