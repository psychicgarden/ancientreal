export const ANCIENT_MORTGAGE_ETH_ABI = [
  // Purchase with ETH payment
  "function purchaseProperty(uint256 propertyId, uint256 termMonths, uint256 aprBps, bytes memory appraisalSignature) external payable returns (uint256)",

  // Make payment with ETH
  "function makePayment(uint256 mortgageId) external payable",

  // View functions
  "function getMortgageDetails(uint256 mortgageId) external view returns (tuple(uint256 id, address borrower, uint256 propertyId, uint256 purchasePrice, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 paymentsMade, uint256 lastPaymentTime, uint256 createdAt, bool isActive, uint256 totalInterestPaid))",
  
  // Add missing getMortgage function
  "function getMortgage(uint256 mortgageId) external view returns (tuple(uint256 id, address borrower, uint256 propertyId, uint256 purchasePrice, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 paymentsMade, uint256 lastPaymentTime, uint256 createdAt, bool isActive, uint256 totalInterestPaid))",

  // Events
  "event PropertyPurchased(uint256 indexed mortgageId, address indexed borrower, uint256 indexed propertyId, uint256 purchasePrice, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)",
  "event PaymentMade(uint256 indexed mortgageId, address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)"
] as const;

// NEW ETH CONTRACT: Deployed AncientMortgageETH with proper payable functions
export const ANCIENT_MORTGAGE_ETH_ADDRESS = '0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc';
