import { Button } from "@/components/ui/button";
import { MapPin, Users, TrendingUp, Heart } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number;
  sharePrice: number;
  totalShares: number;
  availableShares: number;
  expectedReturn: number;
  type: string;
}

const PropertyCard = ({
  image,
  title,
  location,
  price,
  sharePrice,
  totalShares,
  availableShares,
  expectedReturn,
  type,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const percentageSold = ((totalShares - availableShares) / totalShares) * 100;

  return (
    <div className="group bg-gradient-card rounded-2xl shadow-card hover:shadow-luxury transition-all duration-500 overflow-hidden border border-border/50">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          {type}
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-foreground/60"
            }`}
          />
        </button>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Funding Progress</span>
              <span className="text-sm font-bold text-primary">
                {percentageSold.toFixed(0)}% Sold
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentageSold}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-2xl font-bold text-foreground">
              ${price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              ${sharePrice.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Per Share</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span>{availableShares} shares left</span>
          </div>
          <div className="flex items-center text-accent">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-semibold">{expectedReturn}% expected return</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1" size="lg">
            Invest Now
          </Button>
          <Button variant="outline" size="lg">
            20% Down Purchase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;