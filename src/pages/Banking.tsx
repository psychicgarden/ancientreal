import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { StakingInterface } from "@/components/StakingInterface";

const Banking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 text-sm px-4 py-2">
            ⚡ Ultra-Liquid Banking
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Ancient Savings
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Earn 7.5-8.5% APY on your USDT with instant liquidity. 
            The perfect foundation for nomad savings and property down payments.
          </p>
        </div>
      </section>

      {/* Staking Interface */}
      <StakingInterface />
    </div>
  );
};

export default Banking;