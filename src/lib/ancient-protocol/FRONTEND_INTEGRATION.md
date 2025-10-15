# Frontend Integration - Ancient Lending Protocol

## 🎯 Overview

This repository provides complete frontend integration support for the Ancient Lending Protocol. All necessary files, ABIs, types, and documentation are in the `/integration` directory.

## 📦 What's Included

### 📁 `/integration` Directory

Contains everything you need to integrate with Lovable or any React/TypeScript frontend:

1. **`README.md`** - Overview and quick start guide
2. **`INTEGRATION_GUIDE.md`** - Complete step-by-step integration with code examples
3. **`QUICK_REFERENCE.md`** - Cheat sheet for common operations
4. **`abis.ts`** - TypeScript ABI exports
5. **`types.ts`** - Type definitions and helper functions
6. **`example-mortgage-component.tsx`** - Full React component example

### 📁 `/abis` Directory

Auto-generated ABI files:
- `AncientMortgage_ABI.json`
- `AncientStakingPool_ABI.json`
- `MockUSDT_ABI.json`

### 📄 Root Files

- **`addresses.ts`** - Contract addresses for all networks with helper functions
- **`FRONTEND_INTEGRATION.md`** - This file

## 🚀 Quick Start for Lovable

### Step 1: Copy Integration Files

Copy the entire `/integration` directory and `/abis` directory to your Lovable project:

```bash
# In your Lovable project
mkdir -p src/lib/ancient-protocol
cp -r /path/to/ancient-sc/integration/* src/lib/ancient-protocol/
cp -r /path/to/ancient-sc/abis src/lib/ancient-protocol/
cp /path/to/ancient-sc/addresses.ts src/lib/ancient-protocol/
```

### Step 2: Install Dependencies

```bash
npm install ethers
```

### Step 3: Fix Your Existing Code

The audit in your message identified these issues in your Lovable code. Here's how to fix them:

#### ❌ Issue 1: Wrong Contract Address (Fallback to MAZUNTE_MORTGAGE)

**Current Code (src/components/EnhancedMortgageSystem.tsx):**
```typescript
// WRONG - Falls back to wrong contract
const address = await getContractAddress('ENHANCED_BASE_MORTGAGE') 
  || await getContractAddress('AncientMortgage') 
  || APP_CONTRACTS.MAZUNTE_MORTGAGE;
```

**Fixed Code:**
```typescript
// CORRECT - Fail loudly if not found
import { deployments, ChainId } from '@/lib/ancient-protocol/addresses';

const address = deployments[ChainId.BASE_SEPOLIA].AncientMortgage;
if (!address) {
  throw new Error('AncientMortgage not deployed on Base Sepolia');
}
```

#### ❌ Issue 2: Wrong ABI and Function Signature

**Current Code:**
```typescript
// WRONG - Wrong ABI and wrong params
import ANCIENT_MORTGAGE_ABI from './wrong-abi';
await mortgage.purchaseProperty(propertyId, downPaymentUSDC, termMonths, aprBps, signature);
```

**Fixed Code:**
```typescript
// CORRECT - Use correct ABI and single parameter
import { AncientMortgageABI } from '@/lib/ancient-protocol/abis';

const mortgage = new ethers.Contract(address, AncientMortgageABI, signer);
await mortgage.purchaseProperty(propertyPrice); // Single parameter!
```

#### ❌ Issue 3: Sending ETH Instead of Using USDT

**Current Code:**
```typescript
// WRONG - Sending ETH value
await mortgage.purchaseProperty(..., { value: platformFee });
await mortgage.makePayment(..., { value: monthlyPaymentWei });
```

**Fixed Code:**
```typescript
// CORRECT - USDT approval flow
import { MockUSDTABI } from '@/lib/ancient-protocol/abis';
import { parseUSDT, calculateTotalApproval } from '@/lib/ancient-protocol/types';

const usdt = new ethers.Contract(usdtAddress, MockUSDTABI, signer);
const propertyPrice = parseUSDT("250000.00");
const totalApproval = calculateTotalApproval(propertyPrice);

// Approve USDT first
await usdt.approve(mortgageAddress, totalApproval);

// Then purchase (NO ETH VALUE!)
await mortgage.purchaseProperty(propertyPrice);
```

#### ❌ Issue 4: Wrong Read Functions

**Current Code:**
```typescript
// WRONG - These functions don't exist
await mortgage.getTotalProperties();
await mortgage.getProperty(propertyId);
await mortgage.getMortgageDetails(userAddress);
```

**Fixed Code:**
```typescript
// CORRECT - Use tokenId-based functions
const mortgageData = await mortgage.getMortgage(tokenId);
const appraisalData = await mortgage.getAppraisal(tokenId);
```

### Step 4: Update Supabase

Add contract addresses to your Supabase database:

