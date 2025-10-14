# Smart Contract API Documentation

## 📋 Contract Overview

**Contract Name**: MazunteMortgageV2  
**Network**: Avalanche Fuji Testnet  
**Standard**: ERC1155 (Fractional Ownership)  
**Security**: OpenZeppelin ReentrancyGuard, Pausable, Ownable  

## 🔗 Contract Addresses

```javascript
// Fuji Testnet Deployment
const CONTRACTS = {
    MAZUNTE_MORTGAGE: "0x1234567890123456789012345678901234567890",
    USDT_TOKEN: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    VILLAGE_CITIZENSHIP: "0x9876543210987654321098765432109876543210"
};

// Network Configuration
const NETWORK = {
    chainId: 43113,
    name: "Avalanche Fuji Testnet",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    explorer: "https://testnet.snowtrace.io"
};
```

## 🏗️ Contract Interface

### Core Functions

#### `purchaseProperty(uint256 downPayment)`
**Description**: Initiates property purchase with mortgage  
**Access**: KYC verified, accredited investors only  
**Parameters**:
- `downPayment`: Amount in USDT (6 decimals)

**Requirements**:
- Valid KYC verification
- Accredited investor status
- USDT approval for spending
- Down payment ≥ minimum required

**Returns**: None  
**Events**: `MortgageCreated`, `CoolingOffStarted`

```javascript
// Usage Example
const downPayment = ethers.parseUnits("30000", 6); // $30,000 USDT
await mortgageContract.purchaseProperty(downPayment);
```

#### `confirmMortgageActivation()`
**Description**: Activates mortgage after cooling-off period  
**Access**: Mortgage holder only  
**Parameters**: None

**Requirements**:
- Cooling-off period completed (72 hours)
- Mortgage not already active
- Valid mortgage exists

**Returns**: None  
**Events**: `MortgageActivated`, `PropertyDeedMinted`

```javascript
// Usage Example
await mortgageContract.confirmMortgageActivation();
```

#### `makePayment()`
**Description**: Process monthly mortgage payment  
**Access**: Active mortgage holders  
**Parameters**: None

**Requirements**:
- Active mortgage
- USDT approval for payment amount
- Not paused

**Returns**: None  
**Events**: `PaymentMade`, `PaymentScheduleUpdated`

```javascript
// Usage Example
const monthlyPayment = await mortgageContract.calculateMonthlyPayment(principal);
await usdtContract.approve(mortgageAddress, monthlyPayment);
await mortgageContract.makePayment();
```

#### `cancelDuringCoolingOff()`
**Description**: Cancel mortgage during 72-hour cooling-off period  
**Access**: Mortgage holder only  
**Parameters**: None

**Requirements**:
- Within cooling-off period
- Mortgage not yet activated

**Returns**: None  
**Events**: `MortgageCancelled`, `RefundProcessed`

```javascript
// Usage Example
await mortgageContract.cancelDuringCoolingOff();
```

### Rental Income Functions

#### `distributeRentalIncome(uint256 totalIncome)`
**Description**: Distribute monthly rental income to token holders  
**Access**: Admin only  
**Parameters**:
- `totalIncome`: Total rental income in USDT

**Requirements**:
- Admin privileges
- Valid income amount
- Active rental period

**Returns**: None  
**Events**: `RentalIncomeDistributed`

```javascript
// Usage Example
const monthlyRent = ethers.parseUnits("1500", 6); // $1,500
await mortgageContract.distributeRentalIncome(monthlyRent);
```

#### `claimRentalIncome(uint256 periodId)`
**Description**: Claim rental income for specific period  
**Access**: Token holders  
**Parameters**:
- `periodId`: Rental period identifier

**Requirements**:
- Own fractional ownership tokens
- Unclaimed income available
- Valid period ID

**Returns**: None  
**Events**: `RentalIncomeClaimed`

```javascript
// Usage Example
const claimable = await mortgageContract.getClaimableRentalIncome(userAddress, periodId);
if (claimable > 0) {
    await mortgageContract.claimRentalIncome(periodId);
}
```

### Administrative Functions

#### `verifyKYC(address investor, uint256 expiryTime, bytes memory signature)`
**Description**: Verify investor KYC with expiry  
**Access**: Admin only  
**Parameters**:
- `investor`: Investor wallet address
- `expiryTime`: Unix timestamp of KYC expiry
- `signature`: ECDSA signature from KYC provider

```javascript
// Usage Example
const kycHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256"], 
        [investorAddress, expiryTime]
    )
);
const signature = await admin.signMessage(ethers.getBytes(kycHash));
await mortgageContract.verifyKYC(investorAddress, expiryTime, signature);
```

#### `verifyAccreditedInvestor(address investor)`
**Description**: Mark investor as accredited  
**Access**: Admin only  
**Parameters**:
- `investor`: Investor wallet address

