// Smart Contract Configuration for Avalanche Fuji Testnet

export const CONTRACTS = {
  // Village Membership Contract
  VILLAGE_MEMBERSHIP: {
    address: "0x1234567890123456789012345678901234567890", // Placeholder - deploy real contract
    abi: [
      "function joinVillage() external payable",
      "function isMember(address user) external view returns (bool)",
      "function membershipFee() external view returns (uint256)",
      "event VillageMembershipPurchased(address indexed user, uint256 fee)"
    ]
  },
  
  // MAZUNTE Token Contract
  MAZUNTE_TOKEN: {
    address: "0x2345678901234567890123456789012345678901", // Placeholder - deploy real contract
    abi: [
      "function purchase(uint256 amount) external payable",
      "function balanceOf(address owner) external view returns (uint256)",
      "function totalSupply() external view returns (uint256)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)"
    ]
  }
};

export const NETWORK_CONFIG = {
  chainId: '0xa869', // 43113 in hex (Avalanche Fuji)
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: [
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://avalanche-fuji-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche_fuji'
  ],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
};

export const VILLAGE_MEMBERSHIP_FEE = "0.1"; // 0.1 AVAX
export const TOKEN_PRICE_USD = 1; // $1 per MAZUNTE token