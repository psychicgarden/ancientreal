# Ancient Lending Protocol - Frontend Integration Guide

This guide provides **exact** instructions for integrating the Ancient Lending Protocol contracts into your Lovable frontend.

## 🎯 Critical Requirements

### Contract Addresses (Base Sepolia - Chain ID 84532)

```typescript
const CONTRACTS = {
  AncientMortgage: "0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5",
  AncientStakingPool: "0xac7378799cffd01f38a4e39fb5d91d60a0e62b33",
  MockUSDT: "0x82895d380f6df68d50e34d2ccc94bad1415a2b46",
};
```

### Key Parameters

- **Token**: USDT (6 decimals) - **NOT ETH**
- **Down Payment**: 20% of property price
- **Platform Fee**: 3% of property price
- **APR**: 8% (800 basis points)
- **Term**: 120 months (10 years)
- **Payment Method**: ERC20 `transferFrom` - **NO ETH VALUE**

---

## 📋 Contract Interface

### AncientMortgage.sol - Actual Methods

```solidity
// Purchase a property (returns tokenId)
function purchaseProperty(uint256 propertyPrice) external returns (uint256 tokenId)

// Make a monthly payment
function makePayment(uint256 tokenId) external

// Get mortgage details
function getMortgage(uint256 tokenId) external view returns (
    address propertyOwner,
    uint256 propertyPrice,
    uint256 downPayment,
    uint256 loanAmount,
    uint256 monthlyPayment,
    uint256 remainingBalance,
    uint256 startTime,
    uint256 termMonths,
    uint256 paymentsMade,
    bool isActive
)

// Get appraisal data
function getAppraisal(uint256 tokenId) external view returns (
    uint256 appraisedValue,
    uint256 appreciationAmount,
    uint256 timestamp,
    bool distributed
)

// Owner-only: Appraise a property
function appraiseProperty(uint256 tokenId, uint256 appraisedValue) external

// Owner-only: Distribute appreciation (year 10)
function distributeAppreciation(uint256 tokenId) external
```

### USDT (ERC20) - Required Methods

```solidity
function approve(address spender, uint256 amount) external returns (bool)
function allowance(address owner, address spender) external view returns (uint256)
function balanceOf(address account) external view returns (uint256)
function decimals() external view returns (uint8) // Returns 6
```

---

## 🔧 Step-by-Step Integration

### 1. Setup Contract Instances

```typescript
// contracts.ts
import { ethers } from 'ethers';
import { AncientMortgageABI, MockUSDTABI } from './abis';

const BASE_SEPOLIA_CHAIN_ID = 84532;

const ADDRESSES = {
  AncientMortgage: "0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5",
  MockUSDT: "0x82895d380f6df68d50e34d2ccc94bad1415a2b46",
};

export function getContracts(provider: ethers.Provider, signer?: ethers.Signer) {
  const mortgage = new ethers.Contract(
    ADDRESSES.AncientMortgage,
    AncientMortgageABI,
    signer || provider
  );

  const usdt = new ethers.Contract(
    ADDRESSES.MockUSDT,
    MockUSDTABI,
    signer || provider
  );

  return { mortgage, usdt };
}
```

### 2. Purchase Flow (Complete Example)

