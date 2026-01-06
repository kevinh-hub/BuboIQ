// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256Hex(buf: ArrayBuffer) {
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { orgId, policyId } = await req.json();

    if (!orgId || !policyId) {
      return new Response(
        JSON.stringify({ error: "orgId and policyId required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch compliance policy
    const { data: pol, error: policyError } = await supabase
      .from("compliance_policies")
      .select("id,name,policy_json")
      .eq("id", policyId)
      .eq("org_id", orgId)
      .single();

    if (policyError) {
      return new Response(
        JSON.stringify({ error: `Policy not found: ${policyError.message}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch audit events for this org
    const { data: events, error: eventsError } = await supabase
      .from("audit_events")
      .select("id,actor_id,entity,entity_id,action,details,created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (eventsError) {
      console.error("Error fetching audit events:", eventsError);
    }

    // Create evidence export payload
    const payload = new TextEncoder().encode(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        org_id: orgId,
        policy: pol,
        audit_events: events || []
      }, null, 2)
    );

    const hash = await sha256Hex(payload.buffer);

    // Upload to storage (create bucket if not exists)
    const bucketName = "recordings"; // Reuse recordings bucket for compliance exports
    const path = `${orgId}/compliance/evidence_${policyId}_${Date.now()}.json`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, payload, {
        contentType: "application/json",
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: `Upload error: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create signed URL (1 hour expiry)
    const { data: signed, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 3600);

    if (signedError) {
      console.error("Signed URL error:", signedError);
    }

    // Store export record
    await supabase.from("evidence_exports").insert({
      org_id: orgId,
      policy_id: policyId,
      export_url: signed?.signedUrl || null,
      signature: hash
    });

    return new Response(
      JSON.stringify({
        url: signed?.signedUrl,
        sha256: hash,
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("Compliance export error:", e);
    return new Response(
      JSON.stringify({ error: `Error: ${e}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});