#### `forecloseMortgage(address borrower)`
**Description**: Foreclose mortgage for non-payment  
**Access**: Admin only  
**Parameters**:
- `borrower`: Address of defaulting borrower

**Requirements**:
- 4+ missed payments
- Grace period expired

#### `emergencyPause(string memory reason)`
**Description**: Emergency pause all contract functions  
**Access**: Admin only  
**Parameters**:
- `reason`: Description of emergency

## 📊 View Functions

#### `getMortgageDetails(address buyer) → MortgageInfo`
**Description**: Get complete mortgage information  
**Returns**:
```solidity
struct MortgageInfo {
    uint256 principal;
    uint256 monthlyPayment;
    uint256 remainingBalance;
    uint256 nextPaymentDue;
    uint256 paymentsRemaining;
    uint256 totalInterestPaid;
    uint256 missedPayments;
    bool isActive;
    bool coolingOffActive;
    bool isForeclosed;
}
```

#### `getPaymentSchedule(address buyer) → PaymentInfo[]`
**Description**: Get detailed payment schedule  
**Returns**: Array of payment information

#### `getPropertyStatus() → PropertyInfo`
**Description**: Get overall property financial status  
**Returns**:
```solidity
struct PropertyInfo {
    uint256 totalInvestment;
    uint256 totalDownPayments;
    uint256 activeMortgages;
    uint256 totalRentalIncome;
    uint256 availableInsurance;
    uint256 currentPeriodId;
}
```

#### `calculateMonthlyPayment(uint256 principal) → uint256`
**Description**: Calculate monthly payment for principal amount  
**Parameters**:
- `principal`: Loan principal in USDT

**Returns**: Monthly payment amount

#### `isPaymentOverdue(address buyer) → bool`
**Description**: Check if payment is overdue  
**Returns**: True if payment is late

#### `getClaimableRentalIncome(address holder, uint256 periodId) → uint256`
**Description**: Get claimable rental income amount  
**Returns**: Claimable USDT amount

## 📝 Events

### Core Events
```solidity
event MortgageCreated(
    address indexed buyer,
    uint256 amount,
    uint256 indexed mortgageId,
    uint256 timestamp
);

event PaymentMade(
    address indexed buyer,
    uint256 amount,
    uint256 remainingBalance,
    uint256 timestamp
);

event MortgageCompleted(
    address indexed buyer,
    uint256 totalPaid,
    uint256 timestamp
);

event MortgageForeclosed(
    address indexed buyer,
    uint256 remainingBalance,
    string reason,
    uint256 timestamp
);
```

### Security Events
```solidity
event KYCVerified(
    address indexed investor,
    uint256 expiryTime,
    uint256 timestamp
);

event AccreditedInvestorVerified(
    address indexed investor,
    uint256 timestamp
);

event EmergencyPaused(
    string reason,
    address admin,
    uint256 timestamp
);
```

### Rental Events
```solidity
event RentalIncomeDistributed(
    uint256 totalAmount,
    uint256 indexed periodId,
    uint256 timestamp
);

event RentalIncomeClaimed(
    address indexed holder,
    uint256 amount,
    uint256 indexed periodId,
    uint256 timestamp
);
```

## 🔒 Security Features

### Access Modifiers
```solidity
modifier onlyKYCVerified() {
    require(kycExpiry[msg.sender] > block.timestamp, "KYC expired or not verified");
    _;
}

modifier onlyAccredited() {
    require(accreditedInvestors[msg.sender], "Not accredited investor");
    _;
}

modifier coolingOffCompleted() {
    require(
        !mortgages[msg.sender].coolingOffActive || 
        block.timestamp >= mortgages[msg.sender].startDate + COOLING_OFF_PERIOD,
        "Cooling-off period active"
    );
    _;
}
```

### Financial Constants
```solidity
// Precision and rates
uint256 private constant PRECISION = 1e18;
uint256 private constant BPS = 10000;
uint256 private constant ANNUAL_RATE_BPS = 850; // 8.5% APR
uint256 private constant LOAN_TERM_MONTHS = 180; // 15 years

// Fees and limits
uint256 private constant LATE_FEE = 50 * 1e6; // $50 USDT
uint256 private constant GRACE_PERIOD = 10 days;
uint256 private constant MAX_MISSED_PAYMENTS = 4;
uint256 private constant COOLING_OFF_PERIOD = 72 hours;
```

## 🧪 Testing Functions

### Test Network Integration
```javascript
// Connect to Fuji testnet
const provider = new ethers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
);

// Contract instance
const mortgage = new ethers.Contract(
    MORTGAGE_ADDRESS,
    MORTGAGE_ABI,
    signer
);

// USDT contract for approvals
const usdt = new ethers.Contract(
    USDT_ADDRESS,
    USDT_ABI,
    signer
);
```

