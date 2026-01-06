// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.15.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { 
  apiVersion: "2024-06-20" 
});
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!, 
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function priceIdToTier(priceId: string): "Starter"|"Pro"|"Team"|null {
  const STARTER = Deno.env.get("STRIPE_PRICE_STARTER")!;
  const PRO     = Deno.env.get("STRIPE_PRICE_PRO")!;
  const TEAM    = Deno.env.get("STRIPE_PRICE_TEAM")!;
  
  console.log(`Mapping priceId ${priceId} to tier. Available prices:`, { STARTER, PRO, TEAM });
  
  if (priceId === STARTER) return "Starter";
  if (priceId === PRO)     return "Pro";
  if (priceId === TEAM)    return "Team";
  return null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'stripe-signature, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    console.error('Missing stripe-signature header');
    return new Response(
      "Missing stripe-signature header", 
      { status: 400, headers: corsHeaders }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(`Webhook event received: ${event.type}`);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(
      `Webhook signature verification failed. ${err}`, 
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = (session.metadata?.orgId || "").trim();
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

        console.log(`Checkout completed - orgId: ${orgId}, subId: ${subscriptionId}, customerId: ${customerId}`);

        if (orgId && subscriptionId && customerId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = sub.items.data[0]?.price?.id;
          const tier = priceId ? priceIdToTier(priceId) : null;

          console.log(`Retrieved subscription - priceId: ${priceId}, tier: ${tier}`);

          if (tier) {
            // First, try to update the orgs table
            const { data: orgData, error: orgError } = await supabase
              .from("orgs")
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                tier
              })
              .eq("id", orgId)
              .select();

            if (orgError) {
              console.error('Error updating orgs table:', orgError);
              
              // If orgs table doesn't exist or update fails, try to update user directly
              console.log('Attempting to update user table instead...');
              const { error: userError } = await supabase
                .from("users")
                .update({ tier })
                .eq("id", orgId)
                .select();

              if (userError) {
                console.error('Error updating users table:', userError);
              } else {
                console.log(`Successfully updated user ${orgId} tier to ${tier}`);
              }
            } else {
              console.log(`Successfully updated org ${orgId}:`, orgData);
            }
          } else {
            console.warn(`Could not determine tier for priceId: ${priceId}`);
          }
        } else {
          console.warn('Missing required data in checkout session:', { orgId, subscriptionId, customerId });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0]?.price?.id;
        const tier = priceId ? priceIdToTier(priceId) : null;

        console.log(`Subscription ${event.type} - customerId: ${customerId}, priceId: ${priceId}, tier: ${tier}`);

        if (customerId && tier) {
          // Update by customer ID
          const { error: orgError } = await supabase
            .from("orgs")
            .update({
              stripe_subscription_id: sub.id,
              tier
            })
            .eq("stripe_customer_id", customerId);

          if (orgError) {
            console.error('Error updating org by customer ID:', orgError);
            // Could also try updating users table here if needed
          } else {
            console.log(`Successfully updated subscription for customer ${customerId}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        
        console.log(`Subscription deleted - customerId: ${customerId}`);
        
        // Downgrade to Starter on cancel (adjust if you prefer "Suspended")
        const { error } = await supabase
          .from("orgs")
          .update({
            stripe_subscription_id: null,
            tier: "Starter"
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error('Error downgrading canceled subscription:', error);
        } else {
          console.log(`Successfully downgraded canceled subscription for customer ${customerId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      `Error processing webhook: ${error}`,
      { status: 500, headers: corsHeaders }
    );
  }
});