```typescript
// mortgage-purchase.ts
import { ethers } from 'ethers';
import { getContracts } from './contracts';
import { parseUSDT, calculateDownPayment, calculatePlatformFee } from './types';

/**
 * Purchase a property using USDT
 * 
 * @param propertyPriceUSD - Property price in USD (e.g., "250000.00")
 * @param signer - Ethers signer from wallet
 * @returns tokenId of the created mortgage NFT
 */
export async function purchaseProperty(
  propertyPriceUSD: string,
  signer: ethers.Signer
): Promise<bigint> {
  const { mortgage, usdt } = getContracts(await signer.provider!, signer);
  
  // 1. Convert USD to USDT amount (6 decimals)
  const propertyPrice = parseUSDT(propertyPriceUSD); // e.g., 250000000000 (250k USDT)
  
  // 2. Calculate required amounts
  const downPayment = calculateDownPayment(propertyPrice);     // 20%
  const platformFee = calculatePlatformFee(propertyPrice);     // 3%
  const totalApproval = downPayment + platformFee;             // 23%
  
  console.log('Purchase breakdown:', {
    propertyPrice: propertyPrice.toString(),
    downPayment: downPayment.toString(),
    platformFee: platformFee.toString(),
    totalApproval: totalApproval.toString(),
  });
  
  // 3. Check USDT balance
  const balance = await usdt.balanceOf(await signer.getAddress());
  if (balance < totalApproval) {
    throw new Error(
      `Insufficient USDT balance. Need ${totalApproval}, have ${balance}`
    );
  }
  
  // 4. Check and set USDT approval
  const currentAllowance = await usdt.allowance(
    await signer.getAddress(),
    await mortgage.getAddress()
  );
  
  if (currentAllowance < totalApproval) {
    console.log('Approving USDT...');
    const approveTx = await usdt.approve(
      await mortgage.getAddress(),
      totalApproval
    );
    await approveTx.wait();
    console.log('USDT approved:', approveTx.hash);
  }
  
  // 5. Purchase property (NO ETH VALUE!)
  console.log('Purchasing property...');
  const purchaseTx = await mortgage.purchaseProperty(propertyPrice);
  const receipt = await purchaseTx.wait();
  
  // 6. Extract tokenId from MortgageCreated event
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = mortgage.interface.parseLog(log);
      return parsed?.name === 'MortgageCreated';
    } catch {
      return false;
    }
  });
  
  if (!event) {
    throw new Error('MortgageCreated event not found');
  }
  
  const parsedEvent = mortgage.interface.parseLog(event);
  const tokenId = parsedEvent!.args.tokenId;
  
  console.log('Property purchased! TokenId:', tokenId.toString());
  return tokenId;
}
```

### 3. Payment Flow (Complete Example)

```typescript
// mortgage-payment.ts
import { ethers } from 'ethers';
import { getContracts } from './contracts';

/**
 * Make a monthly mortgage payment
 * 
 * @param tokenId - Mortgage NFT token ID
 * @param signer - Ethers signer from wallet
 */
export async function makeMonthlyPayment(
  tokenId: bigint,
  signer: ethers.Signer
): Promise<void> {
  const { mortgage, usdt } = getContracts(await signer.provider!, signer);
  
  // 1. Get mortgage details to find payment amount
  const mortgageData = await mortgage.getMortgage(tokenId);
  const monthlyPayment = mortgageData.monthlyPayment;
  
  console.log('Making payment:', {
    tokenId: tokenId.toString(),
    amount: monthlyPayment.toString(),
    remainingBalance: mortgageData.remainingBalance.toString(),
    paymentsMade: mortgageData.paymentsMade.toString(),
  });
  
  // 2. Check USDT balance
  const balance = await usdt.balanceOf(await signer.getAddress());
  if (balance < monthlyPayment) {
    throw new Error(
      `Insufficient USDT balance. Need ${monthlyPayment}, have ${balance}`
    );
  }
  
  // 3. Approve USDT if needed
  const currentAllowance = await usdt.allowance(
    await signer.getAddress(),
    await mortgage.getAddress()
  );
  
  if (currentAllowance < monthlyPayment) {
    console.log('Approving USDT for payment...');
    const approveTx = await usdt.approve(
      await mortgage.getAddress(),
      monthlyPayment
    );
    await approveTx.wait();
  }
  
  // 4. Make payment (NO ETH VALUE!)
  console.log('Submitting payment...');
  const paymentTx = await mortgage.makePayment(tokenId);
  await paymentTx.wait();
  
  console.log('Payment successful:', paymentTx.hash);
}
```

### 4. Read Mortgage Data

