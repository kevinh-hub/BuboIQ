// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.15.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { 
  apiVersion: "2024-06-20" 
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!, 
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return new Response("Unauthorized", { 
      status: 401, 
      headers: corsHeaders 
    });
  }

  try {
    const { orgId } = await req.json();
    
    if (!orgId) {
      return new Response(
        JSON.stringify({ error: "orgId required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Opening billing portal for orgId: ${orgId}`);

    // First try to get from orgs table
    let stripeCustomerId = null;
    
    const { data: org, error: orgError } = await supabase
      .from("orgs")
      .select("stripe_customer_id")
      .eq("id", orgId)
      .single();

    if (orgError) {
      console.log('Orgs table error, trying users table:', orgError);
      
      // Fallback to users table if orgs doesn't exist
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", orgId)
        .single();

      if (userError || !user?.stripe_customer_id) {
        console.error('No customer ID found in users table:', userError);
        return new Response(
          JSON.stringify({ error: "No billing account found. Please subscribe to a plan first." }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      stripeCustomerId = user.stripe_customer_id;
    } else {
      if (!org?.stripe_customer_id) {
        return new Response(
          JSON.stringify({ error: "No billing account found. Please subscribe to a plan first." }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      stripeCustomerId = org.stripe_customer_id;
    }

    const origin = req.headers.get("origin") || "https://buboiq.com";

    console.log(`Creating billing portal session for customer: ${stripeCustomerId}`);

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/settings`,
    });

    console.log(`Created billing portal session: ${session.id}`);

    return new Response(
      JSON.stringify({ url: session.url }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error('Stripe portal error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to open billing portal'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});