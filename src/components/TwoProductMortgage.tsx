import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Users, DollarSign, Shield, TrendingUp, Percent } from "lucide-react";

// Two-Product Mortgage Constants
export const BUYER_SEGMENTS = {
  CASH: 0.20,           // 20% cash buyers (whales)
  BTC_COLLATERAL: 0.50, // 50% BTC-collateralized mortgages (30% down)
  NOMAD: 0.30,          // 30% Nomad OCCR mortgages (30% down)
};

export const DOWN_PAYMENTS = {
  CASH: 1.00,           // 100% cash
  BTC_COLLATERAL: 0.30, // 30% down (borrow against BTC)
  NOMAD: 0.30,          // 30% down (uniform)
};

interface ProductCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  downPayment: string;
  financing: string;
  security: string;
  riskLevel: string;
  riskColor: string;
  targetBuyer: string;
  keyBenefit: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title, subtitle, icon, badge, badgeColor, downPayment, financing, security, riskLevel, riskColor, targetBuyer, keyBenefit
}) => (
  <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <Badge className={badgeColor}>{badge}</Badge>
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">Down Payment</p>
          <p className="font-semibold">{downPayment}</p>
        </div>
        <div className="p-2 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">Financing</p>
          <p className="font-semibold">{financing}</p>
        </div>
      </div>
      <div className="p-2 bg-muted/20 rounded-lg text-sm">
        <p className="text-xs text-muted-foreground mb-1">Security</p>
        <p>{security}</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Risk Level:</span>
        <Badge variant="outline" className={riskColor}>{riskLevel}</Badge>
      </div>
      <div className="p-2 bg-primary/5 rounded-lg border border-primary/20 text-sm">
        <p className="text-xs text-muted-foreground mb-1">Target Buyer</p>
        <p className="text-primary font-medium">{targetBuyer}</p>
      </div>
      <div className="text-xs text-muted-foreground italic">
        {keyBenefit}
      </div>
    </CardContent>
  </Card>
);

export const TwoProductMortgage: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-primary/50 text-primary">
            Two-Product Mortgage Protocol
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            80% Mortgage Origination from Day 1
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Two distinct mortgage products for different buyer segments. 
            <span className="text-primary font-semibold"> 50% BTC-Collateralized + 30% Nomad = 80% financed.</span>
          </p>
        </div>

        {/* Buyer Mix Visualization */}
        <Card className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border-primary/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Percent className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">Buyer Mix Distribution</span>
            </div>
            <div className="flex h-8 rounded-full overflow-hidden mb-4">
              <div className="bg-amber-500 flex-[20] flex items-center justify-center text-xs font-bold text-white">
                20% Cash
              </div>
              <div className="bg-orange-500 flex-[50] flex items-center justify-center text-xs font-bold text-white">
                50% BTC-Collateral
              </div>
              <div className="bg-purple-500 flex-[30] flex items-center justify-center text-xs font-bold text-white">
                30% Nomad
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-amber-500">Cash Whales</p>
                <p className="text-xs text-muted-foreground">Full payment, no mortgage</p>
              </div>
              <div>
                <p className="font-semibold text-orange-500">BTC Holders</p>
                <p className="text-xs text-muted-foreground">Borrow against crypto</p>
              </div>
              <div>
                <p className="font-semibold text-purple-500">Digital Nomads</p>
                <p className="text-xs text-muted-foreground">Build OCCR credit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProductCard
            title="Cash Purchase"
            subtitle="100% upfront payment"
            icon={<DollarSign className="h-8 w-8 text-amber-500" />}
            badge="20% of Buyers"
            badgeColor="bg-amber-500/20 text-amber-500 border-amber-500/30"
            downPayment="100%"
            financing="None"
            security="Full ownership at closing"
            riskLevel="Zero"
            riskColor="border-green-500 text-green-500"
            targetBuyer="Crypto Whales, HELOC Users"
            keyBenefit="Immediate capital return to DevCo"
          />
          
          <ProductCard
            title="BTC-Collateralized"
            subtitle="Borrow against Bitcoin"
            icon={<Bitcoin className="h-8 w-8 text-orange-500" />}
            badge="50% of Buyers"
            badgeColor="bg-orange-500/20 text-orange-500 border-orange-500/30"
            downPayment="30%"
            financing="70% financed"
            security="BTC collateral in custody (BitGo/Copper)"
            riskLevel="Low"
            riskColor="border-blue-500 text-blue-500"
            targetBuyer="HODLers who won't sell BTC"
            keyBenefit="Keep BTC upside, get real estate"
          />
          
          <ProductCard
            title="Nomad OCCR"
            subtitle="Build on-chain credit"
            icon={<Users className="h-8 w-8 text-purple-500" />}
            badge="30% of Buyers"
            badgeColor="bg-purple-500/20 text-purple-500 border-purple-500/30"
            downPayment="30%"
            financing="70% financed"
            security="Title retention + rental income coverage"
            riskLevel="Medium"
            riskColor="border-amber-500 text-amber-500"
            targetBuyer="Digital Nomads without FICO"
            keyBenefit="First borderless credit identity"
          />
        </div>

        {/* VC Bridge Lender Explanation */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">VC as Bridge Lender (Years 1-2)</h3>
                <p className="text-muted-foreground mb-4">
                  Until institutional FinCo liquidity arrives (Centrifuge, MakerDAO RWA), 
                  VC seed capital acts as bridge lender earning <span className="text-blue-400 font-semibold">10% APR</span> on the mortgage book.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                    <p className="font-semibold">$2.55M Mortgage Book</p>
                    <p className="text-xs text-muted-foreground">From 32 units (80% financed)</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <Percent className="h-4 w-4 text-primary mb-1" />
                    <p className="font-semibold">~$255K Annual Interest</p>
                    <p className="text-xs text-muted-foreground">10% APR on mortgage book</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <Shield className="h-4 w-4 text-amber-500 mb-1" />
                    <p className="font-semibold">Real Estate Secured</p>
                    <p className="text-xs text-muted-foreground">Title retention + Kill Switch</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TwoProductMortgage;
