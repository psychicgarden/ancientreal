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

// Realistic mortgage calculations with risk adjustments
import { computeMonthlyPaymentUSD } from '@/lib/finance';
import artDecoLoftMexico from "@/assets/art-deco-loft-mexico.jpg";

const MORTGAGE_PROPERTIES: MortgagePropertyData[] = [
  {
    id: "antalya-turkey-villa",
    name: "Antalya Coastal Villa",
    location: "Antalya, Turkey",
    image: antalyaTurkeyVilla,
    totalValue: 129000,
    downPayment: 25800, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(129000 - 25800, 750, 120), // 7.5% APR, 10 years
    monthlyRent: 1845, // Reduced by 10% for vacancy/maintenance reserves
    networkValue: Math.round(129000 * 1.35), // Conservative 35% appreciation over 10 years
    expectedReturn: 16.5, // Mid-range of 15-18%
    isAvailable: true,
  },
  {
    id: "koh-phangan-thailand-villa",
    name: "Koh Phangan Ocean Villa", 
    location: "Koh Phangan, Thailand",
    image: kohPhanganSeaBungalow,
    totalValue: 120000,
    downPayment: 24000, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(120000 - 24000, 750, 120), // 7.5% APR, 10 years
    monthlyRent: 1710, // Reduced by 10% for vacancy/maintenance reserves
    networkValue: Math.round(120000 * 1.30), // Conservative 30% appreciation over 10 years
    expectedReturn: 15.5, // Mid-range of 14-17%
    isAvailable: true,
  },
  {
    id: "corfu-greece-villa",
    name: "Corfu Coastal Villa",
    location: "Corfu, Greece",
    image: corfuGreekApartment,
    totalValue: 150000,
    downPayment: 30000, // 20% down
    monthlyPayment: computeMonthlyPaymentUSD(150000 - 30000, 750, 120), // 7.5% APR, 10 years
    monthlyRent: 2040, // Reduced by 10% for vacancy/maintenance reserves
    networkValue: Math.round(150000 * 1.40), // Conservative 40% appreciation over 10 years
    expectedReturn: 17.5, // Mid-range of 16-19%
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