
import { supabase } from "@/integrations/supabase/client";

/**
 * Calls the reset-portfolio edge function to archive and delete all
 * fractional portfolio data for the specified wallet, and recompute tokens_sold.
 * Returns the reset summary from the RPC.
 *
 * Usage:
 *   await resetPortfolio("0xabc123...");
 */
export async function resetPortfolio(wallet: string) {
  const normalized = wallet?.toLowerCase().trim();
  if (!normalized) {
    throw new Error("Wallet address is required");
  }

  console.log("[resetPortfolio] invoking edge function for:", normalized);

  const { data, error } = await supabase.functions.invoke("reset-portfolio", {
    body: { wallet: normalized },
  });

  if (error) {
    console.error("[resetPortfolio] function error:", error);
    throw error;
  }

  console.log("[resetPortfolio] result:", data);
  return data;
}
