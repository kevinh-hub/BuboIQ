import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.58.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  const { kb_id } = await req.json();
  const { data: kb } = await supabase.from("kb_articles").select("*").eq("id", kb_id).single();
  if (!kb) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });

  const content = `${kb.title}\n\nPrechecks:\n${kb.prechecks}\n\nFix:\n${kb.fix}\n\nVerify:\n${kb.verify}`;
  const emb = await openai.embeddings.create({ model: "text-embedding-3-large", input: content });
  await supabase.from("kb_embeddings").insert({ kb_id, content, embedding: emb.data[0].embedding as any });
  return new Response(JSON.stringify({ ok: true }));
});
