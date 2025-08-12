import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { resetPortfolio } from "@/lib/admin/resetPortfolio";

interface OneTimeResetProps {
  wallet: string;
}

/**
 * One-time reset runner. On mount, calls the reset-portfolio edge function
 * for the provided wallet, shows a toast with the result, and marks a local
 * flag to avoid running again.
 */
export default function OneTimeReset({ wallet }: OneTimeResetProps) {
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return; // guard against double-invocation
    didRunRef.current = true;

    const normalized = wallet?.toLowerCase().trim();
    if (!normalized) {
      toast({
        title: "Reset aborted",
        description: "No wallet provided.",
        variant: "destructive",
      });
      return;
    }

    const flagKey = `reset-portfolio:${normalized}`;
    const already = localStorage.getItem(flagKey);
    if (already) {
      console.log(`[OneTimeReset] already ran for ${normalized} at`, new Date(parseInt(already, 10)).toISOString());
      return;
    }

    (async () => {
      try {
        console.log("[OneTimeReset] invoking reset for", normalized);
        const res = await resetPortfolio(normalized);
        localStorage.setItem(flagKey, String(Date.now()));
        console.log("[OneTimeReset] reset result", res);

        const result = res?.result ?? res;
        const summary = result
          ? Object.entries(result)
              .map(([k, v]) => `${k}: ${v}`)
              .slice(0, 5)
              .join(" | ")
          : "Reset completed";

        toast({
          title: "Portfolio reset complete",
          description: summary,
        });
      } catch (e: any) {
        console.error("[OneTimeReset] reset error", e);
        toast({
          title: "Reset failed",
          description: e?.message || "Unexpected error",
          variant: "destructive",
        });
      }
    })();
  }, [wallet]);

  return null;
}
