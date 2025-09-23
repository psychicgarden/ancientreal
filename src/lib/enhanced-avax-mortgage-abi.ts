// Enhanced AVAX Mortgage Contract ABI
// This contract handles AVAX payments, NFT ownership, and mortgage management

export const ENHANCED_AVAX_MORTGAGE_ABI = [
  // Property Management
  "function addProperty(string memory _name, string memory _location, string memory _imageUrl, uint256 _totalValue) external returns (uint256)",
  "function getProperty(uint256 _propertyId) external view returns (tuple(uint256 propertyId, string name, string location, string imageUrl, uint256 totalValue, bool isActive))",
  "function getTotalProperties() external view returns (uint256)",
  
  // Mortgage Operations
  "function purchaseProperty(uint256 _propertyId, uint256 _termMonths) external payable",
  "function makePayment() external payable", 
  "function getMortgageDetails(address _borrower) external view returns (tuple(uint256 propertyId, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 monthsPaid, uint256 nextPaymentDue, uint256 totalPaid, bool isActive, address borrower, uint256 createdAt))",
  "function isPaymentOverdue(address _borrower) external view returns (bool)",
  
  // Utility Functions
  "function calculateMonthlyPayment(uint256 _loanAmount, uint256 _interestRate, uint256 _termMonths) external pure returns (uint256)",
  "function getContractBalance() external view returns (uint256)",
  
  // Owner Functions
  "function withdrawFunds(uint256 _amount) external",
  "function emergencyPause(address _borrower) external",
  "function updatePropertyStatus(uint256 _propertyId, bool _isActive) external",
  
  // ERC721 Functions (NFT ownership while mortgage is active)
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  
  // Events
  "event PropertyAdded(uint256 indexed propertyId, string name, string location, uint256 totalValue)",
  "event MortgageCreated(address indexed borrower, uint256 indexed propertyId, uint256 indexed tokenId, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)",
  "event PaymentMade(address indexed borrower, uint256 indexed propertyId, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)",
  "event MortgageCompleted(address indexed borrower, uint256 indexed propertyId, uint256 totalPaid)",
  "event PlatformFeeCollected(address indexed payer, uint256 feeAmount)"
];

// Contract Configuration
export const ENHANCED_AVAX_MORTGAGE_CONFIG = {
  // Test conversion ratio: 0.00129 AVAX = $129,000 USD (100M:1 ratio for easy testing)
  AVAX_TO_USD_RATIO: 100000000, // 1 AVAX = $100M USD in test environment
  
  // Property Configuration
  PROPERTY_ID: 1, // Art Deco Loft Oceanview
  PROPERTY_VALUE_USD: 129000, // $129,000
  PROPERTY_VALUE_AVAX: "0.00129", // 0.00129 AVAX in test ratio
  
  // Mortgage Terms
  DOWN_PAYMENT_PERCENT: 20, // 20%
  PLATFORM_FEE_PERCENT: 3, // 3%
  APR_BPS: 800, // 8% APR
  TERM_MONTHS: 120, // 10 years
  
  // Calculated Values
  DOWN_PAYMENT_USD: 25800, // $25,800 (20% of $129K)
  PLATFORM_FEE_USD: 3870, // $3,870 (3% of $129K)
  TOTAL_PAYMENT_USD: 29670, // $29,670 (down payment + platform fee)
  
  // AVAX Equivalents (using test ratio)
  DOWN_PAYMENT_AVAX: "0.000258", // $25,800 in test AVAX
  PLATFORM_FEE_AVAX: "0.0000387", // $3,870 in test AVAX
  TOTAL_PAYMENT_AVAX: "0.0002967", // $29,670 in test AVAX
  
  // Monthly Payment Calculation
  LOAN_AMOUNT_USD: 103200, // $129K - $25.8K = $103,200
  MONTHLY_PAYMENT_USD: 1252, // Calculated using amortization formula
  MONTHLY_PAYMENT_AVAX: "0.00001252" // $1,252 in test AVAX
};

// Utility functions for conversion
export const convertUSDToAVAX = (usdAmount: number): string => {
  const avaxAmount = usdAmount / ENHANCED_AVAX_MORTGAGE_CONFIG.AVAX_TO_USD_RATIO;
  return avaxAmount.toFixed(18);
};

export const convertAVAXToUSD = (avaxAmount: string): number => {
  const avax = parseFloat(avaxAmount);
  return avax * ENHANCED_AVAX_MORTGAGE_CONFIG.AVAX_TO_USD_RATIO;
};

export const formatAVAXAmount = (avaxAmount: string): string => {
  const amount = parseFloat(avaxAmount);
  if (amount >= 1) {
    return amount.toFixed(4);
  } else if (amount >= 0.001) {
    return amount.toFixed(6);
  } else {
    return amount.toFixed(10);
  }
};