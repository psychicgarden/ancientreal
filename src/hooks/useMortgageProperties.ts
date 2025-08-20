import { useState, useEffect } from 'react';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';
import antalyaTurkeyVilla from "@/assets/antalya-turkey-villa.jpg";
import kohPhanganSeaBungalow from "@/assets/koh-phangan-sea-bungalow.jpg";
import corfuGreekApartment from "@/assets/corfu-greek-apartment.jpg";

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
    id: "antalya-turkey-villa",
    name: "Antalya Coastal Villa",
    location: "Antalya, Turkey",
    image: antalyaTurkeyVilla,
    totalValue: 129000,
    downPayment: 25800, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(129000 - 25800, 800, 120), // Calculate dynamically
    monthlyRent: 2050,
    networkValue: 129000 * 2.81, // 181% appreciation
    expectedReturn: 19.1,
    isAvailable: true,
  },
  {
    id: "koh-phangan-thailand-villa",
    name: "Koh Phangan Ocean Villa", 
    location: "Koh Phangan, Thailand",
    image: kohPhanganSeaBungalow,
    totalValue: 120000,
    downPayment: 24000, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(120000 - 24000, 800, 120), // Calculate dynamically
    monthlyRent: 1900,
    networkValue: 120000 * 2.81, // 181% appreciation
    expectedReturn: 19.0,
    isAvailable: true,
  },
  {
    id: "corfu-greece-villa",
    name: "Corfu Coastal Villa",
    location: "Corfu, Greece",
    image: corfuGreekApartment,
    totalValue: 150000,
    downPayment: 30000, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(150000 - 30000, 800, 120), // Calculate dynamically
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