```typescript
// mortgage-data.ts
import { ethers } from 'ethers';
import { getContracts } from './contracts';
import { formatUSDT } from './types';

/**
 * Get detailed mortgage information
 */
export async function getMortgageDetails(
  tokenId: bigint,
  provider: ethers.Provider
) {
  const { mortgage } = getContracts(provider);
  
  const data = await mortgage.getMortgage(tokenId);
  
  return {
    propertyOwner: data.propertyOwner,
    propertyPrice: formatUSDT(data.propertyPrice),
    downPayment: formatUSDT(data.downPayment),
    loanAmount: formatUSDT(data.loanAmount),
    monthlyPayment: formatUSDT(data.monthlyPayment),
    remainingBalance: formatUSDT(data.remainingBalance),
    startTime: new Date(Number(data.startTime) * 1000),
    termMonths: Number(data.termMonths),
    paymentsMade: Number(data.paymentsMade),
    paymentsRemaining: Number(data.termMonths) - Number(data.paymentsMade),
    isActive: data.isActive,
    // Calculate progress
    progressPercent: (Number(data.paymentsMade) / Number(data.termMonths)) * 100,
  };
}

/**
 * Get appraisal information (for year 10 appreciation)
 */
export async function getAppraisalDetails(
  tokenId: bigint,
  provider: ethers.Provider
) {
  const { mortgage } = getContracts(provider);
  
  const data = await mortgage.getAppraisal(tokenId);
  
  return {
    appraisedValue: formatUSDT(data.appraisedValue),
    appreciationAmount: formatUSDT(data.appreciationAmount),
    timestamp: data.timestamp > 0n ? new Date(Number(data.timestamp) * 1000) : null,
    distributed: data.distributed,
  };
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ WRONG - Sending ETH value

```typescript
// DON'T DO THIS
await mortgage.purchaseProperty(propertyPrice, { value: ethers.parseEther("1.0") });
await mortgage.makePayment(tokenId, { value: monthlyPaymentWei });
```

### ✅ CORRECT - ERC20 approval flow

```typescript
// DO THIS
await usdt.approve(mortgageAddress, amount);
await mortgage.purchaseProperty(propertyPrice); // No value!
await mortgage.makePayment(tokenId); // No value!
```

### ❌ WRONG - Wrong function signature

```typescript
// DON'T DO THIS - Wrong params
await mortgage.purchaseProperty(propertyId, downPayment, termMonths, apr, signature);
```

### ✅ CORRECT - Single parameter

```typescript
// DO THIS - Only property price
await mortgage.purchaseProperty(propertyPrice);
```

### ❌ WRONG - Using ETH decimals (18)

```typescript
// DON'T DO THIS
const price = ethers.parseEther("250000"); // 18 decimals
```

### ✅ CORRECT - Using USDT decimals (6)

```typescript
// DO THIS
const price = BigInt(250000) * BigInt(10 ** 6); // 6 decimals
// Or use the helper
const price = parseUSDT("250000.00");
```

---

## 📊 UI Display Calculations

```typescript
// mortgage-ui-helpers.ts

/**
 * Calculate UI display values for a property purchase
 */
export function calculatePurchaseBreakdown(propertyPriceUSD: string) {
  const propertyPrice = parseUSDT(propertyPriceUSD);
  const downPayment = calculateDownPayment(propertyPrice);
  const platformFee = calculatePlatformFee(propertyPrice);
  const loanAmount = calculateLoanAmount(propertyPrice);
  
  // Monthly payment calculation (contract does this automatically)
  // APR = 8%, Term = 120 months
  const apr = 0.08;
  const termMonths = 120;
  const monthlyRate = apr / 12;
  const monthlyPaymentCalc = Number(loanAmount) * 
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return {
    propertyPrice: formatUSDT(propertyPrice),
    downPayment: formatUSDT(downPayment),
    downPaymentPercent: '20%',
    platformFee: formatUSDT(platformFee),
    platformFeePercent: '3%',
    loanAmount: formatUSDT(loanAmount),
    estimatedMonthlyPayment: (monthlyPaymentCalc / 10**6).toFixed(2),
    termMonths: 120,
    termYears: 10,
    apr: '8%',
    totalNeededForPurchase: formatUSDT(downPayment + platformFee),
  };
}
```

---

## 🔐 Database Integration (Supabase)

### Store contract addresses in Supabase

```sql
-- contract_addresses table
CREATE TABLE contract_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_name TEXT NOT NULL,
  network TEXT NOT NULL,
  address TEXT NOT NULL,
  deployment_status TEXT DEFAULT 'deployed',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contract_name, network)
);

