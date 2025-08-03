import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedInvestments from "@/components/FeaturedInvestments";
import MissedOpportunitySection from "@/components/MissedOpportunitySection";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";
import DemoModeToggle from "@/components/DemoModeToggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <DemoModeToggle />
      </div>
      <Hero />
      <FeaturedInvestments />
      <MissedOpportunitySection />
      <TwoWaysToInvest />
    </div>
  );
};

export default Index;
