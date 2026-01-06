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
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

async function sha256Hex(buf: ArrayBuffer) {
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // START SESSION
    if (path === "start" && req.method === "POST") {
      const { orgId, deviceId, ticketId, userId } = await req.json();

      if (!orgId || !deviceId || !ticketId || !userId) {
        return new Response(
          JSON.stringify({ error: "orgId, deviceId, ticketId, userId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch remote session policy
      const { data: pol } = await supabase
        .from("remote_session_policies")
        .select("*")
        .eq("org_id", orgId)
        .maybeSingle();

      if (pol?.require_mfa && !userId) {
        return new Response(
          JSON.stringify({ error: "MFA required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Minimal posture check (stub - would integrate with actual device status)
      const posture = { patch_level_ok: true, edr_running: true };

      // Create session log
      const { data: log, error } = await supabase
        .from("session_logs")
        .insert({
          org_id: orgId,
          device_id: deviceId,
          ticket_id: ticketId,
          user_id: userId,
          posture,
          started_at: new Date().toISOString(),
          consent_captured: !pol?.require_consent ? true : false
        })
        .select()
        .single();

      if (error) {
        console.error("Session log insert error:", error);
        return new Response(
          JSON.stringify({ error: `Insert error: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Audit log
      await supabase.from("audit_events").insert({
        org_id: orgId,
        actor_id: userId,
        entity: "ticket",
        entity_id: ticketId,
        action: "session_started",
        details: { device_id: deviceId, session_id: log.id }
      });

      return new Response(
        JSON.stringify({
          sessionId: log.id,
          requireConsent: !!pol?.require_consent,
          maxDuration: pol?.max_duration ?? 60
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CONSENT
    if (path === "consent" && req.method === "POST") {
      const { orgId, sessionId, userId, accepted } = await req.json();

      if (!orgId || !sessionId || accepted === undefined) {
        return new Response(
          JSON.stringify({ error: "orgId, sessionId, accepted required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase
        .from("session_logs")
        .update({ consent_captured: !!accepted })
        .eq("id", sessionId)
        .eq("org_id", orgId);

      await supabase.from("audit_events").insert({
        org_id: orgId,
        actor_id: userId || null,
        entity: "session",
        entity_id: sessionId,
        action: "consent_recorded",
        details: { accepted }
      });

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // RECORDING UPLOAD
    if (path === "recording" && req.method === "POST") {
      const form = await req.formData();
      const orgId = form.get("orgId")?.toString();
      const sessionId = form.get("sessionId")?.toString();
      const ticketId = form.get("ticketId")?.toString();
      const userId = form.get("userId")?.toString();
      const file = form.get("recording") as File | null;

      if (!orgId || !sessionId || !ticketId || !file) {
        return new Response(
          JSON.stringify({ error: "orgId, sessionId, ticketId, recording required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const hash = await sha256Hex(bytes.buffer);
      const path = `${orgId}/sessions/${sessionId}.webm`;

      const { error: uploadError } = await supabase.storage
        .from("recordings")
        .upload(path, bytes, {
          contentType: file.type || "video/webm",
          upsert: true
        });

      if (uploadError) {
        console.error("Recording upload error:", uploadError);
        return new Response(
          JSON.stringify({ error: `Upload error: ${uploadError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create signed URL (24 hours)
      const { data: signed } = await supabase.storage
        .from("recordings")
        .createSignedUrl(path, 86400);

      // Update session log
      await supabase
        .from("session_logs")
        .update({
          recording_url: signed?.signedUrl || null,
          recording_hash: hash
        })
        .eq("id", sessionId)
        .eq("org_id", orgId);

      // Attach to ticket details
      const { data: ticket } = await supabase
        .from("tickets")
        .select("details")
        .eq("id", ticketId)
        .maybeSingle();

      const details = {
        ...(ticket?.details || {}),
        recordings: [
          ...((ticket?.details?.recordings) || []),
          {
            session_id: sessionId,
            url: signed?.signedUrl || null,
            sha256: hash,
            at: new Date().toISOString()
          }
        ]
      };

      await supabase
        .from("tickets")
        .update({ details })
        .eq("id", ticketId);

      // Audit log
      await supabase.from("audit_events").insert({
        org_id: orgId,
        actor_id: userId || null,
        entity: "ticket",
        entity_id: ticketId,
        action: "recording_finalized",
        details: { session_id: sessionId, sha256: hash }
      });

      return new Response(
        JSON.stringify({ url: signed?.signedUrl, sha256: hash }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // STOP SESSION
    if (path === "stop" && req.method === "POST") {
      const { orgId, sessionId, userId } = await req.json();

      if (!orgId || !sessionId) {
        return new Response(
          JSON.stringify({ error: "orgId, sessionId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase
        .from("session_logs")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", sessionId)
        .eq("org_id", orgId);

      await supabase.from("audit_events").insert({
        org_id: orgId,
        actor_id: userId || null,
        entity: "session",
        entity_id: sessionId,
        action: "session_stopped",
        details: {}
      });

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });

  } catch (e) {
    console.error("Connect session error:", e);
    return new Response(
      JSON.stringify({ error: `Error: ${e}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});