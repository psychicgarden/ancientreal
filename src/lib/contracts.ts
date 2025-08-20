// Smart Contract Configuration - Now using centralized config
import { CONTRACTS as CONTRACT_ADDRESSES, NETWORK_CONFIG as CHAIN_CONFIG } from '@/config/chain';

export const CONTRACTS = {
  MAZUNTE_MORTGAGE: {
    address: CONTRACT_ADDRESSES.MAZUNTE_MORTGAGE,
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

  SIMPLE_MORTGAGE: {
    address: CONTRACT_ADDRESSES.SIMPLE_MORTGAGE,
    abi: [
      "function purchaseProperty(uint256 _propertyValue, uint256 _downPayment, uint256 _interestRate, uint256 _termMonths) external",
      "function makePayment() external",
      "function getMortgageDetails(address _borrower) external view returns (tuple(uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 monthsPaid, uint256 nextPaymentDue, bool isActive, address borrower))",
      "function isPaymentOverdue(address _borrower) external view returns (bool)",
      "function calculateMonthlyPayment(uint256 _loanAmount, uint256 _interestRate, uint256 _termMonths) external pure returns (uint256)",
      "event MortgageCreated(address indexed borrower, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)",
      "event PaymentMade(address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)",
      "event MortgageCompleted(address indexed borrower, uint256 totalPaid)"
    ]
  },

  USDT: {
    address: CONTRACT_ADDRESSES.USDT,
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
    address: CONTRACT_ADDRESSES.VILLAGE_CITIZENSHIP,
    abi: [
      "function becomeCitizen() external payable",
      "function hasCitizenship(address user) external view returns (bool)",
      "event CitizenshipGranted(address indexed citizen, uint256 tokenId, uint256 level)"
    ]
  },

  SECONDARY_MARKETPLACE: {
    address: CONTRACT_ADDRESSES.SECONDARY_MARKETPLACE,
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

// Re-export network config from centralized location
export const NETWORK_CONFIG = CHAIN_CONFIG;

// Art Deco Loft Mazunte Property Constants
export const MAZUNTE_PROPERTY = {
  // Production values
  PRODUCTION: {
    VALUE: 129000, // $129,000 USD
    MIN_DOWN_PAYMENT: 29670, // $29,670 USD minimum
    MONTHLY_RENT: 1969, // $1,969 USD
    MORTGAGE_RATE: 8, // 8% APR
    MORTGAGE_TERM_YEARS: 10,
    MANAGEMENT_FEE: 10, // 10%
    MAINTENANCE_RESERVE: 5 // 5%
  },
  // Demo values (1000x reduced)
  DEMO: {
    VALUE: 129, // $129 USD
    MIN_DOWN_PAYMENT: 29.67, // $29.67 USD minimum
    MONTHLY_RENT: 1.969, // $1.969 USD
    MORTGAGE_RATE: 8, // 8% APR
    MORTGAGE_TERM_YEARS: 10,
    MANAGEMENT_FEE: 10, // 10%
    MAINTENANCE_RESERVE: 5 // 5%
  }
};

export const VILLAGE_CITIZENSHIP_FEE = "0.1"; // 0.1 AVAX
export const VILLAGE_MEMBERSHIP_FEE = "0.1"; // 0.1 AVAX (legacy support)
export const TOKEN_PRICE_USD = 1; // $1 per MAZUNTE token