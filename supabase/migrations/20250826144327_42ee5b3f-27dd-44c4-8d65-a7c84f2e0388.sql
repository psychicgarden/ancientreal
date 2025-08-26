-- Update the SIMPLE_MORTGAGE contract to point to enhanced contract
UPDATE contract_addresses 
SET address = '0x47391d3e495c295d2b0761930cfa556bad965aed',
    contract_name = 'ENHANCED_AVAX_MORTGAGE',
    updated_at = now(),
    abi_json = '{
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
WHERE contract_name = 'SIMPLE_MORTGAGE' AND network = 'fuji';

-- Ensure properties exist for the enhanced contract
INSERT INTO properties (id, name, address, price) VALUES 
(1, 'Art Deco Loft Oceanview', 'Mazunte, Mexico', 129000),
(2, 'Bahia Beach Bungalow', 'Bahia, Brazil', 95000), 
(3, 'Ericeira Coastal Villa', 'Ericeira, Portugal', 199000)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address, 
  price = EXCLUDED.price;