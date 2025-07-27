import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import InvestmentOptions from "@/components/InvestmentOptions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProperties />
      <InvestmentOptions />
    </div>
  );
};

export default Index;
