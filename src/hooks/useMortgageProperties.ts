import { useState, useEffect } from 'react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

export interface MortgagePropertyData {
  id: string;
  name: string;
  location: string;
  image: string;
  totalValue: number;
  downPayment: number;
  monthlyPayment: number;
  monthlyRent: number;
  networkValue: number;
  expectedReturn: number;
  isAvailable: boolean;
}

// Enhanced properties with mortgage-specific calculations
const MORTGAGE_PROPERTIES: MortgagePropertyData[] = [
  {
    id: "mazunte-mexico-villa",
    name: "Mazunte Beach Villa",
    location: "Mazunte, Mexico",
    image: "/src/assets/villa-tulum.jpg",
    totalValue: 129000,
    downPayment: 25800, // 20% down
    monthlyPayment: 1456, // 8% APR, 10-year term
    monthlyRent: 2050,
    networkValue: 401490, // 181% appreciation over 10 years
    expectedReturn: 19.1,
    isAvailable: true,
  },
  {
    id: "bahia-brazil-villa",
    name: "Bahia Ocean Villa", 
    location: "Bahia, Brazil",
    image: "/src/assets/beach-chalet.jpg",
    totalValue: 120000,
    downPayment: 24000, // 20% down
    monthlyPayment: 1355, // 8% APR, 10-year term
    monthlyRent: 1900,
    networkValue: 373200, // 181% appreciation over 10 years
    expectedReturn: 19.0,
    isAvailable: true,
  },
  {
    id: "ericeira-portugal-villa",
    name: "Ericeira Coastal Villa",
    location: "Ericeira, Portugal", 
    image: "/src/assets/villa-ericeira-portugal.jpg",
    totalValue: 150000,
    downPayment: 30000, // 20% down
    monthlyPayment: 1809, // 8% APR, 10-year term
    monthlyRent: 2350,
    networkValue: 467000, // 181% appreciation over 10 years
    expectedReturn: 18.9,
    isAvailable: true,
  },
];

export const useMortgageProperties = () => {
  const [properties, setProperties] = useState<MortgagePropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay for consistency
    const timer = setTimeout(() => {
      setProperties(MORTGAGE_PROPERTIES);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    properties,
    loading,
    error: null,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setProperties(MORTGAGE_PROPERTIES);
        setLoading(false);
      }, 100);
    }
  };
};