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
}

// Import images via aliases to keep one source of truth
import villaTulum from "@/assets/villa-tulum.jpg";
import beachChalet from "@/assets/beach-chalet.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";

export const PROPERTIES_CATALOG: CatalogProperty[] = [
  {
    id: "art-deco-loft-mexico",
    name: "Art Deco Loft",
    location: "Mazunte, Mexico",
    image: villaTulum,
    totalValue: 129000,
    sharePrice: 129,
    totalShares: 1000,
    availableShares: 240,
    expectedReturn: 17.4, // Based on $1969 monthly rent
  },
  {
    id: "bahia-brazil-villa",
    name: "Bahia Ocean Villa",
    location: "Bahia, Brazil",
    image: beachChalet,
    totalValue: 130000,
    sharePrice: 130,
    totalShares: 1000,
    availableShares: 520,
    expectedReturn: 15.9, // Based on $1719 monthly rent
  },
  {
    id: "oceanview-loft-ericeira",
    name: "Oceanview Loft",
    location: "Ericeira, Portugal",
    image: villaEriceira,
    totalValue: 150000,
    sharePrice: 150,
    totalShares: 1000,
    availableShares: 470,
    expectedReturn: 18.8, // Based on $2266 monthly rent
  },
];
