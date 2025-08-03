import { Button } from "@/components/ui/button";
import { MapPin, Users, TrendingUp, Heart } from "lucide-react";
import { useState } from "react";

interface OriginalPropertyCardProps {
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

const OriginalPropertyCard = ({
  image,
  title,
  location,
  price,
  sharePrice,
  totalShares,
  availableShares,
  expectedReturn,
  type,
}: OriginalPropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const percentageSold = ((totalShares - availableShares) / totalShares) * 100;

  return (
    <div className="group bg-gradient-card rounded-2xl shadow-card hover:shadow-luxury transition-all duration-500 overflow-hidden border border-border/50">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full border border-border/50">
            {type}
          </span>
        </div>
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Funding Progress */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-white text-sm">
              <span>Funding Progress</span>
              <span>{percentageSold.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-gradient-primary h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${percentageSold}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Location */}
        <div>
          <h3 className="text-xl font-semibold text-foreground leading-tight mb-2">
            {title}
          </h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold text-foreground">
              ${price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Per Share</p>
            <p className="text-lg font-bold text-foreground">
              ${sharePrice}
            </p>
          </div>
        </div>

        {/* Shares Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{availableShares} of {totalShares} shares available</span>
          </div>
        </div>

        {/* Expected Return */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium text-foreground">Expected Annual Return</span>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-bold">{expectedReturn}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="w-full" size="lg">
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

export default OriginalPropertyCard;