import { MapPin } from "lucide-react";

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
  totalShares,
  availableShares,
}: OriginalPropertyCardProps) => {
  const soldShares = totalShares - availableShares;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-xs text-gray-600 font-medium">Availability</div>
            <div className="text-sm font-semibold text-gray-900">{soldShares}/15 sold</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(soldShares / 15) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default OriginalPropertyCard;