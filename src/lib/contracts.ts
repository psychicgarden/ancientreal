// Smart Contract Configuration for Avalanche Fuji Testnet

export const CONTRACTS = {
  MAZUNTE_MORTGAGE: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Deployed on Fuji testnet
    abi: [
      // Core functions
      "function purchaseProperty(uint256 downPayment) external",
      "function makePayment() external",
      "function cancelDuringCoolingOff() external",
      "function confirmMortgageActivation() external",
      // Views matching contract
      "function getMortgageDetails(address buyer) external view returns (uint256 downPayment, uint256 principalAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 nextPaymentDue, uint256 missedPayments, uint256 totalPaid, uint256 totalLateFees, uint256 mortgageId, bool isActive, bool isForeclosed, bool isCompleted, bool coolingOffActive)",
      "function getPropertyStatus() external view returns (uint256 totalValue, uint256 currentValue, uint256 totalDownPayments, uint256 appreciationValue, uint256 totalRentalIncomeGenerated, bool fullyOwned)",
      "function getPaymentSchedule(address buyer) external view returns (tuple(uint256 paymentNumber, uint256 principalAmount, uint256 interestAmount, uint256 remainingBalance, uint256 dueDate, bool isPaid)[])",
      "function isPaymentOverdue(address buyer) external view returns (bool)",
      // ERC1155 minimal (for balance queries if needed)
      "function balanceOf(address account, uint256 id) external view returns (uint256)",
      // Events
      "event MortgageCreated(address indexed buyer, uint256 indexed mortgageId, uint256 downPayment, uint256 monthlyPayment)",
      "event PaymentMade(address indexed buyer, uint256 amount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)",
      "event MortgageCompleted(address indexed buyer, uint256 totalPaid)"
    ]
  },

  USDT: {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Deployed on Fuji testnet
    abi: [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function decimals() external view returns (uint8)"
    ]
  },

  VILLAGE_CITIZENSHIP: {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Deployed on Fuji testnet
    abi: [
      "function becomeCitizen() external payable",
      "function hasCitizenship(address user) external view returns (bool)",
      "event CitizenshipGranted(address indexed citizen, uint256 tokenId, uint256 level)"
    ]
  },

  SECONDARY_MARKETPLACE: {
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", // Deployed on Fuji testnet
    abi: [
      // Pools
      "function createPool(address propertyToken, uint256 tokenId, address baseToken, uint256 feeRate, uint256 priceImpactThreshold) external",
      "function addLiquidity(uint256 poolId, uint256 propertyAmount, uint256 baseAmount) external",
      "function removeLiquidity(uint256 poolId, uint256 lpTokens) external",
      // AMM Swaps
      "function swapTokens(uint256 poolId, bool propertyToBase, uint256 amountIn, uint256 minAmountOut) external",
      // Orders
      "function createLimitOrder(uint256 poolId, bool isBuyOrder, uint256 amount, uint256 price, uint256 expiry) external",
      "function fillLimitOrder(uint256 orderId, uint256 fillAmount) external",
      "function cancelLimitOrder(uint256 orderId) external",
      // Views
      "function getCurrentPrice(uint256 poolId) external view returns (uint256)",
      "function getUserLPTokens(uint256 poolId, address user) external view returns (uint256)"
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