-- Clean up duplicate contracts and ensure SIMPLE_MORTGAGE points to enhanced contract
-- First remove the duplicate SimpleAvaxMortgage entry 
DELETE FROM contract_addresses 
WHERE contract_name = 'SimpleAvaxMortgage' AND network = 'fuji';

-- Ensure we have SIMPLE_MORTGAGE pointing to the enhanced contract
INSERT INTO contract_addresses (contract_name, address, network, deployment_status, abi_json)
VALUES (
  'SIMPLE_MORTGAGE',
  '0x47391d3e495c295d2b0761930cfa556bad965aed', 
  'fuji',
  'deployed',
  '{
    "functions": [
      "function purchaseProperty(uint256 _propertyId, uint256 _termMonths) external payable",
      "function makePayment() external payable", 
      "function addProperty(string memory _name, string memory _location, string memory _imageUrl, uint256 _totalValue) external returns (uint256)",
      "function getProperty(uint256 _propertyId) external view returns (tuple(uint256 propertyId, string name, string location, string imageUrl, uint256 totalValue, bool isActive))",
      "function getMortgageDetails(address _borrower) external view returns (tuple(uint256 propertyId, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment, uint256 remainingBalance, uint256 interestRate, uint256 termMonths, uint256 monthsPaid, uint256 nextPaymentDue, uint256 totalPaid, bool isActive, address borrower, uint256 createdAt))",
      "function isPaymentOverdue(address _borrower) external view returns (bool)",
      "function calculateMonthlyPayment(uint256 _loanAmount, uint256 _interestRate, uint256 _termMonths) external pure returns (uint256)"
    ],
    "events": [
      "event PropertyAdded(uint256 indexed propertyId, string name, string location, uint256 totalValue)",
      "event MortgageCreated(address indexed borrower, uint256 indexed propertyId, uint256 indexed tokenId, uint256 propertyValue, uint256 downPayment, uint256 loanAmount, uint256 monthlyPayment)",
      "event PaymentMade(address indexed borrower, uint256 indexed propertyId, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)",
      "event MortgageCompleted(address indexed borrower, uint256 indexed propertyId, uint256 totalPaid)",
      "event PlatformFeeCollected(address indexed payer, uint256 feeAmount)"
    ]
  }'::jsonb
) 
ON CONFLICT (contract_name, network) DO UPDATE SET
  address = EXCLUDED.address,
  abi_json = EXCLUDED.abi_json,
  updated_at = now();