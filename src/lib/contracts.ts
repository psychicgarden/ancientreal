// Smart Contract Configuration for Avalanche Fuji Testnet

export const CONTRACTS = {
  // Enhanced Mazunte Property Mortgage Contract with USDT
  MAZUNTE_MORTGAGE: {
    address: "0x1234567890123456789012345678901234567890", // Placeholder - deploy real contract
    abi: [
      // Core mortgage functions
      "function purchaseProperty(uint256 downPayment) external",
      "function makePayment() external",
      "function checkPaymentStatus(address buyer) external",
      
      // Owner/Admin functions
      "function setPropertyAppreciation(uint256 newValue) external",
      "function distributeAppreciation() external",
      
      // View functions
      "function getMortgageDetails(address buyer) external view returns (uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool)",
      "function getPropertyStatus() external view returns (uint256, uint256, uint256, uint256, bool)",
      "function getMortgageHolders() external view returns (address[])",
      "function isPaymentOverdue(address buyer) external view returns (bool)",
      "function calculateMonthlyPayment(uint256 principal) external pure returns (uint256)",
      
      // Events
      "event MortgageCreated(address indexed buyer, uint256 downPayment, uint256 monthlyPayment)",
      "event MortgagePaymentMade(address indexed buyer, uint256 amount, uint256 remainingBalance)",
      "event MortgageCompleted(address indexed buyer, uint256 totalPaid)",
      "event MortgageForeclosed(address indexed buyer, uint256 missedPayments)",
      "event PropertyDeedMinted(address indexed owner, uint256 tokenId)",
      "event AppreciationDistributed(uint256 totalAppreciation, uint256 buyerShare, uint256 ancientShare, uint256 lenderShare)"
    ]
  },

  // USDT Token Contract (Fuji Testnet)
  USDT: {
    address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", // Fuji USDT
    abi: [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function decimals() external view returns (uint8)"
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
  // Production values
  PRODUCTION: {
    VALUE: 150000, // $150,000 USD
    MIN_DOWN_PAYMENT: 30000, // $30,000 USD minimum
    MONTHLY_RENT: 2050, // $2,050 USD
    MORTGAGE_RATE: 8, // 8% APR
    MORTGAGE_TERM_YEARS: 10,
    MANAGEMENT_FEE: 10, // 10%
    MAINTENANCE_RESERVE: 5 // 5%
  },
  // Demo values (1000x reduced)
  DEMO: {
    VALUE: 150, // $150 USD
    MIN_DOWN_PAYMENT: 30, // $30 USD minimum
    MONTHLY_RENT: 2.05, // $2.05 USD
    MORTGAGE_RATE: 8, // 8% APR
    MORTGAGE_TERM_YEARS: 10,
    MANAGEMENT_FEE: 10, // 10%
    MAINTENANCE_RESERVE: 5 // 5%
  }
};

export const VILLAGE_CITIZENSHIP_FEE = "0.1"; // 0.1 AVAX
export const VILLAGE_MEMBERSHIP_FEE = "0.1"; // 0.1 AVAX (legacy support)
export const TOKEN_PRICE_USD = 1; // $1 per MAZUNTE token