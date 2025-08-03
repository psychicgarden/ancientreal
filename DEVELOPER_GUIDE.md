# Developer Guide - Mazunte Real Estate Platform

## 🎯 For Technical Investors & Developers

This guide provides comprehensive technical details for code review, testing, and validation of the Mazunte platform's blockchain infrastructure.

## 🔧 Local Development Setup

### System Requirements
- Node.js 18+ 
- npm 8+
- Git
- MetaMask browser extension
- Modern browser (Chrome, Firefox, Safari)

### Installation
```bash
# Clone repository
git clone <REPO_URL>
cd mazunte-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
```bash
# .env.local (auto-configured)
VITE_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_CHAIN_ID=43113
VITE_EXPLORER_URL=https://testnet.snowtrace.io
```

## 🧪 Smart Contract Testing

### Automated Testing Suite
```bash
# Install testing dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Run smart contract tests
npx hardhat test

# Generate coverage report
npx hardhat coverage

# Gas usage analysis
npx hardhat test --gas-report
```

### Manual Testing Procedures

#### 1. MetaMask Setup
```javascript
// Add Avalanche Fuji Testnet
Network Name: Avalanche Fuji Testnet
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Chain ID: 43113
Currency Symbol: AVAX
Block Explorer: https://testnet.snowtrace.io/
```

#### 2. Get Test Funds
```bash
# Get test AVAX
curl -X POST --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "avax.sendTokens",
    "params": {
        "address": "YOUR_WALLET_ADDRESS",
        "amount": "10000000000000000000"
    }
}' -H 'content-type:application/json;' https://faucet.avax.network/

# Or visit: https://faucet.avax.network/
```

#### 3. Test Contract Interactions
```javascript
// Navigate to /test route
// Test sequence:
1. Connect wallet ✅
2. Verify network (Fuji) ✅
3. Test village membership ✅
4. Test USDT balance/approval ✅
5. Test property purchase ✅
6. Test payment processing ✅
7. Test rental distribution ✅
```

## 🔐 Smart Contract Security Analysis

### Security Features Implemented

#### ReentrancyGuard
```solidity
// Prevents reentrancy attacks
modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}
```

#### Access Control
```solidity
// Multi-signature admin controls
mapping(address => bool) public admins;
modifier onlyAdmin() {
    require(_isAdmin(msg.sender), "Not authorized admin");
    _;
}
```

#### KYC Verification
```solidity
// ECDSA signature-based KYC
function verifyKYC(address investor, uint256 expiryTime, bytes memory signature) 
    external onlyAdmin {
    bytes32 hash = keccak256(abi.encodePacked(investor, expiryTime));
    address signer = ECDSA.recover(hash, signature);
    require(_isAdmin(signer), "Invalid KYC signature");
    kycExpiry[investor] = expiryTime;
}
```

#### Financial Precision
```solidity
// 18-decimal precision for calculations
uint256 private constant PRECISION = 1e18;
uint256 private constant BPS = 10000; // Basis points

// Compound interest calculation
function calculateMonthlyPayment(uint256 principal) public pure returns (uint256) {
    uint256 monthlyRate = (ANNUAL_RATE_BPS * PRECISION) / (12 * BPS);
    uint256 numerator = principal * monthlyRate;
    uint256 denominator = PRECISION - 
        ((PRECISION * PRECISION) / ((PRECISION + monthlyRate) ** LOAN_TERM_MONTHS));
    return numerator / (denominator / PRECISION);
}
```

### Security Testing Checklist

#### 1. Access Control Tests
- [ ] Only admins can pause contract
- [ ] Only KYC-verified users can purchase
- [ ] Only accredited investors allowed
- [ ] Proper ownership validation

#### 2. Financial Logic Tests
- [ ] Compound interest calculations accurate
- [ ] Payment schedules generated correctly
- [ ] Late fees applied properly
- [ ] Foreclosure conditions enforced

#### 3. Edge Case Testing
- [ ] Zero amount transactions blocked
- [ ] Overflow/underflow protection
- [ ] Invalid signature rejection
- [ ] Expired KYC prevention

#### 4. Integration Tests
- [ ] USDT approval and transfer
- [ ] ERC1155 token minting
- [ ] Event emission verification
- [ ] State consistency checks

## 📊 Contract Interaction Examples

### Property Purchase Flow
```javascript
// 1. Check KYC status
const kycExpiry = await mortgage.kycExpiry(userAddress);
const isKYCValid = kycExpiry > Date.now() / 1000;

// 2. Verify accredited investor
const isAccredited = await mortgage.accreditedInvestors(userAddress);

// 3. Approve USDT spending
const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
await usdtContract.approve(MORTGAGE_ADDRESS, downPaymentAmount);

// 4. Purchase property
const tx = await mortgage.purchaseProperty(downPaymentAmount);
await tx.wait();

// 5. Monitor cooling-off period
const coolingOffEnd = await mortgage.mortgages(userAddress).coolingOffEnd;
```

### Payment Processing
```javascript
// 1. Check payment due
const mortgage = await mortgage.mortgages(userAddress);
const nextPaymentDue = mortgage.nextPaymentDue;

// 2. Calculate payment amount
const monthlyPayment = await mortgage.calculateMonthlyPayment(mortgage.principal);

// 3. Process payment
const tx = await mortgage.makePayment();
await tx.wait();

// 4. Verify payment recorded
const updatedSchedule = await mortgage.getPaymentSchedule(userAddress);
```

### Rental Income Distribution
```javascript
// 1. Admin distributes rental income
const totalRental = ethers.parseUnits("1500", 6); // $1500 USDT
await mortgage.distributeRentalIncome(totalRental);

