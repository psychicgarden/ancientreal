
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";

const TwoWaysToInvest = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Two ways to invest"
          subtitle="Pick the approach that fits your goals today—switch anytime."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Projects */}
          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-foreground" />
                <CardTitle>Property Projects</CardTitle>
              </div>
              <CardDescription>
                Back individual developments with higher projected returns.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Active opportunities available
              </span>
              <Button asChild>
                <Link to="/investor">
                  Browse Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mortgage Pool */}
          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-foreground" />
                <CardTitle>Mortgage Pool</CardTitle>
              </div>
              <CardDescription>
                Earn stable yield from collateralized lending.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Liquidity available
              </span>
              <Button variant="outline" asChild>
                <Link to="/banking">
                  Start Earning
                  <ArrowRight className="ml-2 h-4 w-4" />
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