### Sample Test Sequence
```javascript
async function testPropertyPurchase() {
    // 1. Check prerequisites
    const kycExpiry = await mortgage.kycExpiry(userAddress);
    const isAccredited = await mortgage.accreditedInvestors(userAddress);
    const usdtBalance = await usdt.balanceOf(userAddress);
    
    console.log("Prerequisites:", { kycExpiry, isAccredited, usdtBalance });
    
    // 2. Approve USDT spending
    const downPayment = ethers.parseUnits("30000", 6);
    await usdt.approve(MORTGAGE_ADDRESS, downPayment);
    
    // 3. Purchase property
    const tx = await mortgage.purchaseProperty(downPayment);
    const receipt = await tx.wait();
    
    console.log("Purchase successful:", receipt.transactionHash);
    
    // 4. Check mortgage details
    const mortgageDetails = await mortgage.getMortgageDetails(userAddress);
    console.log("Mortgage created:", mortgageDetails);
}
```

## 📈 Gas Optimization

### Estimated Gas Costs
| Function | Estimated Gas | USD Cost* |
|----------|---------------|-----------|
| `purchaseProperty()` | ~150,000 | $0.75 |
| `makePayment()` | ~80,000 | $0.40 |
| `claimRentalIncome()` | ~60,000 | $0.30 |
| `confirmMortgageActivation()` | ~100,000 | $0.50 |

*Based on 25 gwei gas price and $2000 AVAX

### Optimization Techniques
```solidity
// Packed structs for storage efficiency
struct Mortgage {
    uint128 principal;      // Fits in single slot
    uint128 monthlyPayment; // Fits in single slot
    uint64 startDate;       // Efficient timestamp
    uint32 nextPaymentDue;  // Sufficient for dates
    uint16 missedPayments;  // Small counter
    bool isActive;          // Single bit
}

// Batch operations
function multicall(bytes[] calldata data) 
    external returns (bytes[] memory results) {
    results = new bytes[](data.length);
    for (uint256 i = 0; i < data.length; i++) {
        (bool success, bytes memory result) = address(this).delegatecall(data[i]);
        require(success, "Multicall failed");
        results[i] = result;
    }
}
```

## 🔍 Integration Examples

### Complete Purchase Flow
```javascript
async function completePurchaseFlow() {
    try {
        // Step 1: Verify prerequisites
        const canPurchase = await checkPurchaseEligibility(userAddress);
        if (!canPurchase.eligible) {
            throw new Error(canPurchase.reason);
        }
        
        // Step 2: Calculate amounts
        const propertyValue = await mortgage.PROPERTY_VALUE();
        const downPaymentRequired = propertyValue * 20n / 100n; // 20%
        
        // Step 3: Approve USDT
        const approveTx = await usdt.approve(MORTGAGE_ADDRESS, downPaymentRequired);
        await approveTx.wait();
        
        // Step 4: Purchase property
        const purchaseTx = await mortgage.purchaseProperty(downPaymentRequired);
        const receipt = await purchaseTx.wait();
        
        // Step 5: Extract mortgage ID from events
        const mortgageCreatedEvent = receipt.logs.find(
            log => log.topics[0] === mortgage.interface.getEventTopic("MortgageCreated")
        );
        const mortgageId = mortgage.interface.decodeEventLog(
            "MortgageCreated", 
            mortgageCreatedEvent.data, 
            mortgageCreatedEvent.topics
        ).mortgageId;
        
        console.log("Mortgage created successfully:", {
            mortgageId: mortgageId.toString(),
            transactionHash: receipt.hash,
            gasUsed: receipt.gasUsed.toString()
        });
        
        return { success: true, mortgageId, txHash: receipt.hash };
        
    } catch (error) {
        console.error("Purchase failed:", error);
        return { success: false, error: error.message };
    }
}

async function checkPurchaseEligibility(address) {
    const kycExpiry = await mortgage.kycExpiry(address);
    const isAccredited = await mortgage.accreditedInvestors(address);
    const usdtBalance = await usdt.balanceOf(address);
    const requiredAmount = await mortgage.PROPERTY_VALUE() * 20n / 100n;
    
    if (kycExpiry <= Math.floor(Date.now() / 1000)) {
        return { eligible: false, reason: "KYC expired or not verified" };
    }
    
    if (!isAccredited) {
        return { eligible: false, reason: "Not an accredited investor" };
    }
    
    if (usdtBalance < requiredAmount) {
        return { eligible: false, reason: "Insufficient USDT balance" };
    }
    
    return { eligible: true };
}
```

---

*This API documentation provides complete technical specifications for integrating with the Mazunte smart contract system.*