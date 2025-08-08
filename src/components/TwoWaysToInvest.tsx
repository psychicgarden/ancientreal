import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";

const TwoWaysToInvest = () => {
  return (
    <section id="two-ways-to-invest" className="container mx-auto py-12 md:py-16">
      <SectionHeader
        eyebrow="Investment paths"
        title="Two Ways to Invest"
        subtitle="Pick the route that fits your goals—diversify across projects or earn yield from a managed mortgage pool."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Property Projects</CardTitle>
            </div>
            <CardDescription>
              Invest in curated real estate developments with transparent milestones and projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Access vetted, high-potential developments</li>
              <li>Clear timelines and quarterly updates</li>
              <li>Diversify across locations and asset types</li>
            </ul>
            <Button asChild>
              <Link to="/developers">
                Explore projects
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Mortgage Pool</CardTitle>
            </div>
            <CardDescription>
              Earn yield from a diversified pool of collateralized mortgages with risk-managed exposure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Auto-distributed yield</li>
              <li>Liquidity options in secondary markets</li>
              <li>Backed by on-chain collateral management</li>
            </ul>
            <Button asChild>
              <Link to="/investor-portal">
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TwoWaysToInvest;