```sql
-- In your Supabase SQL editor
CREATE TABLE IF NOT EXISTS contract_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_name TEXT NOT NULL,
  network TEXT NOT NULL,
  address TEXT NOT NULL,
  deployment_status TEXT DEFAULT 'deployed',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contract_name, network)
);

INSERT INTO contract_addresses (contract_name, network, address) VALUES
  ('AncientMortgage', 'base-sepolia', '0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5'),
  ('AncientStakingPool', 'base-sepolia', '0xac7378799cffd01f38a4e39fb5d91d60a0e62b33'),
  ('MockUSDT', 'base-sepolia', '0x82895d380f6df68d50e34d2ccc94bad1415a2b46')
ON CONFLICT (contract_name, network) DO UPDATE 
  SET address = EXCLUDED.address;
```

### Step 5: Reference the Example Component

See `/integration/example-mortgage-component.tsx` for a complete working example that:
- ✅ Uses correct contract addresses
- ✅ Uses correct ABIs
- ✅ Implements USDT approval flow
- ✅ Uses correct function signatures
- ✅ Tracks tokenId properly
- ✅ Displays USDT amounts correctly

## 📚 Documentation

### For First-Time Integration
Start with: `/integration/INTEGRATION_GUIDE.md`

### For Quick Lookup
Use: `/integration/QUICK_REFERENCE.md`

### For Copy-Paste Code
See: `/integration/example-mortgage-component.tsx`

## 🔑 Key Differences from Your Current Code

| Your Current Code | Correct Implementation |
|-------------------|----------------------|
| Falls back to MAZUNTE_MORTGAGE | Use hardcoded addresses from `addresses.ts` |
| Uses 5-parameter `purchaseProperty()` | Use 1-parameter `purchaseProperty(propertyPrice)` |
| Sends ETH with `{ value: ... }` | Use USDT `approve()` + `transferFrom()` |
| Uses 18 decimals (ETH) | Use 6 decimals (USDT) |
| Calls `getMortgageDetails(address)` | Call `getMortgage(tokenId)` |
| No tokenId tracking | Must save and use tokenId |

## 🎯 Critical Requirements

### Contract Addresses (Base Sepolia)
```typescript
AncientMortgage: "0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5"
MockUSDT: "0x82895d380f6df68d50e34d2ccc94bad1415a2b46"
```

### Platform Parameters
```typescript
DOWN_PAYMENT: 20%
PLATFORM_FEE: 3%
APR: 8%
TERM: 120 months
USDT_DECIMALS: 6  // NOT 18!
```

### Required Flow
```typescript
1. Calculate amounts (20% + 3% = 23% of property price)
2. Approve USDT for total amount
3. Call purchaseProperty(propertyPrice) // NO ETH VALUE
4. Extract tokenId from MortgageCreated event
5. Save tokenId to database
6. For payments: approve USDT, call makePayment(tokenId) // NO ETH VALUE
```

## 🧪 Testing

### Get Test USDT
Your deployer address already has 10M USDT on both networks. To give USDT to test users:

```typescript
// Only works if you're the owner
const usdt = new ethers.Contract(usdtAddress, MockUSDTABI, deployerSigner);
await usdt.transfer(testUserAddress, parseUSDT("100000.00"));
```

### Test Purchase
1. Connect to Base Sepolia (Chain ID: 84532)
2. Ensure user has USDT balance
3. Call purchase flow
4. Verify tokenId is returned and saved
5. Check mortgage data with `getMortgage(tokenId)`

### Test Payment
1. Load mortgage by tokenId
2. Approve USDT
3. Call `makePayment(tokenId)`
4. Verify `paymentsMade` increased

## 🐛 Debugging

If you see **"execution reverted (require(false))"**:
1. Check you're using `AncientMortgageABI` (not MAZUNTE_MORTGAGE ABI)
2. Check you're calling `purchaseProperty(propertyPrice)` with 1 parameter
3. Check you approved USDT before calling
4. Check you're NOT sending ETH value
5. Check you're on Base Sepolia (84532)

## 📞 Support Resources

1. **Integration Guide**: `/integration/INTEGRATION_GUIDE.md`
2. **Quick Reference**: `/integration/QUICK_REFERENCE.md`
3. **Example Component**: `/integration/example-mortgage-component.tsx`
4. **Type Definitions**: `/integration/types.ts`
5. **Deployed Contracts**: `/addresses.ts`

## ✅ Acceptance Criteria

Your integration is correct when:
- [x] No fallbacks to MAZUNTE_MORTGAGE
- [x] Using `AncientMortgageABI` from `/integration/abis.ts`
- [x] Calling `purchaseProperty(propertyPrice)` with 1 parameter
- [x] Using USDT approval flow (no ETH value sent)
- [x] Using 6 decimals for USDT amounts
- [x] Tracking and using tokenId for all operations
- [x] Reading data with `getMortgage(tokenId)`
- [x] Purchase and payment transactions succeed on Base Sepolia

## 🎉 Success!

Once you've made these changes, your Lovable UI should correctly:
1. Purchase properties using USDT (not ETH)
2. Calculate accurate breakdown (20% down, 3% fee, 8% APR, 120 months)
3. Make monthly payments using USDT
4. Route interest to the staking pool
5. Handle year-10 appreciation distribution

All the code examples and types you need are in the `/integration` directory. Copy them to your Lovable project and follow the integration guide!

