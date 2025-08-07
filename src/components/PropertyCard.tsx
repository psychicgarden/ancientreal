import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { MortgagePaymentModal } from "@/components/MortgagePaymentModal";
import { PropertyAnalyticsModal } from "@/components/PropertyAnalyticsModal";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  status: "owned" | "mortgaged" | "hosted" | "available" | "pending";
  value: number;
  equity?: number;
  monthlyIncome?: number;
  occupancyRate?: number;
  isPending?: boolean;
  failureReason?: string | null;
  onManage?: () => void;
  onListForTravel?: () => void;
  onMakePayment?: () => void;
  onViewAnalytics?: () => void;
}

export const PropertyCard = ({
  id,
  image,
  title,
  location,
  status,
  value,
  equity,
  monthlyIncome,
  occupancyRate,
  isPending,
  failureReason,
  onManage,
  onListForTravel,
  onMakePayment,
  onViewAnalytics,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case "owned":
        return <Badge className="bg-green-600/95 text-white font-semibold border border-green-400/50 shadow-lg backdrop-blur-sm px-3 py-1">Owned</Badge>;
      case "mortgaged":
        return <Badge className="bg-blue-600/95 text-white font-semibold border border-blue-400/50 shadow-lg backdrop-blur-sm px-3 py-1">Mortgaged</Badge>;
      case "hosted":
        return <Badge className="bg-purple-600/95 text-white font-semibold border border-purple-400/50 shadow-lg backdrop-blur-sm px-3 py-1">Hosting</Badge>;
      case "available":
        return <Badge className="bg-orange-600/95 text-white font-semibold border border-orange-400/50 shadow-lg backdrop-blur-sm px-3 py-1">Available</Badge>;
      case "pending":
        return <Badge className="bg-red-600/95 text-white font-semibold border border-red-400/50 shadow-lg backdrop-blur-sm px-3 py-1">Purchase Failed</Badge>;
      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch (status) {
      case "mortgaged":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsPaymentModalOpen(true)} className="flex-1">
              Make Payment
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAnalyticsModalOpen(true)}>
              Analytics
            </Button>
          </div>
        );
      case "owned":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={onListForTravel} className="flex-1">
              List for Travel
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAnalyticsModalOpen(true)}>
              Analytics
            </Button>
          </div>
        );
      case "hosted":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={onManage} className="flex-1">
              Manage Bookings
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAnalyticsModalOpen(true)}>
              Analytics
            </Button>
          </div>
        );
      case "available":
        return (
          <Button size="sm" onClick={onListForTravel} className="w-full">
            Start Hosting
          </Button>
        );
      case "pending":
        return (
          <div className="space-y-2">
            <p className="text-xs text-red-600 font-medium">
              {failureReason || "Purchase failed - blockchain issue"}
            </p>
            <Button size="sm" variant="destructive" className="w-full" disabled>
              Enable Demo Mode to Retry
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-3 left-3">
          {getStatusBadge()}
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Property Value</div>
              <div className="font-semibold">${value.toLocaleString()}</div>
            </div>
            {equity && (
              <div>
                <div className="text-muted-foreground">Your Equity</div>
                <div className="font-semibold text-green-600">${equity.toLocaleString()}</div>
              </div>
            )}
            {monthlyIncome && (
              <div>
                <div className="text-muted-foreground flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Monthly Income
                </div>
                <div className="font-semibold text-blue-600">${monthlyIncome.toLocaleString()}</div>
              </div>
            )}
            {occupancyRate && (
              <div>
                <div className="text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Occupancy
                </div>
                <div className="font-semibold">{occupancyRate}%</div>
              </div>
            )}
          </div>

          <div className="pt-2">
            {getActionButtons()}
          </div>
        </div>
      </CardContent>

      <MortgagePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        property={{
          id,
          title,
          location,
          image,
          value,
          monthlyPayment: 2500, // Default value for PropertyCard usage
          remainingBalance: 150000 // Default value for PropertyCard usage
        }}
      />

      <PropertyAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        property={{
          id,
          title,
          location,
          value,
          equity,
          monthlyIncome,
          occupancyRate
        }}
      />
    </Card>
  );
};