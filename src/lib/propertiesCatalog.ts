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
    id: "mazunte-mexico-villa",
    name: "Mazunte Beach Villa",
    location: "Mazunte, Mexico",
    image: villaTulum,
    totalValue: 129000,
    sharePrice: 129,
    totalShares: 1000,
    availableShares: 240,
    expectedReturn: 17.4, // Based on $748 monthly cash flow
  },
  {
    id: "bahia-brazil-villa",
    name: "Bahia Ocean Villa",
    location: "Bahia, Brazil",
    image: beachChalet,
    totalValue: 120000,
    sharePrice: 120,
    totalShares: 1000,
    availableShares: 520,
    expectedReturn: 15.9, // Based on $635 monthly cash flow
  },
  {
    id: "ericeira-portugal-villa",
    name: "Ericeira Coastal Villa",
    location: "Ericeira, Portugal",
    image: villaEriceira,
    totalValue: 150000,
    sharePrice: 150,
    totalShares: 1000,
    availableShares: 470,
    expectedReturn: 18.8, // Based on $2,350 monthly cash flow
  },
];
