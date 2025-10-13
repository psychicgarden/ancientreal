/**
 * AncientMortgage Contract ABI
 * Full business model: NFT custody, Year-10 appreciation, mortgage payments
 * Source: ancient-sc submodule
 */

export const ANCIENT_MORTGAGE_ABI = [
  // Purchase & Mortgage Management
  "function purchaseProperty(uint256 propertyId, uint256 downPaymentUSDC, uint256 termMonths, uint256 aprBps, bytes memory appraisalSignature) external returns (uint256)",
  "function makePayment(uint256 mortgageId, uint256 paymentAmountUSDC) external",
  "function getMortgageDetails(uint256 mortgageId) external view returns (tuple(uint256 id, address borrower, uint256 propertyId, uint256 purchasePrice, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 paymentsMade, uint256 lastPaymentTime, uint256 createdAt, bool isActive, uint256 totalInterestPaid))",
  
  // Year-10 Appreciation System
  "function triggerYear10Appraisal(uint256 mortgageId, uint256 appraisedValue, bytes memory signature) external",
  "function distributeAppreciationShares(uint256 mortgageId) external",
  "function getAppreciationDetails(uint256 mortgageId) external view returns (tuple(bool triggered, uint256 appraisedValue, uint256 appreciationAmount, uint256 buyerShare, uint256 lenderShare, uint256 platformShare, bool distributed))",
  
  // Refinancing
  "function requestRefi(uint256 mortgageId, uint256 newAprBps) external",
  
  // Foreclosure
  "function forecloseMortgage(uint256 mortgageId) external",
  "function getMissedPayments(uint256 mortgageId) external view returns (uint256)",
  
  // KYC & Accreditation
  "function setUserKYC(address user, bool status) external",
  "function setUserAccredited(address user, bool status) external",
  "function isKYCApproved(address user) external view returns (bool)",
  "function isAccreditedInvestor(address user) external view returns (bool)",
  
  // ERC721 NFT Functions (Property Custody)
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  
  // View Functions
  "function getMortgageStatus(uint256 mortgageId) external view returns (bool isActive, bool isOverdue, bool isCompleted)",
  "function calculateMonthlyPayment(uint256 loanAmount, uint256 aprBps, uint256 termMonths) external pure returns (uint256)",
  
  // Admin Functions
  "function pause() external",
  "function unpause() external",
  "function setTrustedAppraiser(address appraiser) external",
  
  // Events
  "event PropertyPurchased(uint256 indexed mortgageId, address indexed borrower, uint256 indexed propertyId, uint256 purchasePrice, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)",
  "event PaymentMade(uint256 indexed mortgageId, address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)",
  "event MortgageCompleted(uint256 indexed mortgageId, address indexed borrower, uint256 totalPaid)",
  "event Year10AppraisalTriggered(uint256 indexed mortgageId, uint256 appraisedValue, uint256 appreciationAmount)",
  "event AppreciationDistributed(uint256 indexed mortgageId, uint256 buyerShare, uint256 lenderShare, uint256 platformShare)",
  "event MortgageForeclosed(uint256 indexed mortgageId, address indexed borrower, uint256 missedPayments)",
  "event InterestSentToLendingPool(uint256 amount)"
] as const;

export const ANCIENT_MORTGAGE_ADDRESS = '0x0b92ece58415c0b1aba86c372f45ffc4d6046bed';
