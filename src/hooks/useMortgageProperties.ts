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

// Enhanced properties with database-driven calculations
import { computeMonthlyPaymentUSD } from '@/lib/finance';

const MORTGAGE_PROPERTIES: MortgagePropertyData[] = [
  {
    id: "mazunte-mexico-villa",
    name: "Mazunte Beach Villa",
    location: "Mazunte, Mexico",
    image: "/src/assets/villa-tulum.jpg",
    totalValue: 129000,
    downPayment: 25800, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(129000 - 25800, 800, 120), // Calculate dynamically
    monthlyRent: 2050,
    networkValue: 129000 * 2.81, // 181% appreciation
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
    monthlyPayment: computeMonthlyPaymentUSD(120000 - 24000, 800, 120), // Calculate dynamically
    monthlyRent: 1900,
    networkValue: 120000 * 2.81, // 181% appreciation
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
    monthlyPayment: computeMonthlyPaymentUSD(150000 - 30000, 800, 120), // Calculate dynamically: $1,456
    monthlyRent: 2266, // Correct rent from database
    networkValue: 150000 * 2.81, // 181% appreciation
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