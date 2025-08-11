import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CheckCircle2, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface TransactionRow {
  id: string;
  transaction_hash: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

export function PlatformAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalDownPayments, setTotalDownPayments] = useState(0);
  const [downPaymentCount, setDownPaymentCount] = useState(0);

  const [fractionalTotal, setFractionalTotal] = useState(0);
  const [fractionalCount, setFractionalCount] = useState(0);

  const [activeProps, setActiveProps] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [tokensAvailable, setTokensAvailable] = useState(0);

  const [paymentsCompleted, setPaymentsCompleted] = useState(0);
  const [paymentsFailed, setPaymentsFailed] = useState(0);
  const [paymentsMonthly, setPaymentsMonthly] = useState<{ month: string; total: number }[]>([]);

  const [recent, setRecent] = useState<TransactionRow[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // Down payments (proxy for property investments)
        const { data: propsData, error: propsErr } = await supabase
          .from("user_properties")
          .select("down_payment")
          .limit(1000);
        if (propsErr) throw propsErr;
        const downPayments = propsData?.map((p: any) => Number(p.down_payment || 0)) || [];
        setTotalDownPayments(downPayments.reduce((a, b) => a + b, 0));
        setDownPaymentCount(downPayments.length);

        // Fractional investments
        const { data: fracData, error: fracErr } = await supabase
          .from("fractional_investments")
          .select("investment_amount")
          .limit(1000);
        if (fracErr) throw fracErr;
        const fracAmts = fracData?.map((f: any) => Number(f.investment_amount || 0)) || [];
        setFractionalTotal(fracAmts.reduce((a, b) => a + b, 0));
        setFractionalCount(fracAmts.length);

        // Fractionalization overview
        const { data: fracProps, error: fracPropsErr } = await supabase
          .from("property_fractionalization")
          .select("is_active,tokens_sold,total_tokens_available")
          .limit(1000);
        if (fracPropsErr) throw fracPropsErr;
        const active = fracProps?.filter((p: any) => p.is_active) || [];
        setActiveProps(active.length);
        setTokensSold((fracProps || []).reduce((s: number, p: any) => s + Number(p.tokens_sold || 0), 0));
        setTokensAvailable((fracProps || []).reduce((s: number, p: any) => s + Number(p.total_tokens_available || 0), 0));

        // Payments reliability and monthly totals
        const { data: payData, error: payErr } = await supabase
          .from("payment_history")
          .select("status,payment_amount,payment_date")
          .order("payment_date", { ascending: false })
          .limit(1000);
        if (payErr) throw payErr;
        const completed = (payData || []).filter((p: any) => p.status === "completed");
        const failed = (payData || []).filter((p: any) => p.status === "failed");
        setPaymentsCompleted(completed.length);
        setPaymentsFailed(failed.length);
        // Group by month
        const byMonth: Record<string, number> = {};
        (payData || []).forEach((p: any) => {
          const d = new Date(p.payment_date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          byMonth[key] = (byMonth[key] || 0) + Number(p.payment_amount || 0);
        });
        const monthly = Object.entries(byMonth)
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([month, total]) => ({ month, total }));
        setPaymentsMonthly(monthly);

        // Recent transactions
        const { data: txData, error: txErr } = await supabase
          .from("user_transactions")
          .select("id,transaction_hash,amount,transaction_type,status,created_at")
          .order("created_at", { ascending: false })
          .limit(10);
        if (txErr) throw txErr;
        setRecent((txData as any) || []);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load platform analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalVolume = useMemo(() => totalDownPayments + fractionalTotal, [totalDownPayments, fractionalTotal]);
  const totalCount = useMemo(() => downPaymentCount + fractionalCount, [downPaymentCount, fractionalCount]);
  const utilizationPct = useMemo(() => {
    if (!tokensAvailable) return 0;
    return Math.round((tokensSold / tokensAvailable) * 100);
  }, [tokensSold, tokensAvailable]);
  const paymentSuccessRate = useMemo(() => {
    const total = paymentsCompleted + paymentsFailed;
    if (!total) return 0;
    return Math.round((paymentsCompleted / total) * 100);
  }, [paymentsCompleted, paymentsFailed]);

  const reliabilityPieData = useMemo(() => [
    { name: "Completed", value: paymentsCompleted },
    { name: "Failed", value: paymentsFailed },
  ], [paymentsCompleted, paymentsFailed]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading platform analytics...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground">
          Real-time platform metrics to provide context for your investment decisions. These verified metrics show overall platform performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Investment Volume</CardTitle>
            <CardDescription>Sum of down payments and fractional investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-sm text-muted-foreground mt-2">Across {totalCount} investments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Properties</CardTitle>
            <CardDescription>Fractional offerings currently live</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activeProps}</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span>Utilization</span>
                <span className="font-medium">{utilizationPct}%</span>
              </div>
              <Progress value={utilizationPct} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Reliability</CardTitle>
            <CardDescription>Completed vs failed mortgage payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reliabilityPieData} dataKey="value" nameKey="name" outerRadius={70}>
                      {reliabilityPieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-3xl font-semibold">{paymentSuccessRate}%</div>
                <div className="text-sm text-muted-foreground">Success rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Payments Volume</CardTitle>
                <CardDescription>Sum of mortgage payments by month</CardDescription>
              </div>
              <BarChart3 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentsMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust & Safety Controls</CardTitle>
            <CardDescription>Phase 1 hardening — live in production</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-500" /> NetworkGuard prevents wrong-chain actions and displays clear guidance.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" /> Single WalletProvider — eliminates duplicate connections and race conditions.</li>
              <li className="flex items-start gap-2"><ExternalLink className="w-4 h-4 mt-0.5 text-emerald-500" /> Block explorer links in success toasts — instant, third-party verification.</li>
            </ul>
            <Button className="mt-6" variant="outline" onClick={() => window.print()}>
              <FileText className="w-4 h-4 mr-2" /> Export to PDF/Print
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest 10 platform transactions</CardDescription>
            </div>
            <Activity className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Explorer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap text-sm">{new Date(tx.created_at).toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{tx.transaction_type}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{tx.status}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-sm">${Number(tx.amount || 0).toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {tx.transaction_hash ? (
                        <a href={getExplorerTxUrl(tx.transaction_hash)} target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}