// 2. Check claimable amount
const claimable = await mortgage.getClaimableRentalIncome(userAddress, periodId);

// 3. Claim rental income
const tx = await mortgage.claimRentalIncome(periodId);
await tx.wait();
```

## 🏗️ Architecture Deep Dive

### Frontend Architecture
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── PropertyCard.tsx # Property display component
│   ├── InvestmentCalculator.tsx
│   └── SmartContractViewer.tsx
├── contexts/            # React contexts
│   └── WalletContext.tsx # Blockchain integration
├── hooks/               # Custom React hooks
│   └── use-mobile.tsx
├── lib/                 # Utility libraries
│   ├── web3-integration.ts # Blockchain interactions
│   ├── contracts.ts     # Contract configurations
│   └── utils.ts         # Helper functions
├── pages/               # Route components
│   ├── InvestorPortal.tsx
│   ├── Portfolio.tsx
│   └── SmartContractTest.tsx
└── contracts/           # Smart contract source
    └── MazunteMortgageV2.sol
```

### Smart Contract Architecture
```
MazunteMortgageV2.sol
├── Inheritance
│   ├── ERC1155          # Fractional ownership tokens
│   ├── Ownable          # Admin controls
│   ├── ReentrancyGuard  # Security protection
│   └── Pausable         # Emergency controls
├── Core Functions
│   ├── purchaseProperty() # Property investment
│   ├── makePayment()     # Monthly payments
│   ├── distributeRentalIncome() # Income distribution
│   └── forecloseMortgage() # Default handling
└── Security Features
    ├── KYC verification
    ├── Accredited investor checks
    ├── Cooling-off period
    └── Multi-signature admin
```

## 🚀 Deployment & Verification

### Contract Deployment
```javascript
// Deploy script example
const MazunteMortgage = await ethers.getContractFactory("MazunteMortgageV2");
const mortgage = await MazunteMortgage.deploy(
    USDT_ADDRESS,           // USDT token
    KYC_PROVIDER_ADDRESS,   // KYC verification
    INSURANCE_ADDRESS,      // Insurance provider
    PROPERTY_MANAGER_ADDRESS // Property management
);

await mortgage.deployed();
console.log("Contract deployed to:", mortgage.address);
```

### Contract Verification
```bash
# Verify on Snowtrace
npx hardhat verify --network fuji CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"

# Example
npx hardhat verify --network fuji 0x1234567890123456789012345678901234567890 \
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" \
  "0x9876543210987654321098765432109876543210"
```

## 📈 Performance Monitoring

### Gas Optimization
```javascript
// Monitor gas usage
const tx = await mortgage.purchaseProperty(amount);
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());

// Batch operations for efficiency
const multicall = await mortgage.multicall([
    mortgage.interface.encodeFunctionData("makePayment"),
    mortgage.interface.encodeFunctionData("claimRentalIncome", [periodId])
]);
```

### Event Monitoring
```javascript
// Listen for contract events
mortgage.on("MortgageCreated", (buyer, amount, mortgageId, event) => {
    console.log("New mortgage:", {
        buyer,
        amount: ethers.formatUnits(amount, 6),
        mortgageId: mortgageId.toString()
    });
});

// Historical event queries
const filter = mortgage.filters.PaymentMade(userAddress);
const events = await mortgage.queryFilter(filter, -1000); // Last 1000 blocks
```

## 🔍 Code Review Checklist

### Smart Contract Review
- [ ] All functions have proper access control
- [ ] Financial calculations use safe math
- [ ] Events emitted for all state changes
- [ ] Error messages are descriptive
- [ ] Gas usage is optimized
- [ ] No unused variables or functions
- [ ] Proper input validation
- [ ] Reentrancy protection in place

### Frontend Code Review
- [ ] TypeScript types are properly defined
- [ ] Error handling for all async operations
- [ ] Loading states for user feedback
- [ ] Proper wallet connection handling
- [ ] Transaction confirmation flows
- [ ] Responsive design implementation
- [ ] Accessibility compliance
- [ ] Performance optimization

## 🛡️ Security Best Practices

### Smart Contract Security
1. **Input Validation**: Validate all external inputs
2. **Access Control**: Implement proper role-based permissions
3. **Safe Math**: Use OpenZeppelin's SafeMath or Solidity 0.8+ overflow protection
4. **Reentrancy**: Use ReentrancyGuard for state-changing functions
5. **Emergency Stops**: Implement pausable functionality
6. **Upgrade Patterns**: Use proxy patterns for upgradability

### Frontend Security
1. **Wallet Validation**: Verify wallet signatures
2. **Input Sanitization**: Sanitize all user inputs
3. **HTTPS Only**: Enforce secure connections
4. **CSP Headers**: Implement Content Security Policy
5. **Error Handling**: Don't expose sensitive information in errors

## 📞 Support & Resources

### Technical Support
- **Documentation**: This guide and inline code comments
- **Testing**: Comprehensive test suite at `/test` route
- **Block Explorer**: https://testnet.snowtrace.io/
- **Faucet**: https://faucet.avax.network/

### Additional Resources
- **Avalanche Docs**: https://docs.avax.network/
- **OpenZeppelin**: https://docs.openzeppelin.com/
- **ethers.js**: https://docs.ethers.org/
- **React Query**: https://tanstack.com/query/

---

*This platform represents institutional-grade blockchain infrastructure with comprehensive security, testing, and documentation for technical due diligence.*