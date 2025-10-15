# Ancient Lending Protocol - Frontend Integration Package

This directory contains everything you need to integrate the Ancient Lending Protocol into your frontend application (Lovable, Next.js, React, etc.).

## 📁 Files Overview

### Core Files

- **`INTEGRATION_GUIDE.md`** - Complete step-by-step integration guide with code examples
- **`abis.ts`** - TypeScript exports for contract ABIs
- **`types.ts`** - TypeScript type definitions and helper functions
- **`example-mortgage-component.tsx`** - Full React component example

### ABI Files (Auto-generated)

Located in `../abis/`:
- `AncientMortgage_ABI.json` - Mortgage contract ABI
- `AncientStakingPool_ABI.json` - Staking pool contract ABI
- `MockUSDT_ABI.json` - USDT token contract ABI

### Contract Addresses

Located in `../addresses.ts`:
- Base Sepolia deployment addresses
- Avalanche Fuji deployment addresses
- Helper functions for multi-chain support

## 🚀 Quick Start

### 1. Copy Files to Your Project

```bash
# Copy the integration files to your frontend project
cp -r integration/* your-frontend-project/src/lib/ancient-protocol/
cp abis/* your-frontend-project/src/lib/ancient-protocol/abis/
cp addresses.ts your-frontend-project/src/lib/ancient-protocol/
```

### 2. Install Dependencies

```bash
npm install ethers
# or
yarn add ethers
```

### 3. Import and Use

```typescript
import { purchaseProperty, makeMonthlyPayment } from './lib/ancient-protocol/mortgage-purchase';
import { deployments, ChainId } from './lib/ancient-protocol/addresses';

// Get contract addresses
const contracts = deployments[ChainId.BASE_SEPOLIA];

// Purchase a property
const tokenId = await purchaseProperty("250000.00", signer);

// Make a payment
await makeMonthlyPayment(tokenId, signer);
```

## 📖 Documentation

### For Lovable Integration

1. Read `INTEGRATION_GUIDE.md` sections:
   - "Step-by-Step Integration"
   - "Common Mistakes to Avoid"
   - "Database Integration (Supabase)"

2. Update your existing components:
   - Replace any MAZUNTE_MORTGAGE references with AncientMortgage
   - Remove ETH value from all transactions
   - Implement USDT approval flow
   - Use correct function signatures (1 parameter for purchaseProperty)

3. Reference `example-mortgage-component.tsx` for implementation patterns

### Key Differences from Legacy Code

| Legacy (WRONG) | Ancient Protocol (CORRECT) |
|----------------|---------------------------|
| `purchaseProperty(propertyId, downPayment, term, apr, sig)` | `purchaseProperty(propertyPrice)` |
| `{ value: ethers.parseEther("1.0") }` | No value parameter (ERC20 approval) |
| 18 decimals (ETH) | 6 decimals (USDT) |
| `getMortgageDetails(address)` | `getMortgage(tokenId)` |
| Silent fallback to wrong address | Hard fail if address missing |

## 🔧 Contract Functions Reference

### AncientMortgage

```typescript
// Purchase a property
purchaseProperty(propertyPrice: bigint) → tokenId: bigint

// Make a monthly payment  
makePayment(tokenId: bigint) → void

// Get mortgage details
getMortgage(tokenId: bigint) → Mortgage

// Get appraisal data
getAppraisal(tokenId: bigint) → Appraisal
```

### MockUSDT (ERC20)

```typescript
// Approve spending
approve(spender: address, amount: bigint) → bool

// Check allowance
allowance(owner: address, spender: address) → bigint

// Check balance
balanceOf(account: address) → bigint
```

## 🎯 Integration Checklist

- [ ] Copy all integration files to your project
- [ ] Install ethers.js
- [ ] Update Supabase with contract addresses
- [ ] Remove all MAZUNTE_MORTGAGE references
- [ ] Replace ETH value transactions with USDT approvals
- [ ] Use correct function signatures (1 param)
- [ ] Update ABI imports
- [ ] Test on Base Sepolia testnet
- [ ] Verify tokenId is stored after purchase
- [ ] Test monthly payment flow

## 🧪 Testing

### Get Test USDT

```typescript
// If you're the deployer, MockUSDT has a mint function
const usdt = new ethers.Contract(usdtAddress, MockUSDTABI, signer);
await usdt.mint(yourAddress, parseUSDT("1000000")); // Mint 1M USDT
```

### Test Purchase Flow

1. Ensure you're on Base Sepolia (Chain ID: 84532)
2. Check USDT balance
3. Click "Purchase Property"
4. Approve USDT transaction
5. Confirm purchase transaction
6. Verify tokenId is returned
7. Check mortgage data with `getMortgage(tokenId)`

### Test Payment Flow

1. Load existing mortgage by tokenId
2. Click "Make Monthly Payment"
3. Approve USDT if needed
4. Confirm payment transaction
5. Verify `paymentsMade` increased
6. Verify `remainingBalance` decreased

## 🐛 Common Issues

### Issue: "execution reverted (require(false))"

**Solution**: You're using the wrong ABI or parameters. Use `AncientMortgageABI` and call `purchaseProperty(propertyPrice)` with exactly 1 parameter.

### Issue: "insufficient allowance"

**Solution**: Call `usdt.approve()` before purchase/payment.

### Issue: "Contract address not found"

**Solution**: Add the address to your Supabase `contract_addresses` table or use the hardcoded addresses from `addresses.ts`.

### Issue: Transaction shows 0 ETH but fails

**Solution**: You're probably sending a value parameter. Remove `{ value: ... }` from the transaction.

## 📞 Support

- **Smart Contract Issues**: Check the main repo README
- **Frontend Integration**: See `INTEGRATION_GUIDE.md`
- **Type Errors**: See `types.ts` for all type definitions

## 🔗 Deployed Contracts

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **MockUSDT**: `0x82895d380f6df68d50e34d2ccc94bad1415a2b46`
- **AncientStakingPool**: `0xac7378799cffd01f38a4e39fb5d91d60a0e62b33`
- **AncientMortgage**: `0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5`

### Avalanche Fuji (Testnet)
- **Chain ID**: 43113
- **MockUSDT**: `0x5b510bD0179191Edda8b8B7E3c3a260689264aDD`
- **AncientStakingPool**: `0xd9EFCc0d6fc50Fc0371C3f69C8D083B915AE15C1`
- **AncientMortgage**: `0x2A8979EB5F05dDE08918C1E624aa8217dEE516e0`

## 📄 License

MIT License - See main repo for details

