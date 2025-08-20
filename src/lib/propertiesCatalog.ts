// Centralized property catalog to ensure consistency across the app
// NOTE: In the future, replace this with Supabase-backed data.

export interface CatalogProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  totalValue: number;
  sharePrice?: number; // optional for components that show shares
  totalShares?: number;
  availableShares?: number;
  expectedReturn?: number;
  monthlyRent?: number; // monthly rental income
}

// Import images from centralized assets
import { ASSETS } from '@/lib/assets';

export const PROPERTIES_CATALOG: CatalogProperty[] = [
  {
    id: "art-deco-loft-mexico",
    name: "Art Deco Loft",
    location: "Mazunte, Mexico", 
    image: ASSETS.ART_DECO_LOFT_MEXICO,
    totalValue: 129000,
    sharePrice: 129,
    totalShares: 1000,
    availableShares: 240,
    expectedReturn: 17.4, // Based on $1969 monthly rent
    monthlyRent: 1969, // Monthly rental income
  },
  {
    id: "bahia-brazil-villa",
    name: "Bahia Ocean Villa",
    location: "Bahia, Brazil",
    image: ASSETS.LUXURY_BOHO_BUNGALOW,
    totalValue: 130000,
    sharePrice: 130,
    totalShares: 1000,
    availableShares: 520,
    expectedReturn: 15.9, // Based on $1719 monthly rent
  },
  {
    id: "oceanview-loft-mallorca",
    name: "Oceanview Loft",
    location: "Mallorca, Spain",
    image: ASSETS.COASTAL_APARTMENT_ERICEIRA,
    totalValue: 150000,
    sharePrice: 150,
    totalShares: 1000,
    availableShares: 470,
    expectedReturn: 18.8, // Based on $2266 monthly rent
  },
];
