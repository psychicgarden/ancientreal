// Smart Contract Configuration for Avalanche Fuji Testnet

export const CONTRACTS = {
  // Mazunte Property Mortgage Contract
  MAZUNTE_MORTGAGE: {
    address: "0x1234567890123456789012345678901234567890", // Placeholder - deploy real contract
    abi: [
      "function invest(uint256 amount) external payable",
      "function claimRentalIncome() external",
      "function getInvestorDetails(address investor) external view returns (uint256, uint256, uint256, uint256)",
      "function getPropertyStatus() external view returns (uint256, uint256, uint256, uint256, bool)",
      "function calculateMonthlyPayment(uint256 principal) external pure returns (uint256)",
      "event InvestmentMade(address indexed investor, uint256 amount, uint256 tokens)",
      "event RentalIncomeDistributed(uint256 amount, uint256 timestamp)"
    ]
  },

  // Village Citizenship Contract
  VILLAGE_CITIZENSHIP: {
    address: "0x2345678901234567890123456789012345678901", // Placeholder - deploy real contract
    abi: [
      "function becomeCitizen() external payable",
      "function hasCitizenship(address user) external view returns (bool)",
      "function getCitizenDetails(address citizen) external view returns (bool, uint256, uint256)",
      "function vote(uint256 proposalId, bool support) external",
      "event CitizenshipGranted(address indexed citizen, uint256 tokenId, uint256 level)"
    ]
  },
  
  // Rental Income Distribution Contract
  RENTAL_DISTRIBUTION: {
    address: "0x3456789012345678901234567890123456789012", // Placeholder - deploy real contract
    abi: [
      "function collectRental(string memory propertyId) external",
      "function claimIncome(string memory propertyId) external",
      "function calculateClaimableIncome(string memory propertyId, address investor) external view returns (uint256)",
      "function getPropertySummary(string memory propertyId) external view returns (uint256, uint256, uint256, bool)",
      "function getInvestorSummary(address investor) external view returns (uint256, uint256)",
      "event RentalCollected(string indexed propertyId, uint256 amount, uint256 timestamp)",
      "event IncomeDistributed(string indexed propertyId, address indexed investor, uint256 amount)"
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

// Mazunte Property Constants
export const MAZUNTE_PROPERTY = {
  VALUE: 150000, // $150,000 USD
  MIN_DOWN_PAYMENT: 30000, // $30,000 USD minimum
  MONTHLY_RENT: 2050, // $2,050 USD
  MORTGAGE_RATE: 8, // 8% APR
  MORTGAGE_TERM_YEARS: 10,
  MANAGEMENT_FEE: 10, // 10%
  MAINTENANCE_RESERVE: 5 // 5%
};

export const VILLAGE_CITIZENSHIP_FEE = "0.1"; // 0.1 AVAX
export const VILLAGE_MEMBERSHIP_FEE = "0.1"; // 0.1 AVAX (legacy support)
export const TOKEN_PRICE_USD = 1; // $1 per MAZUNTE token