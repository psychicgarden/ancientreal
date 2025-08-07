import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, PieChart, Home, Zap } from "lucide-react";
const TwoWaysToInvest = () => {
  return <section className="px-6 bg-muted/20 py-[40px]">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Two Ways to Invest
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you want to start small with fractional ownership or purchase immediately, we have the perfect investment solution for your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fractional Ownership */}
          

          {/* Instant Purchase */}
          
        </div>
      </div>
    </section>;
};
export default TwoWaysToInvest;