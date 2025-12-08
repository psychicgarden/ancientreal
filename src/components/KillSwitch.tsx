import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, FileText, Zap, Layers } from "lucide-react";

export default function KillSwitch() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-destructive/50 text-destructive">
            Enforcement Layer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Our "Kill Switch" <span className="text-green-500">Makes Default Profitable</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zero foreclosure courts. Instant asset recovery. 2.5× rental coverage.
          </p>
        </div>

        {/* 3 Mechanism Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* The Problem */}
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-base">The Problem It Solves</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Software-only lenders (TrueFi, Maple) failed because they have <span className="text-destructive font-medium">zero real-world enforcement</span>.
              </p>
            </CardContent>
          </Card>

          {/* Title Retention */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Title Retention</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Reserva de Dominio</span> — Ancient retains 100% legal title until the final dollar is paid.
              </p>
            </CardContent>
          </Card>

          {/* Smart Default */}
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle className="text-base">Smart Default</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Buyer stops paying → Smart Contract revokes access NFT → <span className="text-green-500 font-medium">Instant physical reclaim</span>. No courts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Title-Wrapper NFT Visual */}
        <Card className="mb-12 bg-card/50 border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Core Innovation: The Title-Wrapper NFT</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Three layers of enforceable ownership in one token</p>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto space-y-3">
              {/* Layer 1: Deed */}
              <div className="relative">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-amber-500 uppercase tracking-wider mb-1">Legal Layer</p>
                  <p className="font-semibold text-foreground">The Deed</p>
                  <p className="text-xs text-muted-foreground mt-1">Legal ownership in jurisdiction-specific SPV</p>
                </div>
              </div>
              
              {/* Layer 2: Debt */}
              <div className="relative">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-500 uppercase tracking-wider mb-1">Financial Layer</p>
                  <p className="font-semibold text-foreground">The Debt</p>
                  <p className="text-xs text-muted-foreground mt-1">Live on-chain ledger: principal, interest, repayment</p>
                </div>
              </div>
              
              {/* Layer 3: Payment Stream */}
              <div className="relative">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Cashflow Layer</p>
                  <p className="font-semibold text-foreground">The Payment Stream</p>
                  <p className="text-xs text-muted-foreground mt-1">Tokenized USDC payments: borrower → lender</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2.5x Coverage Result */}
        <Card className="bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 border-green-500/20">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Rental Income */}
              <div className="text-center">
                <div className="w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-3 mx-auto">
                  <div>
                    <p className="text-2xl font-bold text-green-500">$18K</p>
                    <p className="text-xs text-green-500/70">/year</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Rental Income</p>
                <p className="text-xs text-muted-foreground">STR Pool Revenue</p>
              </div>

              {/* Ratio */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-green-500">2.5×</div>
                <p className="text-xs text-muted-foreground">Coverage</p>
              </div>

              {/* Debt Service */}
              <div className="text-center">
                <div className="w-28 h-28 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mb-3 mx-auto">
                  <div>
                    <p className="text-2xl font-bold text-destructive">$7K</p>
                    <p className="text-xs text-destructive/70">/year</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Debt Service</p>
                <p className="text-xs text-muted-foreground">Interest + Principal</p>
              </div>
            </div>

            {/* Result Line */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Investors get paid even if the house doesn't sell
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
