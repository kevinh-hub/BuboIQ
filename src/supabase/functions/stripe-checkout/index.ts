// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.15.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { 
  apiVersion: "2024-06-20" 
});

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
    const { priceId, orgId } = await req.json();
    
    if (!priceId || !orgId) {
      return new Response(
        JSON.stringify({ error: "priceId and orgId required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const origin = req.headers.get("origin") || "https://buboiq.com";

    console.log(`Creating checkout session for orgId: ${orgId}, priceId: ${priceId}`);

    // Create a customer per org if needed (simplified: always create, Stripe will merge by email if configured)
    const customer = await stripe.customers.create({ 
      metadata: { orgId }
    });

    console.log(`Created Stripe customer: ${customer.id}`);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
      customer: customer.id,
      metadata: { orgId },
    });

    console.log(`Created checkout session: ${session.id}`);

    return new Response(
      JSON.stringify({ url: session.url }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create checkout session'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});