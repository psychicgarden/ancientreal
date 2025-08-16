
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

    let deletedInvestments = 0;
    let deletedProperties = 0;
    let deletedTransactions = 0;
    let updatedProperties = 0;

    try {
      // Delete fractional investments
      const { error: investError, count: invCount } = await supabase
        .from("fractional_investments")
        .delete({ count: 'exact' })
        .eq("investor_wallet_address", wallet);
      
      if (investError) throw investError;
      deletedInvestments = invCount || 0;

      // Delete user properties  
      const { error: propError, count: propCount } = await supabase
        .from("user_properties")
        .delete({ count: 'exact' })
        .or(`user_wallet_address.eq.${wallet},user_address.eq.${wallet}`);
      
      if (propError) throw propError;
      deletedProperties = propCount || 0;

      // Delete user transactions
      const { error: txError, count: txCount } = await supabase
        .from("user_transactions")
        .delete({ count: 'exact' })
        .eq("user_wallet_address", wallet);
      
      if (txError) throw txError;
      deletedTransactions = txCount || 0;

      // Reset tokens_sold to 0 for all properties
      const { error: updateError, count: updateCount } = await supabase
        .from("property_fractionalization")
        .update({ tokens_sold: 0, updated_at: new Date().toISOString() }, { count: 'exact' })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all records
      
      if (updateError) throw updateError;
      updatedProperties = updateCount || 0;

      const data = {
        wallet,
        deleted_investments: deletedInvestments,
        deleted_properties: deletedProperties,
        deleted_transactions: deletedTransactions,
        updated_properties: updatedProperties
      };

      console.log("[reset-portfolio] reset summary:", data);

      return new Response(JSON.stringify({ ok: true, result: data }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (resetError) {
      console.error("[reset-portfolio] reset error:", resetError);
      return new Response(JSON.stringify({ error: resetError.message || "Reset operation failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (e) {
    console.error("[reset-portfolio] unexpected error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
