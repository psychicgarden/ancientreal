import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
const TwoWaysToInvest = () => {
  return (
    <section className="bg-gradient-to-br from-background to-muted/10 py-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Two Ways to Invest"
          subtitle="Choose between ultra-liquid yield or hands-on property projects—both within our boho luxury ecosystem."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Yield Pool */}
          <Card className="bg-card/50 backdrop-blur border border-border/50 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Ancient Savings Yield Pool</CardTitle>
              <CardDescription>7.5%–8.5% APY, instant liquidity</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Backed by first‑lien mortgages</div>
              <Button asChild>
                <Link to="/banking">
                  Start Earning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Development Projects */}
          <Card className="bg-card/50 backdrop-blur border border-border/50 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle>Property Development Projects</CardTitle>
              <CardDescription>12%–15% target return, 6–18 months</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Fractional, diversified, curated</div>
              <Button variant="outline" asChild>
                <Link to="/investor">
                  Browse Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default TwoWaysToInvest;
