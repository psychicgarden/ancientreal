import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import sarahImage from "@/assets/testimonial-sarah.jpg";
import marcusImage from "@/assets/testimonial-marcus.jpg";
import elenaImage from "@/assets/testimonial-elena.jpg";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Marketing Director",
    location: "Previously renting in San Francisco",
    image: sarahImage,
    quote: "I never thought I could afford property abroad as a digital nomad. Through Boho Shares, I now own a beautiful villa in Tulum and earn 14% annual returns while having a home base for my travels.",
    investment: "$45,000",
    returns: "14.2% APY",
    timeframe: "18 months"
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Architect",
    location: "Remote from Portugal",
    image: marcusImage,
    quote: "The fractional ownership model is genius. I diversified across three properties in different countries and my portfolio has outperformed traditional investments by 6%. Plus, I get to stay in my properties when traveling.",
    investment: "$120,000",
    returns: "16.8% APY",
    timeframe: "2.5 years"
  },
  {
    name: "Elena Konstantinou",
    role: "Creative Director",
    location: "Nomad in Greece",
    image: elenaImage,
    quote: "Coming from a traditional real estate family, I was skeptical of tokenization. But the transparency, liquidity, and global access convinced me. I've already recommended it to my entire network.",
    investment: "$75,000",
    returns: "12.5% APY", 
    timeframe: "14 months"
  }
];

const InvestorTestimonials = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-accent-foreground mb-4">
            Real Stories from Our Investors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of digital nomads who've built wealth through global property ownership
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative bg-card/95 backdrop-blur-sm border-border/20 hover:shadow-luxury transition-all duration-300">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-gold mb-6 opacity-60" />
                
                {/* Testimonial Quote */}
                <blockquote className="text-card-foreground mb-8 leading-relaxed text-lg">
                  "{testimonial.quote}"
                </blockquote>

                {/* Investment Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-accent/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Invested</div>
                    <div className="font-semibold text-accent-foreground">{testimonial.investment}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Returns</div>
                    <div className="font-semibold text-gold">{testimonial.returns}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Period</div>
                    <div className="font-semibold text-accent-foreground">{testimonial.timeframe}</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-accent-foreground text-lg">{testimonial.name}</div>
                    <div className="text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join them? Start your global property investment journey today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InvestorTestimonials;