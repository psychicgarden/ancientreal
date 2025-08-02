import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedInvestments from "@/components/FeaturedInvestments";
import WhyAncient from "@/components/WhyAncient";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedInvestments />
      <WhyAncient />
      <TwoWaysToInvest />
    </div>
  );
};

export default Index;
