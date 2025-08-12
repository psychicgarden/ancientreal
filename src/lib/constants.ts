// Property ID mapping for consistent database lookups
// Maps UI catalog IDs to database property_id integers
export const PROPERTY_ID_MAP: Record<string, number> = {
  "mazunte-mexico-villa": 1,
  "bahia-brazil-villa": 2,
  "ericeira-portugal-villa": 3,
};

// Reverse mapping for convenience
export const PROPERTY_ID_REVERSE_MAP: Record<number, string> = {
  1: "mazunte-mexico-villa",
  2: "bahia-brazil-villa", 
  3: "ericeira-portugal-villa",
};