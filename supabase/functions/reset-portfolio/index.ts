
/**
 * Edge Function: reset-portfolio
 * Securely resets all fractional portfolio data for a given wallet by calling
 * public.reset_fractional_portfolio(p_wallet text), which is service-role restricted.
 *
 * CORS-enabled so it can be invoked from the browser via supabase.functions.invoke.
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const raw = (body.wallet ?? body.address ?? "").toString();
    const wallet = raw.trim().toLowerCase();

    if (!wallet) {
      return new Response(JSON.stringify({ error: "wallet is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log("[reset-portfolio] resetting wallet:", wallet);

    const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);

    const { data, error } = await supabase.rpc("reset_fractional_portfolio", {
      p_wallet: wallet,
    });

    if (error) {
      console.error("[reset-portfolio] RPC error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("[reset-portfolio] reset summary:", data);

    return new Response(JSON.stringify({ ok: true, result: data }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error("[reset-portfolio] unexpected error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
