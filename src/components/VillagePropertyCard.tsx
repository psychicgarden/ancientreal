import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VillageProperty } from "@/lib/villagePropertiesCatalog";

interface VillagePropertyCardProps extends VillageProperty {}

const VillagePropertyCard = ({ 
  id, 
  name, 
  location, 
  image, 
  listPrice, 
  citizenshipCost, 
  monthlyNetworkYield, 
  tenYearVillageValue, 
  availability, 
  access 
}: VillagePropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  
  const fundingProgress = (availability.sold / availability.total) * 100;

  const handleInvestClick = () => {
    navigate('/investor-portal');
  };

  const handlePurchaseClick = () => {
    navigate('/banking');
  };

  return (
    <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 group">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Availability Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-background/90 text-foreground"
        >
          Availability: {availability.sold}/{availability.total} sold
        </Badge>
        
        {/* Heart Icon */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </button>
      </div>

      <CardContent className="p-6">
        {/* Property Info */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-muted-foreground">{location}</p>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Funding Progress</span>
            <span className="font-medium">{Math.round(fundingProgress)}%</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
        </div>

        {/* Network Investment Details */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Network Investment
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">List Price</span>
              <span className="font-semibold">${listPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Citizenship Cost</span>
              <div className="text-right">
                <div className="font-semibold">${citizenshipCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Founding member rate</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Network Yield</span>
              <span className="font-semibold text-primary">${monthlyNetworkYield}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">10-Year Village Value</span>
              <span className="font-semibold">${tenYearVillageValue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Access</span>
              <span className="font-semibold">{access}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleInvestClick}
            className="w-full"
            size="sm"
          >
            Invest Now
          </Button>
          <Button 
            onClick={handlePurchaseClick}
            variant="outline" 
            className="w-full"
            size="sm"
          >
            20% Down Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VillagePropertyCard;