-- Insert Base Sepolia addresses
INSERT INTO contract_addresses (contract_name, network, address) VALUES
  ('AncientMortgage', 'base-sepolia', '0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5'),
  ('AncientStakingPool', 'base-sepolia', '0xac7378799cffd01f38a4e39fb5d91d60a0e62b33'),
  ('MockUSDT', 'base-sepolia', '0x82895d380f6df68d50e34d2ccc94bad1415a2b46');
```

### Fetch addresses from DB

```typescript
// contract-database-integration.ts
import { supabase } from './supabase';

export async function getContractAddress(
  contractName: string,
  network: string = 'base-sepolia'
): Promise<string> {
  const { data, error } = await supabase
    .from('contract_addresses')
    .select('address')
    .eq('contract_name', contractName)
    .eq('network', network)
    .eq('deployment_status', 'deployed')
    .maybeSingle();
  
  if (error) throw error;
  if (!data) {
    throw new Error(
      `Contract ${contractName} not found on ${network}. ` +
      `Please add it to the database.`
    );
  }
  
  return data.address;
}

// Usage
const mortgageAddress = await getContractAddress('AncientMortgage', 'base-sepolia');
// No fallbacks! Fail loudly if not found.
```

### Store user mortgages

```sql
-- user_mortgages table
CREATE TABLE user_mortgages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  token_id BIGINT NOT NULL,
  property_price NUMERIC,
  contract_address TEXT,
  network TEXT DEFAULT 'base-sepolia',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(token_id, contract_address, network)
);
```

---

## 🧪 Testing Checklist

Before deploying to production, verify:

- [ ] Contract address loaded from DB (no fallback to MAZUNTE_MORTGAGE)
- [ ] Correct ABI imported (AncientMortgageABI)
- [ ] USDT approval flow working
- [ ] Purchase calls `purchaseProperty(propertyPrice)` with 1 param
- [ ] Payment calls `makePayment(tokenId)` with 1 param
- [ ] No ETH value sent in any transaction
- [ ] TokenId properly stored and retrieved
- [ ] getMortgage(tokenId) returns correct data
- [ ] UI displays USDT amounts with 6 decimals
- [ ] Balances and allowances checked before transactions

---

## 📚 Complete Example Component

See `integration/example-mortgage-component.tsx` for a full React component implementing all flows.

---

## 🆘 Troubleshooting

### "execution reverted (require(false))"

**Cause**: ABI mismatch or wrong parameters

**Fix**: Ensure you're using AncientMortgageABI and calling `purchaseProperty(propertyPrice)` with exactly 1 parameter

### "insufficient allowance"

**Cause**: USDT not approved or approval too low

**Fix**: Call `usdt.approve(mortgageAddress, amount)` before purchase/payment

### "Contract address not found"

**Cause**: Missing Supabase record

**Fix**: Insert the contract address into `contract_addresses` table

### Transactions fail silently

**Cause**: Wrong network or wrong token

**Fix**: Verify you're on Base Sepolia (84532) and using USDT, not ETH

---

## 📞 Support

For issues with:
- Smart contracts: Check this repo's GitHub issues
- Frontend integration: Use this guide and the example code
- Supabase setup: Ensure contract_addresses table exists with correct data


