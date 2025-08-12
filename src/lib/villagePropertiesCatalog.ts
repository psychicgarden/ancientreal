// Village Citizenship Properties - separate from fractional investment properties
// These are the properties shown on the landing page with village citizenship model

export interface VillageProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  listPrice: number;
  citizenshipCost: number;
  monthlyNetworkYield: number;
  tenYearVillageValue: number;
  availability: {
    sold: number;
    total: number;
  };
  access: string;
}

// Import images for village properties
import villaBahia from "@/assets/villa-bahia.jpg";
import villaEriceira from "@/assets/villa-ericeira-portugal.jpg";
import artDecoLoft from "@/assets/art-deco-loft-mexico.jpg";

export const VILLAGE_PROPERTIES_CATALOG: VillageProperty[] = [
  {
    id: "bahia-ocean-villa-village",
    name: "Bahia Ocean Villa",
    location: "Bahia, Brazil",
    image: villaBahia,
    listPrice: 130000,
    citizenshipCost: 26000, // Founding member rate (20% down)
    monthlyNetworkYield: 538,
    tenYearVillageValue: 195000,
    availability: {
      sold: 8,
      total: 15
    },
    access: "Entire Ancient"
  },
  {
    id: "oceanview-loft-village",
    name: "Oceanview Loft",
    location: "Ericeira, Portugal", 
    image: villaEriceira,
    listPrice: 150000,
    citizenshipCost: 30000, // Founding member rate (20% down)
    monthlyNetworkYield: 865,
    tenYearVillageValue: 225000,
    availability: {
      sold: 12,
      total: 15
    },
    access: "Entire Ancient"
  },
  {
    id: "art-deco-loft-village",
    name: "Art Deco Loft",
    location: "Mexico City, Mexico",
    image: artDecoLoft,
    listPrice: 129000,
    citizenshipCost: 25800, // Founding member rate (20% down)
    monthlyNetworkYield: 798,
    tenYearVillageValue: 193500,
    availability: {
      sold: 5,
      total: 15
    },
    access: "Entire Ancient"
  }
];