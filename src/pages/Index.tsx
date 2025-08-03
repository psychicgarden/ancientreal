import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedInvestments from "@/components/FeaturedInvestments";
import MissedOpportunitySection from "@/components/MissedOpportunitySection";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedInvestments />
      <MissedOpportunitySection />
      <TwoWaysToInvest />
    </div>
  );
};

export default Index;
