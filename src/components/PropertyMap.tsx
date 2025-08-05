import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter } from "lucide-react";

interface PropertyLocation {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  price: number;
  type: 'full-property' | 'fractional';
  originalPrice?: number;
  speculationPrice?: number;
  minInvestment?: number;
  roi?: number;
}

// Mock property data with real locations
const mockProperties: PropertyLocation[] = [
  {
    id: '1',
    name: 'Mazunte Beach House',
    location: 'Mazunte, Mexico',
    coordinates: [-96.5833, 15.6667],
    price: 150000,
    type: 'full-property',
    roi: 15.5
  },
  {
    id: '2', 
    name: 'Villa Corfu Dreams',
    location: 'Corfu, Greece',
    coordinates: [19.9207, 39.6243],
    price: 89000,
    type: 'fractional',
    originalPrice: 200000,
    speculationPrice: 280000,
    minInvestment: 50,
    roi: 18.2
  },
  {
    id: '3',
    name: 'Bali Jungle Retreat', 
    location: 'Ubud, Bali',
    coordinates: [115.2624, -8.5069],
    price: 75000,
    type: 'full-property',
    roi: 22.1
  },
  {
    id: '4',
    name: 'Tulum Eco Villa',
    location: 'Tulum, Mexico', 
    coordinates: [-87.4650, 20.2114],
    price: 120000,
    type: 'fractional',
    originalPrice: 180000,
    speculationPrice: 250000,
    minInvestment: 100,
    roi: 19.8
  }
];

interface PropertyMapProps {
  onPropertySelect?: (property: PropertyLocation) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ onPropertySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation | null>(null);
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [typeFilter, setTypeFilter] = useState<'all' | 'full-property' | 'fractional'>('all');
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  // Filter properties based on criteria
  useEffect(() => {
    let filtered = mockProperties;

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    // Price filter
    if (priceFilter.min || priceFilter.max) {
      filtered = filtered.filter(p => {
        const price = p.type === 'fractional' ? (p.minInvestment || 0) : p.price;
        const min = priceFilter.min ? parseInt(priceFilter.min) : 0;
        const max = priceFilter.max ? parseInt(priceFilter.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredProperties(filtered);
  }, [priceFilter, typeFilter]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, using a placeholder token
    // In production, this should come from environment variables
    const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('placeholder')) {
      // Fallback UI when no Mapbox token
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-20, 20],
      zoom: 2,
      projection: 'globe' as any
    });

    // Add markers for each property
    filteredProperties.forEach(property => {
      const markerElement = document.createElement('div');
      markerElement.className = `property-marker ${property.type}`;
      markerElement.innerHTML = `
        <div class="marker-content">
          <div class="marker-icon">
            ${property.type === 'fractional' ? '🏠' : '🏡'}
          </div>
          <div class="marker-price">
            ${property.type === 'fractional' 
              ? `$${property.minInvestment}+` 
              : `$${(property.price / 1000).toFixed(0)}k`
            }
          </div>
        </div>
      `;

      markerElement.addEventListener('click', () => {
        setSelectedProperty(property);
        onPropertySelect?.(property);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(property.coordinates)
        .addTo(map.current!);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [filteredProperties, onPropertySelect]);

  const resetFilters = () => {
    setPriceFilter({ min: '', max: '' });
    setTypeFilter('all');
  };

  if (!mapContainer.current) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map View Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            To enable the interactive property map, please configure your Mapbox token.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Sign up at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a></p>
            <p>2. Get your public token from the dashboard</p>
            <p>3. Add it to your environment configuration</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All Properties
            </Button>
            <Button
              variant={typeFilter === 'full-property' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('full-property')}
            >
              Full Properties
            </Button>
            <Button
              variant={typeFilter === 'fractional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('fractional')}
            >
              Fractional Shares
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm">Price Range:</span>
            <Input
              placeholder="Min"
              value={priceFilter.min}
              onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
              className="w-20"
              type="number"
            />
            <span>-</span>
            <Input
              placeholder="Max"
              value={priceFilter.max}
              onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
              className="w-20"
              type="number"
            />
          </div>

          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapContainer} className="h-[500px] rounded-lg" />
        
        {/* Property Details Popup */}
        {selectedProperty && (
          <Card className="absolute top-4 left-4 w-80 p-4 bg-background/95 backdrop-blur">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{selectedProperty.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                </div>
                <Badge variant={selectedProperty.type === 'fractional' ? 'secondary' : 'default'}>
                  {selectedProperty.type === 'fractional' ? 'Fractional' : 'Full Property'}
                </Badge>
              </div>

              {selectedProperty.type === 'fractional' ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Original Price:</span>
                    <span className="font-medium">${selectedProperty.originalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Speculation:</span>
                    <span className="font-medium text-primary">${selectedProperty.speculationPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Min Investment:</span>
                    <span className="font-medium">${selectedProperty.minInvestment}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-sm">Full Property Price:</span>
                  <span className="font-medium">${selectedProperty.price.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm">Projected ROI:</span>
                <Badge variant="outline">{selectedProperty.roi}% APY</Badge>
              </div>

              <Button className="w-full" onClick={() => onPropertySelect?.(selectedProperty)}>
                {selectedProperty.type === 'fractional' ? 'Invest Now' : 'Get Mortgage'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <span>Full Property (Mortgage Available)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded-full"></div>
            <span>Fractional Shares (From $50)</span>
          </div>
        </div>
      </Card>

      <style>{`
        .property-marker {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .property-marker:hover {
          transform: scale(1.1);
        }
        
        .marker-content {
          background: white;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 2px solid hsl(var(--primary));
          min-width: 80px;
          text-align: center;
        }
        
        .fractional .marker-content {
          border-color: hsl(var(--secondary));
        }
        
        .marker-icon {
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .marker-price {
          font-size: 12px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;