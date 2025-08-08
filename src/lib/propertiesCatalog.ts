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
import villaCorfu from "@/assets/villa-corfu-greece.jpg";

export const PROPERTIES_CATALOG: CatalogProperty[] = [
  {
    id: "mazunte-art-deco-loft",
    name: "Art Deco Loft",
    location: "Mazunte, Mexico",
    image: villaTulum,
    totalValue: 150000,
    sharePrice: 150,
    totalShares: 1000,
    availableShares: 240,
    expectedReturn: 16.8,
  },
  {
    id: "bahia-ocean-villa",
    name: "Ocean Villa Retreat",
    location: "Bahia, Brazil",
    image: beachChalet,
    totalValue: 130000,
    sharePrice: 130,
    totalShares: 1000,
    availableShares: 520,
    expectedReturn: 15.2,
  },
  {
    id: "corfu-mediterranean-villa",
    name: "Mediterranean Villa",
    location: "Corfu, Greece",
    image: villaCorfu,
    totalValue: 280000,
    sharePrice: 280,
    totalShares: 1000,
    availableShares: 470,
    expectedReturn: 17.8,
  },
];
